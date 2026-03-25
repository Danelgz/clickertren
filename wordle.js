// ============================================================
// wordle.js — con guardado en Firestore por usuario
// ============================================================
import { db, waitForUser, getPlayerName }
    from "./firebase-config.js";
import {
    doc, getDoc, setDoc, serverTimestamp
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

// _currentUser se asigna en init() tras esperar a Firebase Auth
let _currentUser = null;

// ========================
// PALABRAS SECRETAS
// ========================
const words = [

];
    "ABABA","ABADA","ABAIS","ABALO","ABANA","ABANO","ABARA","ABATE","ABATI","ABECE",
"ABEJA","ABETO","ABOBA","ABOCA","ABOCO","ABOGA","ABOGO","ABONO","ABOYA","ABRAN",
"ABRAS","ABRIA","ABRIO","ABUSO","ACABA","ACABE","ACABO","ACASO","ACATA","ACATE",
"ACATO","ACEDE","ACEDO","ACERA","ACIAL","ACIMA","ACIMO","ACINA","ACOSA","ACOSE",
"ACOSO","ACOTA","ACOTE","ACOTO","ACRES","ACTUA","ACUDE","ACUDI","ACUEO","ACUNA",
"ACUNE","ACUNO","ADALA","ADAMA","ADAME","ADEMO","ADENA","ADIAS","ADIOS","ADOBE",
"ADONA","ADONE","ADONO","ADORA","ADORE","ADORO","ADULT","AFANA","AFANE","AFANO",
"AFEAR","AFEAS","AFEEN","AFILA","AFILE","AFILO","AFINA","AFINE","AFINO","AFUFA",
"AGAFO","AGAVE","AGITA","AGITE","AGITO","AGORA","AGOTE","AGOTO","AGRAZ","AGRIA",
"AGRIE","AGRIO","AGUDA","AGUDO","AGULA","AGUNA","AHITA","AHITE","AHITO","AHOGA",
"AHOGO","AHOYA","AHOYE","AHOYO","AHUMA","AHUMO","AIREA","AIREE","AIREO","AIRES",
"AJADA","AJADO","AJAJA","AJEAR","AJEAS","AJEEN","AJETE","AJOBA","AJOBE","AJOBO",
"AJORA","AJORE","AJORO","AJUAR","ALABA","ALABE","ALABO","ALADA","ALADO","ALAFA",
"ALAGA","ALAGO","ALAJA","ALAMO","ALANA","ALANO","ALAZO","ALBAL","ALBAS","ALBUR",
"ALELA","ALELE","ALELO","ALENA","ALENO","ALERO","ALEVE","ALGOS","ALIJA","ALIJE",
"ALIJO","ALIMA","ALIMO","ALINA","ALINE","ALINO","ALISO","ALITA","ALITE","ALITO",
"ALIZA","ALMAS","ALOBA","ALOBE","ALOBO","ALOCA","ALOCO","ALOJA","ALOJE","ALOJO",
"ALONA","ALOSA","ALOTA","ALOTE","ALOTO","ALOYA","ALTAR","ALTEA","ALTEE","ALTEO",
"ALTOR","ALTOS","ALUDA","ALUDE","ALUDI","ALUDO","ALURA","ALZAR","ALZAS","AMAGA",
"AMAGO","AMANE","AMANO","AMARA","AMARE","AMARO","AMASE","AMASO","AMEBA","AMELE",
"AMELO","AMENA","AMENO","AMINA","AMINE","AMINO","AMITO","AMOJA","AMOJE","AMOJO",
"AMOLA","AMOLE","AMOLO","AMONA","AMONE","AMONO","AMORA","AMORE","AMORO","AMUGA",
"ANAFE","ANCAS","ANCHO","ANCON","ANEAS","ANEJA","ANEJO","ANELA","ANELE","ANELO",
"ANERO","ANETO","ANGAS","ANIMA","ANIME","ANION","ANITO","ANODA","ANODE","ANODO",
"ANOJA","ANOJE","ANOJO","ANONA","ANORE","ANORO","ANSIA","ANSIO","ANUAL","ANUDA",
"ANUDE","ANUDO","APAGA","APAGO","APANA","APARE","APARO","APATA","APATE","APATO",
"APELA","APELE","APELO","APENA","APENE","APENO","APERO","APICE","APILA","APILE",
"APILO","APINA","APINE","APINO","APOCA","APOCO","APODA","APODE","APOSA","APOSE",
"APOSO","APOYA","APOYE","APOYO","APURA","APURE","APURO","AQUEL","ARABE","ARCAS",
"ARDEA","ARDEO","AREAS","ARELO","AREPA","ARGOT","ARIDA","ARIDO","ARILO","ARIMA",
"ARIME","ARIMO","ARION","AROCA","AROCO","AROLA","AROLE","AROLO","ARONA","ARONE",
"AROSA","ARRAS","ARREO","ARRIA","ARRIE","ARRIO","ASABA","ASAIS","ASARA","ASARE",
"ASARO","ASASE","ASILA","ASILE","ASINO","ASOMA","ASOME","ASOMO","ASONA","ASONE",
"ASONO","ASORA","ASORO","ASTIL","ATACA","ATACO","ATAJA","ATAJE","ATAJO","ATALA",
"ATANE","ATANO","ATARA","ATARE","ATARO","ATISE","ATISO","ATOBA","ATOBE","ATOBO",
"ATOCA","ATOCO","ATOJA","ATOJE","ATOJO","ATOLA","ATOLE","ATOLO","ATONA","ATONE",
"ATONO","ATORA","ATORE","ATORO","ATRAE","ATRAS","ATRIL","ATROZ","ATUSA","ATUSE",
"ATUSO","AVARA","AVARO","AVEZA","AVIDA","AVIDO","AVISA","AVISE","AYUNA","AYUNE",
"AYUNO","AZADA","AZARE","AZUZA",
"BABAS","BABEO","BABIA","BABOR","BACAL","BACHE","BACIA","BADEA","BAGRE","BAJAS",
"BAJEN","BAJEL","BAJOS","BALAS","BALDA","BALDE","BALDO","BALEO","BALIN","BALSA",
"BANAL","BANCA","BANDO","BANIO","BANJO","BANZA","BARBA","BARBO","BARDA","BARDO",
"BARON","BASTE","BASTO","BATAN","BATEA","BATEL","BATIR","BATON","BAYAR","BAYAS",
"BAZAR","BEATA","BEATO","BEBAS","BEBIO","BELAR","BELEN","BELIO","BERMA","BERRO",
"BESEN","BESES","BESOS","BETEL","BETAS","BIELA","BILIS","BIRLA","BIRLE","BIRLO",
"BISON","BITOR","BIZCA","BIZCO","BLEDO","BOCAL","BOCAS","BOCEL","BOCIO","BODAS",
"BOLDO","BOLES","BOLLO","BOLOS","BOLSO","BONOS","BONUS","BORAX","BORCO","BORDO",
"BORON","BORSA","BOSAR","BOTAS","BOTAR","BOTON","BOXEO","BRACO","BRAGA","BREZO",
"BRIDA","BRIOS","BROCA","BROTE","BROZA","BRUJA","BRUJE","BRUJO","BRUMA","BRUTA",
"BRUTO","BUDIN","BUHOS","BULLE","BULLO","BUNIO","BUQUE","BUREO","BURGO","BURIL",
"BURLA","BURLE","BURLO","BURON","BUSCO","BUZON",
"CABAL","CABAS","CABIO","CACHA","CACHO","CACTO","CAFRE","CAIGO","CAITA","CALCA",
"CALCE","CALCO","CALEO","CALME","CALMO","CALVA","CALVO","CAMPA","CAMPE","CANJE",
"CANOA","CAPON","CAPAS","CAPEA","CAPEO","CAPIS","CAPIZ","CAPSA","CARAY","CAREO",
"CARIA","CARIO","CARPA","CARPE","CARPO","CAUCE","CAUDA","CAVAR","CAVAS","CAVIA",
"CAVIO","CEBON","CEBRA","CEDER","CEDES","CEDIO","CEDRO","CEJAS","CELOS","CENCA",
"CENSO","CERAS","CERCO","CEROS","CIENO","CIFRA","CIFRE","CIFRO","CITAR","CITAS",
"CIVIL","CLAMA","CLAME","CLAMO","CLERO","CLONE","CLONO","CLUBS","COCAR","COCER",
"COCES","COCIO","CODOS","COFIA","COGER","COIMA","COLAR","COLEO","COLES","COLMO",
"COLPA","COLPE","COLPO","COLZA","COMAL","COMBA","COMBI","COMIO","COMPA","CONDE",
"CONGA","COPAR","COPAS","COPEA","COPEO","COPLA","COPRA","COQUE","CORBA","COREA",
"CORON","CORZO","COSCO","COSME","COSTE","COYOL","COZON","CRASA","CRASO","CRECE",
"CRECI","CREDO","CRIBO","CRIOL","CROCA","CROCO","CRUCE","CRUDA","CRUDO","CRUZA",
"CRUZE","CUAJO","CUASI","CUNEA","CUNIA","CUNIR","CUOTA","CURDA","CURDO","CURSA",
"CURSE",
"DAGAS","DALAS","DAMAR","DARDO","DATAR","DAUCO","DECAN","DECIA","DECOR","DEJON",
"DELTA","DEMAS","DENSO","DESEA","DESEE","DESEO","DIANA","DICHA","DICHO","DICTO",
"DIERA","DIGAN","DIGAS","DIMAS","DIODO","DIQUE","DIUCA","DIZMO","DOBLA","DOLCE",
"DOLIA","DOPAR","DORAD","DORSO","DOTAR","DRAGO","DRENA","DRENE","DRENO","DRONE",
"DUDAR","DUELO","DURAR","DUROS",
"ECHAR","EDEMA","EGIDA","EMANA","EMANE","EMANO","EMITA","EMITE","EMITO","ENEMA",
"ENOJA","ENOJE","ENOJO","ERIZO","ERRAR","ERRAS","ERREN","ERRES","ETAPA","ETICA",
"ETICO","EVOCA","EVOCE","EVOCO",
"FABLA","FALCA","FANAL","FANGO","FANON","FAROL","FARSA","FASTO","FECAL","FECHO",
"FEBLE","FELON","FEROZ","FEUDO","FIBRA","FIDEO","FIGOS","FINJO","FISCO","FISGA",
"FISGO","FITAS","FLAMA","FLAME","FLAMO","FLETE","FOLIO","FOLLO","FONAL","FONJE",
"FONJO","FOQUE","FORJA","FORJE","FORJO","FORRO","FORZO","FOTON","FRAGA","FRAGO",
"FRENO","FRESA","FRESO","FRIOL","FRISA","FRISE","FRISO","FROCE","FROGA","FUDRE",
"FUNDA","FUNDE","FUNDI","FUNDO","FUROR",
"GABAS","GAITA","GALGA","GALGO","GALIO","GALOP","GAMBA","GARBA","GARBO","GARRA",
"GATAS","GAZAP","GEMIR","GIBAR","GIRAN","GIRAR","GIRON","GLERA","GLOSA","GLOSE",
"GLOSO","GOCHO","GOLFA","GOLFO","GOLLA","GOZAN","GOZAR","GRABA","GRABE","GRABO",
"GRIMA","GRIPE","GRIPO","GROSA","GRUMO","GRUTA","GUABA","GUACO","GUADA","GUATA",
"GUBIA","GUECO","GUEDA","GUETO","GUIJA","GUIJE","GUIJO","GUILA","GUILE","GUILO",
"GUIMA","GUISA","GUISE","GUISO","GURDA","GURDO","GURPA",
"HABAR","HACHA","HACHE","HACHO","HADAR","HALDA","HALAR","HAMPA","HARBA","HARPA",
"HARPO","HIENA","HILAR","HIMEN","HIMNO","HIPON","HISAR","HOLCO","HOLGA","HOLGO",
"HONRA","HONRE","HONRO","HOSCA","HOSCO","HUMAN","HUMAR","HURTA","HURTE","HURTO",
"IBERA","IBERO","ICONO","ILEON","IMAGO","INDIO","INDUE","INFLA","INFLE","INFLO",
"INSTA","INSTE","INSTO","INVAR","ISCAR","ISLOT",
"JALAR","JALCA","JALEO","JALMA","JAMBA","JAMBO","JAREA","JAREO","JARRA","JARRO",
"JASPE","JEQUE","JERBO","JINCA","JINCO","JINGO","JIOTE","JODAR","JODEN","JODES",
"JODIO","JODON","JOPAR","JORON","JOVAR","JUBAS","JUGAD","JUGAS","JULIA","JUMAR",
"JUNCA","JUNCO","JUREL",
"LACAR","LACAS","LACEN","LACES","LACER","LACRA","LACRE","LACRO","LACTE","LACTO",
"LADAR","LADEN","LADOR","LADRA","LADRE","LADRO","LAICA","LAICO","LAIDO","LANAR",
"LANCE","LANCO","LANDE","LANGA","LAQUE","LARAR","LARDE","LARDO","LAUCA","LAUCO",
"LAUDE","LAUDO","LEBRA","LEGAN","LEGAR","LEGON","LENCA","LENCO","LEPRA","LEVAD",
"LEVAR","LEVAS","LEXIA","LIBAR","LIBON","LICAR","LICOR","LIGAN","LIGAR","LIGUE",
"LIMAN","LIMAR","LIMON","LITRO","LOBOS","LOCAR","LOGRA","LOGRE","LOGRO","LORAN",
"LORZA","LOSAS","LOTES","LUCRO","LUMIA","LUMIO","LUNAS","LUPIA","LUPUS","LUTOS",
"MACAS","MACEO","MACER","MACES","MACHA","MACHE","MACHO","MACOA","MAFIA","MAGRO",
"MAJAR","MAJAS","MALEO","MARES","MARTA","MARTE","MASAR","MARZO","MATAN","MAUCA",
"MAURA","MAZAN","MECEN","MECER","MECES","MECIO","MEDID","MEDIR","MEIGA","MEIGO",
"MELAN","MELAR","MELIO","MELSA","MERAR","MERAN","MERMA","MERME","MEZCA","MEZCO",
"MIERA","MIGAR","MIRLA","MIRLO","MISCO","MOCAR","MOCER","MOCES","MOCIO","MOHON",
"MOJON","MOLDE","MOLER","MOLES","MOLIO","MOLLE","MOLON","MONAR","MONDA","MONDE",
"MONDO","MORAN","MORAR","MORAZ","MORBO","MORCO","MORRA","MORRO","MORSA","MORSE",
"MOSTO","MOTIS","MOVIA","MOZOS","MUGIR","MUGIO","MULTA","MUSCA","MUSGO","MUTIS",
"NABAL","NABAN","NABAR","NABAS","NABOA","NACAS","NACEN","NACER","NACES","NACIB",
"NACIO","NACOS","NAFRA","NAGUA","NAPAR","NAPAS","NARDO","NARES","NARRA","NARRE",
"NARRO","NASAR","NASAS","NECAR","NECEA","NECIO","NELAR","NEMOS","NERON","NETOS",
"NEVAR","NIMBA","NIMBE","NIMBO","NINFA","NITOR","NOCAR","NODAL","NODOS","NOGAL",
"NOPAL","NORMA","NOVAR","NOVAS","NOVEL","NUBLE","NUBLO","NUCAS","NULAS","NULOS",
"NUTRI","NUTRA","NUTRE",
"OBESA","OBESO","OBRAR","OBSTA","OBSTE","OBSTO","OCENA","OCOTE","OCRES","ODIAR",
"ODIAS","ODIOS","OFITA","OGROS","OJEAR","OJEAS","OJEEN","OJETE","OLEOS","OLERA",
"OLMOS","ONDAS","ONEAS","ONOTO","OPACA","OPACO","OPTAR","OPTAS","OPTEN","ORATE",
"ORUGA","OSEAS","OSEOS","OSTIA","OTEAR","OTEAS","OVEJA","OVERO","OVNIS",
"PACER","PACES","PACIA","PACIO","PACOS","PAILA","PALCA","PALCO","PALMA","PALMO",
"PALPA","PALPE","PALPO","PANAL","PANDO","PANEL","PAPAN","PAPEA","PAPEO","PARCO",
"PARMO","PARRA","PARRO","PASEN","PASMO","PAVON","PAYOR","PAYAR","PAYAS","PAYES",
"PECAS","PECAR","PEDAL","PEDAS","PENAS","PENCA","PENDE","PENDO","PENON","PERLA",
"PERNA","PERNO","PEROS","PESCA","PEZON","PICAR","PICAS","PICEL","PICOL","PICON",
"PILAF","PILAR","PINAS","PINON","PINZA","PIOJO","PIPAS","PIQUE","PISAR","PISAS",
"PITON","PLAZO","PLEGA","PLENA","PLENO","POLAR","POLCA","POLEA","PONCA","PONCO",
"PONYA","PORCA","PORCO","PORRA","PORTO","POSAR","POZOS","PRESA","PROAS","PROBA",
"PROBE","PROBO","PROCO","PROLE","PRONA","PRONE","PRONO","PRORA","PROTO","PUBES",
"PUCHA","PUCHO","PUDOR","PUGNA","PUGNE","PUGNO","PULGA","PULPO","PULSA","PUNZA",
"PUNAL","PURGA","PURGE","PURGO",
"RABAS","RABEL","RABIA","RABIE","RABIO","RABON","RACAS","RACHO","RAHEZ","RAJAR",
"RAJAS","RAJON","RALEA","RALEO","RAMPA","RANDA","RAPAR","RAPAS","RAPON","RAPTO",
"RASCA","RASPE","RASPO","RASTA","RAUDO","REDES","REMAN","REMAR","REMAS","RENAL",
"RENCO","REPAS","REPOL","REPOS","RETAL","RETRO","REUMA","REZAN","REZAS","RIBAS",
"RICAS","RIEGA","RIELA","RIELE","RIELO","RIGOR","RIMAS","RISCO","RISOS","RITOS",
"RIZAR","RIZAS","ROBAS","ROBEN","ROBES","RODAL","RODAR","RODAS","RONCA","RONCE",
"RONCO","RONZA","ROPAS","ROPEL","ROSAR","ROSAS","ROSCA","ROSCO","ROTAR","ROTAS",
"ROTON","ROTES","ROTOR","RUBIO","RUGIR","RUGIS","RUGIO","RULOS","RUSAS",
"SABIA","SADHE","SAGAZ","SALAZ","SALDO","SALGA","SALGO","SALMA","SALMO","SALPA",
"SALPE","SALPO","SALSE","SALVA","SALVE","SALVO","SAMIA","SANEA","SANEO","SARNA",
"SECAR","SECAS","SECHE","SEGAL","SEGAR","SEIDE","SELLO","SENSO","SEQUE","SIGMA",
"SIRGA","SIRGE","SIRGO","SISAL","SISAR","SISAS","SITAR","SOBRA","SOCAZ","SOCIA",
"SOLES","SOLIO","SONAR","SOPAS","SOPOR","SOPON","SORAL","SORBA","SORBE","SORBI",
"SORBO","SORGO","SORJA","SORTA","SOZON","SUDAR","SUDAS","SUELE","SUMEN","SUMAR",
"SUMOS","SURCO","SURJA","SURJO","SURTO",
"TABAL","TACAR","TACAS","TACEO","TAFIA","TAIGA","TAJAR","TALAS","TALCA","TALCO",
"TALDO","TALEO","TALLO","TALON","TALPA","TAMAL","TANGA","TAPAS","TAPAR","TAPON",
"TAQUE","TARAR","TARAS","TARCO","TARJE","TARJO","TARSA","TASCA","TEDIO","TEJON",
"TELOS","TENOR","TEOSA","TERCO","TERMA","TERMO","TESAR","TESON","TETIS","TINCA",
"TINCO","TINEA","TINGO","TINIA","TIRSO","TITAN","TOCHE","TOCON","TOKIO","TOLDO",
"TONCO","TONGA","TOPAS","TOPAR","TOPER","TOPIL","TOPON","TORAX","TORAR","TORBA",
"TORCO","TORCA","TORDO","TORIL","TORON","TORPE","TORSO","TOSER","TOSES","TOSIO",
"TRABA","TRAER","TRAPO","TRAZA","TRACE","TREPA","TRETA","TRIAR","TRIGA","TRIGO",
"TRIPA","TROCA","TROCO","TRONA","TRONE","TROVA","TRUFA","TRUJA","TUCAN","TUNAR",
"TURBA",
"UBRES","ULULO","UNCIR","UNCIA","UNGIR","UNGIO","URDIR","URGIR","URGIO","USURA",
"UTERO","UVERO",
"VACUA","VACUO","VAGAL","VAGAR","VAGAS","VAGOS","VAHAR","VAHOS","VAJON","VANAL",
"VARCO","VARIA","VARIO","VASAR","VASOS","VAYAN","VEDAR","VEDAS","VEJEZ","VELAR",
"VELAS","VELON","VELOZ","VENAL","VENDI","VENDO","VENIA","VERAZ","VERGA","VERSO",
"VETAS","VETAR","VICAR","VIGAS","VIGOR","VIRAR","VIRAS","VIRGO","VIRIL","VIVAR",
"VIVAS","VIVAZ","VOCAS","VOCEO","VOLCA","VOLCO","VOLVA","VULGO",
"YANKI","YEDRA","YEGUA","YERBA","YERMO","YESCA","YUGOS","YUNTA",
"ZAINO","ZALEO","ZANCA","ZANON","ZARCO","ZARPA","ZARPE","ZARPO","ZARZA","ZOCAL",
"ZOCLO","ZONAS","ZURCE","ZURCI","ZURRA"
];

