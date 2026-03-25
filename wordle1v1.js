// ============================================================
// wordle1v1.js — Wordle 1v1 Multijugador
// ============================================================
import { db, waitForUser, getPlayerName }
    from "./firebase-config.js";
import {
    doc, getDoc, setDoc, updateDoc, serverTimestamp, onSnapshot, collection, query, where, orderBy, limit
} from "https://www.gstatic.com/firebasejs/11.0.0/firebase-firestore.js";

// ========================
// VARIABLES GLOBALES
// ========================
let currentUser = null;
let currentRoom = null;
let roomCode = null;
let isRoomCreator = false;
let gameState = {
    currentRound: 1,
    totalRounds: 5,
    player1CompletedRounds: 0,
    player2CompletedRounds: 0,
    currentWord: '',
    player1Words: [],
    player2Words: [],
    roundWords: [],
    gameStatus: 'waiting', // waiting, playing, finished
    player1Finished: false,
    player2Finished: false,
    // Estado individual de cada jugador
    player1State: {
        currentRow: 0,
        currentGuess: '',
        attempts: []
    },
    player2State: {
        currentRow: 0,
        currentGuess: '',
        attempts: []
    }
};

// ========================
// PALABRAS SECRETAS
// ========================
const words = [
    "ABACO","ABEJA","ACABO","ACOTE","ACTUA","ACUDO","ADAMA","ADEMA","ADORO","AFUFA",
    "AGOTA","AGUDO","AHOGO","AHUYA","AIREO","AJUST","ALADO","ALBAS","ALERO","ALOJA",
    "ALTAR","ALUMA","ALZAR","AMAGO","AMANO","AMARO","AMATE","AMIGO","AMIGO","AMORT",
    "AMUGA","ANCLA","ANEGO","ANIMO","ANODO","APARA","APENA","APOYO","APREN","APURA",
    "ARADO","ARANA","ARANO","ARENA","ARGON","AROMA","AROYA","ARPON","ARRAS","ARROZ",
    "ARSEA","ARZON","ASADO","ASEAR","ASIDO","ASOMA","ASPON","ASTIL","ATACA","ATEOS",
    "ATIZA","ATONO","ATRAS","AUDAZ","AUNAR","AUNOS","AURA","AUTOR","AVALA","AVENA",
    "AVISO","AYUDA","AYUNO","AZADA","AZAR","AZOTE","BADUL","BAHIA","BAILE","BAJEO",
    "BALON","BALSA","BANCO","BANDO","BANOS","BARBA","BARCA","BARON","BASAL","BASTO",
    "BATON","BAURA","BAUTA","BAVOS","BAYOS","BAZAR","BEADA","BEBAN","BEBEN","BEBIA",
    "BEBIO","BEBON","BECER","BECER","BECER","BEGON","BELEN","BELGA","BELLO","BEMOL",
    "BENDI","BENDO","BENEF","BENEM","BENEO","BENES","BENGA","BENGO","BENOS","BENTE",
    "BENTO","BEPOL","BEREN","BERGA","BERGL","BERIA","BERIE","BERIO","BERIS","BERLA",
    "BERLE","BERLO","BERME","BERMI","BERMO","BERNA","BERNE","BERNO","BERRO","BERTA",
    "BESAR","BESON","BESTI","BETUN","BEUNA","BEUNE","BEUNO","BIENV","BIENA","BIENE",
    "BIENO","BIENS","BIENT","BIENV","BIENZ","BIFAZ","BIFOR","BIJAO","BIJAR","BIJEA",
    "BIJEE","BIJEO","BIJES","BIJOS","BILBA","BILIS","BILLO","BILSA","BILSO","BIMBA",
    "BIMBE","BIMBO","BIMBO","BIMSA","BIMSO","BINAR","BINBA","BINBE","BINBO","BINSA",
    "BINSO","BINTA","BINTE","BINTO","BIOLO","BIPAR","BIRLA","BIRLE","BIRLO","BIROS",
    "BITAC","BITAD","BITAN","BITAR","BITAS","BITCO","BITES","BITLA","BITLE","BITLO",
    "BITOS","BITSA","BITSO","BIUNA","BIUNE","BIUNO","BIZCO","BIZKA","BIZON","BLAND",
    "BLASA","BLASE","BLASO","BLENO","BLENU","BLENO","BLUSA","BOATO","BOBAL","BOBDA",
    "BOBDE","BOBDO","BOBIA","BOBIE","BOBIO","BOBIS","BOBLE","BOBLO","BOBNA","BOBNE",
    "BODAS","BOEMA","BOFEO","BOFES","BOFON","BOGAD","BOGAN","BOGAR","BOGAS","BOGEO",
    "BOGUE","BOHIO","BOINA","BOIRA","BOIRO","BOJEA","BOJEE","BOJEO","BOJES","BOJIN",
    "BOKER","BOLAR","BOLAS","BOLEA","BOLEE","BOLEO","BOLES","BOLIC","BOLSA","BOLSO",
    "BOMBA","BOMBE","BOMBO","BONAN","BONAR","BONAS","BONDA","BONDE","BONDO","BONDY",
    "BONIE","BONIO","BONIS","BONITO","BONSA","BONSO","BONYL","BOQUE","BORDE","BORDO",
    "BORLA","BORLE","BORLO","BORNA","BORNE","BORNO","BORON","BORRA","BORRE","BORRO",
    "BOSAR","BOSCA","BOSCO","BOSLA","BOSLE","BOSLO","BOSNA","BOSNE","BOSNO","BOTAD",
    "BOTAN","BOTAR","BOTAS","BOTEN","BOTES","BOTIN","BOTLA","BOTLE","BOTLO","BOTNA",
    "BOTNE","BOTNO","BOTON","BOVED","BOZAL","BOZCA","BOZCO","BOZLA","BOZLE","BOZLO",
    "BRACA","BRACE","BRACO","BRAGA","BRAHA","BRAHE","BRAHO","BRAIL","BRAIN","BRAIO",
    "BRAIS","BRAJA","BRAJE","BRAJO","BRAMA","BRAME","BRAMO","BRANA","BRANE","BRANO",
    "BRAOS","BRASA","BRASE","BRASO","BRAVA","BRAVE","BRAVO","BRAZA","BRAZE","BRAZO",
    "BREBA","BREBE","BREBO","BRENA","BRENE","BRENO","BRESA","BRESE","BRESO","BRIAR",
    "BRIAS","BRIEN","BRIEO","BRIES","BRIGA","BRIGE","BRIGO","BRIN","BRINA","BRINE",
    "BRINO","BRION","BRISA","BRISE","BRISO","BRITO","BRIOS","BRIOS","BRIXE","BRIXO",
    "BROCA","BROCE","BROCO","BRODA","BRODE","BRODO","BROGA","BROGE","BROGO","BROJA",
    "BROJE","BROJO","BROKA","BROKE","BROKO","BROLA","BROLE","BROLO","BROMA","BROME",
    "BROMO","BROSA","BROSE","BROSO","BROTA","BROTE","BROTO","BROYA","BROYE","BROYO",
    "BROZA","BRUJA","BRUJE","BRUJO","BRULA","BRULE","BRULO","BRUMA","BRUME","BRUMO",
    "BRUNA","BRUNE","BRUNO","BRUSA","BRUSE","BRUSO","BUCAL","BUCLE","BUCLE","BUCNA",
    "BUCNE","BUCNO","BUDIN","BUELO","BUENO","BUHON","BUHOS","BUIRA","BUIRE","BUIRO",
    "BUIZA","BUIZE","BUIZO","BUJAR","BUJEA","BUJEE","BUJEO","BUJES","BUJIA","BUJIE",
    "BUJIO","BUJON","BULAS","BULDO","BULEO","BULGA","BULGE","BULGO","BULIA","BULIE",
    "BULIO","BULIS","BULLE","BULLI","BULLO","BULOS","BULSA","BULSE","BULSO","BUMBA",
    "BUNCA","BUNCE","BUNCO","BUNKA","BUNKE","BUNKO","BUNOS","BUNSA","BUNSE","BUNSO",
    "BUQUE","BURAR","BUREO","BURGA","BURGE","BURGO","BURIL","BURLA","BURLE","BURLO",
    "BURON","BURRA","BURRE","BURRO","BURSA","BURSE","BURSO","BUSA","BUSE","BUSCA",
    "BUSCO","BUSLA","BUSLE","BUSLO","BUSMA","BUSME","BUSMO","BUSNA","BUSNE","BUSNO",
    "BUTAC","BUTAD","BUTAN","BUTAR","BUTAS","BUTCA","BUTCE","BUTCO","BUTEN","BUTES",
    "BUTLA","BUTLE","BUTLO","BUTNA","BUTNE","BUTNO","BUTON","BUTRE","BUXEA","BUXEE",
    "BUXEO","BUXES","BUZAR","BUZCA","BUZCO","BUZON","CABAL","CABAS","CABEA","CABEE",
    "CABEO","CABES","CABLE","CABRA","CABRO","CACAO","CACHE","CACHO","CACIA","CACIO",
    "CADAS","CADEA","CADEE","CADEO","CADES","CAECA","CAECE","CAECO","CAEFE","CAEFI",
    "CAEFO","CAESA","CAESE","CAESO","CAFTA","CAFTE","CAFTO","CAIDA","CAIDE","CAIDO",
    "CAIFA","CAIFE","CAIFO","CAIGA","CAIGE","CAIGO","CAIGS","CAILA","CAILE","CAILO",
    "CAIMA","CAIME","CAIMO","CAINA","CAINE","CAINO","CAION","CAIPA","CAIPE","CAIPO",
    "CAIRA","CAIRE","CAIRO","CAISA","CAISE","CAISO","CAITA","CAITE","CAITO","CAIVA",
    "CAIVE","CAIVO","CAJAS","CAJEA","CAJEE","CAJEO","CAJES","CAJON","CALAR","CALDA",
    "CALDE","CALDO","CALEA","CALEE","CALEO","CALES","CALFA","CALFE","CALFO","CALGA",
    "CALGE","CALGO","CALID","CALIF","CALIG","CALIO","CALIZ","CALLA","CALLE","CALLO",
    "CALMA","CALME","CALMO","CALON","CALOS","CALVA","CALVO","CAMA","CAMBA","CAMBE",
    "CAMBO","CAMEA","CAMEE","CAMEO","CAMEO","CAMIN","CAMIO","CAMON","CAMOS","CAMPA",
    "CAMPE","CAMPO","CAMP","CANA","CANAL","CANAS","CANCE","CANCO","CANDA","CANDE",
    "CANDO","CANEA","CANEE","CANEO","CANES","CANGA","CANGE","CANGO","CANON","CANTA",
    "CANTE","CANTO","CAÑA","CAÑON","CAPA","CAPAZ","CAPON","CAPOR","CAPOT","CAPTA",
    "CAPTE","CAPTO","CAPUL","CARA","CARB","CARCA","CARCE","CARCO","CARDA","CARDE",
    "CARDO","CAREA","CAREE","CAREO","CARES","CARGA","CARIE","CARIO","CARIS","CARLA",
    "CARLE","CARLO","CARMA","CARME","CARMO","CARNA","CARNE","CARNO","CARON","CARPA",
    "CARPE","CARPO","CARRE","CARRO","CARRA","CARRE","CARRO","CARSA","CARSE","CARSO",
    "CARTA","CARTE","CARTO","CARVA","CARVE","CARVO","CASAR","CASBA","CASBE","CASBO",
    "CASC","CASCA","CASCE","CASCO","CASDA","CASDE","CASDO","CASEA","CASEE","CASEO",
    "CASES","CASFA","CASFE","CASFO","CASGA","CASGE","CASGO","CASHA","CASHE","CASHO",
    "CASIA","CASIE","CASIO","CASKA","CASKE","CASKO","CASLA","CASLE","CASLO","CASMA",
    "CASME","CASMO","CASNA","CASNE","CASNO","CASON","CASP","CASPA","CASPE","CASPO",
    "CASRA","CASRE","CASRO","CASSA","CASSE","CASSO","CASTA","CASTE","CASTO","CASVA",
    "CASVE","CASVO","CATAB","CATEA","CATEE","CATEO","CATES","CATIN","CATON","CATOS",
    "CAUDA","CAUDO","CAUGA","CAUGE","CAUGO","CAULA","CAULE","CAULO","CAUMA","CAUME",
    "CAUMO","CAUSA","CAUSE","CAUSO","CAVAL","CAVEA","CAVEE","CAVEO","CAVES","CAVIA",
    "CAVIE","CAVIO","CAVLA","CAVLE","CAVLO","CAVNA","CAVNE","CAVNO","CAYAD","CAYAN",
    "CAYAR","CAYAS","CAYEN","CAYES","CAYGA","CAYGE","CAYGO","CAYLA","CAYLE","CAYLO",
    "CAYNA","CAYNE","CAYNO","CAYOS","CAZAB","CAZAD","CAZAF","CAZAG","CAZAH","CAZAJ",
    "CAZAL","CAZAM","CAZAN","CAZAP","CAZAR","CAZAS","CAZAT","CAZAV","CAZBA","CAZBE",
    "CAZBO","CAZCA","CAZCE","CAZCO","CAZDA","CAZDE","CAZDO","CAZEA","CAZEE","CAZEO",
    "CAZES","CAZFA","CAZFE","CAZFO","CAZGA","CAZGE","CAZGO","CAZHA","CAZHE","CAZHO",
    "CAZIA","CAZIE","CAZIO","CAZLA","CAZLE","CAZLO","CAZMA","CAZME","CAZMO","CAZNA",
    "CAZNE","CAZNO","CAZON","CAZPA","CAZPE","CAZPO","CAZRA","CAZRE","CAZRO","CAZSA",
    "CAZSE","CAZSO","CAZTA","CAZTE","CAZTO","CAZVA","CAZVE","CAZVO","CEBAD","CEBAF",
    "CEBAG","CEBAH","CEBAJ","CEBAL","CEBAM","CEBAN","CEBAP","CEBAR","CEBAS","CEBAT",
    "CEBAV","CEBDA","CEBDE","CEBDO","CEBEA","CEBEE","CEBEO","CEBES","CEBFA","CEBFE",
    "CEBFO","CEBGA","CEBGE","CEBGO","CEBIA","CEBIE","CEBIO","CEBLA","CEBLE","CEBLO",
    "CEBMA","CEBME","CEBMO","CEBNA","CEBNE","CEBNO","CEBON","CEBPA","CEBPE","CEBPO",
    "CEBRA","CEBRE","CEBRO","CEBSA","CEBSE","CEBSO","CEBTA","CEBTE","CEBTO","CEBVA",
    "CEBVE","CEBVO","CECA","CECEA","CECEE","CECEO","CECES","CECID","CECIF","CECIG",
    "CECIH","CECIJ","CECIL","CECIM","CECIN","CECIO","CECIP","CECIQ","CECIR","CECIS",
    "CECIT","CECIU","CECIV","CECIZ","CECOL","CECOM","CECON","CECOR","CECOS","CECOT",
    "CECUB","CECUD","CECUE","CECUF","CECUG","CECUH","CECUI","CECUJ","CECUL","CECUM",
    "CECUN","CECUO","CECUP","CECUR","CECUT","CECUV","CECUX","CECUY","CECUZ","CEDAC",
    "CEDAD","CEDAF","CEDAG","CEDAH","CEDAJ","CEDAL","CEDAM","CEDAN","CEDAP","CEDAR",
    "CEDAS","CEDAT","CEDAV","CEDAZ","CEDBA","CEDBE","CEDBO","CEDCA","CEDCE","CEDCO",
    "CEDDA","CEDDE","CEDDI","CEDDO","CEDFA","CEDFE","CEDFO","CEDGA","CEDGE","CEDGO",
    "CEDIA","CEDIE","CEDIO","CEDLA","CEDLE","CEDLO","CEDMA","CEDME","CEDMO","CEDNA",
    "CEDNE","CEDNO","CEDON","CEDPA","CEDPE","CEDPO","CEDRA","CEDRE","CEDRO","CEDSA",
    "CEDSE","CEDSO","CEDTA","CEDTE","CEDTO","CEDVA","CEDVE","CEDVO","CEEBR","CEECA",
    "CEECE","CEECO","CEEFA","CEEFE","CEEFO","CEEIA","CEEIE","CEEIO","CEEKA","CEEKE",
    "CEEKO","CEELE","CEELI","CEELO","CEEMA","CEEME","CEEMO","CEENA","CEENE","CEENO",
    "CEEPA","CEEPE","CEEPO","CEERA","CEERE","CEERO","CEESA","CEESE","CEESO","CEETA",
    "CEEVO","CEGAD","CEGAF","CEGAG","CEGAH","CEGAJ","CEGAL","CEGAM","CEGAN","CEGAP",
    "CEGAR","CEGAS","CEGAT","CEGAV","CEGAZ","CEGBA","CEGBE","CEGBO","CEGCA","CEGCE",
    "CEGCO","CEGDA","CEGDE","CEGDO","CEGEA","CEGEE","CEGEO","CEGES","CEGFA","CEGFE",
    "CEGFO","CEGGA","CEGGE","CEGGO","CEGIA","CEGIE","CEGIO","CEGLA","CEGLE","CEGLO",
    "CEGMA","CEGME","CEGMO","CEGNA","CEGNE","CEGNO","CEGON","CEGPA","CEGPE","CEGPO",
    "CEGRA","CEGRE","CEGRO","CEGSA","CEGSE","CEGSO","CEGTA","CEGTE","CEGTO","CEGVA",
    "CEGVE","CEGVO","CEIBA","CEIBE","CEIBO","CEJAD","CEJAF","CEJAG","CEJAH","CEJAJ",
    "CEJAL","CEJAM","CEJAN","CEJAP","CEJAR","CEJAS","CEJAT","CEJAV","CEJAZ","CEJBA",
    "CEJBE","CEJBO","CEJCA","CEJCE","CEJCO","CEJDA","CEJDE","CEJDO","CEJEA","CEJEE",
    "CEJEO","CEJES","CEJFA","CEJFE","CEJFO","CEJGA","CEJGE","CEJGO","CEJIA","CEJIE",
    "CEJIO","CEJLA","CEJLE","CEJLO","CEJMA","CEJME","CEJMO","CEJNA","CEJNE","CEJNO",
    "CEJON","CEJPA","CEJPE","CEJPO","CEJRA","CEJRE","CEJRO","CEJSA","CEJSE","CEJSO",
    "CEJTA","CEJTE","CEJTO","CEJVA","CEJVE","CEJVO","CELA","CELAD","CELAF","CELAG",
    "CELAH","CELAJ","CELAL","CELAM","CELAN","CELAP","CELAR","CELAS","CELAT","CELAV",
    "CELAZ","CELBA","CELBE","CELBO","CELCA","CELCE","CELC","CELC","CELDA","CELDE",
    "CELDO","CELEA","CELEE","CELEO","CELES","CELFA","CELFE","CELFO","CELGA","CELGE",
    "CELGO","CELIA","CELIE","CELIO","CELLA","CELLE","CELLO","CELMA","CELME","CELMO",
    "CELNA","CELNE","CELNO","CELON","CELP","CELPA","CELPE","CELPO","CELRA","CELRE",
    "CELRO","CELSA","CELSE","CELSO","CELTA","CELTE","CELTO","CELVA","CELVE","CELVO",
    "CEMAL","CEMAS","CEMAT","CEMAZ","CEMBA","CEMBE","CEMBO","CEMCA","CEMCE","CEMCO",
    "CEMDA","CEMDE","CEMDO","CEMEA","CEMEE","CEMEO","CEMES","CEMFA","CEMFE","CEMFO",
    "CEMGA","CEMGE","CEMGO","CEMIA","CEMIE","CEMIO","CEMLA","CEMLE","CEMLO","CEMMA",
    "CEMME","CEMMO","CEMNA","CEMNE","CEMNO","CEMON","CEMPA","CEMPE","CEMPO","CEMRA",
    "CEMRE","CEMRO","CEMSA","CEMSE","CEMSO","CEMTA","CEMTE","CEMTO","CEMVA","CEMVE",
    "CEMVO","CENAD","CENAF","CENAG","CENAH","CENAJ","CENAL","CENAM","CENAN","CENAP",
    "CENAR","CENAS","CENAT","CENAV","CENAZ","CENBA","CENBE","CENBO","CENCA","CENCE",
    "CENCO","CENDA","CENDE","CENDO","CENEA","CENEE","CENEO","CENES","CENFA","CENFE",
    "CENFO","CENGA","CENGE","CENGO","CENIA","CENIE","CENIO","CENLA","CENLE","CENLO",
    "CENMA","CENME","CENMO","CENNA","CENNE","CENNO","CENON","CENPA","CENPE","CENPO",
    "CENRA","CENRE","CENRO","CENSA","CENSE","CENSO","CENTA","CENTE","CENTO","CENVA",
    "CENVE","CENVO","CEÑAL","CEÑAS","CEÑDA","CEÑDE","CEÑDO","CEÑEA","CEÑEE","CEÑEO",
    "CEÑES","CEÑFA","CEÑFE","CEÑFO","CEÑGA","CEÑGE","CEÑGO","CEÑIA","CEÑIE","CEÑIO",
    "CEÑLA","CEÑLE","CEÑLO","CEÑMA","CEÑME","CEÑMO","CEÑNA","CEÑNE","CEÑNO","CEÑON",
    "CEÑPA","CEÑPE","CEÑPO","CEÑRA","CEÑRE","CEÑRO","CEÑSA","CEÑSE","CEÑSO","CEÑTA",
    "CEÑTE","CEÑTO","CEÑVA","CEÑVE","CEÑVO","CEPAA","CEPAD","CEPAE","CEPAF","CEPAG",
    "CEPAH","CEPAJ","CEPAL","CEPAM","CEPAN","CEPAP","CEPAR","CEPAS","CEPAT","CEPAV",
    "CEPAZ","CEPBA","CEPBE","CEPBO","CEPCA","CEPCE","CEPCO","CEPDA","CEPDE","CEPDO",
    "CEPEA","CEPEE","CEPEO","CEPES","CEPFA","CEPFE","CEPFO","CEPGA","CEPGE","CEPGO",
    "CEPIA","CEPIE","CEPIO","CEPLA","CEPLE","CEPLO","CEPMA","CEPME","CEPMO","CEPNA",
    "CEPNE","CEPNO","CEPON","CEPPA","CEPPE","CEPPO","CEPRA","CEPRE","CEPRO","CEPSA",
    "CEPSE","CEPSO","CEPTA","CEPTE","CEPTO","CEPVA","CEPVE","CEPVO","CEQUA","CEQUE",
    "CEQUI","CEQUL","CEQUN","CERAL","CEREA","CEREE","CEREO","CERES","CERFA","CERFE",
    "CERFO","CERGA","CERGE","CERGO","CERIA","CERIE","CERIO","CERLA","CERLE","CERLO",
    "CERMA","CERME","CERMO","CERNA","CERNE","CERNO","CERON","CERPA","CERPE","CERPO",
    "CERRA","CERRE","CERRO","CERSA","CERSE","CERSO","CERTA","CERTE","CERTO","CERVA",
    "CERVE","CERVO","CESAD","CESAF","CESAG","CESAH","CESAJ","CESAL","CESAM","CESAN",
    "CESAP","CESAR","CESAS","CESAT","CESAV","CESAZ","CESBA","CESBE","CESBO","CESCA",
    "CESCE","CESCO","CESDA","CESDE","CESDO","CESEA","CESEE","CESEO","CESES","CESFA",
    "CESFE","CESFO","CESGA","CESGE","CESGO","CESIA","CESIE","CESIO","CESLA","CESLE",
    "CESLO","CESMA","CESME","CESMO","CESNA","CESNE","CESNO","CESON","CESPA","CESPE",
    "CESPO","CESRA","CESRE","CESRO","CESSA","CESSE","CESSO","CESTA","CESTE","CESTO",
    "CESVA","CESVE","CESVO","CETAD","CETAF","CETAG","CETAH","CETAJ","CETAL","CETAM",
    "CETAN","CETAP","CETAR","CETAS","CETAT","CETAV","CETAZ","CETBA","CETBE","CETBO",
    "CETCA","CETCE","CETCO","CETDA","CETDE","CETDO","CETEA","CETEE","CETEO","CETES",
    "CETFA","CETFE","CETFO","CETGA","CETGE","CETGO","CETIA","CETIE","CETIO","CETLA",
    "CETLE","CETLO","CETMA","CETME","CETMO","CETNA","CETNE","CETNO","CETON","CETPA",
    "CETPE","CETPO","CETRA","CETRE","CETRO","CETSA","CETSE","CETSO","CETTA","CETTE",
    "CETTO","CETVA","CETVE","CETVO","CEUCA","CEUCE","CEUCO","CEUDA","CEUDE","CEUDO",
    "CEUFA","CEUFE","CEUFO","CEUGA","CEUGE","CEUGO","CEUJA","CEUJE","CEUJO","CEULA",
    "CEULE","CEULO","CEUMA","CEUME","CEUMO","CEUNA","CEUNE","CEUNO","CEUÑA","CEUÑE",
    "CEUÑO","CEUPA","CEUPE","CEUPO","CEURA","CEURE","CEURO","CEUSA","CEUSE","CEUSO",
    "CEUTA","CEUTE","CEUTO","CEUVA","CEUVE","CEUVO","CEVAD","CEVAE","CEVAF","CEVAG",
    "CEVAH","CEVAJ","CEVAL","CEVAM","CEVAN","CEVAP","CEVAR","CEVAS","CEVAT","CEVAV",
    "CEVAZ","CEVBA","CEVBE","CEVBO","CEVCA","CEVCE","CEVCO","CEVDA","CEVDE","CEVDO",
    "CEVEA","CEVEE","CEVEO","CEVES","CEVFA","CEVFE","CEVFO","CEVGA","CEVGE","CEVGO",
    "CEVIA","CEVIE","CEVIO","CEVLA","CEVLE","CEVLO","CEVMA","CEVME","CEVMO","CEVNA",
    "CEVNE","CEVNO","CEVON","CEVPA","CEVPE","CEVPO","CEVRA","CEVRE","CEVRO","CEVSA",
    "CEVSE","CEVSO","CEVTA","CEVTE","CEVTO","CEVVA","CEVVE","CEVVO","CHACA","CHACE",
    "CHACO","CHADA","CHADE","CHADO","CHAGA","CHAGE","CHAGO","CHALA","CHALE","CHALO",
    "CHAMA","CHAME","CHAMO","CHANA","CHANE","CHANO","CHAPA","CHAPE","CHAPO","CHARA",
    "CHARE","CHARO","CHASA","CHASE","CHASO","CHATA","CHATE","CHATO","CHAUN","CHAVO",
    "CHAYA","CHAYE","CHAYO","CHAZA","CHAZO","CHACO","CHACO","CHACO","CHACO","CHACO"
];

