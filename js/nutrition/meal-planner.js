// ===== PLANIFICADOR DE MENÚS PERSONALIZADOS CON CANTIDADES ESTANDARIZADAS =====
// Genera planes semanales personalizados según el perfil del usuario
// NOTA: Usa cantidades estandarizadas según envases comerciales reales

(function () {
    console.log('Meal Planner cargado');
    
    // INSTRUCCIONES DE PREPARACIÓN DETALLADAS PARA TODAS LAS RECETAS
    const RECIPE_INSTRUCTIONS = {
        // === DESAYUNOS ===
        'Yogur Alpro con avena y frutos rojos': {
            preparation: [
                'En un bol amplio, vierte el yogur Alpro natural (400g)',
                'Añade la avena (40g) y mezcla bien hasta integrar',
                'Incorpora los frutos rojos (100g) - pueden ser frescos o congelados',
                'Tritura las nueces (25g) ligeramente y espolvorea por encima',
                'Opcionalmente, añade una cucharadita de miel o sirope de agave',
                'Deja reposar 5 minutos para que la avena se hidrate',
                'Sirve inmediatamente y disfruta'
            ],
            tips: 'Puedes prepararlo la noche anterior y guardarlo en la nevera. Los frutos rojos congelados son más económicos y mantienen todas sus propiedades.'
        },
        'Avena proteica con plátano': {
            preparation: [
                'En un cazo, calienta la leche de avena (200ml) a fuego medio',
                'Cuando empiece a hervir, añade la avena (60g) y remueve constantemente',
                'Cocina durante 5-7 minutos hasta que espese, removiendo ocasionalmente',
                'Retira del fuego y añade la proteína en polvo (30g), mezclando bien',
                'Corta el plátano (120g) en rodajas',
                'Sirve la avena en un bol y decora con las rodajas de plátano',
                'Añade un toque de canela al gusto'
            ],
            tips: 'Si prefieres avena fría, prepárala con leche fría y déjala reposar en la nevera durante la noche (overnight oats).'
        },
        'Tostadas integrales con aguacate y huevo': {
            preparation: [
                'Tuesta las 2 rebanadas de pan integral (60g) hasta que estén doradas',
                'Mientras tanto, pon agua a hervir en un cazo pequeño',
                'Casca los 2 huevos con cuidado y añádelos al agua hirviendo',
                'Cocina los huevos 6-7 minutos para que queden con la yema líquida (escalfados)',
                'Corta el aguacate por la mitad, retira el hueso y extrae la pulpa',
                'Machaca el aguacate (100g) con un tenedor y añade una pizca de sal',
                'Unta el aguacate sobre las tostadas',
                'Coloca los huevos escalfados encima',
                'Rocía con el aceite de oliva (5ml) y añade pimienta negra al gusto'
            ],
            tips: 'Para huevos perfectamente escalfados, añade una cucharada de vinagre al agua hirviendo. Puedes añadir también semillas de sésamo o chía.'
        },
        'Batido verde proteico': {
            preparation: [
                'Lava bien las espinacas frescas (50g) bajo el grifo',
                'En una batidora potente, añade la leche de avena (250ml)',
                'Incorpora el plátano pelado y troceado (120g)',
                'Añade las espinacas, la proteína en polvo (30g) y la mantequilla de cacahuete (20g)',
                'Opcionalmente, añade 3-4 cubitos de hielo para un batido más fresco',
                'Bate a máxima potencia durante 1-2 minutos hasta obtener una textura suave',
                'Sirve inmediatamente en un vaso alto'
            ],
            tips: 'Puedes congelar plátanos maduros en trozos para dar una textura cremosa tipo smoothie bowl. Las espinacas baby son más suaves y no alteran el sabor.'
        },
        'Tortilla francesa con jamón y tostadas': {
            preparation: [
                'Casca los 3 huevos en un bol y bátelos bien con un tenedor',
                'Añade una pizca de sal y pimienta negra',
                'Pica el jamón (50g) en tiras pequeñas',
                'Calienta una sartén antiadherente a fuego medio con el aceite (10ml)',
                'Vierte los huevos batidos en la sartén',
                'Cuando los bordes empiecen a cuajar, añade el jamón en el centro',
                'Con una espátula, dobla la tortilla por la mitad',
                'Cocina 2-3 minutos más hasta que esté bien cuajada',
                'Mientras tanto, tuesta el pan integral (60g)',
                'Corta el tomate (100g) en rodajas y colócalo sobre las tostadas',
                'Sirve la tortilla acompañada de las tostadas con tomate'
            ],
            tips: 'Para una tortilla más jugosa, no cocines demasiado los huevos. El tomate natural rallado sobre las tostadas es una excelente alternativa.'
        },
        'Tostadas con jamón, queso y tomate': {
            preparation: [
                'Tuesta las 3 rebanadas de pan integral (90g) en la tostadora',
                'Lava el tomate (100g) y rállalo con un rallador grueso',
                'Mezcla el tomate rallado con el aceite de oliva (10ml) y una pizca de sal',
                'Unta el tomate sobre las tostadas calientes',
                'Coloca las lonchas de jamón serrano (50g) sobre el tomate',
                'Añade la loncha de queso (40g) encima',
                'Opcionalmente, gratina en el horno 2-3 minutos para fundir el queso',
                'Sirve inmediatamente'
            ],
            tips: 'El orden correcto es importante: primero el tomate, luego el jamón y por último el queso. Así cada ingrediente mantiene su sabor.'
        },
        
        // === COMIDAS ===
        'Pollo al airfryer con boniato y brócoli': {
            preparation: [
                'Precalienta la airfryer a 200°C durante 5 minutos',
                'Lava y corta el boniato (200g) en gajos gruesos',
                'Seca bien el pollo (200g) con papel de cocina',
                'Sazona el pollo con sal, pimienta, pimentón y ajo en polvo',
                'Rocía los gajos de boniato con spray de aceite (5ml) y añade sal',
                'Coloca el pollo y el boniato en la airfryer',
                'Cocina a 200°C durante 12 minutos',
                'Mientras tanto, lava el brócoli (200g) y córtalo en ramilletes',
                'A los 12 minutos, da la vuelta al pollo y al boniato',
                'Añade el brócoli rociado con aceite (10ml) restante',
                'Cocina 8-10 minutos más hasta que todo esté dorado',
                'Deja reposar 3 minutos antes de servir'
            ],
            tips: 'No sobrecargues la airfryer; el aire debe circular libremente. Puedes marinar el pollo 30 minutos antes para más sabor.'
        },
        'Merluza al limón con espárragos y patata': {
            preparation: [
                'Precalienta el horno a 180°C',
                'Lava las patatas (200g) y córtalas en rodajas de 1cm',
                'Hierve las patatas en agua con sal durante 10 minutos',
                'Escurre las patatas y colócalas en una bandeja de horno',
                'Lava los espárragos verdes (200g) y corta la parte dura del tallo',
                'Coloca los espárragos junto a las patatas',
                'Rocía las verduras con aceite (10ml), sal y pimienta',
                'Hornea durante 15 minutos',
                'Seca bien la merluza (200g) y sazónala con sal',
                'Coloca la merluza sobre las verduras',
                'Exprime medio limón sobre el pescado',
                'Rocía con el aceite (5ml) restante',
                'Hornea 12-15 minutos más hasta que la merluza esté en su punto',
                'Sirve con gajos de limón'
            ],
            tips: 'La merluza está perfecta cuando se desmiga fácilmente con un tenedor. No la cocines en exceso o quedará seca.'
        },
        'Solomillo de cerdo con patata asada': {
            preparation: [
                'Precalienta el horno a 200°C',
                'Lava las patatas (200g) y córtalas en gajos',
                'En un bol, mezcla las patatas con aceite (10ml), sal, pimienta y romero',
                'Extiende las patatas en una bandeja de horno',
                'Hornea durante 25 minutos',
                'Mientras tanto, seca bien el solomillo de cerdo (200g)',
                'Sazona el solomillo con sal, pimienta y pimentón',
                'Calienta una sartén a fuego alto con aceite (5ml)',
                'Sella el solomillo por todos los lados (2 minutos por lado)',
                'Transfiere el solomillo a la bandeja con las patatas',
                'Hornea junto 10-12 minutos más',
                'Deja reposar la carne 5 minutos antes de cortar',
                'Sirve con ensalada fresca (150g) aliñada'
            ],
            tips: 'El reposo de la carne es fundamental para que los jugos se redistribuyan. Corta siempre en contra de la fibra.'
        },
        'Lentejas guisadas con pollo y arroz': {
            preparation: [
                'Si usas lentejas secas, remójalas 2 horas antes (o usa bote de 250g ya cocidas)',
                'Cocina el arroz (80g) según las instrucciones del paquete',
                'En una cazuela, calienta el aceite (10ml) a fuego medio',
                'Sofríe cebolla y ajo picados durante 3 minutos',
                'Añade las verduras troceadas (150g): zanahoria, pimiento, calabacín',
                'Sofríe 5 minutos más',
                'Incorpora el pollo troceado (100g) y dora ligeramente',
                'Añade las lentejas cocidas (250g) y mezcla',
                'Agrega caldo de verduras o agua (300ml)',
                'Sazona con sal, pimentón, comino y laurel',
                'Cocina a fuego suave 15-20 minutos',
                'Sirve las lentejas acompañadas del arroz'
            ],
            tips: 'Las lentejas de bote son igual de nutritivas y ahorran mucho tiempo. Puedes añadir un chorrito de vinagre al final para realzar sabores.'
        },
        'Salmón con quinoa y verduras': {
            preparation: [
                'Enjuaga la quinoa (150g ya cocida) o cocínala según instrucciones',
                'Precalienta el horno a 180°C',
                'Lava las verduras (150g): brócoli, pimiento, calabacín',
                'Corta las verduras en trozos medianos',
                'En una bandeja de horno, coloca las verduras',
                'Rocía con aceite (10ml), sal y pimienta',
                'Hornea 15 minutos',
                'Seca bien el salmón (180g) con papel de cocina',
                'Sazona el salmón con sal, pimienta y eneldo',
                'Coloca el salmón sobre las verduras',
                'Rocía con el aceite (5ml) restante y un poco de limón',
                'Hornea 12-15 minutos más hasta que el salmón esté rosado en el centro',
                'Sirve sobre una base de quinoa'
            ],
            tips: 'El salmón debe quedar jugoso por dentro. Si prefieres, puedes hacerlo a la plancha 3-4 minutos por lado.'
        },
        'Curry de garbanzos con arroz basmati': {
            preparation: [
                'Cocina el arroz basmati (100g) según las instrucciones del paquete',
                'En una sartén grande, calienta el aceite (10ml) a fuego medio',
                'Sofríe cebolla picada, ajo y jengibre fresco rallado',
                'Añade curry en polvo (2 cucharaditas), cúrcuma y comino',
                'Sofríe 1 minuto para que suelten aroma las especias',
                'Incorpora tomate triturado (200ml)',
                'Añade los garbanzos cocidos (250g) escurridos',
                'Vierte la leche de coco (100ml) y mezcla',
                'Incorpora las espinacas frescas (100g)',
                'Cocina 10-15 minutos a fuego suave',
                'Rectifica de sal y añade un toque de limón',
                'Sirve sobre el arroz basmati',
                'Decora con cilantro fresco'
            ],
            tips: 'Si no tienes jengibre fresco, usa jengibre en polvo. El curry mejora si lo dejas reposar 30 minutos antes de servir.'
        },
        'Pavo con calabaza y arroz': {
            preparation: [
                'Cocina el arroz (80g) según las instrucciones del paquete',
                'Pela y corta la calabaza (200g) en cubos de 2cm',
                'En un wok o sartén grande, calienta el aceite (15ml)',
                'Sofríe la calabaza 5 minutos hasta que empiece a dorarse',
                'Retira la calabaza y reserva',
                'En la misma sartén, saltea la pechuga de pavo (200g) cortada en tiras',
                'Cocina 5-7 minutos hasta que esté dorada',
                'Añade las judías verdes (200g) limpias y troceadas',
                'Incorpora la calabaza de nuevo',
                'Saltea todo junto 5 minutos más',
                'Sazona con sal, pimienta, ajo en polvo y tomillo',
                'Sirve sobre el arroz cocido'
            ],
            tips: 'La calabaza aporta dulzor natural. Puedes asarla previamente en el horno para un sabor más intenso.'
        },
        'Ternera salteada con brócoli y arroz': {
            preparation: [
                'Cocina el arroz (100g) según las instrucciones del paquete',
                'Corta la ternera (200g) en tiras finas',
                'Marina la ternera con salsa de soja, ajo y jengibre (10 minutos)',
                'Lava el brócoli (200g) y córtalo en ramilletes pequeños',
                'Blanquea el brócoli en agua hirviendo 3 minutos, escurre',
                'Calienta un wok a fuego muy alto con aceite (15ml)',
                'Saltea la ternera marinada 3-4 minutos hasta dorar',
                'Retira la carne y reserva',
                'En el mismo wok, saltea el brócoli 2 minutos',
                'Devuelve la ternera al wok',
                'Añade un toque de salsa de ostras o soja',
                'Mezcla todo 1 minuto más',
                'Sirve inmediatamente sobre el arroz'
            ],
            tips: 'El secreto del salteado es fuego muy alto y tiempos cortos. No sobrecargues el wok o la carne hervirá en lugar de dorarse.'
        },
        
        // === MERIENDAS ===
        'Yogur Alpro natural con almendras': {
            preparation: [
                'Vierte el yogur Alpro natural (400g) en un bol',
                'Tuesta ligeramente las almendras (25g) en una sartén sin aceite',
                'Deja enfriar las almendras 2 minutos',
                'Pica las almendras groseramente con un cuchillo',
                'Espolvorea las almendras sobre el yogur',
                'Opcionalmente, añade canela en polvo o esencia de vainilla',
                'Sirve inmediatamente'
            ],
            tips: 'Tostar las almendras realza su sabor. También puedes añadir un hilo de miel o sirope de arce.'
        },
        'Chips de boniato al horno': {
            preparation: [
                'Precalienta el horno a 200°C',
                'Lava bien el boniato (120g) con piel',
                'Córtalo en rodajas muy finas (1-2mm) con mandolina o cuchillo afilado',
                'Coloca las rodajas en un bol con agua fría 10 minutos',
                'Escurre y seca muy bien con papel de cocina',
                'Coloca las rodajas en una bandeja con papel de horno',
                'Rocía con spray de aceite (2ml)',
                'Sazona con sal y pimentón dulce al gusto',
                'Hornea 15 minutos, da la vuelta y hornea 10 minutos más',
                'Deja enfriar 5 minutos para que queden crujientes'
            ],
            tips: 'Cuanto más finas las rodajas, más crujientes quedarán. Vigila el horno al final para que no se quemen.'
        },
        'Garbanzos tostados especiados': {
            preparation: [
                'Precalienta el horno a 200°C',
                'Escurre y enjuaga los garbanzos cocidos (100g)',
                'Seca muy bien los garbanzos con papel de cocina',
                'En un bol, mezcla los garbanzos con aceite (3ml)',
                'Añade especias al gusto: comino, pimentón, ajo en polvo, curry',
                'Sazona con sal',
                'Extiende en una bandeja de horno en una sola capa',
                'Hornea 30-40 minutos, removiendo cada 10 minutos',
                'Estarán listos cuando estén dorados y crujientes',
                'Deja enfriar completamente antes de servir'
            ],
            tips: 'Cuanto más secos estén antes de hornear, más crujientes quedarán. Se conservan 3-4 días en un recipiente hermético.'
        },
        'Edamames con sal': {
            preparation: [
                'Pon agua abundante a hervir en una cazuela grande',
                'Añade una cucharada generosa de sal al agua',
                'Cuando hierva, añade los edamames congelados (150g)',
                'Cocina 4-5 minutos hasta que estén tiernos',
                'Escurre bien los edamames',
                'Colócalos en un bol y espolvorea con sal gruesa',
                'Opcionalmente, añade pimienta negra o chili en polvo',
                'Sirve inmediatamente mientras están calientes'
            ],
            tips: 'Para comer los edamames, aprieta la vaina entre los dedos y las habas saldrán fácilmente. La vaina no se come.'
        },
        'Manzana con crema de almendra': {
            preparation: [
                'Lava bien la manzana (180g)',
                'Córtala en cuartos y retira el corazón',
                'Corta cada cuarto en rodajas de medio centímetro',
                'Dispón las rodajas en un plato',
                'Calienta la crema de almendra (25g) 10 segundos en microondas',
                'Rocía o unta la crema de almendra sobre las rodajas',
                'Opcionalmente, espolvorea con canela',
                'Sirve inmediatamente'
            ],
            tips: 'Las variedades Fuji o Granny Smith combinan mejor con la crema de almendra. Puedes sustituir por crema de cacahuete.'
        },
        'Palitos de zanahoria con hummus': {
            preparation: [
                'Pela las zanahorias (200g)',
                'Córtalas en bastones de unos 7-8cm de largo',
                'Coloca los bastones en un bol con agua helada 10 minutos',
                'Escurre y seca bien las zanahorias',
                'Coloca el hummus (100g) en un bol pequeño',
                'Dispón los palitos de zanahoria alrededor del hummus',
                'Opcionalmente, espolvorea pimentón sobre el hummus',
                'Sirve inmediatamente'
            ],
            tips: 'El baño de agua helada hace que las zanahorias queden más crujientes. También puedes añadir apio o pepino.'
        },
        
        // === CENAS ===
        'Tortilla de espinacas y champiñones': {
            preparation: [
                'Lava las espinacas frescas (150g) y escúrrelas bien',
                'Limpia los champiñones (100g) y córtalos en láminas',
                'En una sartén, calienta la mitad del aceite (5ml)',
                'Saltea los champiñones 5 minutos hasta que doren',
                'Añade las espinacas y cocina hasta que se reduzcan',
                'Retira las verduras y reserva',
                'Bate los 3 huevos en un bol con sal y pimienta',
                'Añade el queso rallado (30g) a los huevos',
                'Incorpora las verduras salteadas a la mezcla de huevo',
                'Calienta el resto del aceite (5ml) en la sartén',
                'Vierte la mezcla y cocina a fuego medio-bajo',
                'Cuando los bordes cuajen, da la vuelta con un plato',
                'Cocina 3-4 minutos más por el otro lado',
                'Sirve caliente o tibia'
            ],
            tips: 'Para dar la vuelta fácilmente, cubre con un plato, gira y desliza de nuevo a la sartén. El queso aporta cremosidad.'
        },
        'Merluza al vapor con verduras': {
            preparation: [
                'Lava las patatas (150g) y córtalas en rodajas',
                'Prepara la verdura (250g): brócoli, zanahoria, judías verdes',
                'Llena el vaporizador con agua y ponlo al fuego',
                'Coloca las patatas en la base del vaporizador',
                'Cuando empiece a salir vapor, cocina las patatas 10 minutos',
                'Añade las verduras más duras (zanahoria) y cocina 5 minutos',
                'Incorpora el resto de verduras y cocina 5 minutos más',
                'Seca bien la merluza (200g) y sazónala con sal',
                'Coloca la merluza sobre las verduras',
                'Cocina al vapor 8-10 minutos más',
                'Mezcla el aceite (15ml) con limón, ajo picado y perejil',
                'Sirve el pescado y las verduras con la vinagreta por encima'
            ],
            tips: 'La cocina al vapor preserva todos los nutrientes. La merluza está perfecta cuando se desmiga fácilmente.'
        },
        'Ensalada completa con garbanzos y atún': {
            preparation: [
                'Escurre y enjuaga los garbanzos cocidos (200g)',
                'Escurre bien el atún en conserva (120g)',
                'Lava y trocea las verduras (200g): lechuga, tomate, pepino, pimiento',
                'En un bol grande, mezcla todos los vegetales',
                'Añade los garbanzos escurridos',
                'Incorpora el atún desmigado',
                'Hierve el huevo 10 minutos, enfría y pela',
                'Corta el huevo en cuartos',
                'Prepara la vinagreta: mezcla aceite (15ml), vinagre, sal y mostaza',
                'Aliña la ensalada y mezcla bien',
                'Decora con los cuartos de huevo',
                'Sirve inmediatamente'
            ],
            tips: 'Puedes usar garbanzos de bote, son igual de nutritivos. Añade aceitunas negras para más sabor mediterráneo.'
        },
        'Crema de calabaza con huevos pochados': {
            preparation: [
                'Pela y trocea la calabaza (300g) en cubos',
                'Hierve la calabaza en caldo de verduras 15-20 minutos',
                'Escurre reservando el líquido de cocción',
                'Tritura la calabaza con batidora añadiendo líquido hasta conseguir textura cremosa',
                'Sazona con sal, pimienta y nuez moscada',
                'Tuesta el pan integral (60g)',
                'Pon agua a hervir en un cazo con una cucharada de vinagre',
                'Casca cada huevo en un bol pequeño',
                'Con el agua hirviendo, crea un remolino y desliza el huevo',
                'Cocina 3-4 minutos para yema líquida',
                'Retira con espumadera y escurre bien',
                'Corta el aguacate (50g) en láminas',
                'Sirve la crema en un bol hondo',
                'Coloca el huevo pochado encima',
                'Acompaña con las tostadas y el aguacate'
            ],
            tips: 'El vinagre en el agua ayuda a que la clara se compacte. Sirve la crema bien caliente con un chorrito de aceite virgen.'
        },
        'Pechuga de pollo con ensalada y quinoa': {
            preparation: [
                'Cocina la quinoa (120g ya cocida) o prepárala según instrucciones',
                'Seca bien la pechuga de pollo (180g)',
                'Sazona con sal, pimienta, ajo en polvo y orégano',
                'Calienta una plancha o sartén con aceite (5ml)',
                'Cocina el pollo 5-6 minutos por cada lado',
                'Deja reposar el pollo 5 minutos y córtalo en tiras',
                'Lava y trocea la ensalada (250g): lechugas variadas, tomate cherry',
                'Pela y corta el aguacate (60g) en láminas',
                'En un bol, mezcla la ensalada con la quinoa',
                'Prepara vinagreta: aceite (10ml), limón, mostaza y miel',
                'Aliña la ensalada',
                'Coloca las tiras de pollo encima',
                'Decora con las láminas de aguacate',
                'Sirve inmediatamente'
            ],
            tips: 'El pollo debe alcanzar 75°C en el centro. La quinoa aporta proteína extra y textura crujiente.'
        },
        'Revuelto de tofu con verduras y arroz': {
            preparation: [
                'Cocina el arroz (100g) según instrucciones del paquete',
                'Escurre el tofu firme (250g) y envuélvelo en papel absorbente',
                'Presiona con un peso durante 15 minutos para extraer líquido',
                'Corta el tofu en cubos de 1,5cm',
                'Lava y trocea las verduras (200g): pimiento, brócoli, zanahoria',
                'Calienta un wok a fuego alto con aceite (15ml)',
                'Saltea las verduras 5 minutos y reserva',
                'En el mismo wok, dora los cubos de tofu 5 minutos',
                'Desmenuza ligeramente el tofu con la espátula',
                'Añade cúrcuma, comino y salsa de soja',
                'Incorpora las verduras de nuevo',
                'Saltea todo junto 2 minutos',
                'Sirve sobre el arroz',
                'Decora con semillas de sésamo'
            ],
            tips: 'Prensar el tofu es esencial para que absorba sabores. La cúrcuma le da un color dorado similar al huevo revuelto.'
        },
        'Dorada al horno con espárragos': {
            preparation: [
                'Precalienta el horno a 180°C',
                'Lava las patatas (150g) y córtalas en rodajas',
                'Hierve las patatas 10 minutos y escurre',
                'Lava los espárragos verdes (200g) y corta la base dura',
                'En una bandeja de horno, coloca las patatas y espárragos',
                'Rocía con aceite (10ml), sal y pimienta',
                'Hornea 15 minutos',
                'Limpia la dorada (200g) por dentro y por fuera',
                'Seca bien con papel de cocina',
                'Haz 3 cortes diagonales en cada lado',
                'Rellena con rodajas de limón y ramitas de romero',
                'Coloca la dorada sobre las verduras',
                'Rocía con aceite (5ml) y exprime medio limón',
                'Hornea 20-25 minutos hasta que la piel esté dorada',
                'Sirve con gajos de limón'
            ],
            tips: 'Los cortes diagonales ayudan a que el pescado se cocine uniformemente. El ojo del pescado debe estar blanco cuando esté listo.'
        },
        'Wok de verduras con gambas y arroz': {
            preparation: [
                'Cocina el arroz (100g) según instrucciones del paquete',
                'Pela las gambas (200g) si no vienen peladas',
                'Lava y trocea las verduras (250g): pimiento, brócoli, zanahoria, cebolla',
                'Prepara salsa: mezcla salsa de soja, ajo picado, jengibre y miel',
                'Calienta el wok a fuego muy alto con aceite (10ml)',
                'Saltea las gambas 2 minutos hasta que se pongan rosadas',
                'Retira las gambas y reserva',
                'Añade más aceite (5ml) y saltea las verduras más duras primero',
                'Añade el resto de verduras y saltea 4-5 minutos',
                'Devuelve las gambas al wok',
                'Vierte la salsa preparada',
                'Saltea todo junto 1-2 minutos',
                'Sirve inmediatamente sobre el arroz',
                'Decora con cebollino picado'
            ],
            tips: 'El secreto del wok es fuego muy alto y movimientos rápidos. No sobrecargues el wok o las verduras soltarán agua.'
        }
    };
    
    // CATÁLOGO con cantidades BASE ESTANDARIZADAS según envases comerciales
    // IMPORTANTE: Valores calculados con Base de Datos Española de Composición de Alimentos (BEDCA)
    // Cantidades ajustadas a formatos comerciales reales para facilitar el seguimiento
    // Ejemplos: pan por rebanadas (30g), aceite por cucharadas (10ml), yogur por envases (125g/400g)
    const CATALOG = {
        breakfast: [
            // Yogur Alpro (400g envase) + Avena (40g = 1 medida) + Frutos rojos (100g tarrina) + Nueces (25g = 1 puñado)
            { name: 'Yogur Alpro con avena y frutos rojos', baseQty: { yogur: 400, avena: 40, frutos: 100, nueces: 25 }, baseKcal: 580, macros: { protein: 20, carbs: 72, fat: 20 }, video: 'https://www.youtube.com/embed/gPqe1XyGVRU', tags: ['dairy'], allergens: ['lactose', 'nuts'], ingredients: ['yogur','avena'] },
            
            // Avena (60g) + Proteína (30g = 1 scoop) + Plátano (120g = 1 mediano) + Leche avena (200ml = 1 vaso)
            { name: 'Avena proteica con plátano', baseQty: { avena: 60, proteina: 30, platano: 120, leche_avena: 200 }, baseKcal: 537, macros: { protein: 40, carbs: 75, fat: 8 }, video: 'https://www.youtube.com/embed/L_lNiw8kxAE', tags: ['veg'], allergens: [], ingredients: ['avena','plátano'] },
            
            // Pan integral (60g = 2 rebanadas) + Aguacate (100g = 1/2 aguacate) + Huevos (2) + Aceite (5ml = 1 cucharadita)
            { name: 'Tostadas integrales con aguacate y huevo', baseQty: { pan: 60, aguacate: 100, huevos: 2, aceite: 5 }, baseKcal: 530, macros: { protein: 18, carbs: 38, fat: 30 }, video: 'https://www.youtube.com/embed/BqXg5kAv5hc', tags: ['eggs'], allergens: ['eggs', 'gluten'], ingredients: ['pan','aguacate','huevo'] },
            
            // Leche avena (250ml = 1 taza) + Plátano (120g) + Espinacas (50g) + Proteína (30g = 1 scoop) + Mantequilla cacahuete (20g = 1 cda)
            { name: 'Batido verde proteico', baseQty: { leche_avena: 250, platano: 120, espinacas: 50, proteina: 30, mantequilla_cacahuete: 20 }, baseKcal: 480, macros: { protein: 35, carbs: 45, fat: 12 }, video: 'https://www.youtube.com/embed/zJj44d739vg', tags: ['vegan'], allergens: ['nuts'], ingredients: ['plátano','espinacas'] },
            
            // Huevos (3) + Pan integral (60g = 2 rebanadas) + Tomate (100g = 1 mediano) + Aceite (10ml = 1 cda) + Jamón (50g = 2 lonchas)
            { name: 'Tortilla francesa con jamón y tostadas', baseQty: { huevos: 3, pan: 60, tomate: 100, aceite: 10, jamon: 50 }, baseKcal: 620, macros: { protein: 38, carbs: 40, fat: 32 }, video: 'https://www.youtube.com/embed/LdG3G22Ju-A', tags: ['eggs'], allergens: ['eggs', 'gluten'], ingredients: ['huevos','tomate','jamón'] },
            
            // Pan integral (90g = 3 rebanadas) + Jamón serrano (50g = 2 lonchas) + Tomate (100g) + Aceite (10ml = 1 cda) + Queso (40g = 1 loncha)
            { name: 'Tostadas con jamón, queso y tomate', baseQty: { pan: 90, jamon: 50, tomate: 100, aceite: 10, queso: 40 }, baseKcal: 540, macros: { protein: 32, carbs: 48, fat: 22 }, video: 'https://www.youtube.com/embed/BqXg5kAv5hc', tags: ['meat'], allergens: ['gluten', 'lactose'], ingredients: ['pan','jamón'] }
        ],
        lunch: [
            // Pollo (200g = 1 pechuga grande) + Boniato (200g = 1 grande) + Brócoli (200g = 1 bol) + Aceite (15ml = 1.5 cda)
            { name: 'Pollo al airfryer con boniato y brócoli', baseQty: { pollo: 200, boniato: 200, brocoli: 200, aceite: 15 }, baseKcal: 595, macros: { protein: 48, carbs: 58, fat: 16 }, video: 'https://www.youtube.com/embed/RZslI_d3uU4', tags: ['meat'], allergens: [], ingredients: ['pollo','boniato'] },
            
            // Merluza (200g = 1 filete grande) + Espárragos (200g) + Patata (200g = 1 grande) + Aceite (15ml = 1.5 cda)
            { name: 'Merluza al limón con espárragos y patata', baseQty: { merluza: 200, esparragos: 200, patata: 200, aceite: 15 }, baseKcal: 507, macros: { protein: 40, carbs: 44, fat: 16 }, video: 'https://www.youtube.com/embed/i0-IL2dG2-4', tags: ['fish'], allergens: ['fish'], ingredients: ['merluza','espárragos'] },
            
            // Solomillo cerdo (200g) + Patata asada (200g = 1 grande) + Ensalada (150g) + Aceite (15ml = 1.5 cda)
            { name: 'Solomillo de cerdo con patata asada', baseQty: { cerdo: 200, patata: 200, ensalada: 150, aceite: 15 }, baseKcal: 629, macros: { protein: 44, carbs: 46, fat: 26 }, video: 'https://www.youtube.com/embed/T6d-B-8Kj9c', tags: ['meat'], allergens: [], ingredients: ['cerdo','patata'] },
            
            // Lentejas cocidas (250g) + Pollo (100g) + Verduras (150g) + Arroz (80g crudo) + Aceite (10ml = 1 cda)
            { name: 'Lentejas guisadas con pollo y arroz', baseQty: { lentejas: 250, pollo: 100, verduras: 150, arroz: 80, aceite: 10 }, baseKcal: 830, macros: { protein: 42, carbs: 118, fat: 14 }, video: 'https://www.youtube.com/embed/t8325M0aF2U', tags: ['legumes'], allergens: [], ingredients: ['lentejas','pollo'] },
            
            // Salmón (180g = 1 filete) + Quinoa cocida (150g) + Verduras (150g) + Aceite (15ml = 1.5 cda)
            { name: 'Salmón con quinoa y verduras', baseQty: { salmon: 180, quinoa: 150, verduras: 150, aceite: 15 }, baseKcal: 699, macros: { protein: 42, carbs: 52, fat: 32 }, video: 'https://www.youtube.com/embed/oVigoIHkI0k', tags: ['fish'], allergens: ['fish'], ingredients: ['salmón','quinoa'] },
            
            // Garbanzos cocidos (250g) + Espinacas (100g) + Leche coco (100ml) + Arroz (100g crudo) + Aceite (10ml = 1 cda)
            { name: 'Curry de garbanzos con arroz basmati', baseQty: { garbanzos: 250, espinacas: 100, leche_coco: 100, arroz: 100, aceite: 10 }, baseKcal: 1033, macros: { protein: 28, carbs: 142, fat: 36 }, video: 'https://www.youtube.com/embed/If-6Lej8zi0', tags: ['vegan'], allergens: [], ingredients: ['garbanzos','espinacas'] },
            
            // Pavo (200g = 1 pechuga) + Calabaza (200g) + Judías verdes (200g) + Aceite (15ml = 1.5 cda) + Arroz (80g crudo)
            { name: 'Pavo con calabaza y arroz', baseQty: { pavo: 200, calabaza: 200, judias: 200, aceite: 15, arroz: 80 }, baseKcal: 749, macros: { protein: 50, carbs: 88, fat: 16 }, video: 'https://www.youtube.com/embed/TqHk-86e0pI', tags: ['meat'], allergens: [], ingredients: ['pavo','calabaza'] },
            
            // Ternera (200g) + Brócoli (200g = 1 bol) + Arroz (100g crudo) + Aceite (15ml = 1.5 cda)
            { name: 'Ternera salteada con brócoli y arroz', baseQty: { ternera: 200, brocoli: 200, arroz: 100, aceite: 15 }, baseKcal: 843, macros: { protein: 52, carbs: 86, fat: 26 }, video: 'https://www.youtube.com/embed/z4j9t3vB_zQ', tags: ['meat'], allergens: [], ingredients: ['ternera','brócoli'] }
        ],
        snack: [
            // Yogur Alpro (400g = 1 envase) + Almendras (25g = 1 puñado)
            { name: 'Yogur Alpro natural con almendras', baseQty: { yogur: 400, almendras: 25 }, baseKcal: 409, macros: { protein: 16, carbs: 28, fat: 22 }, video: 'https://www.youtube.com/embed/LA3-k_2oE-0', tags: ['dairy'], allergens: ['lactose', 'nuts'], ingredients: ['yogur'] },
            
            // Boniato (120g) + Aceite spray (2ml)
            { name: 'Chips de boniato al horno', baseQty: { boniato: 120, aceite: 2 }, baseKcal: 121, macros: { protein: 2, carbs: 26, fat: 2 }, video: 'https://www.youtube.com/embed/eWxJgBv615g', tags: ['vegan'], allergens: [], ingredients: ['boniato'] },
            
            // Garbanzos cocidos (100g) + Aceite (3ml)
            { name: 'Garbanzos tostados especiados', baseQty: { garbanzos: 100, aceite: 3 }, baseKcal: 163, macros: { protein: 8, carbs: 20, fat: 5 }, video: 'https://www.youtube.com/embed/fD3udA39GEs', tags: ['vegan'], allergens: [], ingredients: ['garbanzos'] },
            
            // Edamame (150g)
            { name: 'Edamames con sal', baseQty: { edamame: 150 }, baseKcal: 180, macros: { protein: 18, carbs: 10, fat: 8 }, video: 'https://www.youtube.com/embed/hJq2gZ-P2kI', tags: ['vegan'], allergens: ['soy'], ingredients: ['edamame'] },
            
            // Manzana (180g = 1 mediana) + Crema almendra (25g = 1 puñado)
            { name: 'Manzana con crema de almendra', baseQty: { manzana: 180, crema_almendra: 25 }, baseKcal: 239, macros: { protein: 6, carbs: 28, fat: 13 }, video: 'https://www.youtube.com/embed/s3yEft40_4Q', tags: ['vegan'], allergens: ['nuts'], ingredients: ['manzana'] },
            
            // Zanahoria (200g) + Hummus (100g)
            { name: 'Palitos de zanahoria con hummus', baseQty: { zanahoria: 200, hummus: 100 }, baseKcal: 248, macros: { protein: 8, carbs: 26, fat: 12 }, video: 'https://www.youtube.com/embed/g-5e8d54zYA', tags: ['vegan'], allergens: [], ingredients: ['zanahoria'] }
        ],
        dinner: [
            // Huevos (3) + Espinacas (150g) + Champiñones (100g) + Aceite (10ml = 1 cda) + Queso (30g)
            { name: 'Tortilla de espinacas y champiñones', baseQty: { huevos: 3, espinacas: 150, champinones: 100, aceite: 10, queso: 30 }, baseKcal: 477, macros: { protein: 28, carbs: 8, fat: 36 }, video: 'https://www.youtube.com/embed/LdG3G22Ju-A', tags: ['eggs'], allergens: ['eggs', 'lactose'], ingredients: ['huevos','espinacas'] },
            
            // Merluza (200g = 1 filete grande) + Verduras (250g) + Patata (150g = 1 mediana) + Aceite (15ml = 1.5 cda)
            { name: 'Merluza al vapor con verduras', baseQty: { merluza: 200, verduras: 250, patata: 150, aceite: 15 }, baseKcal: 524, macros: { protein: 38, carbs: 46, fat: 16 }, video: 'https://www.youtube.com/embed/n42sB2HwG2s', tags: ['fish'], allergens: ['fish'], ingredients: ['merluza'] },
            
            // Garbanzos (200g) + Atún (120g = 1 lata) + Verduras (200g) + Huevo (1) + Aceite (15ml = 1.5 cda)
            { name: 'Ensalada completa con garbanzos y atún', baseQty: { garbanzos: 200, atun: 120, verduras: 200, huevos: 1, aceite: 15 }, baseKcal: 709, macros: { protein: 48, carbs: 56, fat: 24 }, video: 'https://www.youtube.com/embed/82nBEa_i2gI', tags: ['fish'], allergens: ['fish', 'eggs'], ingredients: ['garbanzos','atún'] },
            
            // Calabaza (300g) + Huevos (2) + Pan (60g = 2 rebanadas) + Aceite (10ml = 1 cda) + Aguacate (50g = 1/4)
            { name: 'Crema de calabaza con huevos pochados', baseQty: { calabaza: 300, huevos: 2, pan: 60, aceite: 10, aguacate: 50 }, baseKcal: 548, macros: { protein: 20, carbs: 42, fat: 30 }, video: 'https://www.youtube.com/embed/d3hzCHo98aA', tags: ['eggs'], allergens: ['eggs', 'gluten'], ingredients: ['calabaza','huevos'] },
            
            // Pollo (180g = 1 pechuga mediana) + Ensalada (250g) + Quinoa (120g) + Aceite (15ml = 1.5 cda) + Aguacate (60g = 1/2)
            { name: 'Pechuga de pollo con ensalada y quinoa', baseQty: { pollo: 180, ensalada: 250, quinoa: 120, aceite: 15, aguacate: 60 }, baseKcal: 611, macros: { protein: 42, carbs: 44, fat: 28 }, video: 'https://www.youtube.com/embed/FmEia340-9w', tags: ['meat'], allergens: [], ingredients: ['pollo','ensalada'] },
            
            // Tofu (250g) + Verduras (200g) + Arroz (100g crudo) + Aceite (15ml = 1.5 cda)
            { name: 'Revuelto de tofu con verduras y arroz', baseQty: { tofu: 250, verduras: 200, arroz: 100, aceite: 15 }, baseKcal: 840, macros: { protein: 32, carbs: 98, fat: 32 }, video: 'https://www.youtube.com/embed/U3iP5-8CR28', tags: ['vegan'], allergens: ['soy'], ingredients: ['tofu'] },
            
            // Dorada (200g = 1 filete grande) + Espárragos (200g) + Patata (150g = 1 mediana) + Aceite (15ml = 1.5 cda)
            { name: 'Dorada al horno con espárragos', baseQty: { dorada: 200, esparragos: 200, patata: 150, aceite: 15 }, baseKcal: 484, macros: { protein: 36, carbs: 38, fat: 18 }, video: 'https://www.youtube.com/embed/s7wN8r-yYw4', tags: ['fish'], allergens: ['fish'], ingredients: ['dorada'] },
            
            // Gambas (200g) + Verduras (250g) + Arroz (100g crudo) + Aceite (15ml = 1.5 cda)
            { name: 'Wok de verduras con gambas y arroz', baseQty: { gambas: 200, verduras: 250, arroz: 100, aceite: 15 }, baseKcal: 745, macros: { protein: 40, carbs: 88, fat: 18 }, video: 'https://www.youtube.com/embed/k9TqG8o71cI', tags: ['fish'], allergens: ['shellfish'], ingredients: ['gambas'] }
        ]
    };

    // Generar descripción con cantidades PRÁCTICAS usando envases comerciales
    function generateDescription(meal, targetKcal) {
        let desc = meal.name;
        
        // Si hay escalado, mostrar el factor
        if (meal.scaleFactor && Math.abs(meal.scaleFactor - 1.0) > 0.1) {
            const percentage = Math.round(meal.scaleFactor * 100);
            desc += ` (${percentage}% porción)`;
        }
        
        desc += ': ';
        const quantities = [];
        
        // Usar scaledQty si existe, sino baseQty
        const qtyToUse = meal.scaledQty || meal.baseQty;
        const entries = Object.entries(qtyToUse);
        
        for (let i = 0; i < entries.length; i++) {
            const ingredient = entries[i][0];
            let qty = entries[i][1];
            
            // Usar sistema de envases estandarizados si está disponible
            let displayText;
            if (typeof window !== 'undefined' && window.getPackageDisplay) {
                displayText = window.getPackageDisplay(ingredient, qty);
            } else {
                // Fallback: mostrar cantidades manuales más amigables
                if (ingredient === 'huevos') {
                    displayText = qty + (qty === 1 ? ' huevo (L)' : ' huevos (L)');
                } else if (ingredient === 'pan') {
                    const slices = Math.round(qty / 30);
                    displayText = slices === 1 ? '1 rebanada (30g)' : `${slices} rebanadas (${qty}g)`;
                } else if (ingredient === 'aceite') {
                    const spoons = Math.round(qty / 10);
                    if (qty <= 5) displayText = '1 cucharadita (5ml)';
                    else if (spoons === 1) displayText = '1 cucharada (10ml)';
                    else displayText = `${spoons} cucharadas (${qty}ml)`;
                } else if (ingredient === 'yogur') {
                    if (qty === 125) displayText = '1 yogur (125g)';
                    else if (qty === 400) displayText = '1 envase Alpro (400g)';
                    else displayText = qty + 'g yogur';
                } else if (ingredient === 'proteina') {
                    const scoops = Math.round(qty / 30);
                    displayText = scoops === 1 ? '1 scoop (30g)' : `${scoops} scoops (${qty}g)`;
                } else if (ingredient === 'jamon') {
                    const slices = Math.round(qty / 25);
                    displayText = slices === 1 ? '1 loncha (25g)' : `${slices} lonchas (${qty}g)`;
                } else if (ingredient === 'pollo' || ingredient === 'pescado' || ingredient === 'merluza' || ingredient === 'salmon' || ingredient === 'dorada') {
                    if (qty === 150) displayText = '1 filete mediano (150g)';
                    else if (qty === 200) displayText = '1 filete grande (200g)';
                    else displayText = qty + 'g';
                } else if (ingredient === 'platano') {
                    if (qty === 120) displayText = '1 plátano mediano (120g)';
                    else displayText = qty + 'g';
                } else if (ingredient === 'aguacate') {
                    if (qty === 50) displayText = '1/4 aguacate (50g)';
                    else if (qty === 100) displayText = '1/2 aguacate (100g)';
                    else displayText = qty + 'g';
                } else if (ingredient === 'almendras' || ingredient === 'nueces') {
                    if (qty === 25) displayText = '1 puñado (25g)';
                    else displayText = qty + 'g';
                } else if (ingredient === 'brocoli') {
                    if (qty === 200) displayText = '1 bol (200g)';
                    else displayText = qty + 'g';
                } else if (ingredient === 'arroz') {
                    displayText = qty + 'g arroz crudo (~' + Math.round(qty * 2.5) + 'g cocido)';
                } else {
                    displayText = qty + 'g';
                }
            }
            
            const ingredientName = ingredient.replace(/_/g, ' ');
            // Si displayText ya incluye el nombre del ingrediente, no lo duplicamos
            if (displayText.toLowerCase().includes(ingredientName.toLowerCase())) {
                quantities.push(displayText);
            } else {
                quantities.push(displayText + ' ' + ingredientName);
            }
        }
        
        desc += quantities.join(', ');
        return desc;
    }

    // Filtrado por restricciones
    function filterByUser(user, items) {
        const dietType = user.dietType || 'balanced';
        const allergens = (user.allergens || []).map(a => a.toLowerCase());
        const dislikes = (user.dislikedFoods || []).map(d => d.toLowerCase());
        const hasAirfryer = user.hasAirfryer || false;

        return items.filter(item => {
            if (item.allergens && item.allergens.some(al => allergens.includes(al.toLowerCase()))) return false;
            if (dislikes.length > 0 && item.ingredients && item.ingredients.some(ing => dislikes.includes(ing.toLowerCase()))) return false;
            if (dietType === 'vegetarian' && item.tags.some(t => ['meat','fish'].includes(t))) return false;
            if (dietType === 'vegan' && item.tags.some(t => ['meat','fish','eggs','dairy','shellfish'].includes(t))) return false;
            
            // Filtrar por airfryer si está disponible
            if (hasAirfryer && item.tags && !item.tags.includes('airfryer')) {
                // Si tiene airfryer, priorizar recetas que lo usen (no excluir otras)
                return true;
            }
            
            return true;
        });
    }

    // Selección variada con ESCALADO DE PORCIONES + INTEGRACIÓN DATASET
    async function pickVaried(items, target, usedItems, mealType, userProfile) {
        // Primero intentar obtener recetas del dataset si está disponible
        let extendedItems = items;
        
        if (window.RecipesLoader && typeof window.RecipesLoader.getRecipesForMeal === 'function') {
            try {
                const datasetRecipes = await window.RecipesLoader.getRecipesForMeal(mealType, userProfile, 5);
                
                if (datasetRecipes && datasetRecipes.length > 0) {
                    // Convertir recetas del dataset al formato interno
                    const convertedRecipes = datasetRecipes.map(recipe => 
                        window.RecipesLoader.convertToOurFormat(recipe)
                    );
                    
                    // Mezclar recetas del catálogo con las del dataset
                    extendedItems = [...items, ...convertedRecipes];
                    console.log(`Dataset integrado: ${convertedRecipes.length} recetas añadidas para ${mealType}`);
                }
            } catch (error) {
                console.warn('No se pudieron cargar recetas del dataset, usando catálogo local:', error);
            }
        }
        
        if (!extendedItems || extendedItems.length === 0) return null;
        
        // Filtrar items ya usados esta semana
        let available = extendedItems.filter(item => !usedItems.includes(item.name));
        if (available.length === 0) {
            // Si ya usamos todos, resetear y usar todos de nuevo
            available = extendedItems;
        }
        
        // Encontrar los 3 más cercanos al objetivo calórico (usando baseKcal como referencia)
        const sorted = available.map(item => ({
            item: item,
            diff: Math.abs(item.baseKcal - target)
        })).sort((a, b) => a.diff - b.diff);
        
        // Tomar los top 3 y elegir uno aleatoriamente
        const topChoices = sorted.slice(0, Math.min(3, sorted.length));
        const randomIndex = Math.floor(Math.random() * topChoices.length);
        
        const selectedMeal = topChoices[randomIndex].item;
        
        // ESCALADO INTELIGENTE DE PORCIONES
        // Calcular cuánto escalar la receta para alcanzar el objetivo
        const scaleFactor = target / selectedMeal.baseKcal;
        
        // Limitar el escalado a rangos realistas (0.6x a 1.8x)
        const clampedScale = Math.max(0.6, Math.min(1.8, scaleFactor));
        
        // Función para redondear cantidades a valores lógicos
        function roundToLogical(value) {
            if (value < 10) return Math.round(value); // Muy pequeño, redondear normal
            if (value < 50) return Math.round(value / 5) * 5; // Redondear a múltiplos de 5
            if (value < 200) return Math.round(value / 10) * 10; // Redondear a múltiplos de 10
            return Math.round(value / 20) * 20; // Valores grandes, múltiplos de 20
        }
        
        // Crear copia escalada de la comida
        const scaledMeal = {
            ...selectedMeal,
            scaleFactor: clampedScale,
            scaledQty: {}
        };
        
        // Escalar cada ingrediente y redondear a valores lógicos
        let totalKcalAdjustment = 0;
        for (const [ingredient, baseQty] of Object.entries(selectedMeal.baseQty)) {
            const scaledRaw = baseQty * clampedScale;
            const scaledRounded = roundToLogical(scaledRaw);
            scaledMeal.scaledQty[ingredient] = scaledRounded;
            
            // Calcular ajuste de calorías por redondeo
            const adjustmentRatio = scaledRounded / scaledRaw;
            totalKcalAdjustment += (selectedMeal.baseKcal * (clampedScale * adjustmentRatio - clampedScale));
        }
        
        // Calorías finales considerando el redondeo de cantidades
        scaledMeal.actualKcal = Math.round(selectedMeal.baseKcal * clampedScale + totalKcalAdjustment / Object.keys(selectedMeal.baseQty).length);
        
        // Redondear calorías a múltiplos de 5
        scaledMeal.actualKcal = Math.round(scaledMeal.actualKcal / 5) * 5;
        
        // Escalar macros con redondeo lógico
        scaledMeal.scaledMacros = {
            protein: Math.round((selectedMeal.macros.protein * clampedScale) / 5) * 5,
            carbs: Math.round((selectedMeal.macros.carbs * clampedScale) / 5) * 5,
            fat: Math.round((selectedMeal.macros.fat * clampedScale) / 5) * 5
        };
        
        return scaledMeal;
    }

    // Construir un día con VARIACIÓN CALÓRICA (días altos, medios, bajos)
    async function buildDay(user, weights, usedMeals, dayName) {
        const baseTarget = user.calculateTargetCalories ? user.calculateTargetCalories() : 2000;
        
        // VARIACIÓN CALÓRICA según día de la semana (más natural y sostenible)
        // Mantiene el PROMEDIO semanal igual al objetivo, pero con variación diaria
        let dayMultiplier = 1.0;
        
        if (dayName === 'Lunes' || dayName === 'Miércoles' || dayName === 'Viernes') {
            dayMultiplier = 0.90; // Días BAJOS (-10%): Más ligeros, compensan el día alto
        } else if (dayName === 'Martes' || dayName === 'Jueves' || dayName === 'Domingo') {
            dayMultiplier = 1.0;  // Días MEDIOS: Calorías objetivo exactas
        } else if (dayName === 'Sábado') {
            dayMultiplier = 1.20; // Día ALTO (+20%): Fin de semana, más saciante, vida social
        }
        
        const targetDaily = Math.round(baseTarget * dayMultiplier);
        
        const targets = {
            Desayuno: Math.round(targetDaily * weights.breakfast),
            Comida: Math.round(targetDaily * weights.lunch),
            Merienda: Math.round(targetDaily * weights.snack),
            Cena: Math.round(targetDaily * weights.dinner)
        };

        const bOptions = filterByUser(user, CATALOG.breakfast);
        const lOptions = filterByUser(user, CATALOG.lunch);
        const sOptions = filterByUser(user, CATALOG.snack);
        const dOptions = filterByUser(user, CATALOG.dinner);

        const breakfast = await pickVaried(bOptions, targets.Desayuno, usedMeals.breakfast, 'breakfast', user);
        const lunch = await pickVaried(lOptions, targets.Comida, usedMeals.lunch, 'lunch', user);
        const snack = await pickVaried(sOptions, targets.Merienda, usedMeals.snack, 'snack', user);
        const dinner = await pickVaried(dOptions, targets.Cena, usedMeals.dinner, 'dinner', user);

        if (breakfast) usedMeals.breakfast.push(breakfast.name);
        if (lunch) usedMeals.lunch.push(lunch.name);
        if (snack) usedMeals.snack.push(snack.name);
        if (dinner) usedMeals.dinner.push(dinner.name);

        // Calcular calorías REALES del día (con porciones escaladas)
        const realCalories = {
            breakfast: breakfast ? (breakfast.actualKcal || breakfast.baseKcal) : 0,
            lunch: lunch ? (lunch.actualKcal || lunch.baseKcal) : 0,
            snack: snack ? (snack.actualKcal || snack.baseKcal) : 0,
            dinner: dinner ? (dinner.actualKcal || dinner.baseKcal) : 0,
            total: (breakfast ? (breakfast.actualKcal || breakfast.baseKcal) : 0) + 
                   (lunch ? (lunch.actualKcal || lunch.baseKcal) : 0) + 
                   (snack ? (snack.actualKcal || snack.baseKcal) : 0) + 
                   (dinner ? (dinner.actualKcal || dinner.baseKcal) : 0)
        };

        return {
            'Desayuno': { 
                desc: breakfast ? generateDescription(breakfast, targets.Desayuno) : 'Pendiente',
                video: breakfast ? breakfast.video : '',
                kcal: breakfast ? (breakfast.actualKcal || breakfast.baseKcal) : 0,
                macros: breakfast ? (breakfast.scaledMacros || breakfast.macros) : { protein: 0, carbs: 0, fat: 0 }
            },
            'Comida': { 
                desc: lunch ? generateDescription(lunch, targets.Comida) : 'Pendiente',
                video: lunch ? lunch.video : '',
                kcal: lunch ? (lunch.actualKcal || lunch.baseKcal) : 0,
                macros: lunch ? (lunch.scaledMacros || lunch.macros) : { protein: 0, carbs: 0, fat: 0 }
            },
            'Merienda': { 
                desc: snack ? generateDescription(snack, targets.Merienda) : 'Pendiente',
                video: snack ? snack.video : '',
                kcal: snack ? (snack.actualKcal || snack.baseKcal) : 0,
                macros: snack ? (snack.scaledMacros || snack.macros) : { protein: 0, carbs: 0, fat: 0 }
            },
            'Cena': { 
                desc: dinner ? generateDescription(dinner, targets.Cena) : 'Pendiente',
                video: dinner ? dinner.video : '',
                kcal: dinner ? (dinner.actualKcal || dinner.baseKcal) : 0,
                macros: dinner ? (dinner.scaledMacros || dinner.macros) : { protein: 0, carbs: 0, fat: 0 }
            },
            'totalKcal': realCalories.total,
            'targetKcal': targetDaily,
            'dayType': dayMultiplier === 0.90 ? 'BAJO' : 
                      (dayMultiplier === 1.0 ? 'MEDIO' : 'ALTO')
        };
    }

    // Generar plan de 4 semanas
    async function generatePlan(user) {
        const weights = { breakfast: 0.25, lunch: 0.35, snack: 0.10, dinner: 0.30 };
        const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

        const weeks = {};

        for (let w = 1; w <= 4; w++) {
            const weekKey = 'Week' + w;
            weeks[weekKey] = {};

            // Resetear tracking cada semana para mayor variedad entre semanas
            const weekUsedMeals = { breakfast: [], lunch: [], snack: [], dinner: [] };

            for (const day of days) {
                weeks[weekKey][day] = await buildDay(user, weights, weekUsedMeals, day);
            }
            
            // Calcular promedio semanal para verificar que se mantiene el objetivo
            let weeklyTotal = 0;
            days.forEach(function(day) {
                weeklyTotal += weeks[weekKey][day].totalKcal;
            });
            const weeklyAverage = Math.round(weeklyTotal / 7);
            const baseTarget = user.calculateTargetCalories ? user.calculateTargetCalories() : 2000;
            
            // Log para debug
            console.log(`Semana ${w} generada:
            - Objetivo diario: ${baseTarget} kcal
            - Promedio real: ${weeklyAverage} kcal
            - Variación semanal: ${Math.round((weeklyAverage - baseTarget) / baseTarget * 100)}%
            - Desayunos usados: ${weekUsedMeals.breakfast.length}`);
        }

        return weeks;
    }

    // Persistencia
    function storageKey(userId) { return 'suitofocus_plan_' + userId; }

    function savePlanForUser(userId, plan) {
        try { localStorage.setItem(storageKey(userId), JSON.stringify(plan)); } catch (e) {}
    }

    function loadPlanForUser(userId) {
        try {
            const raw = localStorage.getItem(storageKey(userId));
            if (!raw) return null;
            return JSON.parse(raw);
        } catch (e) { return null; }
    }

    function clearPlanForUser(userId) {
        try { localStorage.removeItem(storageKey(userId)); } catch (e) {}
    }

    // API pública
    window.MealPlanner = {
        generateWeeklyPlanForUser: function(user) { return generatePlan(user); },
        savePlanForUser: savePlanForUser,
        loadPlanForUser: loadPlanForUser,
        clearPlanForUser: clearPlanForUser,
        RECIPE_INSTRUCTIONS: RECIPE_INSTRUCTIONS // Exportar instrucciones de recetas
    };
    
    // Exportar también directamente para acceso más fácil
    window.RECIPE_INSTRUCTIONS = RECIPE_INSTRUCTIONS;
    
    console.log('MealPlanner API exportada correctamente');
    console.log(`✅ ${Object.keys(RECIPE_INSTRUCTIONS).length} recetas con instrucciones detalladas disponibles`);
})();
