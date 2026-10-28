import { roomFromUrl, openRoom, isDemo } from './store.js';
import { PLAYBOOKS, posseInfo, playbookLayout, posseLayout } from './layouts.js';
import { t, applyI18n } from './i18n.js';

applyI18n();

const S = 1.5;               // пункты PDF → пиксели листа
const INK = '#141414';
const $ = id => document.getElementById(id);
const room = roomFromUrl();
const id = new URLSearchParams(location.search).get('id') || '';
const sheetEl = $('sheet');
const DEBUG = new URLSearchParams(location.search).has('debug');

let txt = {}, s = {}, meta = null, layout = null, builtKey = '';
const markEls = [], fieldEls = new Map(), pending = new Map();

function status(text, cls) { $('st').textContent = text; $('dot').className = 'dot ' + (cls || ''); }
function toast(t) { const d = document.createElement('div'); d.className = 'toast'; d.textContent = t; document.body.append(d); setTimeout(() => d.remove(), 2200); }

// Картинку листа начинаем грузить сразу, не дожидаясь Firebase
{
  const pb = new URLSearchParams(location.search).get('pb');
  const src = pb?.startsWith('posse') ? posseInfo(pb.slice(6)).img : PLAYBOOKS[pb]?.img;
  if (src) new Image().src = src;
}

if (!room || !/^[a-z0-9]{1,32}$/.test(id)) { status(t('badUrl'), 'bad'); throw new Error('bad url'); }
$('back').href = 'index.html?room=' + room;

// ---------- Масштаб под ширину экрана ----------
function fit() {
  const avail = $('fit').parentElement.clientWidth - parseFloat(getComputedStyle($('fit').parentElement).paddingLeft) * 2;
  const k = Math.min(1, avail / 1263);
  sheetEl.style.transform = `scale(${k})`;
  $('fit').style.width = 1263 * k + 'px';
  $('fit').style.height = 893 * k + 'px';
}
addEventListener('resize', fit);

// ---------- Отрисовка ----------
function build() {
  sheetEl.textContent = '';
  const img = document.createElement('img');
  img.className = 'bg'; img.src = layout.img; img.alt = '';
  sheetEl.append(img);

  layout.fields.forEach(f => {
    const inp = document.createElement('input');
    inp.id = 'f_' + f.k; inp.spellcheck = false; inp.autocomplete = 'off';
    Object.assign(inp.style, { left: f.x * S + 'px', top: f.t * S + 'px', width: f.w * S + 'px', height: f.h * S + 'px', fontSize: f.fs * S + 'px' });
    inp.addEventListener('input', () => onText(f.k, inp.value));
    sheetEl.append(inp); fieldEls.set(f.k, inp);
  });

  layout.marks.forEach(m => {
    const d = document.createElement('div');
    d.className = 'mk';
    Object.assign(d.style, { left: (m.x - m.w / 2) * S + 'px', top: (m.y - m.h / 2) * S + 'px', width: m.w * S + 'px', height: m.h * S + 'px' });
    if (m.tip) d.title = (m.tip === 'friend' || m.tip === 'rival') ? t(m.tip) : m.tip;
    if (DEBUG) d.style.outline = '1px solid rgba(230,0,0,.8)';
    d.addEventListener('click', () => onMark(m));
    sheetEl.append(d); markEls.push([m, d]);
  });
  fit();
}

function isOn(m) {
  const v = s[m.k];
  if (m.mode === 'lvl') return m.i < (v || 0);
  if (m.mode === 'radio') return v === m.i;
  return !!v;
}

function paintMark(m, d) {
  const on = isOn(m), st = d.style;
  let bg = 'transparent', bd = '0', r = '50%', ch = '';
  switch (m.kind) {
    case 'fill': bg = on ? INK : 'transparent'; break;
    case 'box': bg = on ? INK : 'transparent'; r = '1px'; break;
    case 'bullet': bg = on ? 'rgba(20,20,20,.92)' : 'transparent'; r = '3px 3px 1px 1px'; bd = on ? '1px solid #555' : '0'; break;
    case 'ring': bd = `${1.4 * S}px solid ${on ? (m.light ? '#f3f1ea' : INK) : 'transparent'}`; break;
    case 'chip': bd = `${3 * S}px solid ${on ? INK : 'transparent'}`; bg = on ? 'rgba(0,0,0,.18)' : 'transparent'; break;
    case 'glyph': ch = on ? m.glyph : ''; bg = on ? 'rgba(255,255,255,.85)' : 'transparent'; r = '0'; st.fontSize = 9 * S + 'px'; break;
    case 'stamp': bg = on ? 'rgba(155,42,34,.55)' : 'transparent'; bd = on ? `${1.5 * S}px solid rgba(155,42,34,.95)` : '0'; r = '2px'; break;
  }
  st.background = bg; st.border = bd; st.borderRadius = r; d.textContent = ch;
}
const paintAll = () => markEls.forEach(([m, d]) => paintMark(m, d));

