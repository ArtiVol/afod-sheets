// Разметка листов. Все координаты в пунктах PDF (страница 842×595), y сверху.
// Метка: {k, x, y, w, h, kind, mode, i?, glyph?, tip?}
//   kind: fill | box | ring | chip | bullet | tri | stamp
//   mode: tog (вкл/выкл), lvl (счётчик по индексу i), radio (значение i)
// Поле: {k, x, t, w, h, fs}

// Порядок как в PDF
export const PLAYBOOKS = {
  fist:         { title: 'The Fist',          img: 'fist.webp' },
  shot:         { title: 'The Shot',          img: 'shot.webp' },
  law:          { title: 'The Law',           img: 'law.webp' },
  gamble:       { title: 'The Gamble',        img: 'gamble.webp' },
  scout:        { title: 'The Scout',         img: 'scout.webp' },
  outlaw:       { title: 'The Outlaw',        img: 'outlaw.webp' },
  thunderheart: { title: 'The Thunderheart',  img: 'thunderheart.webp' },
  speaker:      { title: 'The Speaker',       img: 'speaker.webp' },
  plan:         { title: 'The Plan',          img: 'plan.webp' },
  gentle:       { title: 'The Gentle Touch',  img: 'gentle.webp' },
  wrench:       { title: 'The Wrench & Saw',  img: 'wrench.webp' },
  revenant:     { title: 'The Revenant',      img: 'revenant.webp' },
};

// Типы банд. Отличаются спецспособностями (y кружков), ветераном и образом действий (modus)
export const POSSES = {
  hellstone: { title: 'Hellstone Scavengers', img: 'hellstone.webp', ab: [96,124,152,180,232,272,312], vet: 340,
    modus: [['Scavenge',472.0,516.6],['Mining',525.6,559.4],['Supply',568.3,598.5],['Sale',607.5,627.7]] },
  outlaw:    { title: 'Outlaw Posse', img: 'outlawposse.webp', ab: [96,124,176,204,232,260,300], vet: 328,
    modus: [['Intimidation',431.8,491.8],['Superiority',502.6,555.8],['Swiftness',566.6,611.7],['Spectacle',622.5,668.1]] },
  bounty:    { title: 'Bounty Hunters', img: 'bounty.webp', ab: [96,124,176,216,256,284,312], vet: 340,
    modus: [['Violence',440.5,483.6],['Negotiation',494.6,554.8],['Connection',565.8,624.9],['Trap',635.8,657.2]] },
  tribe:     { title: 'Tribe', img: 'tribe.webp', ab: [96,121,170,207,244,281,318], vet: 379,
    modus: [['Show of Force',438.4,506.6],['Swiftness',517.6,564.1],['Social',575.0,605.5],['Sacrifice',616.4,659.3]] },
};
export const DEFAULT_POSSE = 'bounty';
export const posseInfo = type => POSSES[type] || POSSES[DEFAULT_POSSE];

// ---------- Плейбук: общая часть (перенесена из макета Claude Design) ----------