// ========================
// INICIALIZACIÓN
// ========================
document.addEventListener('DOMContentLoaded', async () => {
    await initializeApp();
    setupEventListeners();
    showScreen('roomScreen');
});

async function initializeApp() {
    currentUser = await waitForUser();
    if (!currentUser) {
        window.location.href = 'index.html';
        return;
    }
}

// ========================
// GESTIÓN DE PANTALLAS
// ========================
function showScreen(screenId) {
    document.querySelectorAll('.screen').forEach(screen => {
        screen.classList.remove('active');
    });
    document.getElementById(screenId).classList.add('active');
}

// ========================
// EVENT LISTENERS
// ========================
function setupEventListeners() {
    // Botones de sala
    document.getElementById('createRoomBtn').addEventListener('click', showCreateRoomPanel);
    document.getElementById('joinRoomBtn').addEventListener('click', showJoinRoomPanel);
    document.getElementById('confirmCreateBtn').addEventListener('click', createRoom);
    document.getElementById('confirmJoinBtn').addEventListener('click', joinRoom);
    document.getElementById('cancelCreateBtn').addEventListener('click', hideRoomPanels);
    document.getElementById('cancelJoinBtn').addEventListener('click', hideRoomPanels);
    document.getElementById('cancelRoomBtn').addEventListener('click', cancelRoom);
    document.getElementById('leaveGameBtn').addEventListener('click', leaveGame);

    // Panel de estadísticas
    document.getElementById('showStatsBtn').addEventListener('click', showStatsPanel);
    document.getElementById('closeStatsBtn').addEventListener('click', hideStatsPanel);

    // Panel de fin de partida
    document.getElementById('playAgainBtn').addEventListener('click', playAgain);
    document.getElementById('backToMenuBtn').addEventListener('click', backToMenu);

    // Teclado físico
    document.addEventListener('keydown', handlePhysicalKeyboard);
}