// Función de normalización: quita tildes, convierte Ñ→N para comparación interna
function normalize(str) {
    return str.toUpperCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/Ñ/g, "N"); // Ñ se compara como N en el dict (sin tildes)
}

// Nota: en el juego la Ñ se muestra como Ñ, pero validamos sin ella para máxima compatibilidad
// Sin embargo, preservamos Ñ real: sólo normalizamos tildes, NO la Ñ
function normalizeNoAccents(str) {
    return str.toUpperCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "");
}

// Construimos el set con entradas normalizadas (sin tildes, con Ñ conservada)
const validWordsSet = new Set(rawValidWords.map(w => normalizeNoAccents(w)));

// ========================
// CLASE WORDLEGAME
// ========================
class WordleGame {
    constructor(words) {
        this.words = words.map(w => normalizeNoAccents(w)).filter(w => w.length === 6);
        // Datos cargados desde Firestore por loadStats()
        this.level = 1;
        this.totalWins = 0;
        this.winAttempts = [0, 0, 0, 0, 0, 0];
        this.currentStreak = 0;
        this.maxStreak = 0;
        this.lastPlayedDate = null;

        // Cargar estado del juego o inicializar nuevo
        this.loadGameState();
        
        this.board = [];
        this.keyMap = {};
        this.gameOver = false;

        this.boardDiv = document.getElementById('game-board');
        this.keyboardDiv = document.getElementById('keyboard');
        this.levelDisplay = document.getElementById('levelDisplay');
        this.messageDiv = document.getElementById('game-message');

        this.initBoard();
        this.initKeyboard();
        this.bindKeyboard();
        this.bindButtons();
        this.updateStatsDisplay();
        this.updateLevelDisplay();
        this.restoreBoardState();

        // Animación shake
        const style = document.createElement('style');
        style.textContent = `
            @keyframes shake {
                0%, 100% { transform: translateX(0); }
                20%       { transform: translateX(-6px); }
                40%       { transform: translateX(6px); }
                60%       { transform: translateX(-4px); }
                80%       { transform: translateX(4px); }
            }
            .tile.shake { animation: shake 0.5s ease; border-color: #ff4444; }
        `;
        document.head.appendChild(style);
    }

