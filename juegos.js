// ================================
// DATOS DEL JUEGO
// ================================
let points = parseFloat(localStorage.getItem('points')) || 0;
let pointsPerClick = parseFloat(localStorage.getItem('pointsPerClick')) || 1;
let pointsPerSecond = parseFloat(localStorage.getItem('pointsPerSecond')) || 0;
let multiplicador = parseFloat(localStorage.getItem('multiplicador')) || pointsPerClick;
let totalClicks = parseInt(localStorage.getItem('totalClicks')) || 0;
let playerRankIndex = parseInt(localStorage.getItem('playerRankIndex')) || 0;

// ================================
// ELEMENTOS DEL DOM
// ================================
const pointsDisplay = document.getElementById('pointsDisplay');
const ppsDisplay = document.getElementById('ppsDisplay');
const clickCounterDiv = document.getElementById('clickCounterDiv');
const trainContainer = document.querySelector('.train-container');
const train = document.getElementById('train');
const rankName = document.getElementById('rankName');
const rankImage = document.getElementById('rankImage');
const resetBtn = document.getElementById('resetBtn');
const messages = document.getElementById('messages');
const upgradesContainer = document.getElementById('upgradesContainer');
const ranksContainer = document.getElementById('ranksContainer');
const boostersContainer = document.getElementById('boostersContainer');
const boostersToggleBtn = document.getElementById('boostersToggleBtn');

// ================================
// EVITAR SELECCIONAR IMAGEN DEL TREN
// ================================
train.style.userSelect = 'none';

// ================================
// MÚSICA DE FONDO
// ================================
const bgMusic = document.createElement('audio');
bgMusic.src = 'audio/chuchu.mp3';
bgMusic.loop = true;
bgMusic.volume = 0.05;
bgMusic.autoplay = true;
bgMusic.play().catch(err => {
    console.log("Música de fondo bloqueada hasta interacción:", err);
});
document.body.appendChild(bgMusic);

// ================================
// FUNCIONES AUXILIARES
// ================================
function formatNumber(num) {
    if (num >= 1e18) return (num / 1e18).toFixed(2) + 'Tr';
    if (num >= 1e15) return (num / 1e15).toFixed(2) + 'Q';
    if (num >= 1e12) return (num / 1e12).toFixed(2) + 'T';
    if (num >= 1e9)  return (num / 1e9).toFixed(2) + 'B';
    if (num >= 1e6)  return (num / 1e6).toFixed(2) + 'M';
    if (num >= 1e3)  return (num / 1e3).toFixed(2) + 'k';
    return Math.floor(num);
}

function showMessage(msg) {
    messages.textContent = msg;
    setTimeout(() => messages.textContent = '', 3000);
}

function saveData() {
    localStorage.setItem('points', points);
    localStorage.setItem('pointsPerClick', pointsPerClick);
    localStorage.setItem('pointsPerSecond', pointsPerSecond);
    localStorage.setItem('multiplicador', multiplicador);
    localStorage.setItem('totalClicks', totalClicks);
    localStorage.setItem('playerRankIndex', playerRankIndex);
    localStorage.setItem('upgrades', JSON.stringify(upgrades));
}

// ================================
// RANGOS
// ================================
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

// ================================
// 40 MEJORAS PERSONALIZADAS
// ================================
const customNames = [
    "Turbo Inicial", "Motor de Arranque", "Riel de Velocidad", "Vagón Extra",
    "Escape de Vapor", "Cadenas de Potencia", "Cabina Mejorada", "Chasis Ligero",
    "Turbina de Oro", "Ruedas de Ébano", "Sistema de Frenos", "Asiento Ergonómico",
    "Boquilla de Vapor", "Refuerzo de Ejes", "Control Digital", "Silbato Sonoro",
    "Cabina de Lujo", "Pantalla de Datos", "Faros LED", "Sistema de Audio",
    "Turbo Avanzado", "Motor V8", "Suspensión Hidráulica", "Sistema de Navegación",
    "Túnel de Aire", "Asientos de Cuero", "Retrovisores Inteligentes", "Rieles de Plata",
    "Freno Magnético", "Vagón Restaurante", "Vagón Dormitorio", "Motor Nuclear",
    "Cabina de Comando", "Turbina Experimental", "Sistema de Monitoreo", "Faros Xenon",
    "Rieles de Titanio", "Cabina Espacial", "Motor Cuántico", "Vagón Legendario"
];

const upgrades = [];
for (let i = 0; i < 40; i++) {
    const type = i % 2 === 0 ? 'ppc' : 'pps';
    const value = Math.floor((type === 'pps' ? 200 : 80) * Math.pow(1.45, i + 1));
    let basePrice = Math.floor(5000 * Math.pow(1.75, i + 1));
    if (i === 0) basePrice = 50;
    const requiredRank = Math.min(Math.floor(i / 4), ranks.length - 2);
    upgrades.push({ name: customNames[i], type, value, basePrice, count: 0, requiredRank });
}