const HOLES = {
  pbxp: [[648.1,68,10],[660.5,68,10],[639,76.5,10.4],[669.3,77.4,10],[638.4,88.9,10],[668.9,90.2,10],[646.6,97.8,9.6],[659.3,98.2,10]],
  mutation: [[309.9,260.7,9.2],[321,260.7,8.8],[301.8,268.4,8.8],[328.9,269.3,8.8],[301.2,279.5,9.2],[328.6,280.7,8.8],[308.6,287.7,8.8],[319.9,288,9.2]],
  heal: [[352.8,265.5,12.4],[369.9,266.5,12.4],[351.8,282.8,12.4],[368.8,283.7,12.4]],
  xp_wit: [[88.5,491.7,13.2],[104.7,492.4,13.2],[79.1,505.7,13.2],[113.1,507.1,13.2],[87.4,520.5,12.8],[104.1,520.9,13.2]],
  xp_prowess: [[222.7,477.9,13.2],[238.6,481.3,12.8],[211.1,490,13.2],[244.3,497.2,13.2],[216.8,506.1,13.2],[233.2,509.3,13.2]],
  xp_guts: [[367.8,491.7,12.8],[351.8,494.6,12.8],[379.2,504.2,13.2],[345.8,510.4,13.2],[373.5,519.7,12.8],[357.2,523,13.2]],
};
const ACTIONS = {
  hunt: [[26.4,542.7],[45.7,541.7],[57.6,541],[69.6,540.2]], read: [[27,553.9],[46.3,552.7],[58.2,551.9],[70.3,551]],
  survey: [[27.1,564.9],[46.9,563.7],[58.9,563.3],[71,562.2]], craft: [[28.3,576],[47.7,574.6],[59.5,573.5],[71.8,573.2]],
  sling: [[138.4,520.6],[157.3,520],[168.8,519.9],[180.5,519.7]], prowl: [[138.6,531.4],[157.5,530.8],[169,530.6],[180.7,530.3]],
  brawl: [[138.8,542],[157.6,541.5],[169.2,541.5],[180.9,541.1]], disable: [[139,552.6],[157.8,552],[169.3,551.5],[181.1,551.8]],
  attune: [[266.9,531.2],[286,532.4],[298,533.1],[310,533.8]], command: [[266.1,542.4],[285.3,543.5],[297.3,544.1],[309.3,544.6]],
  consort: [[265,553.6],[284.7,554.4],[296.6,555.3],[308.7,555.7]], sway: [[264.6,564.6],[284.2,565.3],[296.1,565.6],[308.1,566.7]],
};
const WORDS = [
  ['her','African',63,91,155],['her','Far East',101,129,155],['her','European',140,173,155],
  ['her','Southern',63,99,163],['her','Native',105,126,163],['her','Mysterious',135,176,163],
  ['bg','Big Town',269,302,155],['bg','Frontier Town',309,363,155],
  ['bg','Ranch',221,244,163],['bg','Fort',250,265,163],['bg','Tribe',272,290,163],['bg','Loner',297,318,163],['bg','Immigrant',324,364,163],
  ['st','Scarred',289,324,206],['st','Corrupted',337,385,206],['st','Visions',289,319,215],['st','Gloryhound',330,385,215],
  ['st','Voices',289,314,224],['st','Cursed',324,353,224],['st','Numb',363,385,224],['st','Hunted',289,321,233],['st','Shamed',333,362,233],
];
const LINES = [
  ['name',14,91,173],['posse',202,91,178],['look',14,117,365],['heritage',14,143,173],['background',202,143,178],['vice',14,177,365],
  ...[357,371,385,399,413,427,441].map((b,i)=>['notes'+i,14,b,364]),
  ['notes7',14,455,217],['notes8',14,469,222],['notes9',14,483,102],['notes10',14,495,49],
];
// Общие предметы (одинаковы во всех плейбуках); ключи как в макете, чтобы импорт старого JSON работал
const GEAR = [[688,436],[737,436],[688,448],[771,448],[688,460],[688,472],[772,472],[785,472],[688,484],[700,484],[688,496],[688,508],[688,520],[735,520],
  [688,532],[688,544],[688,556],[700,556],[688,568],[759,568],[688,580],[700,580]];

// Различия плейбуков, снятые с PDF: спецспособности (y кружков), ветеран,
// лишние квадратики у предметов плейбука, число строк контактов (fr)
const DIFF = {
  fist:         { ab: [95.2,135.2,175.2,215.2,267.2,307.2,347.2], vet: 387.2, piExtra: [[554.2,443.5,1]] },
  shot:         { ab: [95.2,147.2,199.2,251.2,279.2,307.2,347.2], vet: 387.2, piExtra: [[554.2,443.5,1]] },
  law:          { ab: [95.2,135.2,187.2,227.2,267.2,307.2,347.2], vet: 387.2, piExtra: [[554.2,431.5,0],[554.2,443.5,1]] },
  gamble:       { ab: [95.2,135.2,175.2,215.2,255.2,283.2,323.2], vet: 387.2, piExtra: [] },
  scout:        { ab: [95.2,135.2,175.2,215.2,243.2,283.2,311.2,351.2], vet: 391.2, piExtra: [[552.4,467.5,3]] },
  outlaw:       { ab: [95.2,135.2,163.2,203.2,243.2,283.2,335.2], vet: 387.2, piExtra: [[554.2,443.5,1]], fr: 6 },
  thunderheart: { ab: [95.2,135.2,199.2,239.2,279.2,331.2,359.2], vet: 387.2, piExtra: [] },
  speaker:      { ab: [95.2,135.2,163.2,191.2,219.2,271.2,323.2], vet: 363.2, piExtra: [] },
  plan:         { ab: [95.2,159.2,199.2,227.2,267.2,319.2,359.2], vet: 387.2, piExtra: [], fr: 6 },
  gentle:       { ab: [95.2,123.2,163.2,203.2,243.2,271.2,299.2,339.2], vet: 379.2, piExtra: [[554.2,455.5,2]] },
  wrench:       { ab: [95.2,135.2,175.2,203.2,243.2,283.4,311.5,351.5], vet: 391.5, piExtra: [[554.2,443.5,1]] },
  // Revenant: вместо Grit/Stigma — Passion/Decay, нет мутации и фишек-заначки, контакты и предметы вписываются вручную
  revenant:     { ab: [95.2,135.2,163.2,203.2,243.2,283.2,347.2], vet: 387.2, piExtra: [], revenant: true },
};