function paintFields() {
  fieldEls.forEach((inp, k) => {
    if (document.activeElement === inp || pending.has(k)) return;
    const v = txt[k] || '';
    if (inp.value !== v) inp.value = v;
  });
}

// ---------- Правки ----------
let api;
function save(obj) {
  status(t('saving'), 'warn');
  api.patch(id, obj).then(() => status(isDemo ? t('demoStatus') : t('saved'), isDemo ? 'warn' : 'ok'))
    .catch(e => { console.error(e); status(t('saveFail'), 'bad'); });
}

function onMark(m) {
  let v;
  if (m.mode === 'lvl') { const c = s[m.k] || 0; v = c === m.i + 1 ? m.i : m.i + 1; }
  else if (m.mode === 'radio') v = s[m.k] === m.i ? null : m.i;
  else v = !s[m.k];
  if (v === 0 || v === false) v = null;
  if (v === null) delete s[m.k]; else s[m.k] = v;
  markEls.forEach(([mm, d]) => { if (mm.k === m.k) paintMark(mm, d); });
  save({ ['s/' + m.k]: v });
}

function onText(k, v) {
  txt[k] = v;
  clearTimeout(pending.get(k));
  pending.set(k, setTimeout(() => { pending.delete(k); save({ ['txt/' + k]: v || null }); }, 450));
}

// ---------- Экспорт / импорт / печать ----------
const sheetName = () => meta?.kind === 'posse' ? 'afod-posse-' + (meta.posseType || 'bounty') : 'afod-' + meta?.playbook + '-v2';
$('exp').onclick = () => {
  const data = JSON.stringify({ sheet: sheetName(), playbook: meta?.playbook, txt, s }, null, 2);
  const a = document.createElement('a');
  a.href = URL.createObjectURL(new Blob([data], { type: 'application/json' }));
  a.download = ((txt.name || 'sheet').trim().replace(/[^\p{L}\p{N}_-]+/gu, '_') || 'sheet') + '.json';
  a.click(); setTimeout(() => URL.revokeObjectURL(a.href), 1000);
};
$('imp').onclick = () => $('file').click();
$('file').onchange = e => {
  const f = e.target.files?.[0]; if (!f) return;
  const rd = new FileReader();
  rd.onload = async () => {
    try {
      const d = JSON.parse(rd.result);
      if (d.sheet && d.sheet !== sheetName() && !confirm(t('otherSheet', d.sheet))) return;
      if (!confirm(t('replaceSheet'))) return;
      txt = d.txt || {}; s = d.s || {};
      paintAll(); fieldEls.forEach((inp, k) => inp.value = txt[k] || '');
      await api.patch(id, { txt, s });
      toast(t('loaded'));
    } catch (err) { toast(t('badFile')); }
  };
  rd.readAsText(f); e.target.value = '';
};
$('prn').onclick = () => print();

// ---------- Подключение ----------
try {
  api = await openRoom(room);
  api.onConnection(c => { if (!c) status(t('offline'), 'bad'); else if (!pending.size) status(isDemo ? t('demoStatus') : t('online'), isDemo ? 'warn' : 'ok'); });
  api.watchSheet(id, v => {
    if (!v) { status(t('noSheet'), 'bad'); sheetEl.textContent = ''; layout = null; return; }
    // Лист банды перестраивается, если на столе сменили тип банды
    const key = v.kind === 'posse' ? 'posse:' + (v.posseType || 'bounty') : 'pc:' + v.playbook;
    if (!layout || key !== builtKey) {
      meta = v; builtKey = key;
      markEls.length = 0; fieldEls.clear();
      if (v.kind === 'posse') layout = posseLayout(v.posseType);
      else if (PLAYBOOKS[v.playbook]) layout = playbookLayout(v.playbook);
      else { status(t('unknownPb') + v.playbook, 'bad'); return; }
      build();
    }
    meta = v;
    txt = { ...(v.txt || {}) }; pending.forEach((_, k) => { const inp = fieldEls.get(k); if (inp) txt[k] = inp.value; });
    s = { ...(v.s || {}) };
    document.title = v.kind === 'pc' ? (txt.name || t('unnamed')) + ' — ' + PLAYBOOKS[v.playbook].title
      : (txt.name || posseInfo(v.posseType).title) + t('posseSuffix');
    paintAll(); paintFields();
  }, e => { console.error(e); status(t('noAccess'), 'bad'); });
} catch (e) {
  console.error(e); status(t('fbFail') + (e.message || e), 'bad');
}