// ================================
// BOOSTERS
// ================================
const boosters = [
    { name: "Doble Clic Leyenda",  multiplier: 2,  duration: 30, price: 1e12,   requiredRank: 4 },
    { name: "Triple PPS Leyenda",  multiplier: 3,  duration: 30, price: 1.5e12, requiredRank: 4 },
    { name: "Doble Clic Maestro",  multiplier: 3,  duration: 35, price: 2e12,   requiredRank: 5 },
    { name: "Triple PPS Maestro",  multiplier: 4,  duration: 35, price: 2.5e12, requiredRank: 5 },
    { name: "Doble Clic Supremo",  multiplier: 5,  duration: 40, price: 3e12,   requiredRank: 6 },
    { name: "Triple PPS Supremo",  multiplier: 6,  duration: 40, price: 3.5e12, requiredRank: 6 },
    { name: "Doble Clic Épico",    multiplier: 7,  duration: 50, price: 4e12,   requiredRank: 7 },
    { name: "Triple PPS Épico",    multiplier: 8,  duration: 50, price: 4.5e12, requiredRank: 7 },
    { name: "Doble Clic Mítico",   multiplier: 10, duration: 60, price: 5e12,   requiredRank: 8 },
    { name: "Triple PPS Mítico",   multiplier: 12, duration: 60, price: 5.5e12, requiredRank: 8 },
    { name: "Legendario Supremo",  multiplier: 20, duration: 90, price: 6e12,   requiredRank: 9 }
];

let activeBooster = null;
let boosterEndTime = null;
let boosterTimeout = null;

// ================================
// CARGAR MEJORAS GUARDADAS
// (antes de updateDisplay)
// ================================
const savedUpgrades = JSON.parse(localStorage.getItem('upgrades'));
if (savedUpgrades) {
    upgrades.forEach((up, i) => {
        up.count = savedUpgrades[i]?.count || 0;
        if (up.type === 'pps') pointsPerSecond += up.count * up.value;
        else pointsPerClick += up.count * up.value;
    });
}
multiplicador = pointsPerClick * (activeBooster ? activeBooster.multiplier : 1);

// ================================
// TREN — CLICK Y MANTENIDO
// ================================
let clickInterval = null;

function doClick(event) {
    const gained = pointsPerClick * (activeBooster ? activeBooster.multiplier : 1);
    points += gained;
    totalClicks++;
    saveData();
    updateDisplay();

    // Número flotante
    const floatSpan = document.createElement('span');
    floatSpan.textContent = `+${formatNumber(gained)}`;
    floatSpan.style.cssText = `
        position:fixed; left:${event.clientX + 5}px; top:${event.clientY - 20}px;
        color:#FFD93D; font-weight:bold; font-size:1.2rem;
        pointer-events:none; transition:all 0.8s ease-out; z-index:9999;
    `;
    document.body.appendChild(floatSpan);
    setTimeout(() => {
        floatSpan.style.top = (event.clientY - 60) + 'px';
        floatSpan.style.opacity = '0';
    }, 50);
    setTimeout(() => document.body.removeChild(floatSpan), 850);
}

trainContainer.addEventListener('mousedown', (e) => {
    doClick(e);
    clickInterval = setInterval(() => doClick(e), 200);
});

document.addEventListener('mouseup', () => {
    if (clickInterval) { clearInterval(clickInterval); clickInterval = null; }
});

trainContainer.addEventListener('mouseleave', () => {
    if (clickInterval) { clearInterval(clickInterval); clickInterval = null; }
});

// Soporte táctil
trainContainer.addEventListener('touchstart', (e) => {
    e.preventDefault();
    const touch = e.touches[0];
    doClick(touch);
    clickInterval = setInterval(() => doClick(touch), 200);
}, { passive: false });

document.addEventListener('touchend', () => {
    if (clickInterval) { clearInterval(clickInterval); clickInterval = null; }
});

// ================================
// RENDER MEJORAS
// ================================
function renderUpgrades() {
    upgradesContainer.innerHTML = '';
    upgrades.forEach((up) => {
        const price = Math.floor(up.basePrice * Math.pow(1.4, up.count));
        const lockedByRank = playerRankIndex < up.requiredRank;
        const canBuy = points >= price && !lockedByRank;

        const div = document.createElement('div');
        div.className = 'upgrade';
        div.innerHTML = `
            <div>
                <strong>${up.name}</strong>
                <div>+${formatNumber(up.value)} ${up.type === 'pps' ? 'PPS' : 'PPC'}</div>
                <div>Comprado: ${up.count}</div>
                <div class="${canBuy ? 'price-can-buy' : 'price-cant-buy'}">Precio: ${formatNumber(price)}</div>
                ${lockedByRank ? `<div>🔒 Requiere: ${ranks[up.requiredRank].name}</div>` : ''}
            </div>
            <button ${canBuy ? '' : 'disabled'}>Comprar</button>
        `;
        div.querySelector('button').onclick = () => {
            if (!canBuy) return;
            points -= price;
            up.count++;
            if (up.type === 'pps') pointsPerSecond += up.value;
            else pointsPerClick += up.value;
            multiplicador = pointsPerClick * (activeBooster ? activeBooster.multiplier : 1);
            showMessage(`Comprado: ${up.name}`);
            saveData();
            updateDisplay();
        };
        upgradesContainer.appendChild(div);
    });
}

