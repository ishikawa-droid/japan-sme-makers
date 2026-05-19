// AllOrigins他、複数の公開CORSプロキシ経由で
// ホームページのOGP/メタ情報を取得（フォールバック付き）

const OgpFetcher = (() => {
  // 複数の公開CORSプロキシ。順に試す。
  // どれかが落ちていても／プロキシIPがブロックされていても、他で取得できるようフォールバック。
  const PROXIES = [
    {
      name: "allorigins",
      build: (url) => `https://api.allorigins.win/get?url=${encodeURIComponent(url)}`,
      parse: async (res) => {
        const j = await res.json();
        if (!j || !j.contents) throw new Error("empty allorigins payload");
        if (j.status?.http_code && j.status.http_code >= 400) {
          throw new Error(`origin ${j.status.http_code}`);
        }
        return j.contents;
      },
    },
    {
      name: "corsproxy.io",
      build: (url) => `https://corsproxy.io/?${encodeURIComponent(url)}`,
      parse: async (res) => {
        if (!res.ok) throw new Error(`corsproxy ${res.status}`);
        return await res.text();
      },
    },
    {
      name: "codetabs",
      build: (url) => `https://api.codetabs.com/v1/proxy/?quest=${encodeURIComponent(url)}`,
      parse: async (res) => {
        if (!res.ok) throw new Error(`codetabs ${res.status}`);
        return await res.text();
      },
    },
    {
      // 最終フォールバック: Wayback Machine のスナップショット
      // 企業サイトがCloudflare等で全プロキシをブロックしている場合の救済策
      name: "wayback",
      build: (url) => `https://web.archive.org/web/2024/${url}`,
      parse: async (res) => {
        if (!res.ok) throw new Error(`wayback ${res.status}`);
        return await res.text();
      },
    },
  ];

  // プロキシ越しに「200だけど中身はエラーページ」を検知するためのパターン
  // 取得結果のタイトル・本文がこれらに該当したら次のプロキシへフォールバック
  const ERROR_TITLE_PATTERNS = [
    /^\s*4\d\d\s/i,         // "403 Forbidden", "404 Not Found"
    /^\s*5\d\d\s/i,         // "500 Internal Server Error"
    /\bforbidden\b/i,
    /\bnot\s*found\b/i,
    /\baccess\s*denied\b/i,
    /\baccess\s*restricted\b/i,
    /\bunauthorized\b/i,
    /\bbad\s*gateway\b/i,
    /service\s*unavailable/i,
    /just\s*a\s*moment/i,   // Cloudflare challenge page
    /attention\s*required/i, // Cloudflare block
    /cloudflare/i,
    /アクセスが拒否/,
    /アクセス制限/,
    /ページが見つかりません/,
    /お探しのページ/,
  ];

  function looksLikeErrorPage({ title, bodyHint }) {
    const t = (title || "").trim();
    const b = (bodyHint || "").slice(0, 500);
    for (const pat of ERROR_TITLE_PATTERNS) {
      if (pat.test(t) || pat.test(b)) return true;
    }
    // 中身がほぼ空（プロキシが空レスポンスを返した場合）
    if (t.length < 3 && b.length < 100) return true;
    return false;
  }

  const TIMEOUT_MS = 12000;
  const CACHE_KEY = "nm_ogp_cache_v2";
  const CACHE_TTL_MS = 7 * 24 * 60 * 60 * 1000;

  let cache = {};
  try { cache = JSON.parse(localStorage.getItem(CACHE_KEY) || "{}"); } catch (e) { cache = {}; }
  const now = Date.now();
  for (const key of Object.keys(cache)) {
    if (!cache[key].t || now - cache[key].t > CACHE_TTL_MS) delete cache[key];
  }

  function saveCache() {
    try { localStorage.setItem(CACHE_KEY, JSON.stringify(cache)); }
    catch (e) {
      const keys = Object.keys(cache);
      keys.slice(0, Math.floor(keys.length / 2)).forEach((k) => delete cache[k]);
      try { localStorage.setItem(CACHE_KEY, JSON.stringify(cache)); } catch (e2) {}
    }
  }

  function normalizeUrl(url) {
    let u = (url || "").trim();
    if (!u) return null;
    if (!/^https?:\/\//i.test(u)) u = "https://" + u;
    try { new URL(u); return u; } catch (e) { return null; }
  }

  function makeAbsolute(maybeUrl, baseUrl) {
    if (!maybeUrl) return null;
    try { return new URL(maybeUrl, baseUrl).href; } catch (e) { return null; }
  }

  async function fetchWithTimeout(url, timeoutMs = TIMEOUT_MS) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), timeoutMs);
    try {
      return await fetch(url, { signal: ctrl.signal, redirect: "follow" });
    } finally {
      clearTimeout(timer);
    }
  }

  function parseHtml(html, baseUrl) {
    const doc = new DOMParser().parseFromString(html, "text/html");

    const getMeta = (sel) => {
      const el = doc.querySelector(sel);
      return el ? (el.getAttribute("content") || el.getAttribute("value") || "").trim() : "";
    };

    const title =
      getMeta('meta[property="og:title"]') ||
      getMeta('meta[name="twitter:title"]') ||
      doc.querySelector("title")?.textContent?.trim() ||
      "";

    const description =
      getMeta('meta[property="og:description"]') ||
      getMeta('meta[name="twitter:description"]') ||
      getMeta('meta[name="description"]') ||
      "";

    let image =
      getMeta('meta[property="og:image"]') ||
      getMeta('meta[property="og:image:url"]') ||
      getMeta('meta[name="twitter:image"]') ||
      getMeta('meta[name="twitter:image:src"]') ||
      "";
    image = makeAbsolute(image, baseUrl);

    const iconLink =
      doc.querySelector('link[rel="apple-touch-icon"]') ||
      doc.querySelector('link[rel="apple-touch-icon-precomposed"]') ||
      doc.querySelector('link[rel="icon"][sizes]') ||
      doc.querySelector('link[rel="icon"]') ||
      doc.querySelector('link[rel="shortcut icon"]');
    const favicon = iconLink ? makeAbsolute(iconLink.getAttribute("href"), baseUrl) : null;

    const siteName = getMeta('meta[property="og:site_name"]') || "";

    const bodyText = (doc.body?.textContent || "").replace(/\s+/g, " ").slice(0, 2000);

    return { title, siteName, description, image, favicon, bodyHint: bodyText };
  }

  async function tryProxy(proxy, url) {
    const proxyUrl = proxy.build(url);
    const res = await fetchWithTimeout(proxyUrl);
    const html = await proxy.parse(res);
    if (!html || typeof html !== "string" || html.length < 50) {
      throw new Error("empty html");
    }
    return html;
  }

  async function fetchSite(rawUrl, onProgress) {
    const url = normalizeUrl(rawUrl);
    if (!url) return { ok: false, error: "Invalid URL" };

    if (cache[url]) return { ok: true, fromCache: true, data: cache[url].d };

    const errors = [];
    for (const proxy of PROXIES) {
      if (onProgress) onProgress(proxy.name);
      try {
        const html = await tryProxy(proxy, url);
        const parsed = parseHtml(html, url);
        if (looksLikeErrorPage(parsed)) {
          errors.push(`${proxy.name}: blocked/error page ("${(parsed.title || "").slice(0, 40)}")`);
          continue; // 次のプロキシへ
        }
        cache[url] = { t: Date.now(), d: parsed };
        saveCache();
        return { ok: true, data: parsed, via: proxy.name };
      } catch (e) {
        errors.push(`${proxy.name}: ${e.message || e.name || "err"}`);
      }
    }

    return { ok: false, error: errors.join(" / ") };
  }

  function clearCache() { cache = {}; saveCache(); }

  return { fetchSite, clearCache, normalizeUrl };
})();

window.OgpFetcher = OgpFetcher;
