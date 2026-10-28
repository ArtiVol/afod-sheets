// Хранилище листов. Firebase Realtime Database, а без конфига — демо-режим в localStorage.
import { firebaseConfig } from './config.js';

const FB = 'https://www.gstatic.com/firebasejs/12.18.0/';

export const isDemo = !firebaseConfig.apiKey;

export function newId(n = 10) {
  const abc = 'abcdefghijkmnopqrstuvwxyz23456789';
  const a = crypto.getRandomValues(new Uint8Array(n));
  return Array.from(a, v => abc[v % abc.length]).join('');
}

export function roomFromUrl() {
  const r = new URLSearchParams(location.search).get('room') || '';
  return /^[a-z0-9]{8,32}$/.test(r) ? r : null;
}

// ---- Firebase ----
let ctxPromise = null;
function fb() {
  if (!ctxPromise) ctxPromise = (async () => {
    const [appM, authM, dbM] = await Promise.all([
      import(FB + 'firebase-app.js'), import(FB + 'firebase-auth.js'), import(FB + 'firebase-database.js'),
    ]);
    const app = appM.getApps().length ? appM.getApp() : appM.initializeApp(firebaseConfig);
    const auth = authM.getAuth(app);
    await authM.setPersistence(auth, authM.browserLocalPersistence);
    const user = auth.currentUser || await new Promise(res => { const u = authM.onAuthStateChanged(auth, x => { u(); res(x); }); });
    if (!user) await authM.signInAnonymously(auth);
    const db = firebaseConfig.databaseURL ? dbM.getDatabase(app, firebaseConfig.databaseURL) : dbM.getDatabase(app);
    return { db, m: dbM };
  })();
  return ctxPromise;
}

// ---- Демо (localStorage) ----
const LS = 'afod-demo';
const lsRead = () => { try { return JSON.parse(localStorage.getItem(LS)) || {}; } catch { return {}; } };
const lsWrite = (v) => { try { localStorage.setItem(LS, JSON.stringify(v)); } catch {} };
const demoListeners = new Set();
function demoEmit() { demoListeners.forEach(f => f()); }
window.addEventListener('storage', e => { if (e.key === LS) demoEmit(); });
function setPath(obj, path, val) {
  const parts = path.split('/'); let o = obj;
  for (let i = 0; i < parts.length - 1; i++) o = o[parts[i]] ??= {};
  if (val === null) delete o[parts.at(-1)]; else o[parts.at(-1)] = val;
}

// ---- Общий интерфейс ----
export async function openRoom(room) {
  const base = `rooms/${room}`;
  if (isDemo) {
    const get = (p) => p.split('/').reduce((o, k) => o?.[k], lsRead());
    const watch = (p, cb) => { const f = () => cb(get(p) ?? null); demoListeners.add(f); f(); return () => demoListeners.delete(f); };
    return {
      watchSheets: cb => watch(`${base}/sheets`, cb),
      watchSheet: (id, cb) => watch(`${base}/sheets/${id}`, cb),
      patch: async (id, obj) => { const all = lsRead(); for (const [k, v] of Object.entries(obj)) setPath(all, `${base}/sheets/${id}/${k}`, v); lsWrite(all); demoEmit(); },
      put: async (id, val) => { const all = lsRead(); setPath(all, `${base}/sheets/${id}`, val); lsWrite(all); demoEmit(); },
      onConnection: cb => { cb(true); return () => {}; },
    };
  }
  const { db, m } = await fb();
  const r = p => m.ref(db, p);
  const watch = (p, cb, err) => m.onValue(r(p), s => cb(s.val()), e => err ? err(e) : console.error(e));
  return {
    watchSheets: (cb, err) => watch(`${base}/sheets`, cb, err),
    watchSheet: (id, cb, err) => watch(`${base}/sheets/${id}`, cb, err),
    patch: (id, obj) => m.update(r(`${base}/sheets/${id}`), { ...obj, updatedAt: m.serverTimestamp() }),
    put: (id, val) => m.set(r(`${base}/sheets/${id}`), val === null ? null : { ...val, updatedAt: m.serverTimestamp() }),
    onConnection: cb => m.onValue(r('.info/connected'), s => cb(!!s.val())),
  };
}

export async function createRoom(posseType) {
  const room = newId(12);
  const api = await openRoom(room);
  await api.put('posse', { kind: 'posse', posseType, txt: {}, s: {}, createdAt: Date.now() });
  return room;
}
