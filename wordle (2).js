// ========================
// PALABRAS DE 5 LETRAS (700)
// ========================
const words = [
"ABACO","ABRIR","ACERO","ACIDO","ACTOR","ADUAN","AFONI","AGUIL","AGUJA","AIRE",
"AJEDR","ALBA","ALCOH","ALEGR","ALGA","ALMOH","ALMEN","ALQUI","ALTUR","AMARL",
"AMIGO","AMOR","ANCLA","ANIMO","ANUAL","APODO","AROMA","ARPA","ARCO","ASADO",
"ASEAR","ASILO","ATADO","ATLAS","AVION","AVENA","AZOTE","BANDA","BARCO","BEATO",
"BEBER","BELLO","BOLSA","BONOS","BORRA","BORRO","BOSCO","BRISA","BROMA","BUENO",
"BURRO","CABAL","CABRA","CACAO","CAIDA","CAJON","CALOR","CAMPO","CANAL","CANTO",
"CAPAS","CARNE","CARRO","CASAS","CASCO","CELEB","CELTA","CICLO","CIELO","CINTA",
"CIRCO","CLAVE","CLIMA","CLUBS","COCHE","COLAR","COLON","COMER","COMOS","COPAS",
"CORAL","CORTA","CREMA","CRONO","CUART","CUELA","CUERO","CUOTA","DADOS","DALIA",
"DANZA","DATOS","DEBES","DEUDA","DIETA","DIOSO","DOLAR","DOMAR","DORMI","DUETO",
"DULCE","EBANO","EDAD","EDICT","EDRED","EJECA","ELITE","ELUDE","EMBAR","EMOCI",
"EMPAN","ENERG","ENGAÑ","ENTRE","ENVIO","ESCAR","ESFER","ESPIN","ESTAR","EXITO",
"FAUNA","FELIZ","FERIA","FIEST","FILAR","FLACO","FLORA","FLUJO","FONDO","FOROS",
"FRUTA","FRIJO","FUERA","FUEGO","GALLO","GALAX","GATOS","GENIO","GESTO","GIRAS",
"GLASE","GOLPE","GRANO","GRUPO","GUANO","GUIAR","GUITA","HABER","HALAR","HASTA",
"HERM1","HIELO","HUEVO","HUMOR","HURAC","IDEAL","IGLES","ILUMI","IMPAR","IMPUL",
"INCA1","INERT","INGRE","INSTI","INTER","INUND","ISLA1","JAULA","JUGAR","JUNTA",
"JURAR","JUNIO","JUVEN","KALE1","KILO1","KART1","KIOSK","LABIO","LAMPA","LANZA",
"LAPIZ","LARGO","LATA1","LECHE","LEON1","LETRA","LIBRO","LLAVE","LLAMA","LLANO",
"LLENA","LUCIR","LUGAR","LUZAR","MADER","MAEST","MALTA","MANO1","MANGO","MANTA",
"MAPAS","MARCO","MASAS","MAYOR","MEJOR","MEMOR","MESA1","METRO","MIENTO","MIMAR",
"MINUT","MODO1","MONED","MONTA","MONTO","MORAR","MUCHO","MUEBL","MUNDO","MUSIC",
"NADAR","NIEVE","NINOS","NIVEL","NOMBRE","NUBES","NUEVO","NUMER","OCEAN","OJALA",
"OLIVA","OPCIO","ORO1","OSO1","OTROS","PAPA1","PARED","PARAR","PARTE","PASAR",
"PASTA","PELOS","PEZAR","PIANO","PIEDR","PIEL1","PILA1","PISTA","PLAN1","PLATO",
"PLUMA","POEMA","POLOS","PONER","PUEBL","PUERTA","PUNTO","QUESO","RATA1","RAYAR",
"REINA","RELOJ","RICO1","RIO1","ROJO1","ROSA1","RUEDA","SALAR","SALON","SILLA",
"SOBRE","SOLAR","SUEÑO","TABLA","TACON","TALLA","TANGO","TAPA1","TARDE","TECLA",
"TELA1","TELAR","TENIS","TIERRA","TIGRE","TIZA1","TOALL","TOMAR","TORO1","TORRE",
"TRABA","TRIAD","TROZO","TURNO","UNICO","UNO1","URNA1","USO1","UTILE","VACIO",
"VALLE","VAMOS","VAPOR","VERDE","VIAJE","VIDA1","VINO1","VIOLA","VISTA","VOZ1",
"VUELT","YATE1","ZAPAT","ZONA1","ZORRO","ACERO","ACIDO","ADUAN","AGUIL","AGUJA",
"AIRE1","ALBA1","ALGA1","AMAR1","AMIGO","ANCLA","ANIMO","ANTON","APODO","ARBOL",
"ARMAR","AROMA","ARPA1","ARTIS","ASEAR","ATADO","AVION","AVENA","AZOTE","BANDA",
"BARCO","BEBER","BELLO","BOLSA","BONOS","BORRA","BURRO","CABAL","CABRA","CACAO",
"CAIDA","CAJON","CALOR","CAMPO","CANAL","CANTO","CAPAS","CARNE","CARRO","CASAS",
"CASCO","CICLO","CIELO","CINTA","CIRCO","CLAVE","CLIMA","CLUBS","COCHE","COLON",
"COMER","COPAS","CORAL","CORTA","CREMA","CRONO","CUART","CUERO","CUOTA","DADOS",
"DANZA","DATOS","DEBES","DEUDA","DIETA","DOLAR","DOMAR","DULCE","EBANO","EDAD",
"EDICT","EDRED","ELITE","EMBAR","EMOCI","EMPAN","ENERG","ENTRE","ESCAR","ESFER",
"ESPIN","ESTAR","EXITO","FAUNA","FELIZ","FERIA","FIEST","FILAR","FLORA","FLUJO",
"FONDO","FOROS","FRUTA","FUERA","FUEGO","GALLO","GATOS","GENIO","GESTO","GLASE",
"GOLPE","GRANO","GRUPO","GUANO","GUIAR","HABER","HALAR","HASTA","HIELO","HUEVO",
"HUMOR","IDEAL","IGLES","ILUMI","IMPAR","IMPUL","INCA1","INERT","INSTI","INTER",
"ISLA1","JAULA","JUGAR","JUNTA","JURAR","KALE1","KILO1","KART1","KIOSK","LABIO",
"LAMPA","LANZA","LAPIZ","LARGO","LECHE","LEON1","LETRA","LIBRO","LLAVE","LLAMA",
"LLANO","LLENA","LUCIR","LUGAR","LUZAR","MADER","MAEST","MALTA","MANO1","MANGO",
"MANTA","MAPAS","MARCO","MASAS","MAYOR","MEJOR","MEMOR","MESA1","METRO","MIENTO",
"MIMAR","MINUT","MODO1","MONED","MONTA","MONTO","MORAR","MUCHO","MUEBL","MUNDO",
"MUSIC","NADAR","NIEVE","NINOS","NIVEL","NOMBRE","NUBES","NUEVO","NUMER","OCEAN",
"OLIVA","OPCIO","ORO1","OSO1","OTROS","PAPA1","PARED","PARAR","PARTE","PASAR",
"PASTA","PELOS","PEZAR","PIANO","PIEDR","PIEL1","PILA1","PISTA","PLAN1","PLATO",
"PLUMA","POEMA","POLOS","PONER","PUEBL","PUERTA","PUNTO","QUESO","RATA1","RAYAR"
];

