// ニッポンメイカーズ — メインアプリ
// 依存: data.js / data2.js / data3.js (COMPANIES, PREFECTURES, CATEGORIES, I18N)
//       excluded.js (window.ExclusionCheck)
//       ogp.js (window.OgpFetcher)

const PAGE_SIZE = 30;
const LS_USER    = "nm_user_companies_v1";
const LS_FAV     = "nm_favs_v1";
const LS_LANG    = "nm_lang_v1";
const LS_DELETED = "nm_deleted_v1";
const LS_IMAGES      = "nm_custom_images_v1";
const LS_AUTO_IMAGES = "nm_auto_images_v1";

const state = {
  lang: localStorage.getItem(LS_LANG) || "ja",
  favorites: new Set(JSON.parse(localStorage.getItem(LS_FAV) || "[]")),
  userCompanies: JSON.parse(localStorage.getItem(LS_USER) || "[]"),
  deletedIds: new Set(JSON.parse(localStorage.getItem(LS_DELETED) || "[]")),
  customImages: JSON.parse(localStorage.getItem(LS_IMAGES) || "{}"),
  autoImages:   JSON.parse(localStorage.getItem(LS_AUTO_IMAGES) || "{}"),
  filters: {
    search: "",
    region: "",
    prefecture: "",
    category: "",
    favOnly: false,
    userOnly: false,
  },
  visibleCount: PAGE_SIZE,
  filtered: [],
  addModal: {
    photos: [],
    fetchData: null,
  },
  imgModalId: null,
};

function saveDeleted() {
  localStorage.setItem(LS_DELETED, JSON.stringify([...state.deletedIds]));
}
function saveCustomImages() {
  localStorage.setItem(LS_IMAGES, JSON.stringify(state.customImages));
}
function saveAutoImages() {
  localStorage.setItem(LS_AUTO_IMAGES, JSON.stringify(state.autoImages));
}
function getCompanyPhotos(c) {
  const custom  = state.customImages[c.i] || [];
  const ai      = state.autoImages[c.i];
  const auto    = (ai && ai !== "none" && ai !== "loading") ? [ai] : [];
  const builtin = c.photos || (c.photo ? [c.photo] : []);
  const seen = new Set();
  return [...custom, ...auto, ...builtin].filter(u => { if (seen.has(u)) return false; seen.add(u); return true; });
}
function addCustomImage(id, src) {
  if (!state.customImages[id]) state.customImages[id] = [];
  state.customImages[id].unshift(src);
  saveCustomImages();
}
function removeCustomImage(id, idx) {
  if (!state.customImages[id]) return;
  state.customImages[id].splice(idx, 1);
  if (!state.customImages[id].length) delete state.customImages[id];
  saveCustomImages();
}
function deleteCompany(id) {
  const company = allCompaniesRaw().find(c => c.i === id);
  if (!company) return false;
  if (company.userAdded) {
    // ユーザー追加分: 配列から物理削除
    state.userCompanies = state.userCompanies.filter(c => c.i !== id);
    localStorage.setItem(LS_USER, JSON.stringify(state.userCompanies));
  } else {
    // 組み込み企業: 削除IDリストに追加（論理削除）
    state.deletedIds.add(id);
    saveDeleted();
  }
  // お気に入りも除外
  if (state.favorites.has(id)) {
    state.favorites.delete(id);
    localStorage.setItem(LS_FAV, JSON.stringify([...state.favorites]));
  }
  return true;
}
function restoreCompany(id) {
  if (state.deletedIds.has(id)) {
    state.deletedIds.delete(id);
    saveDeleted();
    return true;
  }
  return false;
}

const el = {
  cards: document.getElementById("cards"),
  empty: document.getElementById("empty"),
  count: document.getElementById("result-count"),
  totalCount: document.getElementById("total-count"),
  search: document.getElementById("search"),
  region: document.getElementById("region-filter"),
  prefecture: document.getElementById("prefecture-filter"),
  category: document.getElementById("category-filter"),
  favOnly: document.getElementById("fav-only"),
  userOnly: document.getElementById("user-only"),
  reset: document.getElementById("reset-btn"),
  modal: document.getElementById("modal"),
  modalBody: document.getElementById("modal-body"),
  modalClose: document.getElementById("modal-close"),
  langJa: document.getElementById("lang-ja"),
  langEn: document.getElementById("lang-en"),
  loadMore: document.getElementById("load-more"),
  addBtn: document.getElementById("add-btn"),
  addModal: document.getElementById("add-modal"),
  addModalClose: document.getElementById("add-modal-close"),
  addUrl: document.getElementById("add-url"),
  addFetchBtn: document.getElementById("add-fetch-btn"),
  addFetchStatus: document.getElementById("add-fetch-status"),
  addWarning: document.getElementById("add-warning"),
  addNameJa: document.getElementById("add-name-ja"),
  addNameEn: document.getElementById("add-name-en"),
  addPref: document.getElementById("add-pref"),
  addCat: document.getElementById("add-cat"),
  addDesc: document.getElementById("add-desc"),
  addPhoto: document.getElementById("add-photo"),
  addPhotoPreview: document.getElementById("add-photo-preview"),
  addEmployees: document.getElementById("add-employees"),
  addCapital: document.getElementById("add-capital"),
  addCancelBtn: document.getElementById("add-cancel-btn"),
  addSaveBtn: document.getElementById("add-save-btn"),
};

