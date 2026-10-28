import { isDemo, roomFromUrl, openRoom, createRoom, newId } from './store.js';
import { PLAYBOOKS, POSSES, DEFAULT_POSSE, posseInfo } from './layouts.js';
import { t, applyI18n } from './i18n.js';

const $ = id => document.getElementById(id);
const room = roomFromUrl();
applyI18n();
$('demo').hidden = !isDemo;

function el(tag, attrs = {}, ...kids) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) k === 'text' ? (e.textContent = v) : e.setAttribute(k, v);
  kids.forEach(c => e.append(c));
  return e;
}
function posseOptions(select, current) {
  select.textContent = '';
  for (const [k, v] of Object.entries(POSSES)) select.append(el('option', { value: k, text: v.title }));
  select.value = current;
}

if (!room) {
  $('noroom').hidden = false;
  posseOptions($('ptype'), DEFAULT_POSSE);
  $('create').onclick = async () => {
    $('create').disabled = true; $('create').textContent = t('creating');
    try { const r = await createRoom($('ptype').value); location.search = '?room=' + r; }
    catch (e) { console.error(e); $('create').disabled = false; $('create').textContent = t('create'); alert(t('createFail') + (e.message || e)); }
  };
} else {
  $('room').hidden = false; $('shareBox').hidden = false;
  $('link').value = location.origin + location.pathname + '?room=' + room;
  $('copy').onclick = async () => {
    try { await navigator.clipboard.writeText($('link').value); $('copy').textContent = t('copied'); }
    catch { $('link').select(); }
    setTimeout(() => $('copy').textContent = t('copy'), 1500);
  };
  for (const [k, v] of Object.entries(PLAYBOOKS)) $('pb').append(el('option', { value: k, text: v.title }));

  const api = await openRoom(room);
  const href = (id, pb) => `sheet.html?room=${room}&id=${id}` + (pb ? `&pb=${pb}` : '');

  api.watchSheets(sheets => {
    sheets = sheets || {};
    const posse = $('posse'); posse.textContent = '';
    const p = sheets.posse;
    const type = p?.posseType || DEFAULT_POSSE;
    const sel = el('select', { 'aria-label': t('posseType') });
    posseOptions(sel, type);
    sel.onchange = () => api.patch('posse', { posseType: sel.value });
    posse.append(el('div', { class: 'row posse' },
      el('div', { style: 'min-width:0' },
        el('a', { class: 'name', href: href('posse', 'posse-' + type), text: p?.txt?.name || t('unnamedPosse') }),
        el('div', { class: 'pb', text: posseInfo(type).title })),
      el('div', { class: 'actions' }, sel)));

    const pcs = $('pcs'); pcs.textContent = '';
    const list = Object.entries(sheets).filter(([id, s]) => id !== 'posse' && s?.kind === 'pc')
      .sort((a, b) => (a[1].createdAt || 0) - (b[1].createdAt || 0));
    if (!list.length) pcs.append(el('div', { class: 'empty', text: t('noPcs') }));
    list.forEach(([id, s]) => {
      const del = el('button', { class: 'danger', type: 'button', text: t('del') });
      let armed = false, tm;
      del.onclick = async () => {
        if (!armed) { armed = true; del.textContent = t('delSure'); tm = setTimeout(() => { armed = false; del.textContent = t('del'); }, 3000); return; }
        clearTimeout(tm); await api.put(id, null);
      };
      pcs.append(el('div', { class: 'row' },
        el('div', { style: 'min-width:0' },
          el('a', { class: 'name', href: href(id, s.playbook), text: s.txt?.name || t('unnamed') }),
          el('div', { class: 'pb', text: PLAYBOOKS[s.playbook]?.title || s.playbook })),
        el('div', { class: 'actions' }, del)));
    });
  }, e => { $('pcs').textContent = t('noDb') + (e.message || e); });

  $('add').onclick = async () => {
    const id = newId(8), playbook = $('pb').value;
    await api.put(id, { kind: 'pc', playbook, txt: {}, s: {}, createdAt: Date.now() });
    location.href = href(id, playbook);
  };
}