    randomWord() {
        return this.words[Math.floor(Math.random() * this.words.length)];
    }

    // Generar una palabra basada en la fecha actual (misma palabra para todo el día)
    getDailyWord() {
        const today = new Date();
        const seed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
        const index = seed % this.words.length;
        return this.words[index];
    }

    // Guardar estado del juego en localStorage
    saveGameState() {
        const gameState = {
            currentWord: this.currentWord,
            currentRow: this.currentRow,
            currentCol: this.currentCol,
            gameOver: this.gameOver,
            boardState: this.getBoardState(),
            keyboardState: this.getKeyboardState(),
            date: new Date().toDateString()
        };
        localStorage.setItem('wordleGameState', JSON.stringify(gameState));
    }

    // Cargar estado del juego desde localStorage
    loadGameState() {
        const saved = localStorage.getItem('wordleGameState');
        const today = new Date().toDateString();
        
        if (saved) {
            try {
                const gameState = JSON.parse(saved);
                // Si es del mismo día, restaurar el estado
                if (gameState.date === today) {
                    this.currentWord = gameState.currentWord;
                    this.currentRow = gameState.currentRow || 0;
                    this.currentCol = gameState.currentCol || 0;
                    this.gameOver = gameState.gameOver || false;
                    this.savedBoardState = gameState.boardState;
                    this.savedKeyboardState = gameState.keyboardState;
                    return;
                }
            } catch (e) {
                console.warn('Error loading game state:', e);
            }
        }
        
        // Si no hay estado guardado o es de otro día, generar nueva palabra
        this.currentWord = this.getDailyWord();
        this.currentRow = 0;
        this.currentCol = 0;
        this.gameOver = false;
        this.savedBoardState = null;
        this.savedKeyboardState = null;
    }

