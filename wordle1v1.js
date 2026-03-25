// ============================================================
// wordle1v1.js — Wordle 1v1 Multijugador en tiempo real
// ============================================================
import { db, waitForUser, getPlayerName }
    from "./firebase-config.js";
import {
    doc, getDoc, setDoc, updateDoc, serverTimestamp, onSnapshot, collection, query, where, limit, orderBy, deleteDoc
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

// ========================
// VARIABLES GLOBALES
// ========================
let currentUser = null;
let currentRoom = null;
let roomCode = null;
let isRoomCreator = false;
let gameInstance = null;

// Pantallas
const roomScreen = document.getElementById('roomScreen');
const gameScreen = document.getElementById('gameScreen');
const resultsScreen = document.getElementById('resultsScreen');

// ========================
// PALABRAS SECRETAS
// ========================
const words = [
"ABACO","ABAJO","ABRIR","ACERO","ACIDO","ACTOR","AGUJA","ALBUM","ALDEA","ALETA",
"ALGAS","ALGUN","ALMAS","ALTAR","AMADO","AMIGA","AMIGO","ANDAR","ANGEL","ANIMO",
"ANTES","APODO","ARANA","ARBOL","ARCOS","ARDOR","ARENA","ARMAS","AROMA","ARROZ",
"ASADO","ASILO","ATADO","AVENA","AVION","AVISO","AYUDA","AZOTE","BAILE","BAJAR",
"BANCO","BANDA","BARCO","BARRA","BEBER","BELLA","BELLO","BESAR","BOLSA","BOMBA",
"BORDE","BORRA","BRISA","BROMA","BUENA","BUENO","BURRO","BUSCA","CABLE","CABRA",
"CACAO","CAIDA","CAJON","CALLE","CALMA","CALOR","CAMPO","CANAL","CANON","CANTO",
"CAPAZ","CARGA","CARNE","CARRO","CARTA","CASAS","CASCO","CAUSA","CELDA","CERCA",
"CERDO","CHICA","CHICO","CICLO","CIELO","CINCO","CINTA","CIRCO","CLARA","CLARO",
"CLASE","CLAVE","CLIMA","COBRA","COCHE","COLON","COLOR","COMER","COMUN","CONDE",
"COPAS","CORAL","CORRE","CORTA","CORTE","CORTO","COSAS","COSTA","CREAR","CREMA",
"CRUEL","CUERO","CUEVA","CULPA","CURSO","DADOS","DANZA","DATOS","DEBER","DEBIL",
"DECIR","DEDOS","DEJAR","DEUDA","DIETA","DIGNO","DISCO","DOBLE","DOLOR","DROGA",
"DUCHA","DUETO","DULCE","EBANO","ELITE","ENTRE","ENVIO","EPOCA","ERROR","ESPIA",
"EXITO","EXTRA","FACIL","FALLA","FALSO","FALTA","FAUNA","FAVOR","FECHA","FELIZ",
"FERIA","FINAL","FIRMA","FIRME","FLACO","FLORA","FLUJO","FONDO","FORMA","FOTOS",
"FRASE","FRUTA","FUEGO","FUERA","FUMAR","FURIA","GAFAS","GALLO","GANAR","GATOS",
"GENIO","GENTE","GESTO","GLOBO","GOLPE","GORDO","GRADO","GRANO","GRASA","GRAVE",
"GRUPO","GUAPA","GUAPO","GUIAR","GUION","GUSTO","HABER","HABLA","HACER","HACIA",
"HARTO","HASTA","HECHA","HECHO","HEROE","HIELO","HOGAR","HONOR","HORAS","HOTEL",
"HUESO","HUEVO","HUMOR","IDEAL","IDEAS","IGUAL","IMPAR","INDIA","JAMAS","JAPON",
"JAULA","JUEGO","JUGAR","JUNIO","JUNTA","JUNTO","JURAR","JUSTO","KILOS","LABIO",
"LADOS","LANZA","LAPIZ","LARGA","LARGO","LAVAR","LECHE","LEGAL","LEJOS","LENTO",
"LETRA","LEYES","LIBRE","LIBRO","LIDER","LINDA","LINDO","LINEA","LISTA","LISTO",
"LLAMA","LLANO","LLAVE","LLENA","LLENO","LOCAL","LUCHA","LUCIR","LUGAR","MADRE",
"MAGIA","MALTA","MANDO","MANGO","MANOS","MANTA","MAPAS","MARCA","MARCO","MASAS",
"MATAR","MAYOR","MEDIA","MEDIO","MEJOR","MENOR","MENOS","MENTE","METAL","METRO",
"MIEDO","MILES","MIRAR","MISMA","MISMO","MITAD","MONJE","MONTA","MONTE","MORAL",
"MORIR","MOVER","MOVIL","MUCHO","MUJER","MUNDO","MUSEO","NADAR","NADIE","NARIZ",
"NEGRA","NEGRO","NIEVE","NIVEL","NOBLE","NOCHE","NORTE","NOTAS","NOVIA","NOVIO",
"NUBES","NUEVA","NUEVO","NUNCA","OBRAS","OJALA","OLIVA","ORDEN","OREJA","OTRAS",
"OTROS","PADRE","PAGAR","PAPEL","PARAR","PARED","PARIS","PARTE","PASAR","PASEO",
"PASOS","PASTA","PATIO","PECHO","PEDIR","PELEA","PELOS","PERRA","PERRO","PIANO",
"PIEZA","PINTA","PISTA","PIZZA","PLANO","PLATA","PLATO","PLAYA","PLAZA","PLUMA",
"POBRE","PODER","POEMA","POLLO","POLVO","PONER","PRIMA","PRIMO","PRISA","PULSO",
"PUNTA","PUNTO","QUESO","RADAR","RADIO","RANGO","RAYAR","RAYOS","RAZON","REGLA",
"REINA","REINO","RELOJ","RENTA","RESTO","REYES","REZAR","RIFLE","RITMO","ROBAR",
"ROBOT","ROCAS","ROLLO","ROMPE","RONDA","ROSAS","RUBIA","RUEDA","RUIDO","RUMOR",
"RUSIA","SABER","SABIA","SABOR","SACAR","SALON","SALSA","SALUD","SANTA","SANTO",
"SELVA","SENAL","SENOR","SERIE","SERIO","SIETE","SIGLO","SIGUE","SILLA","SITIO",
"SOBRE","SOLAR","SUAVE","SUBIR","SUCIA","SUCIO","SUELO","SUPER","TABLA","TALLA",
"TANGO","TANTA","TANTO","TARDE","TAREA","TECHO","TECLA","TELAR","TEMER","TEMOR",
"TENER","TENIS","TIENE","TIGRE","TIRAR","TOCAR","TODAS","TODOS","TOMAR","TONTA",
"TONTO","TORRE","TOTAL","TRAGO","TRAJE","TRATA","TRATO","TRONO","TROZO","TRUCO",
"TUMBA","TUNEL","TURNO","UNICA","UNICO","UNION","USADO","USTED","VACAS","VACIA",
"VACIO","VALLE","VALOR","VAMOS","VAPOR","VECES","VELAS","VENDE","VENGA","VENIR",
"VENTA","VERDE","VIAJE","VIDAS","VIDEO","VIEJA","VIEJO","VIENE","VILLA","VIOLA",
"VIRUS","VISTA","VIVEN","VIVIR","VIVOS","VOCES","VOLAR","VUELA","ZORRA"
];

// Función de normalización
function normalize(str) {
    return str.toUpperCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/Ñ/g, "N");
}

