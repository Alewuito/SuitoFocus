// ===== PLANIFICADOR DE MENÚS V3.0 - SISTEMA DE RECETAS ELABORADAS =====// ===== PLANIFICADOR DE MENÚS V3.0 - SISTEMA DE RECETAS ELABORADAS =====// ===== PLANIFICADOR DE MENÚS V2.0 - SISTEMA INTELIGENTE =====

// Genera planes usando recetas completas reales con instrucciones

// Cantidades simples y fáciles de calcular (50g, 100g, 150g, etc.)// Genera planes usando recetas completas reales con instrucciones// Genera planes dinámicos usando base de datos de ingredientes



(function () {// Cantidades simples y fáciles de calcular (50g, 100g, 150g, etc.)// Calcula automáticamente macros según BEDCA para cada usuario

    console.log('🍽️ Meal Planner V3.0 (Recetas Elaboradas) cargado');



    // Generar plan semanal completo

    function generatePlan(user) {(function () {(function () {

        // Verificar que el sistema de recetas esté disponible

        if (!window.RECETAS_DATABASE || typeof RecipeBasedMealGenerator === 'undefined') {    console.log('🍽️ Meal Planner V3.0 (Recetas Elaboradas) cargado');    console.log('🍽️ Meal Planner V2.0 (Sistema Inteligente) cargado');

            console.error('❌ Sistema de recetas no disponible');

            console.error('  - RECETAS_DATABASE:', typeof window.RECETAS_DATABASE);

            console.error('  - RecipeBasedMealGenerator:', typeof RecipeBasedMealGenerator);

                // Generar plan semanal completo    // Generar plan semanal completo

            // Intentar cargar de nuevo después de un momento

            setTimeout(() => {    function generatePlan(user) {    function generatePlan(user) {

                console.log('🔄 Reintentando generar plan...');

                return generatePlan(user);        // Verificar que el sistema de recetas esté disponible        // Verificar que el sistema inteligente esté disponible

            }, 500);

                    if (!window.RECETAS_DATABASE || typeof RecipeBasedMealGenerator === 'undefined') {        if (!window.INGREDIENTS_DATABASE || !window.MealGenerator) {

            return {};

        }            console.error('❌ Sistema de recetas no disponible. Cargando...');            console.error('❌ Sistema inteligente no disponible. Cargando...');



        try {            setTimeout(() => generatePlan(user), 500);            // Esperar un momento y reintentar

            // Crear perfil de usuario compatible con RecipeBasedMealGenerator

            const userProfile = {            return {};            setTimeout(() => generatePlan(user), 500);

                sexo: user.gender === 'male' ? 'hombre' : 'mujer',

                edad: user.age || 30,        }            return {};

                peso: user.weight || 70,

                altura: user.height || 170,        }

                actividad: mapActividad(user.activityLevel),

                objetivo: mapObjetivo(user.goal)        // Crear perfil de usuario compatible con RecipeBasedMealGenerator

            };

        const userProfile = {        const generator = new MealGenerator(user, INGREDIENTS_DATABASE);

            console.log('📝 Perfil de usuario para generador:', userProfile);

            sexo: user.gender === 'male' ? 'hombre' : 'mujer',        const targetKcal = user.calculateTargetCalories();

            const generator = new RecipeBasedMealGenerator(userProfile);

            const targetKcal = generator.kcalObjetivo;            edad: user.age || 30,        

            

            const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];            peso: user.weight || 70,        const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

            const weeks = {};

            altura: user.height || 170,        const weeks = {};

            // Preferencias de usuario

            const preferencias = {            actividad: mapActividad(user.activityLevel),

                vegetariano: user.dietType === 'vegetarian',

                vegano: user.dietType === 'vegan'            objetivo: mapObjetivo(user.goal)        console.log(`🎯 Generando plan personalizado para: ${user.name}`);

            };

        };        console.log(`📊 Calorías objetivo: ${targetKcal} kcal/día`);

            console.log(`🎯 Generando plan personalizado para: ${user.name}`);

            console.log(`📊 Calorías objetivo: ${targetKcal} kcal/día`);        console.log(`🍽️ Tipo de dieta: ${user.dietType || 'balanced'}`);

            console.log(`🍽️ Tipo de dieta: ${user.dietType || 'balanced'}`);

            console.log(`🌱 Preferencias:`, preferencias);        const generator = new RecipeBasedMealGenerator(userProfile);        console.log(`❤️ Alimentos favoritos:`, user.foodPreferences || 'Ninguno especificado');



            for (let w = 1; w <= 4; w++) {        const targetKcal = generator.kcalObjetivo;        console.log(`🚫 Alimentos excluidos:`, user.dislikedFoods || 'Ninguno');

                const weekKey = 'Week' + w;

                weeks[weekKey] = {};                console.log(`⚠️ Alergias:`, user.allergens || 'Ninguna');



                days.forEach(function(day) {        const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

                    try {

                        // Generar plan del día usando sistema de recetas        const weeks = {};        for (let w = 1; w <= 4; w++) {

                        const dayPlan = generator.generarPlanDiario(preferencias);

                                    const weekKey = 'Week' + w;

                        // Convertir a formato compatible con la UI actual

                        weeks[weekKey][day] = formatDayForUI(dayPlan, targetKcal, generator);        // Preferencias de usuario            weeks[weekKey] = {};

                        

                        console.log(`✅ ${weekKey} - ${day} generado`);        const preferencias = {

                    } catch (err) {

                        console.error(`❌ Error generando ${weekKey} - ${day}:`, err);            vegetariano: user.dietType === 'vegetarian',            days.forEach(function(day) {

                        weeks[weekKey][day] = createEmptyDay(targetKcal);

                    }            vegano: user.dietType === 'vegan'                // Generar plan del día usando sistema inteligente

                });

                        };                const dayPlan = generator.generateDayPlan(targetKcal);

                console.log(`✅ Semana ${w} generada con éxito (recetas elaboradas)`);

            }                



            console.log('📦 Plan completo generado:', Object.keys(weeks));        console.log(`🎯 Generando plan personalizado para: ${user.name}`);                // Convertir a formato compatible con la UI actual

            return weeks;

                    console.log(`📊 Calorías objetivo: ${targetKcal} kcal/día`);                weeks[weekKey][day] = formatDayForUI(dayPlan, targetKcal);

        } catch (error) {

            console.error('❌ Error crítico generando plan:', error);        console.log(`🍽️ Tipo de dieta: ${user.dietType || 'balanced'}`);            });

            return {};

        }            

    }

        for (let w = 1; w <= 4; w++) {            console.log(`✅ Semana ${w} generada con éxito`);

    // Crear día vacío en caso de error

    function createEmptyDay(targetKcal) {            const weekKey = 'Week' + w;        }

        return {

            'Desayuno': { desc: 'No disponible', kcal: 0, macros: { protein: 0, carbs: 0, fat: 0 } },            weeks[weekKey] = {};

            'Snack Mañana': { desc: 'No disponible', kcal: 0, macros: { protein: 0, carbs: 0, fat: 0 } },

            'Comida': { desc: 'No disponible', kcal: 0, macros: { protein: 0, carbs: 0, fat: 0 } },        return weeks;

            'Merienda': { desc: 'No disponible', kcal: 0, macros: { protein: 0, carbs: 0, fat: 0 } },

            'Cena': { desc: 'No disponible', kcal: 0, macros: { protein: 0, carbs: 0, fat: 0 } },            days.forEach(function(day) {    }

            totalKcal: 0,

            targetKcal: targetKcal                // Generar plan del día usando sistema de recetas

        };

    }                const dayPlan = generator.generarPlanDiario(preferencias);    // Convertir el formato del generador al formato esperado por la UI



    // Mapear nivel de actividad                    function formatDayForUI(dayPlan, targetKcal) {

    function mapActividad(activityLevel) {

        const mapping = {                // Convertir a formato compatible con la UI actual        const formattedDay = {};

            'sedentary': 'sedentario',

            'light': 'ligero',                weeks[weekKey][day] = formatDayForUI(dayPlan, targetKcal, generator);

            'moderate': 'moderado',

            'active': 'intenso',            });        // Mapear nombres de comidas

            'very-active': 'muy_intenso'

        };                    const mealMapping = {

        return mapping[activityLevel] || 'moderado';

    }            console.log(`✅ Semana ${w} generada con éxito (recetas elaboradas)`);            'Desayuno': 'Desayuno',



    // Mapear objetivo        }            'Merienda Mañana': 'Snack Mañana',

    function mapObjetivo(goal) {

        const mapping = {            'Comida': 'Comida',

            'lose': 'perder_peso',

            'maintain': 'mantener_peso',        return weeks;            'Merienda': 'Merienda',

            'gain': 'ganar_peso'

        };    }            'Cena': 'Cena'

        return mapping[goal] || 'mantener_peso';

    }        };



    // Convertir el formato del generador de recetas al formato esperado por la UI    // Mapear nivel de actividad

    function formatDayForUI(dayPlan, targetKcal, generator) {

        const formattedDay = {};    function mapActividad(activityLevel) {        for (const [originalName, meal] of Object.entries(dayPlan.meals)) {



        // Mapear nombres de comidas del plan (español) al formato UI (español)        const mapping = {            const displayName = mealMapping[originalName] || originalName;

        const mealMapping = {

            'desayuno': 'Desayuno',            'sedentary': 'sedentario',            

            'media_manana': 'Snack Mañana',

            'comida': 'Comida',            'light': 'ligero',            if (meal) {

            'merienda': 'Merienda',

            'cena': 'Cena'            'moderate': 'moderado',                formattedDay[displayName] = {

        };

            'active': 'intenso',                    desc: meal.description,

        for (const [tipoComida, comidaData] of Object.entries(dayPlan.comidas)) {

            const displayName = mealMapping[tipoComida] || tipoComida;            'very-active': 'muy_intenso'                    video: findVideoForMeal(meal),

            const receta = comidaData.receta;

                    };                    kcal: meal.nutrition.kcal,

            if (receta) {

                // Crear descripción simplificada        return mapping[activityLevel] || 'moderado';                    macros: {

                const descripcion = generarDescripcionReceta(receta);

                    }                        protein: meal.nutrition.protein,

                formattedDay[displayName] = {

                    desc: descripcion,                        carbs: meal.nutrition.carbs,

                    receta_completa: generator.generarHTMLReceta(receta),

                    video: findVideoForRecipe(receta),    // Mapear objetivo                        fat: meal.nutrition.fat

                    kcal: receta.info_nutricional.kcal,

                    macros: {    function mapObjetivo(goal) {                    },

                        protein: receta.info_nutricional.proteinas,

                        carbs: receta.info_nutricional.carbohidratos,        const mapping = {                    ingredients: meal.ingredients,

                        fat: receta.info_nutricional.grasas

                    },            'lose': 'perder_peso',                    template: meal.template

                    nombre_receta: receta.nombre,

                    tiempo_preparacion: receta.tiempo_preparacion,            'maintain': 'mantener_peso',                };

                    dificultad: receta.dificultad,

                    ingredientes: receta.ingredientes,            'gain': 'ganar_peso'            } else {

                    instrucciones: receta.instrucciones,

                    porciones: receta.porciones,        };                formattedDay[displayName] = {

                    tags: receta.tags

                };        return mapping[goal] || 'mantener_peso';                    desc: 'Comida pendiente',

            } else {

                formattedDay[displayName] = {    }                    video: '',

                    desc: 'Comida pendiente',

                    video: '',                    kcal: 0,

                    kcal: 0,

                    macros: { protein: 0, carbs: 0, fat: 0 }    // Convertir el formato del generador de recetas al formato esperado por la UI                    macros: { protein: 0, carbs: 0, fat: 0 }

                };

            }    function formatDayForUI(dayPlan, targetKcal, generator) {                };

        }

        const formattedDay = {};            }

        // Agregar totales del día

        formattedDay.totalKcal = dayPlan.totales.kcal;        }

        formattedDay.targetKcal = targetKcal;

        // Mapear nombres de comidas del plan (español) al formato UI (español)

        return formattedDay;

    }        const mealMapping = {        // Agregar totales del día



    // Generar descripción simplificada de la receta            'desayuno': 'Desayuno',        formattedDay.totalKcal = dayPlan.totals.kcal;

    function generarDescripcionReceta(receta) {

        // Tomar los 3 primeros ingredientes principales            'media_manana': 'Snack Mañana',        formattedDay.targetKcal = targetKcal;

        const ingredientesPrincipales = receta.ingredientes.slice(0, 3);

        const nombres = ingredientesPrincipales.map(ing => ing.nombre);            'comida': 'Comida',

        

        let descripcion = `${receta.nombre}: `;            'merienda': 'Merienda',        return formattedDay;

        descripcion += nombres.join(', ');

                    'cena': 'Cena'    }

        if (receta.ingredientes.length > 3) {

            descripcion += ` y más`;        };

        }

            // Buscar video relacionado con los ingredientes

        descripcion += ` (${receta.tiempo_preparacion} min, ${receta.porciones} ${receta.porciones === 1 ? 'porción' : 'porciones'})`;

                for (const [tipoComida, comidaData] of Object.entries(dayPlan.comidas)) {    function findVideoForMeal(meal) {

        return descripcion;

    }            const displayName = mealMapping[tipoComida] || tipoComida;        if (!meal || !meal.ingredients || meal.ingredients.length === 0) {



    // Buscar video relacionado con la receta            const receta = comidaData.receta;            return '';

    function findVideoForRecipe(receta) {

        if (!receta || !receta.nombre) {                    }

            return '';

        }            if (receta) {



        // Mapeo de recetas a videos de YouTube (IDs)                // Crear descripción simplificada        // Extraer proteína principal

        const videoMapping = {

            'Pollo a la plancha': 'Ck4xU7hrUUI',                const descripcion = generarDescripcionReceta(receta);        const proteinIngredient = meal.ingredients.find(ing => ing.type === 'protein');

            'Salmón al horno': 'l0cEqMd1cJE',

            'Lentejas estofadas': 'i5xYFfKQlng',                        

            'Merluza al vapor': 'FRZ8oGzNqgE',

            'Tortilla de espinacas': 'e6zY0bE7cP0',                formattedDay[displayName] = {        if (proteinIngredient && window.RECIPES_DATABASE) {

            'Ensalada completa': 'M9qkGlZxV4k',

            'Tostadas con aguacate': 'YNH47h6KMy0',                    desc: descripcion,            const ingredientKey = proteinIngredient.ingredient.key || proteinIngredient.ingredient.name.toLowerCase();

            'Gachas de avena': '4KJq5JV39Vk',

            'Bowl de yogur': 'kNpCPUOPDKQ'                    receta_completa: generator.generarHTMLReceta(receta),            

        };

                    video: findVideoForRecipe(receta),            for (const [key, recipe] of Object.entries(RECIPES_DATABASE)) {

        // Buscar coincidencia exacta o parcial

        for (const [nombreReceta, videoId] of Object.entries(videoMapping)) {                    kcal: receta.info_nutricional.kcal,                if (key.includes(ingredientKey) || ingredientKey.includes(key.split(' ')[0])) {

            if (receta.nombre.includes(nombreReceta)) {

                return videoId;                    macros: {                    return recipe.video || '';

            }

        }                        protein: receta.info_nutricional.proteinas,                }



        // Por defecto, buscar por ingrediente principal o tipo                        carbs: receta.info_nutricional.carbohidratos,            }

        if (receta.tags.includes('proteico')) return 'Ck4xU7hrUUI';

        if (receta.tags.includes('pescado_blanco') || receta.tags.includes('omega3')) return 'l0cEqMd1cJE';                        fat: receta.info_nutricional.grasas        }

        if (receta.tags.includes('vegetariano')) return 'M9qkGlZxV4k';

                            },

        return '';

    }                    nombre_receta: receta.nombre,        // Videos genéricos por tipo de plantilla



    // Persistencia                    tiempo_preparacion: receta.tiempo_preparacion,        const defaultVideos = {

    function storageKey(userId) { 

        return 'suitofocus_plan_v3_' + userId;                     dificultad: receta.dificultad,            'Desayuno proteico con carbohidratos': 'https://www.youtube.com/embed/L_lNiw8kxAE',

    }

                    ingredientes: receta.ingredientes,            'Batido nutritivo': 'https://www.youtube.com/embed/zJj44d739vg',

    function savePlanForUser(userId, plan) {

        try {                     instrucciones: receta.instrucciones,            'Tostadas completas': 'https://www.youtube.com/embed/BqXg5kAv5hc',

            localStorage.setItem(storageKey(userId), JSON.stringify(plan));

            console.log('💾 Plan guardado para usuario:', userId);                    porciones: receta.porciones,            'Proteína + carbohidrato + verduras': 'https://www.youtube.com/embed/RZslI_d3uU4',

        } catch (e) {

            console.error('Error guardando plan:', e);                    tags: receta.tags            'Plato único completo': 'https://www.youtube.com/embed/t8325M0aF2U',

        }

    }                };            'Ensalada completa': 'https://www.youtube.com/embed/82nBEa_i2gI',



    function loadPlanForUser(userId) {            } else {            'Snack ligero': 'https://www.youtube.com/embed/s3yEft40_4Q',

        try {

            const raw = localStorage.getItem(storageKey(userId));                formattedDay[displayName] = {            'Snack proteico': 'https://www.youtube.com/embed/hJq2gZ-P2kI',

            if (!raw) {

                console.log('📂 No hay plan guardado para usuario:', userId);                    desc: 'Comida pendiente',            'Cena ligera proteica': 'https://www.youtube.com/embed/n42sB2HwG2s',

                return null;

            }                    video: '',            'Cena completa': 'https://www.youtube.com/embed/U3iP5-8CR28'

            const plan = JSON.parse(raw);

            console.log('📂 Plan cargado para usuario:', userId);                    kcal: 0,        };

            return plan;

        } catch (e) {                     macros: { protein: 0, carbs: 0, fat: 0 }

            console.error('Error cargando plan:', e);

            return null;                 };        return defaultVideos[meal.template] || '';

        }

    }            }    }



    function clearPlanForUser(userId) {        }

        try { 

            localStorage.removeItem(storageKey(userId));    // Persistencia

            console.log('🗑️ Plan eliminado para usuario:', userId);

        } catch (e) {        // Agregar totales del día    function storageKey(userId) { 

            console.error('Error eliminando plan:', e);

        }        formattedDay.totalKcal = dayPlan.totales.kcal;        return 'suitofocus_plan_v2_' + userId; 

    }

        formattedDay.targetKcal = targetKcal;    }

    // Regenerar solo un día específico

    function regenerateDay(user, weekKey, dayName) {

        if (!window.RECETAS_DATABASE || typeof RecipeBasedMealGenerator === 'undefined') {

            console.error('❌ Sistema de recetas no disponible');        return formattedDay;    function savePlanForUser(userId, plan) {

            return null;

        }    }        try { 



        console.log(`🔄 Regenerando ${dayName} de ${weekKey}...`);            localStorage.setItem(storageKey(userId), JSON.stringify(plan));

        

        const userProfile = {    // Generar descripción simplificada de la receta            console.log('💾 Plan guardado para usuario:', userId);

            sexo: user.gender === 'male' ? 'hombre' : 'mujer',

            edad: user.age || 30,    function generarDescripcionReceta(receta) {        } catch (e) {

            peso: user.weight || 70,

            altura: user.height || 170,        // Tomar los 3 primeros ingredientes principales            console.error('Error guardando plan:', e);

            actividad: mapActividad(user.activityLevel),

            objetivo: mapObjetivo(user.goal)        const ingredientesPrincipales = receta.ingredientes.slice(0, 3);        }

        };

        const nombres = ingredientesPrincipales.map(ing => ing.nombre);    }

        const generator = new RecipeBasedMealGenerator(userProfile);

        const targetKcal = generator.kcalObjetivo;        

        

        const preferencias = {        let descripcion = `${receta.nombre}: `;    function loadPlanForUser(userId) {

            vegetariano: user.dietType === 'vegetarian',

            vegano: user.dietType === 'vegan'        descripcion += nombres.join(', ');        try {

        };

                            const raw = localStorage.setItem(storageKey(userId));

        const dayPlan = generator.generarPlanDiario(preferencias);

                if (receta.ingredientes.length > 3) {            if (!raw) {

        return formatDayForUI(dayPlan, targetKcal, generator);

    }            descripcion += ` y más`;                console.log('📂 No hay plan guardado para usuario:', userId);



    // Función para recalcular totales de un día específico        }                return null;

    function recalculateDayTotals(dayMeals) {

        let totalKcal = 0;                    }

        let totalProtein = 0;

        let totalCarbs = 0;        descripcion += ` (${receta.tiempo_preparacion} min, ${receta.porciones} ${receta.porciones === 1 ? 'porción' : 'porciones'})`;            const plan = JSON.parse(raw);

        let totalFat = 0;

                    console.log('📂 Plan cargado para usuario:', userId);

        Object.values(dayMeals).forEach(meal => {

            if (meal.kcal) {        return descripcion;            return plan;

                totalKcal += meal.kcal;

                totalProtein += meal.macros?.protein || 0;    }        } catch (e) { 

                totalCarbs += meal.macros?.carbs || 0;

                totalFat += meal.macros?.fat || 0;            console.error('Error cargando plan:', e);

            }

        });    // Buscar video relacionado con la receta            return null; 



        return {    function findVideoForRecipe(receta) {        }

            totalKcal: Math.round(totalKcal),

            totalProtein: Math.round(totalProtein),        if (!receta || !receta.nombre) {    }

            totalCarbs: Math.round(totalCarbs),

            totalFat: Math.round(totalFat)            return '';

        };

    }        }    function clearPlanForUser(userId) {



    // Función para obtener resumen nutricional de la semana        try { 

    function getWeekSummary(week) {

        const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];        // Mapeo de recetas a videos de YouTube (IDs)            localStorage.removeItem(storageKey(userId));

        let totalKcal = 0;

        let totalProtein = 0;        const videoMapping = {            console.log('🗑️ Plan eliminado para usuario:', userId);

        let totalCarbs = 0;

        let totalFat = 0;            'Pollo a la plancha': 'Ck4xU7hrUUI',        } catch (e) {

        let daysCount = 0;

            'Salmón al horno': 'l0cEqMd1cJE',            console.error('Error eliminando plan:', e);

        days.forEach(day => {

            if (week[day]) {            'Lentejas estofadas': 'i5xYFfKQlng',        }

                const dayTotals = recalculateDayTotals(week[day]);

                totalKcal += dayTotals.totalKcal;            'Merluza al vapor': 'FRZ8oGzNqgE',    }

                totalProtein += dayTotals.totalProtein;

                totalCarbs += dayTotals.totalCarbs;            'Tortilla de espinacas': 'e6zY0bE7cP0',

                totalFat += dayTotals.totalFat;

                daysCount++;            'Ensalada completa': 'M9qkGlZxV4k',    // Regenerar solo un día específico

            }

        });            'Tostadas con aguacate': 'YNH47h6KMy0',    function regenerateDay(user, weekKey, dayName) {



        return {            'Gachas de avena': '4KJq5JV39Vk',        if (!window.MealGenerator || !window.INGREDIENTS_DATABASE) {

            averageKcal: Math.round(totalKcal / daysCount),

            averageProtein: Math.round(totalProtein / daysCount),            'Bowl de yogur': 'kNpCPUOPDKQ'            console.error('❌ Sistema inteligente no disponible');

            averageCarbs: Math.round(totalCarbs / daysCount),

            averageFat: Math.round(totalFat / daysCount),        };            return null;

            totalKcal: totalKcal,

            totalProtein: totalProtein,        }

            totalCarbs: totalCarbs,

            totalFat: totalFat        // Buscar coincidencia exacta o parcial

        };

    }        for (const [nombreReceta, videoId] of Object.entries(videoMapping)) {        console.log(`🔄 Regenerando ${dayName} de ${weekKey}...`);



    // API pública (compatible con script.js)            if (receta.nombre.includes(nombreReceta)) {        

    window.MealPlanner = {

        generateWeeklyPlanForUser: generatePlan,                return videoId;        const generator = new MealGenerator(user, INGREDIENTS_DATABASE);

        savePlanForUser: savePlanForUser,

        loadPlanForUser: loadPlanForUser,            }        const targetKcal = user.calculateTargetCalories();

        clearPlanForUser: clearPlanForUser,

        regenerateDay: regenerateDay,        }        const dayPlan = generator.generateDayPlan(targetKcal);

        version: '3.0.0'

    };        

    

    // Exportar funciones adicionales        // Por defecto, buscar por ingrediente principal o tipo        return formatDayForUI(dayPlan, targetKcal);

    window.generateMealPlan = generatePlan;

    window.recalculateDayTotals = recalculateDayTotals;        if (receta.tags.includes('pollo')) return 'Ck4xU7hrUUI';    }

    window.getWeekSummary = getWeekSummary;

        if (receta.tags.includes('pescado_blanco') || receta.tags.includes('omega3')) return 'l0cEqMd1cJE';

    console.log('✅ Meal Planner V3.0 listo para usar');

    console.log('ℹ️ Características:');        if (receta.tags.includes('vegetariano')) return 'M9qkGlZxV4k';    // API pública

    console.log('  - 29 recetas elaboradas reales');

    console.log('  - Cantidades simplificadas (50g, 100g, 150g)');            window.MealPlanner = {

    console.log('  - Instrucciones paso a paso');

    console.log('  - Basado en cocina mediterránea');        return '';        generateWeeklyPlanForUser: generatePlan,

})();

    }        savePlanForUser: savePlanForUser,

        loadPlanForUser: loadPlanForUser,

    // Función para recalcular totales de un día específico        clearPlanForUser: clearPlanForUser,

    function recalculateDayTotals(dayMeals) {        regenerateDay: regenerateDay,

        let totalKcal = 0;        version: '2.0.0'

        let totalProtein = 0;    };

        let totalCarbs = 0;    

        let totalFat = 0;    console.log('✅ MealPlanner V2.0 API exportada correctamente');

    console.log('ℹ️ Características:');

        Object.values(dayMeals).forEach(meal => {    console.log('  - Generación dinámica basada en ingredientes');

            if (meal.kcal) {    console.log('  - Cálculo automático de macros (BEDCA)');

                totalKcal += meal.kcal;    console.log('  - Respeta preferencias y alergias del usuario');

                totalProtein += meal.macros?.protein || 0;    console.log('  - Variedad ilimitada de combinaciones');

                totalCarbs += meal.macros?.carbs || 0;})();

                totalFat += meal.macros?.fat || 0;
            }
        });

        return {
            totalKcal: Math.round(totalKcal),
            totalProtein: Math.round(totalProtein),
            totalCarbs: Math.round(totalCarbs),
            totalFat: Math.round(totalFat)
        };
    }

    // Función para obtener resumen nutricional de la semana
    function getWeekSummary(week) {
        const days = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        let totalKcal = 0;
        let totalProtein = 0;
        let totalCarbs = 0;
        let totalFat = 0;
        let daysCount = 0;

        days.forEach(day => {
            if (week[day]) {
                const dayTotals = recalculateDayTotals(week[day]);
                totalKcal += dayTotals.totalKcal;
                totalProtein += dayTotals.totalProtein;
                totalCarbs += dayTotals.totalCarbs;
                totalFat += dayTotals.totalFat;
                daysCount++;
            }
        });

        return {
            averageKcal: Math.round(totalKcal / daysCount),
            averageProtein: Math.round(totalProtein / daysCount),
            averageCarbs: Math.round(totalCarbs / daysCount),
            averageFat: Math.round(totalFat / daysCount),
            totalKcal: totalKcal,
            totalProtein: totalProtein,
            totalCarbs: totalCarbs,
            totalFat: totalFat
        };
    }

    // Exportar funciones globalmente
    window.generateMealPlan = generatePlan;
    window.recalculateDayTotals = recalculateDayTotals;
    window.getWeekSummary = getWeekSummary;

    console.log('✅ Meal Planner V3.0 listo para usar');
})();
