// ============================================================
// firebase-config.js — Configuración compartida de Firebase
// ⚠️  IMPORTANTE: sustituye los valores "PEGA_TU_..." por los
//     de tu proyecto en Firebase Console →
//     Configuración del proyecto → Tu aplicación web
// ============================================================
import { initializeApp } from "https://www.gstatic.com/firebasejs/11.0.0/firebase-app.js";
import { getFirestore }  from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

const firebaseConfig = {
    apiKey:            "PEGA_TU_API_KEY",
    authDomain:        "trenclicker.firebaseapp.com",
    projectId:         "trenclicker",
    storageBucket:     "trenclicker.firebasestorage.app",
    messagingSenderId: "PEGA_TU_SENDER_ID",
    appId:             "PEGA_TU_APP_ID"
};

export const app = initializeApp(firebaseConfig);
export const db  = getFirestore(app);
