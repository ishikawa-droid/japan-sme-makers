// ニッポンメイカーズ — 除外判定モジュール
// 上場企業ドメイン辞書 + 外資系キーワード + 中小企業基本法基準のチェック
// URL追加時に警告を出す（ブロックはしない、最終判断はユーザー）

// 主要上場企業ドメイン（プライム/スタンダード/グロース市場の代表的銘柄）
// 完全網羅ではない（4000社全網羅は現実的でない）が、誤登録の多くを抑える目的の辞書
const LISTED_DOMAINS = new Set([
  // 化粧品大手
  "shiseido.co.jp","kao.com","kose.co.jp","pola.co.jp","mandom.co.jp","fancl.co.jp",
  "rohto.co.jp","kobayashi.co.jp","milbon.co.jp","noevirgroup.jp","poladaily.com",
  // 食品・飲料大手
  "ajinomoto.co.jp","kikkoman.com","mizkan.co.jp","nisshin.com","kewpie.com","meiji.co.jp",
  "morinaga.co.jp","glico.com","calbee.co.jp","yakult.co.jp","ezaki-glico.com","bourbon.co.jp",
  "fujiya-peko.co.jp","kameda-seika.co.jp","itoen.co.jp","kirin.co.jp","suntory.co.jp",
  "asahibeer.co.jp","asahigroup-holdings.com","sapporobeer.jp","ybc.co.jp","nipponham.co.jp",
  "marudai.jp","prima.co.jp","nh-foods.co.jp","yamazakipan.co.jp","yamaki.co.jp",
  // お茶大手
  "itoen.jp","oimatsu.co.jp","kataokabussan.co.jp",
  // 電子部品大手
  "murata.com","tdk.com","kyocera.co.jp","rohm.co.jp","nidec.com","alps.com","alpsalpine.com",
  "ibiden.co.jp","taiyo-yuden.co.jp","nichicon.co.jp","panasonic.com","hitachi.co.jp",
  "toshiba.co.jp","mitsubishielectric.co.jp","nec.com","fujitsu.com","ricoh.co.jp","epson.jp",
  "canon.jp","brother.co.jp","seiko-instruments.com","sii.co.jp","yokogawa.com","omron.com",
  "denso.com","aisin.com","jtekt.co.jp","keyence.co.jp","yaskawa.co.jp","fanuc.co.jp",
  // アパレル大手
  "uniqlo.com","fastretailing.com","gu-global.com","onward.co.jp","tsi-holdings.com",
  "world.co.jp","sanyo-shokai.co.jp","adastria.co.jp","united-arrows.co.jp","beams.co.jp",
  "shipsltd.co.jp","nano-universe.jp","baycrews.co.jp",
  // 自動車・機械大手
  "toyota.jp","toyota.co.jp","honda.co.jp","nissan.co.jp","mazda.co.jp","subaru.co.jp",
  "suzuki.co.jp","mitsubishi-motors.com","yamaha-motor.co.jp","isuzu.co.jp","hino.co.jp",
  // 商社・小売大手
  "mitsubishicorp.com","mitsui.com","sumitomocorp.com","itochu.co.jp","marubeni.com",
  "sojitz.com","aeon.co.jp","seven-eleven.co.jp","lawson.co.jp","familymart.co.jp",
  "rakuten.co.jp","mercari.com","zozo.jp",
  // 製薬大手
  "takeda.com","astellas.com","daiichisankyo.com","otsuka.co.jp","eisai.co.jp",
  "chugai-pharm.co.jp","ono-pharma.com","kyowakirin.com","santen.co.jp",
  // ガラス・刃物・工芸大手
  "ag-c.co.jp","agc.com","nipponglass.co.jp","narumi.co.jp","noritake.co.jp",
  "tachikichi.co.jp","kai-group.com","zwilling.com","henckels.com","wmf.com",
  // 外資系（参考）
  "loreal.com","unilever.com","procterandgamble.com","pg.com","esteelauder.com",
  "lvmh.com","gucci.com","apple.com","google.com","microsoft.com","amazon.co.jp",
  "samsung.com","lg.com","ikea.com","h-and-m.com","nike.com","adidas.com",
  "nestle.com","danone.com","cocacola.co.jp","mcdonalds.co.jp","starbucks.co.jp",
]);

// 外資系を示唆するキーワード（社名・サイトに出現するもの）
const FOREIGN_KEYWORDS = [
  "japan branch","japan ltd","japan co.","japan k.k.","japan kk","k.k.","kk japan",
  "ジャパン株式会社","日本支社","日本法人","日本支店","日本オフィス","ジャパンオフィス",
  "Inc.","Corporation","GmbH","S.A.","S.p.A.","Pty Ltd","LLC","Limited"
];

// 中小企業基本法（製造業）の基準
// 従業員300人以下 OR 資本金3億円以下 → 中小企業
const SME_CRITERIA = {
  industry: "manufacturing",
  employees: 300,
  capital: 30000, // 万円 = 3億円
};

// URLからドメイン部分を抽出（www.とサブドメイン除去）
function extractDomain(url) {
  try {
    const u = new URL(url.includes("://") ? url : `https://${url}`);
    let host = u.hostname.toLowerCase();
    if (host.startsWith("www.")) host = host.slice(4);
    // co.jp / com / org 等のTLDを保持しつつ、不要なサブドメインを削る
    const parts = host.split(".");
    if (parts.length > 3 && (parts[parts.length-2] === "co" || parts[parts.length-2] === "or")) {
      // foo.example.co.jp → example.co.jp
      host = parts.slice(-3).join(".");
    } else if (parts.length > 2) {
      // foo.example.com → example.com（ただし brand.shiseido.co.jp は上で処理済み）
      host = parts.slice(-2).join(".");
    }
    return host;
  } catch (e) {
    return null;
  }
}

// 判定: 上場企業ドメインか？
function isListedDomain(url) {
  const domain = extractDomain(url);
  if (!domain) return false;
  return LISTED_DOMAINS.has(domain);
}

// 判定: サイト本文・社名に外資キーワードが含まれるか？
function hasForeignSignal(text) {
  if (!text) return false;
  const lower = text.toLowerCase();
  return FOREIGN_KEYWORDS.some(k => lower.includes(k.toLowerCase()));
}

// 判定: 従業員数 or 資本金が中小基準を超えるか？
function exceedsSmeSize(employees, capital) {
  const emp = Number(employees) || 0;
  const cap = Number(capital) || 0;
  if (emp > SME_CRITERIA.employees && cap > SME_CRITERIA.capital) {
    return true;
  }
  // どちらか片方でも明確に超過の場合（両方未入力なら判定不能）
  if (emp > SME_CRITERIA.employees * 3) return true; // 1000人超は明確に大手
  if (cap > SME_CRITERIA.capital * 3) return true;   // 9億円超は大手寄り
  return false;
}

// 総合判定: 警告メッセージのリストを返す（空配列なら問題なし）
function evaluateCompany({ url, nameJa, nameEn, employees, capital, description }) {
  const warnings = [];

  if (url && isListedDomain(url)) {
    warnings.push({ key: "warnListed", severity: "high" });
  }

  const text = `${nameJa || ""} ${nameEn || ""} ${description || ""}`;
  if (hasForeignSignal(text)) {
    warnings.push({ key: "warnForeign", severity: "medium" });
  }

  if (exceedsSmeSize(employees, capital)) {
    warnings.push({ key: "warnLarge", severity: "high" });
  }

  return warnings;
}

window.ExclusionCheck = { evaluateCompany, isListedDomain, hasForeignSignal, exceedsSmeSize, extractDomain };
