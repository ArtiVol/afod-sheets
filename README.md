# Листы A Fistful of Darkness

Общие листы персонажей (The Law, The Scout, The Speaker, The Gamble) и банды (Bounty Hunters).
Сайт лежит на GitHub Pages, данные хранятся в Firebase Realtime Database. Игрокам не нужны аккаунты:
открыл ссылку стола и правишь.

## Как это устроено

- `index.html` — стол: список листов, создание персонажа, ссылка для игроков.
- `sheet.html?room=…&id=…` — один лист. Правки сохраняются сразу и видны всем, у кого лист открыт.
- `js/layouts.js` — разметка полей и кружков поверх сканов из PDF.
- `js/config.js` — конфиг Firebase. Пока он пустой, сайт работает в демо-режиме (только в своём браузере).
- `database.rules.json` — правила базы.

## Настройка Firebase (один раз)

1. Откройте https://console.firebase.google.com → **Create a project**. Google Analytics не нужен.
2. **Build → Authentication → Get started → Sign-in method → Anonymous → Enable.**
3. **Build → Realtime Database → Create database.** Регион: `europe-west1`. Режим: **locked mode**.
4. Вкладка **Rules**: замените текст содержимым `database.rules.json` и нажмите **Publish**.
5. **Project settings (шестерёнка) → General → Your apps → значок `</>`** (Web app). Название любое,
   Firebase Hosting не включайте. Скопируйте значения из `firebaseConfig` в `js/config.js`.
   `databaseURL` — адрес со страницы Realtime Database (вида `https://…europe-west1.firebasedatabase.app`).

## Публикация на GitHub Pages

1. Создайте публичный репозиторий и загрузите в него содержимое этой папки
   (на странице репозитория **Add file → Upload files**, перетащите все файлы и папки).
2. **Settings → Pages → Build and deployment → Source: Deploy from a branch**, ветка `main`, папка `/ (root)` → **Save**.
3. Через минуту-две сайт откроется по адресу `https://<логин>.github.io/<репозиторий>/`.
4. Откройте его, нажмите **Создать стол** и отправьте игрокам ссылку из шапки.

Если стол не создаётся из-за ошибки авторизации, добавьте домен `<логин>.github.io` в
**Authentication → Settings → Authorized domains**.

## Безопасность

Любой, у кого есть ссылка стола, может править все листы на нём. Ссылку угадать нельзя
(12 случайных символов), но не публикуйте её в открытых местах. Перед большими правками
сохраняйте лист кнопкой «Экспорт»: файл JSON потом загружается кнопкой «Импорт».

## Отладка разметки

Добавьте `&debug=1` к адресу листа: все кликабельные зоны обведутся красным.