// ===== 言語切替 =====
function applyLanguage() {
  const dict = I18N[state.lang];
  document.documentElement.lang = state.lang;

  document.querySelectorAll("[data-i18n]").forEach((node) => {
    const key = node.getAttribute("data-i18n");
    if (dict[key]) node.textContent = dict[key];
  });
  document.querySelectorAll("[data-i18n-placeholder]").forEach((node) => {
    const key = node.getAttribute("data-i18n-placeholder");
    if (dict[key]) node.setAttribute("placeholder", dict[key]);
  });

  el.langJa.classList.toggle("active", state.lang === "ja");
  el.langEn.classList.toggle("active", state.lang === "en");

  populatePrefectureFilter();
  populateCategoryFilter();
  populateAddModalSelects();
  if (typeof updateDeletedBtn === "function") updateDeletedBtn();
  localStorage.setItem(LS_LANG, state.lang);
  render();
}

function populatePrefectureFilter() {
  const dict = I18N[state.lang];
  const selectedRegion = state.filters.region;
  const selectedPref = state.filters.prefecture;

  el.prefecture.innerHTML = "";
  const allOpt = document.createElement("option");
  allOpt.value = "";
  allOpt.textContent = dict.allPrefectures;
  el.prefecture.appendChild(allOpt);

  Object.entries(PREFECTURES).forEach(([code, info]) => {
    if (selectedRegion && info.region !== selectedRegion) return;
    const opt = document.createElement("option");
    opt.value = code;
    opt.textContent = `${info.ja} / ${info.en}`;
    if (code === selectedPref) opt.selected = true;
    el.prefecture.appendChild(opt);
  });
}

function populateCategoryFilter() {
  const dict = I18N[state.lang];
  const selectedCat = state.filters.category;
  el.category.innerHTML = "";
  const allOpt = document.createElement("option");
  allOpt.value = "";
  allOpt.textContent = dict.allCategories;
  el.category.appendChild(allOpt);
  Object.entries(CATEGORIES).forEach(([code, info]) => {
    const opt = document.createElement("option");
    opt.value = code;
    opt.textContent = `${info.emoji} ${info[state.lang]}`;
    if (code === selectedCat) opt.selected = true;
    el.category.appendChild(opt);
  });
}

function populateAddModalSelects() {
  el.addPref.innerHTML = "";
  Object.entries(PREFECTURES).forEach(([code, info]) => {
    const opt = document.createElement("option");
    opt.value = code;
    opt.textContent = `${info.ja} / ${info.en}`;
    el.addPref.appendChild(opt);
  });
  el.addCat.innerHTML = "";
  Object.entries(CATEGORIES).forEach(([code, info]) => {
    const opt = document.createElement("option");
    opt.value = code;
    opt.textContent = `${info.emoji} ${info[state.lang]}`;
    el.addCat.appendChild(opt);
  });
}

el.langJa.addEventListener("click", () => { state.lang = "ja"; applyLanguage(); });
el.langEn.addEventListener("click", () => { state.lang = "en"; applyLanguage(); });

// ===== フィルター =====
el.search.addEventListener("input", (e) => {
  state.filters.search = e.target.value.toLowerCase().trim();
  state.visibleCount = PAGE_SIZE;
  render();
});
el.region.addEventListener("change", (e) => {
  state.filters.region = e.target.value;
  state.filters.prefecture = "";
  populatePrefectureFilter();
  state.visibleCount = PAGE_SIZE;
  render();
});
el.prefecture.addEventListener("change", (e) => {
  state.filters.prefecture = e.target.value;
  state.visibleCount = PAGE_SIZE;
  render();
});
el.category.addEventListener("change", (e) => {
  state.filters.category = e.target.value;
  state.visibleCount = PAGE_SIZE;
  render();
});
el.favOnly.addEventListener("change", (e) => {
  state.filters.favOnly = e.target.checked;
  state.visibleCount = PAGE_SIZE;
  render();
});
el.userOnly.addEventListener("change", (e) => {
  state.filters.userOnly = e.target.checked;
  state.visibleCount = PAGE_SIZE;
  render();
});

el.reset.addEventListener("click", () => {
  state.filters = { search: "", region: "", prefecture: "", category: "", favOnly: false, userOnly: false };
  el.search.value = "";
  el.region.value = "";
  el.prefecture.value = "";
  el.category.value = "";
  el.favOnly.checked = false;
  el.userOnly.checked = false;
  state.visibleCount = PAGE_SIZE;
  populatePrefectureFilter();
  render();
});

