/* Schémas d'exercices : silhouette de profil animée entre deux positions (A ↔ B), matériel, carte des muscles.
   Articulations : H tête, N épaule, E coude, W poignet, P hanche, K genou, A cheville, T pointe du pied ; k a t = jambe arrière. */
(function(){
const S = "H50,13 N50,24 E52,38 W53,51 P50,53 K50,71 A50,89 T57,89";
const LY = "H16,58 N25,60 P55,60 K70,56 A75,82 T81,82"; // allongé sur banc
const BENCH = [["rect",10,64,52,5],["line",16,69,16,89],["line",56,69,56,89]];
const P = {
  squat:{a:S+" E43,27 W47,22", b:"H49,32 N45,42 E38,44 W42,39 P33,64 K55,66 A50,89 T57,89", eq:[["bar","N"]], sec:["Fessiers","Ischios","Lombaires"],
    tips:["Pieds largeur d'épaules, pointes légèrement ouvertes","Descends en poussant les hanches en arrière, dos neutre","Genoux dans l'axe des pieds, pousse dans le sol pour remonter"]},
  goblet:{a:S+" E46,36 W54,32", b:"H49,32 N45,42 E50,52 W54,48 P33,64 K55,66 A50,89 T57,89", eq:[["db","W"]], sec:["Fessiers"],
    tips:["Charge tenue contre la poitrine, coudes vers le bas","Descends entre les genoux, buste droit","Remonte en expirant, fessiers serrés en haut"]},
  deadlift:{a:"H64,34 N58,41 E58,55 W58,68 P36,54 K50,68 A47,89 T54,89", b:S, eq:[["plate","W"]], sec:["Fessiers","Ischios","Lombaires","Trapèzes"],
    tips:["Barre collée aux tibias, dos plat avant de tirer","Pousse le sol avec les jambes, la barre frôle les cuisses","Verrouille en haut avec les fessiers, sans te cambrer"]},
  rdl:{a:S, b:"H69,37 N62,42 E62,55 W62,66 P40,52 K47,71", eq:[["bar","W"]], sec:["Fessiers","Lombaires"],
    tips:["Genoux légèrement fléchis et fixes","Hanches vers l'arrière, barre le long des cuisses","Descends jusqu'à l'étirement des ischios, dos plat"]},
  goodmorning:{a:S+" E43,27 W47,22", b:"H69,37 N62,42 E56,40 W60,36 P40,52 K47,71", eq:[["bar","N"]], sec:["Fessiers","Lombaires"],
    tips:["Barre sur les trapèzes, genoux souples","Bascule le buste en reculant les hanches","Remonte en contractant fessiers et ischios"]},
  bench:{a:LY+" E25,46 W25,33", b:"E17,64 W27,51", eq:[["bar","W"]].concat(BENCH), sec:["Triceps","Épaules"],
    tips:["Omoplates serrées, pieds bien ancrés au sol","Descends la barre sur le bas des pectoraux","Pousse en gardant les coudes à environ 45°"]},
  fly:{a:LY+" E28,46 W30,34", b:"E18,56 W12,60", eq:[["db","W"]].concat(BENCH), sec:["Épaules"],
    tips:["Coudes légèrement fléchis tout du long","Ouvre les bras jusqu'à sentir l'étirement","Referme comme pour enlacer un arbre"]},
  incline:{a:"H31,30 N37,39 P53,64 K67,60 A72,84 T78,84 E45,27 W45,14", b:"E30,47 W39,34", eq:[["bar","W"],["thick",56,68,30,36],["line",50,70,50,89]], sec:["Épaules","Triceps"],
    tips:["Banc à 30–45°","Descends vers le haut des pectoraux","Garde les omoplates serrées contre le banc"]},
  ohp:{a:S+" E42,32 W46,24", b:"E52,10 W51,-2", eq:[["bar","W"]], sec:["Triceps","Trapèzes"],
    tips:["Gainage serré, fessiers contractés","Pousse la barre à la verticale, la tête passe dessous","Ne cambre pas le bas du dos"]},
  lateral:{a:S+" E53,38 W55,51", b:"E64,27 W77,26", eq:[["db","W"]], sec:["Trapèzes"],
    tips:["Coudes légèrement fléchis","Monte jusqu'à l'horizontale, pas plus","Contrôle la descente, sans élan"]},
  uprow:{a:S, b:"E63,25 W54,30", eq:[["bar","W"]], sec:["Trapèzes","Biceps"],
    tips:["Prise largeur d'épaules","Tire les coudes vers le haut et l'extérieur","Arrête quand les coudes sont à hauteur d'épaules"]},
  shrug:{a:S, b:"N50,20 H50,9 E50,34 W50,47", eq:[["db","W"]], sec:[],
    tips:["Bras tendus, épaules relâchées en bas","Hausse les épaules vers les oreilles","Marque une pause en haut"]},
  row:{a:"H67,32 N61,38 E61,52 W61,64 P40,52 K47,70 A45,89 T52,89", b:"E50,41 W58,52", eq:[["bar","W"]], sec:["Biceps","Lombaires"],
    tips:["Buste penché à 45°, dos plat","Tire la barre vers le nombril","Serre les omoplates en fin de mouvement"]},
  kickback:{a:"H67,32 N61,38 E52,46 W60,56 P40,52 K47,70 A45,89 T52,89", b:"W38,44", eq:[["db","W"]], sec:[],
    tips:["Coude collé au corps et fixe","Tends complètement le bras vers l'arrière","Contrôle le retour"]},
  pullup:{a:"H53,16 N50,25 E50,13 W50,1 P50,53 K51,70 A50,86 T55,88", b:"H53,-3 N50,8 E42,10 W50,1 P50,36 K52,53 A51,69 T56,71", eq:[["pullbar",32,68,1]], ground:false, sec:["Biceps"],
    tips:["Prise un peu plus large que les épaules","Tire les coudes vers les hanches","Menton au-dessus de la barre, descente contrôlée"]},
  pulldown:{a:"H48,22 N48,32 E49,18 W50,4 P50,60 K68,60 A68,84 T74,84", b:"E40,42 W46,31", eq:[["cable",50,-12,"W"],["rect",38,62,22,5],["rect",62,52,12,4]], sec:["Biceps"],
    tips:["Cuisses calées sous les boudins","Tire la barre vers le haut de la poitrine","Poitrine sortie, sans balancer le buste"]},
  cablerow:{a:"H40,35 N42,46 E56,50 W70,52 P40,70 K58,63 A72,74 T74,68", b:"H37,35 N39,46 E26,54 W41,56", eq:[["cable",104,54,"W"],["rect",28,73,24,5]], sec:["Biceps","Épaules"],
    tips:["Dos droit, genoux légèrement fléchis","Tire la poignée vers le ventre","Serre les omoplates, puis reviens lentement"]},
  pullover:{a:"H55,14 N53,25 E62,14 W72,5 P48,53 K50,71 A49,89 T56,89", b:"E58,40 W57,54", eq:[["cable",96,-12,"W"]], sec:["Pectoraux","Triceps"],
    tips:["Bras tendus, coudes légèrement fléchis","Ramène la barre vers les cuisses","Sens l'étirement des dorsaux en haut"]},
  facepull:{a:S+" E61,30 W74,28", b:"E44,22 W56,16", eq:[["cable",104,26,"W"]], sec:["Trapèzes"],
    tips:["Corde à hauteur du visage","Tire vers les yeux en écartant les mains","Coudes hauts, pause en fin de mouvement"]},
  curl:{a:S+" E50,38 W52,52", b:"W45,26", eq:[["db","W"]], sec:["Avant-bras"],
    tips:["Coudes collés au corps","Monte sans balancer le buste","Descends lentement, bras presque tendus"]},
  pushdown:{a:"H52,13 N51,24 E49,38 W44,27 P50,53 K50,71 A50,89 T57,89", b:"W52,54", eq:[["cable",60,-12,"W"]], sec:[],
    tips:["Coudes fixes contre le corps","Pousse jusqu'à l'extension complète","Remonte lentement jusqu'à 90°"]},
  ohext:{a:S+" E47,8 W36,18", b:"W50,-7", eq:[["db","W"]], sec:[],
    tips:["Coudes pointés vers le plafond, serrés","Descends la charge derrière la tête","Tends sans bouger les coudes"]},
  skull:{a:LY+" E25,42 W25,29", b:"W14,48", eq:[["bar","W"]].concat(BENCH), sec:[],
    tips:["Bras verticaux, coudes fixes","Descends la barre vers le front","Remonte en tendant seulement les avant-bras"]},
  dips:{a:"H50,6 N50,16 E50,28 W50,40 P50,46 K57,62 A48,74 T52,77", b:"H52,18 N50,28 E37,31 W50,40 P50,58 K57,74 A48,86 T52,89", eq:[["thick",40,40,64,40],["line",62,40,62,89]], sec:["Pectoraux","Épaules"],
    tips:["Épaules basses, loin des oreilles","Descends jusqu'à 90° aux coudes","Pousse jusqu'à tendre les bras"]},
  lunge:{a:S+" k50,71 a50,89 t57,89", b:"H50,22 N50,32 E50,46 W50,58 P50,60 K63,64 A63,89 T70,89 k41,78 a28,86 t24,90", eq:[["db","W"]], sec:["Fessiers","Ischios"],
    tips:["Grand pas, buste droit","Le genou arrière descend près du sol","Pousse sur le talon avant pour remonter"]},
  legpress:{a:"H24,40 N30,48 E36,58 W44,64 P46,66 K53,46 A65,40 T65,33", b:"K64,50 A82,36 T82,29", eq:[["thick",18,40,50,72],["foot","A"]], sec:["Fessiers","Ischios"],
    tips:["Pieds largeur d'épaules au milieu du plateau","Descends jusqu'à 90° sans décoller le bassin","Ne verrouille pas les genoux en haut"]},
  legext:{a:"H44,20 N44,30 E46,44 W50,56 P46,58 K64,58 A64,80 T70,82", b:"A85,52 T90,46", eq:[["rect",34,60,32,5],["line",50,65,50,89],["pad","A"]], sec:[],
    tips:["Dos calé contre le dossier","Tends les jambes en contractant les quadriceps","Contrôle la descente"]},
  legcurl:{a:"H44,20 N44,30 E46,44 W50,56 P46,58 K64,58 A86,58 T91,52", b:"A62,80 T68,83", eq:[["rect",34,60,32,5],["line",50,65,50,89],["pad","A"]], sec:["Mollets"],
    tips:["Genoux alignés avec l'axe de la machine","Ramène les talons sous le siège","Remonte lentement"]},
  nordic:{a:"H50,22 N50,32 E50,46 W50,58 P50,60 K50,89 A72,89 T76,86", b:"H84,68 N77,73 E82,81 W88,88 P63,81", sec:["Fessiers"],
    tips:["Chevilles bloquées par un partenaire ou une barre","Descends le plus lentement possible, hanches tendues","Amortis avec les mains, repousse pour remonter"]},
  hipthrust:{a:"H14,50 N22,54 E30,62 W40,64 P42,72 K58,58 A64,86 T70,86", b:"P44,54 E32,52 W42,52", eq:[["plate","P"],["rect",0,58,24,6]], ground:true, sec:["Ischios"],
    tips:["Haut du dos sur le banc, menton rentré","Pousse dans les talons, bassin vers le haut","Serre les fessiers 1 seconde en haut"]},
  bridge:{a:"H14,84 N22,84 E30,86 W40,87 P42,84 K58,68 A64,88 T70,88", b:"P44,70", sec:["Ischios"],
    tips:["Pieds proches des fesses","Monte le bassin en serrant les fessiers","Ne cambre pas le bas du dos"]},
  abduct:{a:"H44,20 N44,30 E50,42 W56,50 P46,58 K66,58 A66,82 T72,84", b:"K68,56", eq:[["rect",34,60,32,5],["line",50,65,50,89]], sec:[],
    tips:["Dos calé, bassin fixe","Écarte (ou serre) les jambes en contrôlant","Pause d'une seconde en fin de mouvement"]},
  glutekick:{a:S+" k50,71 a50,89 t57,89", b:"k38,72 a24,78 t22,73", eq:[["cable",-6,86,"a"]], sec:["Ischios"],
    tips:["Bassin fixe, buste légèrement penché","Pousse la jambe vers l'arrière","Serre le fessier sans cambrer"]},
  calf:{a:S, b:"H50,8 N50,19 E50,33 W50,46 P50,48 K50,66 A52,84 T57,89", eq:[["rect",54,89,14,3]], sec:[],
    tips:["Amplitude complète : talon bas puis pointe haute","Pause d'une seconde en haut","Descends lentement"]},
  plank:{a:"H18,62 N26,66 E26,80 W36,82 P56,70 K72,75 A87,80 T90,84", b:"P56,68", sec:["Épaules","Lombaires"],
    tips:["Coudes sous les épaules","Corps aligné de la tête aux talons","Serre abdos et fessiers, respire calmement"]},
  crunch:{a:"H22,80 N30,84 E26,72 W20,76 P52,84 K64,70 A76,84 T80,84", b:"H32,64 N38,72 E30,62 W26,68", sec:[],
    tips:["Bas du dos plaqué au sol","Enroule le haut du dos en expirant","Ne tire pas sur la nuque"]},
  deadbug:{a:"H16,80 N24,84 E24,70 W24,58 P54,84 K54,68 A70,68 T74,64", b:"E14,74 W6,76 K66,76 A84,82 T88,80", sec:[],
    tips:["Bas du dos collé au sol tout du long","Allonge bras et jambe opposés","Reviens lentement, puis change de côté"]},
  legraise:{a:"H53,16 N50,25 E50,13 W50,1 P50,53 K51,70 A50,86 T55,88", b:"K66,54 A82,52 T84,46", eq:[["pullbar",32,68,1]], ground:false, sec:[],
    tips:["Suspendu, épaules engagées","Monte les jambes sans balancer","Redescends lentement"]},
  twist:{a:"H38,52 N40,60 E50,62 W58,58 P50,82 K64,70 A78,76 T82,72", b:"E44,66 W40,72", eq:[["db","W"]], sec:[],
    tips:["Buste incliné, pieds décollés si possible","Tourne les épaules d'un côté à l'autre","Garde le dos droit"]},
  abwheel:{a:"H42,57 N46,63 E50,75 W52,86 P60,64 K62,89 A82,89 T86,86", b:"H22,73 N28,78 E18,82 W14,86 P56,80", eq:[["wheel","W"]], sec:["Épaules"],
    tips:["Abdos gainés, dos plat","Avance seulement tant que le dos ne se creuse pas","Reviens en tirant avec les abdos"]},
  pushup:{a:"H18,56 N26,60 E26,74 W26,89 P56,69 K72,77 A87,84 T90,89", b:"H18,73 N26,77 E40,79 P56,80 K72,83 A87,86", sec:["Triceps","Épaules"],
    tips:["Mains sous les épaules, corps gainé","Descends la poitrine près du sol","Coudes à 45°, pousse fort"]},
  superman:{a:"H16,80 N24,84 E14,84 W4,84 P54,85 K70,86 A86,86 T90,82", b:"H16,74 N24,80 E14,74 W4,70 K70,82 A86,78 T90,74", sec:["Fessiers"],
    tips:["Allongé sur le ventre, regard vers le sol","Décolle bras et jambes ensemble","Tiens 2 secondes, redescends"]},
  paddle:{a:"H16,78 N24,82 E14,80 W4,82 P54,85 K70,86 A86,86 T90,82", b:"E32,90 W44,88", eq:[["cable",-6,84,"W"]], sec:["Épaules","Lombaires"],
    tips:["Buste légèrement relevé comme sur la planche","Tire l'élastique de l'avant jusqu'à la hanche","Alterne les bras, rythme régulier"]},
  popup:{a:"H16,80 N24,84 E30,78 W30,89 P54,86 K70,87 A86,87 T90,85 k70,87 a86,87 t90,85", b:"H44,40 N44,50 E56,52 W62,58 P46,70 K62,66 A62,89 T68,89 k32,78 a28,89 t24,89", sec:["Pectoraux","Quadriceps"],
    tips:["Mains sous la poitrine, comme sur la planche","Pousse et ramène les pieds sous toi d'un seul geste","Atterris fléchi, regard devant"]},
  kbswing:{a:"H64,36 N58,42 E54,56 W50,72 P38,54 K48,70 A46,89 T53,89", b:S+" E62,34 W76,32", eq:[["kb","W"]], sec:["Ischios","Lombaires"],
    tips:["C'est une bascule de hanches, pas un squat","Projette les hanches, les bras suivent","Dos plat, kettlebell à hauteur d'épaules"]},
  thruster:{a:"H49,32 N45,42 E40,46 W46,38 P33,64 K55,66 A50,89 T57,89", b:S+" E52,10 W51,-2", eq:[["bar","W"]], sec:["Épaules","Fessiers"],
    tips:["Squat complet, charge sur les épaules","Remonte et pousse d'un seul élan","Garde le gainage tout du long"]},
  run:{a:"H55,13 N53,24 E46,36 W54,42 P50,52 K62,62 A56,78 T62,80 k44,68 a36,82 t40,86", b:"E58,36 W64,30 K44,68 A40,84 T47,86 k62,62 a58,78 t64,78", sec:["Mollets","Fessiers"], dur:1.1,
    tips:["Foulée légère, pied sous le bassin","Buste droit, épaules relâchées","Respire en aisance, tu dois pouvoir parler"]},
  bike:{a:"H58,20 N56,30 E66,40 W74,46 P42,50 K58,58 A54,74 T60,76", b:"K56,46 A64,62 T70,62", eq:[["line",40,52,54,86],["line",54,86,78,86],["line",74,46,78,86],["thick",36,50,48,50]], sec:["Mollets"], dur:1.2,
    tips:["Selle à hauteur de hanche","Pédale rond, buste stable","Garde une cadence régulière"]},
  rower:{a:"H38,48 N40,58 E54,60 W66,62 P36,82 K52,72 A66,84 T70,80", b:"H30,48 N32,58 E24,66 W36,68 P44,82 K62,80 A70,84", eq:[["line",10,89,96,89],["rect",30,84,16,4]], ground:false, sec:["Dos","Biceps"],
    tips:["Ordre : jambes, buste, bras","Retour : bras, buste, jambes","Dos droit tout du long"]},
  stretch:{a:"H50,30 N50,40 E50,54 W50,66 P50,66 K64,68 A64,89 T70,89 k38,84 a24,88 t20,90", b:"H50,33 N50,43 P50,70 E50,57 W50,69", sec:[], dur:4,
    tips:["Respire lentement et profondément","Va jusqu'à la tension, jamais la douleur","Tiens 30 à 60 secondes"]},
  deepsquat:{a:"H49,32 N45,42 E54,48 W60,46 P35,72 K56,64 A50,89 T57,89", b:"H49,34 N45,44 P35,74", sec:["Fessiers"], dur:4,
    tips:["Talons au sol, poitrine haute","Pousse les genoux vers l'extérieur avec les coudes","Respire et relâche"]},
  catcow:{a:"H16,60 N24,64 E24,76 W24,89 P56,64 K56,89 A80,89 T84,86", b:"H14,52 N24,60 P56,60", sec:["Abdos"], dur:3,
    tips:["À quatre pattes, mains sous les épaules","Creuse le dos en inspirant","Arrondis en expirant, vertèbre par vertèbre"]},
  stand:{a:S, b:"H50,14 N50,25", sec:[], dur:3, tips:["Respire calmement","Garde une posture neutre","Concentre-toi sur la qualité"]}
};
const MAP = {
  "dc-barre":"bench","dc-halt":"bench","dd-barre":"bench","dc-smith":"bench","dc-machine":"bench","dc-serre":"bench","di-barre":"incline","di-halt":"incline","di-smith":"incline",
  "ecarte-halt":"fly","ecarte-poulie":"fly","pec-deck":"fly","pompes":"pushup","dips-pec":"dips","dips":"dips","dips-machine":"dips",
  "tractions":"pullup","tractions-sup":"pullup","tractions-ass":"pullup","tirage-vert":"pulldown","tirage-vert-serre":"pulldown","tirage-horiz":"cablerow",
  "rowing-barre":"row","rowing-halt":"row","rowing-t":"row","rowing-machine":"cablerow","pullover-poulie":"pullover","souleve-terre":"deadlift","rack-pull":"deadlift","clean":"deadlift",
  "lombaires":"superman","good-morning":"goodmorning","dm-barre":"ohp","dm-halt":"ohp","dm-machine":"ohp","arnold":"ohp","elev-lat":"lateral","elev-lat-poulie":"lateral","elev-lat-machine":"lateral",
  "elev-front":"lateral","oiseau":"row","reverse-pec":"facepull","face-pull":"facepull","tirage-menton":"uprow","shrug-halt":"shrug","shrug-barre":"shrug",
  "curl-barre":"curl","curl-ez":"curl","curl-halt":"curl","curl-marteau":"curl","curl-incline":"curl","curl-pupitre":"curl","curl-poulie":"curl","curl-concentre":"curl","curl-poignet":"curl",
  "ext-poulie":"pushdown","ext-corde":"pushdown","ext-nuque":"ohext","barre-front":"skull","ext-halt":"ohext","kickback":"kickback","farmer":"shrug",
  "squat":"squat","squat-front":"squat","squat-smith":"squat","squat-goblet":"goblet","hack-squat":"squat","presse":"legpress","leg-ext":"legext","fentes-halt":"lunge","fentes-marche":"lunge",
  "bulgare":"lunge","step-up":"lunge","sdt-roumain":"rdl","sdt-roumain-halt":"rdl","sdt-jambes-tendues":"rdl","leg-curl-assis":"legcurl","leg-curl-allonge":"legcurl","nordic":"nordic",
  "hip-thrust":"hipthrust","hip-thrust-machine":"hipthrust","pont-fessier":"bridge","abducteurs":"abduct","adducteurs":"abduct","kickback-poulie":"glutekick",
  "mollets-debout":"calf","mollets-assis":"calf","mollets-presse":"legpress","gainage":"plank","gainage-lat":"plank","crunch":"crunch","crunch-poulie":"crunch",
  "releve-jambes":"legraise","releve-genoux":"legraise","ab-wheel":"abwheel","russian-twist":"twist","pallof":"facepull","woodchop":"twist","dead-bug":"deadbug","mountain":"plank",
  "kb-swing":"kbswing","burpees":"popup","thruster":"thruster","sled":"run","rameur":"rower","velo":"bike","elliptique":"run","tapis":"run","stairmaster":"run","corde-sauter":"calf","ski-erg":"pullover",
  "popup":"popup","rame-elastique":"paddle","superman":"superman","rotation-elastique":"twist","squat-saute":"squat","bosu":"stand","apnee-statique":"stand",
  "mob-hanches":"stretch","mob-cheville":"stretch","mob-thoracique":"catcow","etirement-psoas":"stretch","squat-profond":"deepsquat","cat-cow":"catcow"
};
const BY_MUSCLE = {Pectoraux:"bench",Dos:"row",Épaules:"ohp",Biceps:"curl",Triceps:"pushdown","Avant-bras":"curl",Trapèzes:"shrug",Abdos:"crunch",Lombaires:"superman",Quadriceps:"squat",Ischios:"rdl",Fessiers:"hipthrust",Mollets:"calf","Corps entier":"kbswing",Cardio:"run",Mobilité:"stretch"};
const parse = s => { const o = {}; String(s || "").replace(/([A-Za-z])(-?\d+(?:\.\d+)?),(-?\d+(?:\.\d+)?)/g, (_, j, x, y) => { o[j] = [+x, +y]; }); return o; };
const cache = {}; let CLIP = 0;
function pose(id){ if (cache[id]) return cache[id]; const p = P[id]; const a = parse(p.a), b = Object.assign({}, a, parse(p.b)); return cache[id] = {p, a, b}; }
window.figPattern = ex => MAP[ex.id] || (ex.pattern) || BY_MUSCLE[ex.muscle] || "stand";
window.figInfo = ex => P[figPattern(ex)] || P.stand;
const SEG = [["N","P",5.5],["N","E",4.6],["E","W",4.2],["P","K",5.5],["K","A",4.8],["A","T",3.6]];
const SEG2 = [["P","k",5.2],["k","a",4.6],["a","t",3.4]];
window.figSVG = function(ex, opt){
  opt = opt || {}; const anim = !!opt.anim; let {p, a, b} = pose(figPattern(ex)); if (opt.pose === "b") a = b; const dur = (p.dur || 2.4) + "s";
  const ks = 'calcMode="spline" keyTimes="0;0.5;1" keySplines=".45 0 .55 1;.45 0 .55 1"';
  const av = (attr, va, vb) => anim && (va !== vb) ? `<animate attributeName="${attr}" values="${va};${vb};${va}" dur="${dur}" repeatCount="indefinite" ${ks}/>` : "";
  const pt = (o, j) => o[j] || (j === "k" ? o.K : j === "a" ? o.A : j === "t" ? o.T : [0,0]);
  const line = (j1, j2, w, cls) => { const A1 = pt(a, j1), A2 = pt(a, j2), B1 = pt(b, j1), B2 = pt(b, j2);
    return `<line class="${cls}" x1="${A1[0]}" y1="${A1[1]}" x2="${A2[0]}" y2="${A2[1]}" stroke-width="${w}">${av("x1", A1[0], B1[0])}${av("y1", A1[1], B1[1])}${av("x2", A2[0], B2[0])}${av("y2", A2[1], B2[1])}</line>`; };
  let back = "", body = "", eq = "";
  if (a.k) back = SEG2.map(([x, y, w]) => line(x, y, w, "fg-b")).join("");
  body = SEG.map(([x, y, w]) => line(x, y, w, "fg")).join("");
  const H1 = a.H, H2 = b.H;
  body += `<circle class="fg-h" cx="${H1[0]}" cy="${H1[1]}" r="6.2">${av("cx", H1[0], H2[0])}${av("cy", H1[1], H2[1])}</circle>`;
  (p.eq || []).forEach(e => { const t = e[0];
    if (t === "rect") eq += `<rect class="fq-s" x="${e[1]}" y="${e[2]}" width="${e[3]}" height="${e[4]}" rx="1.5"/>`;
    else if (t === "line") eq += `<line class="fq-l" x1="${e[1]}" y1="${e[2]}" x2="${e[3]}" y2="${e[4]}"/>`;
    else if (t === "thick") eq += `<line class="fq-l" x1="${e[1]}" y1="${e[2]}" x2="${e[3]}" y2="${e[4]}" stroke-width="5"/>`;
    else if (t === "pullbar") eq += `<line class="fq-l" x1="${e[1]}" y1="${e[3]}" x2="${e[2]}" y2="${e[3]}" stroke-width="3"/>`;
    else if (t === "cable") { const A1 = pt(a, e[3]), B1 = pt(b, e[3]); eq += `<line class="fq-c" x1="${e[1]}" y1="${e[2]}" x2="${A1[0]}" y2="${A1[1]}">${av("x2", A1[0], B1[0])}${av("y2", A1[1], B1[1])}</line>`; }
    else { const A1 = pt(a, e[1]), B1 = pt(b, e[1]); const dx = t === "bar" && e[1] === "N" ? -1 : 0, dy = t === "bar" && e[1] === "N" ? -3 : 0;
      const shape = t === "plate" ? `<circle r="8.5" class="fq-a"/><circle r="2" class="fq-in"/>` : t === "bar" ? `<circle r="6" class="fq-a"/><circle r="1.6" class="fq-in"/>` : t === "db" ? `<rect x="-5.5" y="-3" width="11" height="6" rx="2" class="fq-a"/>` : t === "kb" ? `<circle r="5.5" cy="2" class="fq-a"/><path d="M-3.5 -1 a3.5 3.5 0 0 1 7 0" class="fq-al"/>` : t === "wheel" ? `<circle r="5" class="fq-a"/>` : t === "foot" ? `<rect x="-2" y="-11" width="4" height="15" rx="1.5" class="fq-a"/>` : t === "pad" ? `<rect x="-3.5" y="-3.5" width="7" height="7" rx="3" class="fq-a"/>` : "";
      const tr = (q) => `${q[0] + dx} ${q[1] + dy}`;
      eq += `<g transform="translate(${tr(A1)})">${anim && (A1[0] !== B1[0] || A1[1] !== B1[1]) ? `<animateTransform attributeName="transform" type="translate" values="${tr(A1)};${tr(B1)};${tr(A1)}" dur="${dur}" repeatCount="indefinite" ${ks}/>` : ""}${shape}</g>`; } });
  const ground = p.ground === false ? "" : `<line class="fq-g" x1="-60" y1="90.5" x2="160" y2="90.5"/>`;
  const before = (p.eq || []).some(e => e[0] === "bar" || e[0] === "plate") ? "" : eq;
  // cadrage serré autour du mouvement (positions A et B + matériel), carré
  const xs = [], ys = []; [a, b].forEach(o => Object.values(o).forEach(([x, y]) => { xs.push(x); ys.push(y); }));
  (p.eq || []).forEach(e => { if (e[0] === "rect") { xs.push(e[1], e[1] + e[3]); ys.push(e[2], e[2] + e[4]); } else if (e[0] === "line" || e[0] === "thick") { xs.push(e[1], e[3]); ys.push(e[2], e[4]); } else if (e[0] === "pullbar") { xs.push(e[1], e[2]); ys.push(e[3]); } });
  let x0 = Math.min(...xs) - 9, x1 = Math.max(...xs) + 9, y0 = Math.min(...ys) - 9, y1 = Math.max(...ys) + 4;
  const sz = Math.max(x1 - x0, y1 - y0, 56), cx = (x0 + x1) / 2, cy = (y0 + y1) / 2;
  const vb = `${(cx - sz/2).toFixed(1)} ${(cy - sz/2).toFixed(1)} ${sz.toFixed(1)} ${sz.toFixed(1)}`;
  return `<svg class="fig${anim ? " anim" : ""}" viewBox="${vb}" aria-hidden="true"><clipPath id="c${++CLIP}"><rect x="${(cx - sz/2).toFixed(1)}" y="${(cy - sz/2).toFixed(1)}" width="${sz.toFixed(1)}" height="${sz.toFixed(1)}"/></clipPath><g clip-path="url(#c${CLIP})">${ground}${before}${back}${body}${before ? "" : eq}</g></svg>`;
};

/* Carte des muscles : face et dos */
const MUS_SHAPES = {
  front:{
    "Épaules":'<circle cx="15" cy="27" r="5"/><circle cx="45" cy="27" r="5"/>',
    "Pectoraux":'<ellipse cx="24" cy="33" rx="6.5" ry="5"/><ellipse cx="36" cy="33" rx="6.5" ry="5"/>',
    "Biceps":'<ellipse cx="11" cy="40" rx="3.2" ry="7"/><ellipse cx="49" cy="40" rx="3.2" ry="7"/>',
    "Avant-bras":'<ellipse cx="9" cy="56" rx="2.8" ry="7"/><ellipse cx="51" cy="56" rx="2.8" ry="7"/>',
    "Abdos":'<rect x="25" y="39.5" width="10" height="21" rx="3"/>',
    "Quadriceps":'<ellipse cx="24" cy="76" rx="5.2" ry="12"/><ellipse cx="36" cy="76" rx="5.2" ry="12"/>',
    "Mollets":'<ellipse cx="24" cy="99" rx="3.4" ry="8"/><ellipse cx="36" cy="99" rx="3.4" ry="8"/>'
  },
  back:{
    "Trapèzes":'<path d="M30 17 L41 25 L30 34 L19 25 Z"/>',
    "Épaules":'<circle cx="15" cy="27" r="5"/><circle cx="45" cy="27" r="5"/>',
    "Dos":'<ellipse cx="23" cy="39" rx="5.5" ry="10"/><ellipse cx="37" cy="39" rx="5.5" ry="10"/>',
    "Triceps":'<ellipse cx="11" cy="40" rx="3.2" ry="7"/><ellipse cx="49" cy="40" rx="3.2" ry="7"/>',
    "Avant-bras":'<ellipse cx="9" cy="56" rx="2.8" ry="7"/><ellipse cx="51" cy="56" rx="2.8" ry="7"/>',
    "Lombaires":'<rect x="25.5" y="48" width="9" height="10" rx="3"/>',
    "Fessiers":'<ellipse cx="24.5" cy="65" rx="6" ry="5"/><ellipse cx="35.5" cy="65" rx="6" ry="5"/>',
    "Ischios":'<ellipse cx="24" cy="80" rx="5" ry="10"/><ellipse cx="36" cy="80" rx="5" ry="10"/>',
    "Mollets":'<ellipse cx="24" cy="99" rx="3.8" ry="8"/><ellipse cx="36" cy="99" rx="3.8" ry="8"/>'
  }
};
const SIL = '<circle cx="30" cy="10" r="6.5"/><rect x="27" y="15" width="6" height="5" rx="2"/><rect x="17" y="20" width="26" height="44" rx="9"/><rect x="5" y="22" width="11" height="44" rx="5.5"/><rect x="44" y="22" width="11" height="44" rx="5.5"/><rect x="18" y="58" width="11.5" height="54" rx="5.5"/><rect x="30.5" y="58" width="11.5" height="54" rx="5.5"/>';
const EXPAND = {"Corps entier":["Quadriceps","Fessiers","Dos","Épaules","Abdos"], Cardio:["Quadriceps","Mollets","Fessiers"], Mobilité:["Fessiers","Lombaires","Ischios"]};
window.muscleMap = function(primary, secs){
  const pri = new Set(EXPAND[primary] || [primary]), sec = new Set((secs || []).filter(m => !pri.has(m)).flatMap(m => EXPAND[m] || [m]));
  const side = (k, x) => `<g transform="translate(${x} 0)"><g class="mm-sil">${SIL}</g>${Object.entries(MUS_SHAPES[k]).map(([m, s]) => `<g class="${pri.has(m) ? "mm-p" : sec.has(m) ? "mm-s" : "mm-o"}">${s}</g>`).join("")}<text x="30" y="120" text-anchor="middle" class="mm-t">${k === "front" ? "Face" : "Dos"}</text></g>`;
  return `<svg class="mmap" viewBox="0 0 132 124" role="img" aria-label="Muscles travaillés">${side("front", 2)}${side("back", 70)}</svg>`;
};
window.FIG_PATTERNS = Object.keys(P);
})();