    // Obtener estado actual del tablero
    getBoardState() {
        const boardState = [];
        for (let r = 0; r < 6; r++) {
            const rowState = [];
            for (let c = 0; c < 6; c++) {
                if (this.board[r] && this.board[r][c]) {
                    rowState.push({
                        text: this.board[r][c].textContent,
                        classes: Array.from(this.board[r][c].classList)
                    });
                } else {
                    rowState.push({ text: '', classes: [] });
                }
            }
            boardState.push(rowState);
        }
        return boardState;
    }

    // Obtener estado actual del teclado
    getKeyboardState() {
        const keyboardState = {};
        Object.entries(this.keyMap).forEach(([key, btn]) => {
            keyboardState[key] = Array.from(btn.classList);
        });
        return keyboardState;
    }

    // Restaurar estado del tablero
    restoreBoardState() {
        if (this.savedBoardState) {
            for (let r = 0; r < 6; r++) {
                for (let c = 0; c < 6; c++) {
                    if (this.savedBoardState[r] && this.savedBoardState[r][c]) {
                        const tile = this.board[r][c];
                        const state = this.savedBoardState[r][c];
                        tile.textContent = state.text;
                        tile.className = 'tile';
                        state.classes.forEach(cls => tile.classList.add(cls));
                    }
                }
            }
        }
        
        if (this.savedKeyboardState) {
            Object.entries(this.savedKeyboardState).forEach(([key, classes]) => {
                const btn = this.keyMap[key];
                if (btn) {
                    btn.className = 'key';
                    classes.forEach(cls => {
                        if (cls !== 'key') btn.classList.add(cls);
                    });
                }
            });
        }
        
        this.updateCurrentRowClass();
    }

