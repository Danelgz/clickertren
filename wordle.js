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

// Lista de palabras fáciles (solo las palabras originales)
const easyWords = [
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
"VIRUS","VISTA","VIVEN","VIVIR","VIVOS","VOCES","VOLAR","VUELA","ZORRA","sobre","entre","habia","hasta","desde","puede","todos","parte","tiene","donde","mismo","ahora","otros","tanto","segun","menos","mundo","antes","forma","hacer","estos","mayor","hacia","ellos","hecho","mucho","quien","estan","lugar","otras","mejor","nuevo","decir","todas","luego","medio","estas","tenia","nunca","poder","veces","grupo","misma","nueva","mujer","cosas","tener","punto","noche","haber","fuera","usted","nadie","horas","tarde","estar","padre","gente","final","madre","cinco","siglo","meses","maria","seria","junto","aquel","dicho","casos","manos","nivel","podia","largo","falta","hemos","trata","algun","senor","claro","orden","buena","libro","igual","ellas","total","tengo","unico","pesar","calle","vista","campo","saber","obras","razon","ninos","estoy","quien","fondo","papel","demas","ambos","salud","media","deben","datos","julio","visto","llego","bueno","joven","hacia","sigue","cerca","valor","serie","hijos","juego","epoca","banco","menor","pasar","queda","hacen","resto","causa","vamos","apoyo","civil","pedro","libre","comun","dejar","salir","union","favor","clase","color","decia","quiza","unica","pueda","lleva","ayuda","donde","autor","suelo","viejo","tomar","siete","lucha","linea","pocos","norte","cargo","plaza","poner","viene","radio","puedo","amigo","habra","santa","sabia","viaje","vivir","quedo","exito","carta","miedo","negro","texto","mitad","fecha","seran","ideas","llega","lejos","facil","plazo","enero","atras","chile","fuego","costa","local","habla","tales","sueno","paris","capaz","podra","dolor","zonas","temas","junio","marco","mucha","dicen","busca","abril","lopez","armas","debia","grado","carne","llama","jorge","corte","etapa","tipos","deseo","marzo","jamas","curso","pablo","larga","lider","torno","somos","cielo","ambas","perez","doble","crear","casas","lista","leyes","jesus","grave","tenga","lunes","junta","estos","sitio","gusta","clara","moral","gusto","hotel","salio","nueve","abajo","estas","venta","ramon","aires","aguas","dicha","golpe","pobre","llevo","coche","leche","tarea","plata","dando","ganar","calor","suele","miles","ritmo","pasos","pesos","plano","jugar","gesto","vasco","gomez","pocas","verde","pidio","comer","fines","labor","justo","actos","museo","pagar","sabes","areas","santo","vieja","mario","reina","salvo","quiso","acaba","marca","pleno","brazo","acaso","error","seres","poeta","altos","hojas","darle","clave","votos","logro","sirve","deuda","feliz","tanta","mente","breve","firma","jaime","canal","conde","carga","reyes","abrir","cuyos","negra","morir","caida","banda","frase","bases","culpa","entra","hayan","diego","actor","sacar","murio","estas","saben","corto","david","salon","cifra","bolsa","fuese","serio","reino","plena","venia","aznar","legal","abrio","china","dedos","creer","voces","angel","temor","penso","dudas","lleno","vacio","ciclo","valle","llamo","pecho","honor","pedir","mirar","clima","punta","posee","entro","pacto","penal","llena","angel","disco","ideal","artes","villa","venir","miami","ruido","basta","tabla","avion","cuyas","hablo","humor","darse","ganas","dosis","altas","pared","perro","anade","viven","debio","hogar","pieza","firme","exige","polvo","luces","virus","nacio","animo","cesar","gasto","pausa","esten","playa","horno","japon","anual","norma","tomas","dulce","mando","chica","unido","acabo","solar","costo","tesis","toros","ocupa","patio","corta","senal","paseo","arena","dejan","barco","signo","arbol","vemos","oscar","pista","marta","modos","desea","pasan","vuelo","silla","chico","conto","feria","rueda","verse","hecha","ponen","rojas","matar","motor","rumbo","trato","pense","creia","borde","metro","creen","dueno","bajar","rusia","vidas","subir","droga","bajas","jefes","vivia","reloj","elena","danza","notas","suave","fotos","masas","arroz","islas","goles","fruto","torre","salas","vital","sabor","tasas","dieta","andar","pilar","rival","traje","techo","diria","ricos","salsa","amiga","haria","vivos","fidel","india","tocar","bajos","malos","oeste","rural","nariz","letra","logra","opera","acido","banca","canto","debil","plato","monte","etica","salen","pujol","danos","salto","moscu","bomba","surge","oreja","munoz","xviii","calma","baile","queso","mueve","euros","coste","ronda","kilos","rigor","ponia","cerro","palma","turno","grito","deber","ramas","lento","beber","actua","senti","salia","caido","huevo","corre","juega","trato","vigor","redes","venga","hagan","bella","daban","sufre","luisa","regla","poema","limon","dolar","crees","renta","prima","prisa","cajas","novia","caras","verlo","nieve","lados","rubio","echar","quede","suiza","socio","piano","otono","leido","prado","halla","jordi","grasa","menem","parar","unida","irene","nubes","dices","lanzo","pesca","solos","selva","falso","aquel","chino","adios","suyos","culto","guion","niega","envio","crema","situa","filas","nunez","balon","muere","hijas","lucia","ramos","felix","laura","ninas","malas","vivio","arias","pagos","caldo","serlo","quito","rayos","josep","ancho","aerea","duque","genes","piden","sofia","trece","penas","viuda","mesas","fallo","barra","primo","suena","grito","toman","preve","colon","crece","heroe","rocas","lenta","llave","haces","ajeno","hielo","drama","rango","toque","solas","subio","juana","solia","minas","lanza","rojos","fases","arabe","falsa","james","verla","metal","reves","ortiz","silva","evita","ruben","listo","fraga","nacer","seria","indio","pasta","parto","aviso","filme","pollo","duras","noble","bello","vidal","pelea","rabia","cinta","muros","copia","cuota","tramo","barro","cadiz","haran","ponga","carro","flujo","hueso","duros","tumba","diana","medir","presa","apoya","video","volvi","movil","trama","tenis","vayan","llevo","creyo","sexto","bahia","vinos","rosas","trajo","cobre","recta","oliva","patas","novio","justa","barba","acero","genio","vapor","curva","trate","diera","viena","cable","ciego","abuso","cuero","fruta","cerro","bravo","lucas","traer","bordo","negar","notar","vimos","oidos","julia","ojala","quita","serra","finca","gordo","vasos","trigo","preso","pedia","acusa","mando","opera","peter","sudor","peces","riego","sento","simon","hueco","citar","monto","acuso","asilo","nieto","falla","magia","flota","broma","copas","ajena","meter","vasca","votar","cubre","pisos","video","cerdo","capas","crudo","press","logro","rodea","quise","miran","milan","mateo","metio","boton","censo","daria","calvo","veian","golfo","males","maria","tiros","obvio","peron","mover","duelo","fijar","busco","reune","damas","lecho","gotas","cruel","metas","vease","rumor","casco","celda","fumar","vacia","litro","ondas","nobel","manda","aldea","locos","gases","quede","salga","smith","usado","digno","marco","placa","costo","aereo","cenar","traia","bruto","lleve","trago","papas","sabio","volar","rusos","pluma","risas","crean","hablo","opina","debes","asume","grano","pulso","fatal","gafas","vende","lagos","tirar","abria","firmo","naval","digna","amado","aguda","varon","ropas","tunel","circo","natal","queja","fibra","sello","causo","vacas","rompe","darme","coger","verme","falda","autos","ocupo","pardo","ceder","canta","celos","cobra","corea","saint","varia","envio","rubia","furia","lidia","trozo","coral","talla","viste","bonos","duran","pagan","hondo","judio","vivas","freud","abren","rivas","ariel","dadas","gallo","sobra","salta","fauna","duele","grita","joyas","barca","dados","suyas","tardo","cogio","sucia","altar","venus","henry","flora","ponce","urnas","marin","roque","rutas","times","macho","rasgo","frank","marti","lazos","saldo","acabo","vengo","aroma","plomo","cesar","tonto","botas","globo","formo","sutil","viera","veras","anton","sonar","trono","digas","veras","almas","agudo","duena","cruce","movia","orina","river","tenor","palos","pelos","pares","gusto","marte","naves","pongo","viajo","buque","sumar","eleva","sales","roman","lorca","ayudo","gorda","cesid","raton","harto","llamo","secas","jones","secos","ninez","sirva","huida","jerez","cueva","sexta","suman","velez","damos","senas","verso","hagas","hable","sucio","verle","dario","fijos","lavar","viaja","citas","mitos","cajon","jamon","gatos","linda","vejez","dejen","quito","lapso","paula","ancha","sonar","tonos","velas","emite","ciega","rioja","ratos","actuo","faena","feroz","bruno","movio","acude","girar","sainz","daran","ficha","apoyo","pinta","belga","cruzo","multa","camas","colmo","bares","cobro","acoso","tomas","banos","plana","prosa","haiti","ruina","besos","susto","manta","diosa","anoto","tropa","yendo","latin","cruza","frias","valia","libra","acera","digan","tinta","mares","celta","miras","album","rocio","tazas","extra","opone","porta","arcos","temia","gozar","aleja","frios","andan","ritos","telon","toreo","mapas","tokio","bolso","honda","llora","quedo","veran","calla","salto","nomas","tigre","verte","etico","venas","hilos","manga","fabio","paulo","yemas","envia","llano","traen","elias","pinos","corto","manto","mutua","burla","mixta","optar","becas","saenz","salvo","curar","fundo","soria","tacto","nacen","freno","sigan","tango","ratas","brown","texas","molde","balas","himno","sodio","lleno","razas","ligas","mejia","solto","bodas","andes","ricas","cauce","gijon","ayala","sexos","turco","alude","aulas","pekin","falto","focos","puros","aguja","dudar","galan","guapa","otero","brisa","leves","senos","lindo","finas","tribu","vicio","usaba","cerco","suizo","boxeo","huele","renfe","liano","jaula","louis","nacho","celia","temen","verbo","tibia","bando","mutuo","recto","anexo","cejas","rodar","cabia","tumor","flaco","narra","curas","telas","vocal","botin","debut","temer","canon","durar","parra","subia","ganan","cocer","mitin","funda","berta","raras","trapo","marea","sabra","guapo","avila","helms","torpe","resta","davis","hable","opino","veria","asoma","podre","quema","fugaz","guias","senda","comen","elige","vayas","betis","robar","lunar","xunta","entre","peste","tonta","llame","lapiz","mafia","segui","salva","situo","lucio","batir","cedio","beach","films","jabon","ruedo","tubos","ruego","belen","pasto","bolas","grand","pugna","roger","amada","tomen","bacon","sordo","amaba",
"CULPO","PICAS","PISCA","PISCO","PISPA","PISTE","PISTO","PITAO","PITAR","PITIO","PIUNE","PIURE","PIXEL","PIZCA","PIZCO","PLAGA","PLAYO","PLEBE","PLECA","PLEON","PLEPA","PLEXO","PLICA","POBRA","POCHA","POCHO","PODAR","PODIO","POISA","POISE","POLAR","POLCA","POLEA","POLEN","POLEO","POLIO","POLIR","POLLA","POMAR","POMPA","POMPO","PONTO","POPAR","POPEL","PORCO","PORNO","PORRA","PORRO","PORTE","POSA³","POSAR","POSCA","POSMA","POSTA","POSTE","POTAR","POTRA","POTRO","POYAL","POYAR","POZAL","POZOL","PRAVO","PRAZA","PREAR","PREDA","PREST","PRION","PRIOR","PROAL","PROBO","PROCO","PROEL","PROFE","PROLE","PRONO","PRORA","PRUNA","PRUNO","PUA±O","PUADO","PUBES","PUBIS","PUCHA","PUCHO","PUCIA","PUDAº","PUDIO","PUDIR","PUDOR","PUJAR","PULGA","PULIR","PULLA","PULPA","PULPO","PUMBA","PUNAR","PUNGA","PUNIR","PUPAR","PURA©","PURGA","PUSPO","PUYAR","PUZLE","PUZOL","QUAA","QUAO","QUARK","QUECO","QUEJO","QUENA","QUERA","QUICO","QUIER","QUIJO","QUILA","QUILO","QUIMA","QUIMO","QUINA","QUINO","QUIPA","QUIPU","QUISA","QUITE","QUIVI","RAA±A","RAA±O","RAAL","RAAZ","RABA","RABAL","RABEL","RABEO","RABIL","RACEL","RACHA","RACOR","RADAL","RAFAL","RAFEZ","RAFIA","RAGAº","RAGUA","RAHEZ","RAIDO","RAIJO","RAJA¡","RAJAR","RALEA","RALLO","RALLY","RAMAL","RAMIO","RAMPA","RANDA","RAPA©","RAPAR","RAPAZ","RAPTA","RAPTO","RAQUE","RASA","RASAR","RASCA","RASEL","RASPA","RATEO","RATIO","RAUCO","RAUDA","RAUDO","RAUTA","RAZAR","RAZIA","REALA","REAR","REATA","REATO","REBLE","REBOL","RECEL","RECIO","RECLE","RECRE","RECUA","REDAR","REDEL","REDIL","REDOL","REDOR","REDRO","REFEZ","REGAR","REGIO","REGIR","REJAL","RELA©","RELAX","RELEJ","RELSO","RELVA","REMAR","RENAL","RENCO","RENDA","RENGA","RENGO","RENIL","RENIO","RENTO","REOCA","REOJO","RESMA","RESOL","RESPE","RETAL","RETAR","RETEL","RETOR","RETRO","REUMA","REVER","REYAR","REZNO","RIA±A","RIADA","RICIA","RICIO","RIERA","RIFAR","RILAR","RIMAº","RIMAR","RINDE","RIPIA","RIPIO","RISCA","RISCO","RISPA","RISPO","RIZAL","RIZAR","ROA±A","ROANO","ROBDA","ROBLA","ROBLE","ROBRA","ROBRE","ROCHA","ROCHO","RODAL","RODAS","RODEO","RODIL","RODIO","ROELA","ROETE","ROGAR","ROJAL","ROJEZ","ROLAR","ROLDE","ROLEO","ROLLA","ROMA","ROMBO","ROMEO","RONCA","RONCE","RONCO","RONZA","RORAR","RORRO","ROSAL","ROSAR","ROSCA","ROSCO","ROSJO","ROTAL","ROTAR","ROTEN","ROTOR","ROUGE","ROZAR","ROZNO","RUA¡N","RUANA","RUANO","RUBA","RUBLO","RUBOR","RUBRO","RUCAR","RUCHE","RUCHO","RUCIO","RUECA","RUEJO","RUGAR","RUGBY","RUGIR","RULA©","RULAR","RUMA","RUMBA","RUMIA","RUNGO","RUPIA","RUSCO","RUSEL","RUTAR","RUTEL","SA³LO","SAA±A","SAAN","SABEO","SABLE","SABRE","SACHO","SACIO","SACRA","SACRE","SACRO","SAETA","SAFIR","SAGAº","SAGAZ","SAJAR","SALAR","SALAZ","SALCE","SALEA","SALEP","SALMA","SALMO","SALOL","SALPA","SALSO","SALVE","SAMBA","SAMBO","SAMIO","SAMPA","SANAR","SANCO","SANGO","SANIE","SANSA","SANSO","SAQUE","SARA","SARAO","SARDA","SARDE","SARDO","SARGA","SARGO","SARNA","SARRO","SARTA","SARZA","SARZO","SATIS","SAUCE","SAUNA","SAVIA","SAYAL","SEA±A","SECAR","SECTA","SECUA","SEDAL","SEDAR","SEGAR","SEGUR","SEIBO","SEICO","SEISE","SELTZ","SEMEN","SEMIS","SENIL","SEPIA","SEPTO","SERBA","SERBO","SERNA","SERPA","SERVO","SESA","SESEO","SESGA","SESGO","SESMA","SESMO","SETAL","SEUDO","SEXMA","SEXMO","SHORT","SIBIL","SICLO","SIDRA","SIEGA","SIENA","SIESO","SIGLA","SIGMA","SIGUA","SIJAº","SILBA","SILBO","SILFO","SILGA","SIMIA","SIMIO","SIMPA","SINGA","SIRGA","SIRGO","SIRIO","SIRLE","SIRTE","SISAL","SISAR","SISCA","SISEO","SISMO","SOBAR","SOBEO","SOCAZ","SOCHE","SOEZA","SOFA","SOFA¡","SOLAZ","SOLEN","SOLEO","SOLER","SOLFA","SOLIO","SOLLA","SOLLO","SONDA","SONIO","SONSO","SONTO","SOPAR","SOPLO","SOPOR","SORBA","SORBO","SORCE","SORDA","SORGO","SORNA","SORRA","SOSAL","SOSAR","SOSIA","SOTAR","SOTIL","SOTOL","SOVOZ","SPORT","SPRAY","STAND","STOCK","SUABO","SUATO","SUBEO","SUBTE","SUCHE","SUCRE","SUDAR","SUECO","SUELA","SUERO","SUEVO","SUFA","SUFRA","SUIDO","SUITA","SUITE","SULCO","SULLA","SUMIR","SUNCO","SUPRA","SURA¡","SURAL","SURCO","SURTO","TAA±O","TABA","TABAL","TABAº","TABEA","TABES","TABOR","TACAR","TACHA","TACHO","TAFIA","TAFUR","TAGUA","TAIFA","TAIGA","TAIMA","TAINA","TAIRA","TAIRE","TAITA","TAJA¡","TAJAº","TAJAR","TAJEA","TALAR","TALCO","TALED","TALGO","TALIO","TALLE","TALLO","TALMA","TALPA","TALUD","TAMAL","TAMBA","TAMBO","TAMIL","TAMIZ","TAMUL","TANDA","TANGA","TANKA","TANOR","TANZA","TAPAR","TAPEO","TAPIA","TAPIR","TAPIS","TAPIZ","TAQUE","TARAR","TARAY","TARCA","TARCO","TARJA","TARMA","TAROT","TARRA","TARRO","TARSO","TARTA","TASAR","TASCA","TASCO","TASIO","TASTO","TATAº","TATAS","TAUCA","TAULA","TAURO","TAZAR","TEA±A","TEAME","TEBEO","TECLE","TECOL","TEDIO","TEGEO","TEGUA","TEGUE","TEJAR","TEJER","TEMPO","TENAZ","TENCA","TENSO","TENUE","TEOSO","TEPAº","TERCO","TERMA","TERMO","TERNA","TERNE","TERNO","TERSO","TESAR","TESLA","TESTA","TESTE","TETAR","TETRA","TETRO","TEYAº","TIA±A","TIACA","TIARA","TIBAR","TIBIO","TIBOR","TIESO","TIFUS","TIGRA","TILDE","TILIA","TILLA","TILLO","TILMA","TIMAR","TIMBA","TIMBO","TIMOL","TIMPA","TINCA","TINGE","TINTE","TINTO","TIPLE","TIPOI","TIPOY","TIQUE","TIQUI","TIRIO","TIRSO","TIRTE","TISAº","TISIS","TISTE","TITA","TITAR","TITEO","TIZNA","TIZNE","TLACO","TOA±A","TOBAR","TOCHE","TOCHO","TOCIA","TOCIO","TOCTE","TOESA","TOJAL","TOLAº","TOLDO","TOLLA","TOLLO","TOLMO","TOLVA","TONA¡","TONA³","TONAL","TONAR","TONCA","TONDO","TONEL","TONGA","TONGO","TOPAR","TOPIA","TOPIL","TOQUI","TORAL","TORCA","TORCE","TORCO","TORDA","TORDO","TORGA","TORGO","TORIL","TORIO","TORMO","TORNA","TORSO","TORTA","TORVA","TORVO","TOSCA","TOSCO","TOSER","TOTA","TOZAL","TOZAR","TRAA","TRABA","TRABE","TRACA","TRACE","TRAO","TRAPA","TRAPE","TRARO","TRAVO","TRAZA","TRAZO","TREBO","TREFE","TREJA","TRENA","TRENO","TREPA","TREPE","TRETA","TRIAL","TRIAR","TRIGA","TRILE","TRINO","TRIPA","TRIPE","TRISA","TRIZA","TROCO","TROJA","TROJE","TROLA","TROLE","TRONA","TROPO","TROTE","TROVA","TROVO","TROYA","TROZA","TRUA©","TRUCA","TRUFA","TRUJA","TRUSA","TRUST","TUDEL","TUECA","TUECO","TUERA","TUERO","TUINA","TULIO","TULPA","TUMBO","TUNAL","TUNAR","TUNCA","TUNCO","TUNDA","TUNJO","TUNTA","TUPA","TUPA©","TUPIR","TURAR","TURBA","TURCA","TURMA","TURRA","TURRO","TUSAR","TUSCA","TUSCO","TUTAº","TUTEO","TUTOR","UA±A","UA±IR","UCASE","UCHAº","UEBOS","UFANO","UJIER","ULAGA","ULALA","ULANO","ULEMA","ULTRA","UMBRA","UMBRO","UMERO","UNCIA","UNCIR","UNGIR","UNJAº","UNTAR","UPUPA","URAPE","URATO","URDIR","URGIR","URUGA","USAA","USAJE","USIER","USINA","USUAL","USURA","UVADA","UVATE","UVERO","UVIAR","VACAR","VACUO","VAGAR","VAHAR","VAINA","VALA","VALAR","VALER","VALGO","VALLA","VALSE","VALVA","VARA","VARAL","VARAR","VAREA","VAREO","VARGA","VARIO","VARIZ","VASAR","VASTO","VATIO","VEDAR","VEJAR","VELAR","VELAY","VELIS","VELIZ","VELLO","VELOZ","VENAL","VENDA","VENDO","VERAZ","VERBA","VERGA","VERIL","VERJA","VESTE","VETAR","VEZAR","VIA±A","VIADA","VICHY","VICIA","VICTO","VIDRO","VIESA","VILOS","VINAL","VINAR","VINCA","VINCO","VINTA","VIRAL","VIRAR","VIRGO","VIRIL","VIRIO","VIROL","VISAR","VISCO","VISIR","VISOR","VITAR","VITRE","VIUDO","VIVAC","VIVAR","VIVAZ","VIVEZ","VOCEO","VODAº","VODCA","VODKA","VOILA","VOLEA","VOLEO","VOLVO","VORAZ","VOSEO","VOTRI","VUDAº","VUESO","VULGO","VULTO","VULVA","VUSCO","WEBER","YACAL","YACER","YACIO","YAGUA","YAMAO","YAMBO","YANTA","YAPAº","YAPAR","YARDA","YAREY","YATAY","YEDGO","YEDRA","YEGUA","YELGO","YELMO","YENTE","YERAL","YERBA","YERMO","YERNA","YERNO","YERRA","YERRO","YERSI","YERTO","YERVO","YESAL","YESAR","YESCA","YEZGO","YOGAR","YOGUI","YOGUR","YOQUI","YOYA³","YUCAL","YUMBO","YUNGA","YUNTA","YUNTO","YURA©","YURAS","YUYAL","ZABRA","ZABRO","ZACEO","ZAFAR","ZAFIO","ZAFIR","ZAFRA","ZAFRE","ZAGAL","ZAGUA","ZAIDA","ZAINA","ZAINO","ZALA¡","ZALBO","ZALEA","ZALEO","ZAMBA","ZAMBO","ZAMPA","ZANCA","ZANCO","ZANGA","ZANJA","ZAPAR","ZAQUE","ZARBO","ZARCO","ZARJA","ZARPA","ZARZA","ZARZO","ZEBRA","ZENDO","ZENIT","ZOCLO","ZOFRA","ZOILO","ZOIZO","ZOLLE","ZOMBI","ZOMPO","ZONAL","ZONDA","ZONTO","ZONZO","ZOPAS","ZOQUE","ZORRO","ZOTAL","ZUA±O","ZUAVO","ZUBIA","ZUECA","ZUECO","ZUELA","ZUIZA","ZULAº","ZULLA","ZUMBA","ZUMBO","ZUPIA","ZURBA","ZURDA","ZURDO","ZUREO","ZURRA","ZUZAR"
];

