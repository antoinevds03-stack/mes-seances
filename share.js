/* Partage en story : image 1080 × 1920, texte blanc sur fond transparent (PNG), à poser sur une photo Instagram. */
(function(){
const W = 1080, H = 1920;
let SH = null; // {w, style, pos, shadow, photo}
const imgCache = {};
const loadImg = src => imgCache[src] || (imgCache[src] = new Promise(res => { const i = new Image(); i.onload = () => res(i); i.onerror = () => res(null); i.src = src; }));
function statsOf(w){
  const s = wSummary(w);
  if (w.sport === "muscu") return [[fDur(w.durMin), "durée"], [fInt(wVolume(w)) + " kg", "soulevés"], [String(wSets(w)), "séries"]];
  if (w.sport === "course") return [[w.dist ? f1(w.dist) + " km" : "–", "distance"], [w.durSec ? fClock(w.durSec) : fDur(w.durMin), "temps"], [w.dist && w.durSec ? fPace(w.durSec / w.dist) : "–", "/ km"]];
  if (w.sport === "natation") return [[w.dist ? fInt(w.dist) + " m" : "–", "distance"], [w.durSec ? fClock(w.durSec) : fDur(w.durMin), "durée"], [w.dist && w.durSec ? fPace(w.durSec / (w.dist / 100)) : "–", "/ 100 m"]];
  if (w.sport === "bodyboard") return [[fDur(w.durMin), "dans l'eau"], [w.waves != null ? String(w.waves) : "–", "vagues"], [w.felt ? w.felt + "/10" : "–", "ressenti"]];
  return [[s.big, ""], [s.small, ""], ["", ""]];
}
function exLines(w){
  return (w.exercises || []).map(ex => { const e = exById(ex.exId), b = bestSet(ex), n = workSets(ex).length;
    let v; if (e.kind === "cardio") { const mn = ex.sets.reduce((a, s) => a + (s.min ?? (s.sec ? s.sec / 60 : 0)), 0), km = ex.sets.reduce((a, s) => a + (s.km || 0), 0), st = ex.sets.reduce((a, s) => a + (s.steps || 0), 0); v = `${f1(mn)} min${st ? " · " + fInt(st) + " marches" : km ? " · " + f1(km) + " km" : ""}`; }
    else if (e.kind === "kg" && b) v = `${n} × ${f1(b.s.kg || 0)} kg`; else v = `${n} × ${setTxt(ex.sets[0] || {}, e.kind)}`;
    return {name:e.name, v, pr:(w.prs || []).includes(ex.exId)}; });
}
function fit(ctx, text, max, font, size){ let s = size; ctx.font = font.replace("%", s); while (ctx.measureText(text).width > max && s > 20) { s -= 2; ctx.font = font.replace("%", s); } return s; }
async function draw(canvas){
  const w = SH.w, ctx = canvas.getContext("2d"); canvas.width = W; canvas.height = H; ctx.clearRect(0, 0, W, H);
  try { await Promise.all([document.fonts.load('700 120px "Barlow Condensed"'), document.fonts.load('600 40px "Barlow Semi Condensed"')]); } catch (e) {}
  if (SH.photo) { const im = SH.photo, r = Math.max(W / im.width, H / im.height), dw = im.width * r, dh = im.height * r; ctx.drawImage(im, (W - dw) / 2, (H - dh) / 2, dw, dh);
    const g = ctx.createLinearGradient(0, H * .35, 0, H); g.addColorStop(0, "rgba(0,0,0,0)"); g.addColorStop(1, "rgba(0,0,0,.55)"); ctx.fillStyle = g; ctx.fillRect(0, 0, W, H); }
  const NUM = '700 %px "Barlow Condensed", "Arial Narrow", sans-serif', UI = '600 %px "Barlow Semi Condensed", "Arial Narrow", sans-serif';
  ctx.fillStyle = "#fff"; ctx.textBaseline = "alphabetic";
  if (SH.shadow) { ctx.shadowColor = "rgba(0,0,0,.45)"; ctx.shadowBlur = 18; ctx.shadowOffsetY = 2; }
  const M = 90, full = SH.style === "full" && w.sport === "muscu";
  const lines = full ? exLines(w).slice(0, 6) : [], more = full ? Math.max(0, (w.exercises || []).length - 6) : 0;
  const sub = w.sport === "bodyboard" ? (w.spotName || spotName(w.spot) || "") : "";
  // hauteur du bloc pour le placer en haut, au milieu ou en bas
  const blockH = 70 + 150 + (sub ? 60 : 0) + 190 + (full ? 40 + lines.length * 66 + (more ? 56 : 0) : 0) + 90;
  let y = SH.pos === "top" ? 200 : SH.pos === "mid" ? (H - blockH) / 2 : H - blockH - 230;
  // en-tête : logo blanc + BICEPS
  const logo = await loadImg("logo-white.png");
  if (logo) ctx.drawImage(logo, M, y, 62, 62 * logo.height / logo.width);
  ctx.font = NUM.replace("%", 40); ctx.letterSpacing = "10px"; ctx.fillText("BICEPS", M + 80, y + 44); ctx.letterSpacing = "0px";
  y += 70;
  ctx.font = UI.replace("%", 34); ctx.globalAlpha = .9; ctx.fillText(`${SPORTS[w.sport].long.toUpperCase()} · ${fDate(w.date).toUpperCase()}`, M, y + 44); ctx.globalAlpha = 1;
  y += 60;
  const title = wTitle(w).replace(/^(Bodyboard|Surf) · /, "$1"); const ts = fit(ctx, title, W - 2 * M, NUM, 130); ctx.fillText(title, M, y + ts * .85); y += ts * .85 + 20;
  if (sub) { ctx.font = UI.replace("%", 40); ctx.fillText("📍 " + sub, M, y + 40); y += 60; }
  // trait
  y += 20; ctx.globalAlpha = .55; ctx.fillRect(M, y, W - 2 * M, 3); ctx.globalAlpha = 1; y += 40;
  // 3 stats
  const st = statsOf(w), cw = (W - 2 * M) / 3;
  st.forEach(([v, l], i) => { const x = M + i * cw; const vs = fit(ctx, v, cw - 44, NUM, 92); ctx.fillText(v, x, y + 80); ctx.font = UI.replace("%", 30); ctx.globalAlpha = .85; ctx.fillText(l, x, y + 122); ctx.globalAlpha = 1; });
  y += 150;
  if (full && lines.length) { y += 20; ctx.globalAlpha = .55; ctx.fillRect(M, y, W - 2 * M, 3); ctx.globalAlpha = 1; y += 30;
    lines.forEach(L => { ctx.font = UI.replace("%", 38); const vw = (ctx.font = NUM.replace("%", 44), ctx.measureText(L.v).width); ctx.font = UI.replace("%", 38);
      let name = (L.pr ? "🏆 " : "") + L.name; while (ctx.measureText(name).width > W - 2 * M - vw - 40 && name.length > 4) name = name.slice(0, -2) + "…";
      ctx.textAlign = "left"; ctx.fillText(name, M, y + 46); ctx.font = NUM.replace("%", 44); ctx.textAlign = "right"; ctx.fillText(L.v, W - M, y + 46); ctx.textAlign = "left"; y += 66; });
    if (more) { ctx.font = UI.replace("%", 32); ctx.globalAlpha = .8; ctx.fillText(`+ ${more} exercice${more > 1 ? "s" : ""}`, M, y + 40); ctx.globalAlpha = 1; } }
  ctx.shadowColor = "transparent";
}
async function refresh(){ const c = $("#shCanvas"); if (!c) return; await draw(c); }
function blob(){ return new Promise(r => $("#shCanvas").toBlob(r, SH.photo ? "image/jpeg" : "image/png", .92)); }
window.openShare = function(id){
  const w = DB.workouts.find(x => x.id === id); if (!w) return;
  SH = {w, style:w.sport === "muscu" ? "full" : "min", pos:"bottom", shadow:true, photo:null};
  const canShare = !!(navigator.canShare && navigator.share);
  openOv("Partager en story", `<div class="sh-prev" id="shPrev"><canvas id="shCanvas" width="${W}" height="${H}"></canvas></div>
    <div class="sh-opts">
      ${w.sport === "muscu" ? `<div class="seg full"><button data-sh="style:full" aria-pressed="true">Détaillé</button><button data-sh="style:min" aria-pressed="false">Minimal</button></div>` : ""}
      <div class="seg full"><button data-sh="pos:top" aria-pressed="false">En haut</button><button data-sh="pos:mid" aria-pressed="false">Au milieu</button><button data-sh="pos:bottom" aria-pressed="true">En bas</button></div>
      <label class="sh-row"><input type="checkbox" id="shShadow" checked> Ombre légère sous le texte (lisible sur fond clair)</label>
      <label class="btn line small" style="position:relative;overflow:hidden">📷 Essayer sur une de mes photos<input type="file" id="shPhoto" accept="image/*" style="position:absolute;inset:0;opacity:0"></label>
    </div>
    <div class="btns" style="margin-top:12px">${canShare ? `<button class="btn pri" id="shShare">Partager</button>` : ""}<button class="btn ${canShare ? "" : "pri"}" id="shDl">Télécharger l'image</button></div>
    <p class="note-s" id="shNote" style="margin-top:10px">PNG transparent : dans ta story Instagram, ajoute-le avec l'autocollant <b>Photo</b> par-dessus ta photo.</p>`);
  const body = $("#ovBody");
  body.onclick = e => { const b = e.target.closest("[data-sh]"); if (!b) return; const [k, v] = b.dataset.sh.split(":"); SH[k] = v;
    b.parentElement.querySelectorAll("button").forEach(x => x.setAttribute("aria-pressed", x === b)); refresh(); };
  $("#shShadow").onchange = e => { SH.shadow = e.target.checked; refresh(); };
  $("#shPhoto").onchange = async e => { const f = e.target.files[0]; if (!f) return; const url = URL.createObjectURL(f); SH.photo = await loadImgOnce(url);
    $("#shNote").innerHTML = `Ta photo est intégrée : l'image finale est prête à publier telle quelle. <button class="link-btn" id="shNoPhoto">Revenir au PNG transparent</button>`; refresh(); };
  body.addEventListener("click", e => { if (e.target.id === "shNoPhoto") { SH.photo = null; $("#shPhoto").value = ""; $("#shNote").innerHTML = "PNG transparent : dans ta story Instagram, ajoute-le avec l'autocollant <b>Photo</b> par-dessus ta photo."; refresh(); } });
  const name = () => `biceps-${w.date}-${norm(wTitle(w)).replace(/ /g, "-").slice(0, 30)}.${SH.photo ? "jpg" : "png"}`;
  $("#shDl").onclick = async () => { const b = await blob(); const a = document.createElement("a"); a.href = URL.createObjectURL(b); a.download = name(); document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 4000); toast("Image téléchargée"); };
  if ($("#shShare")) $("#shShare").onclick = async () => { const b = await blob(); const file = new File([b], name(), {type:b.type});
    try { if (navigator.canShare({files:[file]})) await navigator.share({files:[file], title:"Ma séance Biceps"}); else $("#shDl").click(); } catch (er) { if (er && er.name !== "AbortError") $("#shDl").click(); } };
  refresh();
};
const loadImgOnce = src => new Promise(res => { const i = new Image(); i.onload = () => res(i); i.onerror = () => res(null); i.src = src; });
})();
