
// src/index.js — FULL REPLACEMENT (inline parchment CSS + UI + renderer)
export default {
async fetch(req, env, ctx) {
const url = new URL(req.url);

// Serve UI at / and /v2
if (req.method === "GET" && (url.pathname === "/" || url.pathname === "/v2")) {
const html = `<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="utf-8" />
<title>OSRS FlipTips</title>
<meta name="viewport" content="width=device-width, initial-scale=1" />

<!-- INLINE parchment theme -->
<style>
:root{
--bg:#0b0a07; --paper:#f2e7c9; --paper-ink:#3a2f1e; --ink:#e9edf1; --muted:#b9b1a0;
--border:#c9b78a; --ui-panel:#14171b; --good:#2bbb6a; --bad:#ff6b6b;
--radius:16px; --shadow:0 10px 24px rgba(0,0,0,.35);
}
html,body{margin:0;padding:0;background:radial-gradient(1000px 600px at 50% -10%,#1a1814 0%,#0b0a07 60%,#0b0a07 100%);color:var(--ink);font:400 16px/1.45 system-ui,-apple-system,Segoe UI,Roboto,Ubuntu,sans-serif}
.container{max-width:980px;margin:0 auto;padding:16px}
header.topbar{display:flex;align-items:center;gap:12px;justify-content:space-between;margin:8px 0 12px}
h1{margin:0}
input[type="search"]{width:100%;max-width:640px;background:var(--ui-panel);color:var(--ink);border:1px solid #2a3340;border-radius:12px;padding:12px 14px;outline:none}
select{appearance:none;background:linear-gradient(#fff7dd,#f2e7c9);color:var(--paper-ink);border:1px solid var(--border);border-radius:999px;padding:10px 14px}
button{padding:9px 12px;border-radius:10px;cursor:pointer;border:1px solid var(--border);background:linear-gradient(#fff7dd,#f3e9cb);color:var(--paper-ink)}
.controls{display:flex;gap:12px;align-items:center;margin:8px 0 16px}
.muted{color:#9aa3ad}

.cards{display:grid;grid-template-columns:1fr;gap:14px}
@media(min-width:760px){.cards{grid-template-columns:1fr 1fr}}

.card{
position:relative;padding:16px 16px 64px 16px;border-radius:var(--radius);box-shadow:var(--shadow);
background:
radial-gradient(1200px 600px at 50% -200px,rgba(0,0,0,.08),rgba(0,0,0,0) 70%),
linear-gradient(180deg,rgba(120,88,28,.08),rgba(120,88,28,.03) 40%,rgba(0,0,0,.06) 100%),
var(--paper);
border:1px solid var(--border);color:var(--paper-ink)
}
.card h3{margin:0 0 8px;font-weight:800}
.kv{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:8px}
.kv>div{
background:linear-gradient(#fff7dd,#f2e7c9);border:1px solid var(--border);border-radius:12px;padding:10px;
min-height:52px;box-shadow:inset 0 0 0 1px rgba(255,255,255,.4)
}
.kv strong{display:block;font-size:.78rem;color:#7a6a4d;margin-bottom:4px}
.good{color:var(--good);font-weight:700}.bad{color:var(--bad);font-weight:700}
.sprite{position:absolute;right:12px;bottom:12px;width:68px;height:68px;object-fit:contain;filter:drop-shadow(0 3px 3px rgba(0,0,0,.25));pointer-events:none;opacity:.95}
.links{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}
.btn{padding:9px 12px;border-radius:10px;border:1px solid var(--border);background:linear-gradient(#fff7dd,#f3e9cb);color:var(--paper-ink);text-decoration:none}
.truncate{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
@media(max-width:420px){body{font-size:15px}.kv{grid-template-columns:1fr}.sprite{width:56px;height:56px;opacity:.9}}
</style>
</head>
<body>
<main class="container">
<header class="topbar">
<h1>OSRS FlipTips</h1>
<div style="display:flex; gap:8px; align-items:center;">
<label>
<select id="perPage">
<option value="10">Per page 10</option>
<option value="25" selected>Per page 25</option>
<option value="50">Per page 50</option>
<option value="100">Per page 100</option>
</select>
</label>
<button id="refresh">Refresh</button>
</div>
</header>

<div class="controls">
<input id="search" type="search" placeholder="Search items..." />
<span id="total" class="muted"></span>
</div>

<section id="cards" class="cards"></section>
</main>

<script>
const el = {
cards: document.getElementById('cards'),
search: document.getElementById('search'),
perPage: document.getElementById('perPage'),
refresh: document.getElementById('refresh'),
total: document.getElementById('total'),
};

let allItems = [];

const fmt = n => (n==null || isNaN(n)) ? '—' : Number(n).toLocaleString('en-US');
const pct = n => (n==null || isNaN(n)) ? '—' : (Number(n)*100).toFixed(2) + '%';

function derive(item){
const buy = item.avgLow ?? item.low ?? item.buy ?? item.lowPrice ?? null;
const sell = item.avgHigh ?? item.high ?? item.sell ?? item.highPrice ?? null;
const margin = (sell && buy) ? (sell - buy) : null;
const roi = (margin && buy) ? (margin / buy) : null;
const highAlch = item.highAlch ?? item.high_alch ?? item.alch ?? null;
const vol1h = item.liveVol ?? item.oneHourVol ?? item["1h"] ?? null;
const geLimit = item.limit ?? item.buyLimit ?? item.ge_limit ?? null;
const img = item.image ?? item.icon ?? item.sprite ?? null;
return { buy, sell, margin, roi, highAlch, vol1h, geLimit, img };
}

function render(list){
const q = (el.search.value || '').toLowerCase().trim();
const per = parseInt(el.perPage.value, 10) || 25;

let rows = list;
if (q) rows = rows.filter(x => (x.name || x.item || '').toLowerCase().includes(q));

el.total.textContent = rows.length ? ('Total: ' + rows.length.toLocaleString('en-US')) : '';
rows = rows.slice(0, per);

const html = rows.map(item => {
const d = derive(item);
const name = item.name ?? item.item ?? 'Unknown item';
return `
<article class="card">
<h3 class="truncate">${name}</h3>
<div class="kv">
<div><strong>Instant Buy (you pay)</strong> ${fmt(d.buy)} gp</div>
<div><strong>Instant Sell (you receive)</strong> ${fmt(d.sell)} gp</div>
<div><strong>Yield after tax</strong> <span class="${(d.margin ?? 0) >= 0 ? 'good' : 'bad'}">${fmt(d.margin)} gp</span></div>
<div><strong>ROI</strong> ${pct(d.roi)}</div>
<div><strong>GE buy limit</strong> ${fmt(d.geLimit)}</div>
<div><strong>1h vol</strong> ${fmt(d.vol1h)}</div>
<div><strong>High Alch</strong> ${fmt(d.highAlch)} gp</div>
</div>
${d.img ? `<img class="sprite" alt="" src="${d.img}">` : ''}
<div class="links">
<a class="btn" href="https://prices.osrs.cloud" target="_blank" rel="noopener">prices.osrs.cloud</a>
<a class="btn" href="https://oldschool.runescape.wiki/w/Grand_Exchange" target="_blank" rel="noopener">Wiki Price</a>
</div>
</article>
`;
}).join('');
el.cards.innerHTML = html || '<div class="muted">No items.</div>';
}

async function load(){
try {
const r = await fetch('/api/list');
if (!r.ok) throw new Error('API /api/list failed: ' + r.status);
const data = await r.json();
allItems = Array.isArray(data) ? data : (data.items || []);
} catch (e) {
console.error(e);
allItems = [];
}
render(allItems);
}

el.refresh.addEventListener('click', load);
el.search.addEventListener('input', () => render(allItems));
el.perPage.addEventListener('change', () => render(allItems));

load();
</script>
</body>
</html>`;
return new Response(html, {
headers: { "content-type": "text/html; charset=utf-8" }
});
}

// For any other path, pass to static assets if configured; else 404.
try {
if (env.ASSETS) return env.ASSETS.fetch(req);
} catch {}
return new Response("Not Found", { status: 404 });
}
};