function normalizeNoAccents(str) {
    return str.toUpperCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

// ========================
// CLASE WORDLE1V1GAME
// ========================
class Wordle1v1Game {
    constructor(roomData) {
        this.roomData = roomData;
        this.playerId = currentUser.uid;
        this.playerName = getPlayerName();
        this.isCreator = isRoomCreator;
        
        // Determinar si somos jugador 1 o 2
        this.isPlayer1 = this.isCreator;
        
        // Estado del juego
        this.currentRound = roomData.currentRound || 1;
        this.totalRounds = roomData.totalRounds;
        this.words = roomData.words || [];
        this.currentWordIndex = roomData.currentWordIndex || 0;
        this.currentWord = this.words[this.currentWordIndex] || '';
        
        // Tableros
        this.myBoard = [];
        this.boardDiv = document.getElementById('game-board');
        
        // Teclado
        this.keyMap = {};
        this.keyboardDiv = document.getElementById('keyboard');
        
        // Game state
        this.currentRow = 0;
        this.currentCol = 0;
        this.gameOver = false;
        this.roundOver = false;
        
        // UI Elements
        this.messageDiv = document.getElementById('game-message');
        this.currentRoundSpan = document.getElementById('currentRound');
        this.totalRoundsSpan = document.getElementById('totalRounds');
        this.player1NameSpan = document.getElementById('player1Name');
        this.player2NameSpan = document.getElementById('player2Name');
        this.player1PointsSpan = document.getElementById('player1Points');
        this.player2PointsSpan = document.getElementById('player2Points');
        
        this.init();
    }
    
    async init() {
        // Si no hay palabras, generarlas
        if (this.words.length === 0) {
            await this.generateWords();
        }
        
        this.updateUI();
        this.initBoards();
        this.initKeyboard();
        this.bindKeyboard();
        this.bindButtons();
        this.updateScoreboard();
    }
    
    async generateWords() {
        const shuffled = [...words].sort(() => Math.random() - 0.5);
        this.words = shuffled.slice(0, this.totalRounds);
        
        // Actualizar en Firebase
        await updateDoc(doc(db, 'wordle1v1_rooms', roomCode), {
            words: this.words,
            currentWordIndex: 0
        });
        
        this.currentWord = this.words[0];
    }
    
    updateUI() {
        this.currentRoundSpan.textContent = this.currentRound;
        this.totalRoundsSpan.textContent = this.totalRounds;
        
        // Actualizar nombres de jugadores
        if (this.roomData.player1) {
            this.player1NameSpan.textContent = this.roomData.player1.name + (this.isPlayer1 ? ' (Tú)' : '');
        }
        if (this.roomData.player2) {
            this.player2NameSpan.textContent = this.roomData.player2.name + (!this.isPlayer1 ? ' (Tú)' : '');
        }
    }
    
    initBoards() {
        // Inicializar mi tablero
        this.boardDiv.innerHTML = '';
        this.myBoard = [];
        for (let r = 0; r < 6; r++) {
            const row = [];
            for (let c = 0; c < 5; c++) {
                const tile = document.createElement('div');
                tile.classList.add('tile');
                tile.dataset.row = r;
                tile.dataset.col = c;
                this.boardDiv.appendChild(tile);
                row.push(tile);
            }
            this.myBoard.push(row);
        }
        
        // Cargar estado existente si lo hay
        this.loadBoardState();
    }
    
    initKeyboard() {
        this.keyboardDiv.innerHTML = '';
        this.keyMap = {};
        const rows = [
            ["Q","W","E","R","T","Y","U","I","O","P"],
            ["A","S","D","F","G","H","J","K","L","Ñ"],
            ["ENTER","Z","X","C","V","B","N","M","DEL"]
        ];
        rows.forEach(row => {
            const rowDiv = document.createElement('div');
            rowDiv.classList.add('key-row');
            row.forEach(k => {
                const btn = document.createElement('div');
                btn.classList.add('key');
                btn.textContent = k;
                if (k === 'ENTER' || k === 'DEL') btn.classList.add('special');
                rowDiv.appendChild(btn);
                this.keyMap[k] = btn;
                btn.addEventListener('click', () => this.handleKey(k));
            });
            this.keyboardDiv.appendChild(rowDiv);
        });
    }
    
    bindKeyboard() {
        document.addEventListener('keydown', e => {
            if (this.gameOver || this.roundOver) return;
            const raw = e.key;

            if (raw === 'Backspace' || raw === 'Delete') {
                this.handleKey('DEL');
                return;
            }
            if (raw === 'Enter') {
                e.preventDefault();
                this.handleKey('ENTER');
                return;
            }

            let key = raw.toUpperCase();
            key = key.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

            if (/^[A-ZÑ]$/.test(key)) {
                this.handleKey(key);
            }
        });
    }
    
    bindButtons() {
        document.getElementById('leaveRoomBtn').addEventListener('click', () => this.leaveRoom());
    }
    
    handleKey(key) {
        if (this.gameOver) return;
        
        // Permitir escribir si la ronda no está completa para este jugador
        // y si no hemos excedido el número máximo de intentos
        const playerKey = this.isPlayer1 ? 'player1' : 'player2';
        const playerData = this.roomData[playerKey];
        
        // Solo bloquear si la ronda está completa Y hemos excedido los intentos
        if (playerData?.roundComplete && this.currentRow >= 6) return;
        
        if (key === "ENTER") { 
            this.checkWord(); 
            return; 
        }
        if (key === "DEL") { 
            this.deleteLetter(); 
            return; 
        }
        
        // Permitir escribir si tenemos espacio en el tablero
        if (this.currentRow < 6 && this.currentCol < 5) {
            const tile = this.myBoard[this.currentRow][this.currentCol];
            tile.textContent = key;
            tile.classList.add('filled');
            this.currentCol++;
            this.saveBoardState();
        }
    }
    
    deleteLetter() {
        if (this.currentCol > 0) {
            this.currentCol--;
            const tile = this.myBoard[this.currentRow][this.currentCol];
            tile.textContent = '';
            tile.classList.remove('filled');
            this.saveBoardState();
        }
    }
    
    isValidWord(guess) {
        const norm = normalizeNoAccents(guess.toUpperCase());
        return words.includes(norm);
    }
    
    async checkWord() {
        if (this.currentCol < 5) {
            this.showMessage('✏️ Escribe 5 letras');
            return;
        }

        let guess = "";
        for (let c = 0; c < 5; c++) guess += this.myBoard[this.currentRow][c].textContent;

        if (!this.isValidWord(guess)) {
            this.showMessage('❌ Palabra no válida');
            const row = this.myBoard[this.currentRow];
            row.forEach(tile => tile.classList.add('shake'));
            setTimeout(() => row.forEach(tile => tile.classList.remove('shake')), 500);
            return;
        }

        const guessNorm = normalizeNoAccents(guess);
        const wordNorm = normalizeNoAccents(this.currentWord);

        const letterCount = {};
        for (let l of wordNorm) {
            letterCount[l] = (letterCount[l] || 0) + 1;
        }

        const results = new Array(5).fill('absent');

        // Primero: correctas
        for (let c = 0; c < 5; c++) {
            if (guessNorm[c] === wordNorm[c]) {
                results[c] = 'correct';
                letterCount[guessNorm[c]]--;
            }
        }

        // Segundo: presentes
        for (let c = 0; c < 5; c++) {
            if (results[c] === 'correct') continue;
            const letter = guessNorm[c];
            if (letterCount[letter] > 0) {
                results[c] = 'present';
                letterCount[letter]--;
            }
        }

        // Animación reveal y actualización de teclado
        for (let c = 0; c < 5; c++) {
            const tile = this.myBoard[this.currentRow][c];
            const keyChar = guess[c];
            const result = results[c];

            setTimeout(() => {
                tile.classList.add('reveal');
                setTimeout(() => {
                    tile.classList.remove('reveal');
                    tile.classList.add(result);

                    // Colorear tecla
                    const keyBtn = this.keyMap[keyChar];
                    if (keyBtn) {
                        if (result === 'correct') {
                            keyBtn.classList.remove('present', 'absent');
                            keyBtn.classList.add('correct');
                        } else if (result === 'present' && !keyBtn.classList.contains('correct')) {
                            keyBtn.classList.remove('absent');
                            keyBtn.classList.add('present');
                        } else if (!keyBtn.classList.contains('correct') && !keyBtn.classList.contains('present')) {
                            keyBtn.classList.add('absent');
                        }
                    }
                }, 300);
            }, c * 250);
        }

        // Guardar intento en Firebase
        await this.saveAttempt(guess, results);

        // Comprobación final
        setTimeout(async () => {
            if (guessNorm === wordNorm) {
                this.showMessage('¡Correcto! 🎉');
                this.roundOver = true;
                await this.endRound(true);
            } else {
                this.currentRow++;
                this.currentCol = 0;
                this.saveBoardState();
                if (this.currentRow >= 6) {
                    this.showMessage(`La palabra era: ${this.currentWord}`);
                    this.roundOver = true;
                    await this.endRound(false);
                }
            }
        }, 6 * 250 + 400);
    }
    
    async saveAttempt(guess, results) {
        const playerKey = this.isPlayer1 ? 'player1' : 'player2';
        const attempts = this.roomData[playerKey]?.attempts || [];
        
        attempts.push({
            round: this.currentRound,
            wordIndex: this.currentWordIndex,
            guess: guess,
            results: results,
            timestamp: new Date().toISOString()
        });
        
        await updateDoc(doc(db, 'wordle1v1_rooms', roomCode), {
            [`${playerKey}.attempts`]: attempts,
            [`${playerKey}.lastAttemptTime`]: serverTimestamp()
        });
    }
    
    async endRound(won) {
        const playerKey = this.isPlayer1 ? 'player1' : 'player2';
        const points = this.roomData[playerKey]?.points || 0;
        
        await updateDoc(doc(db, 'wordle1v1_rooms', roomCode), {
            [`${playerKey}.points`]: points + (won ? 1 : 0),
            [`${playerKey}.roundComplete`]: true,
            [`${playerKey}.won`]: won
        });
        
        // Esperar al otro jugador
        this.showMessage('Esperando al oponente...');
    }
    
    async nextRound() {
        this.currentRound++;
        this.currentWordIndex++;
        this.currentRow = 0;
        this.currentCol = 0;
        this.roundOver = false;  // Reset roundOver para permitir jugar la siguiente ronda
        this.gameOver = false;   // Reset gameOver también
        this.currentWord = this.words[this.currentWordIndex];
        
        // Limpiar tableros
        this.clearBoards();
        
        // Actualizar Firebase
        await updateDoc(doc(db, 'wordle1v1_rooms', roomCode), {
            currentRound: this.currentRound,
            currentWordIndex: this.currentWordIndex,
            'player1.roundComplete': false,
            'player2.roundComplete': false,
            'player1.won': null,
            'player2.won': null
        });
        
        // Actualizar roomData local inmediatamente
        this.roomData.player1.roundComplete = false;
        this.roomData.player2.roundComplete = false;
        this.roomData.player1.won = null;
        this.roomData.player2.won = null;
        
        this.updateUI();
        this.showMessage(`Ronda ${this.currentRound} - ¡A jugar!`);
    }
    
    clearBoards() {
        // Limpiar tablero
        this.myBoard.forEach(row => {
            row.forEach(tile => {
                tile.textContent = '';
                tile.className = 'tile';
            });
        });
        
        // Limpiar teclado
        Object.values(this.keyMap).forEach(btn => {
            btn.classList.remove('correct', 'present', 'absent');
        });
    }
    
    loadBoardState() {
        const playerKey = this.isPlayer1 ? 'player1' : 'player2';
        const attempts = this.roomData[playerKey]?.attempts || [];
        
        // Cargar intentos de la ronda actual
        const currentRoundAttempts = attempts.filter(a => 
            a.round === this.currentRound && a.wordIndex === this.currentWordIndex
        );
        
        // Determinar si el jugador ya completó esta ronda
        const playerData = this.roomData[playerKey];
        this.roundOver = playerData?.roundComplete || false;
        
        currentRoundAttempts.forEach((attempt, index) => {
            if (index < 6) {
                for (let c = 0; c < 5; c++) {
                    const tile = this.myBoard[index][c];
                    tile.textContent = attempt.guess[c];
                    tile.classList.add('filled', attempt.results[c]);
                    
                    // Actualizar teclado
                    const keyBtn = this.keyMap[attempt.guess[c]];
                    if (keyBtn) {
                        if (attempt.results[c] === 'correct') {
                            keyBtn.classList.remove('present', 'absent');
                            keyBtn.classList.add('correct');
                        } else if (attempt.results[c] === 'present' && !keyBtn.classList.contains('correct')) {
                            keyBtn.classList.remove('absent');
                            keyBtn.classList.add('present');
                        } else if (!keyBtn.classList.contains('correct') && !keyBtn.classList.contains('present')) {
                            keyBtn.classList.add('absent');
                        }
                    }
                }
                this.currentRow = index + 1;
            }
        });
        
        // Solo resetear currentCol si no hemos completado la ronda
        if (!this.roundOver) {
            this.currentCol = this.currentRow < 6 ? 0 : 0;
        }
    }
    
    saveBoardState() {
        // El estado se guarda automáticamente en Firebase con cada intento
    }
    
    updateScoreboard() {
        const p1Points = this.roomData.player1?.points || 0;
        const p2Points = this.roomData.player2?.points || 0;
        
        this.player1PointsSpan.textContent = p1Points;
        this.player2PointsSpan.textContent = p2Points;
    }
    
    showMessage(msg) {
        this.messageDiv.textContent = msg;
    }
    
    async leaveRoom() {
        if (confirm('¿Estás seguro de que quieres salir de la sala?')) {
            await this.deleteRoom();
            window.location.href = 'index.html';
        }
    }
    
    async deleteRoom() {
        try {
            await deleteDoc(doc(db, 'wordle1v1_rooms', roomCode));
        } catch (error) {
            console.error('Error deleting room:', error);
        }
    }
}

// ========================
// FUNCIONES DE SALA
// ========================
function generateRoomCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

async function createRoom() {
    const rounds = parseInt(document.getElementById('roundsSelect').value);
    const code = generateRoomCode();
    
    try {
        await setDoc(doc(db, 'wordle1v1_rooms', code), {
            createdBy: currentUser.uid,
            createdAt: serverTimestamp(),
            totalRounds: rounds,
            currentRound: 1,
            currentWordIndex: 0,
            words: [],
            player1: {
                uid: currentUser.uid,
                name: getPlayerName(),
                points: 0,
                attempts: [],
                roundComplete: false,
                won: null
            },
            player2: null,
            gameStarted: false
        });
        
        roomCode = code;
        isRoomCreator = true;
        currentRoom = code;
        
        document.getElementById('generatedCode').textContent = code;
        document.getElementById('roomCodeDisplay').style.display = 'block';
        document.getElementById('createRoomBtn').disabled = true;
        document.getElementById('joinRoomBtn').disabled = true;
        
        // Escuchar cambios en la sala
        listenToRoom(code);
        
        document.getElementById('roomStatus').textContent = '🕐 Esperando oponente...';
        
    } catch (error) {
        console.error('Error creating room:', error);
        document.getElementById('roomStatus').textContent = '❌ Error al crear la sala';
    }
}

async function joinRoom() {
    const code = document.getElementById('joinCodeInput').value.toUpperCase();
    
    if (!code || code.length !== 6) {
        document.getElementById('roomStatus').textContent = '❌ Código de sala inválido';
        return;
    }
    
    try {
        const roomDoc = await getDoc(doc(db, 'wordle1v1_rooms', code));
        
        if (!roomDoc.exists()) {
            document.getElementById('roomStatus').textContent = '❌ La sala no existe';
            return;
        }
        
        const roomData = roomDoc.data();
        
        if (roomData.player2) {
            document.getElementById('roomStatus').textContent = '❌ La sala está llena';
            return;
        }
        
        // Unirse a la sala
        await updateDoc(doc(db, 'wordle1v1_rooms', code), {
            player2: {
                uid: currentUser.uid,
                name: getPlayerName(),
                points: 0,
                attempts: [],
                roundComplete: false,
                won: null
            },
            gameStarted: true
        });
        
        roomCode = code;
        isRoomCreator = false;
        currentRoom = code;
        
        // Escuchar cambios en la sala
        listenToRoom(code);
        
    } catch (error) {
        console.error('Error joining room:', error);
        document.getElementById('roomStatus').textContent = '❌ Error al unirse a la sala';
    }
}

function listenToRoom(code) {
    const unsubscribe = onSnapshot(doc(db, 'wordle1v1_rooms', code), (doc) => {
        if (!doc.exists()) {
            document.getElementById('roomStatus').textContent = '❌ La sala ha sido eliminada';
            return;
        }
        
        const roomData = doc.data();
        
        // Si ambos jugadores están en la sala y el juego ha comenzado
        if (roomData.player1 && roomData.player2 && roomData.gameStarted) {
            // Cambiar a pantalla de juego
            roomScreen.classList.remove('active');
            gameScreen.classList.add('active');
            
            // Inicializar juego
            if (!gameInstance) {
                gameInstance = new Wordle1v1Game(roomData);
            } else {
                gameInstance.roomData = roomData;
                gameInstance.updateUI();
                gameInstance.updateScoreboard();
                
                // Actualizar estado de ronda del jugador actual
                const playerKey = gameInstance.isPlayer1 ? 'player1' : 'player2';
                const playerData = roomData[playerKey];
                gameInstance.roundOver = playerData?.roundComplete || false;
                
                // Verificar si ambos jugadores completaron la ronda
                checkRoundComplete(roomData);
            }
        }
    });
}

async function checkRoundComplete(roomData) {
    if (roomData.player1?.roundComplete && roomData.player2?.roundComplete) {
        // Ambos jugadores completaron la ronda
        setTimeout(async () => {
            if (gameInstance.currentRound < gameInstance.totalRounds) {
                await gameInstance.nextRound();
            } else {
                // El juego ha terminado
                await endGame(roomData);
            }
        }, 2000);
    }
}

async function endGame(roomData) {
    const p1Points = roomData.player1?.points || 0;
    const p2Points = roomData.player2?.points || 0;
    
    let winner = '';
    let winnerPoints = 0;
    
    if (p1Points > p2Points) {
        winner = roomData.player1.name;
        winnerPoints = p1Points;
    } else if (p2Points > p1Points) {
        winner = roomData.player2.name;
        winnerPoints = p2Points;
    } else {
        winner = 'Empate';
        winnerPoints = p1Points;
    }
    
    // Actualizar ranking del ganador
    if (winner !== 'Empate') {
        await updateRanking(winner, winnerPoints);
    }
    
    // Mostrar pantalla de resultados
    gameScreen.classList.remove('active');
    resultsScreen.classList.add('active');
    
    document.getElementById('winnerName').textContent = winner;
    document.getElementById('winnerPoints').textContent = `${winnerPoints} puntos`;
    
    // Eliminar sala
    setTimeout(async () => {
        try {
            await deleteDoc(doc(db, 'wordle1v1_rooms', roomCode));
        } catch (error) {
            console.error('Error deleting room:', error);
        }
    }, 5000);
}

async function updateRanking(playerName, points) {
    try {
        const rankingDoc = await getDoc(doc(db, 'ranking_wordle1v1', playerName));
        const currentData = rankingDoc.exists() ? rankingDoc.data() : { points: 0, wins: 0 };
        
        await setDoc(doc(db, 'ranking_wordle1v1', playerName), {
            name: playerName,
            points: currentData.points + points,
            wins: currentData.wins + 1,
            lastPlayed: serverTimestamp()
        });
    } catch (error) {
        console.error('Error updating ranking:', error);
    }
}

// ========================
// INICIALIZACIÓN
// ========================
async function init() {
    currentUser = await waitForUser();
    
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }
    
    // Event listeners
    document.getElementById('createRoomBtn').addEventListener('click', createRoom);
    document.getElementById('joinRoomBtn').addEventListener('click', joinRoom);
    document.getElementById('copyCodeBtn').addEventListener('click', copyRoomCode);
    document.getElementById('backToMenuBtn').addEventListener('click', () => {
        window.location.href = 'index.html';
    });
    document.getElementById('backToMenuBtn2').addEventListener('click', () => {
        window.location.href = 'index.html';
    });
    document.getElementById('playAgainBtn').addEventListener('click', () => {
        location.reload();
    });
    
    // Mostrar pantalla de sala
    roomScreen.classList.add('active');
}

function copyRoomCode() {
    const code = document.getElementById('generatedCode').textContent;
    navigator.clipboard.writeText(code).then(() => {
        const btn = document.getElementById('copyCodeBtn');
        const originalText = btn.textContent;
        btn.textContent = '✅ Copiado';
        setTimeout(() => {
            btn.textContent = originalText;
        }, 2000);
    });
}

// Iniciar aplicación
init();