const REVENANT_WORDS = [
  ['st','Cold',288.8,310.9,206.2],['st','Obsessed',322.5,362.0,206.2],['st','Beheaded',288.8,329.8,215.2],['st','Chaotic',340.5,375.5,215.2],
  ['st','Unstable',297.5,336.1,224.2],['st','Vicious',345.6,375.1,224.2],['st','Stinking',297.5,335.3,233.2],
];

function ringOrder(pts) {
  const cx = pts.reduce((a,p)=>a+p[0],0)/pts.length, cy = pts.reduce((a,p)=>a+p[1],0)/pts.length;
  const ang = p => (Math.atan2(p[0]-cx, -(p[1]-cy)) + 2*Math.PI) % (2*Math.PI);
  return [...pts].sort((a,b)=>ang(a)-ang(b));
}

export function playbookLayout(pb) {
  const D = DIFF[pb];
  const marks = [], fields = [];
  const m = (o) => marks.push(o);

  const R = !!D.revenant;
  Object.entries(HOLES).filter(([k]) => !(R && k === 'mutation')).forEach(([k,pts]) => ringOrder(pts).forEach((p,i) =>
    m({k, i, mode:'lvl', kind:'fill', x:p[0], y:p[1], w:p[2]+0.4, h:p[2]+0.4})));
  Object.entries(ACTIONS).forEach(([a,pts]) => pts.forEach((p,i) =>
    m({k:'act_'+a, i, mode:'lvl', kind:'fill', x:p[0], y:p[1], w:9, h:9, tip:a})));
  for (let i=0;i<9;i++) m({k:'grit', i, mode:'lvl', kind:'bullet', x:70+i*10, y:219.6, w:8.6, h:24});
  for (let i=0;i<4;i++) m({k:'stigma', i, mode:'lvl', kind:'bullet', x:202.5+i*10, y:219.6, w:8.6, h:24});
  [[735.6,755.6],[756.9,777.5],[779.4,799.4],[800.6,820]].forEach(([a,b],i) => {
    m({k:'coin'+i+'t', mode:'tog', kind:'box', x:(a+b)/2, y:26, w:b-a-3, h:7.6});
    m({k:'coin'+i+'b', mode:'tog', kind:'box', x:(a+b)/2, y:35.6, w:b-a-3, h:7.6});
  });
  if (!R) [[700.6,10],[735,20],[768.8,30],[805.6,40]].forEach(([x,n]) => m({k:'stash'+n, mode:'tog', kind:'chip', x, y:62.5, w:31, h:31}));
  (R ? [...WORDS.filter(w => w[0] !== 'st'), ...REVENANT_WORDS] : WORDS).forEach(([g,w,a,b,base]) => m({k:g+'_'+w, mode:'tog', kind:'ring', x:(a+b)/2, y:base-3, w:b-a+3, h:9}));
  [[687,726],[728,779],[781,824]].forEach(([a,b],i) => m({k:'load', i, mode:'radio', kind:'ring', light:true, x:(a+b)/2, y:416.5, w:b-a+4, h:14}));
  D.ab.forEach((y,i) => m({k:'ab'+i, mode:'tog', kind:'fill', x:395.6, y, w:8, h:8}));
  [395.8,405.5,415.2].forEach((x,i) => m({k:'vet'+i, mode:'tog', kind:'fill', x, y:D.vet, w:8, h:8}));
  [431.2,443.2,455.2,467.2,479.2,491.2].slice(0, D.fr || 5).forEach((y,i) => {
    // Треугольники закрашиваются по форме напечатанных (сверено с картинкой)
    m({k:'cf'+i, mode:'tog', kind:'tri', dir:'up', x:393.4, y:y-0.8, w:9, h:7.8, tip:'friend'});
    m({k:'cr'+i, mode:'tog', kind:'tri', dir:'down', x:402.8, y:y-0.9, w:8.7, h:7.3, tip:'rival'});
  });
  // Квадратики сверены с картинкой: сам квадрат на 0.3 pt выше центра глифа, размер 7.2 pt
  m({k:'armor', mode:'tog', kind:'box', x:293.2, y:304.2, w:7.4, h:7.4});
  m({k:'sarmor', mode:'tog', kind:'box', x:293.2, y:316.2, w:7.4, h:7.4});
  [431.5,443.5,455.5,467.5,479.5,491.5].forEach((y,i) => m({k:'pi'+i, mode:'tog', kind:'box', x:541.3, y:y-0.3, w:7.4, h:7.4}));
  D.piExtra.forEach(([x,y,row]) => m({k:'pix'+row+'_'+Math.round(x), mode:'tog', kind:'box', x:x-0.1, y:y-0.3, w:7.4, h:7.4}));
  GEAR.forEach(([x,b]) => m({k:'gi_'+x+'_'+b, mode:'tog', kind:'box', x:x+3.8, y:b-3.6, w:7.4, h:7.4}));

  LINES.forEach(([k,x,b,w]) => fields.push({k, x, t:b-13, w, h:14, fs:12}));
  // Строки ран центрированы по белым ячейкам на картинке
  [['harm3',33,266,215],['harm2a',33,284.7,113],['harm2b',150,284.7,98],['harm1a',33,303.2,113],['harm1b',150,303.2,98]]
    .forEach(([k,x,t,w]) => fields.push({k, x, t, w, h:14, fs:12}));
  fields.push({k:'veteran', x:403, t:D.vet+4.8, w:273, h:14, fs:11});
  if (R) for (let i=0;i<5;i++) {
    fields.push({k:'contact'+i, x:409.8, t:426.6+i*12, w:118.4, h:11.5, fs:9.5});
    fields.push({k:'item'+i, x:548, t:426.8+i*12, w:128.2, h:11.5, fs:9.5});
  }

  return { img: PLAYBOOKS[pb].img, marks, fields };
}