    showMessage(msg, duration = 2000) {
        this.messageDiv.textContent = msg;
        if (duration > 0) {
            setTimeout(() => { this.messageDiv.textContent = ''; }, duration);
        }
    }

    initBoard() {
        this.boardDiv.innerHTML = '';
        this.board = [];
        for (let r = 0; r < 6; r++) {
            const row = [];
            for (let c = 0; c < 6; c++) {
                const tile = document.createElement('div');
                tile.classList.add('tile');
                tile.dataset.row = r;
                tile.dataset.col = c;
                
                // Add click event listener to allow starting from this position
                tile.addEventListener('click', () => this.handleTileClick(r, c));
                
                this.boardDiv.appendChild(tile);
                row.push(tile);
            }
            this.board.push(row);
        }
        this.updateCurrentRowClass();
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
                // Mapeamos tanto la clave directa como su versión normalizada
                this.keyMap[k] = btn;
                rowDiv.appendChild(btn);
                btn.addEventListener('click', () => this.handleKey(k));
            });
            this.keyboardDiv.appendChild(rowDiv);
        });
    }

    bindKeyboard() {
        document.addEventListener('keydown', e => {
            if (this.gameOver) return;
            const raw = e.key;

            if (raw === 'Backspace' || raw === 'Delete') {
                this.handleKey('DEL');
                return;
            }
            if (raw === 'Enter') {
                // Prevenir comportamiento por defecto (crear párrafos)
                e.preventDefault();
                this.handleKey('ENTER');
                return;
            }

            // Convertir a mayúsculas y normalizar tildes (á→A, é→E, etc.) pero preservar Ñ
            let key = raw.toUpperCase();
            // Tildes comunes → letra base
            key = key.normalize("NFD").replace(/[\u0300-\u036f]/g, "");

            // Aceptar letras del alfabeto español (A-Z y Ñ)
            if (/^[A-ZÑ]$/.test(key)) {
                this.handleKey(key);
            }
        });
    }

    bindButtons() {
        const showStats = document.getElementById('showStatsBtn');
        const closeStats = document.getElementById('closeStatsBtn');
        const statsPanel = document.getElementById('statsPanel');

        if (showStats) {
            showStats.addEventListener('click', () => {
                this.updateStatsDisplay();
                statsPanel.style.display = 'block';
                statsPanel.setAttribute('aria-hidden', 'false');
            });
        }
        if (closeStats) {
            closeStats.addEventListener('click', () => {
                statsPanel.style.display = 'none';
                statsPanel.setAttribute('aria-hidden', 'true');
            });
        }
    }

    isValidWord(guess) {
        // Normalizar sin tildes, manteniendo Ñ
        const norm = normalizeNoAccents(guess.toUpperCase());
        return validWordsSet.has(norm);
    }

    updateCurrentRowClass() {
        // Remove current-row class from all tiles
        this.board.forEach(row => {
            row.forEach(tile => {
                tile.classList.remove('current-row');
            });
        });
        
        // Add current-row class to tiles in the current row
        if (this.currentRow < 6) {
            this.board[this.currentRow].forEach(tile => {
                tile.classList.add('current-row');
            });
        }
    }

    handleTileClick(row, col) {
        if (this.gameOver) return;
        
        // Only allow clicking on the current row
        if (row !== this.currentRow) return;
        
        // Just move the cursor to the clicked position in the current row
        this.currentCol = col;
    }

    handleKey(key) {
        if (this.gameOver) return;
        if (key === "ENTER") { 
            this.checkWord(); 
            return; 
        }
        if (key === "DEL") { this.deleteLetter(); return; }
        if (this.currentCol < 6) {
            const tile = this.board[this.currentRow][this.currentCol];
            tile.textContent = key;
            tile.classList.add('filled');
            this.currentCol++;
            this.saveGameState(); // Guardar estado después de escribir
        }
    }

    deleteLetter() {
        if (this.currentCol > 0) {
            this.currentCol--;
            const tile = this.board[this.currentRow][this.currentCol];
            tile.textContent = '';
            tile.classList.remove('filled');
            this.saveGameState(); // Guardar estado después de borrar
        }
    }

    checkWord() {
        if (this.currentCol < 6) {
            this.showMessage('✏️ Escribe 6 letras');
            return;
        }

        let guess = "";
        for (let c = 0; c < 6; c++) guess += this.board[this.currentRow][c].textContent;

        if (!this.isValidWord(guess)) {
            this.showMessage('❌ Palabra no válida');
            const row = this.board[this.currentRow];
            row.forEach(tile => tile.classList.add('shake'));
            setTimeout(() => row.forEach(tile => tile.classList.remove('shake')), 500);
            return;
        }

        // Comparar sin tildes, con Ñ conservada
        const guessNorm = normalizeNoAccents(guess);
        const wordNorm = normalizeNoAccents(this.currentWord);

        const letterCount = {};
        for (let l of wordNorm) {
            letterCount[l] = (letterCount[l] || 0) + 1;
        }

        const results = new Array(6).fill('absent');

        // Primero: correctas
        for (let c = 0; c < 6; c++) {
            if (guessNorm[c] === wordNorm[c]) {
                results[c] = 'correct';
                letterCount[guessNorm[c]]--;
            }
        }

        // Segundo: presentes
        for (let c = 0; c < 6; c++) {
            if (results[c] === 'correct') continue;
            const letter = guessNorm[c];
            if (letterCount[letter] > 0) {
                results[c] = 'present';
                letterCount[letter]--;
            }
        }

        // Animación reveal
        for (let c = 0; c < 6; c++) {
            const tile = this.board[this.currentRow][c];
            const keyChar = guess[c]; // char original que el user escribió (puede ser Ñ)
            const result = results[c];

            setTimeout(() => {
                tile.classList.add('reveal');
                setTimeout(() => {
                    tile.classList.remove('reveal');
                    tile.classList.add(result);

                    // Colorear tecla del teclado virtual
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

        // Comprobación final
        setTimeout(() => {
            if (guessNorm === wordNorm) {
                this.totalWins++;
                this.winAttempts[this.currentRow]++;
                this.updateStreak(true);
                this.showMessage('¡Correcto! 🎉', 0);
                this.gameOver = true;
                this.saveStats(); // guardar victorias antes de pasar de nivel
                this.saveGameState(); // Guardar estado cuando se gana
                setTimeout(() => this.nextLevel(), 2000);
            } else {
                this.currentRow++;
                this.currentCol = 0;
                this.updateCurrentRowClass(); // Update current row highlighting
                this.saveGameState(); // Guardar estado después de avanzar de fila
                if (this.currentRow >= 6) {
                    this.updateStreak(false);
                    this.showMessage(`La palabra era: ${this.currentWord}`, 0);
                    this.gameOver = true;
                    this.saveStats();
                    this.saveGameState(); // Guardar estado final del juego
                    setTimeout(() => this.nextLevel(), 2500);
                }
            }
        }, 6 * 250 + 400);
    }

    updateStreak(won) {
        const today = new Date().toDateString();
        const lastDate = this.lastPlayedDate ? new Date(this.lastPlayedDate).toDateString() : null;
        
        // Si es el primer día jugado o un día diferente
        if (!lastDate || lastDate !== today) {
            // Si es un día consecutivo (ayer)
            if (lastDate && this.isConsecutiveDay(lastDate, today)) {
                if (won) {
                    this.currentStreak++;
                } else {
                    this.currentStreak = 0;
                }
            } else {
                // No es consecutivo, reiniciar racha
                this.currentStreak = won ? 1 : 0;
            }
            this.lastPlayedDate = new Date().toISOString();
        }
        
        // Actualizar racha máxima
        if (this.currentStreak > this.maxStreak) {
            this.maxStreak = this.currentStreak;
        }
    }

    isConsecutiveDay(lastDateStr, todayStr) {
        const lastDate = new Date(lastDateStr);
        const today = new Date(todayStr);
        const diffTime = today - lastDate;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        return diffDays === 1;
    }

    nextLevel() {
        this.gameOver = false;
        this.currentRow = 0;
        this.currentCol = 0;
        this.messageDiv.textContent = '';
        this.board.forEach(row => row.forEach(tile => {
            tile.textContent = '';
            tile.className = 'tile';
        }));
        this.updateCurrentRowClass(); // Update current row highlighting after reset
        Object.values(this.keyMap).forEach(btn => {
            btn.classList.remove('correct', 'present', 'absent');
        });
        this.currentWord = this.getDailyWord(); // Generar nueva palabra diaria
        this.level++;
        this.updateLevelDisplay();
        this.saveStats(); // guardar con el nivel ya incrementado
        this.saveGameState(); // Guardar nuevo estado con nueva palabra
    }

    saveStats() {
        this.updateStatsDisplay();
        if (!_currentUser) return;
        const name = getPlayerName();
        setDoc(doc(db, 'saves_wordle', _currentUser.uid), {
            name,
            level:         this.level,
            totalWins:     this.totalWins,
            winAttempts:   this.winAttempts,
            currentStreak: this.currentStreak,
            maxStreak:     this.maxStreak,
            lastPlayedDate: this.lastPlayedDate,
            updatedAt:     serverTimestamp()
        }).catch(e => console.warn('[wordle save]', e));
        setDoc(doc(db, 'leaderboard_wordle', _currentUser.uid), {
            name,
            score:     this.level,
            updatedAt: serverTimestamp()
        }).catch(e => console.warn('[wordle lb]', e));
    }

    async loadStats() {
        if (!_currentUser) return;
        try {
            const snap = await getDoc(doc(db, 'saves_wordle', _currentUser.uid));
            if (!snap.exists()) return;
            const d = snap.data();
            this.level           = d.level           ?? 1;
            this.totalWins       = d.totalWins       ?? 0;
            this.winAttempts     = d.winAttempts     ?? [0,0,0,0,0,0];
            this.currentStreak   = d.currentStreak   ?? 0;
            this.maxStreak       = d.maxStreak       ?? 0;
            this.lastPlayedDate  = d.lastPlayedDate  ?? null;
            this.updateLevelDisplay();
            this.updateStatsDisplay();
        } catch (e) {
            console.warn('[wordle load]', e);
        }
    }

    updateStatsDisplay() {
        const totalEl = document.getElementById('totalWins');
        if (totalEl) totalEl.textContent = this.totalWins;
        
        const currentStreakEl = document.getElementById('currentStreak');
        if (currentStreakEl) currentStreakEl.textContent = this.currentStreak;
        
        const maxStreakEl = document.getElementById('maxStreak');
        if (maxStreakEl) maxStreakEl.textContent = this.maxStreak;
        
        // Actualizar barras de distribución
        const maxWins = Math.max(...this.winAttempts, 1);
        for (let i = 0; i < 6; i++) {
            const countEl = document.getElementById('win' + (i + 1));
            const barEl = document.getElementById('bar' + (i + 1));
            if (countEl) countEl.textContent = this.winAttempts[i];
            if (barEl) {
                const percentage = (this.winAttempts[i] / maxWins) * 100;
                barEl.style.width = percentage + '%';
            }
        }
    }

    updateLevelDisplay() {
        if (this.levelDisplay) this.levelDisplay.textContent = this.level;
    }
}

// ========================
// INICIALIZAR JUEGO
// ========================
async function init() {
    // Esperar a que Firebase Auth confirme quién es el usuario
    _currentUser = await waitForUser();

    if (!_currentUser) {
        window.location.href = 'index.html';
        return;
    }

    const game = new WordleGame(words);
    await game.loadStats();
}
init();
