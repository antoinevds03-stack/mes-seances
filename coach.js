/* Coach : conversation guidée qui comprend tes objectifs en langage courant et construit un programme sur mesure.
   Tout est calculé dans l'appli (pas de serveur) : règles d'entraînement classiques selon objectif, niveau, fréquence, durée et matériel. */
(function(){
const GOALS = {
  shoulders:{l:"Largeur d'épaules", re:/epaule|deltoid|largeur|carrure|v shape|v-shape/},
  bench:{l:"Développé couché", re:/developpe couche|bench|\bdc\b|couche/},
  chest:{l:"Pectoraux", re:/pec|poitrine|torse/},
  squat:{l:"Squat", re:/squat/},
  deadlift:{l:"Soulevé de terre", re:/souleve|deadlift|\bsdt\b/},
  force:{l:"Force", re:/force|lourd|powerlift|1rm|record|max\b|puissan/},
  back:{l:"Dos", re:/\bdos\b|dorsa|traction|lats?\b/},
  arms:{l:"Bras", re:/bras|biceps|triceps|avant-bras|avant bras/},
  legs:{l:"Jambes", re:/jambe|cuisse|quadri|mollet/},
  glutes:{l:"Fessiers", re:/fess|glute|booty|hanche/},
  core:{l:"Abdos et gainage", re:/abdo|gainage|tablette|core|ventre|sangle/},
  fatloss:{l:"Perte de gras", re:/seche|gras|maigrir|mincir|affiner|perdre (du )?poids|perte de poids|kilos|cardio/},
  hypertrophy:{l:"Prise de muscle", re:/masse|muscle|prise|volume|hypertroph|gonfler|grossir|esthetique/},
  surf:{l:"Bodyboard et surf", re:/bodyboard|surf|rame|vague|body board/},
  run:{l:"Course à pied", re:/course|courir|running|trail|\d+ ?km|semi|marathon|footing/},
  swim:{l:"Natation", re:/natation|nager|piscine|crawl/},
  mobility:{l:"Mobilité", re:/mobilit|souple|souplesse|etire|posture|mal au dos|douleur/}
};
const LEVELS = {deb:"Débutant", int:"Intermédiaire", conf:"Confirmé"};
const EQUIP = {gym:"Salle complète", home:"Haltères à la maison", bw:"Sans matériel"};
const ALLOW = {gym:null, home:["Haltères","Poids du corps","Élastique","Kettlebell","Autre"], bw:["Poids du corps","Élastique","Autre"]};
const POOL = {
  hpress:["dc-barre","dc-halt","pompes"], incpress:["di-halt","di-barre","pompes"], vpress:["dm-barre","dm-halt","arnold"], hpull:["rowing-barre","rowing-halt","tirage-horiz"],
  hpull2:["tirage-horiz","rowing-halt","rame-elastique"], vpull:["tractions","tirage-vert","tractions-ass"], lat:["elev-lat","elev-lat-poulie"], rear:["face-pull","oiseau","reverse-pec"],
  bic:["curl-ez","curl-halt","curl-marteau"], bic2:["curl-marteau","curl-incline","curl-halt"], tri:["ext-corde","ext-halt","dips"], tri2:["barre-front","dips","kickback"],
  chestiso:["pec-deck","ecarte-poulie","ecarte-halt"], squat:["squat","squat-goblet","bulgare"], hinge:["sdt-roumain","sdt-roumain-halt","pont-fessier"], deadlift:["souleve-terre","sdt-roumain-halt","pont-fessier"],
  single:["bulgare","fentes-halt","step-up"], quadiso:["leg-ext","presse","squat-saute"], hamiso:["leg-curl-assis","nordic","sdt-roumain-halt"], glute:["hip-thrust","pont-fessier","kickback-poulie"],
  calf:["mollets-debout","mollets-assis","corde-sauter"], core:["gainage","releve-jambes","dead-bug"], core2:["pallof","crunch-poulie","russian-twist"],
  closegrip:["dc-serre","dips","pompes"], cardio:["rameur","velo","corde-sauter"], plyo:["squat-saute","burpees","corde-sauter"],
  surf1:["popup"], surf2:["rame-elastique","superman"], surf3:["rotation-elastique","pallof"], mob1:["mob-hanches"], mob2:["mob-thoracique"], mob3:["etirement-psoas","mob-cheville"]
};
const T = {
  FB_A:{n:"Full body A", s:["squat","hpress","hpull","vpress","hamiso","core"]},
  FB_B:{n:"Full body B", s:["hinge","incpress","vpull","single","lat","core2"]},
  FB_C:{n:"Full body C", s:["single","hpress","vpull","rear","bic","tri"]},
  UP_A:{n:"Haut du corps A", s:["hpress","hpull","vpress","vpull","lat","bic","tri"], up:1},
  UP_B:{n:"Haut du corps B", s:["incpress","vpull","hpull2","lat","rear","chestiso","bic2","tri2"], up:1},
  LO_A:{n:"Bas du corps A", s:["squat","hinge","single","hamiso","calf","core"], lo:1},
  LO_B:{n:"Bas du corps B", s:["deadlift","single","glute","quadiso","calf","core2"], lo:1},
  PUSH:{n:"Push", s:["hpress","incpress","vpress","lat","chestiso","tri"], up:1},
  PULL:{n:"Pull", s:["vpull","hpull","hpull2","rear","bic","bic2"], up:1},
  LEGS:{n:"Jambes", s:["squat","hinge","single","quadiso","hamiso","calf","core"], lo:1}
};
const SPLIT = {2:["FB_A","FB_B"], 3:["FB_A","FB_B","FB_C"], 4:["UP_A","LO_A","UP_B","LO_B"], 5:["PUSH","PULL","LEGS","UP_B","LO_B"], 6:["PUSH","PULL","LEGS","PUSH","PULL","LEGS"]};
const PRIO = {shoulders:["vpress","lat","rear"], bench:["hpress","closegrip"], chest:["hpress","incpress","chestiso"], squat:["squat"], deadlift:["deadlift","hinge"], back:["vpull","hpull","hpull2"],
  arms:["bic","bic2","tri","tri2"], legs:["squat","single","quadiso"], glutes:["glute","hinge","single"], force:["squat","hpress","deadlift","vpress"]};
const MAIN = new Set(["squat","hpress","deadlift","vpress","hinge","vpull","hpull","incpress"]);
const ISO = new Set(["lat","rear","bic","bic2","tri","tri2","chestiso","calf","quadiso","hamiso"]);

function parse(text, st){
  const t = (text || "").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "");
  Object.entries(GOALS).forEach(([k, g]) => { if (g.re.test(t)) st.goals.add(k); });
  if (/debut|reprise|jamais|novice|commence/.test(t)) st.level = "deb"; else if (/confirm|avance|expert|\d+ ans de|depuis (des|plusieurs) ans/.test(t)) st.level = "conf"; else if (/intermed|moyen|quelques mois|un an|1 an/.test(t)) st.level = "int";
  let m = t.match(/(\d)\s*(x|fois|seances?|jours?|entrainements?)\s*(par|\/|a la)?\s*(semaine|sem)/) || t.match(/(\d)\s*(x|fois|seances?|jours?)\b/); if (m && +m[1] >= 2 && +m[1] <= 6) st.days = +m[1];
  m = t.match(/(\d+)\s*h\s*(\d+)?/); if (m && +m[1] <= 2) st.dur = +m[1] * 60 + (+m[2] || 0); m = t.match(/(\d{2,3})\s*(min|minutes|mn)/); if (m) st.dur = +m[1];
  if (/maison|chez moi|halteres? a la maison|domicile/.test(t)) st.equip = /sans materiel|poids du corps|rien/.test(t) ? "bw" : "home"; else if (/sans materiel|poids du corps|calisthen|street/.test(t)) st.equip = "bw"; else if (/salle|basic fit|fitness park|machine/.test(t)) st.equip = "gym";
  return st;
}
function pick(slot, equip, used){
  const allow = ALLOW[equip]; const c = (POOL[slot] || []).filter(id => !used.has(id) && (!allow || allow.includes(exById(id).equip)));
  return c[0] || null;
}
function build(st){
  const days = st.days || 3, dur = st.dur || 60, lvl = st.level || "int", eq = st.equip || "gym", G = st.goals;
  const maxEx = dur <= 45 ? 5 : dur <= 60 ? 6 : dur <= 75 ? 7 : 8;
  const prio = new Set([].concat(...[...G].map(g => PRIO[g] || [])));
  const force = G.has("force") || G.has("squat") && G.has("deadlift");
  const sessions = SPLIT[days].map((key, si) => {
    const tpl = T[key]; let slots = tpl.s.slice();
    const isUp = tpl.up || key.startsWith("FB"), isLo = tpl.lo || key.startsWith("FB");
    if (G.has("shoulders") && isUp && !slots.includes("lat")) slots.push("lat");
    if (G.has("shoulders") && isUp && !slots.includes("rear")) slots.push("rear");
    if (G.has("bench") && isUp && !slots.includes("hpress")) slots.unshift("hpress");
    if (G.has("bench") && isUp && si % 2 === 0) slots.push("closegrip");
    if (G.has("squat") && isLo && !slots.includes("squat")) slots.unshift("squat");
    if (G.has("deadlift") && isLo && !slots.includes("deadlift") && !slots.includes("hinge")) slots.push("deadlift");
    if (G.has("glutes") && isLo && !slots.includes("glute")) slots.push("glute");
    if (G.has("arms") && isUp) { if (!slots.includes("bic")) slots.push("bic"); if (!slots.includes("tri")) slots.push("tri"); }
    if (G.has("back") && isUp && !slots.includes("vpull")) slots.push("vpull");
    if (G.has("run") && isLo) { if (!slots.includes("single")) slots.push("single"); slots.push("plyo"); }
    if (G.has("swim") && isUp && !slots.includes("vpull")) slots.push("vpull");
    // ordre : les priorités d'abord (en gardant un mouvement principal en tête)
    slots.sort((a, b) => (prio.has(b) ? 1 : 0) - (prio.has(a) ? 1 : 0) || (MAIN.has(b) ? 1 : 0) - (MAIN.has(a) ? 1 : 0));
    const tail = [];
    if (G.has("core") && !slots.some(s => s.startsWith("core"))) tail.push("core");
    if (G.has("surf")) tail.push(si % 2 ? "surf2" : "surf1", "surf3");
    if (G.has("mobility")) tail.push("mob1", si % 2 ? "mob3" : "mob2");
    if (G.has("fatloss")) tail.push("cardio");
    const room = Math.max(3, maxEx - tail.length);
    // on garde les priorités, puis on coupe les accessoires en trop
    let keep = slots.filter(s => prio.has(s)); slots.filter(s => !prio.has(s)).forEach(s => { if (keep.length < room) keep.push(s); });
    // équilibre : toujours au moins un tirage en haut du corps, un mouvement de jambes principal en bas
    const PULLS = ["vpull","hpull","hpull2"]; if (isUp && !keep.some(x => PULLS.includes(x))) { const pl = slots.find(x => PULLS.includes(x)) || "hpull"; const drop = keep.slice().reverse().find(x => !MAIN.has(x) && x !== "lat"); if (drop && keep.length >= room) keep.splice(keep.indexOf(drop), 1); keep.push(pl); if (!slots.includes(pl)) slots.push(pl); }
    if (isUp && keep.filter(x => PULLS.includes(x)).length < 2 && slots.some(x => PULLS.includes(x) && !keep.includes(x)) && keep.length < room + 1) keep.push(slots.find(x => PULLS.includes(x) && !keep.includes(x)));
    const rank = x => MAIN.has(x) ? (prio.has(x) ? 0 : 1) : prio.has(x) ? 2 : 3;
    keep.sort((a, b) => rank(a) - rank(b) || slots.indexOf(a) - slots.indexOf(b));
    const used = new Set(), items = [];
    keep.concat(tail).forEach(slot => { const id = pick(slot, eq, used); if (!id) return; used.add(id); const e = exById(id), isP = prio.has(slot), main = MAIN.has(slot) && items.length < 2;
      let sets = lvl === "deb" ? 3 : lvl === "int" ? (main ? 4 : 3) : (main ? 5 : 3), reps, rest;
      if (slot.startsWith("mob")) { sets = 2; reps = "60 s"; rest = 15; }
      else if (slot === "cardio") { sets = 1; reps = G.has("fatloss") ? "10–12 min" : "8 min"; rest = 0; }
      else if (slot.startsWith("surf") || slot === "plyo") { sets = 3; reps = e.kind === "temps" ? "40 s" : "6–8"; rest = 45; }
      else if (e.kind === "temps") { sets = 3; reps = "30–45 s"; rest = 45; }
      else if (main && force) { reps = lvl === "deb" ? "5" : "3–5"; rest = 180; sets = lvl === "deb" ? 4 : 5; }
      else if (main) { reps = lvl === "deb" ? "8–10" : lvl === "int" ? "6–8" : "5–6"; rest = lvl === "deb" ? 120 : 150; }
      else if (ISO.has(slot)) { reps = "12–15"; rest = 60; }
      else { reps = "8–12"; rest = 90; }
      if (isP && !main && sets < 4 && !slot.startsWith("mob")) sets++;
      if (G.has("fatloss") && rest > 60 && !(main && force)) rest -= 30;
      if (G.has("hypertrophy") && !force && main) reps = lvl === "conf" ? "6–10" : "8–10";
      items.push([id, sets, reps, rest]); });
    return {name:tpl.n, items};
  });
  const gl = [...G].map(g => GOALS[g].l);
  const name = gl.length ? "Sur mesure · " + gl.slice(0, 2).join(" & ") : "Programme sur mesure";
  const tips = [];
  tips.push(force ? "Mouvements principaux lourds (3 à 5 reps) : ajoute 2,5 kg dès que toutes les séries passent." : "Quand tu atteins le haut de la fourchette de reps sur toutes les séries, monte la charge.");
  if (G.has("shoulders")) tips.push("Les élévations latérales sont présentes à chaque séance haut du corps : c'est le muscle de la largeur. Charge modérée, contrôle.");
  if (G.has("bench")) tips.push("Le développé couché revient plusieurs fois par semaine, avec du triceps (prise serrée, dips) pour débloquer la fin du mouvement.");
  if (G.has("fatloss")) tips.push("Repos raccourcis et 10 minutes de cardio en fin de séance. La perte de gras se joue surtout à l'assiette : garde un apport en protéines élevé.");
  if (G.has("surf")) tips.push("Les exercices de rame, de pop-up et de rotation sont à la fin : fais-les même fatigué, comme à l'eau.");
  if (G.has("run") || G.has("swim")) tips.push(`Garde 2 jours sans muscu des jambes avant tes séances de ${G.has("run") ? "course" : "natation"} les plus dures. Tu peux aussi suivre un plan dans l'onglet Course ou Natation.`);
  tips.push("Toutes les 5 à 6 semaines, fais une semaine plus légère (moitié des séries) pour récupérer.");
  const desc = `${LEVELS[lvl]} · ${days} séances par semaine · environ ${dur} min · ${EQUIP[eq]}. Objectifs : ${gl.join(", ") || "forme générale"}.`;
  return {id:"c-" + Date.now().toString(36), custom:true, name, level:LEVELS[lvl] + " · sur mesure", freq:`${days} séances / semaine`, weeks:"8 semaines, puis on refait le point", desc, tips, sessions, goals:[...G], createdAt:new Date().toISOString()};
}

/* ----- Interface de conversation ----- */
let ST = null, MSG = [];
const bot = (html, chips) => MSG.push({f:"b", html, chips});
const me = text => MSG.push({f:"m", html:esc(text)});
function ask(){
  const g = ST.goals;
  if (!g.size) return bot("Dis-moi ce que tu veux travailler, avec tes mots. Par exemple : <i>« élargir mes épaules et monter mon développé couché »</i>, <i>« squat lourd »</i>, <i>« préparer la saison de bodyboard »</i> ou <i>« perdre du gras »</i>.", [["g:shoulders","Largeur d'épaules"],["g:bench","Développé couché"],["g:force","Force"],["g:hypertrophy","Prise de muscle"],["g:fatloss","Perte de gras"],["g:surf","Bodyboard / surf"],["g:run","Course"],["g:glutes","Fessiers"]]);
  if (!ST.goalsOk) return bot(`J'ai compris : <b>${[...g].map(k => GOALS[k].l).join(", ")}</b>. Tu veux ajouter autre chose ?`, [["ok:goals","C'est tout"],["g:core","+ Abdos"],["g:arms","+ Bras"],["g:mobility","+ Mobilité"],["g:back","+ Dos"],["g:legs","+ Jambes"]]);
  if (!ST.level) return bot("Quel est ton niveau en musculation ?" + (ST.hint ? ` <span class="note-s">(${ST.hint})</span>` : ""), [["l:deb","Débutant · moins de 6 mois"],["l:int","Intermédiaire · 6 mois à 2 ans"],["l:conf","Confirmé · plus de 2 ans"]]);
  if (!ST.days) return bot("Combien de séances de muscu par semaine ?", [2,3,4,5,6].map(n => ["d:" + n, n + " séances"]));
  if (!ST.dur) return bot("Combien de temps par séance ?", [45,60,75,90].map(n => ["t:" + n, n === 60 ? "1 h" : n === 90 ? "1 h 30" : n + " min"]));
  if (!ST.equip) return bot("Tu t'entraînes où ?", Object.entries(EQUIP).map(([k, l]) => ["e:" + k, l]));
  const p = build(ST); ST.result = p;
  bot(`Voici ton programme : <b>${esc(p.name)}</b><br><span class="note-s">${esc(p.desc)}</span>` + p.sessions.map(s => `<div class="prog-s" style="margin-top:10px"><h3>${esc(s.name)}</h3>${s.items.map(([id, sets, reps, rest]) => { const e = exById(id); return `<div class="prog-ex"><span class="thumb">${exThumb(e)}</span><span class="ex-t"><b>${esc(e.name)}</b><span>${sets} × ${esc(reps)}${rest ? ` · repos ${fClock(rest)}` : ""}</span></span></div>`; }).join("")}</div>`).join("") + `<ul class="tips" style="margin-top:12px">${p.tips.map(t => `<li>${esc(t)}</li>`).join("")}</ul>`, [["save","Suivre ce programme"],["redo","Recommencer"]].concat(ST.goals.has("run") ? [["plan:course","Voir les plans course"]] : []).concat(ST.goals.has("swim") ? [["plan:natation","Voir les plans natation"]] : []));
}
function drawChat(typing){
  const box = $("#chatBox"); if (!box) return;
  box.innerHTML = MSG.map((m, i) => `<div class="msg ${m.f}">${m.f === "b" ? `<img class="msg-av" src="logo.png" alt="">` : ""}<div class="bub">${m.html}${m.chips && i === MSG.length - 1 && !typing ? `<div class="qchips">${m.chips.map(([v, l]) => `<button type="button" data-q="${esc(v)}">${esc(l)}</button>`).join("")}</div>` : ""}</div></div>`).join("") + (typing ? `<div class="msg b"><img class="msg-av" src="logo.png" alt=""><div class="bub typing"><i></i><i></i><i></i></div></div>` : "");
  requestAnimationFrame(() => { const p = $("#ov .panel"); if (p) p.scrollTop = p.scrollHeight; });
}
function botTurn(){ drawChat(true); setTimeout(() => { ask(); drawChat(false); }, 550); }
window.openCoach = function(){
  const n = DB.workouts.filter(w => w.sport === "muscu").length;
  ST = {goals:new Set(), hint:n >= 60 ? `${n} séances de muscu dans ton journal` : n ? `${n} séances dans ton journal` : ""}; MSG = [];
  if (DB.profile && DB.profile.name) bot(`Salut ${esc(DB.profile.name)} ! Je construis ton programme de muscu sur mesure.`); else bot("Salut ! Je construis ton programme de muscu sur mesure.");
  openOv("Coach", `<div id="chatBox" class="chat"></div><form id="chatF" class="chat-in"><input id="chatT" placeholder="Écris ton objectif…" autocomplete="off" enterkeyhint="send"><button class="icon-btn" aria-label="Envoyer"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12h14M13 6l6 6-6 6"/></svg></button></form>`);
  $("#ov .panel").classList.add("chat-panel");
  ovOnClose = () => $("#ov .panel").classList.remove("chat-panel");
  ask(); drawChat(false);
  $("#chatF").addEventListener("submit", e => { e.preventDefault(); const v = $("#chatT").value.trim(); if (!v) return; $("#chatT").value = ""; me(v);
    const before = ST.goals.size; parse(v, ST); if (ST.goals.size && before === 0 && /\b(et|aussi|plus)\b/.test(v) === false) {} if (/^(non|c'?est tout|rien|ok|ca ira|c bon|c'est bon)/i.test(v)) ST.goalsOk = true;
    if (ST.goals.size && before && ST.goals.size === before && !ST.goalsOk) ST.goalsOk = true;
    botTurn(); });
  $("#chatBox").addEventListener("click", e => { const b = e.target.closest("[data-q]"); if (!b) return; const [k, v] = b.dataset.q.split(":"); me(b.textContent);
    if (k === "g") { ST.goals.add(v); }
    if (k === "ok") ST.goalsOk = true; if (k === "l") ST.level = v; if (k === "d") ST.days = +v; if (k === "t") ST.dur = +v; if (k === "e") ST.equip = v;
    if (k === "redo") { ST = {goals:new Set(), hint:ST.hint}; bot("On repart de zéro."); }
    if (k === "plan") { ovOnClose = null; closeOv(); PSEG = v; TAB = "plans"; render(); return; }
    if (k === "save") { const p = ST.result; DB.customPrograms = (DB.customPrograms || []).concat([p]); save(); followProgram(p.id); return; }
    botTurn(); });
};
})();
