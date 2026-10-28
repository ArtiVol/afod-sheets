# A Fistful of Darkness — shared sheets

[English](#english) · [Русский](#русский)

## English

Online, shared character and posse sheets for **A Fistful of Darkness**. All twelve playbooks
and all four posse types are drawn over the official sheet scans, so every circle, box and
clock on the page is clickable, and every name or note line can be typed into.

A **table** is a shared folder of sheets. The GM creates it once and sends its link to the
players. Anyone with the link sees every sheet on the table and can edit it, with no account
needed. Changes appear on everyone's screen within a second.

- `index.html` — the table: posse, characters, “New character”, link to share.
- `sheet.html` — a single sheet. Export / Import save and load a sheet as a JSON file.
- `layouts.js` — clickable areas for every sheet, in PDF points.
- `i18n.js` — interface text in English and Russian (button in the top bar).
- `config.js` — Firebase project config; `database.rules.json` — database rules.

The site is static and runs on GitHub Pages; sheet data lives in a Firebase Realtime Database
(free Spark plan). Sheet art © its authors; this is a fan-made play aid.

Add `&debug=1` to a sheet URL to outline every clickable area.

## Русский

Общие онлайн-листы персонажей и банд для **A Fistful of Darkness**: все двенадцать плейбуков и
четыре типа банд, размеченные поверх официальных сканов. Кликаются все кружки и квадратики,
в строки имени и заметок можно писать.

**Стол** — общая папка с листами. Ведущий создаёт его один раз и отправляет ссылку игрокам.
Править может любой, у кого есть ссылка, аккаунт не нужен. Правки видны всем через секунду.

### Настройка Firebase (один раз)

1. https://console.firebase.google.com → **Create a project**. Google Analytics не нужен.
2. **Build → Authentication → Get started → Sign-in method → Anonymous → Enable.**
3. **Build → Realtime Database → Create database**, регион `europe-west1`, **locked mode**.
4. Вкладка **Rules**: вставьте содержимое `database.rules.json` → **Publish**.
5. **Project settings → General → Your apps → `</>`**: скопируйте `firebaseConfig` в `config.js`.

### Публикация на GitHub Pages

1. Загрузите все файлы в корень публичного репозитория (**Add file → Upload files**).
   Дождитесь, пока в списке появятся все файлы, и только потом нажимайте **Commit changes**.
2. **Settings → Pages → Deploy from a branch**, ветка `main`, папка `/ (root)`.
3. Сайт: `https://<логин>.github.io/<репозиторий>/` → **Создать стол** → ссылку игрокам.

Если стол не создаётся из-за ошибки авторизации, добавьте `<логин>.github.io` в
**Authentication → Settings → Authorized domains**.

### Безопасность

Ссылку стола угадать нельзя (12 случайных символов), но не публикуйте её в открытых местах.
Перед большими правками сохраняйте лист кнопкой «Экспорт».

Добавьте `&debug=1` к адресу листа, чтобы увидеть все кликабельные зоны.
