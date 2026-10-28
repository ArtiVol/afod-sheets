// Строки интерфейса на русском и английском.
// Язык: выбор пользователя (запоминается в браузере), иначе язык браузера.

const DICT = {
  ru: {
    subtitle: 'Листы персонажей и банды',
    demo: 'Демо-режим: Firebase не подключён, листы хранятся только в этом браузере. Впишите конфиг в config.js.',
    intro: 'Стол — это общая папка с листами. Создайте его один раз и отправьте ссылку игрокам: открыв её, они увидят все листы и смогут их править. Аккаунт не нужен.',
    posseType: 'Тип банды',
    create: 'Создать стол', creating: 'Создаю…', createFail: 'Не получилось создать стол: ',
    tableLink: 'Ссылка на стол', copy: 'Копировать ссылку', copied: 'Скопировано',
    posse: 'Банда', characters: 'Персонажи', playbook: 'Плейбук',
    noPcs: 'Персонажей пока нет. Выберите плейбук и нажмите «Новый персонаж».',
    newPc: 'Новый персонаж', unnamedPosse: 'Банда без имени', unnamed: 'Без имени',
    del: 'Удалить', delSure: 'Точно удалить?', noDb: 'Нет доступа к базе: ',
    footNote: 'Править может любой, у кого есть ссылка. Перед большими правками полезно сохранить лист кнопкой «Экспорт» на его странице.',
    back: '← Все листы', connecting: 'Подключаюсь…', export: 'Экспорт', import: 'Импорт', print: 'Печать / PDF',
    badUrl: 'В ссылке нет стола или листа', saving: 'Сохраняю…', saved: 'Сохранено',
    demoStatus: 'Демо-режим: только этот браузер', saveFail: 'Не сохранилось. Проверьте связь и повторите.',
    offline: 'Нет связи, правки уйдут при восстановлении', online: 'На связи',
    noSheet: 'Такого листа нет: возможно, его удалили', unknownPb: 'Неизвестный плейбук: ',
    noAccess: 'Нет доступа к базе. Проверьте правила Firebase.', fbFail: 'Не удалось подключиться к Firebase: ',
    otherSheet: s => `Файл от другого листа (${s}). Всё равно загрузить?`,
    replaceSheet: 'Заменить содержимое этого листа данными из файла?',
    loaded: 'Лист загружен из файла', badFile: 'Не удалось прочитать файл: это не JSON листа',
    posseSuffix: ' — банда', friend: 'друг', rival: 'соперник', langBtn: 'EN', langTitle: 'Switch to English',
    creditGame: 'A Fistful of Darkness разработана', creditBase: 'Игра основана на', creditBy: 'Джона Харпера.',
    creditFan: 'Это неофициальный фанатский помощник для игры.',
  },
  en: {
    subtitle: 'Character and posse sheets',
    demo: 'Demo mode: Firebase is not connected, sheets are stored in this browser only. Put your config into config.js.',
    intro: 'A table is a shared folder of sheets. Create it once and send the link to your players: they will see every sheet and can edit it. No account needed.',
    posseType: 'Posse type',
    create: 'Create table', creating: 'Creating…', createFail: 'Could not create the table: ',
    tableLink: 'Table link', copy: 'Copy link', copied: 'Copied',
    posse: 'Posse', characters: 'Characters', playbook: 'Playbook',
    noPcs: 'No characters yet. Pick a playbook and press “New character”.',
    newPc: 'New character', unnamedPosse: 'Unnamed posse', unnamed: 'Unnamed',
    del: 'Delete', delSure: 'Really delete?', noDb: 'No access to the database: ',
    footNote: 'Anyone with the link can edit. Before big changes, save the sheet with the “Export” button on its page.',
    back: '← All sheets', connecting: 'Connecting…', export: 'Export', import: 'Import', print: 'Print / PDF',
    badUrl: 'The link has no table or sheet', saving: 'Saving…', saved: 'Saved',
    demoStatus: 'Demo mode: this browser only', saveFail: 'Not saved. Check your connection and try again.',
    offline: 'Offline, changes will sync when the connection is back', online: 'Online',
    noSheet: 'This sheet does not exist: it may have been deleted', unknownPb: 'Unknown playbook: ',
    noAccess: 'No access to the database. Check the Firebase rules.', fbFail: 'Could not connect to Firebase: ',
    otherSheet: s => `This file belongs to another sheet (${s}). Load it anyway?`,
    replaceSheet: 'Replace this sheet with the data from the file?',
    loaded: 'Sheet loaded from file', badFile: 'Could not read the file: it is not a sheet JSON',
    posseSuffix: ' — posse', friend: 'friend', rival: 'rival', langBtn: 'RU', langTitle: 'Переключить на русский',
    creditGame: 'A Fistful of Darkness game and sheets by', creditBase: 'Based on', creditBy: 'by John Harper.',
    creditFan: 'This is an unofficial, fan-made play aid.',
  },
};

function detect() {
  try { const v = localStorage.getItem('afod-lang'); if (v === 'ru' || v === 'en') return v; } catch {}
  return (navigator.language || '').toLowerCase().startsWith('ru') ? 'ru' : 'en';
}

export const lang = detect();
export const t = (k, ...a) => { const v = DICT[lang][k] ?? DICT.ru[k] ?? k; return typeof v === 'function' ? v(...a) : v; };

// Подставляет переводы в элементы с data-i18n и вешает переключатель на кнопку #lang
export function applyI18n() {
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
  document.querySelectorAll('[data-i18n-aria]').forEach(el => el.setAttribute('aria-label', t(el.dataset.i18nAria)));
  const b = document.getElementById('lang');
  if (b) {
    b.textContent = t('langBtn'); b.title = t('langTitle');
    b.onclick = () => { try { localStorage.setItem('afod-lang', lang === 'ru' ? 'en' : 'ru'); } catch {} location.reload(); };
  }
}