// ================================
// RENDER RANGOS
// ================================
function renderRanks() {
    ranksContainer.innerHTML = '';
    ranks.forEach((r, i) => {
        const div = document.createElement('div');
        div.className = 'rank';

        if (i < playerRankIndex) {
            div.innerHTML = `<div>${r.name}</div><button disabled style="background:gray;cursor:not-allowed;">Obtenido</button>`;
        } else if (i === playerRankIndex) {
            div.innerHTML = `<div>${r.name}</div><button disabled style="background:gold;cursor:not-allowed;">Actual</button>`;
        } else {
            const previousRankOwned = playerRankIndex === i - 1;
            const canBuy = points >= r.price && previousRankOwned;
            div.innerHTML = `<div>${r.name}</div><button class="${canBuy ? 'price-can-buy' : 'price-cant-buy'}" ${canBuy ? '' : 'disabled'}>${formatNumber(r.price)}</button>`;
            div.querySelector('button').onclick = () => {
                if (!canBuy) return;
                points -= r.price;
                playerRankIndex = i;
                showMessage(`Nuevo rango: ${r.name}`);
                saveData();
                updateDisplay();
            };
        }
        ranksContainer.appendChild(div);
    });
}

// ================================
// RENDER BOOSTERS
// ================================
function renderBoosters() {
    boostersContainer.innerHTML = '';
    boosters.forEach((b) => {
        const lockedByRank = playerRankIndex < b.requiredRank;
        const canBuy = points >= b.price && !lockedByRank;
        const remainingTime = (activeBooster === b && boosterEndTime > Date.now())
            ? Math.ceil((boosterEndTime - Date.now()) / 1000) : 0;

        const div = document.createElement('div');
        div.className = 'upgrade';
        div.innerHTML = `
            <div>
                <strong>${b.name}</strong>
                <div>x${b.multiplier} durante ${b.duration}s</div>
                ${remainingTime > 0 ? `<div>⏱ ${remainingTime}s restantes</div>` : ''}
                <div class="${canBuy ? 'price-can-buy' : 'price-cant-buy'}">Precio: ${formatNumber(b.price)}</div>
                ${lockedByRank ? `<div>🔒 Requiere: ${ranks[b.requiredRank].name}</div>` : ''}
            </div>
            <button ${canBuy ? '' : 'disabled'}>Comprar</button>
        `;
        div.querySelector('button').onclick = () => {
            if (!canBuy) return;
            points -= b.price;
            activeBooster = b;
            boosterEndTime = Date.now() + b.duration * 1000;
            multiplicador = pointsPerClick * b.multiplier;
            if (boosterTimeout) clearInterval(boosterTimeout);
            boosterTimeout = setInterval(() => {
                if (Date.now() >= boosterEndTime) {
                    multiplicador = pointsPerClick;
                    activeBooster = null;
                    clearInterval(boosterTimeout);
                    boosterTimeout = null;
                    showMessage(`${b.name} ha terminado`);
                }
                updateDisplay();
            }, 1000);
            showMessage(`Potenciador activado: ${b.name}`);
            saveData();
            updateDisplay();
        };
        boostersContainer.appendChild(div);
    });
}

// ================================
// DESPLEGABLE BOOSTERS
// ================================
boostersToggleBtn.onclick = () => {
    if (boostersContainer.style.display === 'none' || boostersContainer.style.display === '') {
        boostersContainer.style.display = 'flex';
        boostersToggleBtn.textContent = 'Ocultar Potenciadores';
    } else {
        boostersContainer.style.display = 'none';
        boostersToggleBtn.textContent = 'Mostrar Potenciadores';
    }
};

// ================================
// PPS AUTOMÁTICO
// ================================
setInterval(() => {
    points += pointsPerSecond * (activeBooster ? activeBooster.multiplier : 1);
    saveData();
    updateDisplay();
}, 1000);

// ================================
// BOTÓN REINICIAR
// ================================
resetBtn.onclick = () => {
    if (confirm('¿Reiniciar todo el progreso?')) {
        localStorage.clear();
        location.reload();
    }
};

// ================================
// ACTUALIZAR PANTALLA
// (definida ANTES de llamarse)
// ================================
function updateDisplay() {
    pointsDisplay.textContent = formatNumber(points);
    ppsDisplay.textContent = formatNumber(pointsPerSecond);
    clickCounterDiv.textContent = totalClicks;
    rankName.textContent = ranks[playerRankIndex].name;
    rankImage.src = ranks[playerRankIndex].image;
    renderUpgrades();
    renderRanks();
    renderBoosters();
}

// ================================
// INICIO
// ================================
updateDisplay();
