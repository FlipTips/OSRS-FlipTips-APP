// src/index.js — FULL REPLACEMENT (inline parchment CSS + UI + renderer)
export default {
async fetch(req, env, ctx) {
const url = new URL(req.url);


// Serve UI at /, /v2, and /item/:id
if (req.method === "GET" && (url.pathname === "/" || url.pathname === "/v2" || url.pathname.startsWith("/item/"))) {
const isItemDetail = url.pathname.startsWith("/item/");
const itemId = isItemDetail ? url.pathname.split("/item/")[1] : null;

// API endpoint for item data
if (req.method === "GET" && url.pathname === "/api/list") {
  // Return mock data for now - in production this would fetch from a real API
  const mockData = [
    {
      id: 554,
      name: "Fire rune",
      buy: 5,
      sell: 6,
      margin: 1,
      roi: 0.2,
      highAlch: 1,
      vol1h: 1000,
      geLimit: 25000,
      image: "https://oldschool.runescape.wiki/images/thumb/4/4c/Fire_rune.png/21px-Fire_rune.png"
    }
  ];
  
  return new Response(JSON.stringify(mockData), {
    headers: { 
      "content-type": "application/json",
      "access-control-allow-origin": "*"
    }
  });
}

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
position:relative;padding:20px 20px 70px 20px;border-radius:var(--radius);box-shadow:var(--shadow);
background-image: url('/assets/ui/card-parchment.png');
background-size: cover;
background-position: center;
background-repeat: no-repeat;
border:1px solid var(--border);color:var(--paper-ink);
min-height: 200px;
}
.card h3{margin:0 0 8px;font-weight:800}
.kv{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));gap:10px;margin-top:8px}
.kv>div{
background:linear-gradient(#fff7dd,#f2e7c9);border:1px solid var(--border);border-radius:12px;padding:10px;
min-height:52px;box-shadow:inset 0 0 0 1px rgba(255,255,255,.4);font-size:.9rem
}
.kv strong{display:block;font-size:.75rem;color:#7a6a4d;margin-bottom:4px}
.good{color:var(--good);font-weight:700}.bad{color:var(--bad);font-weight:700}
.sprite{position:absolute;right:12px;bottom:12px;width:68px;height:68px;object-fit:contain;filter:drop-shadow(0 3px 3px rgba(0,0,0,.25));pointer-events:none;opacity:.95}
.links{display:flex;gap:8px;flex-wrap:wrap;margin-top:12px}
.btn{padding:9px 12px;border-radius:10px;border:1px solid var(--border);background:linear-gradient(#fff7dd,#f3e9cb);color:var(--paper-ink);text-decoration:none}
.truncate{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
@media(max-width:420px){body{font-size:15px}.kv{grid-template-columns:1fr}.sprite{width:56px;height:56px;opacity:.9}}

.compact-card .kv {
  grid-template-columns: repeat(2, minmax(0, 1fr));
}

.expanded-card {
  max-width: 600px;
  margin: 0 auto;
}

.expanded-card h2 {
  font-size: 1.5rem;
  margin-bottom: 16px;
}

.expanded-kv {
  grid-template-columns: repeat(3, minmax(0, 1fr));
  gap: 12px;
}

@media(max-width:768px) {
  .expanded-kv {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }
}

@media(max-width:480px) {
  .expanded-kv {
    grid-template-columns: 1fr;
  }
}

.graphs-placeholder {
  margin-top: 24px;
  padding: 20px;
  background: linear-gradient(#fff7dd, #f2e7c9);
  border: 1px solid var(--border);
  border-radius: 12px;
}

.graphs-placeholder h3 {
  margin: 0 0 16px;
  color: var(--paper-ink);
}

.graph-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.graph-tab {
  padding: 8px 16px;
  border: 1px solid var(--border);
  background: var(--paper);
  color: var(--paper-ink);
  border-radius: 20px;
  cursor: pointer;
  font-size: 0.9rem;
}

.graph-tab.active {
  background: linear-gradient(#fff7dd, #f3e9cb);
  font-weight: 600;
}

.graph-container {
  min-height: 200px;
  padding: 20px;
  background: var(--paper);
  border: 1px solid var(--border);
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  color: var(--muted);
}
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
const isItemDetail = ${isItemDetail};
const itemId = '${itemId || ''}';

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

function renderCompactCard(item) {
  const d = derive(item);
  const name = item.name ?? item.item ?? 'Unknown item';
  const wikiId = item.id ?? item.wikiId ?? item.itemId ?? null;
  const wikiHref = wikiId
    ? 'https://oldschool.runescape.wiki/w/Special:Lookup?type=item&id=' + wikiId
    : 'https://oldschool.runescape.wiki/w/' + encodeURIComponent((name || '').replace(/\\s+/g, '_'));
  const marginCls = (d.margin ?? 0) >= 0 ? 'good' : 'bad';

  return '<article class="card compact-card">' +
    '<h3 class="truncate">' + name + '</h3>' +
    '<div class="kv">' +
      '<div><strong>Buy</strong> ' + fmt(d.buy) + ' gp</div>' +
      '<div><strong>Sell</strong> <span class="' + marginCls + '">' + fmt(d.sell) + ' gp</span></div>' +
      '<div><strong>Yield</strong> <span class="' + marginCls + '">' + fmt(d.margin) + ' gp</span></div>' +
      '<div><strong>ROI</strong> ' + pct(d.roi) + '</div>' +
    '</div>' +
    (d.img ? '<img class="sprite" alt="" src="' + d.img + '">' : '') +
    '<div class="links">' +
      '<a class="btn" href="/item/' + (wikiId || encodeURIComponent(name)) + '">View</a>' +
      '<a class="btn" href="' + wikiHref + '" target="_blank" rel="noopener">Wiki Price</a>' +
    '</div>' +
  '</article>';
}

function renderExpandedCard(item) {
  const d = derive(item);
  const name = item.name ?? item.item ?? 'Unknown item';
  const wikiId = item.id ?? item.wikiId ?? item.itemId ?? null;
  const wikiHref = wikiId
    ? 'https://oldschool.runescape.wiki/w/Special:Lookup?type=item&id=' + wikiId
    : 'https://oldschool.runescape.wiki/w/' + encodeURIComponent((name || '').replace(/\\s+/g, '_'));
  const marginCls = (d.margin ?? 0) >= 0 ? 'good' : 'bad';

  return '<article class="card expanded-card">' +
    '<h2>' + name + '</h2>' +
    '<div class="kv expanded-kv">' +
      '<div><strong>Instant Buy (you pay)</strong> ' + fmt(d.buy) + ' gp</div>' +
      '<div><strong>Instant Sell (you receive)</strong> <span class="' + marginCls + '">' + fmt(d.sell) + ' gp</span></div>' +
      '<div><strong>Yield after tax</strong> <span class="' + marginCls + '">' + fmt(d.margin) + ' gp</span></div>' +
      '<div><strong>ROI</strong> ' + pct(d.roi) + '</div>' +
      '<div><strong>GE buy limit</strong> ' + fmt(d.geLimit) + '</div>' +
      '<div><strong>1h vol</strong> ' + fmt(d.vol1h) + '</div>' +
      '<div><strong>High Alch</strong> ' + fmt(d.highAlch) + ' gp</div>' +
    '</div>' +
    (d.img ? '<img class="sprite" alt="" src="' + d.img + '">' : '') +
    '<div class="links">' +
      '<a class="btn" href="/">← Back to List</a>' +
      '<a class="btn" href="' + wikiHref + '" target="_blank" rel="noopener">Wiki Price</a>' +
    '</div>' +
    '<div class="graphs-placeholder">' +
      '<h3>Price History</h3>' +
      '<div class="graph-tabs">' +
        '<button class="graph-tab active">24h</button>' +
        '<button class="graph-tab">1w</button>' +
        '<button class="graph-tab">1m</button>' +
        '<button class="graph-tab">6m</button>' +
        '<button class="graph-tab">1y</button>' +
      '</div>' +
      '<div class="graph-container">' +
        '<p>Price history graphs will be implemented here</p>' +
      '</div>' +
    '</div>' +
  '</article>';
}

function render(list) {
  // If on item detail page, show only that item with expanded view
  if (isItemDetail && itemId) {
    const item = list.find(x => 
      (x.id && x.id.toString() === itemId) || 
      (x.name && encodeURIComponent(x.name) === itemId)
    );
    
    if (item) {
      el.cards.innerHTML = renderExpandedCard(item);
      // Hide controls on item detail page
      if (el.search.parentElement) el.search.parentElement.style.display = 'none';
      if (el.perPage.parentElement) el.perPage.parentElement.style.display = 'none';
      if (el.total) el.total.style.display = 'none';
      return;
    }
  }

  // 1) read controls
  const q   = (el.search.value || '').toLowerCase().trim();
  const per = parseInt(el.perPage.value, 10) || 25;

  // 2) normalize & filter
  let rows = Array.isArray(list) ? list : [];
  if (q) {
    rows = rows.filter(x =>
      ((x.name || x.item || '') + ' ' + (x.id ?? '')).toLowerCase().includes(q)
    );
  }

  // 3) total + slice
  el.total.textContent = rows.length
    ? ('Total: ' + rows.length.toLocaleString('en-US'))
    : '';
  rows = rows.slice(0, per);

  // 4) render cards

  const html = rows.map(item => renderCompactCard(item)).join('');

  const html = rows.map(item => {
    // derive() already maps the possible price/vol/limit fields into stable names
    const d    = derive(item);
    const name = item.name ?? item.item ?? 'Unknown item';

    // wiki link: prefer numeric id if present, otherwise fall back to item name
    const wikiId   = item.id ?? item.wikiId ?? item.itemId ?? null;
    const wikiHref = wikiId
      ? 'https://oldschool.runescape.wiki/w/Special:Lookup?type=item&id=' + wikiId

      : 'https://oldschool.runescape.wiki/w/' + encodeURIComponent((name || '').replace(/\s+/g, '_'));

      : 'https://oldschool.runescape.wiki/w/' + encodeURIComponent((name || '').replace(/\\s+/g, '_'));


    // margin/roi styling
    const marginCls = (d.margin ?? 0) >= 0 ? 'good' : 'bad';

    return '<article class="card">' +
      '<h3 class="truncate">' + name + '</h3>' +
      '<div class="kv">' +
        '<div><strong>Instant Buy (you pay)</strong> ' + fmt(d.buy) + ' gp</div>' +
        '<div><strong>Instant Sell (you receive)</strong> <span class="' + marginCls + '">' + fmt(d.sell) + ' gp</span></div>' +
        '<div><strong>Yield after tax</strong> <span class="' + marginCls + '">' + fmt(d.margin) + ' gp</span></div>' +
        '<div><strong>ROI</strong> ' + pct(d.roi) + '</div>' +
        '<div><strong>GE buy limit</strong> ' + fmt(d.geLimit) + '</div>' +
        '<div><strong>1h vol</strong> ' + fmt(d.vol1h) + '</div>' +
        '<div><strong>High Alch</strong> ' + fmt(d.highAlch) + ' gp</div>' +
      '</div>' +
      (d.img ? '<img class="sprite" alt="" src="' + d.img + '">' : '') +
      '<div class="links">' +
        '<a class="btn" href="https://prices.osrs.cloud" target="_blank" rel="noopener">prices.osrs.cloud</a>' +
        '<a class="btn" href="' + wikiHref + '" target="_blank" rel="noopener">Wiki</a>' +
      '</div>' +
    '</article>';
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