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

// ========================
// DICCIONARIO COMPLETO — guardado como Set normalizado (sin tildes, sin Ñ→N)
// Todas las comparaciones se harán normalizadas
// ========================
const rawValidWords = [
...words,
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
        this.words = words.map(w => normalizeNoAccents(w)).filter(w => w.length === 5);
        this.level = parseInt(localStorage.getItem('level')) || 1;
        this.totalWins = parseInt(localStorage.getItem('totalWins')) || 0;
        this.winAttempts = JSON.parse(localStorage.getItem('winAttempts')) || [0,0,0,0,0,0];

        this.currentWord = this.randomWord();
        this.currentRow = 0;
        this.currentCol = 0;
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
                this.boardDiv.appendChild(tile);
                row.push(tile);
            }
            this.board.push(row);
        }
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

    handleKey(key) {
        if (this.gameOver) return;
        if (key === "ENTER") { this.checkWord(); return; }
        if (key === "DEL") { this.deleteLetter(); return; }
        if (this.currentCol < 5) {
            const tile = this.board[this.currentRow][this.currentCol];
            tile.textContent = key;
            tile.classList.add('filled');
            this.currentCol++;
        }
    }

    deleteLetter() {
        if (this.currentCol > 0) {
            this.currentCol--;
            const tile = this.board[this.currentRow][this.currentCol];
            tile.textContent = '';
            tile.classList.remove('filled');
        }
    }

    checkWord() {
        if (this.currentCol < 5) {
            this.showMessage('✏️ Escribe 5 letras');
            return;
        }

        let guess = "";
        for (let c = 0; c < 5; c++) guess += this.board[this.currentRow][c].textContent;

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
                this.showMessage('¡Correcto! 🎉', 0);
                this.gameOver = true;
                setTimeout(() => this.nextLevel(), 2000);
            } else {
                this.currentRow++;
                this.currentCol = 0;
                if (this.currentRow >= 6) {
                    this.showMessage(`La palabra era: ${this.currentWord}`, 0);
                    this.gameOver = true;
                    setTimeout(() => this.nextLevel(), 2500);
                }
            }
            this.saveStats();
        }, 5 * 250 + 400);
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
        Object.values(this.keyMap).forEach(btn => {
            btn.classList.remove('correct', 'present', 'absent');
        });
        this.currentWord = this.randomWord();
        this.level++;
        this.updateLevelDisplay();
    }

    saveStats() {
        localStorage.setItem('level', this.level);
        localStorage.setItem('totalWins', this.totalWins);
        localStorage.setItem('winAttempts', JSON.stringify(this.winAttempts));
        this.updateStatsDisplay();
    }

    updateStatsDisplay() {
        const totalEl = document.getElementById('totalWins');
        if (totalEl) totalEl.textContent = this.totalWins;
        for (let i = 0; i < 6; i++) {
            const el = document.getElementById('win' + (i + 1));
            if (el) el.textContent = this.winAttempts[i];
        }
    }

    updateLevelDisplay() {
        if (this.levelDisplay) this.levelDisplay.textContent = this.level;
    }
}

// ========================
// INICIALIZAR JUEGO
// ========================
const game = new WordleGame(words);
