// ============================================================
// firebase-config.js
// ============================================================
import { initializeApp }                from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getFirestore }                 from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";
import { getAuth, onAuthStateChanged }  from "https://www.gstatic.com/firebasejs/11.0.0/firebase-auth.js";

const firebaseConfig = {
    apiKey:            "AIzaSyAxuWMkoJ3PvE0Iq_dSI3Hc5MJL_MPsw2U",
    authDomain:        "trenclicker.firebaseapp.com",
    projectId:         "trenclicker",
    storageBucket:     "trenclicker.firebasestorage.app",
    messagingSenderId: "390144624024",
    appId:             "1:390144624024:web:b5d36b5a30411cea1197ed"
};

export const app  = initializeApp(firebaseConfig);
export const db   = getFirestore(app);
export const auth = getAuth(app);

// ── firebaseReady: siempre true si la config es válida ───────
export const firebaseReady = true;

// ════════════════════════════════════════════════════════════
//  waitForUser()
//  Espera a que Firebase Auth resuelva la sesión actual
//  (necesario en recargas de página) y luego combina con
//  el usuario guardado en localStorage (login por nombre).
//
//  Devuelve: { uid, name } o null si no hay sesión.
//  En caso de Google, también actualiza localStorage.
// ════════════════════════════════════════════════════════════
export function waitForUser() {
    return new Promise(resolve => {
        // Timeout de seguridad: si Firebase tarda más de 3s, usar localStorage
        const timer = setTimeout(() => {
            const localLoggedOut = localStorage.getItem('localLoggedOut') === '1';
            if (localLoggedOut) {
                resolve(null);
                return;
            }
            const uid  = localStorage.getItem('playerUID');
            const name = localStorage.getItem('playerName');
            resolve(uid && name ? { uid, name } : null);
        }, 3000);

        const unsub = onAuthStateChanged(auth, user => {
            clearTimeout(timer);
            unsub(); // dejar de escuchar tras el primer resultado

            if (user) {
                // Sesión de Google activa → siempre tiene prioridad
                const uid  = user.uid;
                const storedName = sessionStorage.getItem('playerName') || localStorage.getItem('playerName');
                const name = user.displayName || user.email || storedName;
                // Mantener localStorage actualizado
                localStorage.setItem('playerUID',  uid);
                if (name) localStorage.setItem('playerName', name);
                sessionStorage.setItem('playerUID',  uid);
                if (name) sessionStorage.setItem('playerName', name);
                resolve({ uid, name: name || 'Anónimo' });
            } else {
                // Sin Google → intentar login por nombre desde localStorage
                const localLoggedOut = localStorage.getItem('localLoggedOut') === '1';
                if (localLoggedOut) {
                    resolve(null);
                    return;
                }
                const uid  = localStorage.getItem('playerUID');
                const name = localStorage.getItem('playerName');
                if (uid && name) {
                    sessionStorage.setItem('playerUID',  uid);
                    sessionStorage.setItem('playerName', name);
                    resolve({ uid, name });
                } else {
                    resolve(null);
                }
            }
        });
    });
}

// ── Lectura rápida y síncrona (para ranking.js) ──────────────
export function getCurrentUser() {
    const localLoggedOut = localStorage.getItem('localLoggedOut') === '1';
    const uid  = sessionStorage.getItem('playerUID') || (localLoggedOut ? null : localStorage.getItem('playerUID'));
    const name = sessionStorage.getItem('playerName') || (localLoggedOut ? null : localStorage.getItem('playerName'));
    if (!uid || !name) return null;
    return { uid, name };
}

export function getPlayerName() {
    const u = auth.currentUser;
    // Prioridad: 1) displayName (actualizado cuando el usuario cambia su nombre)
    // 2) sessionStorage/localStorage (para usuarios no logueados)
    // 3) email (como fallback)
    // 4) Anónimo (último recurso)
    return u?.displayName
        || sessionStorage.getItem('playerName')
        || localStorage.getItem('playerName')
        || u?.email
        || 'Anónimo';
}
