// ========================
// LISTA DE PALABRAS (ejemplo, puedes ampliar)
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
"VUELT","YATE1","ZAPAT","ZONA1","ZORRO"
];

// ========================
// CLASE WORDLEGAME FINAL
// ========================
class WordleGame {
    constructor(words) {
        this.words = words.map(w => w.toUpperCase());
        this.level = parseInt(localStorage.getItem('level')) || 1;
        this.totalWins = parseInt(localStorage.getItem('totalWins')) || 0;
        this.winAttempts = JSON.parse(localStorage.getItem('winAttempts')) || [0,0,0,0,0,0];

        this.currentWord = this.randomWord();
        this.currentRow = 0;
        this.currentCol = 0;
        this.board = [];
        this.keyMap = {};

        this.boardDiv = document.getElementById('game-board');
        this.keyboardDiv = document.getElementById('keyboard');
        this.levelDisplay = document.getElementById('levelDisplay');

        this.initBoard();
        this.initKeyboard();
        this.bindKeyboard();
        this.updateStatsDisplay();
        this.updateLevelDisplay();
    }

    randomWord() {
        return this.words[Math.floor(Math.random()*this.words.length)];
    }

    initBoard() {
        this.boardDiv.innerHTML = '';
        this.board = [];
        for(let r=0;r<6;r++){  // 6 filas
            const row = [];
            for(let c=0;c<5;c++){
                const tile = document.createElement('div');
                tile.classList.add('tile');
                this.boardDiv.appendChild(tile);
                row.push(tile);
            }
            this.board.push(row);
        }
    }

    initKeyboard() {
        this.keyboardDiv.innerHTML = '';
        const letters = "QWERTYUIOPASDFGHJKLÑZXCVBNM".split('');
        const specialKeys = ["DEL","ENTER"];

        letters.forEach(k=>{
            const btn = document.createElement('div');
            btn.classList.add('key');
            btn.textContent = k;
            this.keyboardDiv.appendChild(btn);
            this.keyMap[k] = btn;
            btn.onclick = () => this.handleKey(k);
        });

        specialKeys.forEach(k=>{
            const btn = document.createElement('div');
            btn.classList.add('key','special');
            btn.textContent = k;
            this.keyboardDiv.appendChild(btn);
            this.keyMap[k] = btn;
            btn.onclick = () => this.handleKey(k);
        });
    }

    bindKeyboard() {
        document.addEventListener('keydown', e => {
            let key = e.key.toUpperCase();
            if(key==='BACKSPACE') key='DEL';
            if(key==='ENTER') this.handleKey('ENTER');
            else if(key.length===1 && /[A-ZÑÁÉÍÓÚ]/.test(key)) this.handleKey(key);
            else if(key==='DEL') this.handleKey('DEL');
        });
    }

    removeAccents(str){
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g,"");
    }

    handleKey(key){
        if(key==="ENTER"){ this.checkWord(); return; }
        if(key==="DEL"){ this.deleteLetter(); return; }
        if(this.currentCol<5){
            const tile = this.board[this.currentRow][this.currentCol];
            tile.textContent=key;
            tile.classList.add('filled');
            this.currentCol++;
        }
    }

    deleteLetter(){
        if(this.currentCol>0){
            this.currentCol--;
            const tile = this.board[this.currentRow][this.currentCol];
            tile.textContent='';
            tile.classList.remove('filled');
        }
    }

    checkWord(){
        let guess="";
        for(let c=0;c<5;c++) guess+=this.board[this.currentRow][c].textContent;
        if(guess.length<5) return;

        const normalizedGuess = this.removeAccents(guess.toUpperCase());
        const normalizedWord = this.removeAccents(this.currentWord);

        // Contar cuántas veces aparece cada letra en la palabra
        const letterCount = {};
        for(let l of normalizedWord){
            letterCount[l] = (letterCount[l] || 0) + 1;
        }

        // PRIMERO: marcar correctas
        for(let c=0;c<5;c++){
            const tile = this.board[this.currentRow][c];
            const letter = normalizedGuess[c];
            if(letter === normalizedWord[c]){
                tile.classList.add('correct');
                this.keyMap[normalizedGuess[c]].classList.add('correct');
                letterCount[letter]--;
            }
        }

        // SEGUNDO: marcar presentes o ausentes
        for(let c=0;c<5;c++){
            const tile = this.board[this.currentRow][c];
            const letter = normalizedGuess[c];
            if(tile.classList.contains('correct')) continue;

            setTimeout(()=>{
                tile.classList.add('reveal');
                setTimeout(()=>{
                    tile.classList.remove('reveal');
                    if(letterCount[letter] > 0){
                        tile.classList.add('present');
                        if(!this.keyMap[letter].classList.contains('correct'))
                            this.keyMap[letter].classList.add('present');
                        letterCount[letter]--;
                    } else {
                        tile.classList.add('absent');
                        this.keyMap[letter].classList.add('absent');
                    }
                },500);
            }, c*250);
        }

        // COMPROBACIÓN FINAL
        setTimeout(()=>{
            if(normalizedGuess===normalizedWord){
                this.totalWins++;
                this.winAttempts[this.currentRow]++;
                this.nextLevel();
            } else {
                this.currentRow++;
                this.currentCol=0;
                if(this.currentRow >= 6){ // ahora 6 intentos
                    alert(`La palabra era: ${this.currentWord}`);
                    this.nextLevel();
                }
            }
            this.saveStats();
        }, 5*250 + 500);
    }

    nextLevel(){
        this.currentRow=0;
        this.currentCol=0;
        this.board.forEach(row=>row.forEach(tile=>{
            tile.textContent='';
            tile.className='tile';
        }));
        this.currentWord = this.randomWord();
        this.level++;
        this.updateLevelDisplay();
    }

    saveStats(){
        localStorage.setItem('level',this.level);
        localStorage.setItem('totalWins',this.totalWins);
        localStorage.setItem('winAttempts',JSON.stringify(this.winAttempts));
        this.updateStatsDisplay();
    }

    updateStatsDisplay(){
        document.getElementById('totalWins').textContent=this.totalWins;
        for(let i=0;i<6;i++){
            let el = document.getElementById('win'+(i+1));
            if(el) el.textContent=this.winAttempts[i];
        }
    }

    updateLevelDisplay(){
        this.levelDisplay.textContent = this.level;
    }
}

// ========================
// INICIALIZAR JUEGO
// ========================
const game = new WordleGame(words);