// ========================
// GESTIÓN DE SALAS
// ========================
function showCreateRoomPanel() {
    document.getElementById('createRoomPanel').style.display = 'block';
    document.getElementById('joinRoomPanel').style.display = 'none';
}

function showJoinRoomPanel() {
    document.getElementById('joinRoomPanel').style.display = 'block';
    document.getElementById('createRoomPanel').style.display = 'none';
}

function hideRoomPanels() {
    document.getElementById('createRoomPanel').style.display = 'none';
    document.getElementById('joinRoomPanel').style.display = 'none';
}

async function createRoom() {
    const rounds = parseInt(document.getElementById('roundsSelect').value);
    roomCode = generateRoomCode();
    isRoomCreator = true;

    // Crear documento de sala en Firestore
    const roomRef = doc(db, 'wordle1v1_rooms', roomCode);
    await setDoc(roomRef, {
        creatorId: currentUser.uid,
        creatorName: await getPlayerName(),
        opponentId: null,
        opponentName: null,
        totalRounds: rounds,
        currentRound: 1,
        player1CompletedRounds: 0,
        player2CompletedRounds: 0,
        player1Finished: false,
        player2Finished: false,
        status: 'waiting',
        createdAt: serverTimestamp(),
        currentWord: '',
        roundWords: [],
        player1Words: [],
        player2Words: []
    });

    // Mostrar código de sala
    document.getElementById('generatedCode').textContent = roomCode;
    document.getElementById('roomCodeDisplay').style.display = 'block';
    hideRoomPanels();

    // Escuchar cambios en la sala
    listenToRoom(roomCode);
}