// ========================
// VARIABLES DEL JUEGO
// ========================
let level = parseInt(localStorage.getItem('level')) || 1;
let totalWins = parseInt(localStorage.getItem('totalWins')) || 0;
let winAttempts = JSON.parse(localStorage.getItem('winAttempts')) || [0,0,0,0,0];
let currentWord = words[Math.floor(Math.random()*words.length)].toUpperCase();
let board = [];
let currentRow = 0;
let currentCol = 0;

// ========================
// CREAR TABLERO
// ========================
const boardDiv = document.getElementById('game-board');
for(let r=0;r<5;r++){
    board[r]=[];
    for(let c=0;c<5;c++){
        const tile = document.createElement('div');
        tile.classList.add('tile');
        boardDiv.appendChild(tile);
        board[r][c]=tile;
    }
}

// ========================
// CREAR TECLADO
// ========================
const keyboardDiv = document.getElementById('keyboard');
const keys = "QWERTYUIOPASDFGHJKLÑZXCVBNM".split('');
const keyMap = {};
keys.forEach(k=>{
    const btn=document.createElement('div');
    btn.classList.add('key');
    btn.textContent=k;
    keyboardDiv.appendChild(btn);
    keyMap[k]=btn;
    btn.onclick=()=>handleKey(k);
});