el.loadMore.addEventListener("click", () => {
  state.visibleCount += PAGE_SIZE;
  render(true);
});

// ===== お気に入り =====
function toggleFavorite(id) {
  if (state.favorites.has(id)) state.favorites.delete(id);
  else state.favorites.add(id);
  localStorage.setItem(LS_FAV, JSON.stringify([...state.favorites]));
  render(true);
}

// ===== 全企業（組み込み + ユーザー追加 - 削除済み） =====
function allCompaniesRaw() {
  return COMPANIES.concat(state.userCompanies);
}
function allCompanies() {
  return allCompaniesRaw().filter(c => !state.deletedIds.has(c.i));
}

// ===== フィルタリング =====
function filterCompanies() {
  const all = allCompanies();
  return all.filter((c) => {
    const f = state.filters;
    const prefInfo = PREFECTURES[c.pref];
    if (!prefInfo) return false;
    if (f.region && prefInfo.region !== f.region) return false;
    if (f.prefecture && c.pref !== f.prefecture) return false;
    if (f.category && c.cat !== f.category) return false;
    if (f.favOnly && !state.favorites.has(c.i)) return false;
    if (f.userOnly && !c.userAdded) return false;

    if (f.search) {
      const catInfo = CATEGORIES[c.cat];
      const haystack = [
        c.ja, c.en, c.desc_ja || "", c.desc_en || "",
        prefInfo.ja, prefInfo.en,
        catInfo?.ja || "", catInfo?.en || "",
      ].join(" ").toLowerCase();
      if (!haystack.includes(f.search)) return false;
    }
    return true;
  });
}

// ===== カード生成 =====
function getName(c)   { return state.lang === "ja" ? c.ja : (c.en || c.ja); }
function getDesc(c)   { return state.lang === "ja" ? (c.desc_ja || "") : (c.desc_en || c.desc_ja || ""); }
function categoryLabel(cat) { return CATEGORIES[cat] ? CATEGORIES[cat][state.lang] : cat; }
function categoryEmoji(cat) { return CATEGORIES[cat]?.emoji || "🏭"; }

// 公式サイトURL（既知URLがあれば使用、なければGoogle検索フォールバック）
function getWebsiteUrl(c) {
  if (c.url) return { url: c.url, isSearch: false };
  const prefJa = PREFECTURES[c.pref]?.ja || "";
  const q = encodeURIComponent(`${c.ja} ${prefJa} 公式サイト`);
  return { url: `https://www.google.com/search?q=${q}`, isSearch: true };
}
// URLからドメイン部分を抽出（カード上の小さな表示用）
function shortDomain(url) {
  try {
    const u = new URL(url);
    return u.hostname.replace(/^www\./, "");
  } catch (e) { return ""; }
}

function createCard(c) {
  const isFav = state.favorites.has(c.i);
  const prefInfo = PREFECTURES[c.pref];
  const emoji = categoryEmoji(c.cat);
  const photos = getCompanyPhotos(c);
  const photo = photos[0] || null;
  const site = getWebsiteUrl(c);
  const siteLabel = site.isSearch
    ? (state.lang === "ja" ? "🔎 公式サイトを検索" : "🔎 Find website")
    : `🌐 ${shortDomain(site.url)}`;

  const card = document.createElement("article");
  card.className = "card";
  card.dataset.companyId = c.i;
  card.innerHTML = `
    <div class="card-image" data-emoji="${emoji}">
      <span class="card-emoji">${emoji}</span>
      ${photo ? `<img class="card-img" loading="lazy" alt="${escapeHtml(getName(c))}" src="${escapeAttr(photo)}" />` : ""}
      <button class="card-img-add ${photo ? "has-img" : "no-img"}" aria-label="${state.lang === "ja" ? "画像を追加" : "Add image"}">
        ${photo ? "📷" : `<span class="card-img-add-icon">📷</span><span class="card-img-add-label">${state.lang === "ja" ? "画像を追加" : "Add image"}</span>`}
      </button>
      <div class="card-badges">
        ${c.verified ? `<span class="card-badge verified" title="${I18N[state.lang].verified}">✓</span>` : ""}
        ${c.userAdded ? `<span class="card-badge user" title="${I18N[state.lang].userAdded}">＋</span>` : ""}
      </div>
      <button class="card-fav ${isFav ? "active" : ""}" aria-label="favorite" data-id="${c.i}">
        ${isFav ? "★" : "☆"}
      </button>
      <button class="card-delete" aria-label="delete" data-id="${c.i}" title="${state.lang === 'ja' ? '削除' : 'Delete'}">🗑</button>
    </div>
    <div class="card-body">
      <div class="card-region">${prefInfo[state.lang]} · ${categoryLabel(c.cat)}</div>
      <div class="card-title">${escapeHtml(getName(c))}</div>
      <div class="card-desc">${escapeHtml(getDesc(c)) || `<em class="muted">${I18N[state.lang].noDesc}</em>`}</div>
      <div class="card-meta">
        <span class="tag">${emoji} ${categoryLabel(c.cat)}</span>
      </div>
      <a class="card-site ${site.isSearch ? "search" : ""}" href="${escapeAttr(site.url)}" target="_blank" rel="noopener" data-no-card>${siteLabel}</a>
    </div>
  `;

  card.querySelector(".card-fav").addEventListener("click", (e) => {
    e.stopPropagation();
    toggleFavorite(c.i);
  });
  card.querySelector(".card-img-add").addEventListener("click", (e) => {
    e.stopPropagation();
    openImgModal(c);
  });
  card.querySelector(".card-delete").addEventListener("click", (e) => {
    e.stopPropagation();
    const msg = state.lang === "ja"
      ? `「${getName(c)}」を削除しますか？\n${c.userAdded ? "（完全に削除されます）" : "（削除済みパネルから復元できます）"}`
      : `Delete "${getName(c)}"?\n${c.userAdded ? "(Permanent)" : "(Can restore from Deleted panel)"}`;
    if (confirm(msg)) {
      deleteCompany(c.i);
      updateDeletedBtn();
      render();
    }
  });
  card.querySelector(".card-site").addEventListener("click", (e) => {
    e.stopPropagation(); // カード本体のクリック（モーダル）を抑制
  });

  card.addEventListener("click", () => showDetail(c));

  // URLがあり画像未取得のカードを自動取得キューへ
  if (c.url && getCompanyPhotos(c).length === 0 && state.autoImages[c.i] === undefined) {
    imgObserver.observe(card);
  }

  return card;
}

