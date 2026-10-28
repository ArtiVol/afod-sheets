import { isDemo, roomFromUrl, openRoom, createRoom, newId } from './store.js';
import { PLAYBOOKS, POSSE } from './layouts.js';

const $ = id => document.getElementById(id);
const room = roomFromUrl();
$('demo').hidden = !isDemo;

function el(tag, attrs = {}, ...kids) {
  const e = document.createElement(tag);
  for (const [k, v] of Object.entries(attrs)) k === 'text' ? (e.textContent = v) : e.setAttribute(k, v);
  kids.forEach(c => e.append(c));
  return e;
}

if (!room) {
  $('noroom').hidden = false;
  $('create').onclick = async () => {
    $('create').disabled = true; $('create').textContent = 'Создаю…';
    try { const r = await createRoom(); location.search = '?room=' + r; }
    catch (e) { console.error(e); $('create').disabled = false; $('create').textContent = 'Создать стол'; alert('Не получилось создать стол: ' + (e.message || e)); }
  };
} else {
  $('room').hidden = false; $('share').hidden = false;
  $('link').value = location.origin + location.pathname + '?room=' + room;
  $('copy').onclick = async () => {
    try { await navigator.clipboard.writeText($('link').value); $('copy').textContent = 'Скопировано'; }
    catch { $('link').select(); }
    setTimeout(() => $('copy').textContent = 'Копировать ссылку', 1500);
  };
  for (const [k, v] of Object.entries(PLAYBOOKS)) $('pb').append(el('option', { value: k, text: v.title }));

  const api = await openRoom(room);
  const href = (id, pb) => `sheet.html?room=${room}&id=${id}` + (pb ? `&pb=${pb}` : '');

  api.watchSheets(sheets => {
    sheets = sheets || {};
    const posse = $('posse'); posse.textContent = '';
    const p = sheets.posse;
    posse.append(el('div', { class: 'row posse' },
      el('div', {}, el('a', { class: 'name', href: href('posse', 'posse'), text: p?.txt?.name || 'Банда без имени' }), el('div', { class: 'pb', text: POSSE.title })),
      el('div')));

    const pcs = $('pcs'); pcs.textContent = '';
    const list = Object.entries(sheets).filter(([id, s]) => id !== 'posse' && s?.kind === 'pc')
      .sort((a, b) => (a[1].createdAt || 0) - (b[1].createdAt || 0));
    if (!list.length) pcs.append(el('div', { class: 'empty', text: 'Персонажей пока нет. Выберите плейбук и нажмите «Новый персонаж».' }));
    list.forEach(([id, s]) => {
      const del = el('button', { class: 'danger', type: 'button', text: 'Удалить' });
      let armed = false, t;
      del.onclick = async () => {
        if (!armed) { armed = true; del.textContent = 'Точно удалить?'; t = setTimeout(() => { armed = false; del.textContent = 'Удалить'; }, 3000); return; }
        clearTimeout(t); await api.put(id, null);
      };
      pcs.append(el('div', { class: 'row' },
        el('div', { style: 'min-width:0' },
          el('a', { class: 'name', href: href(id, s.playbook), text: s.txt?.name || 'Без имени' }),
          el('div', { class: 'pb', text: PLAYBOOKS[s.playbook]?.title || s.playbook })),
        el('div', { class: 'actions' }, del)));
    });
  }, e => { $('pcs').textContent = 'Нет доступа к базе: ' + (e.message || e); });

  $('add').onclick = async () => {
    const id = newId(8), playbook = $('pb').value;
    await api.put(id, { kind: 'pc', playbook, txt: {}, s: {}, createdAt: Date.now() });
    location.href = href(id, playbook);
  };
}
