// ============================================================
// ranking.js  —  Tabla de clasificación
// Lee top 10 de cada colección y los pinta en pantalla
// ============================================================
import { db, firebaseReady } from "./firebase-config.js";
import {
    collection, query, orderBy, limit, getDocs
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

// ── Jugador local (para marcar con "TÚ") ─────────────────────
// Busca en sessionStorage primero, luego localStorage
const localLoggedOut = localStorage.getItem('localLoggedOut') === '1';
const localUID = sessionStorage.getItem('playerUID') || (localLoggedOut ? null : localStorage.getItem('playerUID'));

// ── Formatear puntos grandes ──────────────────────────────────
function fmt(n) {
    if (n >= 1e18) return (n / 1e18).toFixed(2) + ' Tr';
    if (n >= 1e15) return (n / 1e15).toFixed(2) + ' Q';
    if (n >= 1e12) return (n / 1e12).toFixed(2) + ' T';
    if (n >= 1e9)  return (n / 1e9 ).toFixed(2) + ' B';
    if (n >= 1e6)  return (n / 1e6 ).toFixed(2) + ' M';
    if (n >= 1e3)  return (n / 1e3 ).toFixed(2) + ' k';
    return Math.floor(n).toLocaleString('es-ES');
}

const MEDALS = ['🥇', '🥈', '🥉'];

// ── Mostrar error de configuración ───────────────────────────
function showConfigError() {
    ['trainLoading', 'wordleLoading'].forEach(id => {
        const el = document.getElementById(id);
        el.style.display = 'block';
        el.style.color = '#FF6B6B';
        el.textContent = '⚠️ Firebase no configurado — añade tu API Key en firebase-config.js';
    });
}

// ── Renderizar una tabla ──────────────────────────────────────
function renderList(listId, loadingId, entries, fmtScore) {
    const loading = document.getElementById(loadingId);
    const list    = document.getElementById(listId);

    loading.style.display = 'none';
    list.innerHTML = '';

    if (!entries.length) {
        list.innerHTML = `<li><div class="empty-msg">Nadie ha jugado aún 🏜️</div></li>`;
        return;
    }

    entries.forEach((entry, i) => {
        // Comparar por UID (más fiable que por nombre)
        const isYou  = localUID && entry.uid === localUID;
        const isTop3 = i < 3;

        const li = document.createElement('li');

        const posEl = isTop3
            ? `<span class="medal">${MEDALS[i]}</span>`
            : `<span class="rank-pos">${i + 1}</span>`;

        const you = isYou ? `<span class="you-badge">TÚ</span>` : '';

        const rango = entry.rank ? ` <span class="rank-extra">(${entry.rank})</span>` : '';
        const nameEl  = `<span class="rank-name ${isYou ? 'is-you' : ''}">${entry.name}${you}${rango}</span>`;
        const scoreEl = `<span class="rank-score">${fmtScore(entry.score)}</span>`;

        li.innerHTML = posEl + nameEl + scoreEl;
        list.appendChild(li);
    });
}

// ── Cargar top 10 de Firestore ────────────────────────────────
async function loadBoard(colName, listId, loadingId, fmtScore) {
    try {
        const q = query(
            collection(db, colName),
            orderBy('score', 'desc'),
            limit(10)
        );
        const snap    = await getDocs(q);
        const entries = snap.docs.map(d => ({
            uid:   d.id,           // el doc ID es el UID del jugador
            name:  d.data().name,
            rank:  d.data().rank,
            score: d.data().score
        }));
        renderList(listId, loadingId, entries, fmtScore);
    } catch (e) {
        console.error(`Error cargando ${colName}:`, e);
        const el = document.getElementById(loadingId);
        el.style.display = 'block';
        el.style.color   = '#FF6B6B';
        el.textContent   = '⚠️ Error al cargar — comprueba la config de Firebase';
    }
}

// ── Cargar ambas tablas ───────────────────────────────────────
function loadAll() {
    if (!firebaseReady) {
        showConfigError();
        return;
    }

    // Resetear visual
    ['trainLoading', 'wordleLoading'].forEach(id => {
        const el = document.getElementById(id);
        el.style.display = 'block';
        el.style.color   = '';
        el.textContent   = 'Cargando...';
    });
    ['trainList', 'wordleList'].forEach(id => {
        document.getElementById(id).innerHTML = '';
    });

    document.addEventListener('DOMContentLoaded', () => {
        loadBoard('leaderboard_train', 'trainList', 'trainLoading', s => fmt(s) + ' pts');
        loadBoard('leaderboard_wordle', 'wordleList', 'wordleLoading', s => `Nivel ${s}`);
    });
}

// ── Botón refrescar ───────────────────────────────────────────
document.getElementById('refreshBtn').addEventListener('click', loadAll);

// ── Arrancar ──────────────────────────────────────────────────
loadAll();
