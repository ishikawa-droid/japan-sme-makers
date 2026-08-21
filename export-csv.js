// export-csv.js — ニッポンメイカーズ 会社データ CSV エクスポーター
const vm   = require('vm');
const fs   = require('fs');
const path = require('path');

const baseDir = __dirname;

const REGION_JA = {
  hokkaido: '北海道', tohoku: '東北', kanto: '関東',
  chubu: '中部', kansai: '関西', chugoku: '中国',
  shikoku: '四国', kyushu: '九州', okinawa: '沖縄',
};

// 4 ファイルを順に読み込み、1 つの JS 文字列として結合して評価
// const → var に変換して sandbox に展開されるようにする
const files = ['data.js', 'data2.js', 'data3.js', 'data_cosmetics.js', 'data_urls.js'];
const combined = files
  .map(f => fs.readFileSync(path.join(baseDir, f), 'utf8'))
  .join('\n')
  .replace(/\bconst (COMPANIES|PREFECTURES|CATEGORIES|I18N|KNOWN_URLS)\b/g, 'var $1');

// data_urls.js の末尾に window.KNOWN_URLS = ... があるため、window を用意する
const sandbox = { window: {} };
vm.createContext(sandbox);
vm.runInContext(combined, sandbox);

const { COMPANIES, PREFECTURES, CATEGORIES, KNOWN_URLS } = sandbox;

// CSV ヘッダー
const HEADERS = [
  'ID', '社名（日本語）', '社名（英語）', '都道府県', '地域',
  'カテゴリ', '説明（日本語）', '説明（英語）',
  '公式URL', '従業員数', '資本金（万円）', '公式サイト確認',
];

function escapeCSV(val) {
  if (val === undefined || val === null) return '';
  const s = String(val);
  return (s.includes(',') || s.includes('"') || s.includes('\n'))
    ? '"' + s.replace(/"/g, '""') + '"'
    : s;
}

// 🔴 deleted:true の会社はCSVから除外する（2026-08-22 追加）
// これが無いと data*.js に deleted:true を立てても CSV は全件のまま出力される。
// 掲載を止めたはずの会社が、そのまま海外バイヤーの前に出ることになる。
const ALIVE = COMPANIES.filter(c => !c.deleted);

const rows = ALIVE.map(c => {
  const pref = PREFECTURES[c.pref] || {};
  const cat  = CATEGORIES[c.cat]   || {};
  return [
    c.i,
    c.ja,
    c.en,
    pref.ja    || c.pref || '',
    REGION_JA[pref.region] || pref.region || '',
    cat.ja     || c.cat  || '',
    c.desc_ja  || '',
    c.desc_en  || '',
    KNOWN_URLS[c.i] || c.url || '',
    c.emp      || '',
    c.cap      || '',
    c.verified ? '確認済み' : '',
  ].map(escapeCSV).join(',');
});

// BOM 付き UTF-8（Excel で開いても文字化けしない）
const csv = '﻿' + HEADERS.join(',') + '\n' + rows.join('\n');
const outPath = path.join(baseDir, 'companies.csv');
fs.writeFileSync(outPath, csv, 'utf8');

console.log(`✓ ${ALIVE.length} 件 → ${outPath}`);
console.log(`  （元データ ${COMPANIES.length} 件 − 掲載除外 ${COMPANIES.length - ALIVE.length} 件）`);
const withUrl = ALIVE.filter(c => KNOWN_URLS[c.i] || c.url).length;
console.log(`  公式URL: ${withUrl} 件 / 公式サイト確認: ${ALIVE.filter(c => c.verified).length} 件`);
if (withUrl < 400) console.error('  ⚠ URL が少なすぎます。data_urls.js の読み込みを確認してください');