// ---------- Лист банды: Bounty Hunters ----------

export function posseLayout(type) {
  const P = posseInfo(type);
  const marks = [], fields = [];
  const m = (o) => marks.push(o);

  // Репутация, тир, рок — счётчики
  for (let i=0;i<12;i++) m({k:'rep', i, mode:'lvl', kind:'box', x:102.2+i*16.6, y:188.2, w:11.6, h:11.6});
  for (let i=0;i<4;i++)  m({k:'tier', i, mode:'lvl', kind:'box', x:69.4+i*16.6, y:328.2, w:11.6, h:11.6});
  for (let i=0;i<10;i++) m({k:'doom', i, mode:'lvl', kind:'box', x:112.8+i*16.6, y:372.4, w:11.6, h:11.6});
  m({k:'hold', i:0, mode:'radio', kind:'fill', x:66, y:345, w:8, h:8, tip:'weak'});
  m({k:'hold', i:1, mode:'radio', kind:'fill', x:101.6, y:345, w:8, h:8, tip:'strong'});

  // Монеты и хранилище: квадраты поделены на верх и низ
  const split = (key, xs, yt, yb, h) => xs.forEach((x,i) => {
    m({k:key+i+'t', mode:'tog', kind:'box', x, y:yt, w:11, h});
    m({k:key+i+'b', mode:'tog', kind:'box', x, y:yb, w:11, h});
  });
  split('coin', [102,118,133.2,148.8], 215.8, 222.6, 4.8);
  split('vault', [100.8,116,131.8,147.4], 242.4, 250.2, 5);
  split('vaultx', Array.from({length:8},(_,i)=>217.2+i*15.45), 225.6, 232.6, 4.8);

  // Всадники
  [287,297,307,317.6].forEach((x,i) => m({k:'rider'+i, mode:'tog', kind:'stamp', x, y:370, w:9, h:22}));

  // Карта владений: 5×3 плитки
  const cols = [73.5,134.5,196,257.5,319], rows = [448.5,489,529.5];
  rows.forEach((y,r) => cols.forEach((x,c) => {
    if (r===1 && c===2) return; // Equilibrium — центр, не захватывается
    m({k:`claim_${r}_${c}`, mode:'tog', kind:'stamp', x, y, w:47, h:34});
  }));

  // Опыт банды: барабан револьвера
  ringOrder([[652,504],[666,504],[676.6,514.6],[676.6,529],[665,539],[650.6,539],[641,528],[641.6,514.6]])
    .forEach((p,i) => m({k:'xp', i, mode:'lvl', kind:'fill', x:p[0], y:p[1], w:11, h:11}));

  // Спецспособности
  P.ab.forEach((y,i) => m({k:'ab'+i, mode:'tog', kind:'fill', x:395.1, y, w:8, h:8}));
  [395.1,404.6,414.2].forEach((x,i) => m({k:'vet'+i, mode:'tog', kind:'fill', x, y:P.vet, w:8, h:8}));

  // Образ действий
  P.modus.forEach(([w,a,b]) => m({k:'modus_'+w, mode:'tog', kind:'ring', x:(a+b)/2, y:400.2, w:b-a+4, h:10}));

  // Контакты: друг / соперник
  for (let i=0;i<6;i++) {
    m({k:'cf'+i, mode:'tog', kind:'tri', dir:'up', x:392.3, y:431.9+i*12, w:8.9, h:7.9, tip:'friend'});
    m({k:'cr'+i, mode:'tog', kind:'tri', dir:'down', x:402.3, y:431.7+i*12, w:8.7, h:7.5, tip:'rival'});
  }

  // Улучшения, логово, качество, тренировки
  // Квадратики сверены с картинкой: обычные (7.2 pt) сидят на 0.7 pt выше центра глифа, мелкие у когорт — на 0.5 pt
  const box = (key, x, y, w=6.6) => {
    const big = w >= 6.6, size = big ? 7.4 : w + 0.3;
    m({k:key, mode:'tog', kind:'box', x, y: y - (big ? 0.7 : 0.5), w: size, h: size});
  };
  [432.7,444.7,456.7,468.7,480.7].forEach((y,i) => box('up'+i, 540.3, y));
  box('up4b', 553.1, 480.7); box('up4c', 565.8, 480.7);
  [[692.1,443.9],[701.0,443.9],[765.8,443.9],[692.1,454.9],[765.8,454.9],[692.1,465.9],[765.8,465.9],
   [692.1,476.9],[701.0,476.9],[765.8,476.9],[692.1,487.9],[701.0,487.9],[765.8,487.9],[692.1,498.9],[765.8,498.9],
   [692.1,509.9],[752.9,509.9],[765.7,509.9],[778.4,509.9],[692.1,520.9],[778.5,520.9],[692.1,531.9],[701.0,531.9]]
    .forEach(([x,y]) => box(`hq_${Math.round(x)}_${Math.round(y)}`, x, y));
  [[692.1,556.9],[742.5,556.9],[796.3,556.9],[692.1,567.9],[742.5,567.9],[755.2,567.9],[768.0,567.9],[780.8,567.9]]
    .forEach(([x,y]) => box(`tr_${Math.round(x)}_${Math.round(y)}`, x, y));

  // Когорты
  for (let c=0;c<4;c++) {
    const o = c*108;
    box(`co${c}_gang`, 757.6, 57.7+o, 5.6); box(`co${c}_expert`, 790.2, 57.7+o, 5.6);
    [['weak',687.7],['impaired',717.7],['broken',760.2],['armor',798.3]].forEach(([n,x]) => box(`co${c}_${n}`, x, 70.3+o, 5));
    for (let r=0;r<4;r++) fields.push({k:`co${c}_l${r}`, x:684.6, t:80.6+o+r*18, w:141, h:13, fs:10});
  }

  fields.push({k:'name', x:14.2, t:79.5, w:175, h:14, fs:12});
  fields.push({k:'reputation', x:196.4, t:79.5, w:178, h:14, fs:12});
  fields.push({k:'hideout', x:14.2, t:119.5, w:360, h:14, fs:12});

  return { img: P.img, marks, fields };
}
