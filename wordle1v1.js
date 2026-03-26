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
"VIRUS","VISTA","VIVEN","VIVIR","VIVOS","VOCES","VOLAR","VUELA","ZORRA",
"sobre","entre","habia","hasta","desde","puede","todos","parte","tiene","donde",
"mismo","ahora","otros","tanto","segun","menos","mundo","antes","forma","hacer",
"estos","mayor","hacia","ellos","hecho","mucho","quien","estan","lugar","otras",
"mejor","nuevo","decir","todas","luego","medio","estas","tenia","nunca","poder",
"veces","grupo","misma","nueva","mujer","cosas","tener","punto","noche","haber",
"fuera","usted","nadie","horas","tarde","estar","padre","gente","final","madre",
"cinco","siglo","meses","maria","seria","junto","aquel","dicho","casos","manos",
"nivel","podia","largo","falta","hemos","trata","algun","senor","claro","orden",
"buena","libro","igual","ellas","total","tengo","unico","pesar","calle","vista",
"campo","saber","obras","razon","ninos","estoy","quien","fondo","papel","demas",
"ambos","salud","media","deben","datos","julio","visto","llego","bueno","joven",
"hacia","sigue","cerca","valor","serie","hijos","juego","epoca","banco","menor",
"pasar","queda","hacen","resto","causa","vamos","apoyo","civil","pedro","libre",
"comun","dejar","salir","union","favor","clase","color","decia","quiza","unica",
"pueda","lleva","ayuda","donde","autor","suelo","viejo","tomar","siete","lucha",
"linea","pocos","norte","cargo","plaza","poner","viene","radio","puedo","amigo",
"habra","santa","sabia","viaje","vivir","quedo","exito","carta","miedo","negro",
"texto","mitad","fecha","seran","ideas","llega","lejos","facil","plazo","enero",
"atras","chile","fuego","costa","local","habla","tales","sueno","paris","capaz",
"podra","dolor","zonas","temas","junio","marco","mucha","dicen","busca","abril",
"lopez","armas","debia","grado","carne","llama","jorge","corte","etapa","tipos",
"deseo","marzo","jamas","curso","pablo","larga","lider","torno","somos","cielo",
"ambas","perez","doble","crear","casas","lista","leyes","jesus","grave","tenga",
"lunes","junta","estos","sitio","gusta","clara","moral","gusto","hotel","salio",
"nueve","abajo","estas","venta","ramon","aires","aguas","dicha","golpe","pobre",
"llevo","coche","leche","tarea","plata","dando","ganar","calor","suele","miles",
"ritmo","pasos","pesos","plano","jugar","gesto","vasco","gomez","pocas","verde",
"pidio","comer","fines","labor","justo","actos","museo","pagar","sabes","areas",
"santo","vieja","mario","reina","salvo","quiso","acaba","marca","pleno","brazo",
"acaso","error","seres","poeta","altos","hojas","darle","clave","votos","logro",
"sirve","deuda","feliz","tanta","mente","breve","firma","jaime","canal","conde",
"carga","reyes","abrir","cuyos","negra","morir","caida","banda","frase","bases",
"culpa","entra","hayan","diego","actor","sacar","murio","estas","saben","corto",
"david","salon","cifra","bolsa","fuese","serio","reino","plena","venia","aznar",
"legal","abrio","china","dedos","creer","voces","angel","temor","penso","dudas",
"lleno","vacio","ciclo","valle","llamo","pecho","honor","pedir","mirar","clima",
"punta","posee","entro","pacto","penal","llena","angel","disco","ideal","artes",
"villa","venir","miami","ruido","basta","tabla","avion","cuyas","hablo","humor",
"darse","ganas","dosis","altas","pared","perro","anade","viven","debio","hogar",
"pieza","firme","exige","polvo","luces","virus","nacio","animo","cesar","gasto",
"pausa","esten","playa","horno","japon","anual","norma","tomas","dulce","mando",
"chica","unido","acabo","solar","costo","tesis","toros","ocupa","patio","corta",
"senal","paseo","arena","dejan","barco","signo","arbol","vemos","oscar","pista",
"marta","modos","desea","pasan","vuelo","silla","chico","conto","feria","rueda",
"verse","hecha","ponen","rojas","matar","motor","rumbo","trato","pense","creia",
"borde","metro","creen","dueno","bajar","rusia","vidas","subir","droga","bajas",
"jefes","vivia","reloj","elena","danza","notas","suave","fotos","masas","arroz",
"islas","goles","fruto","torre","salas","vital","sabor","tasas","dieta","andar",
"pilar","rival","traje","techo","diria","ricos","salsa","amiga","haria","vivos",
"fidel","india","tocar","bajos","malos","oeste","rural","nariz","letra","logra",
"opera","acido","banca","canto","debil","plato","monte","etica","salen","pujol",
"danos","salto","moscu","bomba","surge","oreja","munoz","xviii","calma","baile",
"queso","mueve","euros","coste","ronda","kilos","rigor","ponia","cerro","palma",
"turno","grito","deber","ramas","lento","beber","actua","senti","salia","caido",
"huevo","corre","juega","trato","vigor","redes","venga","hagan","bella","daban",
"sufre","luisa","regla","poema","limon","dolar","crees","renta","prima","prisa",
"cajas","novia","caras","verlo","nieve","lados","rubio","echar","quede","suiza",
"socio","piano","otono","leido","prado","halla","jordi","grasa","menem","parar",
"unida","irene","nubes","dices","lanzo","pesca","solos","selva","falso","aquel",
"chino","adios","suyos","culto","guion","niega","envio","crema","situa","filas",
"nunez","balon","muere","hijas","lucia","ramos","felix","laura","ninas","malas",
"vivio","arias","pagos","caldo","serlo","quito","rayos","josep","ancho","aerea",
"duque","genes","piden","sofia","trece","penas","viuda","mesas","fallo","barra",
"primo","suena","grito","toman","preve","colon","crece","heroe","rocas","lenta",
"llave","haces","ajeno","hielo","drama","rango","toque","solas","subio","juana",
"solia","minas","lanza","rojos","fases","arabe","falsa","james","verla","metal",
"reves","ortiz","silva","evita","ruben","listo","fraga","nacer","seria","indio",
"pasta","parto","aviso","filme","pollo","duras","noble","bello","vidal","pelea",
"rabia","cinta","muros","copia","cuota","tramo","barro","cadiz","haran","ponga",
"carro","flujo","hueso","duros","tumba","diana","medir","presa","apoya","video",
"volvi","movil","trama","tenis","vayan","llevo","creyo","sexto","bahia","vinos",
"rosas","trajo","cobre","recta","oliva","patas","novio","justa","barba","acero",
"genio","vapor","curva","trate","diera","viena","cable","ciego","abuso","cuero",
"fruta","cerro","bravo","lucas","traer","bordo","negar","notar","vimos","oidos",
"julia","ojala","quita","serra","finca","gordo","vasos","trigo","preso","pedia",
"acusa","mando","opera","peter","sudor","peces","riego","sento","simon","hueco",
"citar","monto","acuso","asilo","nieto","falla","magia","flota","broma","copas",
"ajena","meter","vasca","votar","cubre","pisos","video","cerdo","capas","crudo",
"press","logro","rodea","quise","miran","milan","mateo","metio","boton","censo",
"daria","calvo","veian","golfo","males","maria","tiros","obvio","peron","mover",
"duelo","fijar","busco","reune","damas","lecho","gotas","cruel","metas","vease",
"rumor","casco","celda","fumar","vacia","litro","ondas","nobel","manda","aldea",
"locos","gases","quede","salga","smith","usado","digno","marco","placa","costo",
"aereo","cenar","traia","bruto","lleve","trago","papas","sabio","volar","rusos",
"pluma","risas","crean","hablo","opina","debes","asume","grano","pulso","fatal",
"gafas","vende","lagos","tirar","abria","firmo","naval","digna","amado","aguda",
"varon","ropas","tunel","circo","natal","queja","fibra","sello","causo","vacas",
"rompe","darme","coger","verme","falda","autos","ocupo","pardo","ceder","canta",
"celos","cobra","corea","saint","varia","envio","rubia","furia","lidia","trozo",
"coral","talla","viste","bonos","duran","pagan","hondo","judio","vivas","freud",
"abren","rivas","ariel","dadas","gallo","sobra","salta","fauna","duele","grita",
"joyas","barca","dados","suyas","tardo","cogio","sucia","altar","venus","henry",
"flora","ponce","urnas","marin","roque","rutas","times","macho","rasgo","frank",
"marti","lazos","saldo","acabo","vengo","aroma","plomo","cesar","tonto","botas",
"globo","formo","sutil","viera","veras","anton","sonar","trono","digas","veras",
"almas","agudo","duena","cruce","movia","orina","river","tenor","palos","pelos",
"pares","gusto","marte","naves","pongo","viajo","buque","sumar","eleva","sales",
"roman","lorca","ayudo","gorda","cesid","raton","harto","llamo","secas","jones",
"secos","ninez","sirva","huida","jerez","cueva","sexta","suman","velez","damos",
"senas","verso","hagas","hable","sucio","verle","dario","fijos","lavar","viaja",
"citas","mitos","cajon","jamon","gatos","linda","vejez","dejen","quito","lapso",
"paula","ancha","sonar","tonos","velas","emite","ciega","rioja","ratos","actuo",
"faena","feroz","bruno","movio","acude","girar","sainz","daran","ficha","apoyo",
"pinta","belga","cruzo","multa","camas","colmo","bares","cobro","acoso","tomas",
"banos","plana","prosa","haiti","ruina","besos","susto","manta","diosa","anoto",
"tropa","yendo","latin","cruza","frias","valia","libra","acera","digan","tinta",
"mares","celta","miras","album","rocio","tazas","extra","opone","porta","arcos",
"temia","gozar","aleja","frios","andan","ritos","telon","toreo","mapas","tokio",
"bolso","honda","llora","quedo","veran","calla","salto","nomas","tigre","verte",
"etico","venas","hilos","manga","fabio","paulo","yemas","envia","llano","traen",
"elias","pinos","corto","manto","mutua","burla","mixta","optar","becas","saenz",
"salvo","curar","fundo","soria","tacto","nacen","freno","sigan","tango","ratas",
"brown","texas","molde","balas","himno","sodio","lleno","razas","ligas","mejia",
"solto","bodas","andes","ricas","cauce","gijon","ayala","sexos","turco","alude",
"aulas","pekin","falto","focos","puros","aguja","dudar","galan","guapa","otero",
"brisa","leves","senos","lindo","finas","tribu","vicio","usaba","cerco","suizo",
"boxeo","huele","renfe","liano","jaula","louis","nacho","celia","temen","verbo",
"tibia","bando","mutuo","recto","anexo","cejas","rodar","cabia","tumor","flaco",
"narra","curas","telas","vocal","botin","debut","temer","canon","durar","parra",
"subia","ganan","cocer","mitin","funda","berta","raras","trapo","marea","sabra",
"guapo","avila","helms","torpe","resta","davis","hable","opino","veria","asoma",
"podre","quema","fugaz","guias","senda","comen","elige","vayas","betis","robar",
"lunar","xunta","entre","peste","tonta","llame","lapiz","mafia","segui","salva",
"situo","lucio","batir","cedio","beach","films","jabon","ruedo","tubos","ruego",
"belen","pasto","bolas","grand","pugna","roger","amada","tomen","bacon","sordo",
"amaba"
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
        
        // Crear set de palabras válidas (como en wordle.js)
        this.validWordsSet = new Set(words.map(w => normalizeNoAccents(w)).filter(w => w.length === 5));
        
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
        // Si no hay palabras, esperar a que el creador las genere
        if (this.words.length === 0) {
            if (this.isCreator) {
                await this.generateWords();
            } else {
                // Si no es el creador, esperar a que las palabras se generen
                this.showMessage('⏳ Esperando a que el creador configure las palabras...');
            }
        } else {
            // Configurar palabras para este jugador (orden diferente)
            this.setupPlayerWords();
        }
        
        this.updateUI();
        this.initBoards();
        this.initKeyboard();
        this.bindKeyboard();
        this.bindButtons();
        this.updateScoreboard();
    }
    
    async generateWords() {
        // Generar palabras para la sala
        const shuffled = [...words].sort(() => Math.random() - 0.5);
        this.words = shuffled.slice(0, this.totalRounds);
        
        // Actualizar en Firebase
        await updateDoc(doc(db, 'wordle1v1_rooms', roomCode), {
            words: this.words,
            currentWordIndex: 0
        });
        
        // Configurar palabras para este jugador
        this.setupPlayerWords();
    }
    
    setupPlayerWords() {
        // Crear orden específico para este jugador
        const baseWords = [...this.words];
        
        if (this.isPlayer1) {
            // Jugador 1: usar orden original
            this.playerWords = baseWords;
        } else {
            // Jugador 2: usar orden diferente (rotar)
            this.playerWords = [...baseWords.slice(1), baseWords[0]];
        }
        
        // Establecer palabra actual según la ronda actual
        this.currentWord = this.playerWords[this.currentRound - 1] || '';
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
        return this.validWordsSet.has(norm);
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
        
        // Usar palabra específica del jugador para esta ronda
        this.currentWord = this.playerWords[this.currentRound - 1] || '';
        
        // Limpiar tableros
        this.clearBoards();
        
        // Actualizar Firebase
        await updateDoc(doc(db, 'wordle1v1_rooms', roomCode), {
            currentRound: this.currentRound,
            currentWordIndex: this.currentWordIndex
        });
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
                
                // Actualizar palabras si es necesario
                if (roomData.words && roomData.words.length > 0) {
                    gameInstance.words = roomData.words;
                    gameInstance.setupPlayerWords();
                }
                
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