// Lista de palabras difíciles (todas las palabras incluyendo las nuevas)
const hardWords = [
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
"VIRUS","VISTA","VIVEN","VIVIR","VIVOS","VOCES","VOLAR","VUELA","ZORRA","sobre","entre","habia","hasta","desde","puede","todos","parte","tiene","donde","mismo","ahora","otros","tanto","segun","menos","mundo","antes","forma","hacer","estos","mayor","hacia","ellos","hecho","mucho","quien","estan","lugar","otras","mejor","nuevo","decir","todas","luego","medio","estas","tenia","nunca","poder","veces","grupo","misma","nueva","mujer","cosas","tener","punto","noche","haber","fuera","usted","nadie","horas","tarde","estar","padre","gente","final","madre","cinco","siglo","meses","maria","seria","junto","aquel","dicho","casos","manos","nivel","podia","largo","falta","hemos","trata","algun","senor","claro","orden","buena","libro","igual","ellas","total","tengo","unico","pesar","calle","vista","campo","saber","obras","razon","ninos","estoy","quien","fondo","papel","demas","ambos","salud","media","deben","datos","julio","visto","llego","bueno","joven","hacia","sigue","cerca","valor","serie","hijos","juego","epoca","banco","menor","pasar","queda","hacen","resto","causa","vamos","apoyo","civil","pedro","libre","comun","dejar","salir","union","favor","clase","color","decia","quiza","unica","pueda","lleva","ayuda","donde","autor","suelo","viejo","tomar","siete","lucha","linea","pocos","norte","cargo","plaza","poner","viene","radio","puedo","amigo","habra","santa","sabia","viaje","vivir","quedo","exito","carta","miedo","negro","texto","mitad","fecha","seran","ideas","llega","lejos","facil","plazo","enero","atras","chile","fuego","costa","local","habla","tales","sueno","paris","capaz","podra","dolor","zonas","temas","junio","marco","mucha","dicen","busca","abril","lopez","armas","debia","grado","carne","llama","jorge","corte","etapa","tipos","deseo","marzo","jamas","curso","pablo","larga","lider","torno","somos","cielo","ambas","perez","doble","crear","casas","lista","leyes","jesus","grave","tenga","lunes","junta","estos","sitio","gusta","clara","moral","gusto","hotel","salio","nueve","abajo","estas","venta","ramon","aires","aguas","dicha","golpe","pobre","llevo","coche","leche","tarea","plata","dando","ganar","calor","suele","miles","ritmo","pasos","pesos","plano","jugar","gesto","vasco","gomez","pocas","verde","pidio","comer","fines","labor","justo","actos","museo","pagar","sabes","areas","santo","vieja","mario","reina","salvo","quiso","acaba","marca","pleno","brazo","acaso","error","seres","poeta","altos","hojas","darle","clave","votos","logro","sirve","deuda","feliz","tanta","mente","breve","firma","jaime","canal","conde","carga","reyes","abrir","cuyos","negra","morir","caida","banda","frase","bases","culpa","entra","hayan","diego","actor","sacar","murio","estas","saben","corto","david","salon","cifra","bolsa","fuese","serio","reino","plena","venia","aznar","legal","abrio","china","dedos","creer","voces","angel","temor","penso","dudas","lleno","vacio","ciclo","valle","llamo","pecho","honor","pedir","mirar","clima","punta","posee","entro","pacto","penal","llena","angel","disco","ideal","artes","villa","venir","miami","ruido","basta","tabla","avion","cuyas","hablo","humor","darse","ganas","dosis","altas","pared","perro","anade","viven","debio","hogar","pieza","firme","exige","polvo","luces","virus","nacio","animo","cesar","gasto","pausa","esten","playa","horno","japon","anual","norma","tomas","dulce","mando","chica","unido","acabo","solar","costo","tesis","toros","ocupa","patio","corta","senal","paseo","arena","dejan","barco","signo","arbol","vemos","oscar","pista","marta","modos","desea","pasan","vuelo","silla","chico","conto","feria","rueda","verse","hecha","ponen","rojas","matar","motor","rumbo","trato","pense","creia","borde","metro","creen","dueno","bajar","rusia","vidas","subir","droga","bajas","jefes","vivia","reloj","elena","danza","notas","suave","fotos","masas","arroz","islas","goles","fruto","torre","salas","vital","sabor","tasas","dieta","andar","pilar","rival","traje","techo","diria","ricos","salsa","amiga","haria","vivos","fidel","india","tocar","bajos","malos","oeste","rural","nariz","letra","logra","opera","acido","banca","canto","debil","plato","monte","etica","salen","pujol","danos","salto","moscu","bomba","surge","oreja","munoz","xviii","calma","baile","queso","mueve","euros","coste","ronda","kilos","rigor","ponia","cerro","palma","turno","grito","deber","ramas","lento","beber","actua","senti","salia","caido","huevo","corre","juega","trato","vigor","redes","venga","hagan","bella","daban","sufre","luisa","regla","poema","limon","dolar","crees","renta","prima","prisa","cajas","novia","caras","verlo","nieve","lados","rubio","echar","quede","suiza","socio","piano","otono","leido","prado","halla","jordi","grasa","menem","parar","unida","irene","nubes","dices","lanzo","pesca","solos","selva","falso","aquel","chino","adios","suyos","culto","guion","niega","envio","crema","situa","filas","nunez","balon","muere","hijas","lucia","ramos","felix","laura","ninas","malas","vivio","arias","pagos","caldo","serlo","quito","rayos","josep","ancho","aerea","duque","genes","piden","sofia","trece","penas","viuda","mesas","fallo","barra","primo","suena","grito","toman","preve","colon","crece","heroe","rocas","lenta","llave","haces","ajeno","hielo","drama","rango","toque","solas","subio","juana","solia","minas","lanza","rojos","fases","arabe","falsa","james","verla","metal","reves","ortiz","silva","evita","ruben","listo","fraga","nacer","seria","indio","pasta","parto","aviso","filme","pollo","duras","noble","bello","vidal","pelea","rabia","cinta","muros","copia","cuota","tramo","barro","cadiz","haran","ponga","carro","flujo","hueso","duros","tumba","diana","medir","presa","apoya","video","volvi","movil","trama","tenis","vayan","llevo","creyo","sexto","bahia","vinos","rosas","trajo","cobre","recta","oliva","patas","novio","justa","barba","acero","genio","vapor","curva","trate","diera","viena","cable","ciego","abuso","cuero","fruta","cerro","bravo","lucas","traer","bordo","negar","notar","vimos","oidos","julia","ojala","quita","serra","finca","gordo","vasos","trigo","preso","pedia","acusa","mando","opera","peter","sudor","peces","riego","sento","simon","hueco","citar","monto","acuso","asilo","nieto","falla","magia","flota","broma","copas","ajena","meter","vasca","votar","cubre","pisos","video","cerdo","capas","crudo","press","logro","rodea","quise","miran","milan","mateo","metio","boton","censo","daria","calvo","veian","golfo","males","maria","tiros","obvio","peron","mover","duelo","fijar","busco","reune","damas","lecho","gotas","cruel","metas","vease","rumor","casco","celda","fumar","vacia","litro","ondas","nobel","manda","aldea","locos","gases","quede","salga","smith","usado","digno","marco","placa","costo","aereo","cenar","traia","bruto","lleve","trago","papas","sabio","volar","rusos","pluma","risas","crean","hablo","opina","debes","asume","grano","pulso","fatal","gafas","vende","lagos","tirar","abria","firmo","naval","digna","amado","aguda","varon","ropas","tunel","circo","natal","queja","fibra","sello","causo","vacas","rompe","darme","coger","verme","falda","autos","ocupo","pardo","ceder","canta","celos","cobra","corea","saint","varia","envio","rubia","furia","lidia","trozo","coral","talla","viste","bonos","duran","pagan","hondo","judio","vivas","freud","abren","rivas","ariel","dadas","gallo","sobra","salta","fauna","duele","grita","joyas","barca","dados","suyas","tardo","cogio","sucia","altar","venus","henry","flora","ponce","urnas","marin","roque","rutas","times","macho","rasgo","frank","marti","lazos","saldo","acabo","vengo","aroma","plomo","cesar","tonto","botas","globo","formo","sutil","viera","veras","anton","sonar","trono","digas","veras","almas","agudo","duena","cruce","movia","orina","river","tenor","palos","pelos","pares","gusto","marte","naves","pongo","viajo","buque","sumar","eleva","sales","roman","lorca","ayudo","gorda","cesid","raton","harto","llamo","secas","jones","secos","ninez","sirva","huida","jerez","cueva","sexta","suman","velez","damos","senas","verso","hagas","hable","sucio","verle","dario","fijos","lavar","viaja","citas","mitos","cajon","jamon","gatos","linda","vejez","dejen","quito","lapso","paula","ancha","sonar","tonos","velas","emite","ciega","rioja","ratos","actuo","faena","feroz","bruno","movio","acude","girar","sainz","daran","ficha","apoyo","pinta","belga","cruzo","multa","camas","colmo","bares","cobro","acoso","tomas","banos","plana","prosa","haiti","ruina","besos","susto","manta","diosa","anoto","tropa","yendo","latin","cruza","frias","valia","libra","acera","digan","tinta","mares","celta","miras","album","rocio","tazas","extra","opone","porta","arcos","temia","gozar","aleja","frios","andan","ritos","telon","toreo","mapas","tokio","bolso","honda","llora","quedo","veran","calla","salto","nomas","tigre","verte","etico","venas","hilos","manga","fabio","paulo","yemas","envia","llano","traen","elias","pinos","corto","manto","mutua","burla","mixta","optar","becas","saenz","salvo","curar","fundo","soria","tacto","nacen","freno","sigan","tango","ratas","brown","texas","molde","balas","himno","sodio","lleno","razas","ligas","mejia","solto","bodas","andes","ricas","cauce","gijon","ayala","sexos","turco","alude","aulas","pekin","falto","focos","puros","aguja","dudar","galan","guapa","otero","brisa","leves","senos","lindo","finas","tribu","vicio","usaba","cerco","suizo","boxeo","huele","renfe","liano","jaula","louis","nacho","celia","temen","verbo","tibia","bando","mutuo","recto","anexo","cejas","rodar","cabia","tumor","flaco","narra","curas","telas","vocal","botin","debut","temer","canon","durar","parra","subia","ganan","cocer","mitin","funda","berta","raras","trapo","marea","sabra","guapo","avila","helms","torpe","resta","davis","hable","opino","veria","asoma","podre","quema","fugaz","guias","senda","comen","elige","vayas","betis","robar","lunar","xunta","entre","peste","tonta","llame","lapiz","mafia","segui","salva","situo","lucio","batir","cedio","beach","films","jabon","ruedo","tubos","ruego","belen","pasto","bolas","grand","pugna","roger","amada","tomen","bacon","sordo","amaba","CULPO","PICAS","PISCA","PISCO","PISPA","PISTE","PISTO","PITAO","PITAR","PITIO","PIUNE","PIURE","PIXEL","PIZCA","PIZCO","PLAGA","PLAYO","PLEBE","PLECA","PLEON","PLEPA","PLEXO","PLICA","POBRA","POCHA","POCHO","PODAR","PODIO","POISA","POISE","POLAR","POLCA","POLEA","POLEN","POLEO","POLIO","POLIR","POLLA","POMAR","POMPA","POMPO","PONTO","POPAR","POPEL","PORCO","PORNO","PORRA","PORRO","PORTE","POSA³","POSAR","POSCA","POSMA","POSTA","POSTE","POTAR","POTRA","POTRO","POYAL","POYAR","POZAL","POZOL","PRAVO","PRAZA","PREAR","PREDA","PREST","PRION","PRIOR","PROAL","PROBO","PROCO","PROEL","PROFE","PROLE","PRONO","PRORA","PRUNA","PRUNO","PUA±O","PUADO","PUBES","PUBIS","PUCHA","PUCHO","PUCIA","PUDAº","PUDIO","PUDIR","PUDOR","PUJAR","PULGA","PULIR","PULLA","PULPA","PULPO","PUMBA","PUNAR","PUNGA","PUNIR","PUPAR","PURA©","PURGA","PUSPO","PUYAR","PUZLE","PUZOL","QUAA","QUAO","QUARK","QUECO","QUEJO","QUENA","QUERA","QUICO","QUIER","QUIJO","QUILA","QUILO","QUIMA","QUIMO","QUINA","QUINO","QUIPA","QUIPU","QUISA","QUITE","QUIVI","RAA±A","RAA±O","RAAL","RAAZ","RABA","RABAL","RABEL","RABEO","RABIL","RACEL","RACHA","RACOR","RADAL","RAFAL","RAFEZ","RAFIA","RAGAº","RAGUA","RAHEZ","RAIDO","RAIJO","RAJA¡","RAJAR","RALEA","RALLO","RALLY","RAMAL","RAMIO","RAMPA","RANDA","RAPA©","RAPAR","RAPAZ","RAPTA","RAPTO","RAQUE","RASA","RASAR","RASCA","RASEL","RASPA","RATEO","RATIO","RAUCO","RAUDA","RAUDO","RAUTA","RAZAR","RAZIA","REALA","REAR","REATA","REATO","REBLE","REBOL","RECEL","RECIO","RECLE","RECRE","RECUA","REDAR","REDEL","REDIL","REDOL","REDOR","REDRO","REFEZ","REGAR","REGIO","REGIR","REJAL","RELA©","RELAX","RELEJ","RELSO","RELVA","REMAR","RENAL","RENCO","RENDA","RENGA","RENGO","RENIL","RENIO","RENTO","REOCA","REOJO","RESMA","RESOL","RESPE","RETAL","RETAR","RETEL","RETOR","RETRO","REUMA","REVER","REYAR","REZNO","RIA±A","RIADA","RICIA","RICIO","RIERA","RIFAR","RILAR","RIMAº","RIMAR","RINDE","RIPIA","RIPIO","RISCA","RISCO","RISPA","RISPO","RIZAL","RIZAR","ROA±A","ROANO","ROBDA","ROBLA","ROBLE","ROBRA","ROBRE","ROCHA","ROCHO","RODAL","RODAS","RODEO","RODIL","RODIO","ROELA","ROETE","ROGAR","ROJAL","ROJEZ","ROLAR","ROLDE","ROLEO","ROLLA","ROMA","ROMBO","ROMEO","RONCA","RONCE","RONCO","RONZA","RORAR","RORRO","ROSAL","ROSAR","ROSCA","ROSCO","ROSJO","ROTAL","ROTAR","ROTEN","ROTOR","ROUGE","ROZAR","ROZNO","RUA¡N","RUANA","RUANO","RUBA","RUBLO","RUBOR","RUBRO","RUCAR","RUCHE","RUCHO","RUCIO","RUECA","RUEJO","RUGAR","RUGBY","RUGIR","RULA©","RULAR","RUMA","RUMBA","RUMIA","RUNGO","RUPIA","RUSCO","RUSEL","RUTAR","RUTEL","SA³LO","SAA±A","SAAN","SABEO","SABLE","SABRE","SACHO","SACIO","SACRA","SACRE","SACRO","SAETA","SAFIR","SAGAº","SAGAZ","SAJAR","SALAR","SALAZ","SALCE","SALEA","SALEP","SALMA","SALMO","SALOL","SALPA","SALSO","SALVE","SAMBA","SAMBO","SAMIO","SAMPA","SANAR","SANCO","SANGO","SANIE","SANSA","SANSO","SAQUE","SARA","SARAO","SARDA","SARDE","SARDO","SARGA","SARGO","SARNA","SARRO","SARTA","SARZA","SARZO","SATIS","SAUCE","SAUNA","SAVIA","SAYAL","SEA±A","SECAR","SECTA","SECUA","SEDAL","SEDAR","SEGAR","SEGUR","SEIBO","SEICO","SEISE","SELTZ","SEMEN","SEMIS","SENIL","SEPIA","SEPTO","SERBA","SERBO","SERNA","SERPA","SERVO","SESA","SESEO","SESGA","SESGO","SESMA","SESMO","SETAL","SEUDO","SEXMA","SEXMO","SHORT","SIBIL","SICLO","SIDRA","SIEGA","SIENA","SIESO","SIGLA","SIGMA","SIGUA","SIJAº","SILBA","SILBO","SILFO","SILGA","SIMIA","SIMIO","SIMPA","SINGA","SIRGA","SIRGO","SIRIO","SIRLE","SIRTE","SISAL","SISAR","SISCA","SISEO","SISMO","SOBAR","SOBEO","SOCAZ","SOCHE","SOEZA","SOFA","SOFA¡","SOLAZ","SOLEN","SOLEO","SOLER","SOLFA","SOLIO","SOLLA","SOLLO","SONDA","SONIO","SONSO","SONTO","SOPAR","SOPLO","SOPOR","SORBA","SORBO","SORCE","SORDA","SORGO","SORNA","SORRA","SOSAL","SOSAR","SOSIA","SOTAR","SOTIL","SOTOL","SOVOZ","SPORT","SPRAY","STAND","STOCK","SUABO","SUATO","SUBEO","SUBTE","SUCHE","SUCRE","SUDAR","SUECO","SUELA","SUERO","SUEVO","SUFA","SUFRA","SUIDO","SUITA","SUITE","SULCO","SULLA","SUMIR","SUNCO","SUPRA","SURA¡","SURAL","SURCO","SURTO","TAA±O","TABA","TABAL","TABAº","TABEA","TABES","TABOR","TACAR","TACHA","TACHO","TAFIA","TAFUR","TAGUA","TAIFA","TAIGA","TAIMA","TAINA","TAIRA","TAIRE","TAITA","TAJA¡","TAJAº","TAJAR","TAJEA","TALAR","TALCO","TALED","TALGO","TALIO","TALLE","TALLO","TALMA","TALPA","TALUD","TAMAL","TAMBA","TAMBO","TAMIL","TAMIZ","TAMUL","TANDA","TANGA","TANKA","TANOR","TANZA","TAPAR","TAPEO","TAPIA","TAPIR","TAPIS","TAPIZ","TAQUE","TARAR","TARAY","TARCA","TARCO","TARJA","TARMA","TAROT","TARRA","TARRO","TARSO","TARTA","TASAR","TASCA","TASCO","TASIO","TASTO","TATAº","TATAS","TAUCA","TAULA","TAURO","TAZAR","TEA±A","TEAME","TEBEO","TECLE","TECOL","TEDIO","TEGEO","TEGUA","TEGUE","TEJAR","TEJER","TEMPO","TENAZ","TENCA","TENSO","TENUE","TEOSO","TEPAº","TERCO","TERMA","TERMO","TERNA","TERNE","TERNO","TERSO","TESAR","TESLA","TESTA","TESTE","TETAR","TETRA","TETRO","TEYAº","TIA±A","TIACA","TIARA","TIBAR","TIBIO","TIBOR","TIESO","TIFUS","TIGRA","TILDE","TILIA","TILLA","TILLO","TILMA","TIMAR","TIMBA","TIMBO","TIMOL","TIMPA","TINCA","TINGE","TINTE","TINTO","TIPLE","TIPOI","TIPOY","TIQUE","TIQUI","TIRIO","TIRSO","TIRTE","TISAº","TISIS","TISTE","TITA","TITAR","TITEO","TIZNA","TIZNE","TLACO","TOA±A","TOBAR","TOCHE","TOCHO","TOCIA","TOCIO","TOCTE","TOESA","TOJAL","TOLAº","TOLDO","TOLLA","TOLLO","TOLMO","TOLVA","TONA¡","TONA³","TONAL","TONAR","TONCA","TONDO","TONEL","TONGA","TONGO","TOPAR","TOPIA","TOPIL","TOQUI","TORAL","TORCA","TORCE","TORCO","TORDA","TORDO","TORGA","TORGO","TORIL","TORIO","TORMO","TORNA","TORSO","TORTA","TORVA","TORVO","TOSCA","TOSCO","TOSER","TOTA","TOZAL","TOZAR","TRAA","TRABA","TRABE","TRACA","TRACE","TRAO","TRAPA","TRAPE","TRARO","TRAVO","TRAZA","TRAZO","TREBO","TREFE","TREJA","TRENA","TRENO","TREPA","TREPE","TRETA","TRIAL","TRIAR","TRIGA","TRILE","TRINO","TRIPA","TRIPE","TRISA","TRIZA","TROCO","TROJA","TROJE","TROLA","TROLE","TRONA","TROPO","TROTE","TROVA","TROVO","TROYA","TROZA","TRUA©","TRUCA","TRUFA","TRUJA","TRUSA","TRUST","TUDEL","TUECA","TUECO","TUERA","TUERO","TUINA","TULIO","TULPA","TUMBO","TUNAL","TUNAR","TUNCA","TUNCO","TUNDA","TUNJO","TUNTA","TUPA","TUPA©","TUPIR","TURAR","TURBA","TURCA","TURMA","TURRA","TURRO","TUSAR","TUSCA","TUSCO","TUTAº","TUTEO","TUTOR","UA±A","UA±IR","UCASE","UCHAº","UEBOS","UFANO","UJIER","ULAGA","ULALA","ULANO","ULEMA","ULTRA","UMBRA","UMBRO","UMERO","UNCIA","UNCIR","UNGIR","UNJAº","UNTAR","UPUPA","URAPE","URATO","URDIR","URGIR","URUGA","USAA","USAJE","USIER","USINA","USUAL","USURA","UVADA","UVATE","UVERO","UVIAR","VACAR","VACUO","VAGAR","VAHAR","VAINA","VALA","VALAR","VALER","VALGO","VALLA","VALSE","VALVA","VARA","VARAL","VARAR","VAREA","VAREO","VARGA","VARIO","VARIZ","VASAR","VASTO","VATIO","VEDAR","VEJAR","VELAR","VELAY","VELIS","VELIZ","VELLO","VELOZ","VENAL","VENDA","VENDO","VERAZ","VERBA","VERGA","VERIL","VERJA","VESTE","VETAR","VEZAR","VIA±A","VIADA","VICHY","VICIA","VICTO","VIDRO","VIESA","VILOS","VINAL","VINAR","VINCA","VINCO","VINTA","VIRAL","VIRAR","VIRGO","VIRIL","VIRIO","VIROL","VISAR","VISCO","VISIR","VISOR","VITAR","VITRE","VIUDO","VIVAC","VIVAR","VIVAZ","VIVEZ","VOCEO","VODAº","VODCA","VODKA","VOILA","VOLEA","VOLEO","VOLVO","VORAZ","VOSEO","VOTRI","VUDAº","VUESO","VULGO","VULTO","VULVA","VUSCO","WEBER","YACAL","YACER","YACIO","YAGUA","YAMAO","YAMBO","YANTA","YAPAº","YAPAR","YARDA","YAREY","YATAY","YEDGO","YEDRA","YEGUA","YELGO","YELMO","YENTE","YERAL","YERBA","YERMO","YERNA","YERNO","YERRA","YERRO","YERSI","YERTO","YERVO","YESAL","YESAR","YESCA","YEZGO","YOGAR","YOGUI","YOGUR","YOQUI","YOYA³","YUCAL","YUMBO","YUNGA","YUNTA","YUNTO","YURA©","YURAS","YUYAL","ZABRA","ZABRO","ZACEO","ZAFAR","ZAFIO","ZAFIR","ZAFRA","ZAFRE","ZAGAL","ZAGUA","ZAIDA","ZAINA","ZAINO","ZALA¡","ZALBO","ZALEA","ZALEO","ZAMBA","ZAMBO","ZAMPA","ZANCA","ZANCO","ZANGA","ZANJA","ZAPAR","ZAQUE","ZARBO","ZARCO","ZARJA","ZARPA","ZARZA","ZARZO","ZEBRA","ZENDO","ZENIT","ZOCLO","ZOFRA","ZOILO","ZOIZO","ZOLLE","ZOMBI","ZOMPO","ZONAL","ZONDA","ZONTO","ZONZO","ZOPAS","ZOQUE","ZORRO","ZOTAL","ZUA±O","ZUAVO","ZUBIA","ZUECA","ZUECO","ZUELA","ZUIZA","ZULAº","ZULLA","ZUMBA","ZUMBO","ZUPIA","ZURBA","ZURDA","ZURDO","ZUREO","ZURRA","ZUZAR"
];