function escapeHtml(s) {
  return String(s || "").replace(/[&<>"]/g, (ch) => ({ "&":"&amp;","<":"&lt;",">":"&gt;","\"":"&quot;" }[ch]));
}
function escapeAttr(s) { return escapeHtml(s).replace(/'/g, "&#39;"); }

// ===== 詳細モーダル =====
function showDetail(c) {
  const dict = I18N[state.lang];
  const isFav = state.favorites.has(c.i);
  const prefInfo = PREFECTURES[c.pref];
  const emoji = categoryEmoji(c.cat);
  const photos = getCompanyPhotos(c);
  const mainPhoto = photos[0] || null;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent((c.ja || "") + " " + prefInfo.ja)}`;

  el.modalBody.innerHTML = `
    <div class="modal-hero ${mainPhoto ? "has-image" : ""}">
      ${mainPhoto ? `<img class="modal-hero-img" alt="${escapeHtml(getName(c))}" src="${escapeAttr(mainPhoto)}" />` : `<span class="modal-emoji">${emoji}</span>`}
    </div>
    <div class="modal-inner">
      <div class="modal-region">
        ${prefInfo[state.lang]} · ${categoryLabel(c.cat)}
        ${c.verified ? `<span class="badge verified">✓ ${dict.verified}</span>` : ""}
        ${c.userAdded ? `<span class="badge user">＋ ${dict.userAdded}</span>` : ""}
      </div>
      <div class="modal-title">${escapeHtml(getName(c))}</div>
      <div class="modal-desc">${escapeHtml(getDesc(c)) || `<em>${dict.noDesc}</em>`}</div>

      ${photos.length > 1 ? `
      <div class="modal-gallery">
        ${photos.map((p, idx) => `<img src="${escapeAttr(p)}" alt="photo ${idx+1}" loading="lazy">`).join("")}
      </div>` : ""}

      <div class="modal-details">
        <div class="detail-item">
          <span class="detail-label">${dict.detailPref}</span>
          <span class="detail-value">${prefInfo[state.lang]}</span>
        </div>
        <div class="detail-item">
          <span class="detail-label">${dict.detailCategory}</span>
          <span class="detail-value">${emoji} ${categoryLabel(c.cat)}</span>
        </div>
        ${c.emp ? `<div class="detail-item"><span class="detail-label">${dict.detailEmp}</span><span class="detail-value">${c.emp}</span></div>` : ""}
        ${c.cap ? `<div class="detail-item"><span class="detail-label">${dict.detailCap}</span><span class="detail-value">${Number(c.cap).toLocaleString()}万円</span></div>` : ""}
        ${c.founded ? `<div class="detail-item"><span class="detail-label">${dict.detailFounded}</span><span class="detail-value">${c.founded}</span></div>` : ""}
        ${c.url ? `<div class="detail-item url-row"><span class="detail-label">URL</span><span class="detail-value"><a href="${escapeAttr(c.url)}" target="_blank" rel="noopener">${shortDomain(c.url)}</a></span></div>` : ""}
      </div>

      <div class="modal-actions">
        ${(() => {
          const s = getWebsiteUrl(c);
          const label = s.isSearch
            ? (state.lang === "ja" ? "🔎 公式サイトを検索" : "🔎 Find official site")
            : `🌐 ${dict.visitSite}`;
          return `<a href="${escapeAttr(s.url)}" target="_blank" rel="noopener" class="modal-action-btn site-btn ${s.isSearch ? "search-btn" : ""}">${label}</a>`;
        })()}
        <a href="${mapsUrl}" target="_blank" rel="noopener" class="modal-action-btn map-btn">📍 ${dict.openMap}</a>
        <button class="modal-action-btn fav-btn ${isFav ? "active" : ""}" id="modal-fav-btn">
          ${isFav ? "★ " + dict.removeFav : "☆ " + dict.addFav}
        </button>
        <button class="modal-action-btn delete-btn" id="modal-delete-btn">🗑 ${dict.delete}</button>
        <button class="modal-action-btn img-edit-btn" id="modal-img-edit-btn">📷 ${state.lang === "ja" ? "画像を追加" : "Add image"}</button>
      </div>
    </div>
  `;

  document.getElementById("modal-fav-btn").addEventListener("click", () => {
    toggleFavorite(c.i);
    showDetail(c);
  });
  const delBtn = document.getElementById("modal-delete-btn");
  if (delBtn) {
    delBtn.addEventListener("click", () => {
      const msg = state.lang === "ja"
        ? `「${getName(c)}」を削除しますか？\n${c.userAdded ? "（ユーザー追加分・完全に削除されます）" : "（組み込みデータ・「削除済み」パネルからいつでも復元できます）"}`
        : `Delete "${getName(c)}"?\n${c.userAdded ? "(User-added: permanent)" : "(Built-in: can be restored from the Deleted panel any time)"}`;
      if (confirm(msg)) {
        deleteCompany(c.i);
        el.modal.classList.add("hidden");
        updateDeletedBtn();
        render();
      }
    });
  }

  document.getElementById("modal-img-edit-btn")?.addEventListener("click", () => openImgModal(c));

  el.modal.classList.remove("hidden");
}

el.modalClose.addEventListener("click", () => el.modal.classList.add("hidden"));
el.modal.addEventListener("click", (e) => { if (e.target === el.modal) el.modal.classList.add("hidden"); });
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    el.modal.classList.add("hidden");
    el.addModal.classList.add("hidden");
    document.getElementById("img-modal")?.classList.add("hidden");
  }
});

// ===== 追加モーダル =====
function openAddModal() {
  state.addModal.photos = [];
  state.addModal.fetchData = null;
  el.addUrl.value = "";
  el.addNameJa.value = "";
  el.addNameEn.value = "";
  el.addDesc.value = "";
  el.addEmployees.value = "";
  el.addCapital.value = "";
  el.addPhoto.value = "";
  el.addPhotoPreview.innerHTML = "";
  el.addFetchStatus.textContent = "";
  el.addFetchStatus.className = "add-status";
  el.addWarning.classList.add("hidden");
  el.addWarning.innerHTML = "";
  populateAddModalSelects();
  el.addModal.classList.remove("hidden");
  setTimeout(() => el.addUrl.focus(), 100);
}

el.addBtn.addEventListener("click", openAddModal);
el.addModalClose.addEventListener("click", () => el.addModal.classList.add("hidden"));
el.addCancelBtn.addEventListener("click", () => el.addModal.classList.add("hidden"));
el.addModal.addEventListener("click", (e) => { if (e.target === el.addModal) el.addModal.classList.add("hidden"); });

// URLから自動取得（失敗してもユーザーが手動入力で保存できる）
el.addFetchBtn.addEventListener("click", async () => {
  const dict = I18N[state.lang];
  const url = el.addUrl.value.trim();
  if (!url) {
    el.addFetchStatus.textContent = state.lang === "ja"
      ? "URLを入力してください（または社名等を直接入力して保存）"
      : "Please enter a URL (or just fill the fields below and save)";
    el.addFetchStatus.className = "add-status err";
    return;
  }

  el.addFetchBtn.disabled = true;
  el.addFetchStatus.textContent = dict.fetching + " (プロキシ1/3)";
  el.addFetchStatus.className = "add-status loading";
  el.addWarning.classList.add("hidden");

  const result = await OgpFetcher.fetchSite(url, (proxyName) => {
    el.addFetchStatus.textContent = `${dict.fetching} (${proxyName})`;
  });
  el.addFetchBtn.disabled = false;

  if (!result.ok) {
    el.addFetchStatus.innerHTML = state.lang === "ja"
      ? `⚠ 自動取得に失敗しました（${result.error}）。下のフォームに直接入力して「保存」を押せば登録できます。`
      : `⚠ Auto-fetch failed (${result.error}). You can still fill the fields below manually and click Save.`;
    el.addFetchStatus.className = "add-status err";
    // それでも警告チェックは走らせる
    evaluateWarnings();
    return;
  }

  const d = result.data;
  state.addModal.fetchData = d;

  if (d.title && !el.addNameJa.value) {
    const cleanTitle = (d.siteName || d.title).replace(/[|｜\-–—:].*/g, "").trim();
    // エラーページのタイトルが万一すり抜けた場合のセーフティネット
    const looksLikeError = /^\s*[45]\d\d(\s|$)|forbidden|not\s*found|access\s*denied|just\s*a\s*moment/i.test(cleanTitle);
    if (!looksLikeError && cleanTitle.length >= 2) {
      el.addNameJa.value = cleanTitle;
    }
  }
  if (d.description && !el.addDesc.value) {
    el.addDesc.value = d.description.slice(0, 200);
  }
  if (d.image) {
    addPhotoFromUrl(d.image);
  } else if (d.favicon) {
    addPhotoFromUrl(d.favicon);
  }

  const viaLabel = result.via ? ` (via ${result.via})` : "";
  const cacheLabel = result.fromCache ? " (cache)" : "";
  el.addFetchStatus.textContent = `✓ ${dict.fetchSuccess}${viaLabel}${cacheLabel}`;
  el.addFetchStatus.className = "add-status ok";

  evaluateWarnings();
});

function evaluateWarnings() {
  const dict = I18N[state.lang];
  const fetched = state.addModal.fetchData;
  const desc = el.addDesc.value + " " + (fetched?.bodyHint || "");
  const warnings = window.ExclusionCheck.evaluateCompany({
    url: el.addUrl.value,
    nameJa: el.addNameJa.value,
    nameEn: el.addNameEn.value,
    employees: el.addEmployees.value,
    capital: el.addCapital.value,
    description: desc,
  });

  if (warnings.length === 0) {
    el.addWarning.classList.add("hidden");
    el.addWarning.innerHTML = "";
    return;
  }
  el.addWarning.classList.remove("hidden");
  el.addWarning.innerHTML = warnings.map(w =>
    `<div class="warn-item warn-${w.severity}">${dict[w.key]}</div>`
  ).join("");
}

// 写真アップロード（ローカル画像）
el.addPhoto.addEventListener("change", (e) => {
  const files = Array.from(e.target.files || []);
  files.forEach((file) => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target.result;
      state.addModal.photos.push(dataUrl);
      renderPhotoPreview();
    };
    reader.readAsDataURL(file);
  });
});

function addPhotoFromUrl(url) {
  state.addModal.photos.push(url);
  renderPhotoPreview();
}

function renderPhotoPreview() {
  el.addPhotoPreview.innerHTML = "";
  state.addModal.photos.forEach((src, idx) => {
    const wrap = document.createElement("div");
    wrap.className = "photo-thumb";
    wrap.innerHTML = `<img src="${escapeAttr(src)}" alt="photo ${idx+1}"><button class="photo-remove" data-idx="${idx}">×</button>`;
    wrap.querySelector(".photo-remove").addEventListener("click", (e) => {
      e.stopPropagation();
      const i = Number(e.currentTarget.dataset.idx);
      state.addModal.photos.splice(i, 1);
      renderPhotoPreview();
    });
    el.addPhotoPreview.appendChild(wrap);
  });
}

// 入力時に警告再評価
[el.addUrl, el.addNameJa, el.addNameEn, el.addEmployees, el.addCapital, el.addDesc]
  .forEach(input => input.addEventListener("input", evaluateWarnings));

// 保存
el.addSaveBtn.addEventListener("click", () => {
  const dict = I18N[state.lang];
  const nameJa = el.addNameJa.value.trim();
  const url = el.addUrl.value.trim();
  const pref = el.addPref.value;
  const cat = el.addCat.value;

  // 不足項目をハイライト
  const missing = [];
  if (!nameJa) { missing.push("会社名（日本語）"); el.addNameJa.classList.add("invalid"); }
  else el.addNameJa.classList.remove("invalid");
  if (!pref) { missing.push("都道府県"); el.addPref.classList.add("invalid"); }
  else el.addPref.classList.remove("invalid");
  if (!cat) { missing.push("カテゴリ"); el.addCat.classList.add("invalid"); }
  else el.addCat.classList.remove("invalid");

  if (missing.length) {
    el.addFetchStatus.textContent = `※ 必須項目が未入力: ${missing.join(" / ")}`;
    el.addFetchStatus.className = "add-status err";
    // フォーカスを最初の未入力欄へ
    if (!nameJa) el.addNameJa.focus();
    else if (!pref) el.addPref.focus();
    else el.addCat.focus();
    return;
  }

  const id = "user_" + Date.now().toString(36) + "_" + Math.random().toString(36).slice(2, 6);
  const company = {
    i: id,
    ja: nameJa,
    en: el.addNameEn.value.trim() || nameJa,
    pref,
    cat,
    desc_ja: el.addDesc.value.trim(),
    desc_en: el.addDesc.value.trim(),
    url: url || undefined,
    emp: el.addEmployees.value ? Number(el.addEmployees.value) : undefined,
    cap: el.addCapital.value ? Number(el.addCapital.value) : undefined,
    photos: state.addModal.photos.slice(),
    userAdded: true,
    addedAt: Date.now(),
  };

  state.userCompanies.unshift(company);
  try {
    localStorage.setItem(LS_USER, JSON.stringify(state.userCompanies));
  } catch (e) {
    alert("LocalStorageの容量上限に達しました。写真サイズを小さくして再試行してください。");
    state.userCompanies.shift();
    return;
  }

  el.addModal.classList.add("hidden");
  render();
});

// ===== 描画 =====
function render(preservePosition = false) {
  state.filtered = filterCompanies();
  el.count.textContent = state.filtered.length.toLocaleString();
  el.totalCount.textContent = allCompanies().length.toLocaleString();

  const visible = state.filtered.slice(0, state.visibleCount);

  if (state.filtered.length === 0) {
    el.cards.innerHTML = "";
    el.empty.classList.remove("hidden");
    el.loadMore.classList.add("hidden");
    return;
  }
  el.empty.classList.add("hidden");

  const existingCount = el.cards.children.length;

  if (!preservePosition) {
    el.cards.innerHTML = "";
    visible.forEach((c) => el.cards.appendChild(createCard(c)));
  } else {
    visible.slice(existingCount).forEach((c) => el.cards.appendChild(createCard(c)));
  }

  if (state.filtered.length > state.visibleCount) {
    el.loadMore.classList.remove("hidden");
    const remaining = state.filtered.length - state.visibleCount;
    el.loadMore.textContent = `${I18N[state.lang].loadMore} (${remaining.toLocaleString()})`;
  } else {
    el.loadMore.classList.add("hidden");
  }
}

// ===== 削除済みパネル =====
function updateDeletedBtn() {
  const btn = document.getElementById("deleted-btn");
  if (!btn) return;
  const count = state.deletedIds.size;
  if (count === 0) {
    btn.classList.add("hidden");
  } else {
    btn.classList.remove("hidden");
    btn.textContent = state.lang === "ja" ? `🗑 削除済み (${count})` : `🗑 Deleted (${count})`;
  }
}

function openDeletedPanel() {
  const dict = I18N[state.lang];
  const deleted = allCompaniesRaw().filter(c => state.deletedIds.has(c.i));

  el.modalBody.innerHTML = `
    <div class="modal-inner">
      <h2 style="margin:6px 0 12px;">${state.lang === "ja" ? "🗑 削除済みの会社" : "🗑 Deleted Companies"}</h2>
      <p style="color:var(--text-light); font-size:13px; margin-bottom:16px;">
        ${state.lang === "ja"
          ? `${deleted.length} 件の会社が一覧から非表示になっています。復元すると再び検索結果に表示されます。`
          : `${deleted.length} companies are hidden. Restore to bring them back into the directory.`}
      </p>
      ${deleted.length === 0 ? `<p style="text-align:center; padding:30px;"><em>${state.lang === "ja" ? "削除済みの会社はありません" : "No deleted companies"}</em></p>` : ""}
      <div class="deleted-list">
        ${deleted.map(c => `
          <div class="deleted-row" data-id="${escapeAttr(c.i)}">
            <div class="deleted-info">
              <div class="deleted-name">${escapeHtml(getName(c))}</div>
              <div class="deleted-meta">${PREFECTURES[c.pref]?.[state.lang] || ""} · ${categoryLabel(c.cat)}${c.userAdded ? ` · <span style="color:var(--accent);">${dict.userAdded}</span>` : ""}</div>
            </div>
            <button class="restore-btn" data-id="${escapeAttr(c.i)}">${state.lang === "ja" ? "↩ 復元" : "↩ Restore"}</button>
          </div>
        `).join("")}
      </div>
      ${deleted.length > 0 ? `
        <div style="margin-top: 20px; padding-top: 16px; border-top: 1px solid var(--border); text-align: center;">
          <button class="btn-secondary" id="restore-all-btn">${state.lang === "ja" ? "すべて復元" : "Restore all"}</button>
        </div>
      ` : ""}
    </div>
  `;

  el.modal.classList.remove("hidden");

  el.modalBody.querySelectorAll(".restore-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const id = btn.dataset.id;
      restoreCompany(id);
      updateDeletedBtn();
      render();
      openDeletedPanel(); // パネル再描画
    });
  });
  const restoreAllBtn = document.getElementById("restore-all-btn");
  if (restoreAllBtn) {
    restoreAllBtn.addEventListener("click", () => {
      if (confirm(state.lang === "ja" ? "削除済みの全会社を復元しますか？" : "Restore all deleted companies?")) {
        state.deletedIds.clear();
        saveDeleted();
        updateDeletedBtn();
        render();
        el.modal.classList.add("hidden");
      }
    });
  }
}

const deletedBtn = document.getElementById("deleted-btn");
if (deletedBtn) deletedBtn.addEventListener("click", openDeletedPanel);

// ===== 自動画像取得（IntersectionObserver） =====
const imgObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (!entry.isIntersecting) return;
    imgObserver.unobserve(entry.target);
    const id = entry.target.dataset.companyId;
    const company = allCompaniesRaw().find(c => c.i === id);
    if (company?.url && state.autoImages[id] === undefined) {
      autoFetchImage(company);
    }
  });
}, { rootMargin: "80px" });

async function autoFetchImage(c) {
  if (state.autoImages[c.i] !== undefined) return;
  state.autoImages[c.i] = "loading";
  const result = await OgpFetcher.fetchSite(c.url, () => {});
  const imgUrl = result.ok ? (result.data?.image || result.data?.favicon || null) : null;
  state.autoImages[c.i] = imgUrl || "none";
  saveAutoImages();
  if (imgUrl) {
    const cardEl = Array.from(document.querySelectorAll(".card"))
      .find(el => el.dataset.companyId === c.i);
    if (cardEl) applyAutoImageToCard(cardEl, imgUrl, getName(c));
  }
}

function applyAutoImageToCard(cardEl, imgUrl, altText) {
  const cardImage = cardEl.querySelector(".card-image");
  if (!cardImage || cardImage.querySelector(".card-img")) return;
  const img = document.createElement("img");
  img.className = "card-img";
  img.loading = "lazy";
  img.alt = altText || "";
  img.src = imgUrl;
  const emoji = cardImage.querySelector(".card-emoji");
  if (emoji) emoji.after(img);
  else cardImage.prepend(img);
  const imgAdd = cardEl.querySelector(".card-img-add");
  if (imgAdd) {
    imgAdd.className = "card-img-add has-img";
    imgAdd.innerHTML = "📷";
  }
}

// ===== 画像モーダル =====
function openImgModal(c) {
  state.imgModalId = c.i;
  const titleEl = document.getElementById("img-modal-title");
  const hintEl  = document.getElementById("img-modal-hint");
  const urlInput = document.getElementById("img-modal-url");
  if (titleEl)  titleEl.textContent  = getName(c);
  if (hintEl)   hintEl.textContent   = state.lang === "ja"
    ? "URLを貼るかファイルをアップロード（LocalStorageに保存）"
    : "Paste a URL or upload a file (saved in LocalStorage)";
  if (urlInput) urlInput.value = "";
  renderImgModalPreview();
  document.getElementById("img-modal").classList.remove("hidden");
}

function renderImgModalPreview() {
  const id = state.imgModalId;
  const preview = document.getElementById("img-modal-preview");
  if (!preview) return;
  const imgs = state.customImages[id] || [];
  preview.innerHTML = "";
  if (imgs.length === 0) {
    preview.innerHTML = `<p style="font-size:12px;color:var(--text-light);grid-column:1/-1;">${state.lang === "ja" ? "追加した画像はありません" : "No images added yet"}</p>`;
    return;
  }
  imgs.forEach((src, idx) => {
    const wrap = document.createElement("div");
    wrap.className = "photo-thumb";
    wrap.innerHTML = `<img src="${escapeAttr(src)}" alt="photo ${idx+1}"><button class="photo-remove" data-idx="${idx}">×</button>`;
    wrap.querySelector(".photo-remove").addEventListener("click", (e) => {
      e.stopPropagation();
      removeCustomImage(id, Number(e.currentTarget.dataset.idx));
      renderImgModalPreview();
      render(true);
    });
    preview.appendChild(wrap);
  });
}

document.getElementById("img-modal-close")?.addEventListener("click", () => {
  document.getElementById("img-modal").classList.add("hidden");
});
document.getElementById("img-modal")?.addEventListener("click", (e) => {
  if (e.target === document.getElementById("img-modal"))
    document.getElementById("img-modal").classList.add("hidden");
});
document.getElementById("img-modal-url-btn")?.addEventListener("click", () => {
  const id = state.imgModalId;
  if (!id) return;
  const input = document.getElementById("img-modal-url");
  const url = input?.value.trim();
  if (!url) return;
  addCustomImage(id, url);
  if (input) input.value = "";
  renderImgModalPreview();
  render(true);
});
document.getElementById("img-modal-file")?.addEventListener("change", (e) => {
  const id = state.imgModalId;
  if (!id) return;
  Array.from(e.target.files || []).forEach(file => {
    if (!file.type.startsWith("image/")) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      addCustomImage(id, ev.target.result);
      renderImgModalPreview();
      render(true);
    };
    reader.readAsDataURL(file);
  });
});

// ===== 初期化 =====
applyLanguage();
updateDeletedBtn();
