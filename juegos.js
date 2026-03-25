// ============================================================
// juegos.js — Tren Clicker con guardado en Firestore por usuario
// ============================================================
import { db, waitForUser, getPlayerName }
    from "./firebase-config.js";
import {
    doc, getDoc, setDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

// ── currentUser se resuelve de forma asíncrona en init() ─────
let currentUser = null;

// ── Estado del juego ─────────────────────────────────────────
let points          = 0;
let pointsPerClick  = 1;
let pointsPerSecond = 0;
let totalClicks     = 0;
let playerRankIndex = 0;
let upgradeCounts   = new Array(40).fill(0);
let activeBooster   = null;
let boosterEndTime  = null;
let boosterTimeout  = null;
let saveTimer       = null;

function _localSaveKey() {
    return currentUser ? `save_train_${currentUser.uid}` : null;
}

function _saveToLocal() {
    const key = _localSaveKey();
    if (!key) return;
    const payload = {
        name: getPlayerName(),
        points, pointsPerClick, pointsPerSecond,
        totalClicks, playerRankIndex, upgradeCounts,
        updatedAt: Date.now()
    };
    try {
        localStorage.setItem(key, JSON.stringify(payload));
    } catch (e) {
        console.warn('[train local save]', e);
    }
}

function _loadFromLocal() {
    const key = _localSaveKey();
    if (!key) return false;
    try {
        const raw = localStorage.getItem(key);
        if (!raw) return false;
        const d = JSON.parse(raw);
        points          = d.points          ?? 0;
        pointsPerClick  = d.pointsPerClick  ?? 1;
        pointsPerSecond = d.pointsPerSecond ?? 0;
        totalClicks     = d.totalClicks     ?? 0;
        playerRankIndex = d.playerRankIndex ?? 0;
        upgradeCounts   = d.upgradeCounts   ?? new Array(40).fill(0);
        upgrades.forEach((up, i) => { up.count = upgradeCounts[i] ?? 0; });
        return true;
    } catch (e) {
        console.warn('[train local load]', e);
        return false;
    }
}

// ── DOM ──────────────────────────────────────────────────────
const pointsDisplay     = document.getElementById('pointsDisplay');
const ppsDisplay        = document.getElementById('ppsDisplay');
const clickCounterDiv   = document.getElementById('clickCounterDiv');
const trainContainer    = document.querySelector('.train-container');
const train             = document.getElementById('train');
const rankNameEl        = document.getElementById('rankName');
const rankImageEl       = document.getElementById('rankImage');
const resetBtn          = document.getElementById('resetBtn');
const messagesEl        = document.getElementById('messages');
const upgradesContainer = document.getElementById('upgradesContainer');
const ranksContainer    = document.getElementById('ranksContainer');
const boostersContainer = document.getElementById('boostersContainer');
const boostersToggleBtn = document.getElementById('boostersToggleBtn');

train.style.userSelect = 'none';

// ── Música ───────────────────────────────────────────────────
const bgMusic = document.createElement('audio');
const currentMusicSrc = localStorage.getItem('currentMusicSrc');
const musicChoice = localStorage.getItem('musicChoice') || 'chuchu';
const isMixMode = musicChoice === 'mix';

// Usar la fuente de música actual si existe, sino usar chuchu por defecto
if (currentMusicSrc) {
    bgMusic.src = currentMusicSrc;
} else {
    bgMusic.src = 'audio/chuchu.mp3';
    localStorage.setItem('currentMusicSrc', 'audio/chuchu.mp3');
}

// Configurar bucle según el modo
if (isMixMode) {
    bgMusic.loop = false;
    // Añadir event listener para cambiar de canción cuando termine
    bgMusic.addEventListener('ended', playNextRandomTrack);
} else {
    bgMusic.loop = true;
}

document.body.appendChild(bgMusic);

// Hacerlo disponible globalmente para music-control.js
window.bgMusic = bgMusic;

// Función para reproducir la siguiente canción aleatoria (modo mix)
function playNextRandomTrack() {
    if (!isMixMode || !bgMusic) return;
    
    // Elegir una canción diferente a la actual
    const availableTracks = ['audio/chuchu.mp3', 'audio/antonimo.mp3', 'audio/bebita.mp3', 'audio/chiqui.mp3']
        .filter(track => track !== bgMusic.src);
    const randomTrack = availableTracks[Math.floor(Math.random() * availableTracks.length)];
    
    bgMusic.src = randomTrack;
    localStorage.setItem('currentMusicSrc', randomTrack);
    
    // Reproducir si no está silenciado
    if (!bgMusic.muted) {
        bgMusic.play().catch(() => {});
    }
}

// Aplicar volumen guardado
const savedVolume = localStorage.getItem('musicVolume') || '5';
bgMusic.volume = savedVolume / 100;

// Respetar preferencia guardada
const musicMuted = localStorage.getItem('musicMuted') === 'true';
const musicWasPlaying = localStorage.getItem('musicPlaying') === 'true';
bgMusic.muted = musicMuted;
// Si la música estaba reproduciéndose antes, continuar reproduciendo
if (!musicMuted && musicWasPlaying) {
    bgMusic.play().catch(() => {});
}

// ── Utilidades ───────────────────────────────────────────────
function fmt(n) {
    if (n >= 1e18) return (n / 1e18).toFixed(2) + 'Tr';
    if (n >= 1e15) return (n / 1e15).toFixed(2) + 'Q';
    if (n >= 1e12) return (n / 1e12).toFixed(2) + 'T';
    if (n >= 1e9)  return (n / 1e9).toFixed(2)  + 'B';
    if (n >= 1e6)  return (n / 1e6).toFixed(2)  + 'M';
    if (n >= 1e3)  return (n / 1e3).toFixed(2)  + 'k';
    return Math.floor(n);
}

function msg(text, ms = 3000) {
    messagesEl.textContent = text;
    if (ms > 0) setTimeout(() => { if (messagesEl.textContent === text) messagesEl.textContent = ''; }, ms);
}

// ── Guardar en Firestore (debounced 2s) ──────────────────────
function saveData() {
    if (!currentUser) return;
    // Guardado local inmediato: asegura persistencia aunque recargues rápido
    _saveToLocal();

    // Firestore en modo "throttle": programar un guardado si no hay uno pendiente.
    if (saveTimer) return;
    saveTimer = setTimeout(async () => {
        saveTimer = null;
        await _doSaveOnline();
    }, 2000);
}

async function _doSaveOnline() {
    if (!currentUser) return;
    try {
        await setDoc(doc(db, 'saves_train', currentUser.uid), {
            name: getPlayerName(),
            points, pointsPerClick, pointsPerSecond,
            totalClicks, playerRankIndex, upgradeCounts,
            updatedAt: serverTimestamp()
        });
        await setDoc(doc(db, 'leaderboard_train', currentUser.uid), {
            name:  getPlayerName(),
            rank:  ranks[playerRankIndex]?.name,
            score: Math.floor(points),
            updatedAt: serverTimestamp()
        });
    } catch (e) {
        console.warn('[train save]', e);
        if (e?.code === 'permission-denied') {
            msg('⚠️ No se pudo guardar online (permisos). Guardado local activado.', 5000);
        } else {
            msg('⚠️ No se pudo guardar online. Guardado local activado.', 3500);
        }
    }
}

async function _doSave() {
    if (!currentUser) return;
    _saveToLocal();
    await _doSaveOnline();
}

// ── Cargar desde Firestore ────────────────────────────────────
async function loadData() {
    if (!currentUser) return false;
    try {
        const snap = await getDoc(doc(db, 'saves_train', currentUser.uid));
        if (!snap.exists()) return _loadFromLocal();
        const d = snap.data();
        points          = d.points          ?? 0;
        pointsPerClick  = d.pointsPerClick  ?? 1;
        pointsPerSecond = d.pointsPerSecond ?? 0;
        totalClicks     = d.totalClicks     ?? 0;
        playerRankIndex = d.playerRankIndex ?? 0;
        upgradeCounts   = d.upgradeCounts   ?? new Array(40).fill(0);
        upgrades.forEach((up, i) => { up.count = upgradeCounts[i] ?? 0; });
        return true;
    } catch (e) {
        console.warn('[train load]', e);
        return _loadFromLocal();
    }
}

// ── Rangos ───────────────────────────────────────────────────
const ranks = [
    { name: 'Principiante', image: 'images/rank_principiante.png', price: 0 },
    { name: 'Aprendiz',     image: 'images/rank_aprendiz.png',     price: 1e4 },
    { name: 'Maquinista',   image: 'images/rank_maquinista.png',   price: 1e5 },
    { name: 'Experto',      image: 'images/rank_experto.png',      price: 1e6 },
    { name: 'Leyenda',      image: 'images/rank_leyenda.png',      price: 1e7 },
    { name: 'Maestro',      image: 'images/rank_maestro.png',      price: 1e8 },
    { name: 'Supremo',      image: 'images/rank_supremo.png',      price: 1e12 },
    { name: 'Épico',        image: 'images/rank_epico.png',        price: 1e13 },
    { name: 'Mítico',       image: 'images/rank_mitico.png',       price: 1e14 },
    { name: 'Legendario',   image: 'images/rank_legendario.png',   price: 1e15 }
];

// ── 40 Mejoras ───────────────────────────────────────────────
const customNames = [
    "Turbo Inicial","Motor de Arranque","Riel de Velocidad","Vagón Extra",
    "Escape de Vapor","Cadenas de Potencia","Cabina Mejorada","Chasis Ligero",
    "Turbina de Oro","Ruedas de Ébano","Sistema de Frenos","Asiento Ergonómico",
    "Boquilla de Vapor","Refuerzo de Ejes","Control Digital","Silbato Sonoro",
    "Cabina de Lujo","Pantalla de Datos","Faros LED","Sistema de Audio",
    "Turbo Avanzado","Motor V8","Suspensión Hidráulica","Sistema de Navegación",
    "Túnel de Aire","Asientos de Cuero","Retrovisores Inteligentes","Rieles de Plata",
    "Freno Magnético","Vagón Restaurante","Vagón Dormitorio","Motor Nuclear",
    "Cabina de Comando","Turbina Experimental","Sistema de Monitoreo","Faros Xenon",
    "Rieles de Titanio","Cabina Espacial","Motor Cuántico","Vagón Legendario"
];

const upgrades = [];
for (let i = 0; i < 40; i++) {
    const type  = i % 2 === 0 ? 'ppc' : 'pps';
    const value = Math.floor((type === 'pps' ? 200 : 80) * Math.pow(1.45, i + 1));
    const basePrice = i === 0 ? 50 : Math.floor(5000 * Math.pow(1.75, i + 1));
    upgrades.push({ name: customNames[i], type, value, basePrice,
                    count: 0, requiredRank: Math.min(Math.floor(i / 4), ranks.length - 2) });
}

// ── Boosters ─────────────────────────────────────────────────
const boosters = [
    { name:"Doble Clic Leyenda",  multiplier:2,  duration:30, price:1e12,   requiredRank:4 },
    { name:"Triple PPS Leyenda",  multiplier:3,  duration:30, price:1.5e12, requiredRank:4 },
    { name:"Doble Clic Maestro",  multiplier:3,  duration:35, price:2e12,   requiredRank:5 },
    { name:"Triple PPS Maestro",  multiplier:4,  duration:35, price:2.5e12, requiredRank:5 },
    { name:"Doble Clic Supremo",  multiplier:5,  duration:40, price:3e12,   requiredRank:6 },
    { name:"Triple PPS Supremo",  multiplier:6,  duration:40, price:3.5e12, requiredRank:6 },
    { name:"Doble Clic Épico",    multiplier:7,  duration:50, price:4e12,   requiredRank:7 },
    { name:"Triple PPS Épico",    multiplier:8,  duration:50, price:4.5e12, requiredRank:7 },
    { name:"Doble Clic Mítico",   multiplier:10, duration:60, price:5e12,   requiredRank:8 },
    { name:"Triple PPS Mítico",   multiplier:12, duration:60, price:5.5e12, requiredRank:8 },
    { name:"Legendario Supremo",  multiplier:20, duration:90, price:6e12,   requiredRank:9 }
];

// ── Click del tren ────────────────────────────────────────────
let clickInterval = null;

function doClick(event) {
    const mult   = activeBooster ? activeBooster.multiplier : 1;
    const gained = pointsPerClick * mult;
    points += gained;
    totalClicks++;
    saveData();
    updateDisplay();

    const span = document.createElement('span');
    span.textContent = `+${fmt(gained)}`;
    span.style.cssText = `position:fixed;left:${event.clientX+5}px;top:${event.clientY-20}px;
        color:#FFD93D;font-weight:bold;font-size:1.2rem;pointer-events:none;
        transition:all 0.8s ease-out;z-index:9999;`;
    document.body.appendChild(span);
    setTimeout(() => { span.style.top=(event.clientY-60)+'px'; span.style.opacity='0'; }, 50);
    setTimeout(() => document.body.removeChild(span), 850);
}

trainContainer.addEventListener('mousedown', e => {
    doClick(e); clickInterval = setInterval(() => doClick(e), 200);
});
document.addEventListener('mouseup', () => {
    if (clickInterval) { clearInterval(clickInterval); clickInterval = null; }
});
trainContainer.addEventListener('mouseleave', () => {
    if (clickInterval) { clearInterval(clickInterval); clickInterval = null; }
});
trainContainer.addEventListener('touchstart', e => {
    e.preventDefault();
    const t = e.touches[0];
    doClick(t); clickInterval = setInterval(() => doClick(t), 200);
}, { passive: false });
document.addEventListener('touchend', () => {
    if (clickInterval) { clearInterval(clickInterval); clickInterval = null; }
});

// ── Render ────────────────────────────────────────────────────
function renderUpgrades() {
    upgradesContainer.innerHTML = '';
    upgrades.forEach(up => {
        const price  = Math.floor(up.basePrice * Math.pow(1.4, up.count));
        const locked = playerRankIndex < up.requiredRank;
        const canBuy = points >= price && !locked;
        const div = document.createElement('div');
        div.className = 'upgrade';
        div.innerHTML = `
            <div>
                <strong>${up.name}</strong>
                <div>+${fmt(up.value)} ${up.type==='pps'?'PPS':'PPC'}</div>
                <div>Comprado: ${up.count}</div>
                <div class="${canBuy?'price-can-buy':'price-cant-buy'}">Precio: ${fmt(price)}</div>
                ${locked?`<div>🔒 Requiere: ${ranks[up.requiredRank].name}</div>`:''}
            </div>
<<<<<<< HEAD
            <button ${canBuy?'':'disabled'}>Comprar</button>`;
        div.querySelector('button').onclick = () => {
            if (!canBuy) return;
            points -= price; up.count++;
            upgradeCounts[upgrades.indexOf(up)] = up.count;
            if (up.type==='pps') pointsPerSecond += up.value;
            else                 pointsPerClick  += up.value;
            msg(`Comprado: ${up.name}`);
            saveData(); updateDisplay();
        };
=======
            <div class="quantity-buttons">
                <button class="qty-btn" data-qty="1" ${!canBuy ? 'disabled' : ''}>x1</button>
                <button class="qty-btn" data-qty="10" ${points >= calculateBulkPrice(up, 10) && !lockedByRank ? '' : 'disabled'}>x10</button>
                <button class="qty-btn" data-qty="100" ${points >= calculateBulkPrice(up, 100) && !lockedByRank ? '' : 'disabled'}>x100</button>
            </div>
        `;
        
        div.querySelectorAll('.qty-btn').forEach(btn => {
            btn.onclick = () => {
                const qty = parseInt(btn.dataset.qty);
                const bulkPrice = calculateBulkPrice(up, qty);
                if (points >= bulkPrice && !lockedByRank) {
                    buyUpgrade(up, qty, bulkPrice);
                }
            };
        });
        
>>>>>>> 9a7b4203346fc189214c67fd822535ba4d9a145e
        upgradesContainer.appendChild(div);
    });
}

<<<<<<< HEAD
=======
function calculateBulkPrice(upgrade, quantity) {
    let totalPrice = 0;
    let currentCount = upgrade.count;
    for (let i = 0; i < quantity; i++) {
        totalPrice += Math.floor(upgrade.basePrice * Math.pow(1.4, currentCount));
        currentCount++;
    }
    return totalPrice;
}

function buyUpgrade(upgrade, quantity, totalPrice) {
    points -= totalPrice;
    upgrade.count += quantity;
    
    if (upgrade.type === 'pps') {
        pointsPerSecond += upgrade.value * quantity;
    } else {
        pointsPerClick += upgrade.value * quantity;
    }
    
    multiplicador = pointsPerClick * (activeBooster ? activeBooster.multiplier : 1);
    showMessage(`Comprado: ${quantity}x ${upgrade.name}`);
    saveData();
    updateDisplay();
}

// ================================
// RENDER RANGOS
// ================================
>>>>>>> 9a7b4203346fc189214c67fd822535ba4d9a145e
function renderRanks() {
    ranksContainer.innerHTML = '';
    ranks.forEach((r, i) => {
        const div = document.createElement('div');
        div.className = 'rank';
        if (i < playerRankIndex) {
            div.innerHTML = `<div>${r.name}</div><button disabled style="background:gray">Obtenido</button>`;
        } else if (i === playerRankIndex) {
            div.innerHTML = `<div>${r.name}</div><button disabled style="background:gold">Actual</button>`;
        } else {
            const canBuy = points >= r.price && playerRankIndex === i - 1;
            div.innerHTML = `<div>${r.name}</div>
                <button class="${canBuy?'price-can-buy':'price-cant-buy'}" ${canBuy?'':'disabled'}>${fmt(r.price)}</button>`;
            div.querySelector('button').onclick = () => {
                if (!canBuy) return;
                points -= r.price; playerRankIndex = i;
                msg(`Nuevo rango: ${r.name}`);
                saveData(); updateDisplay();
            };
        }
        ranksContainer.appendChild(div);
    });
}

function renderBoosters() {
    boostersContainer.innerHTML = '';
    boosters.forEach(b => {
        const locked = playerRankIndex < b.requiredRank;
        const canBuy = points >= b.price && !locked;
        const rem = (activeBooster===b && boosterEndTime>Date.now())
            ? Math.ceil((boosterEndTime-Date.now())/1000) : 0;
        const div = document.createElement('div');
        div.className = 'upgrade';
        div.innerHTML = `
            <div>
                <strong>${b.name}</strong>
                <div>x${b.multiplier} durante ${b.duration}s</div>
                ${rem>0?`<div>⏱ ${rem}s restantes</div>`:''}
                <div class="${canBuy?'price-can-buy':'price-cant-buy'}">Precio: ${fmt(b.price)}</div>
                ${locked?`<div>🔒 Requiere: ${ranks[b.requiredRank].name}</div>`:''}
            </div>
            <button ${canBuy?'':'disabled'}>Comprar</button>`;
        div.querySelector('button').onclick = () => {
            if (!canBuy) return;
            points -= b.price;
            activeBooster = b; boosterEndTime = Date.now() + b.duration*1000;
            if (boosterTimeout) clearInterval(boosterTimeout);
            boosterTimeout = setInterval(() => {
                if (Date.now() >= boosterEndTime) {
                    activeBooster = null; clearInterval(boosterTimeout); boosterTimeout = null;
                    msg(`${b.name} ha terminado`);
                }
                updateDisplay();
            }, 1000);
            msg(`Potenciador activado: ${b.name}`);
            saveData(); updateDisplay();
        };
        boostersContainer.appendChild(div);
    });
}

boostersToggleBtn.onclick = () => {
    const open = boostersContainer.style.display === 'flex';
    boostersContainer.style.display = open ? 'none' : 'flex';
    boostersToggleBtn.textContent = open ? 'Mostrar Potenciadores' : 'Ocultar Potenciadores';
};

// ── PPS automático ────────────────────────────────────────────
setInterval(() => {
    if (!currentUser) return; // no acumular antes de cargar
    const mult = activeBooster ? activeBooster.multiplier : 1;
    points += pointsPerSecond * mult;
    saveData(); updateDisplay();
}, 1000);

// ── Reiniciar ─────────────────────────────────────────────────
resetBtn.onclick = async () => {
    if (!confirm('¿Reiniciar todo el progreso?')) return;
    points = 0; pointsPerClick = 1; pointsPerSecond = 0;
    totalClicks = 0; playerRankIndex = 0;
    upgradeCounts = {};
    saveTimer = null;
    await _doSave();
    msg('Progreso reiniciado');
    updateDisplay();
};

// ── Actualizar pantalla ───────────────────────────────────────
function updateDisplay() {
    pointsDisplay.textContent   = fmt(points);
    ppsDisplay.textContent      = fmt(pointsPerSecond);
    clickCounterDiv.textContent = totalClicks;
    rankNameEl.textContent      = ranks[playerRankIndex].name;
    rankImageEl.src             = ranks[playerRankIndex].image;
    renderUpgrades();
    renderRanks();
    renderBoosters();
}

// ── INICIO ────────────────────────────────────────────────────
async function init() {
    msg('Cargando...', 0);

    // Esperar a que Firebase Auth confirme quién es el usuario
    currentUser = await waitForUser();

    if (!currentUser) {
        // Sin sesión: modo local (persistencia garantizada en este navegador)
        let localUid = localStorage.getItem('trainLocalUID');
        if (!localUid) {
            localUid = 'local_train_' + (crypto.randomUUID ? crypto.randomUUID() : (Date.now().toString(36) + Math.random().toString(36).slice(2)));
            localStorage.setItem('trainLocalUID', localUid);
        }
        const localName = localStorage.getItem('playerName') || 'Invitado';
        currentUser = { uid: localUid, name: localName };
        msg('⚠️ Sin sesión: guardado local activo (no sincroniza online)', 4500);
    }

    const found = await loadData();

    // Recalcular stats desde los contadores cargados
    pointsPerSecond = 0;
    pointsPerClick  = 1;
    upgrades.forEach(up => {
        if (up.type === 'pps') pointsPerSecond += up.count * up.value;
        else                   pointsPerClick  += up.count * up.value;
    });

    messagesEl.textContent = '';
    if (found) msg(`✅ Bienvenido de nuevo, ${currentUser.name}`, 2500);
    else       msg(`👋 Hola, ${currentUser.name}`, 2000);

    updateDisplay();
}

init();

document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'hidden') _doSave();
});

window.addEventListener('beforeunload', () => {
    _doSave();
});