async function joinRoom() {
    const inputCode = document.getElementById('roomCodeInput').value.toUpperCase().trim();
    if (!inputCode || inputCode.length !== 6) {
        showMessage('Código de sala inválido', 'error');
        return;
    }

    const roomRef = doc(db, 'wordle1v1_rooms', inputCode);
    const roomSnap = await getDoc(roomRef);

    if (!roomSnap.exists()) {
        showMessage('Sala no encontrada', 'error');
        return;
    }

    const roomData = roomSnap.data();
    if (roomData.status !== 'waiting') {
        showMessage('Sala llena o en juego', 'error');
        return;
    }

    if (roomData.creatorId === currentUser.uid) {
        showMessage('No puedes unirte a tu propia sala', 'error');
        return;
    }

    // Unirse a la sala
    roomCode = inputCode;
    isRoomCreator = false;
    
    await updateDoc(roomRef, {
        opponentId: currentUser.uid,
        opponentName: await getPlayerName(),
        status: 'playing'
    });

    // Iniciar el juego
    startGame(roomData);
}

function cancelRoom() {
    if (roomCode && isRoomCreator) {
        const roomRef = doc(db, 'wordle1v1_rooms', roomCode);
        deleteRoom(roomRef);
    }
    roomCode = null;
    isRoomCreator = false;
    document.getElementById('roomCodeDisplay').style.display = 'none';
    hideRoomPanels();
}