// ========================
// FUNCIONES
// ========================
function removeAccents(str){
    return str.normalize("NFD").replace(/[\u0300-\u036f]/g,"");
}

function handleKey(key){
    if(key==="ENTER"){ checkWord(); return; }
    if(key==="DEL"){ deleteLetter(); return; }
    if(currentCol<5){
        board[currentRow][currentCol].textContent=key;
        currentCol++;
    }
}

function deleteLetter(){
    if(currentCol>0){
        currentCol--;
        board[currentRow][currentCol].textContent='';
    }
}

function checkWord(){
    let guess="";
    for(let c=0;c<5;c++){
        guess+=board[currentRow][c].textContent;
    }
    if(guess.length<5) return;

    let normalizedGuess = removeAccents(guess.toUpperCase());
    let normalizedWord = removeAccents(currentWord.toUpperCase());

    for(let c=0;c<5;c++){
        const tile = board[currentRow][c];
        const letter = guess[c].toUpperCase();
        const normalizedLetter = normalizedGuess[c];

        if(normalizedLetter===normalizedWord[c]){
            tile.classList.add('correct');
            keyMap[letter].classList.add('correct');
        } else if(normalizedWord.includes(normalizedLetter)){
            tile.classList.add('present');
            if(!keyMap[letter].classList.contains('correct'))
                keyMap[letter].classList.add('present');
        } else {
            tile.classList.add('absent');
            keyMap[letter].classList.add('absent');
        }
    }

    if(normalizedGuess===normalizedWord){
        totalWins++;
        winAttempts[currentRow]++;
        alert("¡Correcto!");
        nextLevel();
    } else {
        currentRow++;
        currentCol=0;
        if(currentRow>=5){
            alert("La palabra era: "+currentWord);
            nextLevel();
        }
    }
    saveStats();
}

function nextLevel(){
    level++;
    currentRow=0;
    currentCol=0;
    board.forEach(row=>row.forEach(tile=>{ tile.textContent=''; tile.className='tile'; }));
    currentWord = words[Math.floor(Math.random()*words.length)].toUpperCase();
    document.getElementById('levelDisplay').textContent=level;
}

function saveStats(){
    localStorage.setItem('level',level);
    localStorage.setItem('totalWins',totalWins);
    localStorage.setItem('winAttempts',JSON.stringify(winAttempts));
    document.getElementById('totalWins').textContent=totalWins;
    document.getElementById('win1').textContent=winAttempts[0];
    document.getElementById('win2').textContent=winAttempts[1];
    document.getElementById('win3').textContent=winAttempts[2];
    document.getElementById('win4').textContent=winAttempts[3];
    document.getElementById('win5').textContent=winAttempts[4];
}

// ========================
// ESTADÍSTICAS
// ========================
const statsBtn = document.getElementById('showStatsBtn');
const statsPanel = document.getElementById('statsPanel');
document.getElementById('closeStatsBtn').onclick=()=>statsPanel.style.display='none';
statsBtn.onclick=()=>statsPanel.style.display='block';

// ========================
// TECLADO FÍSICO
// ========================
document.addEventListener('keydown',(e)=>{
    let key = e.key.toUpperCase();
    if(key==='BACKSPACE') key='DEL';
    if(key==='ENTER') handleKey('ENTER');
    else if(key.length===1 && /[A-ZÑÁÉÍÓÚ]/.test(key)) handleKey(key);
});
