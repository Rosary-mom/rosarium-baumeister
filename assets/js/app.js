(function () {
  const lb = document.getElementById("lightbox");
  if (lb) {
    const img = lb.querySelector("img");
    const cap = lb.querySelector("figcaption");
    const close = () => {
      lb.hidden = true;
      img.removeAttribute("src");
      document.body.style.overflow = "";
    };
    document.addEventListener("click", (e) => {
      const btn = e.target.closest("[data-lightbox]");
      if (!btn) return;
      e.preventDefault();
      img.src = btn.getAttribute("data-lightbox");
      img.alt = btn.getAttribute("data-caption") || "KI-Visualisierung";
      cap.textContent = btn.getAttribute("data-caption") || "KI-Visualisierung";
      lb.hidden = false;
      document.body.style.overflow = "hidden";
    });
    lb.querySelector(".lb-close").addEventListener("click", close);
    lb.addEventListener("click", (e) => {
      if (e.target === lb) close();
    });
    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && !lb.hidden) close();
    });
  }

  const table = document.getElementById("orte-table");
  if (!table) return;

  const tbody = table.querySelector("tbody");
  const q = document.getElementById("filter-q");
  const typ = document.getElementById("filter-typ");
  const mark = document.getElementById("filter-mark");
  const land = document.getElementById("filter-land");
  const stats = document.getElementById("filter-stats");
  let sortKey = "name";
  let sortDir = 1;

  function rows() {
    return Array.from(tbody.querySelectorAll("tr"));
  }

  function applyFilter() {
    const qq = (q?.value || "").trim().toLowerCase();
    const t = typ?.value || "";
    const m = mark?.value || "";
    const l = land?.value || "";
    let visible = 0;
    rows().forEach((tr) => {
      const hay = tr.dataset.search || "";
      const okQ = !qq || hay.includes(qq);
      const okT = !t || tr.dataset.typ === t;
      const okM = !m || tr.dataset.mark === m;
      const okL = !l || tr.dataset.land === l;
      const show = okQ && okT && okM && okL;
      tr.hidden = !show;
      if (show) visible++;
    });
    if (stats) stats.textContent = visible + " von " + rows().length + " Orten";
  }

  function sortBy(key) {
    if (sortKey === key) sortDir *= -1;
    else {
      sortKey = key;
      sortDir = 1;
    }
    table.querySelectorAll("th").forEach((th) => {
      th.classList.toggle("sorted", th.dataset.sort === key);
      const arrow = th.querySelector(".arrow");
      if (arrow) arrow.textContent = th.dataset.sort === key ? (sortDir > 0 ? "▲" : "▼") : "◆";
    });
    const sorted = rows().sort((a, b) => {
      const av = (a.dataset[key] || "").toLowerCase();
      const bv = (b.dataset[key] || "").toLowerCase();
      if (av < bv) return -1 * sortDir;
      if (av > bv) return 1 * sortDir;
      return 0;
    });
    sorted.forEach((tr) => tbody.appendChild(tr));
    applyFilter();
  }

  table.querySelectorAll("th[data-sort]").forEach((th) => {
    th.addEventListener("click", () => sortBy(th.dataset.sort));
  });
  [q, typ, mark, land].forEach((el) => el && el.addEventListener("input", applyFilter));
  applyFilter();
})();
