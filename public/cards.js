/* FlipTips parchment cards */
const fmt = n => (n ?? 0).toLocaleString();

function getParchmentUrl() {
  const path = location.pathname;
  return path.startsWith("/flip") ? "/assets/parchment-ft-logo.jpg" : "/assets/card-parchment.png";
}

function renderItemCard(it) {
  const low = it.avgLow ?? it.low ?? 0;
  const high = it.avgHigh ?? it.high ?? 0;
  const margin = high - low;
  const marginClass = margin >= 0 ? "ft-pos" : "ft-neg";
  const el = document.createElement("article");
  el.className = "ft-card";
  el.style.backgroundImage = `url('${getParchmentUrl()}')`;

  const imgUrl = it.image || it.img || (it.id ? `/assets/items/${it.id}.png` : "/assets/fallback-coin.webp");
  const pricesUrl = `https://prices.osrs.cloud/items/${encodeURIComponent(it.id ?? it.name)}`;
  const wikiUrl = it.wikiUrl || `https://oldschool.runescape.wiki/w/${encodeURIComponent(it.name)}`;

  el.innerHTML = `
    <div class="ft-card-inner">
      <img class="ft-item-img" src="${imgUrl}" alt="${it.name}"
           onerror="this.onerror=null; this.src='/assets/fallback-coin.webp';" />

      <div class="ft-row"><span class="k">Item</span><span class="v">${it.name}</span></div>
      <div class="ft-row"><span class="k">Buy</span><span class="v">${fmt(low)}</span></div>
      <div class="ft-row"><span class="k">Sell</span><span class="v">${fmt(high)}</span></div>
      <div class="ft-row"><span class="k">Margin</span><span class="v ${marginClass}">${fmt(margin)}</span></div>
      <div class="ft-row"><span class="k">ROI</span><span class="v">${low ? ((margin/low)*100).toFixed(2) + '%' : '—'}</span></div>
      <div class="ft-row"><span class="k">High Alch</span><span class="v">${fmt(it.highAlch ?? 0)}</span></div>
      <div class="ft-row"><span class="k">Live Vol</span><span class="v">${fmt(it.liveVol ?? 0)}</span></div>
      <div class="ft-row"><span class="k">24h Vol</span><span class="v">${fmt(it.vol24h ?? 0)}</span></div>

      <div class="ft-links">
        <a class="ft-link" href="${pricesUrl}" target="_blank" rel="noopener">Prices</a>
        <a class="ft-link" href="${wikiUrl}" target="_blank" rel="noopener">Wiki</a>
      </div>
    </div>
  `;
  return el;
}

export function renderList(container, items){
  if(!container) return;
  container.innerHTML = "";
  const frag = document.createDocumentFragment();
  for(const it of items){ frag.appendChild(renderItemCard(it)); }
  container.appendChild(frag);
}

/* Optional: auto-fetch from /api/list if present */
(async () => {
  const container = document.querySelector(".ft-grid");
  if (!container) return;
  try {
    const res = await fetch("/api/list");
    if (!res.ok) throw new Error("bad /api/list");
    const items = await res.json();
    renderList(container, items);
  } catch(e) {
    console.warn("list load failed", e);
  }
})();
