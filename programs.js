/* Programmes proposés. Muscu : des séances types à transformer en routines. Course et natation : des plans semaine par semaine à cocher. */
(function(){
/* items : [exercice, séries, objectif de reps, repos en s] */
window.MUSCU_PROGRAMS = [
  {id:"fb3", name:"Full body", level:"Débutant · reprise", freq:"3 séances / semaine", weeks:"6 à 8 semaines",
   desc:"Tout le corps à chaque séance. Idéal pour reprendre, ou quand les semaines sont chargées : chaque muscle est travaillé 3 fois.",
   sessions:[
    {name:"Full body A", items:[["squat",3,"8–10",120],["dc-barre",3,"8–10",120],["rowing-barre",3,"10",90],["dm-halt",2,"10–12",90],["leg-curl-assis",2,"12",60],["gainage",3,"40 s",45]]},
    {name:"Full body B", items:[["sdt-roumain",3,"8–10",120],["di-halt",3,"10",90],["tirage-vert",3,"10–12",90],["fentes-halt",2,"10 / jambe",90],["elev-lat",3,"12–15",60],["crunch-poulie",3,"12",60]]},
    {name:"Full body C", items:[["presse",3,"10–12",120],["dc-halt",3,"10",90],["tractions",3,"max",120],["face-pull",3,"15",60],["curl-ez",2,"10–12",60],["ext-corde",2,"12",60]]}]},
  {id:"ppl", name:"Push · Pull · Jambes", level:"Intermédiaire · perte de gras", freq:"4 à 5 séances / semaine", weeks:"8 semaines",
   desc:"Ta structure actuelle : poussée, tirage, jambes, plus une séance épaules et haut du dos en bonus. Chaque séance finit par 10 minutes de cardio pour la dépense.",
   sessions:[
    {name:"Push", items:[["dc-barre",4,"6–8",150],["di-halt",3,"8–10",90],["dm-halt",3,"8–10",90],["elev-lat",4,"12–15",60],["ext-corde",3,"10–12",60],["rameur",1,"10 min",0]]},
    {name:"Pull", items:[["tractions",4,"6–8",120],["rowing-barre",3,"8–10",90],["tirage-horiz",3,"10–12",90],["face-pull",3,"15",60],["curl-ez",3,"10",60],["curl-marteau",2,"12",60],["rameur",1,"10 min",0]]},
    {name:"Jambes", items:[["squat",4,"5–8",180],["sdt-roumain",3,"8",120],["presse",3,"10–12",90],["leg-curl-assis",3,"12",60],["mollets-debout",4,"12–15",60],["releve-jambes",3,"12",60]]},
    {name:"Épaules · haut du dos", items:[["dm-barre",4,"6–8",120],["elev-lat-poulie",3,"15",60],["reverse-pec",3,"15",60],["shrug-halt",3,"12",60],["rowing-halt",3,"10",90],["velo",1,"15 min",0]]}]},
  {id:"ul4", name:"Haut / Bas", level:"Intermédiaire", freq:"4 séances / semaine", weeks:"8 semaines",
   desc:"Deux séances force et deux séances volume. Un bon équilibre pour progresser sur les gros mouvements tout en prenant du muscle.",
   sessions:[
    {name:"Haut · force", items:[["dc-barre",4,"5–6",180],["rowing-barre",4,"6",150],["dm-barre",3,"6–8",120],["tractions",3,"6–8",120],["curl-barre",2,"8–10",60],["barre-front",2,"8–10",60]]},
    {name:"Bas · force", items:[["squat",4,"5",180],["sdt-roumain",3,"6–8",150],["presse",3,"8–10",120],["leg-curl-assis",3,"10",60],["mollets-debout",4,"10–12",60],["gainage",3,"45 s",45]]},
    {name:"Haut · volume", items:[["di-halt",4,"10",90],["tirage-horiz",4,"10–12",90],["elev-lat",4,"15",60],["pec-deck",3,"12",60],["curl-incline",3,"12",60],["ext-corde",3,"12",60]]},
    {name:"Bas · volume", items:[["souleve-terre",3,"5",180],["bulgare",3,"10 / jambe",90],["hip-thrust",3,"10",90],["leg-ext",3,"12–15",60],["mollets-assis",3,"15",60],["releve-jambes",3,"12",60]]}]},
  {id:"5x5", name:"Force 5×5", level:"Force pure", freq:"3 séances / semaine (A-B-A, puis B-A-B)", weeks:"8 à 12 semaines",
   desc:"Trois mouvements, cinq séries de cinq. Ajoute 2,5 kg à chaque séance réussie. Simple et redoutable pour remonter tes charges (squat, développé couché, soulevé de terre).",
   sessions:[
    {name:"5×5 · A", items:[["squat",5,"5",180],["dc-barre",5,"5",180],["rowing-barre",5,"5",150]]},
    {name:"5×5 · B", items:[["squat",5,"5",180],["dm-barre",5,"5",180],["souleve-terre",1,"5",180]]}]},
  {id:"surf", name:"Prépa bodyboard & surf", level:"Tous niveaux", freq:"2 à 3 séances / semaine", weeks:"6 semaines avant la saison",
   desc:"Rame, gainage, explosivité pour le take-off, mobilité des hanches et des épaules. À caler les jours sans vagues.",
   sessions:[
    {name:"Puissance de rame", items:[["tractions",4,"6–8",120],["rowing-halt",3,"10",90],["pullover-poulie",3,"12",60],["face-pull",3,"15",60],["rame-elastique",4,"45 s",30],["superman",3,"30 s",30]]},
    {name:"Gainage & explosivité", items:[["popup",5,"5",45],["squat-saute",4,"6",90],["kb-swing",4,"15",60],["pallof",3,"10 / côté",45],["rotation-elastique",3,"12 / côté",45],["gainage-lat",3,"30 s",30]]},
    {name:"Mobilité", items:[["mob-hanches",2,"60 s",15],["mob-thoracique",2,"60 s",15],["mob-cheville",2,"45 s",15],["etirement-psoas",2,"45 s / côté",15],["squat-profond",2,"60 s",15],["cat-cow",2,"10",15]]}]}
];

/* Course : sessions {t titre, d description, kind, km (distance visée)} */
const W = (t, d, kind, km) => ({t, d, kind, km});
const rw = [[8,1,"1 min 30"],[6,2,"1 min"],[5,3,"1 min 30"],[4,5,"1 min 30"],[3,8,"2 min"],[2,12,"2 min"]];
const c5 = rw.map(([n, r, m], i) => [1,2,3].map(s => W(`${n} × ${r} min de course`, `5 min de marche rapide, puis ${n} fois (${r} min de course lente / ${m} de marche). Termine par 5 min de marche.${s === 3 ? " Si c'est facile, ajoute une répétition." : ""}`, "footing")));
c5.push([W("20 min de course continue","Échauffement 5 min de marche, 20 min de course très lente (tu dois pouvoir parler), 5 min de marche.","footing"), W("2 × 12 min","5 min de marche, 12 min de course, 2 min de marche, 12 min de course.","footing"), W("25 min de course continue","Même allure tranquille, sans t'arrêter.","footing")]);
c5.push([W("25 min de course","Course lente continue.","footing"), W("20 min + 4 accélérations","20 min de footing puis 4 × 20 s un peu plus vite, récupération en marchant.","footing"), W("Test 5 km","Ton premier 5 km d'une traite, à allure confortable. Note ton temps !","course",5)]);
const c10 = [
  [W("Footing 30 min","Allure facile, en aisance respiratoire.","footing"), W("6 × 1 min rapide","15 min de footing, 6 × (1 min rapide / 1 min 30 lente), 10 min de retour au calme.","fractionne"), W("Sortie longue 5 km","Allure lente et régulière.","longue",5)],
  [W("Footing 30 min","Facile.","footing"), W("8 × 1 min rapide","15 min d'échauffement, 8 × (1 min / 1 min), retour au calme.","fractionne"), W("Sortie longue 6 km","Plus lent que d'habitude, c'est normal.","longue",6)],
  [W("Footing 35 min","Facile.","footing"), W("5 × 3 min allure 10 km","Échauffement, 5 × (3 min soutenu / 2 min lent), retour au calme.","fractionne"), W("Sortie longue 6,5 km","Allure facile.","longue",6.5)],
  [W("Footing 30 min","Semaine allégée : récupère.","footing"), W("Footing 25 min + 5 accélérations","Accélérations de 20 s, récupération complète.","fractionne"), W("Sortie 5 km","Tranquille, semaine de récupération.","longue",5)],
  [W("Footing 40 min","Facile.","footing"), W("3 × 8 min allure seuil","Échauffement, 3 × (8 min soutenu mais tenable / 3 min lent).","fractionne"), W("Sortie longue 7,5 km","Allure facile, hydrate-toi.","longue",7.5)],
  [W("Footing 40 min","Facile.","footing"), W("6 × 2 min rapide","Échauffement, 6 × (2 min rapide / 1 min 30 lent).","fractionne"), W("Sortie longue 8,5 km","Garde de la réserve.","longue",8.5)],
  [W("Footing 40 min","Facile.","footing"), W("2 × 15 min allure 10 km","Échauffement, 2 × (15 min allure visée / 3 min lent).","fractionne"), W("Sortie longue 9 km","La plus longue avant le jour J.","longue",9)],
  [W("Footing 30 min","Semaine d'affûtage.","footing"), W("Footing 20 min + 4 accélérations","Reste frais.","fractionne"), W("Objectif 10 km !","Pars prudemment les 3 premiers km, puis accélère si tu te sens bien.","course",10)]];
const c10p = [
  [W("Footing 40 min","Facile.","footing"), W("VMA : 10 × 300 m","20 min d'échauffement, 10 × 300 m vite / 1 min de récupération trottinée.","fractionne"), W("Sortie longue 10 km","Allure facile.","longue",10)],
  [W("Footing 45 min","Facile.","footing"), W("Seuil : 3 × 10 min","Échauffement, 3 × 10 min allure semi-marathon / 2 min.","fractionne"), W("Sortie longue 11 km","Facile.","longue",11)],
  [W("Footing 45 min","Facile.","footing"), W("VMA : 8 × 400 m","Échauffement, 8 × 400 m / 1 min 30 de récupération.","fractionne"), W("Sortie longue 12 km","Dont les 2 derniers km un peu plus vite.","longue",12)],
  [W("Footing 35 min","Semaine allégée.","footing"), W("Fartlek 30 min","Alterne librement accélérations et récupérations.","fractionne"), W("Sortie 9 km","Facile.","longue",9)],
  [W("Footing 45 min","Facile.","footing"), W("Allure 10 km : 3 × 2 km","Échauffement, 3 × 2 km allure objectif / 2 min.","fractionne"), W("Sortie longue 12 km","Facile.","longue",12)],
  [W("Footing 30 min","Affûtage.","footing"), W("5 × 1 km allure 10 km","Récupération 1 min 30, reste frais.","fractionne"), W("Course 10 km chrono","Donne tout sur la deuxième moitié.","course",10)]];

const N = (t, d, m) => ({t, d, m});
const n1 = [[400,"6 × 50 m crawl (récup 30 s), 100 m brasse souple"],[500,"8 × 50 m crawl (récup 30 s), 100 m dos"],[700,"4 × 100 m crawl (récup 30 s), 200 m pull-buoy ou brasse"],[800,"3 × 200 m crawl (récup 45 s), 4 × 50 m éducatifs"],[1000,"2 × 300 m crawl (récup 1 min), 4 × 50 m rapides, 200 m souple"],[1200,"400 m + 300 m + 200 m crawl (récup 1 min), 100 m dos, 100 m souple"]]
  .map(([m, d], i) => [N(`${m} m · reprise`, `100 m d'échauffement varié, puis ${d}.`, m), N(`${m} m · technique`, `100 m d'échauffement, 4 × 25 m rattrapé, 4 × 25 m respiration tous les 3 temps, puis le reste en crawl souple jusqu'à ${m} m.`, m)]);
const n2 = [[1000,"5 × 200 m (récup 30 s)"],[1200,"4 × 300 m (récup 30 s)"],[1300,"3 × 400 m (récup 30 s)"],[1400,"2 × 600 m (récup 45 s)"],[1500,"1000 m + 400 m (récup 1 min)"],[1500,"1500 m crawl continu, test !"]]
  .map(([m, d]) => [N(`Endurance ${m} m`, `200 m d'échauffement, ${d}, 100 m souple.`, m), N("Vitesse 900 m", "200 m d'échauffement, 8 × 50 m rapides (récup 20 s), 4 × 25 m sprint, 100 m souple.", 900), N(`Continu ${Math.round(m * .8 / 50) * 50} m`, "Nage sans t'arrêter, allure régulière, respiration tous les 3 temps.", Math.round(m * .8 / 50) * 50)]);
const n3 = [
  [N("Équilibre et battements","200 m souple, 8 × 25 m battements avec planche, 6 × 25 m bras le long du corps sur le côté, 200 m crawl.",800), N("Respiration","200 m souple, 8 × 25 m respiration tous les 3 temps, 4 × 50 m en expirant longtemps dans l'eau.",700)],
  [N("Rattrapé","200 m souple, 8 × 25 m rattrapé, 4 × 50 m crawl en allongeant la coulée.",800), N("Poing fermé","200 m souple, 6 × 25 m poing fermé, 6 × 25 m normal en sentant l'appui.",700)],
  [N("Rotation","8 × 25 m 6 battements / 1 mouvement de bras, 4 × 50 m crawl en comptant les coups de bras.",900), N("Coudes hauts","6 × 25 m main qui frôle la hanche et l'aisselle, 4 × 50 m pull-buoy.",800)],
  [N("Synthèse","4 × 100 m crawl en essayant de réduire le nombre de mouvements.",1000), N("Test 400 m","400 m crawl chrono, puis 200 m souple. Compare avec ta première séance.",800)]];

window.CARDIO_PLANS = {
  course:[
    {id:"c5", name:"Reprise : 0 à 5 km", level:"Débutant", freq:"3 séances / semaine", desc:"Alternance course et marche qui s'allonge chaque semaine, jusqu'à courir 5 km sans t'arrêter.", weeks:c5},
    {id:"c10", name:"De 5 à 10 km", level:"Ton objectif 10 km", freq:"3 séances / semaine", desc:"Un footing, une séance de qualité et une sortie longue qui grandit de 5 à 10 km. Semaine 4 allégée pour récupérer.", weeks:c10},
    {id:"c10p", name:"Améliorer ton 10 km", level:"Intermédiaire", freq:"3 séances / semaine", desc:"Pour descendre ton chrono une fois les 10 km acquis : VMA, seuil et sorties longues jusqu'à 12 km.", weeks:c10p}],
  natation:[
    {id:"n1", name:"Reprise natation", level:"Débutant", freq:"2 séances / semaine", desc:"De 400 m à 1 200 m par séance, avec un peu de technique à chaque fois. Sport porté, parfait pour ménager les chevilles.", weeks:n1},
    {id:"n2", name:"Endurance : 1 500 m", level:"Intermédiaire", freq:"3 séances / semaine", desc:"Pour nager 1 500 m crawl d'une traite : endurance, vitesse et nage continue.", weeks:n2},
    {id:"n3", name:"Technique crawl", level:"Tous niveaux", freq:"2 séances / semaine", desc:"Éducatifs pour nager plus long et plus économique : équilibre, respiration, rotation, appuis. Utile aussi pour la rame.", weeks:n3}]
};
})();
