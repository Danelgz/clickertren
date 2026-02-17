// ================================
// FIREBASE CONFIGURACIÓN
// ================================
const firebaseConfig = {
    apiKey: "TU_API_KEY",
    authDomain: "TU_PROYECTO.firebaseapp.com",
    databaseURL: "https://TU_PROYECTO-default-rtdb.firebaseio.com",
    projectId: "TU_PROYECTO",
    storageBucket: "TU_PROYECTO.appspot.com",
    messagingSenderId: "TU_SENDER_ID",
    appId: "TU_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const database = firebase.database();

// Nombre del jugador
let playerName = localStorage.getItem('playerName') || prompt("Introduce tu nombre:");
localStorage.setItem('playerName', playerName);

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
const train = document.getElementById('train');
const rankName = document.getElementById('rankName');
const rankImage = document.getElementById('rankImage');
const resetBtn = document.getElementById('resetBtn');
const messages = document.getElementById('messages');
const upgradesContainer = document.getElementById('upgradesContainer');
const ranksContainer = document.getElementById('ranksContainer');
const boostersContainer = document.getElementById('boostersContainer');
const boostersToggleBtn = document.getElementById('boostersToggleBtn');
const rankingList = document.getElementById('rankingList');

// ================================
// AUDIO DE FONDO
// ================================
const bgMusic = new Audio('audio/chuchu.mp3');
bgMusic.loop = true;
bgMusic.volume = 0.05;
bgMusic.play();

// ================================
// FUNCIONES AUXILIARES
// ================================
function formatNumber(num){
    if(num >= 1e18) return (num/1e18).toFixed(2)+'Tr';
    if(num >= 1e15) return (num/1e15).toFixed(2)+'Q';
    if(num >= 1e12) return (num/1e12).toFixed(2)+'T';
    if(num >= 1e9) return (num/1e9).toFixed(2)+'B';
    if(num >= 1e6) return (num/1e6).toFixed(2)+'M';
    if(num >= 1e3) return (num/1e3).toFixed(2)+'k';
    return Math.floor(num);
}

function showMessage(msg){
    messages.textContent = msg;
    setTimeout(()=>messages.textContent='',3000);
}

function saveData(){
    localStorage.setItem('points', points);
    localStorage.setItem('pointsPerClick', pointsPerClick);
    localStorage.setItem('pointsPerSecond', pointsPerSecond);
    localStorage.setItem('multiplicador', multiplicador);
    localStorage.setItem('totalClicks', totalClicks);
    localStorage.setItem('playerRankIndex', playerRankIndex);
    localStorage.setItem('upgrades', JSON.stringify(upgrades));
}

// ================================
// FIREBASE: Guardar puntos
// ================================
function updateFirebasePoints(){
    firebase.database().ref('users/' + playerName).set({
        points: points,
        timestamp: Date.now()
    });
}

// ================================
// FIREBASE: Actualizar ranking
// ================================
function updateRanking(){
    rankingList.innerHTML = '';
    firebase.database().ref('users').orderByChild('points').limitToLast(10).once('value', snapshot=>{
        const users = [];
        snapshot.forEach(child=>{
            users.push({name: child.key, points: child.val().points});
        });
        users.sort((a,b)=>b.points - a.points);
        users.forEach(u=>{
            const li = document.createElement('li');
            li.textContent = `${u.name}: ${formatNumber(u.points)}`;
            rankingList.appendChild(li);
        });
    });
}
setInterval(updateRanking, 5000);
updateRanking();

// ================================
// RANGOS
// ================================
const ranks = [
    { name:'Principiante', image:'images/rank_principiante.png', price:0 },
    { name:'Aprendiz', image:'images/rank_aprendiz.png', price:1e4 },
    { name:'Maquinista', image:'images/rank_maquinista.png', price:1e5 },
    { name:'Experto', image:'images/rank_experto.png', price:1e6 },
    { name:'Leyenda', image:'images/rank_leyenda.png', price:1e7 },
    { name:'Maestro', image:'images/rank_maestro.png', price:1e8 },
    { name:'Supremo', image:'images/rank_supremo.png', price:1e12 },
    { name:'Épico', image:'images/rank_epico.png', price:1e13 },
    { name:'Mítico', image:'images/rank_mitico.png', price:1e14 },
    { name:'Legendario', image:'images/rank_legendario.png', price:1e15 }
];

// ================================
// MEJORAS (40)
// ================================
const upgrades = [];
for(let i=1;i<=40;i++){
    const type = i%2===0?'ppc':'pps';
    const value = Math.floor((type==='pps'?200:80) * Math.pow(1.45,i));
    let basePrice = Math.floor(5000*Math.pow(1.75,i));
    if(i===1) basePrice=50;
    const requiredRank = Math.min(Math.floor((i-1)/5), ranks.length-2);
    upgrades.push({name:type==='pps'?`Motor automático ${i}`:`Turbo de clic ${i}`,type,value,basePrice,count:0,requiredRank});
}

// ================================
// BOOSTERS
// ================================
const boosters = [
    { name:"Doble Clic Leyenda", multiplier:2, duration:30, price:1e12, requiredRank:4 },
    { name:"Triple PPS Leyenda", multiplier:3, duration:30, price:1.2e12, requiredRank:4 },
    { name:"Doble Clic Maestro", multiplier:3, duration:35, price:2e12, requiredRank:5 },
    { name:"Triple PPS Maestro", multiplier:4, duration:35, price:2.4e12, requiredRank:5 },
    { name:"Doble Clic Supremo", multiplier:5, duration:40, price:4e12, requiredRank:6 },
    { name:"Triple PPS Supremo", multiplier:6, duration:40, price:5e12, requiredRank:6 },
    { name:"Doble Clic Épico", multiplier:7, duration:50, price:1e13, requiredRank:7 },
    { name:"Triple PPS Épico", multiplier:8, duration:50, price:1.2e13, requiredRank:7 },
    { name:"Doble Clic Mítico", multiplier:10, duration:60, price:2e13, requiredRank:8 },
    { name:"Triple PPS Mítico", multiplier:12, duration:60, price:2.5e13, requiredRank:8 },
    { name:"Legendario Supremo", multiplier:20, duration:90, price:5e13, requiredRank:9 }
];

let activeBooster = null;
let boosterEndTime = 0;
let boosterTimeout = null;

// ================================
// RENDER FUNCIONES (BOTONES ORIGINALES MANTENIDOS)
// ================================
function renderUpgrades(){
    upgradesContainer.innerHTML='';
    upgrades.forEach((up,index)=>{
        let price=Math.floor(up.basePrice*Math.pow(1.40,up.count));
        const lockedByRank = playerRankIndex < up.requiredRank;
        const div=document.createElement('div');
        div.className='upgrade';
        const canBuy = points>=price && !lockedByRank;
        div.innerHTML=`
            <div style="color:${canBuy?'lime':'red'}">
                <strong>${up.name}</strong><br>
                +${formatNumber(up.value)} ${up.type==='pps'?'PPS':'PPC'}<br>
                Comprado: ${up.count}<br>
                Precio: ${formatNumber(price)}<br>
                ${lockedByRank?`🔒 Requiere rango: ${ranks[up.requiredRank].name}`:''}
            </div>
            <button>${canBuy?'Comprar':'No disponible'}</button>
        `;
        div.querySelector('button').onclick=()=>{
            if(!canBuy) return;
            points-=price;
            if(up.type==='pps') pointsPerSecond+=up.value;
            else pointsPerClick+=up.value;
            up.count++;
            multiplicador=pointsPerClick*(activeBooster?activeBooster.multiplier:1);
            showMessage(`Comprado ${up.name}`);
            saveData();
            updateDisplay();
        };
        upgradesContainer.appendChild(div);
    });
}

function renderRanks(){
    ranksContainer.innerHTML='';
    ranks.forEach((r,i)=>{
        const div=document.createElement('div');
        div.className='rank';
        const canBuy = points>=r.price && i>playerRankIndex;
        div.innerHTML=`
            <div style="color:${i<=playerRankIndex?'lime':canBuy?'lime':'red'}">${r.name}${i<=playerRankIndex?' (Obtenido)':''}</div>
            <button>${i<=playerRankIndex?'Obtenido':canBuy?'Comprar':'No disponible'}</button>
        `;
        div.querySelector('button').onclick=()=>{
            if(!canBuy) return;
            points-=r.price;
            playerRankIndex=i;
            showMessage(`Nuevo rango: ${r.name}`);
            saveData();
            updateDisplay();
        };
        ranksContainer.appendChild(div);
    });
}

function renderBoosters(){
    boostersContainer.innerHTML='';
    boosters.forEach((b)=>{
        const lockedByRank = playerRankIndex < b.requiredRank;
        const remainingTime = (activeBooster===b && boosterEndTime>Date.now()) ? Math.ceil((boosterEndTime-Date.now())/1000) : 0;
        const canBuy = points>=b.price && !lockedByRank;
        const div=document.createElement('div');
        div.className='upgrade';
        div.innerHTML=`
            <div style="color:${canBuy?'lime':'red'}">
                <strong>${b.name}</strong><br>
                x${b.multiplier} durante ${b.duration}s<br>
                ${remainingTime>0?`⏱ ${remainingTime}s restantes<br>`:''}
                Precio: ${formatNumber(b.price)}<br>
                ${lockedByRank?`🔒 Requiere rango: ${ranks[b.requiredRank].name}`:''}
            </div>
            <button>${canBuy?'Comprar':'No disponible'}</button>
        `;
        div.querySelector('button').onclick=()=>{
            if(!canBuy) return;
            points-=b.price;
            activeBooster=b;
            boosterEndTime=Date.now()+b.duration*1000;
            multiplicador=pointsPerClick*b.multiplier;
            if(boosterTimeout) clearInterval(boosterTimeout);
            boosterTimeout=setInterval(()=>{
                if(Date.now()>=boosterEndTime){
                    multiplicador=pointsPerClick;
                    activeBooster=null;
                    clearInterval(boosterTimeout);
                    boosterTimeout=null;
                    showMessage(`${b.name} ha terminado`);
                }
                updateDisplay();
            },1000);
            showMessage(`Potenciador activado: ${b.name}`);
            saveData();
            updateDisplay();
        };
        boostersContainer.appendChild(div);
    });
}

// ================================
// BOOSTERS TOGGLE
boostersToggleBtn.onclick=()=>{
    if(boostersContainer.style.display==='none'){
        boostersContainer.style.display='flex';
        boostersToggleBtn.textContent='Ocultar Potenciadores';
    }else{
        boostersContainer.style.display='none';
        boostersToggleBtn.textContent='Mostrar Potenciadores';
    }
};

// ================================
// ACTUALIZAR PANTALLA
function updateDisplay(){
    pointsDisplay.textContent=formatNumber(points);
    ppsDisplay.textContent=formatNumber(pointsPerSecond);
    clickCounterDiv.textContent=totalClicks;
    rankName.textContent=ranks[playerRankIndex].name;
    rankImage.src=ranks[playerRankIndex].image;
    renderUpgrades();
    renderRanks();
    renderBoosters();
    updateFirebasePoints();
}

// ================================
// CLICK DEL TREN
train.onclick=()=>{
    points+=pointsPerClick*(activeBooster?activeBooster.multiplier:1);
    totalClicks++;
    saveData();
    updateDisplay();
};

// ================================
// PPS AUTOMÁTICO
setInterval(()=>{
    points+=pointsPerSecond*(activeBooster?activeBooster.multiplier:1);
    saveData();
    updateDisplay();
},1000);

// ================================
// REINICIAR PROGRESO
resetBtn.onclick=()=>{
    if(confirm('¿Reiniciar todo el progreso?')){
        localStorage.clear();
        location.reload();
    }
};

// ================================
// CARGAR MEJORAS GUARDADAS
const savedUpgrades=JSON.parse(localStorage.getItem('upgrades'));
if(savedUpgrades){
    upgrades.forEach((up,i)=>{
        up.count=savedUpgrades[i]?.count || 0;
        if(up.type==='pps') pointsPerSecond+=up.count*up.value;
        else pointsPerClick+=up.count*up.value;
    });
}
multiplicador=pointsPerClick*(activeBooster?activeBooster.multiplier:1);

// ================================
// INICIO
updateDisplay();

