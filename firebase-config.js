// ============================================================
// firebase-config.js — Configuración compartida de Firebase
// ⚠️  IMPORTANTE: sustituye los valores "PEGA_TU_..." por los
//     de tu proyecto en Firebase Console →
//     Configuración del proyecto → Tu aplicación web
// ============================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getFirestore }  from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey:            "AIzaSyAxuWMkoJ3PvE0Iq_dSI3Hc5MJL_MPsw2U",
    authDomain:        "trenclicker.firebaseapp.com",
    projectId:         "trenclicker",
    storageBucket:     "trenclicker.firebasestorage.app",
    messagingSenderId: "390144624024",
    appId:             "1:390144624024:web:b5d36b5a30411cea1197ed"
};

// ⚠️ Comprueba si la config está sin rellenar
export const firebaseReady =
    !firebaseConfig.apiKey.startsWith("PEGA_TU") &&
    !firebaseConfig.appId.startsWith("PEGA_TU") &&
    !firebaseConfig.messagingSenderId.startsWith("PEGA_TU");

export const app = firebaseReady ? initializeApp(firebaseConfig) : null;
export const db  = firebaseReady ? getFirestore(app) : null;