// Variable global para guardar las palabras seleccionadas según la dificultad
let words = easyWords; // Por defecto, dificultad fácil

// Función para cambiar la dificultad
function changeDifficulty(difficulty) {
    if (difficulty === 'easy') {
        words = easyWords;
    } else if (difficulty === 'hard') {
        words = hardWords;
    }
    
    // Actualizar estados de los botones
    const easyBtn = document.getElementById('easyBtn');
    const hardBtn = document.getElementById('hardBtn');
    
    if (difficulty === 'easy') {
        easyBtn.classList.add('active');
        hardBtn.classList.remove('active');
    } else {
        easyBtn.classList.remove('active');
        hardBtn.classList.add('active');
    }
    
    // Si ya hay un juego en curso, reiniciarlo con la nueva dificultad
    if (window.game) {
        window.game.words = words.map(w => normalizeNoAccents(w)).filter(w => w.length === 5);
        window.game.validWordsSet = new Set(window.game.words.map(w => normalizeNoAccents(w)));
        window.game.currentWord = window.game.getDailyWord();
        window.game.resetGame();
    }
    
    // Guardar la preferencia de dificultad
    localStorage.setItem('wordleDifficulty', difficulty);
}

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

// ========================
// CLASE WORDLEGAME
// ========================
class WordleGame {
    constructor(words) {
        // Cargar la dificultad guardada o usar fácil por defecto
        const savedDifficulty = localStorage.getItem('wordleDifficulty') || 'easy';
        if (savedDifficulty === 'hard') {
            words = hardWords;
        } else {
            words = easyWords;
        }
        
        this.words = words.map(w => normalizeNoAccents(w)).filter(w => w.length === 5);
        
        // Construimos el set con entradas normalizadas (sin tildes, con Ñ conservada)
        this.validWordsSet = new Set(this.words.map(w => normalizeNoAccents(w)));
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
        this.isProcessing = false; // Flag to prevent multiple submissions

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

    resetGame() {
        this.currentWord = this.getDailyWord();
        this.currentRow = 0;
        this.currentCol = 0;
        this.gameOver = false;
        this.savedBoardState = null;
        this.savedKeyboardState = null;
        
        // Limpiar el tablero
        this.board.forEach(row => row.forEach(tile => {
            tile.textContent = '';
            tile.className = 'tile';
        }));
        
        // Limpiar el teclado
        Object.values(this.keyMap).forEach(btn => {
            btn.className = 'key';
        });
        
        this.updateCurrentRowClass();
        this.showMessage('');
    }

    randomWord() {
        return this.words[Math.floor(Math.random() * this.words.length)];
    }

    // Generar una palabra aleatoria
    getDailyWord() {
        return this.randomWord();
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
            for (let c = 0; c < 5; c++) {
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
                for (let c = 0; c < 5; c++) {
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
            for (let c = 0; c < 5; c++) {
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
        return this.validWordsSet.has(norm);
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
        if (this.gameOver || this.isProcessing) return;
        if (key === "ENTER") { 
            this.checkWord(); 
            return; 
        }
        if (key === "DEL") { this.deleteLetter(); return; }
        if (this.currentCol < 5) {
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
        if (this.isProcessing) return;
        if (this.currentCol < 5) {
            this.showMessage('✏️ Escribe 5 letras');
            return;
        }

        // Set processing flag to prevent multiple submissions
        this.isProcessing = true;

        let guess = "";
        for (let c = 0; c < 5; c++) guess += this.board[this.currentRow][c].textContent;

        if (!this.isValidWord(guess)) {
            this.showMessage('❌ Palabra no válida');
            const row = this.board[this.currentRow];
            row.forEach(tile => tile.classList.add('shake'));
            setTimeout(() => {
                row.forEach(tile => tile.classList.remove('shake'));
                this.isProcessing = false; // Reset processing flag
            }, 500);
            return;
        }

        // Comparar sin tildes, con Ñ conservada
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

        // Animación reveal
        for (let c = 0; c < 5; c++) {
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
                this.isProcessing = false; // Reset processing flag
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
                    this.isProcessing = false; // Reset processing flag
                    setTimeout(() => this.nextLevel(), 2500);
                } else {
                    this.isProcessing = false; // Reset processing flag for next attempt
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
        this.isProcessing = false; // Reset processing flag for new level
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
        this.currentWord = this.getDailyWord(); // Generar nueva palabra aleatoria
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

    // Establecer el estado correcto de los botones de dificultad
    const savedDifficulty = localStorage.getItem('wordleDifficulty') || 'easy';
    changeDifficulty(savedDifficulty);

    const game = new WordleGame(words);
    window.game = game; // Guardar referencia global para poder acceder desde changeDifficulty
    await game.loadStats();
}
init();