async function deleteRoom(roomRef) {
    try {
        await roomRef.delete();
    } catch (error) {
        console.error('Error al eliminar sala:', error);
    }
}

function generateRoomCode() {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let code = '';
    for (let i = 0; i < 6; i++) {
        code += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return code;
}

// ========================
// ESCUCHAR CAMBIOS EN SALA
// ========================
function listenToRoom(code) {
    const roomRef = doc(db, 'wordle1v1_rooms', code);
    
    onSnapshot(roomRef, (doc) => {
        if (!doc.exists()) {
            showMessage('La sala fue eliminada', 'error');
            cancelRoom();
            return;
        }

        const roomData = doc.data();
        currentRoom = roomData;

        // Sincronizar palabra actual
        if (roomData.currentWord && roomData.currentWord !== gameState.currentWord) {
            gameState.currentWord = roomData.currentWord;
        }

        if (roomData.status === 'playing' && !isRoomCreator) {
            startGame(roomData);
        } else if (roomData.status === 'playing' && isRoomCreator && gameState.gameStatus !== 'playing') {
            startGame(roomData);
        } else if (roomData.status === 'finished') {
            endGame(roomData);
        }
    });
}

// ========================
// GESTIÓN DEL JUEGO
// ========================
async function startGame(roomData) {
    gameState = {
        currentRound: roomData.currentRound,
        totalRounds: roomData.totalRounds,
        player1CompletedRounds: roomData.player1CompletedRounds || 0,
        player2CompletedRounds: roomData.player2CompletedRounds || 0,
        currentWord: roomData.currentWord || '',
        player1Words: roomData.player1Words || [],
        player2Words: roomData.player2Words || [],
        roundWords: roomData.roundWords || [],
        gameStatus: 'playing',
        player1Finished: roomData.player1Finished || false,
        player2Finished: roomData.player2Finished || false,
        // Estado individual de cada jugador
        player1State: {
            currentRow: 0,
            currentGuess: '',
            attempts: []
        },
        player2State: {
            currentRow: 0,
            currentGuess: '',
            attempts: []
        }
    };

    showScreen('gameScreen');
    initializeGame();
    updateUI();
    
    // Esperar a que la palabra esté disponible
    if (!gameState.currentWord && isRoomCreator) {
        await generateNewWord();
    } else if (!gameState.currentWord) {
        // Esperar a que el creador genere la palabra
        showMessage('Esperando palabra...', 'info');
    }
}

function initializeGame() {
    createBoard();
    createKeyboard();
    // Inicializar estado del jugador actual
    const playerState = isRoomCreator ? gameState.player1State : gameState.player2State;
    playerState.currentRow = 0;
    playerState.currentGuess = '';
    playerState.attempts = [];
}

function createBoard() {
    const board = document.getElementById('game-board');
    board.innerHTML = '';

    for (let i = 0; i < 6; i++) {
        const row = document.createElement('div');
        row.className = 'game-row';
        row.setAttribute('data-row', i);

        for (let j = 0; j < 5; j++) {
            const tile = document.createElement('div');
            tile.className = 'game-tile';
            tile.setAttribute('data-row', i);
            tile.setAttribute('data-col', j);
            row.appendChild(tile);
        }
        board.appendChild(row);
    }
}

function createKeyboard() {
    const keyboard = document.getElementById('keyboard');
    keyboard.innerHTML = '';

    const rows = [
        ['Q', 'W', 'E', 'R', 'T', 'Y', 'U', 'I', 'O', 'P'],
        ['A', 'S', 'D', 'F', 'G', 'H', 'J', 'K', 'L', 'Ñ'],
        ['ENTER', 'Z', 'X', 'C', 'V', 'B', 'N', 'M', 'BACKSPACE']
    ];

    rows.forEach((row, index) => {
        const keyboardRow = document.createElement('div');
        keyboardRow.className = 'keyboard-row';

        row.forEach(key => {
            const keyElement = document.createElement('button');
            keyElement.className = 'key';
            if (key === 'ENTER' || key === 'BACKSPACE') {
                keyElement.classList.add('wide');
            }
            keyElement.textContent = key === 'BACKSPACE' ? '⌫' : key;
            keyElement.addEventListener('click', () => handleKeyPress(key));
            keyboardRow.appendChild(keyElement);
        });

        keyboard.appendChild(keyboardRow);
    });
}

// ========================
// LÓGICA DEL JUEGO
// ========================
function handleKeyPress(key) {
    if (gameState.gameStatus !== 'playing') return;
    
    // Obtener estado del jugador actual
    const playerState = isRoomCreator ? gameState.player1State : gameState.player2State;

    if (key === 'ENTER') {
        submitGuess();
    } else if (key === 'BACKSPACE') {
        deleteLetter();
    } else if (playerState.currentGuess.length < 5) {
        addLetter(key);
    }
}

function handlePhysicalKeyboard(event) {
    if (gameState.gameStatus !== 'playing') return;

    const key = event.key.toUpperCase();
    if (key === 'ENTER') {
        event.preventDefault();
        handleKeyPress('ENTER');
    } else if (key === 'BACKSPACE') {
        event.preventDefault();
        handleKeyPress('BACKSPACE');
    } else if (key.length === 1 && key >= 'A' && key <= 'Z') {
        event.preventDefault();
        handleKeyPress(key);
    }
}

function addLetter(letter) {
    const playerState = isRoomCreator ? gameState.player1State : gameState.player2State;
    if (playerState.currentGuess.length < 5) {
        playerState.currentGuess += letter;
        updateCurrentRow();
    }
}

function deleteLetter() {
    const playerState = isRoomCreator ? gameState.player1State : gameState.player2State;
    if (playerState.currentGuess.length > 0) {
        playerState.currentGuess = playerState.currentGuess.slice(0, -1);
        updateCurrentRow();
    }
}

function updateCurrentRow() {
    const playerState = isRoomCreator ? gameState.player1State : gameState.player2State;
    const row = playerState.currentRow;
    const tiles = document.querySelectorAll(`[data-row="${row}"]`);
    
    tiles.forEach((tile, index) => {
        if (index < playerState.currentGuess.length) {
            tile.textContent = playerState.currentGuess[index];
            tile.classList.add('filled');
        } else {
            tile.textContent = '';
            tile.classList.remove('filled');
        }
    });
}

async function submitGuess() {
    const playerState = isRoomCreator ? gameState.player1State : gameState.player2State;
    
    if (!gameState.currentWord) {
        showMessage('Esperando palabra...', 'error');
        return;
    }

    if (playerState.currentGuess.length !== 5) {
        showMessage('La palabra debe tener 5 letras', 'error');
        return;
    }

    if (!isValidWord(playerState.currentGuess)) {
        showMessage('Palabra no válida', 'error');
        return;
    }

    // Evaluar la palabra
    const result = evaluateGuess(playerState.currentGuess, gameState.currentWord);
    updateRowWithResult(result);
    updateKeyboard(result);

    // Guardar intento
    const playerKey = isRoomCreator ? 'player1Words' : 'player2Words';
    const words = [...gameState[playerKey], { word: playerState.currentGuess, result }];
    gameState[playerKey] = words;
    playerState.attempts.push({ word: playerState.currentGuess, result });

    // Actualizar Firestore
    await updateRoomData({ [playerKey]: words });

    if (playerState.currentGuess === gameState.currentWord) {
        // Ganó la ronda
        await handleRoundWin();
    } else if (playerState.currentRow === 5) {
        // Perdió la ronda
        await handleRoundLoss();
    } else {
        // Siguiente intento
        playerState.currentRow++;
        playerState.currentGuess = '';
    }
}

function evaluateGuess(guess, target) {
    const result = [];
    const targetArray = target.split('');
    const guessArray = guess.split('');

    // Primera pasada: letras correctas
    for (let i = 0; i < 5; i++) {
        if (guessArray[i] === targetArray[i]) {
            result[i] = 'correct';
            targetArray[i] = null;
            guessArray[i] = null;
        }
    }

    // Segunda pasada: letras presentes
    for (let i = 0; i < 5; i++) {
        if (guessArray[i] !== null) {
            const index = targetArray.indexOf(guessArray[i]);
            if (index !== -1) {
                result[i] = 'present';
                targetArray[index] = null;
            } else {
                result[i] = 'absent';
            }
        }
    }

    return result;
}

function updateRowWithResult(result) {
    const playerState = isRoomCreator ? gameState.player1State : gameState.player2State;
    const row = playerState.currentRow;
    const tiles = document.querySelectorAll(`[data-row="${row}"]`);
    
    tiles.forEach((tile, index) => {
        setTimeout(() => {
            tile.classList.add(result[index]);
        }, index * 100);
    });
}

function updateKeyboard(result) {
    const playerState = isRoomCreator ? gameState.player1State : gameState.player2State;
    const row = playerState.currentRow;
    const guess = playerState.currentGuess;
    const keys = document.querySelectorAll('.key');
    
    keys.forEach(key => {
        const letter = key.textContent;
        const index = guess.indexOf(letter);
        
        if (index !== -1) {
            const currentStatus = key.classList.contains('correct') ? 'correct' :
                                 key.classList.contains('present') ? 'present' :
                                 key.classList.contains('absent') ? 'absent' : null;
            
            const newStatus = result[index];
            
            if (!currentStatus || 
                (currentStatus === 'absent' && newStatus !== 'absent') ||
                (currentStatus === 'present' && newStatus === 'correct')) {
                key.classList.remove('correct', 'present', 'absent');
                key.classList.add(newStatus);
            }
        }
    });
}

function isValidWord(word) {
    return words.includes(word.toUpperCase());
}

// ========================
// GESTIÓN DE RONDAS
// ========================
async function generateNewWord() {
    const word = words[Math.floor(Math.random() * words.length)];
    gameState.currentWord = word;
    gameState.roundWords.push(word);
    
    await updateRoomData({
        currentWord: word,
        roundWords: gameState.roundWords
    });
}

async function handleRoundWin() {
    const playerKey = isRoomCreator ? 'player1CompletedRounds' : 'player2CompletedRounds';
    const finishedKey = isRoomCreator ? 'player1Finished' : 'player2Finished';
    
    gameState[playerKey]++;
    
    showMessage('¡Adivinaste la palabra!', 'success');
    
    // Marcar si este jugador ha terminado todas sus rondas
    if (gameState[playerKey] >= gameState.totalRounds) {
        gameState[finishedKey] = true;
        await updateRoomData({ [finishedKey]: true });
        
        // Este jugador ha completado todas sus rondas, terminar el juego
        setTimeout(async () => {
            await endGame();
        }, 2000);
    } else {
        // Continuar con la siguiente ronda
        setTimeout(async () => {
            await nextRound();
        }, 2000);
    }
    
    // Actualizar el contador de rondas completadas
    await updateRoomData({ [playerKey]: gameState[playerKey] });
}

async function handleRoundLoss() {
    showMessage(`La palabra era: ${gameState.currentWord}`, 'error');
    
    // En el nuevo modo, si no adivinas la palabra, igual pasas a la siguiente ronda
    setTimeout(async () => {
        const playerKey = isRoomCreator ? 'player1CompletedRounds' : 'player2CompletedRounds';
        const finishedKey = isRoomCreator ? 'player1Finished' : 'player2Finished';
        
        gameState[playerKey]++;
        
        // Marcar si este jugador ha terminado todas sus rondas
        if (gameState[playerKey] >= gameState.totalRounds) {
            gameState[finishedKey] = true;
            await updateRoomData({ [finishedKey]: true, [playerKey]: gameState[playerKey] });
            
            // Este jugador ha completado todas sus rondas, terminar el juego
            setTimeout(async () => {
                await endGame();
            }, 1000);
        } else {
            // Continuar con la siguiente ronda
            await updateRoomData({ [playerKey]: gameState[playerKey] });
            setTimeout(async () => {
                await nextRound();
            }, 2000);
        }
    }, 3000);
}

async function nextRound() {
    gameState.currentRound++;
    
    // Reiniciar estado de ambos jugadores
    gameState.player1State.currentRow = 0;
    gameState.player1State.currentGuess = '';
    gameState.player1State.attempts = [];
    
    gameState.player2State.currentRow = 0;
    gameState.player2State.currentGuess = '';
    gameState.player2State.attempts = [];
    
    gameState.player1Words = [];
    gameState.player2Words = [];
    
    await updateRoomData({
        currentRound: gameState.currentRound,
        player1Words: [],
        player2Words: []
    });

    if (isRoomCreator) {
        await generateNewWord();
    }

    initializeGame();
    updateUI();
}

async function endGame() {
    gameState.gameStatus = 'finished';
    
    const roomRef = doc(db, 'wordle1v1_rooms', roomCode);
    await updateDoc(roomRef, { status: 'finished' });

    showGameOverPanel();
    saveStats();
}

function showGameOverPanel() {
    const panel = document.getElementById('gameOverPanel');
    const title = document.getElementById('gameOverTitle');
    const finalScore = document.getElementById('finalScore');
    const message = document.getElementById('gameOverMessage');

    const player1Completed = gameState.player1CompletedRounds;
    const player2Completed = gameState.player2CompletedRounds;
    
    // El ganador es quien completó más rondas (o quien terminó primero)
    const player1Won = player1Completed > player2Completed || 
                       (player1Completed === player2Completed && gameState.player1Finished && !gameState.player2Finished);
    const player2Won = player2Completed > player1Completed || 
                       (player1Completed === player2Completed && gameState.player2Finished && !gameState.player1Finished);
    
    const isWinner = isRoomCreator ? player1Won : player2Won;
    const isDraw = !player1Won && !player2Won;

    title.textContent = isDraw ? '¡Empate!' : (isWinner ? '¡Victoria!' : '¡Derrota!');
    
    finalScore.innerHTML = `
        <div>
            <div>${currentRoom?.creatorName || 'Jugador 1'}</div>
            <div>${player1Completed}/${gameState.totalRounds} rondas</div>
        </div>
        <div>
            <div>${currentRoom?.opponentName || 'Jugador 2'}</div>
            <div>${player2Completed}/${gameState.totalRounds} rondas</div>
        </div>
    `;

    if (isDraw) {
        message.textContent = '¡Ambos jugadores completaron las mismas rondas!';
    } else {
        message.textContent = isWinner ? '¡Completaste tus rondas primero!' : 'Tu oponente completó sus rondas primero';
    }

    panel.style.display = 'flex';
}

function saveStats() {
    const stats = {
        totalGames: (parseInt(localStorage.getItem('wordle1v1_totalGames') || '0') + 1),
        wins: parseInt(localStorage.getItem('wordle1v1_wins') || '0'),
        losses: parseInt(localStorage.getItem('wordle1v1_losses') || '0'),
        currentStreak: parseInt(localStorage.getItem('wordle1v1_currentStreak') || '0'),
        maxStreak: parseInt(localStorage.getItem('wordle1v1_maxStreak') || '0')
    };

    const isWinner = isRoomCreator ? 
        gameState.player1CompletedRounds > gameState.player2CompletedRounds || 
        (gameState.player1CompletedRounds === gameState.player2CompletedRounds && gameState.player1Finished && !gameState.player2Finished) :
        gameState.player2CompletedRounds > gameState.player1CompletedRounds || 
        (gameState.player1CompletedRounds === gameState.player2CompletedRounds && gameState.player2Finished && !gameState.player1Finished);

    if (isWinner) {
        stats.wins++;
        stats.currentStreak++;
        stats.maxStreak = Math.max(stats.maxStreak, stats.currentStreak);
    } else {
        stats.losses++;
        stats.currentStreak = 0;
    }

    localStorage.setItem('wordle1v1_totalGames', stats.totalGames.toString());
    localStorage.setItem('wordle1v1_wins', stats.wins.toString());
    localStorage.setItem('wordle1v1_losses', stats.losses.toString());
    localStorage.setItem('wordle1v1_currentStreak', stats.currentStreak.toString());
    localStorage.setItem('wordle1v1_maxStreak', stats.maxStreak.toString());
}

// ========================
// ACTUALIZACIÓN DE UI
// ========================
function updateUI() {
    document.getElementById('currentRound').textContent = gameState.currentRound;
    document.getElementById('totalRounds').textContent = gameState.totalRounds;
    
    // Mostrar progreso en lugar de puntuación
    const player1Progress = `${gameState.player1CompletedRounds}/${gameState.totalRounds}`;
    const player2Progress = `${gameState.player2CompletedRounds}/${gameState.totalRounds}`;
    
    document.getElementById('player1Score').textContent = player1Progress;
    document.getElementById('player2Score').textContent = player2Progress;
    
    if (currentRoom) {
        document.getElementById('player1Name').textContent = currentRoom.creatorName || 'Jugador 1';
        document.getElementById('player2Name').textContent = currentRoom.opponentName || 'Jugador 2';
    }
}

function showMessage(text, type = 'info') {
    const messageEl = document.getElementById('game-message');
    messageEl.textContent = text;
    messageEl.className = type;
    
    setTimeout(() => {
        messageEl.textContent = '';
        messageEl.className = '';
    }, 3000);
}

// ========================
// PANEL DE ESTADÍSTICAS
// ========================
function showStatsPanel() {
    const panel = document.getElementById('statsPanel');
    panel.style.display = 'flex';
    updateStatsDisplay();
}

function hideStatsPanel() {
    document.getElementById('statsPanel').style.display = 'none';
}

function updateStatsDisplay() {
    const totalGames = parseInt(localStorage.getItem('wordle1v1_totalGames') || '0');
    const wins = parseInt(localStorage.getItem('wordle1v1_wins') || '0');
    const losses = parseInt(localStorage.getItem('wordle1v1_losses') || '0');
    const currentStreak = parseInt(localStorage.getItem('wordle1v1_currentStreak') || '0');
    const maxStreak = parseInt(localStorage.getItem('wordle1v1_maxStreak') || '0');
    const winRate = totalGames > 0 ? Math.round((wins / totalGames) * 100) : 0;

    document.getElementById('totalWins').textContent = wins;
    document.getElementById('totalLosses').textContent = losses;
    document.getElementById('winRate').textContent = winRate + '%';
    document.getElementById('currentStreak').textContent = currentStreak;
}

// ========================
// ACCIONES POST-JUEGO
// ========================
function playAgain() {
    document.getElementById('gameOverPanel').style.display = 'none';
    showScreen('roomScreen');
    resetGame();
}

function backToMenu() {
    document.getElementById('gameOverPanel').style.display = 'none';
    showScreen('roomScreen');
    resetGame();
}

function leaveGame() {
    if (confirm('¿Estás seguro de que quieres abandonar la partida?')) {
        if (roomCode) {
            const roomRef = doc(db, 'wordle1v1_rooms', roomCode);
            if (isRoomCreator) {
                deleteRoom(roomRef);
            } else {
                updateDoc(roomRef, { 
                    status: 'abandoned',
                    opponentId: null,
                    opponentName: null
                });
            }
        }
        resetGame();
        showScreen('roomScreen');
    }
}

function resetGame() {
    gameState = {
        currentRound: 1,
        totalRounds: 5,
        player1CompletedRounds: 0,
        player2CompletedRounds: 0,
        currentWord: '',
        player1Words: [],
        player2Words: [],
        roundWords: [],
        gameStatus: 'waiting',
        player1Finished: false,
        player2Finished: false,
        // Estado individual de cada jugador
        player1State: {
            currentRow: 0,
            currentGuess: '',
            attempts: []
        },
        player2State: {
            currentRow: 0,
            currentGuess: '',
            attempts: []
        }
    };
    
    currentRoom = null;
    roomCode = null;
    isRoomCreator = false;
    
    hideRoomPanels();
    document.getElementById('roomCodeDisplay').style.display = 'none';
    document.getElementById('gameOverPanel').style.display = 'none';
}

// ========================
// UTILIDADES
// ========================
async function updateRoomData(data) {
    if (!roomCode) return;
    
    const roomRef = doc(db, 'wordle1v1_rooms', roomCode);
    await updateDoc(roomRef, data);
}
