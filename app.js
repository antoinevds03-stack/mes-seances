/* Biceps — carnet d'entraînement perso : muscu (façon Hevy), bodyboard, natation, course.
   Tout est stocké sur l'appareil (localStorage). Sauvegarde/restauration en JSON dans les réglages. */
"use strict";
const $ = s => document.querySelector(s);
const esc = v => String(v ?? "").replace(/[&<>"']/g, c => ({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
const uid = () => Date.now().toString(36) + Math.random().toString(36).slice(2, 7);
const pad = n => String(n).padStart(2, "0");
const dISO = d => `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`;
const todayISO = () => dISO(new Date());
const nowHM = () => { const d = new Date(); return `${pad(d.getHours())}:${pad(d.getMinutes())}`; };
const pDate = s => { const [y, m, d] = String(s).split("-").map(Number); return new Date(y, (m||1)-1, d||1); };
const addDays = (d, n) => { const x = new Date(d); x.setDate(x.getDate() + n); return x; };
const monday = d => { const x = new Date(d.getFullYear(), d.getMonth(), d.getDate()); const k = (x.getDay() + 6) % 7; return addDays(x, -k); };
const DAY_S = ["dim.","lun.","mar.","mer.","jeu.","ven.","sam."];
const DAY_1 = ["D","L","M","M","J","V","S"];
const MON_S = ["janv.","févr.","mars","avr.","mai","juin","juil.","août","sept.","oct.","nov.","déc."];
const fDate = s => { const d = pDate(s); return `${DAY_S[d.getDay()]} ${d.getDate()} ${MON_S[d.getMonth()]}`; };
const fDur = min => { min = Math.round(min || 0); if (min < 60) return `${min} min`; return `${Math.floor(min/60)} h ${pad(min%60)}`; };
const fClock = sec => { sec = Math.max(0, Math.round(sec)); const h = Math.floor(sec/3600), m = Math.floor(sec%3600/60), s = sec%60; return h ? `${h}:${pad(m)}:${pad(s)}` : `${m}:${pad(s)}`; };
const fPace = sec => sec && isFinite(sec) ? `${Math.floor(sec/60)}'${pad(Math.round(sec%60))}"` : "–";
const num = v => { if (v === "" || v == null) return null; const n = parseFloat(String(v).replace(",", ".")); return isFinite(n) ? n : null; };
const f1 = n => (Math.round(n*10)/10).toLocaleString("fr-FR");
const fInt = n => Math.round(n).toLocaleString("fr-FR");
const pl = (n, w, ws) => `${n} ${n > 1 || n === 0 ? (ws || w + "s") : w}`;
const e1rm = (kg, reps) => !kg || !reps ? 0 : reps === 1 ? kg : kg * (1 + Math.min(reps, 12) / 30);

/* ---------- Icônes ---------- */
const IC = {
  muscu:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><path d="M6.5 6.5v11M17.5 6.5v11M3.5 9v6M20.5 9v6M6.5 12h11"/></svg>',
  bodyboard:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><path d="M2 16c2 0 2.5-1.5 4.5-1.5S9 16 11 16s2.5-1.5 4.5-1.5S18 16 20 16h2"/><path d="M3 11.5C5 6 10 3.5 15.5 4.5c-3 1.5-4.5 4-4 7 1.5-1.5 3.5-2 5.5-1.5"/><path d="M2 20c2 0 2.5-1.5 4.5-1.5S9 20 11 20s2.5-1.5 4.5-1.5S18 20 20 20h2"/></svg>',
  natation:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><circle cx="17" cy="6" r="2"/><path d="M3 13l5-3.5 3.5 2.5L15 9"/><path d="M2 17c2 0 2.5-1.5 4.5-1.5S9 17 11 17s2.5-1.5 4.5-1.5S18 17 20 17h2"/><path d="M2 21c2 0 2.5-1.5 4.5-1.5S9 21 11 21s2.5-1.5 4.5-1.5S18 21 20 21h2"/></svg>',
  course:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.1" stroke-linecap="round" stroke-linejoin="round"><circle cx="14.5" cy="4.5" r="2"/><path d="M6 21l3.5-5 3 2V13l-3-2.5 2.5-3 3 3H19"/><path d="M9.5 10.5L7 9l-3 2"/></svg>',
  check:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>',
  more:'<svg viewBox="0 0 24 24" fill="currentColor"><circle cx="5" cy="12" r="2"/><circle cx="12" cy="12" r="2"/><circle cx="19" cy="12" r="2"/></svg>',
  clock:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="12" cy="13" r="8"/><path d="M12 9v4l2.5 2M9 2h6"/></svg>',
  down:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round"><path d="M6 9l6 6 6-6"/></svg>',
  plus:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round"><path d="M12 5v14M5 12h14"/></svg>',
  search:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round"><circle cx="11" cy="11" r="7"/><path d="M20 20l-3.5-3.5"/></svg>',
  trophy:'<svg viewBox="0 0 24 24" width="12" height="12" fill="currentColor"><path d="M7 3h10v3h3v2a4 4 0 0 1-4 4h-.3A5 5 0 0 1 13 14.9V18h3v3H8v-3h3v-3.1A5 5 0 0 1 8.3 12H8a4 4 0 0 1-4-4V6h3zm-1 5a2 2 0 0 0 1.1 1.8A5 5 0 0 1 7 9V8zm11 0v1c0 .3 0 .5-.1.8A2 2 0 0 0 18 8z"/></svg>'
};
Object.assign(IC, {
  play:'<svg viewBox="0 0 24 24" fill="currentColor"><path d="M8 5.5v13a1 1 0 0 0 1.5.86l10.5-6.5a1 1 0 0 0 0-1.72L9.5 4.64A1 1 0 0 0 8 5.5z"/></svg>',
  plan:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M9 4h6M9 4a2 2 0 0 0-2 2H6a2 2 0 0 0-2 2v11a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8a2 2 0 0 0-2-2h-1a2 2 0 0 0-2-2"/><path d="M8 12h8M8 16h5"/></svg>',
  all:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7" rx="2"/><rect x="14" y="3" width="7" height="7" rx="2"/><rect x="3" y="14" width="7" height="7" rx="2"/><rect x="14" y="14" width="7" height="7" rx="2"/></svg>',
  left:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m15 18-6-6 6-6"/></svg>',
  edit:'<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"><path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 1 1 3 3L7 19l-4 1 1-4z"/></svg>',
  right:'<svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="m9 18 6-6-6-6"/></svg>'
});
const SPORTS = {
  muscu:{label:"Muscu", long:"Musculation"},
  bodyboard:{label:"Bodyboard", long:"Bodyboard"},
  natation:{label:"Natation", long:"Natation"},
  course:{label:"Course", long:"Course à pied"}
};
const SPORT_KEYS = Object.keys(SPORTS);

/* ---------- Données ---------- */
const KEY = "messeances.data";
const DEF = () => ({v:1, workouts:[], routines:[], customEx:[], plans:{}, profile:{}, measures:[], settings:{rest:90, theme:"auto", sound:true, wake:true}, active:null, mvSkip:[], lastBackup:null});
let DB = DEF();
try { const s = JSON.parse(localStorage.getItem(KEY)); if (s && s.v) DB = Object.assign(DEF(), s, {settings:Object.assign(DEF().settings, s.settings || {})}); } catch (e) {}
if (!DB.plans) DB.plans = {}; if (!DB.profile) DB.profile = {}; if (!DB.measures) DB.measures = [];
function save(){ try { localStorage.setItem(KEY, JSON.stringify(DB)); return true; } catch (e) { toast("Mémoire pleine : exporte une sauvegarde puis supprime d'anciennes séances."); return false; } }
const sortW = a => a.sort((x, y) => (y.date + (y.time||"")).localeCompare(x.date + (x.time||"")));

const allEx = () => EXERCISES.concat(DB.customEx);
const exById = id => allEx().find(e => e.id === id) || {id, name:id, muscle:"Autre", equip:"Autre", kind:"kg"};
const norm = s => String(s || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, " ").trim();

/* ---------- Thème ---------- */
function applyTheme(){ const t = DB.settings.theme; if (t === "auto") document.documentElement.removeAttribute("data-theme"); else document.documentElement.setAttribute("data-theme", t); }
applyTheme();

/* ---------- Toast / fiches ---------- */
function toast(msg){ let t = $("#toast"); if (!t) { t = document.createElement("div"); t.id = "toast"; t.className = "toast"; t.setAttribute("role", "status"); document.body.appendChild(t); }
  t.classList.toggle("up", !$("#live").hidden); t.textContent = msg; t.hidden = false; clearTimeout(toast.tm); toast.tm = setTimeout(() => t.hidden = true, 2800); }
let ovOnClose = null;
let ovSeq = 0;
function openOv(title, html, onClose){ ovSeq++; const ov = $("#ov"), was = !ov.hidden; if (!navState().ov) navPush("ov"); $("#ovBody").onclick = null; $("#ovBody").onchange = null; $("#ovTitle").textContent = title; $("#ovBody").innerHTML = html; ov.hidden = false; $("#ov .panel").scrollTop = 0; ovOnClose = onClose || null;
  if (was) ov.classList.add("show"); else requestAnimationFrame(() => requestAnimationFrame(() => ov.classList.add("show"))); }
function closeOv(fromPop){ const ov = $("#ov"), my = ++ovSeq; if (!fromPop) setTimeout(() => { if (my === ovSeq) navPopIf("ov"); }, 0); ov.classList.remove("show"); const f = ovOnClose; ovOnClose = null; setTimeout(() => { if (my === ovSeq) { ov.hidden = true; $("#ovBody").innerHTML = ""; } }, 300); if (f) f(); }
$("#ov").addEventListener("click", e => { if (e.target.id === "ov" || e.target.closest("[data-close]")) closeOv(); });
document.addEventListener("keydown", e => { if (e.key === "Escape" && !$("#ov").hidden) closeOv(); });
const chips = (name, entries, val) => entries.map(([v, l]) => `<label><input type="radio" name="${name}" value="${esc(v)}" ${String(v) === String(val ?? "") ? "checked" : ""}><span>${esc(l)}</span></label>`).join("");
const radioVal = (form, n) => { const r = form.querySelector(`input[name="${n}"]:checked`); return r ? r.value : null; };
function armConfirm(btn, label = "Confirmer"){ if (btn.dataset.armed === "1") return true; const old = btn.textContent; btn.dataset.armed = "1"; btn.textContent = label; setTimeout(() => { if (btn.isConnected) { btn.dataset.armed = ""; btn.textContent = old; } }, 4000); return false; }

/* ---------- Spots (repris de Mes Vagues) ---------- */
let SPOTS = [["port-blanc","Port Blanc"],["sainte-barbe","Sainte-Barbe"],["penthievre","Penthièvre"],["le-dossen","Le Dossen"],["baie-des-trepasses","Baie des Trépassés"],["la-torche","La Torche"],["lostmarch","Lostmarc'h"],["la-palue","La Palue"],["port-bara","Port Bara"]].map(([id, name]) => ({id, name}));
fetch("../mes-vagues/spots.json", {cache:"no-store"}).then(r => r.ok ? r.json() : null).then(a => { if (Array.isArray(a) && a.length) SPOTS = a.map(s => ({id:s.id, name:s.name, town:s.town, fav:s.fav})); }).catch(() => {});
const spotName = id => (SPOTS.find(s => s.id === id) || {}).name || id;

/* Carnet Mes Vagues : même domaine github.io → même stockage local */
const MV_SIZE = {petit:"Plus petit qu'annoncé", annonce:"Comme annoncé", gros:"Plus gros qu'annoncé"};
const MV_SHAPE = {creux:"Creux", moyen:"Moyen", mou:"Mou", ferme:"Ça fermait"};
const MV_WIND = {propre:"Propre", clapot:"Un peu clapoteux", vente:"Venté"};
function mvSessions(){ try { const a = JSON.parse(localStorage.getItem("mesvagues.sessions") || "[]"); return Array.isArray(a) ? a : []; } catch (e) { return []; } }
function mvPending(){ const done = new Set(DB.workouts.map(w => w.mvId).filter(Boolean).concat(DB.mvSkip)); return mvSessions().filter(s => s && s.id && !done.has(s.id)); }

/* ---------- Calculs ---------- */
const workSets = ex => (ex.sets || []).filter(s => s.t !== "w");
function wVolume(w){ let v = 0; (w.exercises || []).forEach(ex => workSets(ex).forEach(s => v += (s.kg || 0) * (s.reps || 0))); return v; }
function wSets(w){ return (w.exercises || []).reduce((n, ex) => n + workSets(ex).length, 0); }
function bestSet(ex){ let b = null; workSets(ex).forEach(s => { const v = e1rm(s.kg, s.reps); if (!b || v > b.v) b = {v, s}; }); return b; }
function lastPerf(exId, skipId){
  const ws = sortW(DB.workouts.filter(w => w.sport === "muscu" && w.id !== skipId));
  for (const w of ws) { const ex = (w.exercises || []).find(e => e.exId === exId); if (ex) return ex.sets; }
  return null;
}
function exHistory(exId){
  return sortW(DB.workouts.filter(w => w.sport === "muscu")).map(w => { const ex = (w.exercises || []).find(e => e.exId === exId); if (!ex) return null;
    const b = bestSet(ex); let mx = 0, vol = 0, reps = 0, sec = 0; workSets(ex).forEach(s => { mx = Math.max(mx, s.kg || 0); vol += (s.kg||0)*(s.reps||0); reps = Math.max(reps, s.reps || 0); sec = Math.max(sec, s.sec || 0); });
    return {w, ex, e1:b ? b.v : 0, best:b ? b.s : null, max:mx, vol, reps, sec}; }).filter(Boolean);
}
function wSummary(w){
  if (w.sport === "muscu") return {big:fDur(w.durMin), small:`${pl((w.exercises||[]).length, "exo")} · ${pl(wSets(w), "série")}`, sub:`${fInt(wVolume(w))} kg soulevés`};
  if (w.sport === "bodyboard") return {big:w.felt ? `${w.felt}/10` : fDur(w.durMin), small:w.felt ? fDur(w.durMin) : "", sub:[w.waves != null ? `${w.waves} vagues` : "", w.board === "surf" ? "surf" : ""].filter(Boolean).join(" · ")};
  if (w.sport === "natation") return {big:w.dist ? `${fInt(w.dist)} m` : fDur(w.durMin), small:w.dist ? fDur(w.durMin) : "", sub:w.dist && w.durSec ? `${fPace(w.durSec / (w.dist/100))} /100 m` : ""};
  if (w.sport === "course") return {big:w.dist ? `${f1(w.dist)} km` : fDur(w.durMin), small:w.dist ? fDur(w.durMin) : "", sub:w.dist && w.durSec ? `${fPace(w.durSec / w.dist)} /km` : ""};
  return {big:"", small:"", sub:""};
}
function wTitle(w){
  if (w.sport === "muscu") return w.title || "Séance de muscu";
  if (w.sport === "bodyboard") return (w.board === "surf" ? "Surf · " : "Bodyboard · ") + (w.spotName || spotName(w.spot) || "session");
  if (w.sport === "natation") return w.title || "Natation" + (w.pool ? ` · ${w.pool === "mer" ? "mer" : "bassin " + w.pool + " m"}` : "");
  if (w.sport === "course") return w.title || ({footing:"Footing", fractionne:"Fractionné", longue:"Sortie longue", course:"Course", trail:"Trail", tapis:"Tapis"}[w.kind] || "Course à pied");
  return "Séance";
}

/* ---------- Navigation ---------- */
let TAB = "home";
document.querySelectorAll(".nav button").forEach(b => b.addEventListener("click", () => { if (TAB === b.dataset.tab) { window.scrollTo({top:0, behavior:"smooth"}); return; } const was = TAB; TAB = b.dataset.tab; if (TAB === "home") { if (navState().tab) navPopIf("tab"); } else if (was === "home") navPush("tab"); render(); window.scrollTo(0, 0); }));
function render(){
  document.querySelectorAll(".nav button").forEach(b => { if (b.dataset.tab === TAB) b.setAttribute("aria-current", "page"); else b.removeAttribute("aria-current"); });
  ({home:renderHome, log:renderLog, plans:renderPlans, ex:renderEx, stats:renderProfile})[TAB]();
  const v = $("#view"); v.classList.remove("anim-in"); void v.offsetWidth; [...v.children].forEach((c, i) => c.style.setProperty("--i", Math.min(i, 10))); v.classList.add("anim-in");
}
const activeBanner = () => DB.active ? `<div class="banner live-b"><span class="sp-ic">${IC.muscu}</span><div class="bt"><b><span class="pulse"></span>${esc(DB.active.title || "Séance en cours")}</b><span>${DB.active.editOf ? "Modification en cours" : "Commencée il y a " + fDur((Date.now() - DB.active.startTs)/60000)}</span></div><button class="btn small" data-act="resume">Reprendre</button></div>` : "";
const mvBanner = () => { const n = mvPending().length; return n ? `<div class="banner c-bodyboard"><span class="sp-ic">${IC.bodyboard}</span><div class="bt"><b>${n} session${n > 1 ? "s" : ""} dans Mes Vagues</b><span>À ajouter avec la durée et les vagues prises.</span></div><button class="btn small" data-act="mv">Voir</button></div>` : ""; };
function feedItem(w){ const s = wSummary(w);
  return `<li class="c-${w.sport}"><button data-open="${esc(w.id)}"><span class="sp-ic">${IC[w.sport]}</span><span class="fd-t"><b>${esc(wTitle(w))}</b><span>${fDate(w.date)}${w.time ? " · " + esc(w.time) : ""}${s.sub ? " · " + esc(s.sub) : ""}</span></span><span class="fd-r">${esc(s.big)}<small>${esc(s.small)}</small></span></button></li>`; }
const MONTH_L = ["janvier","février","mars","avril","mai","juin","juillet","août","septembre","octobre","novembre","décembre"];
function feedHtml(ws, n){ let last = "", h = `<ul class="feed">`;
  ws.slice(0, n).forEach(w => { const m = w.date.slice(0, 7); if (m !== last) { last = m; const d = pDate(w.date); h += `<li class="feed-day">${MONTH_L[d.getMonth()]} ${d.getFullYear()}</li>`; } h += feedItem(w); });
  return h + `</ul>`; }

/* ---------- Plans ---------- */
const planDef = (sport, id) => (CARDIO_PLANS[sport] || []).find(p => p.id === id);
const progDef = id => MUSCU_PROGRAMS.find(p => p.id === id);
const progRoutines = id => DB.routines.filter(r => r.prog === id);
function planCount(sport){ const st = DB.plans[sport], d = st && planDef(sport, st.id); if (!d) return null; const tot = d.weeks.reduce((n, w) => n + w.length, 0); return {tot, done:Object.keys(st.done).filter(k => st.done[k]).length}; }
function planNext(sport){ const st = DB.plans[sport]; if (!st) return null; const d = planDef(sport, st.id); if (!d) return null;
  for (let w = 0; w < d.weeks.length; w++) for (let s = 0; s < d.weeks[w].length; s++) { const k = `${w}-${s}`; if (!st.done[k]) return {d, st, w, s, k, ses:d.weeks[w][s]}; }
  return {d, st, finished:true}; }
const ring = (done, tot) => { const r = 27, c = 2 * Math.PI * r, f = tot ? done / tot : 0; return `<div class="ring"><svg viewBox="0 0 64 64"><circle class="bgc" cx="32" cy="32" r="${r}"/><circle class="fgc" cx="32" cy="32" r="${r}" stroke-dasharray="${c.toFixed(1)}" stroke-dashoffset="${c.toFixed(1)}" data-off="${(c * (1 - f)).toFixed(1)}"/></svg><span>${Math.round(f * 100)}%</span></div>`; };
function animRings(){ requestAnimationFrame(() => requestAnimationFrame(() => document.querySelectorAll(".fgc[data-off]").forEach(c => c.style.strokeDashoffset = c.dataset.off))); }
function todoCards(){
  const out = [];
  const mp = DB.plans.muscu; if (mp) { const rs = progRoutines(mp.id), pd = progDef(mp.id); if (rs.length) { const r = rs[mp.n % rs.length];
    out.push(`<div class="todo-c c-muscu"><span class="sp-ic">${IC.muscu}</span><div class="tt"><small>${esc(pd ? pd.name : "Programme")} · séance ${mp.n + 1}</small><b>${esc(r.name)}</b><p>${r.items.slice(0, 4).map(it => esc(exById(it.exId).name)).join(" · ")}${r.items.length > 4 ? "…" : ""}</p><button class="btn small pri" data-rstart="${esc(r.id)}">${IC.play} Démarrer</button></div></div>`); } }
  ["course","natation"].forEach(sp => { const nx = planNext(sp); if (!nx) return;
    if (nx.finished) { out.push(`<div class="todo-c c-${sp}"><span class="sp-ic">${IC[sp]}</span><div class="tt"><small>${esc(nx.d.name)}</small><b>Programme terminé, bravo !</b><p>Choisis la suite dans Programmes.</p><button class="btn small" data-act="go-plans">Voir les programmes</button></div></div>`); return; }
    out.push(`<div class="todo-c c-${sp}"><span class="sp-ic">${IC[sp]}</span><div class="tt"><small>${esc(nx.d.name)} · semaine ${nx.w + 1}/${nx.d.weeks.length}</small><b>${esc(nx.ses.t)}</b><p>${esc(nx.ses.d)}</p><div class="btns" style="flex-wrap:nowrap"><button class="btn small pri" data-pdo="${sp}|${nx.k}">Noter la séance</button><button class="btn small" data-pck="${sp}|${nx.k}" data-refresh="1">Fait</button></div></div></div>`); });
  return out.join("");
}

/* ---------- Accueil ---------- */
let FEED_N = 30;
function renderHome(){
  const now = new Date();
  $("#viewTitle").textContent = "Aujourd'hui"; $("#viewSub").textContent = `${["Dimanche","Lundi","Mardi","Mercredi","Jeudi","Vendredi","Samedi"][now.getDay()]} ${now.getDate()} ${MONTH_L[now.getMonth()]}`;
  const mon = monday(now), sun = addDays(mon, 6), ws = sortW(DB.workouts.slice()), td = todayISO();
  const inWeek = ws.filter(w => w.date >= dISO(mon) && w.date <= dISO(sun));
  const week = Array.from({length:7}, (_, i) => { const d = addDays(mon, i), iso = dISO(d); const day = inWeek.filter(w => w.date === iso);
    return `<div class="wd ${iso === td ? "today" : ""}"><span class="wd-n">${DAY_1[d.getDay()]}</span><span class="wd-d">${d.getDate()}</span><span class="dots">${day.map(w => `<i class="dot c-${w.sport}"></i>`).join("")}</span></div>`; }).join("");
  const minutes = inWeek.reduce((n, w) => n + (w.durMin || 0), 0);
  let h = activeBanner() + mvBanner();
  const todo = todoCards();
  h += `<div class="sec-t">À faire${todo ? "" : ""}</div>` + (todo ? `<div class="todo">${todo}</div>` : `<div class="card" style="display:flex;gap:12px;align-items:center"><span class="sp-ic" style="--c:var(--accent);--cs:var(--accent-soft)">${IC.plan}</span><div style="flex:1"><b>Suis un programme</b><p class="note-s">Muscu, course ou natation : ta prochaine séance s'affichera ici.</p></div><button class="btn small" data-act="go-plans">Choisir</button></div>`);
  h += `<div class="sec-t">Démarrer</div><div class="quick">${SPORT_KEYS.map(k => `<button class="sport c-${k}" data-start="${k}"><span class="sp-ic">${IC[k]}</span>${SPORTS[k].label}</button>`).join("")}</div>`;
  if (DB.routines.length) h += `<div class="sec-t">Mes routines <button class="link-btn" data-act="go-plans">Gérer</button></div><div class="hscroll">${DB.routines.map(r => `<div class="rcard"><b>${esc(r.name)}</b><p>${r.items.map(it => esc(exById(it.exId).name)).join(" · ")}</p><button class="btn small pri" data-rstart="${esc(r.id)}">${IC.play} Démarrer</button></div>`).join("")}</div>`;
  h += `<div class="sec-t">Cette semaine</div><div class="week">${week}</div>
    <div class="kpis"><div class="kpi"><b>${inWeek.length}</b><span>séance${inWeek.length > 1 ? "s" : ""}</span></div><div class="kpi"><b>${minutes >= 60 ? f1(minutes/60) + " h" : Math.round(minutes) + " min"}</b><span>d'activité</span></div><div class="kpi"><b>${fInt(inWeek.filter(w => w.sport === "muscu").reduce((n, w) => n + wSets(w), 0))}</b><span>séries muscu</span></div></div>`;
  h += `<div class="sec-t">Dernières séances ${ws.length > 3 ? `<button class="link-btn" data-act="go-log">Tout voir</button>` : ""}</div>`;
  h += ws.length ? feedHtml(ws, 3) : `<div class="card"><p class="empty">Aucune séance pour l'instant. Touche <b>+</b> pour en noter une, ou récupère ton historique Hevy dans les réglages (roue crantée).</p></div>`;
  $("#view").innerHTML = h; animRings();
}

/* ---------- Mes séances ---------- */
let LOGF = "", CALM = 0;
function renderLog(){
  $("#viewTitle").textContent = "Mes séances"; $("#viewSub").textContent = "Ton journal, sport par sport";
  const all = sortW(DB.workouts.slice()), ws = all.filter(w => !LOGF || w.sport === LOGF);
  let h = `<div class="tabs" id="logTabs"><button class="tab" data-lf="" aria-pressed="${!LOGF}">${IC.all}Tous</button>${SPORT_KEYS.map(k => `<button class="tab c-${k}" data-lf="${k}" aria-pressed="${LOGF === k}">${IC[k]}${SPORTS[k].label}</button>`).join("")}</div>`;
  const base = new Date(); const m0 = new Date(base.getFullYear(), base.getMonth() + CALM, 1), m1 = new Date(m0.getFullYear(), m0.getMonth() + 1, 0);
  const inM = ws.filter(w => w.date >= dISO(m0) && w.date <= dISO(m1)); const start = monday(m0), td = todayISO();
  let cells = ["L","M","M","J","V","S","D"].map(d => `<span class="dn">${d}</span>`).join("");
  for (let d = start; d <= m1 || d.getDay() !== 1; d = addDays(d, 1)) { const iso = dISO(d), inMonth = d.getMonth() === m0.getMonth(); const day = inM.filter(w => w.date === iso);
    cells += `<span class="cd ${day.length ? "has" : ""} ${iso === td ? "today" : ""}" style="${inMonth ? "" : "opacity:.3"}">${d.getDate()}<span class="dots">${day.slice(0, 3).map(w => `<i class="dot c-${w.sport}"></i>`).join("")}</span></span>`; if (cells.length > 6000) break; }
  const mins = inM.reduce((n, w) => n + (w.durMin || 0), 0);
  let extra = ["", ""];
  if (LOGF === "muscu") extra = [f1(inM.reduce((n, w) => n + wVolume(w), 0) / 1000) + " t", "soulevées"];
  else if (LOGF === "bodyboard") extra = [String(inM.reduce((n, w) => n + (w.waves || 0), 0)), "vagues prises"];
  else if (LOGF === "natation") extra = [f1(inM.reduce((n, w) => n + (w.dist || 0), 0) / 1000) + " km", "nagés"];
  else if (LOGF === "course") extra = [f1(inM.reduce((n, w) => n + (w.dist || 0), 0)) + " km", "courus"];
  else { const days = new Set(inM.map(w => w.date)).size; extra = [String(days), "jours actifs"]; }
  h += `<div class="cal"><div class="cal-h"><button class="icon-btn sm ghost" data-cal="-1" aria-label="Mois précédent">${IC.left}</button><b>${MONTH_L[m0.getMonth()]} ${m0.getFullYear()}</b><button class="icon-btn sm ghost" data-cal="1" aria-label="Mois suivant" ${CALM >= 0 ? "disabled" : ""}>${IC.right}</button></div><div class="cal-g">${cells}</div></div>
    <div class="sumrow"><div class="kpi"><b>${inM.length}</b><span>séance${inM.length > 1 ? "s" : ""}</span></div><div class="kpi"><b>${mins >= 60 ? f1(mins/60) + " h" : mins + " min"}</b><span>au total</span></div><div class="kpi"><b>${extra[0]}</b><span>${extra[1]}</span></div></div>`;
  h += `<div class="sec-t">${LOGF ? SPORTS[LOGF].long : "Toutes les séances"} · ${ws.length}</div>`;
  h += ws.length ? feedHtml(ws, FEED_N) + (ws.length > FEED_N ? `<button class="btn wide" style="margin-top:10px" data-act="more">Afficher plus (${ws.length - FEED_N})</button>` : "")
    : `<div class="card"><p class="empty">Pas encore de séance${LOGF ? " de " + SPORTS[LOGF].label.toLowerCase() : ""}.</p><div class="btns" style="margin-top:10px"><button class="btn small pri" data-start="${LOGF || "muscu"}">Noter une séance</button></div></div>`;
  $("#view").innerHTML = h;
}

/* ---------- Détail d'une séance ---------- */
function openWorkout(id){
  const w = DB.workouts.find(x => x.id === id); if (!w) return;
  const s = wSummary(w); let h = `<p class="note-s" style="margin-top:-6px;margin-bottom:12px">${SPORTS[w.sport].long} · ${fDate(w.date)}${w.time ? " à " + esc(w.time) : ""}</p>`;
  if (w.sport === "muscu") {
    h += `<div class="stats3"><div class="stat"><b>${fDur(w.durMin)}</b><span>durée</span></div><div class="stat"><b>${fInt(wVolume(w))}</b><span>kg soulevés</span></div><div class="stat"><b>${wSets(w)}</b><span>séries</span></div></div>`;
    (w.prs || []).length && (h += `<p class="note-s"><span class="pr">${IC.trophy} ${w.prs.length} record${w.prs.length > 1 ? "s" : ""}</span> ${w.prs.map(p => esc(exById(p).name)).join(", ")}</p>`);
    h += (w.exercises || []).map(ex => { const e = exById(ex.exId); let n = 0;
      return `<div class="ses-ex"><h3><button class="link-btn" style="font-size:15.5px" data-exd="${esc(ex.exId)}">${esc(e.name)}</button></h3>${ex.note ? `<p class="note-s">${esc(ex.note)}</p>` : ""}<table class="tbl"><tbody>${ex.sets.map(st => { const lab = st.t === "w" ? "É" : st.t === "d" ? "D" : st.t === "f" ? "F" : String(++n); return `<tr><td style="width:30px;color:var(--muted)">${lab}</td><td>${setTxt(st, e.kind)}</td></tr>`; }).join("")}</tbody></table></div>`; }).join("");
  } else {
    h += `<div class="stats3"><div class="stat"><b>${esc(s.big)}</b><span>${w.sport === "bodyboard" ? (w.felt ? "ressenti" : "durée") : "distance"}</span></div><div class="stat"><b>${fDur(w.durMin)}</b><span>durée</span></div><div class="stat"><b>${esc(s.sub || "–")}</b><span>${w.sport === "bodyboard" ? "" : "allure"}</span></div></div><dl class="dl">`;
    const row = (k, v) => v || v === 0 ? `<dt>${k}</dt><dd>${esc(v)}</dd>` : "";
    if (w.sport === "bodyboard") h += row("Spot", w.spotName || spotName(w.spot)) + row("Vagues prises", w.waves) + row("Planche", w.board === "surf" ? "Surf" : "Bodyboard") + row("Taille", MV_SIZE[w.size]) + row("Forme", MV_SHAPE[w.shape]) + row("Vent", MV_WIND[w.wind]) + row("Ressenti", w.felt ? w.felt + "/10" : "") + (w.mvId ? row("Source", "Carnet Mes Vagues") : "");
    if (w.sport === "natation") h += row("Lieu", w.pool === "mer" ? "Mer" : w.pool ? `Bassin de ${w.pool} m` : "") + row("Longueurs", w.dist && w.pool && w.pool !== "mer" ? Math.round(w.dist / +w.pool) : "") + row("Nage", {crawl:"Crawl", brasse:"Brasse", dos:"Dos", papillon:"Papillon", mixte:"Mixte"}[w.stroke]) + row("Ressenti", w.felt ? w.felt + "/10" : "");
    if (w.sport === "course") h += row("Type", wTitle(w)) + row("Dénivelé", w.elev ? `${w.elev} m D+` : "") + row("FC moyenne", w.hr ? `${w.hr} bpm` : "") + row("Ressenti", w.felt ? w.felt + "/10" : "");
    h += `</dl>`;
  }
  if (w.note) h += `<p style="margin:14px 0 0;white-space:pre-wrap;overflow-wrap:anywhere">${esc(w.note)}</p>`;
  h += `<div class="btns" style="margin-top:16px"><button class="btn" data-edit="${esc(w.id)}">Modifier</button>${w.sport === "muscu" ? `<button class="btn" data-redo="${esc(w.id)}">Refaire</button>` : ""}<button class="btn danger" data-delw="${esc(w.id)}">Supprimer</button></div>`;
  openOv(wTitle(w), h);
}
function setTxt(st, kind){
  if (kind === "temps") return `${st.kg ? f1(st.kg) + " kg · " : ""}${fClock(st.sec || 0)}`;
  if (kind === "reps") return `${st.reps || 0} reps`;
  if (kind === "pdc") return `${st.kg ? "+" + f1(st.kg) + " kg × " : ""}${st.reps || 0} reps`;
  return `${f1(st.kg || 0)} kg × ${st.reps || 0}${st.km ? ` · ${f1(st.km)} km` : ""}`;
}

/* ---------- Programmes ---------- */
let PSEG = "muscu";
function renderPlans(){
  $("#viewTitle").textContent = "Programmes"; $("#viewSub").textContent = "Des séances toutes prêtes, à suivre semaine après semaine";
  let h = `<div class="seg full" id="pSeg">${[["muscu","Muscu"],["course","Course"],["natation","Natation"]].map(([k, l]) => `<button data-pseg="${k}" aria-pressed="${PSEG === k}">${l}</button>`).join("")}</div>`;
  if (PSEG === "muscu") {
    const mp = DB.plans.muscu, pd = mp && progDef(mp.id);
    if (pd) { const rs = progRoutines(mp.id), r = rs.length ? rs[mp.n % rs.length] : null;
      h += `<div class="sec-t">En cours</div><div class="card c-muscu"><div class="active-plan"><span class="sp-ic lg">${IC.muscu}</span><div style="flex:1;min-width:0"><b style="font-family:var(--font-num);font-size:21px">${esc(pd.name)}</b><p class="note-s">${mp.n} séance${mp.n > 1 ? "s" : ""} faite${mp.n > 1 ? "s" : ""} · ${esc(pd.freq)}</p></div></div>${r ? `<div class="ses next" style="margin-top:12px"><div class="tt"><b>Prochaine : ${esc(r.name)}</b><p>${r.items.map(it => esc(exById(it.exId).name)).join(" · ")}</p></div></div><button class="btn pri wide" data-rstart="${esc(r.id)}" style="margin-top:6px">${IC.play} Démarrer ${esc(r.name)}</button>` : ""}<button class="btn flat small" style="margin-top:6px;width:100%" data-prog="${esc(pd.id)}">Voir le programme</button></div>`; }
    h += `<div class="sec-t">Mes routines <button class="link-btn" data-act="new-routine">+ Nouvelle</button></div>`;
    h += DB.routines.length ? `<div class="plist">${DB.routines.map(r => `<div class="card rt"><div class="rt-h"><b>${esc(r.name)}</b><button class="icon-btn sm ghost" data-rmenu="${esc(r.id)}" aria-label="Options de la routine">${IC.more}</button></div><p>${r.items.map(it => esc(exById(it.exId).name)).join(" · ") || "Aucun exercice"}</p><button class="btn small pri" data-rstart="${esc(r.id)}">${IC.play} Démarrer</button></div>`).join("")}</div>`
      : `<div class="card"><p class="empty">Crée ta propre routine, ou pars d'un programme ci-dessous : ses séances deviennent tes routines.</p></div>`;
    h += `<div class="sec-t">Programmes proposés</div><div class="plist">${MUSCU_PROGRAMS.map(p => `<button class="pcard c-muscu" data-prog="${p.id}"><span class="pl">${esc(p.level)}</span><b>${esc(p.name)}</b><p>${esc(p.desc)}</p><span class="meta"><span class="pill">${esc(p.freq)}</span><span class="pill">${p.sessions.length} séances types</span>${mp && mp.id === p.id ? `<span class="pill on">En cours</span>` : ""}</span></button>`).join("")}</div>`;
  } else {
    const sp = PSEG, st = DB.plans[sp], nx = planNext(sp);
    if (nx) { const c = planCount(sp);
      h += `<div class="sec-t">En cours</div><div class="card c-${sp}"><div class="active-plan">${ring(c.done, c.tot)}<div style="flex:1;min-width:0"><b style="font-family:var(--font-num);font-size:21px">${esc(nx.d.name)}</b><p class="note-s">${c.done} séance${c.done > 1 ? "s" : ""} sur ${c.tot}${nx.finished ? " · terminé !" : ` · semaine ${nx.w + 1} sur ${nx.d.weeks.length}`}</p></div></div>
        ${nx.finished ? "" : `<div class="ses next" style="margin-top:12px"><div class="tt"><b>${esc(nx.ses.t)}</b><p>${esc(nx.ses.d)}</p></div></div><div class="btns" style="margin-top:6px"><button class="btn pri" data-pdo="${sp}|${nx.k}">Noter la séance</button><button class="btn" data-pck="${sp}|${nx.k}" data-refresh="1">Marquer faite</button></div>`}
        <button class="btn flat small" style="margin-top:6px;width:100%" data-plan="${sp}|${nx.d.id}">Voir tout le programme</button></div>`; }
    h += `<div class="sec-t">Programmes ${sp === "course" ? "course à pied" : "natation"}</div><div class="plist">${CARDIO_PLANS[sp].map(p => `<button class="pcard c-${sp}" data-plan="${sp}|${p.id}"><span class="pl">${esc(p.level)}</span><b>${esc(p.name)}</b><p>${esc(p.desc)}</p><span class="meta"><span class="pill">${p.weeks.length} semaines</span><span class="pill">${esc(p.freq)}</span>${st && st.id === p.id ? `<span class="pill on">En cours</span>` : ""}</span></button>`).join("")}</div>`;
  }
  $("#view").innerHTML = h; animRings();
}
function openProgram(id){
  const p = progDef(id); if (!p) return; const following = DB.plans.muscu && DB.plans.muscu.id === id;
  let h = `<p style="margin:0 0 10px;color:var(--muted);line-height:1.45">${esc(p.desc)}</p><div class="meta" style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:14px"><span class="pill">${esc(p.level)}</span><span class="pill">${esc(p.freq)}</span><span class="pill">${esc(p.weeks)}</span></div>`;
  h += p.sessions.map(s => `<div class="prog-s"><h3>${esc(s.name)}</h3>${s.items.map(([exId, sets, reps, rest]) => { const e = exById(exId); return `<div class="prog-ex"><span class="thumb">${exThumb(e)}</span><span class="ex-t"><b>${esc(e.name)}</b><span>${sets} × ${esc(reps)}${rest ? ` · repos ${fClock(rest)}` : ""}</span></span></div>`; }).join("")}</div>`).join("");
  h += `<p class="note-s" style="margin:4px 0 12px">Les séances deviennent des routines modifiables. L'appli te propose ensuite la suivante, dans l'ordre.</p>`;
  h += following ? `<div class="btns"><button class="btn danger line" data-unfollow="muscu">Arrêter de suivre</button></div>` : `<button class="btn pri wide" data-follow="${esc(id)}">Suivre ce programme</button>`;
  openOv(p.name, h);
}
function followProgram(id){
  const p = progDef(id); if (!p) return;
  if (!progRoutines(id).length) p.sessions.forEach(s => DB.routines.push({id:uid(), name:s.name, prog:id, items:s.items.map(([exId, sets, reps, rest]) => ({exId, sets, reps, rest}))}));
  DB.plans.muscu = {id, n:0, start:todayISO()}; save(); closeOv(); PSEG = "muscu"; render(); toast("Programme ajouté à tes routines");
}
function openPlan(sport, id){
  const d = planDef(sport, id); if (!d) return; const st = DB.plans[sport], mine = st && st.id === id, nx = mine ? planNext(sport) : null;
  let h = `<div class="c-${sport}"><p style="margin:0 0 10px;color:var(--muted);line-height:1.45">${esc(d.desc)}</p><div style="display:flex;gap:6px;flex-wrap:wrap;margin-bottom:12px"><span class="pill">${esc(d.level)}</span><span class="pill">${d.weeks.length} semaines</span><span class="pill">${esc(d.freq)}</span></div>`;
  h += mine ? "" : `<button class="btn pri wide" data-pstart="${sport}|${id}">${st ? "Remplacer le programme en cours" : "Commencer ce programme"}</button>`;
  h += d.weeks.map((w, wi) => `<div class="wk"><h4>Semaine ${wi + 1}</h4>${w.map((s, si) => { const k = `${wi}-${si}`, done = mine && st.done[k];
    return `<div class="ses ${nx && nx.k === k ? "next" : ""}">${mine ? `<button class="ck ${done ? "on" : ""}" data-pck="${sport}|${k}" aria-label="Séance faite">${IC.check}</button>` : ""}<div class="tt"><b>${esc(s.t)}</b><p>${esc(s.d)}</p>${mine && !done ? `<button class="link-btn" style="margin-top:4px" data-pdo="${sport}|${k}">Noter cette séance</button>` : ""}</div></div>`; }).join("")}</div>`).join("");
  if (mine) h += `<div class="btns" style="margin-top:16px"><button class="btn danger line" data-pstop="${sport}">Arrêter ce programme</button></div>`;
  openOv(d.name, h + `</div>`);
}
function planSessionForm(sport, k){
  const st = DB.plans[sport], d = st && planDef(sport, st.id); if (!d) return; const [w, s] = k.split("-").map(Number), ses = d.weeks[w][s];
  openSportForm(sport, null, {planKey:k, title:ses.t, planDesc:ses.d, kind:ses.kind, dist:sport === "course" ? ses.km : ses.m});
}
function openStart(){
  openOv("Nouvelle séance", `<div class="plist">${SPORT_KEYS.map(k => `<button class="pcard c-${k}" data-start="${k}" style="flex-direction:row;align-items:center;gap:12px;padding:12px 14px"><span class="sp-ic">${IC[k]}</span><span style="flex:1"><b style="font-size:19px">${SPORTS[k].long}</b><p style="font-size:13px">${k === "muscu" ? "Séance vide, avec minuteur de repos" : k === "bodyboard" ? "Spot, durée, vagues, ressenti" : k === "natation" ? "Distance, durée, allure /100 m" : "Temps, distance, allure /km"}</p></span>${IC.right}</button>`).join("")}</div>
    ${DB.routines.length ? `<div class="sec-t">Depuis une routine</div><div class="menu">${DB.routines.map(r => `<button class="btn" data-rstart="${esc(r.id)}">${IC.play} ${esc(r.name)}</button>`).join("")}</div>` : ""}`);
}
function addStarter(){
  STARTER_ROUTINES.forEach(r => DB.routines.push({id:uid(), name:r.name, items:r.items.map(([exId, sets, rest]) => ({exId, sets, rest}))}));
  save(); render(); toast("Routines ajoutées : adapte-les à ta guise");
}

/* ----- Éditeur de routine ----- */
let RT = null;
function openRoutine(id){
  const r = DB.routines.find(x => x.id === id);
  RT = r ? JSON.parse(JSON.stringify(r)) : {id:null, name:"", items:[]};
  drawRoutine();
}
function drawRoutine(){
  const rest = v => `<select data-ri-rest>${[0,30,45,60,75,90,120,150,180,240,300].map(s => `<option value="${s}" ${s === v ? "selected" : ""}>${s ? fClock(s) : "Pas de repos"}</option>`).join("")}</select>`;
  const h = `<form class="f" id="rtForm"><label class="fld"><span>Nom</span><input id="rtName" value="${esc(RT.name)}" placeholder="Ex. Push, Jambes lourdes…" required></label>
    <ul class="exlist">${RT.items.map((it, i) => `<li data-ri="${i}" style="padding:10px 12px"><div style="display:flex;align-items:center;gap:10px"><span class="thumb" style="width:40px;height:40px">${exThumb(exById(it.exId))}</span><b style="flex:1">${esc(exById(it.exId).name)}</b>
      <button type="button" class="icon-btn sm ghost" data-ri-up aria-label="Monter">↑</button><button type="button" class="icon-btn sm ghost" data-ri-del aria-label="Retirer">✕</button></div>
      <div class="row3" style="margin-top:6px"><label class="fld"><span>Séries</span><input type="number" inputmode="numeric" min="1" max="12" value="${it.sets}" data-ri-sets></label><label class="fld"><span>Objectif</span><input value="${esc(it.reps || "")}" placeholder="8–10" data-ri-reps></label><label class="fld"><span>Repos</span>${rest(it.rest)}</label></div></li>`).join("") || `<li style="padding:12px"><p class="empty">Ajoute tes exercices.</p></li>`}</ul>
    <button type="button" class="btn" data-act="rt-add">${IC.plus} Ajouter des exercices</button>
    <button type="submit" class="btn pri wide">Enregistrer la routine</button></form>`;
  openOv(RT.id ? "Modifier la routine" : "Nouvelle routine", h);
  const f = $("#rtForm");
  f.addEventListener("input", e => { if (e.target.id === "rtName") RT.name = e.target.value; const li = e.target.closest("[data-ri]"); if (!li) return; const it = RT.items[+li.dataset.ri];
    if (e.target.matches("[data-ri-reps]")) it.reps = e.target.value.trim(); if (e.target.matches("[data-ri-sets]")) it.sets = Math.max(1, Math.min(12, parseInt(e.target.value) || 1)); if (e.target.matches("[data-ri-rest]")) it.rest = +e.target.value; });
  f.addEventListener("change", e => { const li = e.target.closest("[data-ri]"); if (li && e.target.matches("[data-ri-rest]")) RT.items[+li.dataset.ri].rest = +e.target.value; });
  f.addEventListener("click", e => { const li = e.target.closest("[data-ri]");
    if (e.target.closest("[data-act=rt-add]")) { openPicker(ids => { ids.forEach(id => RT.items.push({exId:id, sets:3, rest:DB.settings.rest})); drawRoutine(); }, drawRoutine); return; }
    if (li && e.target.closest("[data-ri-del]")) { RT.items.splice(+li.dataset.ri, 1); drawRoutine(); }
    if (li && e.target.closest("[data-ri-up]")) { const i = +li.dataset.ri; if (i > 0) { [RT.items[i-1], RT.items[i]] = [RT.items[i], RT.items[i-1]]; drawRoutine(); } } });
  f.addEventListener("submit", e => { e.preventDefault(); RT.name = $("#rtName").value.trim() || "Routine";
    if (RT.id) { const i = DB.routines.findIndex(x => x.id === RT.id); DB.routines[i] = RT; } else { RT.id = uid(); DB.routines.push(RT); }
    save(); closeOv(); render(); toast("Routine enregistrée"); });
}
function routineMenu(id){
  const r = DB.routines.find(x => x.id === id); if (!r) return;
  openOv(r.name, `<div class="menu"><button class="btn" data-rm="edit">Modifier</button><button class="btn" data-rm="dup">Dupliquer</button><button class="btn" data-rm="up">Monter dans la liste</button><button class="btn danger" data-rm="del">Supprimer</button></div>`);
  $("#ovBody").onclick = e => { const b = e.target.closest("[data-rm]"); if (!b) return; const a = b.dataset.rm, i = DB.routines.indexOf(r);
    if (a === "edit") return openRoutine(id);
    if (a === "dup") DB.routines.splice(i + 1, 0, Object.assign(JSON.parse(JSON.stringify(r)), {id:uid(), name:r.name + " (copie)"}));
    if (a === "up" && i > 0) [DB.routines[i-1], DB.routines[i]] = [DB.routines[i], DB.routines[i-1]];
    if (a === "del") { if (!armConfirm(b, "Confirmer la suppression")) return; DB.routines.splice(i, 1); }
    save(); closeOv(); render(); };
}

/* ----- Sélecteur d'exercices ----- */
function openPicker(onDone, onBack, single){
  let q = "", mus = "", sel = [];
  const draw = () => {
    const words = norm(q).split(" ").filter(Boolean);
    const list = allEx().filter(e => (!mus || e.muscle === mus) && words.every(w => norm(e.name + " " + e.muscle + " " + e.equip).includes(w)))
      .sort((a, b) => a.name.localeCompare(b.name, "fr"));
    $("#pkList").innerHTML = list.map(e => `<li><button type="button" class="exr" data-pk="${esc(e.id)}" aria-pressed="${sel.includes(e.id)}"><span class="thumb">${exThumb(e)}</span><span class="ex-t"><b>${esc(e.name)}</b><span>${esc(e.muscle)} · ${esc(e.equip)}</span></span>${single ? "" : `<span class="chk">${sel.includes(e.id) ? IC.check : ""}</span>`}</button></li>`).join("") || `<li style="padding:12px"><p class="empty">Aucun exercice. Crée-le avec le bouton ci-dessous.</p></li>`;
    $("#pkGo").textContent = sel.length ? `Ajouter ${sel.length} exercice${sel.length > 1 ? "s" : ""}` : "Choisis des exercices";
    $("#pkGo").disabled = !sel.length;
  };
  openOv(single ? "Remplacer par…" : "Ajouter des exercices", `<label class="search">${IC.search}<input id="pkQ" placeholder="Rechercher (squat, poulie, épaules…)" autocomplete="off"></label>
    <div class="filters" id="pkF"><button type="button" class="fchip" aria-pressed="true" data-m="">Tous</button>${MUSCLES.map(m => `<button type="button" class="fchip" aria-pressed="false" data-m="${esc(m)}">${esc(m)}</button>`).join("")}</div>
    <ul class="exlist" id="pkList"></ul><button type="button" class="btn small" style="margin-top:10px" data-act="pk-new">${IC.plus} Créer un exercice</button>
    <div style="position:sticky;bottom:-18px;background:var(--surface);padding:12px 0 4px;margin-top:6px;${single ? "display:none" : ""}"><button type="button" class="btn pri wide" id="pkGo">Choisis des exercices</button></div>`, onBack);
  draw();
  $("#pkQ").addEventListener("input", e => { q = e.target.value; draw(); });
  $("#pkF").addEventListener("click", e => { const b = e.target.closest("[data-m]"); if (!b) return; mus = b.dataset.m; $("#pkF").querySelectorAll(".fchip").forEach(x => x.setAttribute("aria-pressed", x === b)); draw(); });
  $("#pkList").addEventListener("click", e => { const b = e.target.closest("[data-pk]"); if (!b) return; const id = b.dataset.pk;
    if (single) { ovOnClose = null; closeOv(); onDone([id]); return; }
    sel = sel.includes(id) ? sel.filter(x => x !== id) : sel.concat(id); draw(); });
  $("#pkGo").addEventListener("click", () => { ovOnClose = null; closeOv(); onDone(sel); });
  $("#ovBody").querySelector("[data-act=pk-new]").addEventListener("click", () => openNewEx(id => { ovOnClose = null; closeOv(); onDone([id]); }, onBack));
}
function openNewEx(onCreated, onBack){
  openOv("Nouvel exercice", `<form class="f" id="neF"><label class="fld"><span>Nom</span><input id="neName" required placeholder="Ex. Rowing Pendlay"></label>
    <label class="fld"><span>Muscle principal</span><select id="neMus">${MUSCLES.map(m => `<option>${esc(m)}</option>`).join("")}</select></label>
    <label class="fld"><span>Matériel</span><select id="neEq">${EQUIP.map(m => `<option>${esc(m)}</option>`).join("")}</select></label>
    <fieldset class="fld"><legend>Ce que tu notes</legend><div class="chips">${chips("kind", [["kg","Poids × reps"],["pdc","Poids du corps (+ lest)"],["reps","Reps seules"],["temps","Durée"]], "kg")}</div></fieldset>
    <button class="btn pri wide">Créer</button></form>`, onBack);
  $("#neF").addEventListener("submit", e => { e.preventDefault(); const ex = {id:"c-" + uid(), name:$("#neName").value.trim(), muscle:$("#neMus").value, equip:$("#neEq").value, kind:radioVal(e.target, "kind") || "kg", custom:true};
    if (!ex.name) return; DB.customEx.push(ex); save(); toast("Exercice créé"); onCreated(ex.id); });
}

/* ---------- Séance de muscu en cours ---------- */
function newExEntry(exId, nSets, rest, fromSets, target){
  const prev = lastPerf(exId); const n = nSets || (prev ? prev.length : 3);
  const sets = Array.from({length:n}, (_, i) => ({t:(fromSets && fromSets[i] && fromSets[i].t) || (prev && prev[i] && prev[i].t === "w" ? "w" : "n"), kg:null, reps:null, sec:null, done:false}));
  return {exId, rest:rest ?? DB.settings.rest, note:"", target:target || "", sets};
}
function startMuscu(routineId, fromWorkout){
  if (DB.active) { showLive(); return; }
  const r = routineId && DB.routines.find(x => x.id === routineId);
  DB.active = {id:uid(), title:r ? r.name : fromWorkout ? fromWorkout.title : "Séance de muscu", routineId:r ? r.id : (fromWorkout && fromWorkout.routineId) || null, startTs:Date.now(), editOf:null,
    exercises:r ? r.items.map(it => newExEntry(it.exId, it.sets, it.rest, null, it.reps)) : fromWorkout ? fromWorkout.exercises.map(ex => newExEntry(ex.exId, ex.sets.length, ex.rest, ex.sets)) : []};
  save(); closeOv(); showLive(); if (!DB.active.exercises.length) addExercisesLive();
}
function editMuscu(w){
  if (DB.active) { toast("Termine d'abord la séance en cours."); return; }
  DB.active = {id:w.id, title:w.title, routineId:w.routineId || null, startTs:null, editOf:w.id, date:w.date, time:w.time, durMin:w.durMin, felt:w.felt, note:w.note,
    exercises:JSON.parse(JSON.stringify(w.exercises)).map(ex => Object.assign(ex, {sets:ex.sets.map(s => Object.assign(s, {done:true}))}))};
  save(); closeOv(); showLive();
}
let tickT = null, wakeLock = null;
function showLive(){ if (!navState().live) navPush("live"); $("#fab").hidden = true; $("#live").hidden = false; document.body.style.overflow = "hidden"; drawLive(); clearInterval(tickT); tickT = setInterval(tickLive, 1000); keepAwake(); }
function hideLive(fromPop){ if (!fromPop && navState().live && !navState().ov) navPopIf("live"); $("#fab").hidden = false; $("#live").hidden = true; document.body.style.overflow = ""; clearInterval(tickT); releaseAwake(); render(); }
async function keepAwake(){ if (!DB.settings.wake || !("wakeLock" in navigator) || !DB.active || DB.active.editOf) return; try { wakeLock = await navigator.wakeLock.request("screen"); } catch (e) {} }
function releaseAwake(){ try { wakeLock && wakeLock.release(); } catch (e) {} wakeLock = null; }
document.addEventListener("visibilitychange", () => { if (!document.hidden) { if (!$("#live").hidden) keepAwake(); restTick(); } });
function liveStats(){ const A = DB.active; let vol = 0, sets = 0; A.exercises.forEach(ex => ex.sets.forEach(s => { if (s.done && s.t !== "w") { sets++; vol += (s.kg||0)*(s.reps||0); } })); return {vol, sets}; }
function tickLive(){ const el = $("#lvTime"); if (el && DB.active && DB.active.startTs) el.textContent = fClock((Date.now() - DB.active.startTs)/1000); }
function drawLive(){
  const A = DB.active; if (!A) return hideLive();
  const st = liveStats();
  let h = `<div class="live-top"><button class="icon-btn" data-lv="min" aria-label="Réduire la séance">${IC.down}</button><div class="lt"><input class="live-title" id="lvTitle" value="${esc(A.title)}" aria-label="Nom de la séance">
    <div class="live-meta"><span>Durée <b id="lvTime">${A.startTs ? fClock((Date.now() - A.startTs)/1000) : fDur(A.durMin)}</b></span><span>Volume <b id="lvVol">${fInt(st.vol)} kg</b></span><span>Séries <b id="lvSets">${st.sets}</b></span></div></div>
    <button class="btn ok small" data-lv="finish">${A.editOf ? "Enregistrer" : "Terminer"}</button></div>`;
  h += A.exercises.map((ex, i) => exCard(ex, i)).join("");
  h += `<button class="btn pri wide" data-lv="addex" style="margin-top:4px">${IC.plus} Ajouter des exercices</button>
    <div class="btns" style="margin-top:10px"><button class="btn danger" data-lv="cancel">${A.editOf ? "Annuler les modifications" : "Abandonner la séance"}</button></div>`;
  $("#liveIn").innerHTML = h;
}
function exCard(ex, i){
  const e = exById(ex.exId), prev = DB.active.editOf ? lastPerf(ex.exId, DB.active.editOf) : lastPerf(ex.exId), k = e.kind;
  let n = 0;
  const cols = k === "temps" ? ["Durée (s)"] : k === "reps" ? ["Reps"] : k === "pdc" ? ["+kg", "Reps"] : ["kg", "Reps"];
  const rows = ex.sets.map((s, j) => { const lab = s.t === "w" ? "É" : s.t === "d" ? "D" : s.t === "f" ? "F" : String(++n);
    const p = prev && prev[j]; const ptxt = p ? (k === "temps" ? fClock(p.sec || 0) : k === "reps" ? `${p.reps || 0}` : `${p.kg ? f1(p.kg) : (k === "pdc" ? "0" : "–")} × ${p.reps || 0}`) : "–";
    const ph = (f) => { const v = p ? p[f] : (j > 0 ? ex.sets[j-1][f] : null); return v != null && v !== "" ? (f === "kg" ? f1(v) : v) : ""; };
    const inp = f => `<input inputmode="${f === "kg" ? "decimal" : "numeric"}" data-f="${f}" value="${s[f] != null ? esc(f === "kg" ? String(s[f]).replace(".", ",") : s[f]) : ""}" placeholder="${esc(ph(f))}" aria-label="${f}">`;
    const cells = k === "temps" ? inp("sec") : k === "reps" ? inp("reps") : inp("kg") + "</td><td>" + inp("reps");
    return `<tr class="${s.done ? "done" : ""}" data-j="${j}"><td><button class="stype ${s.t}" data-s="type" aria-label="Type de série">${lab}</button></td><td><button class="prev" data-s="prev">${esc(ptxt)}</button></td><td>${cells}</td><td><button class="chkb" data-s="done" aria-label="Valider la série">${IC.check}</button></td><td><button class="del-set" data-s="del" aria-label="Supprimer la série">✕</button></td></tr>`; }).join("");
  return `<div class="exc" data-i="${i}"><div class="exc-h"><span class="thumb">${exThumb(e)}</span><button class="exn" data-x="hist">${esc(e.name)}<small>${esc(e.muscle)} · ${esc(e.equip)}</small></button><button class="icon-btn sm ghost" data-x="menu" aria-label="Options">${IC.more}</button></div>
    <div class="exc-sub"><button class="rest-chip" data-x="rest">${IC.clock} ${ex.rest ? "Repos " + fClock(ex.rest) : "Pas de repos"}</button>${ex.target ? `<span class="target">Objectif ${ex.sets.length} × ${esc(ex.target)}</span>` : ""}</div>
    <input class="exc-note" data-x="note" value="${esc(ex.note)}" placeholder="Note (réglage machine, sensation…)">
    <table class="sets"><thead><tr><th style="width:38px">Série</th><th>Précédent</th>${cols.map(c => `<th>${c}</th>`).join("")}<th style="width:40px">✓</th><th style="width:24px"></th></tr></thead><tbody>${rows}</tbody></table>
    <button class="add-set" data-x="addset">+ Ajouter une série</button></div>`;
}
function addExercisesLive(){ openPicker(ids => { ids.forEach(id => DB.active.exercises.push(newExEntry(id))); save(); drawLive(); }); }
const liveIn = $("#liveIn");
liveIn.addEventListener("input", e => {
  const A = DB.active; if (!A) return;
  if (e.target.id === "lvTitle") { A.title = e.target.value; save(); return; }
  const card = e.target.closest(".exc"); if (!card) return; const ex = A.exercises[+card.dataset.i];
  if (e.target.matches("[data-x=note]")) { ex.note = e.target.value; save(); return; }
  const tr = e.target.closest("tr[data-j]"); if (!tr) return; const s = ex.sets[+tr.dataset.j], f = e.target.dataset.f;
  s[f] = f === "kg" ? num(e.target.value) : (num(e.target.value) == null ? null : Math.round(num(e.target.value)));
  save(); if (s.done) updLiveStats();
});
function updLiveStats(){ const st = liveStats(); $("#lvVol") && ($("#lvVol").textContent = `${fInt(st.vol)} kg`); $("#lvSets") && ($("#lvSets").textContent = st.sets); }
liveIn.addEventListener("click", e => {
  const A = DB.active; if (!A) return; unlockAudio();
  const lv = e.target.closest("[data-lv]");
  if (lv) { const a = lv.dataset.lv;
    if (a === "min") return hideLive();
    if (a === "addex") return addExercisesLive();
    if (a === "finish") return finishLive();
    if (a === "cancel") { if (!armConfirm(lv, A.editOf ? "Confirmer : rien ne sera modifié" : "Confirmer l'abandon")) return; DB.active = null; save(); stopRest(); hideLive(); toast(A.editOf ? "Modifications annulées" : "Séance abandonnée"); return; } }
  const card = e.target.closest(".exc"); if (!card) return; const i = +card.dataset.i, ex = A.exercises[i], kind = exById(ex.exId).kind;
  const x = e.target.closest("[data-x]");
  if (x) { const a = x.dataset.x;
    if (a === "addset") { const last = ex.sets[ex.sets.length - 1]; ex.sets.push({t:"n", kg:null, reps:null, sec:null, done:false}); save(); drawLive(); return; }
    if (a === "hist") return openExDetail(ex.exId);
    if (a === "rest") return restPicker(ex.rest, v => { ex.rest = v; save(); drawLive(); });
    if (a === "menu") return exMenu(i);
    return; }
  const sb = e.target.closest("[data-s]"); if (!sb) return; const tr = sb.closest("tr[data-j]"), j = +tr.dataset.j, s = ex.sets[j];
  if (sb.dataset.s === "type") { s.t = {n:"w", w:"d", d:"f", f:"n"}[s.t] || "n"; save(); drawLive(); return; }
  if (sb.dataset.s === "del") { ex.sets.splice(j, 1); save(); drawLive(); return; }
  if (sb.dataset.s === "prev") { const p = (A.editOf ? lastPerf(ex.exId, A.editOf) : lastPerf(ex.exId)) || []; if (p[j]) { s.kg = p[j].kg; s.reps = p[j].reps; s.sec = p[j].sec; save(); drawLive(); } return; }
  if (sb.dataset.s === "done") {
    if (!s.done) { // remplit avec la valeur suggérée si vide
      tr.querySelectorAll("input[data-f]").forEach(inp => { const f = inp.dataset.f; if (s[f] == null && inp.placeholder !== "") s[f] = f === "kg" ? num(inp.placeholder) : Math.round(num(inp.placeholder)); });
      const okv = kind === "temps" ? s.sec : kind === "kg" ? (s.reps != null) : s.reps;
      if (!okv && kind !== "kg") { toast("Indique d'abord la valeur de la série."); return; }
      if (kind === "kg" && s.reps == null) { toast("Indique d'abord le nombre de reps."); return; }
      if (kind === "kg" && s.kg == null) s.kg = 0;
      s.done = true; save(); drawLive(); if (ex.rest) startRest(ex.rest, exById(ex.exId).name);
      if (navigator.vibrate && DB.settings.sound) navigator.vibrate(30);
    } else { s.done = false; save(); drawLive(); }
  }
});
function exMenu(i){
  const A = DB.active, ex = A.exercises[i], e = exById(ex.exId);
  openOv(e.name, `<div class="menu"><button class="btn" data-em="hist">Historique et records</button><button class="btn" data-em="swap">Remplacer l'exercice</button><button class="btn" data-em="up" ${i === 0 ? "disabled" : ""}>Monter</button><button class="btn" data-em="down" ${i === A.exercises.length - 1 ? "disabled" : ""}>Descendre</button><button class="btn danger" data-em="del">Retirer de la séance</button></div>`);
  $("#ovBody").onclick = ev => { const b = ev.target.closest("[data-em]"); if (!b) return; const a = b.dataset.em;
    if (a === "hist") return openExDetail(ex.exId);
    if (a === "swap") return openPicker(ids => { const n = newExEntry(ids[0], ex.sets.length, ex.rest); A.exercises[i] = n; save(); drawLive(); }, null, true);
    if (a === "up" && i > 0) [A.exercises[i-1], A.exercises[i]] = [A.exercises[i], A.exercises[i-1]];
    if (a === "down" && i < A.exercises.length - 1) [A.exercises[i+1], A.exercises[i]] = [A.exercises[i], A.exercises[i+1]];
    if (a === "del") { if (!armConfirm(b, "Confirmer")) return; A.exercises.splice(i, 1); }
    save(); closeOv(); drawLive(); };
}
function restPicker(cur, onPick){
  openOv("Temps de repos", `<div class="chips">${[0,30,45,60,75,90,105,120,150,180,240,300].map(s => `<label><input type="radio" name="rp" value="${s}" ${s === cur ? "checked" : ""}><span>${s ? fClock(s) : "Aucun"}</span></label>`).join("")}</div><p class="note-s" style="margin-top:10px">Le minuteur se lance quand tu valides une série de cet exercice.</p>`);
  $("#ovBody").onchange = e => { if (e.target.name === "rp") { onPick(+e.target.value); closeOv(); } };
}
function finishLive(){
  const A = DB.active;
  const exs = A.exercises.map(ex => Object.assign({}, ex, {sets:ex.sets.filter(s => s.done).map(({done, ...s}) => s)})).filter(ex => ex.sets.length);
  if (!exs.length) { toast("Valide au moins une série (✓) avant de terminer."); return; }
  const undone = A.exercises.reduce((n, ex) => n + ex.sets.filter(s => !s.done).length, 0);
  const durMin = A.editOf ? A.durMin : Math.max(1, Math.round((Date.now() - A.startTs)/60000));
  const start = A.startTs ? new Date(A.startTs) : null;
  const w = {id:A.editOf || A.id, sport:"muscu", title:A.title.trim() || "Séance de muscu", routineId:A.routineId, date:A.date || (start ? dISO(start) : todayISO()), time:A.time || (start ? `${pad(start.getHours())}:${pad(start.getMinutes())}` : nowHM()), durMin, exercises:exs, felt:A.felt || null, note:A.note || "", createdAt:new Date().toISOString()};
  // records : meilleur 1RM estimé ou charge max dépassés
  const prs = []; exs.forEach(ex => { const hist = exHistory(ex.exId).filter(h => h.w.id !== w.id); if (!hist.length) return; const b = bestSet(ex); if (!b) return;
    const prevE = Math.max(...hist.map(h => h.e1)), prevM = Math.max(...hist.map(h => h.max)), mx = Math.max(...workSets(ex).map(s => s.kg || 0));
    if ((b.v > prevE + 0.01 && b.v > 0) || (mx > prevM && mx > 0)) prs.push(ex.exId); });
  w.prs = prs;
  const r = A.routineId && DB.routines.find(x => x.id === A.routineId);
  const routineChanged = r && (r.items.length !== exs.length || r.items.some((it, k) => it.exId !== exs[k].exId || it.sets !== exs[k].sets.length));
  openOv(A.editOf ? "Enregistrer les modifications" : "Bravo, séance terminée", `<div class="stats3"><div class="stat"><b>${fDur(durMin)}</b><span>durée</span></div><div class="stat"><b>${fInt(wVolume(w))}</b><span>kg soulevés</span></div><div class="stat"><b>${wSets(w)}</b><span>séries</span></div></div>
    ${prs.length ? `<p style="margin:0 0 12px"><span class="pr">${IC.trophy} Record${prs.length > 1 ? "s" : ""}</span> ${prs.map(p => esc(exById(p).name)).join(", ")}</p>` : ""}
    ${undone ? `<p class="note-s" style="margin-bottom:12px">${undone} série${undone > 1 ? "s" : ""} non validée${undone > 1 ? "s" : ""} ne ser${undone > 1 ? "ont" : "a"} pas enregistrée${undone > 1 ? "s" : ""}.</p>` : ""}
    <form class="f" id="finF"><label class="fld"><span>Nom</span><input id="finTitle" value="${esc(w.title)}"></label>
    <div class="row2"><label class="fld"><span>Date</span><input type="date" id="finDate" value="${w.date}"></label><label class="fld"><span>Durée (min)</span><input type="number" inputmode="numeric" id="finDur" value="${durMin}"></label></div>
    <fieldset class="fld"><legend>Ressenti (facultatif)</legend><div class="chips">${chips("felt", Array.from({length:10}, (_, k) => [k+1, k+1]), w.felt)}</div></fieldset>
    <label class="fld"><span>Note</span><textarea id="finNote" placeholder="Forme du jour, douleurs, sommeil…">${esc(w.note)}</textarea></label>
    ${routineChanged ? `<label style="display:flex;gap:8px;align-items:center;font-size:14.5px"><input type="checkbox" id="finRt"> Mettre à jour la routine « ${esc(r.name)} » avec ces exercices</label>` : ""}
    <button class="btn ok wide">Enregistrer</button><button type="button" class="btn flat" data-close>Continuer la séance</button></form>`);
  $("#finF").addEventListener("submit", e => { e.preventDefault();
    w.title = $("#finTitle").value.trim() || w.title; w.date = $("#finDate").value || w.date; w.durMin = Math.max(1, parseInt($("#finDur").value) || durMin);
    const fv = radioVal(e.target, "felt"); w.felt = fv ? +fv : null; w.note = $("#finNote").value.trim();
    if ($("#finRt") && $("#finRt").checked) r.items = exs.map(ex => ({exId:ex.exId, sets:ex.sets.length, rest:ex.rest}));
    const k = DB.workouts.findIndex(x => x.id === w.id); if (k >= 0) DB.workouts[k] = w; else DB.workouts.push(w);
    const rr = A.routineId && DB.routines.find(x => x.id === A.routineId); if (!A.editOf && rr && rr.prog && DB.plans.muscu && DB.plans.muscu.id === rr.prog) DB.plans.muscu.n++;
    DB.active = null; save(); stopRest(); { const d = navState().d || 0; if (d) { ignorePop++; history.go(-d); } } closeOv(true); hideLive(true); TAB = "home"; render(); toast(prs.length ? "Séance enregistrée, avec un record !" : "Séance enregistrée"); });
}

/* ---------- Minuteur de repos ---------- */
let REST = null, restT = null, actx = null;
function unlockAudio(){ if (actx || !DB.settings.sound) return; try { actx = new (window.AudioContext || window.webkitAudioContext)(); } catch (e) {} }
function beep(){ if (!DB.settings.sound) return; try { unlockAudio(); if (!actx) return; if (actx.state === "suspended") actx.resume();
  [0, .22, .44].forEach((t, i) => { const o = actx.createOscillator(), g = actx.createGain(); o.frequency.value = i === 2 ? 1320 : 880; o.connect(g); g.connect(actx.destination);
    const t0 = actx.currentTime + t; g.gain.setValueAtTime(.0001, t0); g.gain.exponentialRampToValueAtTime(.35, t0 + .02); g.gain.exponentialRampToValueAtTime(.0001, t0 + .18); o.start(t0); o.stop(t0 + .2); }); } catch (e) {} }
function startRest(sec, label){ REST = {end:Date.now() + sec*1000, total:sec, label}; $("#restbar").hidden = false; $("#rbLabel").textContent = "Repos · " + label; clearInterval(restT); restT = setInterval(restTick, 250); restTick(); }
function stopRest(){ REST = null; clearInterval(restT); $("#restbar").hidden = true; }
function restTick(){ if (!REST) return; const left = (REST.end - Date.now())/1000;
  if (left <= 0) { const lab = REST.label; stopRest(); beep(); if (navigator.vibrate && DB.settings.sound) navigator.vibrate([250, 120, 250]);
    if (document.hidden && "Notification" in window && Notification.permission === "granted" && navigator.serviceWorker) navigator.serviceWorker.ready.then(r => r.showNotification("Repos terminé", {body:"À toi : " + lab, tag:"rest", icon:"icon-192.png", vibrate:[250,120,250]})).catch(() => {});
    toast("Repos terminé, à toi !"); return; }
  $("#rbTime").textContent = fClock(Math.ceil(left)); $("#rbFill").style.width = `${100 - left / REST.total * 100}%`; }
$("#restbar").addEventListener("click", e => { const b = e.target.closest("[data-rest]"); if (!b || !REST) return; const v = b.dataset.rest;
  if (v === "skip") return stopRest(); REST.end += +v * 1000; REST.total = Math.max(REST.total + +v, 1); restTick(); });

/* ---------- Bodyboard / natation / course ---------- */
const durFields = (sec, withSec) => { sec = sec || 0; const h = Math.floor(sec/3600), m = Math.floor(sec%3600/60), s = Math.round(sec%60);
  return `<div class="${withSec ? "row3" : "row2"}"><label class="fld"><span>Heures</span><input type="number" inputmode="numeric" min="0" id="dH" value="${sec ? h : ""}" placeholder="0"></label><label class="fld"><span>Minutes</span><input type="number" inputmode="numeric" min="0" max="59" id="dM" value="${sec ? m : ""}" placeholder="0"></label>${withSec ? `<label class="fld"><span>Secondes</span><input type="number" inputmode="numeric" min="0" max="59" id="dS" value="${sec ? s : ""}" placeholder="0"></label>` : ""}</div>`; };
const readDur = () => (parseInt($("#dH").value) || 0) * 3600 + (parseInt($("#dM").value) || 0) * 60 + ($("#dS") ? parseInt($("#dS").value) || 0 : 0);
function openSportForm(sport, w, pre){
  w = w || {}; pre = pre || {}; const v = Object.assign({}, pre, w);
  const base = `<div class="row2"><label class="fld"><span>Date</span><input type="date" id="sDate" value="${v.date || todayISO()}"></label><label class="fld"><span>Heure de début</span><input type="time" id="sTime" value="${v.time || nowHM()}"></label></div>`;
  const felt = `<fieldset class="fld"><legend>Ressenti</legend><div class="chips">${chips("felt", Array.from({length:10}, (_, k) => [k+1, k+1]), v.felt)}</div></fieldset>`;
  const note = `<label class="fld"><span>Note</span><textarea id="sNote" placeholder="${sport === "bodyboard" ? "Ce qui a marché, à travailler (duck dive, placement…)" : "Sensations, météo, douleurs…"}">${esc(v.note || "")}</textarea></label>`;
  let h = (v.planDesc ? `<div class="calc" style="margin-bottom:14px"><b style="font-size:16px">${esc(v.title)}</b><br>${esc(v.planDesc)}</div>` : "") + `<form class="f" id="spF">`;
  if (sport === "bodyboard") {
    const known = SPOTS.some(s => s.id === v.spot);
    h += `<label class="fld"><span>Spot</span><select id="sSpot">${SPOTS.map(s => `<option value="${esc(s.id)}" ${s.id === v.spot ? "selected" : ""}>${esc(s.name)}${s.town ? " · " + esc(s.town) : ""}</option>`).join("")}<option value="__autre" ${v.spot && !known ? "selected" : ""}>Autre spot…</option></select></label>
      <label class="fld" id="sOtherW" ${v.spot && !known ? "" : "hidden"}><span>Nom du spot</span><input id="sOther" value="${esc(!known ? (v.spotName || v.spot || "") : "")}"></label>
      ${base}<p class="note-s" style="margin-top:-8px">Durée dans l'eau</p>${durFields(v.durSec || (v.durMin ? v.durMin*60 : 0), false)}
      <div class="row2"><label class="fld"><span>Vagues prises</span><input type="number" inputmode="numeric" min="0" id="sWaves" value="${v.waves ?? ""}"></label><fieldset class="fld"><legend>Planche</legend><div class="chips">${chips("board", [["bb","Bodyboard"],["surf","Surf"]], v.board === "surf" ? "surf" : "bb")}</div></fieldset></div>
      ${felt}
      <fieldset class="fld"><legend>Taille par rapport à la prévision</legend><div class="chips">${chips("size", Object.entries(MV_SIZE), v.size)}</div></fieldset>
      <fieldset class="fld"><legend>Forme des vagues</legend><div class="chips">${chips("shape", Object.entries(MV_SHAPE), v.shape)}</div></fieldset>
      <fieldset class="fld"><legend>Plan d'eau</legend><div class="chips">${chips("wind", Object.entries(MV_WIND), v.wind)}</div></fieldset>${note}`;
  }
  if (sport === "natation") {
    h += base + `<p class="note-s" style="margin-top:-8px">Durée</p>${durFields(v.durSec, true)}
      <label class="fld"><span>Distance (m)</span><input type="number" inputmode="numeric" min="0" step="25" id="sDist" value="${v.dist ?? ""}" placeholder="Ex. 1500"></label>
      <fieldset class="fld"><legend>Où</legend><div class="chips">${chips("pool", [["25","Bassin 25 m"],["50","Bassin 50 m"],["mer","Mer"]], v.pool || "25")}</div></fieldset>
      <fieldset class="fld"><legend>Nage principale</legend><div class="chips">${chips("stroke", [["crawl","Crawl"],["brasse","Brasse"],["dos","Dos"],["papillon","Papillon"],["mixte","Mixte"]], v.stroke || "crawl")}</div></fieldset>
      <div class="calc" id="sCalc"></div>${felt}${note}`;
  }
  if (sport === "course") {
    h += `<fieldset class="fld"><legend>Type de sortie</legend><div class="chips">${chips("kind", [["footing","Footing"],["fractionne","Fractionné"],["longue","Sortie longue"],["course","Course"],["trail","Trail"],["tapis","Tapis"]], v.kind || "footing")}</div></fieldset>
      ${base}<p class="note-s" style="margin-top:-8px">Temps</p>${durFields(v.durSec, true)}
      <div class="row3"><label class="fld"><span>Distance (km)</span><input inputmode="decimal" id="sDist" value="${v.dist != null ? String(v.dist).replace(".", ",") : ""}" placeholder="5,0"></label><label class="fld"><span>D+ (m)</span><input type="number" inputmode="numeric" id="sElev" value="${v.elev ?? ""}"></label><label class="fld"><span>FC moy.</span><input type="number" inputmode="numeric" id="sHr" value="${v.hr ?? ""}"></label></div>
      <div class="calc" id="sCalc"></div>${felt}${note}`;
  }
  h += `<p class="err" id="sErr" hidden></p><button class="btn pri wide">Enregistrer</button></form>`;
  openOv(w.id ? "Modifier · " + SPORTS[sport].label : SPORTS[sport].long, h);
  const f = $("#spF");
  const calc = () => { const c = $("#sCalc"); if (!c) return; const sec = readDur(), d = num($("#sDist").value);
    if (!sec || !d) { c.innerHTML = sport === "course" ? "Renseigne le temps et la distance pour voir ton allure." : "Renseigne la durée et la distance pour voir ton allure."; return; }
    if (sport === "course") c.innerHTML = `Allure <b>${fPace(sec/d)}</b> /km · vitesse <b>${f1(d / (sec/3600))}</b> km/h`;
    else { const pool = radioVal(f, "pool"); c.innerHTML = `Allure <b>${fPace(sec / (d/100))}</b> /100 m${pool && pool !== "mer" ? ` · <b>${Math.round(d / +pool)}</b> longueurs` : ""}`; } };
  f.addEventListener("input", calc); calc();
  f.addEventListener("change", e => { if (e.target.id === "sSpot") $("#sOtherW").hidden = e.target.value !== "__autre"; calc(); });
  f.addEventListener("submit", e => { e.preventDefault(); const err = $("#sErr");
    const sec = readDur(); const out = {id:w.id || uid(), sport, date:$("#sDate").value || todayISO(), time:$("#sTime").value || "", durSec:sec || null, durMin:sec ? Math.round(sec/60) : null, note:$("#sNote").value.trim(), createdAt:w.createdAt || new Date().toISOString()};
    const fv = radioVal(f, "felt"); out.felt = fv ? +fv : null;
    if (sport === "bodyboard") { const sp = $("#sSpot").value; if (sp === "__autre") { out.spot = norm($("#sOther").value).replace(/ /g, "-") || "autre"; out.spotName = $("#sOther").value.trim() || "Autre spot"; } else { out.spot = sp; out.spotName = spotName(sp); }
      out.waves = num($("#sWaves").value); out.board = radioVal(f, "board") === "surf" ? "surf" : "bb"; out.size = radioVal(f, "size"); out.shape = radioVal(f, "shape"); out.wind = radioVal(f, "wind"); out.mvId = v.mvId || null;
      if (!sec) { err.textContent = "Indique combien de temps tu es resté à l'eau."; err.hidden = false; return; } }
    if (sport === "natation") { out.dist = num($("#sDist").value); out.pool = radioVal(f, "pool"); out.stroke = radioVal(f, "stroke"); if (!sec && !out.dist) { err.textContent = "Indique au moins la durée ou la distance."; err.hidden = false; return; } }
    if (sport === "course") { out.dist = num($("#sDist").value); out.elev = num($("#sElev").value); out.hr = num($("#sHr").value); out.kind = radioVal(f, "kind"); if (!sec && !out.dist) { err.textContent = "Indique au moins le temps ou la distance."; err.hidden = false; return; } }
    if (v.title) out.title = v.title; if (v.planKey) { out.planKey = v.planKey; if (DB.plans[sport]) DB.plans[sport].done[v.planKey] = out.id; }
    const k = DB.workouts.findIndex(x => x.id === out.id); if (k >= 0) DB.workouts[k] = out; else DB.workouts.push(out);
    save(); closeOv(); render(); toast(v.planKey ? "Séance enregistrée et cochée dans ton programme" : "Séance enregistrée"); });
}
function openMV(){
  const p = mvPending().sort((a, b) => String(b.date).localeCompare(String(a.date)));
  if (!p.length) { closeOv(); render(); toast("Tout ton carnet Mes Vagues est ajouté"); return; }
  openOv("Carnet Mes Vagues", `<p class="note-s" style="margin-bottom:10px">Ces sessions sont dans Mes Vagues. Ajoute-les ici en précisant la durée et les vagues prises.</p><ul class="exlist">${p.map(s => `<li style="padding:10px 12px;display:flex;gap:10px;align-items:center"><span class="ex-t"><b>${esc(spotName(s.spot))}</b><span>${esc(fDate(s.date))} · ${esc(s.hour)}h · ressenti ${esc(s.felt)}/10</span></span><button class="btn small pri" data-mva="${esc(s.id)}">Ajouter</button><button class="btn small flat" data-mvs="${esc(s.id)}">Ignorer</button></li>`).join("")}</ul>`);
  $("#ovBody").onclick = e => { const a = e.target.closest("[data-mva]"), s = e.target.closest("[data-mvs]");
    if (s) { DB.mvSkip.push(s.dataset.mvs); save(); openMV(); return; }
    if (a) { const m = p.find(x => x.id === a.dataset.mva); openSportForm("bodyboard", null, {mvId:m.id, spot:m.spot, spotName:spotName(m.spot), date:m.date, time:`${pad(m.hour || 10)}:00`, felt:m.felt, size:m.size, shape:m.shape, wind:m.wind, board:m.board === "surf" ? "surf" : "bb", note:m.comment || ""}); } };
}

/* ---------- Exercices ---------- */
let EXQ = "", EXM = "";
function renderEx(){
  const all = allEx();
  $("#viewTitle").textContent = "Exercices"; $("#viewSub").textContent = `${all.length} exercices, rangés par groupe musculaire`;
  const done = new Set(); DB.workouts.forEach(w => (w.exercises || []).forEach(ex => done.add(ex.exId)));
  const groups = MUSCLES.concat([...new Set(all.map(e => e.muscle))].filter(m => !MUSCLES.includes(m)));
  $("#view").innerHTML = `<label class="search">${IC.search}<input id="exQ" placeholder="Rechercher : squat, poulie, épaules…" value="${esc(EXQ)}" autocomplete="off"></label>
    <div class="filters" id="exF"><button class="fchip" data-m="" aria-pressed="${!EXM}">Tous</button><button class="fchip" data-m="__done" aria-pressed="${EXM === "__done"}">Déjà faits</button>${groups.map(m => `<button class="fchip" data-m="${esc(m)}" aria-pressed="${EXM === m}">${esc(m)}</button>`).join("")}</div>
    <div id="exList"></div><button class="btn small line" style="margin-top:16px" data-act="ex-new">${IC.plus} Créer un exercice</button>`;
  const draw = () => { const words = norm(EXQ).split(" ").filter(Boolean);
    const list = all.filter(e => (EXM === "__done" ? done.has(e.id) : !EXM || e.muscle === EXM) && words.every(w => norm(e.name + " " + e.muscle + " " + e.equip).includes(w)));
    const html = groups.map(m => { const es = list.filter(e => e.muscle === m).sort((a, b) => a.name.localeCompare(b.name, "fr")); if (!es.length) return "";
      return `<section class="grp"><div class="grp-h">${muscleMap(m, [])}<b>${esc(m)}</b><span>${es.length}</span></div><ul class="exlist">${es.map(e => { const hs = done.has(e.id) ? exHistory(e.id) : []; const best = hs.length ? Math.max(...hs.map(x => x.e1)) : 0;
        return `<li><button class="exr" data-exd="${esc(e.id)}"><span class="thumb">${exThumb(e)}</span><span class="ex-t"><b>${esc(e.name)}</b><span>${esc(e.equip)}${hs.length ? ` · ${pl(hs.length, "séance")}` : ""}</span></span>${best ? `<span class="ex-m">1RM est.<b>${f1(best)} kg</b></span>` : ""}</button></li>`; }).join("")}</ul></section>`; }).join("");
    $("#exList").innerHTML = html || `<div class="card" style="margin-top:14px"><p class="empty">Aucun exercice trouvé.</p></div>`; };
  draw();
  $("#exQ").addEventListener("input", e => { EXQ = e.target.value; draw(); });
  $("#exF").addEventListener("click", e => { const b = e.target.closest("[data-m]"); if (!b) return; EXM = b.dataset.m; $("#exF").querySelectorAll(".fchip").forEach(x => x.setAttribute("aria-pressed", x === b)); draw(); });
}
function lineChart(pts, unit){
  if (pts.length < 2) return "";
  const W = 340, H = 150, P = {l:30, r:8, t:10, b:20};
  const xs = pts.map(p => pDate(p.d).getTime()), ys = pts.map(p => p.v);
  const x0 = Math.min(...xs), x1 = Math.max(...xs), lo = Math.min(...ys), hi = Math.max(...ys), pad_ = (hi - lo) * .15 || hi * .1 || 1, y0 = Math.max(0, lo - pad_), y1 = hi + pad_;
  const X = t => P.l + (x1 === x0 ? .5 : (t - x0)/(x1 - x0)) * (W - P.l - P.r), Y = v => H - P.b - (v - y0)/(y1 - y0) * (H - P.t - P.b);
  const d = pts.map((p, i) => `${i ? "L" : "M"}${X(xs[i]).toFixed(1)},${Y(p.v).toFixed(1)}`).join("");
  const ticks = [y0, (y0 + y1)/2, y1].map(v => `<text x="${P.l - 6}" y="${Y(v) + 4}" text-anchor="end" font-size="11" fill="var(--muted)">${Math.round(v)}</text><line x1="${P.l}" x2="${W - P.r}" y1="${Y(v)}" y2="${Y(v)}" stroke="var(--line)"/>`).join("");
  const fd = t => { const dd = new Date(t); return `${dd.getDate()} ${MON_S[dd.getMonth()]}`; };
  return `<svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Progression">${ticks}<path class="ln" d="${d}" fill="none" stroke="var(--accent)" stroke-width="2.5" stroke-linejoin="round"/>${pts.map((p, i) => `<circle cx="${X(xs[i])}" cy="${Y(p.v)}" r="3.5" fill="var(--accent)"><title>${fd(xs[i])} : ${f1(p.v)} ${unit}</title></circle>`).join("")}
    <text x="${P.l}" y="${H - 4}" font-size="11" fill="var(--muted)">${fd(x0)}</text><text x="${W - P.r}" y="${H - 4}" font-size="11" fill="var(--muted)" text-anchor="end">${fd(x1)}</text></svg>`;
}
function openExDetail(exId){
  const e = exById(exId), hs = exHistory(exId), k = e.kind, info = figInfo(e);
  let h = `<p class="note-s" style="margin:-6px 0 12px">${esc(e.muscle)} · ${esc(e.equip)}${e.custom ? " · exercice perso" : ""}</p>
    ${exHero(e)}<div class="ex-info"><div class="mm-box">${muscleMap(e.muscle, info.sec)}</div><div class="ex-facts"><div><span>Muscle principal</span><b>${esc(e.muscle)}</b></div>${info.sec && info.sec.length ? `<div><span>Secondaires</span><b>${info.sec.map(esc).join(", ")}</b></div>` : ""}<div><span>Matériel</span><b>${esc(e.equip)}</b></div></div></div>
    <div class="sec-t" style="margin-top:4px">Consignes</div><ul class="tips">${(info.tips || []).map(t => `<li>${esc(t)}</li>`).join("")}</ul>`;
  if (DB.active && !DB.active.exercises.some(x => x.exId === exId)) h += `<button class="btn pri wide" style="margin-top:12px" data-addlive="${esc(exId)}">${IC.plus} Ajouter à la séance en cours</button>`;
  h += `<div class="sec-t">Ta progression</div>`;
  if (!hs.length) h += `<p class="empty">Pas encore fait. Ta progression apparaîtra ici dès la première séance.</p>`;
  else {
    const metric = k === "kg" ? "e1" : k === "temps" ? "sec" : "reps";
    const best = Math.max(...hs.map(x => x[metric])), mx = Math.max(...hs.map(x => x.max)), vol = Math.max(...hs.map(x => x.vol));
    h += `<div class="stats3">${k === "kg" ? `<div class="stat"><b>${f1(best)}</b><span>1RM estimé (kg)</span></div><div class="stat"><b>${f1(mx)}</b><span>charge max (kg)</span></div><div class="stat"><b>${fInt(vol)}</b><span>meilleur volume</span></div>`
      : k === "temps" ? `<div class="stat"><b>${fClock(best)}</b><span>meilleur temps</span></div><div class="stat"><b>${hs.length}</b><span>séances</span></div><div class="stat"><b>${f1(mx)}</b><span>lest max (kg)</span></div>`
      : `<div class="stat"><b>${best}</b><span>reps max</span></div><div class="stat"><b>${hs.length}</b><span>séances</span></div><div class="stat"><b>${f1(mx)}</b><span>lest max (kg)</span></div>`}</div>`;
    const pts = hs.slice().reverse().map(x => ({d:x.w.date, v:x[metric]})).filter(p => p.v > 0);
    if (pts.length >= 2) h += `<p class="note-s">${k === "kg" ? "1RM estimé (kg), meilleure série de chaque séance" : k === "temps" ? "Meilleur temps (s)" : "Reps max par séance"}</p>` + lineChart(pts, k === "kg" ? "kg" : k === "temps" ? "s" : "reps");
    h += `<table class="tbl" style="margin-top:10px"><thead><tr><th>Date</th><th>Séries</th><th>Meilleure</th></tr></thead><tbody>${hs.slice(0, 15).map(x => `<tr><td>${fDate(x.w.date)}${(x.w.prs || []).includes(exId) ? ` <span class="pr">${IC.trophy}</span>` : ""}</td><td>${workSets(x.ex).length}</td><td>${x.best ? setTxt(x.best, k) : x.ex.sets[0] ? setTxt(x.ex.sets[0], k) : "–"}</td></tr>`).join("")}</tbody></table>`;
  }
  if (e.custom) h += `<div class="btns" style="margin-top:14px"><button class="btn danger line" data-delex="${esc(e.id)}">Supprimer cet exercice perso</button></div>`;
  openOv(e.name, h);
}

/* ---------- Mon profil ---------- */
const MEAS = [
  ["weight","Poids","kg","Le matin, à jeun, sur la même balance."],
  ["bodyfat","Masse grasse","%","Toujours avec la même méthode (balance ou pince)."],
  ["neck","Tour de cou","cm","Sous la pomme d'Adam, mètre bien horizontal."],
  ["shoulders","Tour d'épaules","cm","Au plus large des épaules, bras relâchés."],
  ["chest","Tour de poitrine","cm","Sous les aisselles, à mi-souffle."],
  ["biceps","Tour de biceps","cm","Bras contracté, au plus gros, toujours le même bras."],
  ["forearm","Tour d'avant-bras","cm","Au plus large, poing serré."],
  ["wrist","Tour de poignet","cm","Juste au-dessus de l'os."],
  ["waist","Tour de taille","cm","Au nombril, ventre relâché."],
  ["hips","Tour de hanches","cm","Au plus large des fessiers, pieds joints."],
  ["thigh","Tour de cuisse","cm","Au plus gros, juste sous le pli fessier."],
  ["calf","Tour de mollet","cm","Au plus gros, debout."]
];
let PROF = "corps";
const lastMeas = k => { const m = DB.measures.filter(x => x[k] != null).sort((a, b) => b.date.localeCompare(a.date)); return m; };
function ageOf(b){ if (!b) return null; const d = pDate(b), n = new Date(); let a = n.getFullYear() - d.getFullYear(); if (n.getMonth() < d.getMonth() || (n.getMonth() === d.getMonth() && n.getDate() < d.getDate())) a--; return a; }
const fmtv = (v, u) => `${f1(v)}${u === "%" ? " %" : " " + u}`;
function spark(vals){ if (vals.length < 2) return ""; const lo = Math.min(...vals), hi = Math.max(...vals), r = hi - lo || 1;
  const pts = vals.map((v, i) => `${(i / (vals.length - 1) * 60).toFixed(1)},${(18 - (v - lo) / r * 16).toFixed(1)}`).join(" ");
  return `<svg class="spark" viewBox="0 -1 60 21"><polyline points="${pts}" fill="none" stroke="var(--accent)" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round"/></svg>`; }
function renderProfile(){
  $("#viewTitle").textContent = "Mon profil"; $("#viewSub").textContent = "Ton corps, tes mensurations et tes progrès";
  let h = `<div class="seg full" style="margin-bottom:14px"><button data-prof="corps" aria-pressed="${PROF === "corps"}">Corps</button><button data-prof="progres" aria-pressed="${PROF === "progres"}">Progrès</button></div>`;
  if (PROF === "progres") { renderStats(); $("#viewTitle").textContent = "Mon profil"; $("#viewSub").textContent = "Ton corps, tes mensurations et tes progrès"; $("#view").insertAdjacentHTML("afterbegin", h); return; }
  const P = DB.profile, age = ageOf(P.birth), w = lastMeas("weight"), wNow = w[0] && w[0].weight;
  const ini = (P.name || "?").trim().slice(0, 1).toUpperCase();
  const facts = [age != null ? `${age} ans` : "", P.height ? `${(P.height / 100).toFixed(2).replace(".", ",")} m` : "", wNow ? fmtv(wNow, "kg") : ""].filter(Boolean).join(" · ");
  h += `<div class="card prof-c"><div class="avatar">${esc(ini)}</div><div style="flex:1;min-width:0"><b class="prof-n">${esc(P.name || "Ton profil")}</b><p class="note-s">${facts || "Ajoute ta taille, ton âge et ton poids"}</p>${(P.sports || []).length ? `<div class="meta" style="display:flex;gap:5px;flex-wrap:wrap;margin-top:6px">${P.sports.map(s => `<span class="pill on c-${s}">${SPORTS[s].label}</span>`).join("")}</div>` : ""}</div><button class="icon-btn sm" data-act="edit-prof" aria-label="Modifier le profil">${IC.edit}</button></div>`;
  // poids
  const wPrev30 = w.find(x => (pDate(w[0] ? w[0].date : todayISO()) - pDate(x.date)) / 864e5 >= 28);
  const bmi = wNow && P.height ? wNow / Math.pow(P.height / 100, 2) : null;
  h += `<div class="kpis"><div class="kpi"><b>${wNow ? f1(wNow) : "–"}</b><span>kg${wPrev30 ? ` · ${wNow - wPrev30.weight >= 0 ? "+" : "−"}${f1(Math.abs(wNow - wPrev30.weight))} en 1 mois` : ""}</span></div><div class="kpi"><b>${P.goal ? f1(P.goal) : "–"}</b><span>objectif (kg)${P.goal && wNow ? ` · ${f1(Math.abs(wNow - P.goal))} à ${wNow > P.goal ? "perdre" : "prendre"}` : ""}</span></div><div class="kpi"><b>${bmi ? f1(bmi) : "–"}</b><span>IMC</span></div></div>`;
  if (w.length >= 2) h += `<div class="sec-t">Évolution du poids</div><div class="card">${lineChart(w.slice().reverse().map(x => ({d:x.date, v:x.weight})), "kg")}</div>`;
  h += `<div class="sec-t">Mensurations <button class="link-btn" data-act="new-meas">+ Nouvelle mesure</button></div><div class="meas-g">`;
  h += MEAS.map(([k, l, u]) => { const m = lastMeas(k); const v = m[0] && m[0][k], first = m.length > 1 ? m[m.length - 1] : null, dv = first ? v - first[k] : null;
    return `<button class="meas" data-meas="${k}"><span class="ml">${esc(l)}</span><b>${v != null ? fmtv(v, u) : "–"}</b><span class="md">${dv != null ? `${dv >= 0 ? "+" : "−"}${f1(Math.abs(dv))} ${u} depuis le ${fDate(first.date).replace(/^\S+ /, "")}` : m.length ? fDate(m[0].date) : "Pas encore mesuré"}</span>${spark(m.slice(0, 12).reverse().map(x => x[k]))}</button>`; }).join("") + `</div>`;
  h += `<button class="btn pri wide" style="margin-top:14px" data-act="new-meas">${IC.plus} Nouvelle mesure</button><p class="note-s" style="margin-top:10px;text-align:center">Mesure-toi le matin, toutes les 2 à 4 semaines, au même endroit à chaque fois.</p>`;
  $("#view").innerHTML = h;
}
function openProfileForm(){
  const P = DB.profile;
  openOv("Mon profil", `<form class="f" id="pfF"><label class="fld"><span>Prénom</span><input id="pfName" value="${esc(P.name || "")}" autocomplete="given-name"></label>
    <div class="row2"><label class="fld"><span>Date de naissance</span><input type="date" id="pfBirth" value="${esc(P.birth || "")}"></label><fieldset class="fld"><legend>Sexe</legend><div class="chips">${chips("sex", [["h","Homme"],["f","Femme"]], P.sex)}</div></fieldset></div>
    <div class="row2"><label class="fld"><span>Taille (cm)</span><input inputmode="decimal" id="pfH" value="${P.height ?? ""}" placeholder="179"></label><label class="fld"><span>Poids objectif (kg)</span><input inputmode="decimal" id="pfG" value="${P.goal != null ? String(P.goal).replace(".", ",") : ""}"></label></div>
    <fieldset class="fld"><legend>Mes sports</legend><div class="chips">${SPORT_KEYS.map(k => `<label><input type="checkbox" name="sp" value="${k}" ${(P.sports || []).includes(k) ? "checked" : ""}><span>${SPORTS[k].label}</span></label>`).join("")}</div></fieldset>
    <button class="btn pri wide">Enregistrer</button></form>`);
  $("#pfF").addEventListener("submit", e => { e.preventDefault();
    Object.assign(DB.profile, {name:$("#pfName").value.trim(), birth:$("#pfBirth").value || null, sex:radioVal(e.target, "sex"), height:num($("#pfH").value), goal:num($("#pfG").value), sports:[...e.target.querySelectorAll("input[name=sp]:checked")].map(x => x.value)});
    save(); closeOv(); render(); toast("Profil enregistré"); });
}
function openMeasForm(){
  openOv("Nouvelle mesure", `<form class="f" id="msF"><label class="fld"><span>Date</span><input type="date" id="msDate" value="${todayISO()}"></label>
    <p class="note-s" style="margin-top:-6px">Remplis seulement ce que tu as mesuré. En gris : ta dernière valeur.</p>
    <div class="row2">${MEAS.map(([k, l, u, tip]) => { const m = lastMeas(k)[0]; return `<label class="fld"><span>${esc(l)} (${u})</span><input inputmode="decimal" data-mk="${k}" placeholder="${m ? f1(m[k]) : ""}" title="${esc(tip)}"></label>`; }).join("")}</div>
    <details class="howto"><summary>Comment bien se mesurer</summary><ul>${MEAS.map(([k, l, u, tip]) => `<li><b>${esc(l)} :</b> ${esc(tip)}</li>`).join("")}</ul></details>
    <p class="err" id="msErr" hidden></p><button class="btn pri wide">Enregistrer</button></form>`);
  $("#msF").addEventListener("submit", e => { e.preventDefault(); const o = {id:uid(), date:$("#msDate").value || todayISO()}; let n = 0;
    e.target.querySelectorAll("[data-mk]").forEach(i => { const v = num(i.value); if (v != null) { o[i.dataset.mk] = v; n++; } });
    if (!n) { $("#msErr").textContent = "Renseigne au moins une valeur."; $("#msErr").hidden = false; return; }
    DB.measures.push(o); save(); closeOv(); render(); toast("Mesure enregistrée"); });
}
function openMeasDetail(k){
  const [, l, u, tip] = MEAS.find(x => x[0] === k), m = lastMeas(k);
  let h = `<p class="note-s" style="margin:-6px 0 12px">${esc(tip)}</p>`;
  if (!m.length) h += `<p class="empty">Pas encore de mesure.</p>`;
  else { const first = m[m.length - 1], best = m[0];
    h += `<div class="stats3"><div class="stat"><b>${f1(best[k])}</b><span>actuel (${u})</span></div><div class="stat"><b>${m.length > 1 ? (best[k] - first[k] >= 0 ? "+" : "−") + f1(Math.abs(best[k] - first[k])) : "–"}</b><span>depuis le début</span></div><div class="stat"><b>${m.length}</b><span>mesure${m.length > 1 ? "s" : ""}</span></div></div>`;
    if (m.length >= 2) h += lineChart(m.slice().reverse().map(x => ({d:x.date, v:x[k]})), u);
    h += `<table class="tbl" style="margin-top:10px"><tbody>${m.map(x => `<tr><td>${fDate(x.date)}</td><td><b>${fmtv(x[k], u)}</b></td><td style="text-align:right"><button class="btn small flat danger" data-delm="${esc(x.id)}|${k}">Supprimer</button></td></tr>`).join("")}</tbody></table>`; }
  h += `<button class="btn pri wide" style="margin-top:14px" data-act="new-meas">${IC.plus} Nouvelle mesure</button>`;
  openOv(l, h);
}

/* ---------- Progrès ---------- */
let PERIOD = 12;
function renderStats(){
  $("#viewTitle").textContent = "Progrès"; $("#viewSub").textContent = "Tes tendances, tous sports confondus";
  const mon = monday(new Date()), from = addDays(mon, -7 * (PERIOD - 1)), fromIso = dISO(from);
  const ws = DB.workouts.filter(w => w.date >= fromIso);
  let h = `<div class="seg" id="perSeg">${[[4,"4 sem."],[12,"12 sem."],[52,"1 an"]].map(([n, l]) => `<button data-per="${n}" aria-pressed="${PERIOD === n}">${l}</button>`).join("")}</div>`;
  // barres empilées par semaine
  const weeks = Array.from({length:PERIOD}, (_, i) => { const a = addDays(from, 7*i), b = addDays(a, 6), ai = dISO(a), bi = dISO(b); const o = {a, by:{}}; SPORT_KEYS.forEach(s => o.by[s] = 0);
    ws.forEach(w => { if (w.date >= ai && w.date <= bi) o.by[w.sport] += (w.durMin || 0); }); o.tot = SPORT_KEYS.reduce((n, s) => n + o.by[s], 0); return o; });
  const maxT = Math.max(60, ...weeks.map(x => x.tot)), W = 340, H = 160, P = {l:28, b:20, t:8}, bw = (W - P.l) / PERIOD;
  const Y = v => H - P.b - v / maxT * (H - P.b - P.t);
  let bars = ""; weeks.forEach((wk, i) => { let acc = 0; SPORT_KEYS.forEach(s => { const v = wk.by[s]; if (!v) return; const y1 = Y(acc), y2 = Y(acc + v); bars += `<rect class="c-${s}" x="${(P.l + i*bw + bw*.15).toFixed(1)}" y="${y2.toFixed(1)}" width="${(bw*.7).toFixed(1)}" height="${Math.max(1, y1 - y2).toFixed(1)}" rx="2" style="fill:var(--c)"><title>Semaine du ${wk.a.getDate()} ${MON_S[wk.a.getMonth()]} : ${SPORTS[s].label} ${fDur(v)}</title></rect>`; acc += v; }); });
  const lbl = weeks.map((wk, i) => (PERIOD <= 4 || (PERIOD <= 12 && i % 2 === (PERIOD - 1) % 2) || i % 8 === 3) ? `<text x="${P.l + i*bw + bw/2}" y="${H - 6}" text-anchor="middle" font-size="9.5" fill="var(--muted)">${wk.a.getDate()}/${wk.a.getMonth()+1}</text>` : "").join("");
  const yt = [0, maxT/2, maxT].map(v => `<text x="${P.l - 5}" y="${Y(v) + 4}" text-anchor="end" font-size="10.5" fill="var(--muted)">${Math.round(v/60*10)/10}h</text><line x1="${P.l}" x2="${W}" y1="${Y(v)}" y2="${Y(v)}" stroke="var(--line)"/>`).join("");
  h += `<div class="sec-t">Temps d'activité par semaine</div><div class="card"><svg class="chart" viewBox="0 0 ${W} ${H}" role="img" aria-label="Heures d'activité par semaine">${yt}${bars}${lbl}</svg><div class="legend">${SPORT_KEYS.map(s => `<span class="c-${s}"><i></i>${SPORTS[s].label}</span>`).join("")}</div></div>`;
  // totaux par sport
  const by = s => ws.filter(w => w.sport === s), sumMin = a => a.reduce((n, w) => n + (w.durMin || 0), 0);
  const mu = by("muscu"), bb = by("bodyboard"), sw = by("natation"), ru = by("course");
  const bbSpots = {}; bb.forEach(w => { const n = w.spotName || spotName(w.spot); bbSpots[n] = (bbSpots[n] || 0) + 1; }); const topSpot = Object.keys(bbSpots).sort((a, b) => bbSpots[b] - bbSpots[a])[0];
  const feltAvg = a => { const f = a.filter(w => w.felt); return f.length ? f1(f.reduce((n, w) => n + w.felt, 0) / f.length) : null; };
  const swPace = sw.filter(w => w.dist && w.durSec).map(w => w.durSec / (w.dist/100)), ruPace = ru.filter(w => w.dist >= 3 && w.durSec).map(w => w.durSec / w.dist);
  h += `<div class="sec-t">Par sport</div><div class="sporttot">
    <div class="st-c c-muscu"><div class="sh"><span class="sp-ic">${IC.muscu}</span><b>Muscu</b></div><p><strong>${mu.length}</strong> ${pl(mu.length, "séance").replace(/^\d+ /, "")} · ${fDur(sumMin(mu))}</p><p><strong>${f1(mu.reduce((n, w) => n + wVolume(w), 0)/1000)}</strong> t soulevées · ${pl(mu.reduce((n, w) => n + wSets(w), 0), "série")}</p></div>
    <div class="st-c c-bodyboard"><div class="sh"><span class="sp-ic">${IC.bodyboard}</span><b>Bodyboard</b></div><p><strong>${bb.length}</strong> ${pl(bb.length, "session").replace(/^\d+ /, "")} · ${fDur(sumMin(bb))}</p><p><strong>${bb.reduce((n, w) => n + (w.waves || 0), 0)}</strong> vagues${feltAvg(bb) ? ` · ressenti ${feltAvg(bb)}/10` : ""}${topSpot ? `<br>Spot n°1 : ${esc(topSpot)}` : ""}</p></div>
    <div class="st-c c-natation"><div class="sh"><span class="sp-ic">${IC.natation}</span><b>Natation</b></div><p><strong>${sw.length}</strong> ${pl(sw.length, "séance").replace(/^\d+ /, "")} · ${fDur(sumMin(sw))}</p><p><strong>${f1(sw.reduce((n, w) => n + (w.dist || 0), 0)/1000)}</strong> km nagés${swPace.length ? ` · meilleure allure ${fPace(Math.min(...swPace))}/100 m` : ""}</p></div>
    <div class="st-c c-course"><div class="sh"><span class="sp-ic">${IC.course}</span><b>Course</b></div><p><strong>${ru.length}</strong> ${pl(ru.length, "sortie").replace(/^\d+ /, "")} · ${fDur(sumMin(ru))}</p><p><strong>${f1(ru.reduce((n, w) => n + (w.dist || 0), 0))}</strong> km${ruPace.length ? ` · meilleure allure ${fPace(Math.min(...ruPace))}/km` : ""}</p></div></div>`;
  // objectif 10 km (sur tout l'historique)
  const allRuns = DB.workouts.filter(w => w.sport === "course" && w.dist);
  const longest = allRuns.length ? Math.max(...allRuns.map(w => w.dist)) : 0;
  h += `<div class="sec-t">Objectif 10 km</div><div class="card"><p style="margin:0">Plus longue sortie : <b style="font-family:var(--font-num);font-size:18px">${f1(longest)} km</b>${longest >= 10 ? " · objectif atteint !" : ` · encore ${f1(10 - longest)} km`}</p><div class="goal"><i style="width:${Math.min(100, longest * 10)}%"></i></div>${(() => { const r = allRuns.filter(w => w.dist >= 4.5 && w.durSec).sort((a, b) => a.date.localeCompare(b.date)).map(w => ({d:w.date, v:w.durSec / w.dist / 60})); return r.length >= 2 ? `<p class="note-s">Allure sur tes sorties de 5 km et plus (min/km, plus bas = plus rapide)</p>` + lineChart(r, "min/km") : `<p class="note-s">Note tes sorties pour suivre ton allure dans le temps.</p>`; })()}</div>`;
  // séries par muscle
  const mus = {}; mu.forEach(w => (w.exercises || []).forEach(ex => { const m = exById(ex.exId).muscle; mus[m] = (mus[m] || 0) + workSets(ex).length; }));
  const mk = Object.keys(mus).sort((a, b) => mus[b] - mus[a]), mmax = Math.max(1, ...Object.values(mus));
  h += `<div class="sec-t">Séries par muscle <span class="note-s">${PERIOD} sem. · ${f1(mk.reduce((n, m) => n + mus[m], 0) / PERIOD)} séries/sem.</span></div><div class="card">${mk.length ? `<div class="hbars">${mk.map(m => `<div class="hb"><span>${esc(m)}</span><span class="tr"><i style="width:${mus[m]/mmax*100}%"></i></span><b>${mus[m]}</b></div>`).join("")}</div>` : `<p class="empty">Pas encore de séance de muscu sur la période.</p>`}</div>`;
  // records
  const keyLifts = ["squat","dc-barre","souleve-terre","dm-barre","tractions","di-halt","rowing-barre","hip-thrust"];
  const prs = []; const seen = new Set(); DB.workouts.forEach(w => (w.exercises || []).forEach(ex => seen.add(ex.exId)));
  [...seen].forEach(id => { const e = exById(id); if (e.kind !== "kg") return; const hs = exHistory(id); const best = Math.max(0, ...hs.map(x => x.e1)); if (best) prs.push({id, e, best, max:Math.max(...hs.map(x => x.max)), key:keyLifts.indexOf(id)}); });
  prs.sort((a, b) => (a.key < 0 ? 99 : a.key) - (b.key < 0 ? 99 : b.key) || b.best - a.best);
  h += `<div class="sec-t">Records</div><div class="card">${prs.length ? `<ul class="prs">${prs.slice(0, 10).map(p => `<li><button class="link-btn" style="font-size:14.5px;text-align:left" data-exd="${esc(p.id)}">${esc(p.e.name)}</button><span>max ${f1(p.max)} kg · <b>${f1(p.best)}</b> 1RM est.</span></li>`).join("")}</ul>` : `<p class="empty">Tes records apparaîtront ici.</p>`}</div>`;
  $("#view").innerHTML = h;
  $("#perSeg").addEventListener("click", e => { const b = e.target.closest("[data-per]"); if (!b) return; PERIOD = +b.dataset.per; render(); });
}

/* ---------- Réglages, import Hevy, sauvegarde ---------- */
let FILE_MODE = null;
function openSettings(){
  const S = DB.settings, mvAll = mvSessions().length, mvP = mvPending().length;
  const n = DB.workouts.length;
  openOv("Réglages", `<form class="f" id="setF">
    <label class="fld"><span>Repos par défaut entre les séries</span><select id="stRest">${[30,45,60,75,90,105,120,150,180].map(s => `<option value="${s}" ${s === S.rest ? "selected" : ""}>${fClock(s)}</option>`).join("")}</select></label>
    <fieldset class="fld"><legend>Thème</legend><div class="chips">${chips("theme", [["auto","Auto"],["light","Clair"],["dark","Sombre"]], S.theme)}</div></fieldset>
    <label style="display:flex;gap:8px;align-items:center;font-size:15px"><input type="checkbox" id="stSound" ${S.sound ? "checked" : ""}> Bip et vibration à la fin du repos</label>
    <label style="display:flex;gap:8px;align-items:center;font-size:15px"><input type="checkbox" id="stWake" ${S.wake ? "checked" : ""}> Garder l'écran allumé pendant la séance</label>
    ${"Notification" in window && Notification.permission !== "granted" ? `<button type="button" class="btn small" data-st="notif">Prévenir aussi quand l'appli est en arrière-plan</button>` : ""}
  </form>
  <div class="sec-t">Importer</div>
  <div class="menu"><button class="btn" data-st="hevy">Importer mon historique Hevy (fichier CSV)</button>
  <p class="note-s">Dans Hevy : Profil → Réglages → Exporter et importer les données → Exporter les séances. Les séances déjà importées ne sont pas dupliquées.</p>
  <button class="btn" data-st="mv" ${mvAll ? "" : "disabled"}>Carnet Mes Vagues : ${mvAll ? `${mvAll} session${mvAll > 1 ? "s" : ""}, ${mvP} à ajouter` : "rien trouvé sur cet appareil"}</button></div>
  <div class="sec-t">Sauvegarde</div>
  <div class="menu"><p class="note-s">Tes ${n} séance${n > 1 ? "s" : ""} sont gardées sur ce téléphone. Exporte une sauvegarde de temps en temps (Drive, mail…) pour ne rien perdre si tu changes d'appareil.${DB.lastBackup ? ` Dernière : ${fDate(DB.lastBackup.slice(0, 10))}.` : ""}</p>
  <button class="btn" data-st="export">Exporter une sauvegarde</button><button class="btn" data-st="restore">Restaurer une sauvegarde</button>
  <button class="btn danger" data-st="wipe">Effacer toutes les données</button></div>
  <p class="note-s" style="margin-top:16px">Biceps · version 3 · photos d'exercices : free-exercise-db (domaine public)</p>`);
  const f = $("#setF");
  f.addEventListener("change", () => { S.rest = +$("#stRest").value; S.theme = radioVal(f, "theme") || "auto"; S.sound = $("#stSound").checked; S.wake = $("#stWake").checked; save(); applyTheme(); });
  $("#ovBody").onclick = async e => { const b = e.target.closest("[data-st]"); if (!b) return; const a = b.dataset.st;
    if (a === "notif") { try { const p = await Notification.requestPermission(); toast(p === "granted" ? "Notifications activées" : "Notifications refusées"); } catch (er) {} if (b.isConnected) b.remove(); }
    if (a === "hevy") { FILE_MODE = "hevy"; $("#fileIn").accept = ".csv,text/csv"; $("#fileIn").click(); }
    if (a === "restore") { FILE_MODE = "restore"; $("#fileIn").accept = ".json,application/json"; $("#fileIn").click(); }
    if (a === "mv") openMV();
    if (a === "export") exportBackup();
    if (a === "wipe") { if (!armConfirm(b, "Confirmer : tout effacer")) return; const keep = DB.settings; DB = DEF(); DB.settings = keep; save(); closeOv(); render(); toast("Données effacées"); } };
}
function exportBackup(){
  const data = JSON.stringify(Object.assign({}, DB, {exportedAt:new Date().toISOString()}), null, 1);
  const blob = new Blob([data], {type:"application/json"}), a = document.createElement("a");
  a.href = URL.createObjectURL(blob); a.download = `mes-seances-${todayISO()}.json`; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(a.href), 2000);
  DB.lastBackup = new Date().toISOString(); save(); toast("Sauvegarde téléchargée");
}
$("#fileIn").addEventListener("change", async e => { const file = e.target.files[0]; e.target.value = ""; if (!file) return;
  const txt = await file.text();
  try {
    if (FILE_MODE === "hevy") { const r = importHevy(txt); save(); closeOv(); render(); openOv("Import Hevy terminé", `<p style="margin:0 0 8px"><b>${r.added}</b> séance${r.added > 1 ? "s" : ""} ajoutée${r.added > 1 ? "s" : ""}${r.skipped ? `, ${r.skipped} déjà présente${r.skipped > 1 ? "s" : ""}` : ""}.</p>${r.newEx.length ? `<p class="note-s">${r.newEx.length} exercice${r.newEx.length > 1 ? "s" : ""} créé${r.newEx.length > 1 ? "s" : ""} car absent${r.newEx.length > 1 ? "s" : ""} de la bibliothèque : ${r.newEx.map(esc).join(", ")}. Tu peux corriger leur muscle en les recréant si besoin.</p>` : ""}<button class="btn pri wide" style="margin-top:14px" data-close>Voir mon journal</button>`); }
    if (FILE_MODE === "restore") { const d = JSON.parse(txt); if (!d || !Array.isArray(d.workouts)) throw new Error("format");
      const ids = new Set(DB.workouts.map(w => w.id)); let add = 0; d.workouts.forEach(w => { if (!ids.has(w.id)) { DB.workouts.push(w); add++; } });
      const rids = new Set(DB.routines.map(r => r.id)); (d.routines || []).forEach(r => { if (!rids.has(r.id)) DB.routines.push(r); });
      const cids = new Set(DB.customEx.map(c => c.id)); (d.customEx || []).forEach(c => { if (!cids.has(c.id)) DB.customEx.push(c); });
      DB.mvSkip = [...new Set(DB.mvSkip.concat(d.mvSkip || []))];
      const mids = new Set(DB.measures.map(m => m.id)); (d.measures || []).forEach(m => { if (!mids.has(m.id)) DB.measures.push(m); });
      if (d.profile && !DB.profile.name) DB.profile = d.profile; if (d.plans) DB.plans = Object.assign({}, d.plans, DB.plans);
      save(); closeOv(); render(); toast(`${add} séance${add > 1 ? "s" : ""} restaurée${add > 1 ? "s" : ""}`); }
  } catch (err) { toast(FILE_MODE === "hevy" ? "Fichier non reconnu : prends l'export CSV des séances Hevy." : "Sauvegarde illisible."); console.error(err); }
});

/* Import CSV Hevy (dates françaises « 18 août 2026, 18:30 » ou anglaises « 18 Aug 2026, 18:30 ») */
function parseCSV(t){
  const rows = []; let row = [], cur = "", q = false;
  for (let i = 0; i < t.length; i++) { const c = t[i];
    if (q) { if (c === '"') { if (t[i+1] === '"') { cur += '"'; i++; } else q = false; } else cur += c; }
    else if (c === '"') q = true; else if (c === ",") { row.push(cur); cur = ""; } else if (c === "\n" || c === "\r") { if (c === "\r" && t[i+1] === "\n") i++; row.push(cur); rows.push(row); row = []; cur = ""; } else cur += c; }
  if (cur || row.length) { row.push(cur); rows.push(row); }
  return rows.filter(r => r.some(x => x !== ""));
}
const MONTHS = {janv:1,jan:1,janvier:1,fevr:2,fev:2,feb:2,fevrier:2,mars:3,mar:3,avr:4,apr:4,avril:4,mai:5,may:5,juin:6,jun:6,juil:7,jul:7,juillet:7,aout:8,aug:8,sept:9,sep:9,septembre:9,oct:10,octobre:10,nov:11,novembre:11,dec:12,decembre:12};
function parseHevyDate(s){
  s = String(s || "").trim(); let m = s.match(/^(\d{4})-(\d{2})-(\d{2})[ T](\d{1,2}):(\d{2})/); if (m) return new Date(+m[1], +m[2]-1, +m[3], +m[4], +m[5]);
  m = norm(s).match(/^(\d{1,2}) ([a-z]+) (\d{4}) (\d{1,2}) (\d{2})/); if (m && MONTHS[m[2]]) return new Date(+m[3], MONTHS[m[2]]-1, +m[1], +m[4], +m[5]);
  m = norm(s).match(/^([a-z]+) (\d{1,2}) (\d{4}) (\d{1,2}) (\d{2})/); if (m && MONTHS[m[1]]) return new Date(+m[3], MONTHS[m[1]]-1, +m[2], +m[4], +m[5]);
  const d = new Date(s); return isNaN(d) ? null : d;
}
function guessMuscle(n){ n = norm(n); const R = [[/squat|presse|leg ext|fente|lunge|quadri|hack/,"Quadriceps"],[/leg curl|ischio|roumain|romanian|jambes tendues|nordic/,"Ischios"],[/hip thrust|fessier|glute|abduct/,"Fessiers"],[/mollet|calf/,"Mollets"],[/couche|bench|pec|ecarte|fly|pompe|push up|dips/,"Pectoraux"],[/traction|pull up|tirage|rowing|row|lat|souleve de terre|deadlift/,"Dos"],[/militaire|epaule|shoulder|lateral|arnold|oiseau|face pull/,"Épaules"],[/curl/,"Biceps"],[/triceps|barre au front|skull|extension/,"Triceps"],[/shrug/,"Trapèzes"],[/abdo|crunch|gainage|plank|releve|twist/,"Abdos"],[/course|run|velo|bike|rameur|row machine|elliptique|marche|walk|corde/,"Cardio"]];
  for (const [re, m] of R) if (re.test(n)) return m; return "Autre"; }
function importHevy(txt){
  const rows = parseCSV(txt.replace(/^﻿/, "")); const hd = rows.shift().map(x => norm(x).replace(/ /g, "_"));
  const ix = k => hd.indexOf(k); const I = {title:ix("title"), st:ix("start_time"), en:ix("end_time"), desc:ix("description"), ex:ix("exercise_title"), note:ix("exercise_notes"), si:ix("set_index"), type:ix("set_type"), kg:ix("weight_kg"), lbs:ix("weight_lbs"), reps:ix("reps"), km:ix("distance_km"), sec:ix("duration_seconds"), rpe:ix("rpe")};
  if (I.st < 0 || I.ex < 0) throw new Error("not hevy");
  const byName = new Map(allEx().map(e => [norm(e.name), e.id])); const newEx = [];
  const groups = new Map();
  rows.forEach(r => { const key = r[I.title] + "|" + r[I.st]; if (!groups.has(key)) groups.set(key, {r, list:[]}); groups.get(key).list.push(r); });
  const have = new Set(DB.workouts.map(w => w.id)); let added = 0, skipped = 0;
  groups.forEach(({r, list}, key) => {
    const id = "h-" + Array.from(key).reduce((h, c) => (h * 31 + c.charCodeAt(0)) >>> 0, 7).toString(36);
    if (have.has(id)) { skipped++; return; }
    const st = parseHevyDate(r[I.st]), en = parseHevyDate(r[I.en]); if (!st) return;
    const exs = []; list.forEach(x => { const name = x[I.ex].trim(); let exId = byName.get(norm(name));
      if (!exId) { const hasKg = list.some(y => y[I.ex] === x[I.ex] && num(y[I.kg])); const hasSec = list.some(y => y[I.ex] === x[I.ex] && num(y[I.sec]));
        const ce = {id:"c-" + uid(), name, muscle:guessMuscle(name), equip:"Autre", kind:hasSec && !num(x[I.reps]) ? "temps" : hasKg ? "kg" : "reps", custom:true};
        DB.customEx.push(ce); byName.set(norm(name), ce.id); exId = ce.id; newEx.push(name); }
      let e = exs[exs.length - 1]; if (!e || e.exId !== exId) { e = {exId, rest:DB.settings.rest, note:I.note >= 0 ? x[I.note] || "" : "", sets:[]}; exs.push(e); }
      const t = norm(x[I.type]); const kg = I.kg >= 0 ? num(x[I.kg]) : (I.lbs >= 0 && num(x[I.lbs]) != null ? num(x[I.lbs]) * .4536 : null);
      e.sets.push({t:t.startsWith("warm") ? "w" : t.startsWith("drop") ? "d" : t.startsWith("fail") ? "f" : "n", kg:kg != null ? Math.round(kg*100)/100 : null, reps:num(x[I.reps]), sec:I.sec >= 0 ? num(x[I.sec]) : null, km:I.km >= 0 ? num(x[I.km]) : null, rpe:I.rpe >= 0 ? num(x[I.rpe]) : null}); });
    DB.workouts.push({id, sport:"muscu", title:r[I.title] || "Séance Hevy", date:dISO(st), time:`${pad(st.getHours())}:${pad(st.getMinutes())}`, durMin:en ? Math.max(1, Math.round((en - st)/60000)) : null, exercises:exs, note:I.desc >= 0 ? r[I.desc] || "" : "", source:"hevy", createdAt:new Date().toISOString()});
    added++; });
  // records rétroactifs
  sortW(DB.workouts.filter(w => w.source === "hevy")).reverse().forEach(w => { w.prs = []; (w.exercises || []).forEach(ex => { const prev = exHistory(ex.exId).filter(h => h.w.date < w.date); const b = bestSet(ex); if (prev.length && b && b.v > Math.max(...prev.map(h => h.e1)) + .01) w.prs.push(ex.exId); }); });
  return {added, skipped, newEx};
}

/* ---------- Clics globaux ---------- */
document.addEventListener("click", e => {
  const t = e.target;
  const act = t.closest("[data-act]"); if (act) { const a = act.dataset.act;
    if (a === "resume") return showLive();
    if (a === "mv") return openMV();
    if (a === "go-train" || a === "go-plans") { TAB = "plans"; window.scrollTo(0, 0); return render(); }
    if (a === "go-log") { TAB = "log"; window.scrollTo(0, 0); return render(); }
    if (a === "settings") return openSettings();
    if (a === "more") { FEED_N += 30; return renderHome(); }
    if (a === "starter") return addStarter();
    if (a === "edit-prof") return openProfileForm();
    if (a === "new-meas") return openMeasForm();
    if (a === "new-routine") return openRoutine(null);
    if (a === "ex-new") return openNewEx(id => { closeOv(); renderEx(); openExDetail(id); }); }
  const pf = t.closest("[data-prof]"); if (pf) { PROF = pf.dataset.prof; return render(); }
  const ms = t.closest("[data-meas]"); if (ms) return openMeasDetail(ms.dataset.meas);
  const dm = t.closest("[data-delm]"); if (dm) { if (!armConfirm(dm, "Confirmer")) return; const [id, k] = dm.dataset.delm.split("|"); const m = DB.measures.find(x => x.id === id); if (m) { delete m[k]; if (!MEAS.some(([kk]) => m[kk] != null)) DB.measures = DB.measures.filter(x => x !== m); } save(); render(); openMeasDetail(k); return; }
  const lf = t.closest("[data-lf]"); if (lf) { LOGF = lf.dataset.lf; FEED_N = 30; return render(); }
  const cal = t.closest("[data-cal]"); if (cal) { CALM = Math.min(0, CALM + +cal.dataset.cal); return renderLog(); }
  const ps = t.closest("[data-pseg]"); if (ps) { PSEG = ps.dataset.pseg; return render(); }
  const pg = t.closest("[data-prog]"); if (pg) return openProgram(pg.dataset.prog);
  const fo = t.closest("[data-follow]"); if (fo) return followProgram(fo.dataset.follow);
  const uf = t.closest("[data-unfollow]"); if (uf) { if (!armConfirm(uf, "Confirmer")) return; delete DB.plans.muscu; save(); closeOv(); render(); toast("Programme arrêté, tes routines sont gardées"); return; }
  const pl_ = t.closest("[data-plan]"); if (pl_) { const [sp, id] = pl_.dataset.plan.split("|"); return openPlan(sp, id); }
  const pst = t.closest("[data-pstart]"); if (pst) { const [sp, id] = pst.dataset.pstart.split("|"); if (DB.plans[sp] && !armConfirm(pst, "Confirmer : l'avancement actuel sera perdu")) return; DB.plans[sp] = {id, start:todayISO(), done:{}}; save(); closeOv(); PSEG = sp; render(); toast("C'est parti ! Ta prochaine séance est sur l'accueil."); return; }
  const pso = t.closest("[data-pstop]"); if (pso) { if (!armConfirm(pso, "Confirmer l'arrêt")) return; delete DB.plans[pso.dataset.pstop]; save(); closeOv(); render(); return; }
  const pdo = t.closest("[data-pdo]"); if (pdo) { const [sp, k] = pdo.dataset.pdo.split("|"); return planSessionForm(sp, k); }
  const pck = t.closest("[data-pck]"); if (pck) { const [sp, k] = pck.dataset.pck.split("|"); const st = DB.plans[sp]; if (!st) return; if (st.done[k]) delete st.done[k]; else st.done[k] = true; save();
    if (pck.dataset.refresh) { render(); toast("Séance cochée"); } else { pck.classList.toggle("on", !!st.done[k]); render(); } return; }
  const al = t.closest("[data-addlive]"); if (al) { DB.active.exercises.push(newExEntry(al.dataset.addlive)); save(); closeOv(); showLive(); toast("Exercice ajouté"); return; }
  if (t.closest("#fab")) return openStart();
  const o = t.closest("[data-open]"); if (o) return openWorkout(o.dataset.open);
  const st = t.closest("[data-start]"); if (st) { unlockAudio(); if ($("#ov").classList.contains("show") && st.closest("#ov")) { ovOnClose = null; } return st.dataset.start === "muscu" ? startMuscu(null) : openSportForm(st.dataset.start); }
  const rs = t.closest("[data-rstart]"); if (rs) { unlockAudio(); return startMuscu(rs.dataset.rstart); }
  const rm = t.closest("[data-rmenu]"); if (rm) return routineMenu(rm.dataset.rmenu);
  const xd = t.closest("[data-exd]"); if (xd && !t.closest("#live")) return openExDetail(xd.dataset.exd);
  const ed = t.closest("[data-edit]"); if (ed) { const w = DB.workouts.find(x => x.id === ed.dataset.edit); return w.sport === "muscu" ? editMuscu(w) : openSportForm(w.sport, w); }
  const rd = t.closest("[data-redo]"); if (rd) { const w = DB.workouts.find(x => x.id === rd.dataset.redo); return startMuscu(null, w); }
  const dw = t.closest("[data-delw]"); if (dw) { if (!armConfirm(dw, "Confirmer")) return; DB.workouts = DB.workouts.filter(x => x.id !== dw.dataset.delw); save(); closeOv(); render(); toast("Séance supprimée"); return; }
  const dx = t.closest("[data-delex]"); if (dx) { const used = DB.workouts.some(w => (w.exercises || []).some(ex => ex.exId === dx.dataset.delex)); if (used) { toast("Exercice utilisé dans des séances : il est gardé."); return; } if (!armConfirm(dx, "Confirmer")) return; DB.customEx = DB.customEx.filter(c => c.id !== dx.dataset.delex); save(); closeOv(); render(); }
});
$("#setBtn").addEventListener("click", openSettings);


/* ---------- Navigation tactile : retour Android, glisser vers le bas, glisser depuis le bord gauche ---------- */
let ignorePop = 0;
const navState = () => history.state || {};
function navPush(k){ try { history.pushState(Object.assign({}, navState(), {[k]:1, d:(navState().d || 0) + 1}), ""); } catch (e) {} }
function navPopIf(k){ if (navState()[k]) { ignorePop++; history.back(); } }
window.addEventListener("popstate", () => {
  if (ignorePop) { ignorePop--; return; }
  if (!$("#ov").hidden && $("#ov").classList.contains("show")) { closeOv(true); return; }
  if (!$("#live").hidden) { hideLive(true); return; }
  if (TAB !== "home") { TAB = "home"; render(); window.scrollTo(0, 0); }
});
function goBack(){ if (navState().d) history.back(); else if (!$("#ov").hidden) closeOv(); else if (!$("#live").hidden) hideLive(); else if (TAB !== "home") { TAB = "home"; render(); } }
// Fiche : glisser vers le bas pour fermer
(() => { const panel = $("#ov .panel"); let y0 = null, dy = 0, t0 = 0;
  panel.addEventListener("touchstart", e => { if (e.touches.length !== 1) return; const onHead = e.target.closest(".grab, .panel-head"); if (!onHead && panel.scrollTop > 0) { y0 = null; return; } if (e.target.closest("input, textarea, select, .hscroll, .filters, .chips, canvas")) { y0 = null; return; } y0 = e.touches[0].clientY; dy = 0; t0 = Date.now(); }, {passive:true});
  panel.addEventListener("touchmove", e => { if (y0 == null) return; dy = e.touches[0].clientY - y0; if (dy <= 0) { panel.style.transform = ""; return; } if (panel.scrollTop > 0 && !e.target.closest(".grab, .panel-head")) { y0 = null; panel.style.transform = ""; return; }
    panel.style.transition = "none"; panel.style.transform = `translateY(${dy}px)`; $("#ov").style.opacity = String(Math.max(.35, 1 - dy / 600)); }, {passive:true});
  panel.addEventListener("touchend", () => { if (y0 == null) return; const v = dy / Math.max(1, Date.now() - t0); panel.style.transition = ""; $("#ov").style.opacity = "";
    if (dy > 110 || (dy > 40 && v > .6)) { panel.style.transform = "translateY(100%)"; setTimeout(() => { panel.style.transform = ""; }, 320); closeOv(); } else panel.style.transform = ""; y0 = null; }, {passive:true});
})();
// Bord gauche : glisser vers la droite = retour (utile sur iPhone)
(() => { let x0 = null, y0 = 0, el = null;
  document.addEventListener("touchstart", e => { const t = e.touches[0]; if (e.touches.length === 1 && t.clientX < 28) { x0 = t.clientX; y0 = t.clientY; el = !$("#ov").hidden ? $("#ov .panel") : !$("#live").hidden ? $("#live") : $("#app"); } else x0 = null; }, {passive:true});
  document.addEventListener("touchmove", e => { if (x0 == null) return; const dx = e.touches[0].clientX - x0, dyy = Math.abs(e.touches[0].clientY - y0); if (dyy > dx) { x0 = null; el.style.transform = ""; return; } if (dx > 0) { el.style.transition = "none"; el.style.transform = `translateX(${Math.min(dx, 160) * .6}px)`; } }, {passive:true});
  document.addEventListener("touchend", e => { if (x0 == null) return; const dx = (e.changedTouches[0] || {}).clientX - x0; el.style.transition = "transform .25s"; el.style.transform = ""; setTimeout(() => { el.style.transition = ""; }, 260); x0 = null; if (dx > 80) goBack(); }, {passive:true});
})();

/* ---------- Démarrage ---------- */
render();
if (DB.active && !DB.active.editOf) showLive();
if ("serviceWorker" in navigator && location.protocol === "https:") navigator.serviceWorker.register("sw.js").catch(() => {});
