// ===== VARIABLES Y FUNCIONES GLOBALES PARA PLAN NUTRICIONAL =====
// Declarar dietData fuera del DOMContentLoaded para que sea accesible globalmente
let dietData = {};

// Función de utilidad para limpiar localStorage (debug)
window.resetApp = function() {
    if (confirm('ADVERTENCIA: Esto borrará TODOS los datos (usuarios, planes, widgets). ¿Continuar?')) {
        localStorage.clear();
        document.cookie.split(";").forEach(c => {
            document.cookie = c.replace(/^ +/, "").replace(/=.*/, "=;expires=" + new Date().toUTCString() + ";path=/");
        });
        console.log('Aplicación reseteada. Recargando...');
        location.reload();
    }
};

// Función para regenerar el plan nutricional del usuario actual
window.regenerateDietPlan = async function(forceNew = false) {
    try {
        // Usar la instancia global de UserManager
        const userInterface = window.userInterface;
        if (!userInterface || !userInterface.userManager) {
            console.error('Sistema de usuarios no disponible');
            if (window.showNotification) {
                window.showNotification('Sistema de usuarios no disponible', 'error');
            }
            return;
        }
        
        const user = userInterface.userManager.getCurrentUser();
        if (!user) {
            console.warn('No hay usuario actual para regenerar plan');
            if (window.showNotification) {
                window.showNotification('Debes iniciar sesión primero', 'warning');
            }
            return;
        }
        
        console.log('Regenerando plan para:', user.name);
        
        // Generar nuevo plan (ASYNC)
        if (window.MealPlanner && window.MealPlanner.generateWeeklyPlanForUser) {
            const plan = await window.MealPlanner.generateWeeklyPlanForUser(user);
            
            if (plan && window.MealPlanner.savePlanForUser) {
                window.MealPlanner.savePlanForUser(user.id, plan);
                dietData = plan;
                console.log('Nuevo plan generado y guardado');
                console.log('Ejemplo Semana 1:', plan.Week1 ? Object.keys(plan.Week1) : 'NO DISPONIBLE');
                
                // Re-renderizar con pequeño delay para feedback visual
                setTimeout(() => {
                    if (typeof createDietPlanHTML === 'function') {
                        createDietPlanHTML();
                        console.log('Plan re-renderizado en UI');
                    }
                    
                    if (window.showNotification) {
                        window.showNotification('¡Plan nutricional renovado con nuevas recetas!', 'success');
                    }
                }, 300);
            }
        }
    } catch (error) {
        console.error('Error al regenerar plan:', error);
        if (window.showNotification) {
            window.showNotification('Error al regenerar el plan', 'error');
        }
    }
};

console.log('Tip: Ejecuta window.resetApp() para limpiar datos o window.regenerateDietPlan() para nuevas recetas');

// ===== INTEGRACIÓN CON SISTEMA DE USUARIOS: PLAN PERSONALIZADO =====
// CRÍTICO: Registrar listener FUERA de DOMContentLoaded para capturar eventos de carga desde cookie
console.log('Registrando listener userLoaded FUERA de DOMContentLoaded...');
window.addEventListener('userLoaded', async (e) => {
    try {
        const user = e?.detail?.user;
        if (!user) {
            console.warn('No se recibió usuario en evento userLoaded');
            return;
        }

        console.log('Usuario cargado:', user.name);

        // Cargar o generar plan por usuario
        let plan = null;
        
        if (window.MealPlanner && window.MealPlanner.loadPlanForUser) {
            plan = window.MealPlanner.loadPlanForUser(user.id);
            if (plan) {
                console.log('Plan existente cargado para', user.name);
            }
        }

        if (!plan && window.MealPlanner && window.MealPlanner.generateWeeklyPlanForUser) {
            console.log('Generando nuevo plan para', user.name);
            console.log('Datos del usuario:', { 
                id: user.id, 
                calories: user.calculateTargetCalories ? user.calculateTargetCalories() : 'NO DISPONIBLE',
                week: user.currentWeek || 1,
                experience: user.dietExperience || 'beginner',
                allergens: user.allergens,
                dislikedFoods: user.dislikedFoods,
                dietType: user.dietType
            });
            
            // Mostrar información de progresión
            if (user.getPlanDescription) {
                console.log(`\nPLAN DE PROGRESIÓN:\n${user.getPlanDescription()}\n`);
            }
            
            plan = await window.MealPlanner.generateWeeklyPlanForUser(user);
            console.log('Plan generado:', plan ? Object.keys(plan) : 'VACÍO');
            if (plan && window.MealPlanner.savePlanForUser) {
                window.MealPlanner.savePlanForUser(user.id, plan);
                console.log('Plan guardado en localStorage');
            }
            if (window.showNotification) {
                window.showNotification(`Bienvenido, ${user.name}`, 'success');
            }
        }

        if (plan && Object.keys(plan).length > 0) {
            // Asignar al objeto global esperado por la UI
            dietData = plan;
            console.log('dietData actualizado:', Object.keys(dietData));
            console.log('Ejemplo Week1:', dietData.Week1 ? Object.keys(dietData.Week1) : 'NO DISPONIBLE');
            
            // Renderizar plan cuando createDietPlanHTML esté disponible
            if (typeof createDietPlanHTML === 'function') {
                createDietPlanHTML();
                console.log('Plan renderizado en UI');
            } else {
                console.warn('createDietPlanHTML no disponible aún, esperando DOM...');
                // Esperar a que el DOM esté listo
                document.addEventListener('DOMContentLoaded', () => {
                    if (typeof createDietPlanHTML === 'function') {
                        createDietPlanHTML();
                        console.log('Plan renderizado en UI (post-DOM)');
                    }
                });
            }
        } else {
            console.error('No se pudo generar plan válido');
            if (window.showNotification) {
                window.showNotification('Error al generar el plan nutricional', 'error');
            }
        }
    } catch (err) {
        console.error('Error generando/cargando plan del usuario:', err);
        if (window.showNotification) {
            window.showNotification('No se pudo generar el plan personalizado', 'error');
        }
    }
});
console.log('Listener userLoaded registrado correctamente FUERA de DOMContentLoaded');

document.addEventListener('DOMContentLoaded', () => {
    console.log('script.js cargado - DOMContentLoaded');
    
    // --- ELEMENTOS GLOBALES DEL DOM ---
    const body = document.body;
    const mainClock = document.getElementById('main-clock');
    const focusClock = document.getElementById('focus-clock');
    const brightnessOverlay = document.getElementById('brightness-overlay');
    const dashboardView = document.getElementById('dashboard-view');
    const focusModeView = document.getElementById('focus-mode-view');
    const accessibilityPanel = document.getElementById('accessibility-panel');
    const themeSelect = document.getElementById('theme-select');
    const nightModeToggle = document.getElementById('night-mode-toggle');
    const brightnessSlider = document.getElementById('brightness-slider');
    const volumeSlider = document.getElementById('volume-slider');
    const fontSizeSlider = document.getElementById('font-size-slider');
    const allSounds = {
        forest: document.getElementById('forest-sound'),
        ocean: document.getElementById('ocean-sound'),
    };

    // --- SISTEMA DE NOTIFICACIONES ---
    function showNotification(message, type = 'info') {
        const container = document.getElementById('notification-container');
        const notification = document.createElement('div');
        notification.className = `notification ${type}`;
        
        const icons = {
            info: 'i',
            success: '✓',
            error: '✗',
            warning: '!'
        };
        
        notification.innerHTML = `
            <span class="notification-icon">${icons[type] || icons.info}</span>
            <div class="notification-content">
                <p class="notification-message">${message}</p>
            </div>
            <button class="notification-close">×</button>
        `;
        
        container.appendChild(notification);
        
        // Auto-cerrar después de 4 segundos
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        }, 4000);
        
        // Cerrar al hacer clic en la X
        notification.querySelector('.notification-close').addEventListener('click', () => {
            notification.style.animation = 'slideOutRight 0.3s ease-out';
            setTimeout(() => notification.remove(), 300);
        });
    }

    function showConfirm(message) {
        return new Promise((resolve) => {
            const modal = document.createElement('div');
            modal.className = 'confirm-modal';
            modal.innerHTML = `
                <div class="confirm-modal-content">
                    <p class="confirm-modal-message">${message}</p>
                    <div class="confirm-modal-buttons">
                        <button class="confirm-modal-btn cancel">Cancelar</button>
                        <button class="confirm-modal-btn confirm">Confirmar</button>
                    </div>
                </div>
            `;
            
            document.body.appendChild(modal);
            
            modal.querySelector('.confirm').addEventListener('click', () => {
                modal.remove();
                resolve(true);
            });
            
            modal.querySelector('.cancel').addEventListener('click', () => {
                modal.remove();
                resolve(false);
            });
            
            // Cerrar al hacer clic fuera
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.remove();
                    resolve(false);
                }
            });
        });
    }

    // Exponer funciones globalmente
    window.showNotification = showNotification;
    window.showConfirm = showConfirm;
    
    // --- BASE DE DATOS DE COMIDAS CON PASOS DETALLADOS PARA COSORI DUAL BLAZE ---
    const recipeSteps = {
        "yogur alpro": {
            completo: [
                "YOGUR CON AVENA Y FRUTOS ROJOS",
                "INGREDIENTES: 200g yogur Alpro natural, 30g avena integral, 50g frutos rojos, 1 cdita semillas de chía",
                "",
                "PREPARACIÓN",
                "1. Coloca 200g de yogur Alpro en un bol mediano de cristal o cerámica.",
                "2. Añade 30g de avena integral en hojuelas distribuyéndola uniformemente sobre el yogur.",
                "3. Agrega 50g de frutos rojos frescos o congelados (si usas congelados, déjalos descongelar 5 minutos).",
                "4. Espolvorea 1 cucharadita de semillas de chía por toda la superficie.",
                "5. Mezcla delicadamente con una cuchara hasta integrar todos los ingredientes.",
                "6. Deja reposar 5 minutos para que la avena y chía absorban la humedad y se suavicen antes de disfrutar."
            ]
        },
        "pollo al airfryer": {
            principal: [
                "PECHUGA DE POLLO",
                "INGREDIENTES: 150g pechuga de pollo, pimentón, ajo en polvo, pimienta negra, aceite en spray",
                "COSORI DUAL BLAZE — Función: POLLO | Temp: 190°C | Tiempo: 15 min",
                "",
                "1. Precalienta la Cosori Dual Blaze presionando el botón 'POLLO' hasta que alcance 190°C.",
                "2. Mientras precalienta, seca la pechuga de pollo con papel de cocina para eliminar el exceso de humedad.",
                "3. Sazona ambos lados generosamente con pimentón dulce, ajo en polvo y pimienta negra recién molida.",
                "4. Rocía ligeramente con aceite en spray por ambos lados para lograr un dorado perfecto y crujiente.",
                "5. Coloca el pollo en una de las cestas sin que toque los bordes, permitiendo la circulación del aire.",
                "6. Cocina durante 15 minutos. Cuando suene el pitido (aprox. 7-8 min), voltea la pechuga con pinzas.",
                "7. Verifica la cocción: debe alcanzar 75°C internamente y soltar jugos transparentes, no rosados.",
                "8. Deja reposar 3 minutos antes de cortar para que los jugos se redistribuyan."
            ],
            guarnicion: [
                "BONIATO ASADO Y BRÓCOLI",
                "",
                "BONIATO ASADO",
                "INGREDIENTES: 150g boniato, aceite de oliva, sal, pimienta, pimentón",
                "COSORI DUAL BLAZE — Función: VERDURAS | Temp: 200°C | Tiempo: 20 min",
                "",
                "1. Lava bien el boniato y sécalo. Puedes pelarlo o dejarlo con piel para más nutrientes.",
                "2. Córtalo en cubos de 2cm aproximadamente para una cocción uniforme.",
                "3. Coloca los cubos en un bol y rocía con 1 cucharadita de aceite de oliva.",
                "4. Sazona con sal marina, pimienta y una pizca de pimentón dulce.",
                "5. Mezcla bien con las manos para cubrir todos los cubos uniformemente.",
                "6. Precalienta la Cosori en función 'VERDURAS' a 200°C.",
                "7. Distribuye los cubos en la segunda cesta sin amontonar (puedes cocinarlos simultáneamente con el pollo).",
                "8. Cocina durante 20 minutos, agitando la cesta a mitad de cocción (10 min) para dorado uniforme.",
                "",
                "BRÓCOLI AL VAPOR",
                "INGREDIENTES: 150g brócoli fresco, sal, limón opcional",
                "MÉTODO: Vaporera o microondas",
                "",
                "1. Lava el brócoli y córtalo en ramilletes pequeños de tamaño uniforme.",
                "2. OPCIÓN A - Vaporera: Hierve agua en una olla con vaporera, coloca el brócoli y tapa.",
                "3. Cocina al vapor durante 5-7 minutos hasta que esté tierno pero firme, al dente.",
                "4. OPCIÓN B - Microondas: Coloca en un recipiente apto con 2 cucharadas de agua, tapa y cocina 3-4 min.",
                "5. Escurre el exceso de agua y sazona con una pizca de sal marina.",
                "6. Opcional: Rocía con unas gotas de limón recién exprimido para realzar el sabor."
            ]
        },
        "merluza al limón": {
            principal: [
                "━━━━━ MERLUZA AL LIMÓN EN PAPILLOTE ━━━━━",
                "INGREDIENTES: 180g merluza fresca, 1/2 limón, hierbas provenzales, sal, pimienta, papel de horno",
                "COSORI DUAL BLAZE → Función: PESCADO | Temp: 170°C | Tiempo: 10 min",
                "",
                "① Extiende un cuadrado grande de papel de horno (aprox. 30x30cm) sobre la encimera.",
                "② Coloca el filete de merluza (180g) limpio y seco en el centro del papel.",
                "③ Exprime medio limón fresco sobre todo el pescado, asegurándote de cubrir bien.",
                "④ Sazona ambos lados con sal marina, pimienta negra recién molida y hierbas provenzales.",
                "⑤ Dobla el papel creando un paquete cerrado herméticamente (tipo sobre), dejando espacio para el vapor.",
                "⑥ Precalienta la Cosori seleccionando función 'PESCADO' a 170°C.",
                "⑦ Coloca el papillote en la cesta con cuidado, asegurándote de que esté bien cerrado.",
                "⑧ Cocina durante 10 minutos sin abrir (el vapor cocina el pescado a la perfección).",
                "⑨ Retira con pinzas, abre el paquete con cuidado (el vapor quema) y sirve inmediatamente."
            ],
            guarnicion: [
                "━━━━━ ESPÁRRAGOS TRIGUEROS AL VAPOR ━━━━━",
                "INGREDIENTES: 150g espárragos trigueros frescos, sal, aceite de oliva virgen extra, limón",
                "MÉTODO: Vapor tradicional o microondas",
                "",
                "① Lava los espárragos bajo el grifo y seca con papel de cocina.",
                "② Corta la parte dura del tallo (los últimos 2-3cm de la base) doblándolos hasta que se rompan naturalmente.",
                "③ OPCIÓN A - Vaporera: Coloca agua en una olla, pon la vaporera y los espárragos.",
                "④ Cuece al vapor durante 4-6 minutos hasta que estén tiernos pero con algo de firmeza.",
                "⑤ OPCIÓN B - Microondas: Coloca en un plato con 1 cucharada de agua, cubre y cocina 2-3 min.",
                "⑥ Retira, escurre el exceso de agua y sazona con una pizca de sal marina.",
                "⑦ Rocía con un hilo de aceite de oliva virgen extra y unas gotas de limón.",
                "⑧ Sirve caliente como acompañamiento perfecto del pescado."
            ]
        },
        "lentejas guisadas": {
            completo: [
                "━━━━━ LENTEJAS GUISADAS CON POLLO ━━━━━",
                "INGREDIENTES: 200g lentejas cocidas, cebolla, zanahoria, 300ml caldo de verduras, 100g pollo cocido, aceite de oliva",
                "MÉTODO: Cacerola tradicional (no requiere airfryer)",
                "",
                "① En una cacerola mediana, calienta 1 cucharada de aceite de oliva virgen extra a fuego medio.",
                "② Pica finamente 1 cebolla mediana y 1 zanahoria pelada en cubos pequeños.",
                "③ Sofríe las verduras durante 5-7 minutos, removiendo ocasionalmente hasta que estén doradas y aromáticas.",
                "④ Añade 200g de lentejas ya cocidas (pueden ser de bote escurridas o hervidas previamente).",
                "⑤ Vierte 300ml de caldo de verduras casero o bajo en sodio, mezclando bien.",
                "⑥ Lleva a ebullición y luego reduce a fuego lento durante 20 minutos.",
                "⑦ Remueve ocasionalmente para evitar que se pegue y para que espese gradualmente.",
                "⑧ Mientras tanto, desmenuza 100g de pechuga de pollo cocida en trozos pequeños.",
                "⑨ Incorpora el pollo desmenuzado al guiso, mezcla bien e integra todos los sabores.",
                "⑩ Cocina 5 minutos más para que el pollo absorba el sabor del guiso.",
                "⑪ Rectifica de sal y pimienta si es necesario, sirve caliente en un plato hondo."
            ]
        },
        "solomillo de cerdo": {
            principal: [
                "━━━━━ SOLOMILLO DE CERDO A LAS FINAS HIERBAS ━━━━━",
                "INGREDIENTES: 150g solomillo de cerdo, romero fresco, tomillo, sal, pimienta, aceite en spray",
                "COSORI DUAL BLAZE → Función: CERDO | Temp: 180°C | Tiempo: 18 min",
                "",
                "① Seca bien el solomillo con papel de cocina para eliminar toda la humedad superficial.",
                "② Pica finamente hojas de romero fresco y tomillo (o usa 1 cucharadita de cada uno secos).",
                "③ Frota el solomillo con sal marina gruesa, pimienta negra recién molida y las hierbas aromáticas.",
                "④ Deja marinar a temperatura ambiente durante 10 minutos para que absorba todos los sabores.",
                "⑤ Precalienta la Cosori Dual Blaze seleccionando la función 'CERDO' a 180°C.",
                "⑥ Rocía el solomillo con aceite en spray por todos los lados para un sellado perfecto.",
                "⑦ Coloca la carne en el centro de la cesta sin que toque los laterales.",
                "⑧ Cocina durante 18 minutos. Cuando suene el pitido (9 min), voltea con pinzas.",
                "⑨ Al finalizar, retira el solomillo y colócalo en una tabla de cortar.",
                "⑩ Cúbrelo con papel de aluminio y deja reposar 5 minutos (los jugos se redistribuyen).",
                "⑪ Corta en medallones de 1cm de grosor contra la fibra de la carne.",
                "⑫ Sirve inmediatamente con los jugos que haya soltado por encima."
            ],
            guarnicion: [
                "━━━━━ PATATA ASADA & ENSALADA VERDE ━━━━━",
                "",
                "═══ PATATA ASADA ═══",
                "INGREDIENTES: 150g patatas, aceite de oliva, romero, sal, pimienta",
                "COSORI DUAL BLAZE → Función: VERDURAS | Temp: 200°C | Tiempo: 25 min",
                "",
                "① Lava bien las patatas bajo el grifo, frotándolas para eliminar tierra.",
                "② Córtalas en gajos o cubos de 2-3cm de tamaño uniforme (no las peles para más nutrientes).",
                "③ Coloca en un bol y añade 1 cucharadita de aceite de oliva, sal, pimienta y romero.",
                "④ Mezcla con las manos hasta que todos los gajos estén bien cubiertos.",
                "⑤ Precalienta la función 'VERDURAS' de la Cosori a 200°C.",
                "⑥ Distribuye los gajos en la segunda cesta en una sola capa, sin amontonar.",
                "⑦ Cocina durante 25 minutos, agitando la cesta cada 8-10 minutos para dorado uniforme.",
                "⑧ Están listas cuando estén doradas y crujientes por fuera, tiernas por dentro.",
                "",
                "═══ ENSALADA VERDE FRESCA ═══",
                "INGREDIENTES: Lechuga, rúcula, canónigos, tomate cherry, aceite, vinagre",
                "",
                "① Lava las hojas verdes (lechuga, rúcula, canónigos) en agua fría abundante.",
                "② Escurre bien usando un escurridor o centrifugador de ensaladas.",
                "③ Corta las hojas grandes en trozos del tamaño de un bocado.",
                "④ Lava y corta los tomates cherry por la mitad.",
                "⑤ Mezcla todos los vegetales en una ensaladera amplia.",
                "⑥ Aliña justo antes de servir con aceite de oliva, vinagre y una pizca de sal."
            ]
        },
        "huevos revueltos": {
            completo: [
                "━━━━━ HUEVOS REVUELTOS CON ESPINACAS ━━━━━",
                "INGREDIENTES: 2 huevos frescos, 1 puñado espinacas frescas, aceite de oliva, sal, pimienta",
                "MÉTODO: Sartén tradicional (no requiere airfryer)",
                "",
                "① Casca 2 huevos frescos en un bol limpio y seco.",
                "② Bátelos vigorosamente con un tenedor durante 30 segundos hasta que estén completamente integrados.",
                "③ Lava un buen puñado de espinacas frescas bajo el grifo y escurre el exceso de agua.",
                "④ Pica las espinacas en trozos medianos (no muy pequeños para mantener textura).",
                "⑤ Calienta una sartén antiadherente a fuego medio durante 1 minuto.",
                "⑥ Añade 1 cucharadita de aceite de oliva y distribúyelo por toda la superficie.",
                "⑦ Agrega las espinacas picadas y saltea durante 1 minuto hasta que se ablanden y reduzcan.",
                "⑧ Vierte los huevos batidos sobre las espinacas, distribuyéndolos uniformemente.",
                "⑨ Remueve constantemente con espátula de silicona en movimientos circulares amplios.",
                "⑩ Cocina durante 2-3 minutos hasta alcanzar la consistencia deseada (cuajados pero jugosos).",
                "⑪ Retira del fuego cuando aún parezcan ligeramente húmedos (seguirán cocinándose).",
                "⑫ Sazona con sal marina y pimienta negra recién molida, sirve inmediatamente."
            ]
        },
        "batido": {
            completo: [
                "━━━━━ BATIDO VERDE ENERGÉTICO ━━━━━",
                "INGREDIENTES: 1 plátano maduro, 30g espinacas frescas, 200ml bebida de avena fría",
                "",
                "① Pela 1 plátano maduro (debe tener algunas manchas marrones para mayor dulzor natural).",
                "② Córtalo en rodajas de aproximadamente 2cm para facilitar el licuado.",
                "③ Lava un puñado generoso de espinacas frescas (aprox. 30g) bajo el grifo con agua fría.",
                "④ Escurre bien las espinacas y sécalas ligeramente con papel de cocina.",
                "⑤ Coloca en el vaso de la licuadora primero las espinacas (quedan en el fondo, cerca de las cuchillas).",
                "⑥ Añade las rodajas de plátano por encima de las espinacas.",
                "⑦ Vierte 200ml de bebida de avena bien fría (si lo prefieres más frío, añade 2-3 cubitos de hielo).",
                "⑧ Tapa bien la licuadora y licúa a máxima potencia durante 45-60 segundos.",
                "⑨ Detén y verifica la textura: debe ser completamente homogénea, sin grumos de espinaca.",
                "⑩ Si queda muy espeso, añade 50ml más de bebida de avena y licúa 15 segundos adicionales.",
                "⑪ Sirve inmediatamente en un vaso alto y disfruta en los siguientes 15 minutos para conservar nutrientes."
            ]
        },
        "salmón": {
            principal: [
                "━━━━━ SALMÓN AL ENELDO ━━━━━",
                "INGREDIENTES: 180g filete de salmón fresco, limón, eneldo, sal marina, pimienta, aceite en spray",
                "COSORI DUAL BLAZE → Función: PESCADO | Temp: 180°C | Tiempo: 12 min",
                "",
                "① Precalienta la Cosori Dual Blaze presionando 'PESCADO' hasta alcanzar 180°C.",
                "② Si el salmón tiene escamas o espinas pequeñas, retíralas con pinzas de cocina.",
                "③ Seca bien el filete con papel de cocina por ambos lados.",
                "④ Coloca el salmón con la piel hacia abajo sobre papel de horno (facilita el desmoldado).",
                "⑤ Exprime el jugo de 1/4 de limón fresco sobre toda la superficie del pescado.",
                "⑥ Espolvorea eneldo seco (1 cucharadita) o eneldo fresco picado generosamente.",
                "⑦ Sazona con sal marina en escamas y pimienta negra recién molida al gusto.",
                "⑧ Rocía ligeramente con aceite en spray por la parte superior (ayuda al dorado).",
                "⑨ Transfiere el papel con el salmón a la cesta de la freidora con cuidado.",
                "⑩ Cocina durante 12 minutos sin voltear (el papel evita que se pegue).",
                "⑪ El salmón está perfecto cuando el interior queda rosado jugoso, no seco ni opaco.",
                "⑫ Sirve inmediatamente con una rodaja de limón fresco para exprimir al gusto."
            ],
            guarnicion: [
                "━━━━━ QUINOA COCIDA CON LIMÓN ━━━━━",
                "INGREDIENTES: 50g quinoa seca, 120ml agua o caldo, limón, sal",
                "",
                "① Enjuaga 50g de quinoa bajo el grifo en un colador fino durante 1 minuto (elimina el sabor amargo).",
                "② Coloca la quinoa enjuagada en una cacerola pequeña.",
                "③ Añade 120ml de agua fría o caldo de verduras (proporción 1:2.4).",
                "④ Agrega una pizca de sal marina y remueve una vez.",
                "⑤ Lleva a ebullición a fuego alto sin tapar.",
                "⑥ Cuando hierva, reduce a fuego mínimo, tapa y cocina 12-15 minutos.",
                "⑦ Verifica que el agua se haya absorbido completamente y aparezca el 'germen' blanco.",
                "⑧ Retira del fuego y deja reposar tapada 5 minutos (absorbe humedad residual y esponja).",
                "⑨ Destapa y esponja con un tenedor, separando los granos delicadamente.",
                "⑩ Añade ralladura de limón y unas gotas de jugo para un toque fresco.",
                "⑪ Sirve caliente como base perfecta para el salmón."
            ]
        },
        "curry de garbanzos": {
            completo: [
                "━━━━━ CURRY DE GARBANZOS CON ESPINACAS Y LECHE DE COCO ━━━━━",
                "INGREDIENTES: 400g garbanzos cocidos, cebolla, 2 cditas curry, 1 cdita comino, 200ml leche de coco light, espinacas",
                "MÉTODO: Sartén grande o wok (no requiere airfryer)",
                "",
                "① Pica 1 cebolla mediana en cubos pequeños de tamaño uniforme.",
                "② Calienta una sartén grande o wok a fuego medio con 1 cucharada de aceite de oliva.",
                "③ Sofríe la cebolla durante 5 minutos, removiendo ocasionalmente hasta que esté transparente y aromática.",
                "④ Añade 2 cucharaditas colmadas de curry en polvo de calidad y 1 cucharadita de comino molido.",
                "⑤ Remueve rápidamente durante 1 minuto para tostar las especias y liberar sus aromas (cuidado de no quemar).",
                "⑥ Incorpora 400g de garbanzos cocidos bien escurridos (si son de bote, enjuágalos primero).",
                "⑦ Mezcla bien para que los garbanzos se cubran completamente con la mezcla de especias.",
                "⑧ Vierte 200ml de leche de coco light (si prefieres más cremoso, usa normal).",
                "⑨ Remueve y lleva a ebullición suave, luego reduce a fuego medio-bajo.",
                "⑩ Añade un buen puñado de espinacas frescas lavadas (aproximadamente 100g).",
                "⑪ Cocina durante 10-15 minutos, removiendo de vez en cuando hasta que espese ligeramente.",
                "⑫ Las espinacas se reducirán y se integrarán perfectamente en la salsa.",
                "⑬ Prueba y rectifica con sal si es necesario (los garbanzos de bote suelen traer sal).",
                "⑭ Sirve caliente solo o acompañado de arroz integral basmati."
            ]
        },
        "albóndigas": {
            principal: [
                "━━━━━ ALBÓNDIGAS DE POLLO EN SALSA DE TOMATE ━━━━━",
                "",
                "═══ ALBÓNDIGAS ═══",
                "INGREDIENTES: 300g carne picada de pollo, cebolla, ajo, perejil, 1 huevo, pan rallado, sal, pimienta",
                "COSORI DUAL BLAZE → Función: POLLO | Temp: 180°C | Tiempo: 8 min (para dorar)",
                "",
                "① En un bol grande, coloca 300g de carne picada de pollo fresca.",
                "② Pica finamente media cebolla pequeña, 1 diente de ajo y un puñado de perejil fresco.",
                "③ Añade las verduras picadas al bol junto con 1 huevo batido.",
                "④ Agrega 2 cucharadas de pan rallado, sal marina y pimienta negra recién molida.",
                "⑤ Mezcla todos los ingredientes con las manos hasta obtener una masa homogénea.",
                "⑥ Humedece tus manos con agua fría y forma bolitas del tamaño de una nuez (aprox. 12 unidades).",
                "⑦ Coloca las albóndigas formadas en un plato mientras precalientas la Cosori.",
                "⑧ Precalienta la freidora en función 'POLLO' a 180°C.",
                "⑨ Rocía las albóndigas con aceite en spray por todos los lados.",
                "⑩ Distribúyelas en la cesta sin que se toquen entre ellas (cocina en tandas si es necesario).",
                "⑪ Cocina durante 8 minutos, agitando la cesta suavemente a mitad de cocción (4 min).",
                "⑫ Deben quedar doradas por fuera pero aún jugosas por dentro.",
                "",
                "═══ SALSA DE TOMATE CASERA ═══",
                "INGREDIENTES: 400g tomate triturado, 2 dientes ajo, aceite, orégano, sal",
                "",
                "① Mientras se cocinan las albóndigas, prepara la salsa en una sartén amplia.",
                "② Calienta 1 cucharada de aceite de oliva y sofríe 2 dientes de ajo laminados hasta dorar.",
                "③ Añade 400g de tomate triturado de calidad y remueve bien.",
                "④ Sazona con sal, pimienta y 1 cucharadita de orégano seco.",
                "⑤ Cocina a fuego medio-bajo durante 10 minutos para que reduzca y concentre sabores.",
                "⑥ Incorpora las albóndigas doradas del airfryer directamente en la salsa.",
                "⑦ Cocina todo junto a fuego lento durante 15 minutos más, removiendo ocasionalmente.",
                "⑧ Las albóndigas absorberán el sabor de la salsa y terminarán de cocinarse perfectamente.",
                "⑨ Sirve caliente con la salsa por encima y perejil fresco picado como decoración."
            ]
        },
        "default": {
            completo: [
                "━━━━━ GUÍA GENERAL COSORI DUAL BLAZE ━━━━━",
                "",
                "① ORGANIZACIÓN: Prepara todos los ingredientes frescos, lávalos y sécalos con papel de cocina antes de empezar.",
                "② LECTURA PREVIA: Lee la receta completa para entender el proceso y los tiempos, evitarás errores y prisas.",
                "③ FUNCIONES AUTOMÁTICAS: Utiliza los programas preestablecidos (POLLO, PESCADO, CERDO, VERDURAS) para resultados óptimos.",
                "④ ESPACIO Y CIRCULACIÓN: Nunca sobrecargues las cestas, el aire debe circular libremente alrededor de los alimentos.",
                "⑤ USO MÍNIMO DE ACEITE: Un spray ligero o pincelada es suficiente, la freidora de aire requiere muy poco aceite.",
                "⑥ DOBLE CESTA: Aprovecha las dos cestas independientes para cocinar simultáneamente plato principal y guarnición.",
                "⑦ TEMPERATURA INTERNA: Para carnes, verifica siempre la temperatura interna (pollo 75°C, cerdo 70°C, pescado 63°C).",
                "⑧ REPOSO: Deja reposar las carnes 3-5 minutos antes de cortar para redistribuir los jugos y mantener jugosidad.",
                "⑨ LIMPIEZA: Limpia las cestas inmediatamente después de usar con agua tibia y jabón suave.",
                "⑩ EQUILIBRIO NUTRICIONAL: Acompaña siempre con verduras frescas o al vapor para una comida completa y equilibrada."
            ]
        }
    };

    const breakfasts = [
        { desc: "400g Yogur Alpro + 30g avena + 50g frutos rojos + 1 cdita chía.", video: "https://www.youtube.com/embed/5ohAY_gSHrE" },
        { desc: "2 huevos revueltos con espinacas + 1 rebanada de pan integral con tomate y aguacate.", video: "https://www.youtube.com/embed/BLsK-3gB4sA" },
        { desc: "Batido: 200ml bebida de avena, 1 plátano y un puñado de espinacas.", video: "https://www.youtube.com/embed/zJj44d739vg" },
    ];

    // ==================== CALORÍAS POR TIPO DE COMIDA ====================
    const MEAL_CALORIES = {
        // DESAYUNOS (~450 kcal)
        "avena": 420,
        "yogur alpro": 420,
        "tostadas": 410,
        "huevos revueltos": 430,
        "batido": 390,
        
        // COMIDAS (~700 kcal)
        "pollo al airfryer": 690, "pollo con especias": 690, "contramuslos": 690,
        "solomillo de cerdo": 705, "solomillo cerdo": 705, "secreto de cerdo": 720,
        "cinta de lomo": 680, "merluza": 640, "bacalao": 640, "dorada": 650,
        "sepia": 620, "choco": 620, "gallo": 630, "pescado blanco": 640,
        "salmón": 705, "pavo": 680, "ternera": 710, "lentejas": 650,
        "garbanzos": 660, "curry": 660, "potaje": 680, "hamburguesa": 670,
        "albóndigas": 690, "pasta integral": 720, "paella": 710, "lasaña": 690,
        "fajitas": 700, "arroz caldoso": 680, "guiso": 670, "pollo asado": 720,
        
        // MERIENDAS (~225 kcal)
        "yogur alpro natural": 225, "chips de boniato": 180, "garbanzos tostados": 185,
        "edamames": 190, "gajos de manzana": 120, "nuggets": 150, "chips de calabacín": 140,
        "chips de kale": 130, "anacardos": 100, "tiras de zanahoria": 190, "palitos de pepino": 150,
        
        // CENAS (~650 kcal)
        "pechuga de pollo en tiras": 645, "revuelto": 655, "tortilla": 655,
        "crema de calabaza": 620, "crema de puerros": 630, "crema de champiñones": 640,
        "crema de verduras": 600, "sopa": 630, "ensalada de garbanzos": 650,
        "brochetas": 660, "wok": 630, "pizza": 670, "huevos al plato": 650,
        "coliflor asada": 640, "ensalada templada": 620, "pimientos rellenos": 640,
        "tofu": 630, "cuscús": 610, "comida libre": 700, "snack opcional": 200, "cena ligera": 450
    };

    // Función para estimar calorías de una comida
    function estimateMealCalories(mealDesc) {
        const descLower = mealDesc.toLowerCase();
        for (let key in MEAL_CALORIES) {
            if (descLower.includes(key)) return MEAL_CALORIES[key];
        }
        if (descLower.includes('snack') || descLower.includes('chips')) return 180;
        return 0;
    }

    // Función para calcular calorías totales del día
    function calculateDayCalories(dayMeals) {
        // ACTUALIZADO: Usar el campo totalKcal que viene de meal-planner.js con datos BEDCA verificados
        if (dayMeals.totalKcal) {
            return Math.round(dayMeals.totalKcal);
        }
        
        // Fallback: sumar calorías individuales si totalKcal no está disponible
        let total = 0;
        Object.keys(dayMeals).forEach(mealType => {
            // Saltar campos que no son comidas
            if (mealType === 'totalKcal' || mealType === 'targetKcal' || mealType === 'dayType') {
                return;
            }
            
            const meal = dayMeals[mealType];
            if (meal && meal.kcal) {
                total += meal.kcal;
            } else if (meal && meal.desc) {
                // Solo si no hay kcal definido, intentar estimar (método antiguo)
                total += estimateMealCalories(meal.desc);
            }
        });
        return Math.round(total);
    }

    // dietData se declaró globalmente fuera de DOMContentLoaded

    function generateFullDietPlan() {
        const meals = {
            Week1: { Lunes: { C: { d: "130g pollo al airfryer con especias + 120g boniato asado + 200g brócoli.", v: "https://www.youtube.com/embed/RZslI_d3uU4" }, M: { d: "400g Yogur Alpro natural + 10g nueces.", v: "https://www.youtube.com/embed/LA3-k_2oE-0" }, Ce: { d: "140g merluza al limón en airfryer + 150g espárragos + 80g pimientos.", v: "https://www.youtube.com/embed/i0-IL2dG2-4" } }, Martes: { C: { d: "120g solomillo de cerdo a las finas hierbas en airfryer + 120g patata asada + ensalada.", v: "https://www.youtube.com/embed/T6d-B-8Kj9c" }, M: { d: "Snack: 80g Chips de boniato al airfryer (peso antes cocinar).", v: "https://www.youtube.com/embed/eWxJgBv615g" }, Ce: { d: "130g pechuga de pollo en tiras con pimiento y cebolla + 80g quinoa cocida.", v: "https://www.youtube.com/embed/FmEia340-9w" } }, Miércoles: { C: { d: "180g lentejas guisadas con verduras y 100g pollo desmenuzado.", v: "https://www.youtube.com/embed/t8325M0aF2U" }, M: { d: "400g Yogur Alpro + 10g nueces", v: "https://www.youtube.com/embed/LA3-k_2oE-0" }, Ce: { d: "140g bacalao en airfryer + puré de calabacín 150g.", v: "https://www.youtube.com/embed/uQiFODi_S54" } }, Jueves: { C: { d: "120g Solomillo de cerdo + 120g boniato + ensalada verde 150g.", v: "https://www.youtube.com/embed/T6d-B-8Kj9c" }, M: { d: "Snack: 50g Garbanzos tostados al airfryer.", v: "https://www.youtube.com/embed/fD3udA39GEs" }, Ce: { d: "Crema de calabaza 200ml + 2 huevos duros + 80g atún al natural.", v: "https://www.youtube.com/embed/d3hzCHo98aA" } }, Viernes: { C: { d: "130g Contramuslos de pollo al ajillo en airfryer + 120g patata + 100g pimientos de padrón.", v: "https://www.youtube.com/embed/r1mY4i7M0WE" }, M: { d: "400g Yogur Alpro + 10g nueces", v: "https://www.youtube.com/embed/LA3-k_2oE-0" }, Ce: { d: "140g Pescado blanco a la plancha con ajo + 200g brócoli al vapor.", v: "https://www.youtube.com/embed/Xoq7hmncZg8" } }, Sábado: { C: { d: "120g Hamburguesa casera de pollo en airfryer (sin pan) + ensalada completa 200g.", v: "https://www.youtube.com/embed/e_n4-Soa22w" }, M: { d: "Snack: 100g 'Nuggets' de coliflor en airfryer.", v: "https://www.youtube.com/embed/BvtBoch8OEk" }, Ce: { d: "Revuelto de 3 huevos con champiñones 100g, espinacas 80g y gambas 60g.", v: "https://www.youtube.com/embed/xVwtY8iZkY0" } }, Domingo: { C: { d: "120g Solomillo de cerdo al horno con hierbas + 120g boniato asado.", v: "https://www.youtube.com/embed/3D0tGgI0XOY" }, M: { d: "400g Yogur Alpro + 10g nueces", v: "https://www.youtube.com/embed/LA3-k_2oE-0" }, Ce: { d: "Sopa de verduras 300ml + 130g de pollo a la plancha desmenuzado.", v: "https://www.youtube.com/embed/wzJ9lztfcvk" } } },
            Week2: { Lunes: { C: { d: "120g Salmón al airfryer con eneldo y limón + 120g de quinoa cocida.", v: "https://www.youtube.com/embed/oVigoIHkI0k" }, M: { d: "400g Yogur Alpro + 10g de almendras.", v: "https://www.youtube.com/embed/LA3-k_2oE-0" }, Ce: { d: "Tortilla francesa con espinacas 80g y champiñones 60g (3 huevos).", v: "https://www.youtube.com/embed/LdG3G22Ju-A" } }, Martes: { C: { d: "130g de pavo a la plancha + puré de calabaza 150g + 120g judías verdes.", v: "https://www.youtube.com/embed/TqHk-86e0pI" }, M: { d: "Snack: 60g Edamames tostados al airfryer.", v: "https://www.youtube.com/embed/hJq2gZ-P2kI" }, Ce: { d: "Ensalada de 120g garbanzos con 80g atún, pimiento, cebolla y 1 huevo duro.", v: "https://www.youtube.com/embed/82nBEa_i2gI" } }, Miércoles: { C: { d: "130g ternera magra en tiras con brócoli 150g y pimiento 80g + 80g arroz integral cocido.", v: "https://www.youtube.com/embed/z4j9t3vB_zQ" }, M: { d: "400g Yogur Alpro + 10g nueces.", v: "https://www.youtube.com/embed/LA3-k_2oE-0" }, Ce: { d: "Crema de puerros 200ml + 140g de merluza al vapor.", v: "https://www.youtube.com/embed/n42sB2HwG2s" } }, Jueves: { C: { d: "Curry de 150g garbanzos y 100g espinacas con 100ml leche de coco light.", v: "https://www.youtube.com/embed/If-6Lej8zi0" }, M: { d: "Snack: 100g Gajos de manzana al airfryer con canela.", v: "https://www.youtube.com/embed/s3yEft40_4Q" }, Ce: { d: "140g de dorada a la sal en airfryer + 150g espárragos trigueros.", v: "https://www.youtube.com/embed/s7wN8r-yYw4" } }, Viernes: { C: { d: "Repetir: 180g Lentejas guisadas con verduras (de Semana 1).", v: "https://www.youtube.com/embed/t8325M0aF2U" }, M: { d: "400g Yogur Alpro + 10g de nueces.", v: "https://www.youtube.com/embed/LA3-k_2oE-0" }, Ce: { d: "Brochetas de 120g pollo y verduras 150g (calabacín, cebolla, pimiento) al airfryer.", v: "https://www.youtube.com/embed/I053zE0hS-4" } }, Sábado: { C: { d: "Lasaña de calabacín con 100g carne picada de pollo o pavo.", v: "https://www.youtube.com/embed/yCjCQRn2h-k" }, M: { d: "Snack: 100g Tiras de zanahoria con 50g hummus.", v: "https://www.youtube.com/embed/g-5e8d54zYA" }, Ce: { d: "Wok de verduras 200g con 100g gambas y un toque de soja.", v: "https://www.youtube.com/embed/k9TqG8o71cI" } }, Domingo: { C: { d: "120g de secreto de cerdo ibérico al airfryer + 120g patatas gajo especiadas al airfryer.", v: "https://www.youtube.com/embed/p1uGfSjJk0s" }, M: { d: "400g Yogur Alpro + 10g nueces.", v: "https://www.youtube.com/embed/LA3-k_2oE-0" }, Ce: { d: "Crema de champiñones 200ml + 130g de pechuga de pollo a la plancha.", v: "https://www.youtube.com/embed/xT0_I0f252M" } } },
            Week3: { Lunes: { C: { d: "70g Pasta integral (en crudo) con pesto de aguacate y tomates cherry + 130g pollo.", v: "https://www.youtube.com/embed/L1m1Dj4R-84" }, M: { d: "400g Yogur Alpro + 10g almendras.", v: "https://www.youtube.com/embed/LA3-k_2oE-0" }, Ce: { d: "140g sepia a la plancha con ajo y perejil + ensalada 150g.", v: "https://www.youtube.com/embed/V6X-MLgJz_w" } }, Martes: { C: { d: "Potaje de 150g garbanzos con 100g bacalao y 80g espinacas.", v: "https://www.youtube.com/embed/C-dEgJ1hJzY" }, M: { d: "Snack: 80g Chips de calabacín al airfryer (peso antes cocinar).", v: "https://www.youtube.com/embed/1vugL8p-6j8" }, Ce: { d: "2 hamburguesas de 100g pavo (sin pan) + 100g pimientos de piquillo.", v: "https://www.youtube.com/embed/g6xW-IA1SjA" } }, Miércoles: { C: { d: "120g cinta de lomo a la plancha + 120g berenjena y 100g calabacín al airfryer.", v: "https://www.youtube.com/embed/G6g8x-GZ_aU" }, M: { d: "400g Yogur Alpro + 10g nueces.", v: "https://www.youtube.com/embed/LA3-k_2oE-0" }, Ce: { d: "Revuelto de 150g tofu con verduras 120g y cúrcuma.", v: "https://www.youtube.com/embed/U3iP5-8CR28" } }, Jueves: { C: { d: "Repetir: 130g Pollo al airfryer con 120g boniato (Semana 1).", v: "https://www.youtube.com/embed/RZslI_d3uU4" }, M: { d: "Snack: 15g de anacardos crudos.", v: "https://www.youtube.com/embed/LA3-k_2oE-0" }, Ce: { d: "Sopa juliana 250ml + 2 filetes de 120g gallo a la plancha.", v: "https://www.youtube.com/embed/pC8-PusWNvo" } }, Viernes: { C: { d: "5 Albóndigas de pollo (100g total) en salsa de tomate casera + 80g quinoa cocida.", v: "https://www.youtube.com/embed/C8O0-E9h9-A" }, M: { d: "400g Yogur Alpro + 10g nueces.", v: "https://www.youtube.com/embed/LA3-k_2oE-0" }, Ce: { d: "Pizza con base de coliflor 200g y toppings saludables (verduras + 60g queso).", v: "https://www.youtube.com/embed/nxxG2y-I7YI" } }, Sábado: { C: { d: "Paella de marisco 250g porción (controlando aceite a 10ml).", v: "https://www.youtube.com/embed/i05kE_g8__k" }, M: { d: "Snack: 100g Palitos de pepino con 100g yogur.", v: "https://www.youtube.com/embed/g-5e8d54zYA" }, Ce: { d: "Huevos al plato (2 huevos) con 100g tomate y 80g guisantes (en airfryer).", v: "https://www.youtube.com/embed/lF-O2C2v4gM" } }, Domingo: { C: { d: "1/4 de pollo asado 200g (hecho en airfryer) + ensalada mixta 150g.", v: "https://www.youtube.com/embed/Q4c51A43v20" }, M: { d: "400g Yogur Alpro + 10g nueces.", v: "https://www.youtube.com/embed/LA3-k_2oE-0" }, Ce: { d: "Falso cuscús de 200g brócoli con 15g almendras y 20g pasas.", v: "https://www.youtube.com/embed/Y0iQOMPAX2M" } } },
            Week4: { Lunes: { C: { d: "Repetir: 120g Salmón al airfryer (Semana 2).", v: "https://www.youtube.com/embed/oVigoIHkI0k" }, M: { d: "400g Yogur Alpro + 10g nueces.", v: "https://www.youtube.com/embed/LA3-k_2oE-0" }, Ce: { d: "Coliflor asada 200g al airfryer con especias + 130g pavo plancha.", v: "https://www.youtube.com/embed/zH3ZTuSZG-I" } }, Martes: { C: { d: "Guiso de 150g patatas con 120g choco (sepia).", v: "https://www.youtube.com/embed/6iO4w3n-pXg" }, M: { d: "Snack: 50g Chips de kale al airfryer.", v: "https://www.youtube.com/embed/i4qsjV2pDHY" }, Ce: { d: "Ensalada templada de 80g gulas con ajo y 80g gambas.", v: "https://www.youtube.com/embed/bL7Xh7bFEmA" } }, Miércoles: { C: { d: "Arroz caldoso 250g con 100g pollo y verduras 100g.", v: "https://www.youtube.com/embed/J7GPolcF5xE" }, M: { d: "400g Yogur Alpro + 10g nueces.", v: "https://www.youtube.com/embed/LA3-k_2oE-0" }, Ce: { d: "Pimientos rellenos de 80g atún y 1 huevo (versión fría).", v: "https://www.youtube.com/embed/8-PtpF0aAFw" } }, Jueves: { C: { d: "Repetir: Curry de 150g garbanzos (Semana 2).", v: "https://www.youtube.com/embed/If-6Lej8zi0" }, M: { d: "Snack: 50g Garbanzos tostados al airfryer.", v: "https://www.youtube.com/embed/fD3udA39GEs" }, Ce: { d: "Sopa de pescado 250ml con 100g pescado variado.", v: "https://www.youtube.com/embed/nI4b-sOQ2w8" } }, Viernes: { C: { d: "Fajitas de 120g pollo y 100g pimientos (usando 2 tortillas integrales 60g).", v: "https://www.youtube.com/embed/BvE8g-g6m1o" }, M: { d: "400g Yogur Alpro + 10g nueces.", v: "https://www.youtube.com/embed/LA3-k_2oE-0" }, Ce: { d: "140g Pescado blanco en papillote al airfryer con verduras 120g.", v: "https://www.youtube.com/embed/eZaWk5Yjz68" } }, Sábado: { C: { d: "Comida libre/social con control de cantidades (objetivo 700kcal).", v: "https://www.youtube.com/embed/G6J7kP0G5sE" }, M: { d: "Snack opcional según hambre (máx 200kcal).", v: "https://www.youtube.com/embed/LA3-k_2oE-0" }, Ce: { d: "Cena ligera: tortilla francesa (2 huevos) y una pieza de fruta 150g.", v: "https://www.youtube.com/embed/888qr8dnGEk" } }, Domingo: { C: { d: "Repetir comida favorita del mes (controlando porciones).", v: "https://www.youtube.com/embed/G6J7kP0G5sE" }, M: { d: "400g Yogur Alpro + 10g nueces.", v: "https://www.youtube.com/embed/LA3-k_2oE-0" }, Ce: { d: "Crema de verduras 250ml + 1 lata de 80g atún al natural.", v: "https://www.youtube.com/embed/0nhec3Eaezw" } } },
        };
        const weekTemplate = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo'];
        let breakfastIndex = 0;
        for (let w = 1; w <= 4; w++) {
            const weekKey = `Week${w}`;
            dietData[weekKey] = {};
            weekTemplate.forEach(day => {
                dietData[weekKey][day] = {
                    'Desayuno': { desc: breakfasts[breakfastIndex].desc, video: breakfasts[breakfastIndex].video },
                    'Comida': { desc: meals[weekKey][day].C.d, video: meals[weekKey][day].C.v },
                    'Merienda': { desc: meals[weekKey][day].M.d, video: meals[weekKey][day].M.v },
                    'Cena': { desc: meals[weekKey][day].Ce.d, video: meals[weekKey][day].Ce.v }
                };
                breakfastIndex = (breakfastIndex + 1) % breakfasts.length;
            });
        }
    }
    
    // --- CONTADOR DE AGUA MEJORADO ---
    let currentWater = 0;
    let bottleSize = 500;
    let totalBottles = 5;
    
    function updateWaterDisplay() {
        const waterGoal = 2500;
        const waterProgress = document.getElementById('water-progress');
        const bottlesConsumed = document.getElementById('bottles-consumed');
        const totalBottlesSpan = document.getElementById('total-bottles');
        const bottlesContainer = document.getElementById('bottles-container');
        
        waterProgress.textContent = currentWater;
        
        totalBottles = Math.ceil(waterGoal / bottleSize);
        totalBottlesSpan.textContent = totalBottles;
        
        const consumedBottles = Math.floor(currentWater / bottleSize);
        const partialFill = (currentWater % bottleSize) / bottleSize * 100;
        
        bottlesConsumed.textContent = consumedBottles;
        
        // Generar botellas dinámicamente
        bottlesContainer.innerHTML = '';
        for (let i = 0; i < totalBottles; i++) {
            const bottleDiv = document.createElement('div');
            bottleDiv.className = 'water-bottle';
            
            let fillHeight = 0;
            if (i < consumedBottles) {
                fillHeight = 100;
            } else if (i === consumedBottles) {
                fillHeight = partialFill;
            }
            
            bottleDiv.innerHTML = `
                <div class="bottle-cap"></div>
                <div class="bottle">
                    <div class="bottle-fill" style="height: ${fillHeight}%"></div>
                </div>
                <div class="bottle-label">${bottleSize}ml</div>
            `;
            bottlesContainer.appendChild(bottleDiv);
        }
    }
    
    // --- TEMPORIZADOR DE CONCENTRACIÓN ---
    let timerInterval;
    let timeLeft = 1500; // 25 minutos
    let defaultTime = 1500;
    let isTimerRunning = false;
    
    function updateTimerDisplay() {
        const minutes = Math.floor(timeLeft / 60);
        const seconds = timeLeft % 60;
        document.getElementById('timer-display').textContent = 
            `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;
    }
    
    function setTimerMinutes(minutes) {
        defaultTime = minutes * 60;
        timeLeft = defaultTime;
        updateTimerDisplay();
        if (isTimerRunning) {
            clearInterval(timerInterval);
            isTimerRunning = false;
            document.getElementById('start-timer-btn').innerHTML = 'Iniciar';
        }
    }
    
    function startTimer() {
        if (isTimerRunning) {
            clearInterval(timerInterval);
            document.getElementById('start-timer-btn').innerHTML = 'Reanudar';
            isTimerRunning = false;
        } else {
            document.getElementById('start-timer-btn').innerHTML = 'Pausar';
            isTimerRunning = true;
            timerInterval = setInterval(() => {
                timeLeft--;
                updateTimerDisplay();
                if (timeLeft <= 0) {
                    clearInterval(timerInterval);
                    alert("¡Tiempo cumplido! ¡Tómate un descanso de 5 minutos!");
                    resetTimer();
                }
            }, 1000);
        }
    }
    
    function resetTimer() {
        clearInterval(timerInterval);
        timeLeft = defaultTime;
        updateTimerDisplay();
        document.getElementById('start-timer-btn').innerHTML = 'Iniciar';
        isTimerRunning = false;
    }
    
    // --- RECORDATORIOS ROTATIVOS ---
    const reminders = [
        "Enfócate en el progreso, no en la perfección.",
        "Cada pequeño paso cuenta.",
        "La constancia es la clave del éxito.",
        "Tu salud es tu mayor inversión.",
        "Bebe un poco de agua.",
        "Respira profundo y relájate.",
        "Un paso a la vez."
    ];
    
    function rotateReminders() {
        const reminderText = document.getElementById('reminder-text');
        if (!reminderText) {
            console.warn('⚠️ Elemento reminder-text no encontrado');
            return;
        }
        let currentIndex = 0;
        setInterval(() => {
            reminderText.style.opacity = 0;
            setTimeout(() => {
                currentIndex = (currentIndex + 1) % reminders.length;
                reminderText.textContent = `"${reminders[currentIndex]}"`;
                reminderText.style.opacity = 1;
            }, 500);
        }, 10000);
    }
    
    // --- GENERADOR DE LISTA DE COMPRA ---
    function generateShoppingList() {
        // Determinar semana actual (1-4) y preseleccionar
        const today = new Date();
        const dayOfMonth = today.getDate();
        const currentWeek = Math.ceil(dayOfMonth / 7);
        const weekNumber = ((currentWeek - 1) % 4) + 1;
        
        const modal = document.getElementById('shopping-list-modal');
        const weekSelect = document.getElementById('week-select');
        
        // Preseleccionar la semana actual
        weekSelect.value = weekNumber.toString();
        
        // Generar lista para la semana actual
        updateShoppingListForWeek(weekNumber);
        
        modal.classList.remove('hidden');
    }
    
    function updateShoppingListForWeek(weekNumber) {
        const weekKey = `Week${weekNumber}`;
        const weekTitle = document.getElementById('shopping-week-title');
        const container = document.getElementById('shopping-list-container');
        
        weekTitle.textContent = `Semana ${weekNumber}`;
        
        // Organizar por supermercados según mejor calidad-precio
        const shoppingByStore = {
            "Lidl / Aldi (Mejor Calidad-Precio)": [
                "4-5 pechugas de pollo (600-750g)",
                "300g solomillo de cerdo",
                "200g nueces sin sal",
                "150g almendras crudas",
                "1 bolsa espinacas frescas (200g)",
                "2-3 boniatos grandes",
                "2 pimientos variados",
                "2 calabacines",
                "1 cebolla grande",
                "4 yogures Alpro (pack 4x125g)",
                "1L bebida de avena"
            ],
            "Mercadona (Productos Específicos)": [
                "400g pescado blanco (merluza/bacalao)",
                "1 pack huevos (12 unidades)",
                "1 cabeza brócoli",
                "1 bolsa ensalada mixta",
                "2-3 tomates",
                "400g garbanzos cocidos (2 botes)",
                "200g lentejas cocidas (1 bote)",
                "Aceite oliva virgen extra",
                "Especias variadas"
            ],
            "Cualquier Supermercado": [
                "250g quinoa",
                "1 paquete arroz integral",
                "2 limones",
                "1 cabeza ajo",
                "Sal y pimienta",
                "1 paquete semillas chía",
                "50g frutos rojos",
                "1 plátano maduro",
                "30g avena en hojuelas"
            ]
        };
        
        // Ingredientes específicos por semana
        const weekSpecifics = {
            Week1: {
                store: "Mercadona",
                items: ["1 manojo espárragos", "1 calabaza pequeña", "300g champiñones"]
            },
            Week2: {
                store: "Mercadona / Lidl",
                items: ["180g salmón fresco", "Eneldo", "200ml leche coco light", "150g pavo filetes", "300g edamames congelados"]
            },
            Week3: {
                store: "Cualquier Supermercado",
                items: ["300g pasta integral", "2 aguacates", "250g tomates cherry", "180g sepia", "200g bacalao", "1 coliflor"]
            },
            Week4: {
                store: "Mercadona",
                items: ["Kale fresca", "1 pack gulas", "200g gambas", "2 tortillas integrales", "Pimientos piquillo"]
            }
        };
        
        // Generar HTML compacto
        let html = '';
        
        // Por cada supermercado
        for (const [store, items] of Object.entries(shoppingByStore)) {
            html += `<div class="shopping-store">`;
            html += `<h3>${store}</h3><ul>`;
            items.forEach(item => {
                html += `<li>${item}</li>`;
            });
            html += '</ul></div>';
        }
        
        // Agregar específicos de la semana
        if (weekSpecifics[weekKey]) {
            html += `<div class="shopping-store">`;
            html += `<h3>${weekSpecifics[weekKey].store} (Específicos Semana ${weekNumber})</h3><ul>`;
            weekSpecifics[weekKey].items.forEach(item => {
                html += `<li>${item}</li>`;
            });
            html += '</ul></div>';
        }
        
        container.innerHTML = html;
    }
    
    window.updateShoppingList = function() {
        const weekSelect = document.getElementById('week-select');
        const selectedWeek = parseInt(weekSelect.value);
        updateShoppingListForWeek(selectedWeek);
    };
    
    window.closeShoppingList = function() {
        const modal = document.getElementById('shopping-list-modal');
        modal.classList.add('hidden');
    };
    
    // --- LÓGICA DE LA APLICACIÓN ---
    function init() {
        console.log('🚀 Iniciando SuitoFocus...');
        
        checkAndResetDaily(); // Verificar si es un nuevo día y reiniciar
        loadSettings();
        
        // Iniciar reloj
        setInterval(updateClock, 1000);
        updateClock();

        // El plan de dieta ahora se genera al cargar un usuario (evento 'userLoaded')
        setupEventListeners();
        updateWaterDisplay();
        updateTimerDisplay();
        rotateReminders();
        loadOptionalFeatures(); // Cargar pastillas y to-do list si existen
        
        console.log('✅ Aplicación inicializada correctamente');
    }
    
    // Función para verificar y reiniciar cada día
    function checkAndResetDaily() {
        const today = new Date().toDateString();
        const lastDate = localStorage.getItem('lastVisitDate');
        
        if (lastDate !== today) {
            // Es un nuevo día, reiniciar estados
            localStorage.removeItem('todayMealsState');
            localStorage.removeItem('waterProgress');
            
            // Resetear pastillas completadas
            const pills = JSON.parse(localStorage.getItem('pillsReminders') || '[]');
            pills.forEach(pill => pill.completed = false);
            localStorage.setItem('pillsReminders', JSON.stringify(pills));
            
            // Resetear hábitos completados
            const habits = JSON.parse(localStorage.getItem('dailyHabits') || '[]');
            habits.forEach(habit => habit.completed = false);
            localStorage.setItem('dailyHabits', JSON.stringify(habits));
            
            localStorage.setItem('lastVisitDate', today);
        }
    }

    // Función para alternar modo pantalla completa
    function toggleFullscreen() {
        if (!document.fullscreenElement) {
            document.documentElement.requestFullscreen().catch(err => {
                console.error(`Error al intentar activar pantalla completa: ${err.message}`);
            });
        } else {
            if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }

    // Funciones para gestionar preferencias de widgets
    function saveWidgetPreferences() {
        const preferences = {
            pills: document.getElementById('show-pills-widget')?.checked || false,
            todos: document.getElementById('show-todos-widget')?.checked || false,
            habits: document.getElementById('show-habits-widget')?.checked || false,
            notes: document.getElementById('show-notes-widget')?.checked || false
        };
        localStorage.setItem('focusWidgetPreferences', JSON.stringify(preferences));
    }

    function loadWidgetPreferences() {
        const preferences = JSON.parse(localStorage.getItem('focusWidgetPreferences') || '{}');
        
        if (document.getElementById('show-pills-widget')) {
            document.getElementById('show-pills-widget').checked = preferences.pills || false;
        }
        if (document.getElementById('show-todos-widget')) {
            document.getElementById('show-todos-widget').checked = preferences.todos || false;
        }
        if (document.getElementById('show-habits-widget')) {
            document.getElementById('show-habits-widget').checked = preferences.habits || false;
        }
        if (document.getElementById('show-notes-widget')) {
            document.getElementById('show-notes-widget').checked = preferences.notes || false;
        }
        
        // Actualizar disponibilidad de widgets según lo que está activo en el dashboard
        updateWidgetSelectorAvailability();
    }

    function updateWidgetSelectorAvailability() {
        const pillsWidget = document.getElementById('pills-widget');
        const todosWidget = document.getElementById('todo-widget');
        const habitsWidget = document.getElementById('habit-widget');
        const notesWidget = document.getElementById('notes-widget');

        const pillsCheckbox = document.getElementById('show-pills-widget');
        const todosCheckbox = document.getElementById('show-todos-widget');
        const habitsCheckbox = document.getElementById('show-habits-widget');
        const notesCheckbox = document.getElementById('show-notes-widget');

        // Deshabilitar checkboxes de widgets que no están activos
        if (pillsCheckbox) {
            const isActive = pillsWidget && pillsWidget.hasAttribute('data-slot');
            pillsCheckbox.disabled = !isActive;
            pillsCheckbox.parentElement.style.opacity = isActive ? '1' : '0.4';
            if (!isActive) pillsCheckbox.checked = false;
        }

        if (todosCheckbox) {
            const isActive = todosWidget && todosWidget.hasAttribute('data-slot');
            todosCheckbox.disabled = !isActive;
            todosCheckbox.parentElement.style.opacity = isActive ? '1' : '0.4';
            if (!isActive) todosCheckbox.checked = false;
        }

        if (habitsCheckbox) {
            const isActive = habitsWidget && habitsWidget.hasAttribute('data-slot');
            habitsCheckbox.disabled = !isActive;
            habitsCheckbox.parentElement.style.opacity = isActive ? '1' : '0.4';
            if (!isActive) habitsCheckbox.checked = false;
        }

        if (notesCheckbox) {
            const isActive = notesWidget && notesWidget.hasAttribute('data-slot');
            notesCheckbox.disabled = !isActive;
            notesCheckbox.parentElement.style.opacity = isActive ? '1' : '0.4';
            if (!isActive) notesCheckbox.checked = false;
        }
    }

    // Función para cargar widgets activos en el modo focus
    function loadActiveWidgets() {
        const activeWidgetsList = document.getElementById('active-widgets-list');
        if (!activeWidgetsList) return;

        // Limpiar lista actual
        activeWidgetsList.innerHTML = '';

        // Obtener preferencias de widgets seleccionados
        const widgetPreferences = JSON.parse(localStorage.getItem('focusWidgetPreferences') || '{}');
        
        let hasVisibleWidgets = false;

        // Verificar qué widgets están activos en el dashboard
        const pillsWidget = document.getElementById('pills-widget');
        const todosWidget = document.getElementById('todo-widget');
        const habitsWidget = document.getElementById('habit-widget');
        const notesWidget = document.getElementById('notes-widget');

        // Verificar Pastillas Recordatorio (solo si está activo en dashboard)
        if (widgetPreferences.pills && pillsWidget && pillsWidget.hasAttribute('data-slot')) {
            const pills = JSON.parse(localStorage.getItem('pillsReminders') || '[]');
            if (pills.length > 0) {
                hasVisibleWidgets = true;
                const pillsCard = createWidgetCard('Pastillas Recordatorio', pills.map((pill, index) => ({
                    text: `${pill.name} - ${pill.time}`,
                    completed: pill.completed || false,
                    id: index,
                    type: 'pill'
                })), 'pill');
                activeWidgetsList.appendChild(pillsCard);
            }
        }

        // Verificar Lista de Tareas (solo si está activo en dashboard)
        if (widgetPreferences.todos && todosWidget && todosWidget.hasAttribute('data-slot')) {
            const todos = JSON.parse(localStorage.getItem('todoList') || '[]');
            if (todos.length > 0) {
                const incompleteTodos = todos.filter(todo => !todo.completed);
                
                if (incompleteTodos.length === 0) {
                    // Todas las tareas completadas - mostrar mensaje y ocultar después
                    hasVisibleWidgets = true;
                    const completedCard = document.createElement('div');
                    completedCard.className = 'completed-message';
                    completedCard.innerHTML = `
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                        <span>¡Todas las tareas completadas!</span>
                    `;
                    activeWidgetsList.appendChild(completedCard);
                    
                    // Eliminar el mensaje después de 3 segundos
                    setTimeout(() => {
                        completedCard.style.animation = 'fadeOut 0.5s ease';
                        setTimeout(() => {
                            completedCard.remove();
                            // Verificar si hay otros widgets visibles
                            checkIfEmpty();
                        }, 500);
                    }, 3000);
                } else {
                    hasVisibleWidgets = true;
                    const todosCard = createWidgetCard('Lista de Tareas', incompleteTodos.map((todo, index) => ({
                        text: todo.text,
                        completed: todo.completed || false,
                        id: index,
                        type: 'todo'
                    })), 'todo');
                    activeWidgetsList.appendChild(todosCard);
                }
            }
        }

        // Verificar Hábitos Diarios (solo si está activo en dashboard)
        if (widgetPreferences.habits && habitsWidget && habitsWidget.hasAttribute('data-slot')) {
            const habits = JSON.parse(localStorage.getItem('dailyHabits') || '[]');
            if (habits.length > 0) {
                hasVisibleWidgets = true;
                const habitsCard = createWidgetCard('Hábitos Diarios', habits.map((habit, index) => ({
                    text: habit.text,
                    completed: habit.completed || false,
                    id: index,
                    type: 'habit'
                })), 'habit');
                activeWidgetsList.appendChild(habitsCard);
            }
        }

        // Verificar Notas Rápidas (solo si está activo en dashboard)
        if (widgetPreferences.notes && notesWidget && notesWidget.hasAttribute('data-slot')) {
            const notesContent = localStorage.getItem('quickNotes') || '';
            if (notesContent) {
                hasVisibleWidgets = true;
                const notesCard = createWidgetCard('Notas Rápidas', [{
                    text: notesContent,
                    completed: false,
                    id: 0,
                    type: 'note',
                    isNote: true
                }], 'note');
                activeWidgetsList.appendChild(notesCard);
            }
        }

        // Mostrar placeholder si no hay widgets seleccionados
        checkIfEmpty();
        
        function checkIfEmpty() {
            if (activeWidgetsList.children.length === 0) {
                activeWidgetsList.innerHTML = `
                    <div class="empty-widgets-placeholder">
                        <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                            <rect x="3" y="3" width="7" height="7" rx="1"></rect>
                            <rect x="14" y="3" width="7" height="7" rx="1"></rect>
                            <rect x="14" y="14" width="7" height="7" rx="1"></rect>
                            <rect x="3" y="14" width="7" height="7" rx="1"></rect>
                        </svg>
                        <p>Selecciona widgets para mostrar</p>
                        <small>Haz clic en el botón "Widgets" arriba</small>
                    </div>
                `;
            }
        }
    }

    // Función para crear una tarjeta de widget
    function createWidgetCard(title, items, widgetType) {
        const card = document.createElement('div');
        card.className = 'focus-widget-card';
        card.dataset.widgetType = widgetType;
        
        const cardTitle = document.createElement('h4');
        cardTitle.textContent = title;
        card.appendChild(cardTitle);

        items.forEach(item => {
            const itemDiv = document.createElement('div');
            itemDiv.className = 'focus-widget-item';
            if (item.completed) itemDiv.classList.add('completed');

            if (!item.isNote) {
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.checked = item.completed;
                checkbox.addEventListener('change', () => {
                    toggleWidgetItem(item.type, item.id, checkbox.checked, card, widgetType);
                    itemDiv.classList.toggle('completed', checkbox.checked);
                });
                itemDiv.appendChild(checkbox);
            }

            const label = document.createElement('label');
            label.textContent = item.text;
            itemDiv.appendChild(label);

            card.appendChild(itemDiv);
        });

        return card;
    }

    // Función para alternar el estado de un item de widget
    function toggleWidgetItem(type, id, completed, card, widgetType) {
        let storageKey = '';
        switch(type) {
            case 'pill':
                storageKey = 'pillsReminders';
                break;
            case 'todo':
                storageKey = 'todoList';
                break;
            case 'habit':
                storageKey = 'dailyHabits';
                break;
            default:
                return;
        }

        const items = JSON.parse(localStorage.getItem(storageKey) || '[]');
        const item = items.find(i => i.id === id);
        if (item) {
            item.completed = completed;
            localStorage.setItem(storageKey, JSON.stringify(items));
            
            // Si es una tarea y todas están completadas, mostrar mensaje y eliminar widget
            if (type === 'todo') {
                const allCompleted = items.every(todo => todo.completed);
                if (allCompleted) {
                    // Reemplazar card con mensaje de completado
                    const activeWidgetsList = document.getElementById('active-widgets-list');
                    const completedMessage = document.createElement('div');
                    completedMessage.className = 'completed-message';
                    completedMessage.innerHTML = `
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                            <polyline points="22 4 12 14.01 9 11.01"></polyline>
                        </svg>
                        <span>¡Todas las tareas completadas!</span>
                    `;
                    
                    card.style.animation = 'fadeOut 0.3s ease';
                    setTimeout(() => {
                        card.replaceWith(completedMessage);
                        
                        // Eliminar mensaje después de 3 segundos
                        setTimeout(() => {
                            completedMessage.style.animation = 'fadeOut 0.5s ease';
                            setTimeout(() => {
                                completedMessage.remove();
                                // Verificar si quedaron widgets
                                if (activeWidgetsList.children.length === 0) {
                                    activeWidgetsList.innerHTML = `
                                        <div class="empty-widgets-placeholder">
                                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                                                <rect x="3" y="3" width="7" height="7" rx="1"></rect>
                                                <rect x="14" y="3" width="7" height="7" rx="1"></rect>
                                                <rect x="14" y="14" width="7" height="7" rx="1"></rect>
                                                <rect x="3" y="14" width="7" height="7" rx="1"></rect>
                                            </svg>
                                            <p>Selecciona widgets para mostrar</p>
                                            <small>Haz clic en el botón "Widgets" arriba</small>
                                        </div>
                                    `;
                                }
                            }, 500);
                        }, 3000);
                    }, 300);
                }
            }
        }
    }

    function setupEventListeners() {
        // Navegación
        document.getElementById('focus-mode-btn').addEventListener('click', () => {
            dashboardView.classList.add('hidden');
            focusModeView.classList.remove('hidden');
            // Actualizar contador de agua en modo focus
            const focusWaterProgress = document.getElementById('focus-water-progress');
            if (focusWaterProgress) {
                focusWaterProgress.textContent = currentWater;
            }
            // Cargar widgets activos en el panel
            loadActiveWidgets();
            // Cargar preferencias de widgets
            loadWidgetPreferences();
        });
        document.getElementById('back-to-dashboard-btn').addEventListener('click', () => {
            focusModeView.classList.add('hidden');
            dashboardView.classList.remove('hidden');
            // Ocultar panel de ajustes al volver
            const focusSettingsPanel = document.getElementById('focus-settings-panel');
            if (focusSettingsPanel) {
                focusSettingsPanel.classList.add('hidden');
            }
            // Ocultar panel selector de widgets
            const widgetsSelectorPanel = document.getElementById('widgets-selector-panel');
            if (widgetsSelectorPanel) {
                widgetsSelectorPanel.classList.add('hidden');
            }
        });

        // Modo pantalla completa
        document.getElementById('toggle-fullscreen-btn').addEventListener('click', () => {
            toggleFullscreen();
        });

        // Selector de widgets
        document.getElementById('toggle-widgets-selector-btn').addEventListener('click', () => {
            const panel = document.getElementById('widgets-selector-panel');
            panel.classList.toggle('hidden');
            // Ocultar panel de ajustes si está abierto
            const settingsPanel = document.getElementById('focus-settings-panel');
            if (settingsPanel && !settingsPanel.classList.contains('hidden')) {
                settingsPanel.classList.add('hidden');
            }
        });

        // Ajustes en modo focus
        document.getElementById('toggle-focus-settings-btn').addEventListener('click', () => {
            const panel = document.getElementById('focus-settings-panel');
            panel.classList.toggle('hidden');
            // Ocultar panel de widgets si está abierto
            const widgetsPanel = document.getElementById('widgets-selector-panel');
            if (widgetsPanel && !widgetsPanel.classList.contains('hidden')) {
                widgetsPanel.classList.add('hidden');
            }
        });

        // Checkboxes de selección de widgets (solo uno a la vez)
        document.querySelectorAll('.widget-selector-item input[type="checkbox"]').forEach(checkbox => {
            checkbox.addEventListener('change', (e) => {
                // Si se marca este checkbox, desmarcar todos los demás
                if (e.target.checked) {
                    document.querySelectorAll('.widget-selector-item input[type="checkbox"]').forEach(other => {
                        if (other !== e.target) {
                            other.checked = false;
                        }
                    });
                }
                saveWidgetPreferences();
                loadActiveWidgets();
            });
        });

        // Panel de accesibilidad
        document.getElementById('toggle-accessibility-btn').addEventListener('click', () => {
            accessibilityPanel.classList.toggle('hidden');
        });
        
        themeSelect.addEventListener('change', () => { applySettings(); saveSettings(); });
        
        // Modo Noche
        if (nightModeToggle) {
            nightModeToggle.addEventListener('change', () => {
                document.body.classList.toggle('night-mode', nightModeToggle.checked);
                saveSettings();
            });
        }
        
        brightnessSlider.addEventListener('input', () => { 
            document.getElementById('brightness-value').textContent = brightnessSlider.value + '%';
            applySettings(); 
            saveSettings(); 
        });
        volumeSlider.addEventListener('input', () => { 
            document.getElementById('volume-value').textContent = Math.round(volumeSlider.value * 100) + '%';
            applySettings(); 
            saveSettings(); 
        });
        fontSizeSlider.addEventListener('input', () => {
            document.getElementById('font-size-value').textContent = fontSizeSlider.value + '%';
            applySettings();
            saveSettings();
        });
        
        // Contador de agua
        document.getElementById('add-water-btn').addEventListener('click', () => {
            bottleSize = parseInt(document.getElementById('bottle-size').value, 10) || 500;
            currentWater += bottleSize;
            updateWaterDisplay();
            saveWaterProgress();
        });
        
        document.getElementById('reset-water-btn').addEventListener('click', () => {
            currentWater = 0;
            updateWaterDisplay();
            saveWaterProgress();
        });
        
        document.getElementById('bottle-size').addEventListener('change', () => {
            bottleSize = parseInt(document.getElementById('bottle-size').value, 10) || 500;
            updateWaterDisplay();
        });

        // Pestañas del plan semanal
        document.querySelectorAll('.tab-link').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const weekId = e.target.dataset.week;
                document.querySelectorAll('.tab-content').forEach(content => content.classList.add('hidden'));
                document.getElementById(weekId).classList.remove('hidden');
                document.querySelectorAll('.tab-link').forEach(link => link.classList.remove('active'));
                e.target.classList.add('active');
            });
        });
        
        // Botón de regenerar plan nutricional
        const regenerateDietBtn = document.getElementById('regenerate-diet-btn');
        if (regenerateDietBtn) {
            regenerateDietBtn.addEventListener('click', () => {
                if (window.showConfirm) {
                    window.showConfirm('¿Generar un nuevo plan con recetas diferentes?').then(confirmed => {
                        if (confirmed && window.regenerateDietPlan) {
                            window.regenerateDietPlan();
                        }
                    });
                } else if (confirm('¿Generar un nuevo plan con recetas diferentes?')) {
                    if (window.regenerateDietPlan) {
                        window.regenerateDietPlan();
                    }
                }
            });
        }
        
        // Botón de generar lista de compra
        const shoppingListBtn = document.getElementById('generate-shopping-list-btn');
        if (shoppingListBtn) {
            shoppingListBtn.addEventListener('click', generateShoppingList);
        }
        
        // Modal de recetas
        const recipeModal = document.getElementById('recipe-modal');
        const recipeCloseBtn = recipeModal.querySelector('.close-btn');
        
        if (recipeCloseBtn) {
            recipeCloseBtn.onclick = () => {
                recipeModal.classList.add('hidden');
                document.getElementById('youtube-video').src = '';
            };
        }
        
        // Modal de lista de compra
        const shoppingModal = document.getElementById('shopping-list-modal');
        const shoppingCloseBtn = document.getElementById('close-shopping-btn');
        
        if (shoppingCloseBtn) {
            shoppingCloseBtn.onclick = () => {
                shoppingModal.classList.add('hidden');
            };
        }
        
        // Cerrar modales al hacer clic fuera
        window.onclick = (e) => {
            if (e.target === recipeModal) {
                recipeModal.classList.add('hidden');
                document.getElementById('youtube-video').src = '';
            }
            if (e.target === shoppingModal) {
                shoppingModal.classList.add('hidden');
            }
        };
        
        // Pestañas del modal de recetas
        document.querySelectorAll('.modal-tab').forEach(tab => {
            tab.addEventListener('click', (e) => {
                const tabName = e.target.dataset.tab;
                document.querySelectorAll('.modal-tab').forEach(t => t.classList.remove('active'));
                e.target.classList.add('active');
                
                if (tabName === 'video') {
                    document.getElementById('video-tab-content').classList.remove('hidden');
                    document.getElementById('steps-tab-content').classList.add('hidden');
                } else {
                    document.getElementById('video-tab-content').classList.add('hidden');
                    document.getElementById('steps-tab-content').classList.remove('hidden');
                }
            });
        });
        
        // Temporizador
        document.getElementById('start-timer-btn').addEventListener('click', startTimer);
        document.getElementById('reset-timer-btn').addEventListener('click', resetTimer);
        
        // Toggle panel de ajustes del focus mode (verificar si existe)
        const toggleFocusSettingsBtn = document.getElementById('toggle-focus-settings-btn');
        if (toggleFocusSettingsBtn) {
            toggleFocusSettingsBtn.addEventListener('click', () => {
                const panel = document.getElementById('focus-settings-panel');
                if (panel) {
                    panel.classList.toggle('hidden');
                }
            });
        }
        
        // Agua rápida en modo focus (verificar si existe)
        const focusAddWaterBtn = document.getElementById('focus-add-water');
        if (focusAddWaterBtn) {
            focusAddWaterBtn.addEventListener('click', () => {
                currentWater += 250;
                const focusWaterProgress = document.getElementById('focus-water-progress');
                if (focusWaterProgress) {
                    focusWaterProgress.textContent = currentWater;
                }
                updateWaterDisplay();
                saveWaterProgress();
            });
        }
        
        // Botones preestablecidos de tiempo
        document.querySelectorAll('.preset-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                const minutes = parseInt(e.target.dataset.minutes);
                setTimerMinutes(minutes);
            });
        });
        
        // Temporizador personalizado
        const setCustomTimerBtn = document.getElementById('set-custom-timer');
        if (setCustomTimerBtn) {
            setCustomTimerBtn.addEventListener('click', () => {
                const customMinutes = parseInt(document.getElementById('custom-minutes').value);
                if (customMinutes && customMinutes > 0 && customMinutes <= 180) {
                    document.querySelectorAll('.preset-btn').forEach(b => b.classList.remove('active'));
                    setTimerMinutes(customMinutes);
                    document.getElementById('custom-minutes').value = '';
                } else {
                    alert('Por favor, ingresa un valor entre 1 y 180 minutos.');
                }
            });
        }
    }

    function createDietPlanHTML() {
        console.log('🎨 createDietPlanHTML() llamado');
        console.log('📦 dietData:', dietData);
        
        // Verificar que dietData tiene contenido
        if (!dietData || Object.keys(dietData).length === 0) {
            console.warn('⚠️ dietData vacío, no se puede renderizar plan');
            return;
        }

        console.log('✅ dietData válido con', Object.keys(dietData).length, 'semanas');

        const today = new Date();
        const dayNames = ["Domingo", "Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado"];
        const todayName = dayNames[today.getDay()];

        Object.keys(dietData).forEach(weekId => {
            const weekContainer = document.getElementById(weekId);
            if (!weekContainer) {
                console.warn(`⚠️ No se encontró contenedor para ${weekId}`);
                return;
            }
            console.log(`✅ Renderizando ${weekId}`);
            const weekData = dietData[weekId];
            let html = '<div class="day-grid">';
            Object.keys(weekData).forEach(day => {
                const isToday = day === todayName;
                const dayCalories = calculateDayCalories(weekData[day]);
                
                html += `<div class="day-card ${isToday ? 'today' : ''}" data-day="${day}">
                            <div class="day-header">
                                <h3>${day}</h3>
                                <div class="day-calories">${dayCalories} kcal</div>
                            </div>`;
                
                Object.keys(weekData[day]).forEach(mealType => {
                    // Saltar campos especiales que no son comidas
                    if (mealType === 'totalKcal' || mealType === 'targetKcal' || mealType === 'dayType') {
                        return;
                    }
                    
                    const meal = weekData[day][mealType];
                    
                    // Verificar que meal existe y tiene descripción
                    if (!meal || !meal.desc) {
                        console.warn(`⚠️ Comida sin descripción: ${mealType} en ${day}`);
                        return;
                    }
                    
                    const mealKcal = meal.kcal ? ` <span class="meal-kcal">(${meal.kcal} kcal)</span>` : '';
                    const kcalValue = meal.kcal || 0;
                    
                    // Extraer macros si existen
                    const proteinValue = meal.macros ? meal.macros.protein : 0;
                    const carbsValue = meal.macros ? meal.macros.carbs : 0;
                    const fatValue = meal.macros ? meal.macros.fat : 0;
                    
                    html += `<div class="meal" data-meal="${meal.desc}" data-video="${meal.video || ''}" data-kcal="${kcalValue}" data-protein="${proteinValue}" data-carbs="${carbsValue}" data-fat="${fatValue}">
                                <strong>${mealType}:</strong>${mealKcal}
                                <p>${meal.desc.substring(0, 50)}${meal.desc.length > 50 ? '...' : ''}</p>
                             </div>`;
                });
                html += '</div>';
            });
            html += '</div>';
            weekContainer.innerHTML = html;
        });

        // Agregar event listeners a las comidas
        document.querySelectorAll('.meal').forEach(meal => {
            meal.addEventListener('click', (e) => {
                const mealElement = e.currentTarget;
                const mealDesc = mealElement.dataset.meal;
                const videoUrl = mealElement.dataset.video;
                const mealKcal = mealElement.dataset.kcal; // Calorías reales del plan (BEDCA)
                const mealProtein = mealElement.dataset.protein || 0; // Proteínas (BEDCA)
                const mealCarbs = mealElement.dataset.carbs || 0; // Carbohidratos (BEDCA)
                const mealFat = mealElement.dataset.fat || 0; // Grasas (BEDCA)
                
                // Extraer el nombre de la receta (antes del primer ":")
                const recipeName = mealDesc.split(':')[0].trim();
                
                // Buscar receta en RECIPE_INSTRUCTIONS para preparación
                let recipeInstructions = null;
                
                // Normalizar descripción de la comida para búsqueda
                const mealLower = recipeName.toLowerCase();
                
                // Buscar coincidencias en RECIPE_INSTRUCTIONS
                if (window.RECIPE_INSTRUCTIONS) {
                    for (let key in window.RECIPE_INSTRUCTIONS) {
                        if (mealLower.includes(key.toLowerCase()) || 
                            key.toLowerCase().includes(recipeName.toLowerCase())) {
                            recipeInstructions = window.RECIPE_INSTRUCTIONS[key];
                            break;
                        }
                    }
                }
                
                // Mostrar título de la receta
                document.getElementById('modal-title').textContent = recipeName;
                
                // IMPORTANTE: Mostrar la descripción del PLAN GENERADO (con cantidades BEDCA)
                document.getElementById('modal-description').textContent = mealDesc;
                document.getElementById('youtube-video').src = videoUrl;
                
                // INGREDIENTES: Usar los del PLAN GENERADO (extraídos de mealDesc)
                const ingredientsSection = document.getElementById('recipe-ingredients-section');
                const ingredientsList = document.getElementById('recipe-ingredients-list');
                
                // Extraer ingredientes de la descripción del plan (después del ":")
                const ingredientsText = mealDesc.includes(':') ? mealDesc.split(':')[1].trim() : mealDesc;
                const ingredientsArray = ingredientsText.split(',').map(ing => ing.trim());
                
                if (ingredientsArray.length > 0) {
                    ingredientsSection.classList.remove('hidden');
                    ingredientsList.innerHTML = ingredientsArray.map(ing => 
                        `<div class="ingredient-item">
                            <span class="ingredient-name">${ing}</span>
                        </div>`
                    ).join('');
                } else {
                    ingredientsSection.classList.add('hidden');
                }
                
                // MACRONUTRIENTES: Usar las calorías y macros REALES del plan (BEDCA)
                const macrosSection = document.getElementById('recipe-macros-section');
                const macrosDiv = document.getElementById('recipe-macros');
                
                if (mealKcal) {
                    macrosSection.classList.remove('hidden');
                    
                    // Calcular porcentajes de macros
                    const totalGrams = parseFloat(mealProtein) + parseFloat(mealCarbs) + parseFloat(mealFat);
                    const proteinPercent = totalGrams > 0 ? Math.round((parseFloat(mealProtein) / totalGrams) * 100) : 0;
                    const carbsPercent = totalGrams > 0 ? Math.round((parseFloat(mealCarbs) / totalGrams) * 100) : 0;
                    const fatPercent = totalGrams > 0 ? Math.round((parseFloat(mealFat) / totalGrams) * 100) : 0;
                    
                    macrosDiv.innerHTML = `
                        <div class="macro-item">
                            <div class="macro-label">Calorías Totales</div>
                            <div class="macro-value">${mealKcal} kcal</div>
                        </div>
                        <div class="macro-item">
                            <div class="macro-label">Proteínas</div>
                            <div class="macro-value">${mealProtein}g (${proteinPercent}%)</div>
                        </div>
                        <div class="macro-item">
                            <div class="macro-label">Carbohidratos</div>
                            <div class="macro-value">${mealCarbs}g (${carbsPercent}%)</div>
                        </div>
                        <div class="macro-item">
                            <div class="macro-label">Grasas</div>
                            <div class="macro-value">${mealFat}g (${fatPercent}%)</div>
                        </div>
                        <div class="macro-note">
                            <small>✅ Valores verificados con BEDCA (Base de Datos Española de Composición de Alimentos)</small>
                        </div>
                    `;
                } else {
                    macrosSection.classList.add('hidden');
                }
                
                // PASOS DE PREPARACIÓN: Usar RECIPE_INSTRUCTIONS (instrucciones detalladas)
                const stepsContainer = document.getElementById('recipe-steps');
                if (recipeInstructions && recipeInstructions.preparation && recipeInstructions.preparation.length > 0) {
                    // Formatear las instrucciones como lista numerada con consejos
                    let stepsHTML = '<div class="recipe-preparation">';
                    
                    // Pasos numerados
                    stepsHTML += '<ol class="preparation-steps">';
                    recipeInstructions.preparation.forEach((step, index) => {
                        stepsHTML += `<li class="step-item">${step}</li>`;
                    });
                    stepsHTML += '</ol>';
                    
                    // Consejos si existen
                    if (recipeInstructions.tips) {
                        stepsHTML += `
                            <div class="recipe-tips">
                                <h4 class="tips-title">💡 Consejo del Chef</h4>
                                <p class="tips-content">${recipeInstructions.tips}</p>
                            </div>
                        `;
                    }
                    
                    stepsHTML += '</div>';
                    stepsContainer.innerHTML = stepsHTML;
                } else {
                    // Fallback al sistema antiguo recipeSteps si no hay instrucciones
                    let oldRecipeData = recipeSteps.default;
                    for (let key in recipeSteps) {
                        if (mealDesc.toLowerCase().includes(key.toLowerCase())) {
                            oldRecipeData = recipeSteps[key];
                            break;
                        }
                    }
                    
                    const hasOptions = oldRecipeData.principal || oldRecipeData.guarnicion;
                    let stepsHtml = '';
                    
                    if (hasOptions) {
                        stepsHtml = '<div class="recipe-selector-buttons">';
                        if (oldRecipeData.principal) {
                            stepsHtml += '<button class="recipe-option-btn active" data-option="principal">Plato Principal</button>';
                        }
                        if (oldRecipeData.guarnicion) {
                            stepsHtml += '<button class="recipe-option-btn' + (!oldRecipeData.principal ? ' active' : '') + '" data-option="guarnicion">Guarnición</button>';
                        }
                        stepsHtml += '</div><div class="recipe-steps-content"></div>';
                        document.getElementById('recipe-steps').innerHTML = stepsHtml;
                        
                        const initialOption = oldRecipeData.principal ? 'principal' : 'guarnicion';
                        const initialSteps = oldRecipeData[initialOption];
                        document.querySelector('.recipe-steps-content').innerHTML = formatRecipeSteps(initialSteps);
                        
                        document.querySelectorAll('.recipe-option-btn').forEach(btn => {
                            btn.addEventListener('click', function() {
                                document.querySelectorAll('.recipe-option-btn').forEach(b => b.classList.remove('active'));
                                this.classList.add('active');
                                const option = this.dataset.option;
                                const steps = oldRecipeData[option];
                                document.querySelector('.recipe-steps-content').innerHTML = formatRecipeSteps(steps);
                            });
                        });
                    } else {
                        const steps = oldRecipeData.completo || oldRecipeData;
                        stepsHtml = '<div class="recipe-steps-content">' + formatRecipeSteps(steps) + '</div>';
                        document.getElementById('recipe-steps').innerHTML = stepsHtml;
                    }
                }
                
                // Función para formatear los pasos con clases CSS apropiadas
                function formatRecipeSteps(steps) {
                    return steps.map(step => {
                        let className = 'recipe-step';
                        
                        if (step.trim() === '') {
                            return '<div class="recipe-spacer"></div>';
                        } else if (step.match(/^[A-ZÁÉÍÓÚ\s\-═]+$/)) {
                            className = 'recipe-section-title';
                        } else if (step.startsWith('INGREDIENTES:')) {
                            className = 'recipe-ingredients-header';
                        } else if (step.includes('COSORI DUAL BLAZE') || step.includes('Función:') || step.includes('Temperatura:') || step.includes('Tiempo:')) {
                            className = 'recipe-config';
                        } else if (step.startsWith('NOTA:') || step.startsWith('MÉTODO:') || step.startsWith('CONSEJO')) {
                            className = 'recipe-note';
                        } else if (step.match(/^[①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳]/)) {
                            className = 'recipe-step-numbered-special';
                        } else if (step.match(/^\d+\./)) {
                            className = 'recipe-step-numbered';
                        }
                        
                        return `<p class="${className}">${step}</p>`;
                    }).join('');
                }
                
                // Función para formatear los pasos con acordeón por secciones
                function formatRecipeStepsWithAccordion(steps) {
                    const sections = [];
                    let currentSection = { title: 'Preparación', steps: [] };
                    
                    steps.forEach(step => {
                        // Detectar nuevas secciones (texto en mayúsculas)
                        if (step.match(/^[A-ZÁÉÍÓÚ\s\-═]+$/) && step.trim() !== '' && !step.includes('═')) {
                            // Guardar sección anterior si tiene contenido
                            if (currentSection.steps.length > 0) {
                                sections.push(currentSection);
                            }
                            // Iniciar nueva sección
                            currentSection = { title: step.trim(), steps: [] };
                        } else if (step.trim() !== '' && !step.match(/^═+$/)) {
                            // Añadir paso a la sección actual
                            currentSection.steps.push(step);
                        }
                    });
                    
                    // Añadir última sección
                    if (currentSection.steps.length > 0) {
                        sections.push(currentSection);
                    }
                    
                    // Generar HTML con acordeón
                    return sections.map((section, index) => {
                        const stepsHtml = section.steps.map(step => {
                            let className = 'recipe-step';
                            
                            if (step.includes('COSORI DUAL BLAZE') || step.includes('Función:') || step.includes('Temperatura:') || step.includes('Tiempo:')) {
                                className = 'recipe-config';
                            } else if (step.startsWith('NOTA:') || step.startsWith('MÉTODO:') || step.startsWith('CONSEJO')) {
                                className = 'recipe-note';
                            } else if (step.match(/^[①②③④⑤⑥⑦⑧⑨⑩⑪⑫⑬⑭⑮⑯⑰⑱⑲⑳]/)) {
                                className = 'recipe-step-numbered-special';
                            } else if (step.match(/^\d+\./)) {
                                className = 'recipe-step-numbered';
                            }
                            
                            return `<p class="${className}">${step}</p>`;
                        }).join('');
                        
                        return `
                            <div class="accordion-item">
                                <div class="accordion-header">
                                    <span class="accordion-title">${section.title}</span>
                                    <span class="accordion-icon">▼</span>
                                </div>
                                <div class="accordion-content">
                                    ${stepsHtml}
                                </div>
                            </div>
                        `;
                    }).join('');
                }
                
                // Resetear tabs - Mostrar PASOS primero
                document.querySelectorAll('.modal-tab').forEach(t => t.classList.remove('active'));
                document.querySelector('[data-tab="steps"]').classList.add('active');
                document.getElementById('steps-tab-content').classList.remove('hidden');
                document.getElementById('video-tab-content').classList.add('hidden');
                
                document.getElementById('recipe-modal').classList.remove('hidden');
            });
        });

        loadTodayPanel(todayName);
    }
    
    // Exponer createDietPlanHTML globalmente para que el listener de userLoaded pueda acceder
    window.createDietPlanHTML = createDietPlanHTML;
    
    function loadTodayPanel(dayName) {
        const todayMealsContainer = document.getElementById('today-meals');
        let html = '<p>No hay plan para hoy.</p>';
        
        // Cargar estado guardado
        const savedState = JSON.parse(localStorage.getItem('todayMealsState') || '{}');
        
        for (let weekId in dietData) {
            if (dietData[weekId][dayName]) {
                const dayData = dietData[weekId][dayName];
                html = '';
                let mealIndex = 0;
                Object.keys(dayData).forEach(mealType => {
                    // Saltar campos que no son comidas
                    if (mealType === 'totalKcal' || mealType === 'targetKcal' || mealType === 'dayType') {
                        return;
                    }
                    
                    const isCompleted = savedState[mealType] || false;
                    html += `<div class="meal-item ${isCompleted ? 'completed' : ''}" data-meal-type="${mealType}">
                                <span><strong>${mealType}:</strong> ${dayData[mealType].desc}</span>
                                <input type="checkbox" ${isCompleted ? 'checked' : ''} onchange="toggleMealComplete('${mealType}')">
                             </div>`;
                    mealIndex++;
                });
                break;
            }
        }
        todayMealsContainer.innerHTML = html;
        updateDailyProgress();
    }
    
    window.toggleMealComplete = function(mealType) {
        const mealItem = document.querySelector(`[data-meal-type="${mealType}"]`);
        mealItem.classList.toggle('completed');
        
        // Guardar estado
        const savedState = JSON.parse(localStorage.getItem('todayMealsState') || '{}');
        savedState[mealType] = mealItem.classList.contains('completed');
        localStorage.setItem('todayMealsState', JSON.stringify(savedState));
        
        updateDailyProgress();
    }
    
    function updateDailyProgress() {
        const totalMeals = 4;
        const completedMeals = document.querySelectorAll('#today-meals .meal-item.completed').length;
        const percentage = Math.round((completedMeals / totalMeals) * 100);
        
        document.getElementById('completed-count').textContent = completedMeals;
        document.getElementById('total-count').textContent = totalMeals;
        document.getElementById('progress-percent').textContent = percentage;
        document.getElementById('daily-progress').style.width = percentage + '%';
        document.getElementById('daily-progress').textContent = percentage + '%';
    }

    // --- LÓGICA DE CONFIGURACIÓN ---
    function saveSettings() {
        const settings = {
            theme: themeSelect.value,
            nightMode: nightModeToggle ? nightModeToggle.checked : false,
            brightness: brightnessSlider.value,
            volume: volumeSlider.value,
            fontSize: fontSizeSlider.value
        };
        localStorage.setItem('suitoFocusSettings', JSON.stringify(settings));
    }
    
    function loadSettings() {
        const settings = JSON.parse(localStorage.getItem('suitoFocusSettings') || '{}');
        if (settings.theme) themeSelect.value = settings.theme;
        if (nightModeToggle && settings.nightMode !== undefined) {
            nightModeToggle.checked = settings.nightMode;
        }
        if (settings.brightness) brightnessSlider.value = settings.brightness;
        if (settings.volume) volumeSlider.value = settings.volume;
        if (settings.fontSize) fontSizeSlider.value = settings.fontSize;
        
        document.getElementById('brightness-value').textContent = brightnessSlider.value + '%';
        document.getElementById('volume-value').textContent = Math.round(volumeSlider.value * 100) + '%';
        document.getElementById('font-size-value').textContent = fontSizeSlider.value + '%';
        
        // Cargar progreso del agua
        const waterData = JSON.parse(localStorage.getItem('waterProgress') || '{}');
        const today = new Date().toDateString();
        if (waterData.date === today) {
            currentWater = waterData.amount || 0;
        }
        
        applySettings();
    }
    
    function saveWaterProgress() {
        const today = new Date().toDateString();
        localStorage.setItem('waterProgress', JSON.stringify({
            date: today,
            amount: currentWater
        }));
    }
    
    function applySettings() {
        body.setAttribute('data-theme', themeSelect.value);
        brightnessOverlay.style.opacity = brightnessSlider.value / 100;
        body.style.fontSize = fontSizeSlider.value + '%';
        
        // Aplicar modo noche si está activado
        if (nightModeToggle && nightModeToggle.checked) {
            body.classList.add('night-mode');
        } else {
            body.classList.remove('night-mode');
        }
        
        const currentTheme = themeSelect.value;
        Object.values(allSounds).forEach(sound => {
            sound.pause();
            sound.currentTime = 0;
        });
        
        if (allSounds[currentTheme]) {
            allSounds[currentTheme].volume = volumeSlider.value;
            allSounds[currentTheme].play().catch(() => {});
        }
    }
    
    function updateClock() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        const seconds = String(now.getSeconds()).padStart(2, '0');
        const timeString = `${hours}<span class="separator">:</span>${minutes}<span class="separator">:</span>${seconds}`;
        
        if (mainClock) mainClock.innerHTML = timeString;
        if (focusClock) focusClock.innerHTML = timeString;
    }

    // ========== WIDGETS OPCIONALES ==========
    
    // Hacer funciones globales
    window.togglePill = togglePill;
    window.deletePill = deletePill;
    window.toggleTodo = toggleTodo;
    window.deleteTodo = deleteTodo;
    window.toggleHabit = toggleHabit;
    window.deleteHabit = deleteHabit;
    window.deleteWidget = deleteWidget;
    window.createWidget = createWidget;
    
    function loadOptionalFeatures() {
        console.log('📦 Cargando widgets opcionales...');
        
        // PRIMERO: Crear los slots del grid
        updateGridSlots();
        
        // Cargar pastillas
        const pills = JSON.parse(localStorage.getItem('pillsReminders') || '[]');
        if (pills.length > 0) {
            renderPills();
            renderFocusPills();
        }
        
        // Cargar to-do list
        const todos = JSON.parse(localStorage.getItem('todoList') || '[]');
        if (todos.length > 0) {
            renderTodos();
            renderFocusTodos();
        }
        
        // Cargar notas
        const notes = localStorage.getItem('quickNotes') || '';
        if (notes) {
            const notesContent = document.getElementById('notes-content');
            if (notesContent) notesContent.value = notes;
        }
        
        // Cargar hábitos
        const habits = JSON.parse(localStorage.getItem('dailyHabits') || '[]');
        if (habits.length > 0) {
            renderHabits();
            renderFocusHabits();
        }
        
        // Cargar posiciones guardadas (DESPUÉS de crear grid)
        loadWidgetPositions();
        
        // Cargar tamaños guardados
        loadWidgetSizes();
        
        // Inicializar drag & drop
        initDragAndDrop();
        
        // Inicializar resize manual
        initWidgetResize();
        
        updateWidgetMenu();
        
        // Forzar compactación final después de que todo esté cargado
        setTimeout(() => {
            if (window.compactWidgets) {
                console.log('🔧 Compactación final al cargar...');
                window.compactWidgets();
            }
        }, 500);
        
        console.log('✅ Widgets cargados correctamente');
    }
    
    function updateWidgetMenu() {
        const pills = JSON.parse(localStorage.getItem('pillsReminders') || '[]');
        const todos = JSON.parse(localStorage.getItem('todoList') || '[]');
        const notes = localStorage.getItem('quickNotes');
        const habits = JSON.parse(localStorage.getItem('dailyHabits') || '[]');
        const addWidgetBtn = document.getElementById('add-widget-btn');
        
        // Ocultar botón si ya existen todos los widgets
        if (pills.length > 0 && todos.length > 0 && notes && habits.length > 0) {
            addWidgetBtn.style.display = 'none';
        } else {
            addWidgetBtn.style.display = 'flex';
        }
    }
    
    // PILLS REMINDER
    function renderPills() {
        const pills = JSON.parse(localStorage.getItem('pillsReminders') || '[]');
        const pillsList = document.getElementById('pills-list');
        
        pillsList.innerHTML = pills.map((pill, index) => `
            <div class="widget-item ${pill.completed ? 'completed' : ''}">
                <div class="widget-item-content">
                    <input type="checkbox" ${pill.completed ? 'checked disabled' : ''} 
                           onchange="togglePill(${index})" 
                           class="widget-checkbox">
                    <span class="widget-item-text">${pill.name}</span>
                    <span class="widget-item-time">${pill.time}</span>
                </div>
                <div class="widget-item-actions">
                    ${!pill.completed ? `<button class="widget-item-btn" onclick="deletePill(${index})" title="Eliminar">×</button>` : ''}
                </div>
            </div>
        `).join('');
    }
    
    function renderFocusPills() {
        const pills = JSON.parse(localStorage.getItem('pillsReminders') || '[]');
        const focusPillsWidget = document.getElementById('focus-pills-widget');
        const focusPillsList = document.getElementById('focus-pills-list');
        
        // Verificar si el widget de pastillas está activo en el dashboard
        const pillsWidget = document.getElementById('pills-widget');
        const isActive = pillsWidget && pillsWidget.hasAttribute('data-slot');
        
        if (isActive) {
            focusPillsWidget.style.display = 'block';
            if (pills.length > 0) {
                focusPillsList.innerHTML = pills.map((pill, index) => `
                    <div class="focus-widget-item ${pill.completed ? 'completed' : ''}">
                        <label>
                            <input type="checkbox" ${pill.completed ? 'checked disabled' : ''} 
                                   onchange="togglePill(${index})" 
                                   class="focus-widget-checkbox">
                            ${pill.name} - ${pill.time}
                        </label>
                    </div>
                `).join('');
            } else {
                focusPillsList.innerHTML = '<p style="text-align: center; opacity: 0.6; padding: 10px;">No hay pastillas aún</p>';
            }
        } else {
            focusPillsWidget.style.display = 'none';
        }
    }
    
    function addPill() {
        const nameInput = document.getElementById('pill-name-input');
        const timeInput = document.getElementById('pill-time-input');
        
        if (!nameInput.value || !timeInput.value) {
            showNotification('Por favor completa el nombre y la hora', 'warning');
            return;
        }
        
        const pills = JSON.parse(localStorage.getItem('pillsReminders') || '[]');
        pills.push({
            name: nameInput.value,
            time: timeInput.value,
            completed: false
        });
        
        localStorage.setItem('pillsReminders', JSON.stringify(pills));
        nameInput.value = '';
        timeInput.value = '';
        
        renderPills();
        renderFocusPills();
        updateWidgetMenu();
        showNotification('Pastilla añadida correctamente', 'success');
    }
    
    function togglePill(index) {
        const pills = JSON.parse(localStorage.getItem('pillsReminders') || '[]');
        if (!pills[index].completed) {
            pills[index].completed = true;
            localStorage.setItem('pillsReminders', JSON.stringify(pills));
            renderPills();
            renderFocusPills();
            showNotification('Pastilla marcada como tomada', 'success');
        }
    }
    
    async function deletePill(index) {
        const confirmed = await showConfirm('¿Eliminar esta pastilla?');
        if (!confirmed) return;
        
        const pills = JSON.parse(localStorage.getItem('pillsReminders') || '[]');
        pills.splice(index, 1);
        localStorage.setItem('pillsReminders', JSON.stringify(pills));
        renderPills();
        renderFocusPills();
        updateWidgetMenu();
        showNotification('Pastilla eliminada', 'info');
    }
    
    // TO-DO LIST
    function renderTodos() {
        const todos = JSON.parse(localStorage.getItem('todoList') || '[]');
        const todoList = document.getElementById('todo-list');
        
        todoList.innerHTML = todos.map((todo, index) => `
            <div class="widget-item ${todo.completed ? 'completed' : ''}">
                <div class="widget-item-content">
                    <input type="checkbox" ${todo.completed ? 'checked disabled' : ''} 
                           onchange="toggleTodo(${index})" 
                           class="widget-checkbox">
                    <span class="widget-item-text">${todo.text}</span>
                </div>
                <div class="widget-item-actions">
                    ${!todo.completed ? `<button class="widget-item-btn" onclick="deleteTodo(${index})" title="Eliminar">×</button>` : ''}
                </div>
            </div>
        `).join('');
    }
    
    function renderFocusTodos() {
        const todos = JSON.parse(localStorage.getItem('todoList') || '[]');
        const focusTodoWidget = document.getElementById('focus-todo-widget');
        const focusTodoList = document.getElementById('focus-todo-list');
        
        // Verificar si el widget de tareas está activo en el dashboard
        const todoWidget = document.getElementById('todo-widget');
        const isActive = todoWidget && todoWidget.hasAttribute('data-slot');
        
        if (isActive) {
            focusTodoWidget.style.display = 'block';
            if (todos.length > 0) {
                focusTodoList.innerHTML = todos.map((todo, index) => `
                    <div class="focus-widget-item ${todo.completed ? 'completed' : ''}">
                        <label>
                            <input type="checkbox" ${todo.completed ? 'checked disabled' : ''} 
                                   onchange="toggleTodo(${index})" 
                                   class="focus-widget-checkbox">
                            ${todo.text}
                        </label>
                    </div>
                `).join('');
            } else {
                focusTodoList.innerHTML = '<p style="text-align: center; opacity: 0.6; padding: 10px;">No hay tareas aún</p>';
            }
        } else {
            focusTodoWidget.style.display = 'none';
        }
    }
    
    function addTodo() {
        const todoInput = document.getElementById('todo-input');
        
        if (!todoInput.value) {
            showNotification('Por favor escribe una tarea', 'warning');
            return;
        }
        
        const todos = JSON.parse(localStorage.getItem('todoList') || '[]');
        todos.push({
            text: todoInput.value,
            completed: false
        });
        
        localStorage.setItem('todoList', JSON.stringify(todos));
        todoInput.value = '';
        
        renderTodos();
        renderFocusTodos();
        updateWidgetMenu();
        showNotification('Tarea añadida correctamente', 'success');
    }
    
    function toggleTodo(index) {
        const todos = JSON.parse(localStorage.getItem('todoList') || '[]');
        if (!todos[index].completed) {
            todos[index].completed = true;
            localStorage.setItem('todoList', JSON.stringify(todos));
            
            // Verificar si todas las tareas están completadas
            const allCompleted = todos.every(todo => todo.completed);
            
            if (allCompleted) {
                // Eliminar widget del dashboard
                const todoWidget = document.getElementById('todo-widget');
                if (todoWidget) {
                    todoWidget.remove();
                }
                
                // Limpiar localStorage
                localStorage.removeItem('todoList');
                
                // Actualizar menú
                updateWidgetMenu();
                
                // Mostrar notificación
                showNotification('¡Todas las tareas completadas! Widget eliminado.', 'success');
                
                // Recargar widgets en focus mode
                loadActiveWidgets();
            } else {
                renderTodos();
                renderFocusTodos();
                showNotification('Tarea completada', 'success');
            }
        }
    }
    
    async function deleteTodo(index) {
        const confirmed = await showConfirm('¿Eliminar esta tarea?');
        if (!confirmed) return;
        
        const todos = JSON.parse(localStorage.getItem('todoList') || '[]');
        todos.splice(index, 1);
        localStorage.setItem('todoList', JSON.stringify(todos));
        renderTodos();
        renderFocusTodos();
        updateWidgetMenu();
        showNotification('Tarea eliminada', 'info');
    }
    
    // HÁBITOS DIARIOS
    function renderHabits() {
        const habits = JSON.parse(localStorage.getItem('dailyHabits') || '[]');
        const habitList = document.getElementById('habit-list');
        
        habitList.innerHTML = habits.map((habit, index) => `
            <div class="widget-item ${habit.completed ? 'completed' : ''}">
                <div class="widget-item-content">
                    <input type="checkbox" ${habit.completed ? 'checked disabled' : ''} 
                           onchange="toggleHabit(${index})" 
                           class="widget-checkbox">
                    <span class="widget-item-text">${habit.text}</span>
                </div>
                <div class="widget-item-actions">
                    ${!habit.completed ? `<button class="widget-item-btn" onclick="deleteHabit(${index})" title="Eliminar">×</button>` : ''}
                </div>
            </div>
        `).join('');
    }
    
    function renderFocusHabits() {
        const habits = JSON.parse(localStorage.getItem('dailyHabits') || '[]');
        const focusHabitWidget = document.getElementById('focus-habit-widget');
        const focusHabitList = document.getElementById('focus-habit-list');
        
        // Verificar si el widget de hábitos está activo en el dashboard
        const habitWidget = document.getElementById('habit-widget');
        const isActive = habitWidget && habitWidget.hasAttribute('data-slot');
        
        if (isActive) {
            focusHabitWidget.style.display = 'block';
            if (habits.length > 0) {
                focusHabitList.innerHTML = habits.map((habit, index) => `
                    <div class="focus-widget-item ${habit.completed ? 'completed' : ''}">
                        <label>
                            <input type="checkbox" ${habit.completed ? 'checked disabled' : ''} 
                                   onchange="toggleHabit(${index})" 
                                   class="focus-widget-checkbox">
                            ${habit.text}
                        </label>
                    </div>
                `).join('');
            } else {
                focusHabitList.innerHTML = '<p style="text-align: center; opacity: 0.6; padding: 10px;">No hay hábitos aún</p>';
            }
        } else {
            focusHabitWidget.style.display = 'none';
        }
    }
    
    function addHabit() {
        const habitInput = document.getElementById('habit-input');
        
        if (!habitInput.value) {
            showNotification('Por favor escribe un hábito', 'warning');
            return;
        }
        
        const habits = JSON.parse(localStorage.getItem('dailyHabits') || '[]');
        habits.push({
            text: habitInput.value,
            completed: false
        });
        
        localStorage.setItem('dailyHabits', JSON.stringify(habits));
        habitInput.value = '';
        
        renderHabits();
        renderFocusHabits();
        updateWidgetMenu();
        showNotification('Hábito añadido correctamente', 'success');
    }
    
    function toggleHabit(index) {
        const habits = JSON.parse(localStorage.getItem('dailyHabits') || '[]');
        if (!habits[index].completed) {
            habits[index].completed = true;
            localStorage.setItem('dailyHabits', JSON.stringify(habits));
            renderHabits();
            renderFocusHabits();
            showNotification('Hábito completado', 'success');
        }
    }
    
    async function deleteHabit(index) {
        const confirmed = await showConfirm('¿Eliminar este hábito?');
        if (!confirmed) return;
        
        const habits = JSON.parse(localStorage.getItem('dailyHabits') || '[]');
        habits.splice(index, 1);
        localStorage.setItem('dailyHabits', JSON.stringify(habits));
        renderHabits();
        renderFocusHabits();
        updateWidgetMenu();
        showNotification('Hábito eliminado', 'info');
    }
    
    // ===== FUNCIONES PARA AGREGAR DESDE MODO FOCUS =====
    function addPillFromFocus() {
        const nameInput = document.getElementById('focus-pill-name');
        const timeInput = document.getElementById('focus-pill-time');
        
        if (!nameInput.value || !timeInput.value) {
            showNotification('Completa nombre y hora de la pastilla', 'warning');
            return;
        }
        
        const pills = JSON.parse(localStorage.getItem('pillsReminders') || '[]');
        pills.push({
            name: nameInput.value,
            time: timeInput.value,
            completed: false
        });
        
        localStorage.setItem('pillsReminders', JSON.stringify(pills));
        nameInput.value = '';
        timeInput.value = '';
        
        renderPills();
        renderFocusPills();
        showNotification('Pastilla añadida', 'success');
    }
    
    function addTodoFromFocus() {
        const todoInput = document.getElementById('focus-todo-input');
        
        if (!todoInput.value) {
            showNotification('Escribe una tarea', 'warning');
            return;
        }
        
        const todos = JSON.parse(localStorage.getItem('todoList') || '[]');
        todos.push({
            text: todoInput.value,
            completed: false
        });
        
        localStorage.setItem('todoList', JSON.stringify(todos));
        todoInput.value = '';
        
        renderTodos();
        renderFocusTodos();
        showNotification('Tarea añadida', 'success');
    }
    
    function addHabitFromFocus() {
        const habitInput = document.getElementById('focus-habit-input');
        
        if (!habitInput.value) {
            showNotification('Escribe un hábito', 'warning');
            return;
        }
        
        const habits = JSON.parse(localStorage.getItem('dailyHabits') || '[]');
        habits.push({
            text: habitInput.value,
            completed: false
        });
        
        localStorage.setItem('dailyHabits', JSON.stringify(habits));
        habitInput.value = '';
        
        renderHabits();
        renderFocusHabits();
        showNotification('Hábito añadido', 'success');
    }
    
    // NOTAS RÁPIDAS
    let noteSaveTimeout;
    function saveNotes() {
        const notes = document.getElementById('notes-content').value;
        localStorage.setItem('quickNotes', notes);
        
        // Mostrar notificación solo una vez cada 3 segundos
        clearTimeout(noteSaveTimeout);
        noteSaveTimeout = setTimeout(() => {
            // Notificación sutil sin mostrar (auto-guardado silencioso)
        }, 3000);
    }
    
    async function deleteWidget(type) {
        const messages = {
            pills: 'pastillas',
            todo: 'tareas',
            notes: 'notas',
            habit: 'hábitos'
        };
        
        const confirmed = await showConfirm(`¿Seguro que quieres eliminar el widget de ${messages[type]}? Se borrarán todos los datos.`);
        if (!confirmed) return;
        
        let widget;
        if (type === 'pills') {
            localStorage.removeItem('pillsReminders');
            widget = document.getElementById('pills-widget');
            if (document.getElementById('pill-name-input')) document.getElementById('pill-name-input').value = '';
            if (document.getElementById('pill-time-input')) document.getElementById('pill-time-input').value = '';
            renderPills();
            const focusWidget = document.getElementById('focus-pills-widget');
            if (focusWidget) focusWidget.style.display = 'none';
        } else if (type === 'todo') {
            localStorage.removeItem('todoList');
            widget = document.getElementById('todo-widget');
            if (document.getElementById('todo-input')) document.getElementById('todo-input').value = '';
            renderTodos();
            const focusWidget = document.getElementById('focus-todo-widget');
            if (focusWidget) focusWidget.style.display = 'none';
        } else if (type === 'notes') {
            localStorage.removeItem('quickNotes');
            widget = document.getElementById('notes-widget');
            if (document.getElementById('notes-content')) document.getElementById('notes-content').value = '';
        } else if (type === 'habit') {
            localStorage.removeItem('dailyHabits');
            widget = document.getElementById('habit-widget');
            if (document.getElementById('habit-input')) document.getElementById('habit-input').value = '';
            renderHabits();
            const focusWidget = document.getElementById('focus-habit-widget');
            if (focusWidget) focusWidget.style.display = 'none';
        }
        
        // Remover posición guardada
        const positions = JSON.parse(localStorage.getItem('widgetPositions') || '{}');
        delete positions[type];
        localStorage.setItem('widgetPositions', JSON.stringify(positions));
        
        // Ocultar widget y remover del grid
        if (widget) {
            widget.removeAttribute('data-slot');
            widget.style.display = 'none';
            
            // Mover al contenedor de widgets inactivos
            const widgetsContainer = document.getElementById('widgets-container');
            if (widgetsContainer) {
                widgetsContainer.appendChild(widget);
            }
        }
        
        // Actualizar grid dinámico
        updateGridSlots();
        updateWidgetMenu();
        showNotification(`Widget de ${messages[type]} eliminado`, 'info');
    }
    
    // Función para cambiar el tamaño del widget (LEGACY - mantenida para compatibilidad)
    function resizeWidget(type) {
        // Esta función ya no se usa pero se mantiene por si acaso
        console.log('⚠️ resizeWidget legacy llamada para:', type);
    }
    
    // Sistema de resize interactivo con drag
    function initWidgetResize() {
        console.log('🎨 Inicializando sistema de resize interactivo...');
        const widgets = document.querySelectorAll('.widget-item-draggable');
        console.log(`📦 Encontrados ${widgets.length} widgets para resize`);
        
        widgets.forEach((widget, index) => {
            const resizeHandle = widget.querySelector('.widget-resize-handle');
            if (!resizeHandle) {
                console.warn(`⚠️ Widget ${index} no tiene handle de resize`);
                return;
            }
            
            console.log(`✅ Widget ${index} configurado con handle de resize`);
            
            let isResizing = false;
            let startX = 0;
            let currentSize = 1;
            let previewSize = 1;
            let indicator = null;
            
            // Obtener tamaño actual del widget
            const getCurrentSize = () => {
                if (widget.classList.contains('size-4')) return 4;
                if (widget.classList.contains('size-3')) return 3;
                if (widget.classList.contains('size-2')) return 2;
                return 1;
            };
            
            // Calcular tamaño basado en la posición del mouse
            const calculateSize = (deltaX) => {
                const grid = document.getElementById('widget-grid');
                const gridWidth = grid.offsetWidth;
                const columnWidth = gridWidth / 4; // Cambiado a 4 columnas
                
                // Determinar tamaño según el delta (ahora soporta hasta 4)
                if (deltaX > columnWidth * 1.5) {
                    return 4; // Ancho completo
                } else if (deltaX > columnWidth * 0.7) {
                    return 3; // 3 columnas
                } else if (deltaX > columnWidth * 0.15) {
                    return 2; // 2 columnas (mediano)
                } else if (deltaX < -columnWidth * 0.15) {
                    return 1; // 1 columna (pequeño)
                } else {
                    return getCurrentSize();
                }
            };
            
            // Crear indicador visual
            const createIndicator = (size) => {
                if (indicator) indicator.remove();
                
                indicator = document.createElement('div');
                indicator.className = 'resize-indicator';
                
                const sizeNames = { 1: 'Pequeño', 2: 'Mediano', 3: 'Grande', 4: 'Extra Grande' };
                const sizeIcons = { 1: '▫', 2: '▬', 3: '▬▬', 4: '▬▬▬▬' };
                
                indicator.textContent = `${sizeIcons[size]} ${sizeNames[size]}`;
                document.body.appendChild(indicator);
            };
            
            resizeHandle.addEventListener('mousedown', (e) => {
                e.preventDefault();
                e.stopPropagation();
                
                isResizing = true;
                startX = e.clientX;
                currentSize = getCurrentSize();
                previewSize = currentSize;
                
                resizeHandle.classList.add('resizing');
                widget.classList.add('resize-preview');
                widget.setAttribute('draggable', 'false');
                document.body.style.cursor = 'ew-resize';
                document.body.style.userSelect = 'none';
                
                createIndicator(currentSize);
                
                console.log(`🔧 Iniciando resize - Tamaño actual: ${currentSize}, Clases: ${widget.className}`);
            });
            
            document.addEventListener('mousemove', (e) => {
                if (!isResizing) return;
                
                const deltaX = e.clientX - startX;
                const newSize = calculateSize(deltaX);
                
                // Solo actualizar si el tamaño cambió
                if (newSize !== previewSize) {
                    previewSize = newSize;
                    
                    console.log(`📏 Cambiando preview a tamaño ${newSize} (delta: ${deltaX}px)`);
                    
                    // Aplicar preview visual
                    widget.classList.remove('resize-preview-size-1', 'resize-preview-size-2', 'resize-preview-size-3');
                    widget.classList.add(`resize-preview-size-${newSize}`);
                    
                    // Aplicar temporalmente el nuevo tamaño
                    widget.classList.remove('size-1', 'size-2', 'size-3', 'size-4');
                    widget.classList.add(`size-${newSize}`);
                    
                    console.log(`   Clases actuales: ${widget.className}`);
                    
                    // Actualizar indicador
                    createIndicator(newSize);
                }
            });
            
            document.addEventListener('mouseup', () => {
                if (!isResizing) return;
                
                isResizing = false;
                resizeHandle.classList.remove('resizing');
                widget.classList.remove('resize-preview', 'resize-preview-size-1', 'resize-preview-size-2', 'resize-preview-size-3');
                widget.setAttribute('draggable', 'true');
                document.body.style.cursor = '';
                document.body.style.userSelect = '';
                
                // Remover indicador
                if (indicator) {
                    indicator.remove();
                    indicator = null;
                }
                
                // Aplicar el tamaño final
                if (previewSize !== currentSize) {
                    console.log(`✅ Aplicando tamaño final: ${currentSize} → ${previewSize}`);
                    
                    widget.classList.remove('size-1', 'size-2', 'size-3', 'size-4');
                    widget.classList.add(`size-${previewSize}`);
                    
                    console.log(`   Clases finales: ${widget.className}`);
                    console.log(`   Computed grid-column: ${window.getComputedStyle(widget).gridColumn}`);
                    
                    const widgetType = widget.getAttribute('data-widget-type');
                    saveWidgetSize(widgetType, previewSize);
                    
                    // Compactar widgets después de cambiar tamaño
                    setTimeout(() => {
                        const grid = document.getElementById('widget-grid');
                        if (grid && window.compactWidgets) {
                            window.compactWidgets();
                        }
                    }, 100);
                    
                    // Notificación
                    const sizeNames = { 1: 'Pequeño', 2: 'Mediano', 3: 'Grande' };
                    const sizeIcons = { 1: '▫', 2: '▬', 3: '▬▬▬' };
                    showNotification(`${sizeIcons[previewSize]} Tamaño ${sizeNames[previewSize]}`, 'success');
                } else {
                    console.log(`⚪ Sin cambios de tamaño`);
                }
            });
        });
    }
    
    // Reorganizar widgets en el grid para evitar huecos
    function reorganizeGrid() {
        // DESHABILITADO TEMPORALMENTE - sistema sin slots
        console.log('ℹ️ reorganizeGrid() deshabilitado (sistema sin slots)');
        return;
        
        const grid = document.getElementById('widget-grid');
        if (!grid) return;
        
        const widgets = Array.from(grid.querySelectorAll('.widget-item-draggable[data-slot]'));
        const slots = Array.from(grid.querySelectorAll('.grid-slot'));
        
        // Limpiar slots
        slots.forEach(slot => {
            slot.classList.remove('occupied');
        });
        
        // Ordenar widgets por su posición actual
        widgets.sort((a, b) => {
            const slotA = parseInt(a.getAttribute('data-slot')) || 0;
            const slotB = parseInt(b.getAttribute('data-slot')) || 0;
            return slotA - slotB;
        });
        
        // Recolocar widgets de manera compacta
        let currentSlot = 1;
        widgets.forEach(widget => {
            const widgetSize = widget.classList.contains('size-4') ? 4 :
                             widget.classList.contains('size-3') ? 3 : 
                             widget.classList.contains('size-2') ? 2 : 1;
            
            // Buscar el siguiente slot disponible que pueda contener el widget
            while (!canPlaceWidget(currentSlot, widgetSize, widgets, slots)) {
                currentSlot++;
                if (currentSlot > slots.length) break;
            }
            
            if (currentSlot <= slots.length) {
                widget.setAttribute('data-slot', currentSlot);
                const targetSlot = slots[currentSlot - 1];
                if (targetSlot) {
                    targetSlot.classList.add('occupied');
                    targetSlot.appendChild(widget);
                }
                
                // Marcar los slots ocupados por widgets grandes
                for (let i = 0; i < widgetSize; i++) {
                    const slot = slots[currentSlot - 1 + i];
                    if (slot) slot.classList.add('occupied');
                }
                
                currentSlot += widgetSize;
            }
        });
        
        // Guardar nuevas posiciones
        widgets.forEach(widget => {
            const type = widget.getAttribute('data-widget-type');
            const slot = widget.getAttribute('data-slot');
            if (type && slot) {
                saveWidgetPosition(type, parseInt(slot));
            }
        });
    }
    
    // Verificar si se puede colocar un widget en una posición
    function canPlaceWidget(startSlot, widgetSize, widgets, slots) {
        const slotsPerRow = 4; // Cambiado a 4 columnas
        const startRow = Math.floor((startSlot - 1) / slotsPerRow);
        const endSlot = startSlot + widgetSize - 1;
        const endRow = Math.floor((endSlot - 1) / slotsPerRow);
        
        // Verificar que el widget no se sale de la fila (no wrap)
        if (startRow !== endRow && widgetSize > 1) {
            return false;
        }
        
        // Verificar que los slots estén disponibles
        for (let i = startSlot; i < startSlot + widgetSize; i++) {
            if (i > slots.length) return false;
            const slot = slots[i - 1];
            if (!slot || slot.classList.contains('occupied')) {
                return false;
            }
        }
        
        return true;
    }
    
    // Guardar tamaño del widget
    function saveWidgetSize(type, size) {
        const sizes = JSON.parse(localStorage.getItem('widgetSizes') || '{}');
        sizes[type] = size;
        localStorage.setItem('widgetSizes', JSON.stringify(sizes));
    }
    
    // Cargar tamaños guardados
    function loadWidgetSizes() {
        const sizes = JSON.parse(localStorage.getItem('widgetSizes') || '{}');
        
        Object.entries(sizes).forEach(([type, size]) => {
            const widget = document.querySelector(`[data-widget-type="${type}"]`);
            if (widget) {
                widget.classList.remove('size-1', 'size-2', 'size-3', 'size-4');
                widget.classList.add(`size-${size}`);
            }
        });
        
        console.log('📏 Tamaños de widgets cargados:', sizes);
    }
    
    function toggleWidgetMenu() {
        const menu = document.getElementById('widget-menu');
        menu.style.display = menu.style.display === 'none' ? 'block' : 'none';
    }

    
    // ===================================================================
    // SISTEMA DE WIDGETS CON GRID DINÁMICO 2x2 (crece según necesidad)
    // ===================================================================
    
    // Tipos de widgets permitidos (solo 1 de cada tipo excepto plan y agua)
    const WIDGET_TYPES = {
        'today-plan': { maxInstances: 1, mandatory: true },
        'water-tracker': { maxInstances: 1, mandatory: true },
        'pills': { maxInstances: 1, mandatory: false },
        'todo': { maxInstances: 1, mandatory: false },
        'notes': { maxInstances: 1, mandatory: false },
        'habit': { maxInstances: 1, mandatory: false }
    };
    
    // Generar grid dinámico (widgets directamente en el grid, sin slots)
    function updateGridSlots() {
        const grid = document.getElementById('widget-grid');
        if (!grid) {
            console.error('❌ No se encontró el grid');
            return;
        }
        
        // Eliminar todos los slots y mover widgets directamente al grid
        const slots = grid.querySelectorAll('.grid-slot');
        slots.forEach(slot => {
            // Mover widgets del slot directamente al grid
            const widgetsInSlot = slot.querySelectorAll('.widget-item-draggable');
            widgetsInSlot.forEach(widget => {
                grid.appendChild(widget);
            });
            // Eliminar el slot
            slot.remove();
        });
        
        console.log('📐 Grid actualizado: widgets colocados directamente en el grid');
    }
    
    // Obtener widgets activos
    function getActiveWidgets() {
        // Solo contar widgets que están en el grid (tienen data-slot)
        return Array.from(document.querySelectorAll('.widget-item-draggable[data-slot]'));
    }
    
    // Guardar posiciones
    function saveWidgetPosition(widgetType, slot) {
        const positions = JSON.parse(localStorage.getItem('widgetPositions') || '{}');
        positions[widgetType] = { slot };
        localStorage.setItem('widgetPositions', JSON.stringify(positions));
    }
    
    // Obtener slots ocupados
    function getOccupiedSlots() {
        const occupied = {};
        const widgets = document.querySelectorAll('.widget-item-draggable[data-slot]');
        
        widgets.forEach(widget => {
            const slot = parseInt(widget.getAttribute('data-slot'));
            const type = widget.getAttribute('data-widget-type');
            
            // Obtener tamaño del widget
            const widgetSize = widget.classList.contains('size-4') ? 4 :
                              widget.classList.contains('size-3') ? 3 : 
                              widget.classList.contains('size-2') ? 2 : 1;
            
            if (slot && !isNaN(slot)) {
                // Marcar todos los slots que ocupa el widget
                for (let i = 0; i < widgetSize; i++) {
                    occupied[slot + i] = type;
                }
            }
        });
        
        return occupied;
    }
    
    // Verificar si un slot está disponible
    function isSlotAvailable(slot, excludeWidget = null) {
        const occupied = getOccupiedSlots();
        
        // Obtener el widget que se está arrastrando
        const draggedWidget = document.querySelector('.widget-item-draggable.dragging');
        if (!draggedWidget) return !occupied[slot] || occupied[slot] === excludeWidget;
        
        // Obtener tamaño del widget
        const widgetSize = draggedWidget.classList.contains('size-4') ? 4 :
                          draggedWidget.classList.contains('size-3') ? 3 : 
                          draggedWidget.classList.contains('size-2') ? 2 : 1;
        
        // Verificar que el widget cabe en la fila
        const slotsPerRow = 4; // Cambiado a 4 columnas
        const startRow = Math.floor((slot - 1) / slotsPerRow);
        const endSlot = slot + widgetSize - 1;
        const endRow = Math.floor((endSlot - 1) / slotsPerRow);
        
        // Si el widget se sale de la fila, no es válido
        if (startRow !== endRow && widgetSize > 1) {
            return false;
        }
        
        // Verificar que todos los slots necesarios están disponibles
        for (let i = slot; i < slot + widgetSize; i++) {
            if (occupied[i] && occupied[i] !== excludeWidget) {
                return false;
            }
        }
        
        return true;
    }
    
    // Cargar posiciones de widgets
    function loadWidgetPositions() {
        const positions = JSON.parse(localStorage.getItem('widgetPositions') || '{}');
        const grid = document.getElementById('widget-grid');
        
        // Posiciones por defecto para grid 3x1
        const defaults = {
            'today-plan': { slot: 1 },      // Primera columna
            'water-tracker': { slot: 2 }    // Segunda columna
            // Slot 3 y 4 quedan libres para widgets opcionales
        };
        
        const finalPositions = { ...defaults, ...positions };
        
        console.log('🔄 Cargando widgets (directo al grid):', finalPositions);
        
        // Crear array de widgets ordenados por slot
        const widgetsToLoad = [];
        
        Object.entries(finalPositions).forEach(([widgetType, pos]) => {
            const widget = document.querySelector(`[data-widget-type="${widgetType}"]`);
            
            if (widget) {
                widgetsToLoad.push({ widget, slot: pos.slot, type: widgetType });
            } else {
                console.warn(`⚠️ No se pudo encontrar widget ${widgetType}`);
            }
        });
        
        // Ordenar por slot antes de añadir al grid
        widgetsToLoad.sort((a, b) => a.slot - b.slot);
        
        // Añadir widgets al grid en orden con order CSS
        widgetsToLoad.forEach((item, index) => {
            item.widget.setAttribute('data-slot', item.slot);
            item.widget.style.order = index; // Establecer order CSS
            item.widget.style.display = 'flex';
            grid.appendChild(item.widget);
            
            console.log(`✓ Widget ${item.type} → slot ${item.slot}, order ${index}`);
        });
        
        updateGridSlots();
        
        // Compactar widgets al cargar para eliminar huecos
        setTimeout(() => {
            if (window.compactWidgets) {
                window.compactWidgets();
            }
        }, 200);
    }
    
    // Sistema de Drag & Drop - Intercambio de posiciones
    function initDragAndDrop() {
        const grid = document.getElementById('widget-grid');
        let draggedWidget = null;
        let draggedWidgetClone = null;
        
        function attachDragListeners() {
            const widgets = document.querySelectorAll('.widget-item-draggable');
            
            widgets.forEach(widget => {
                // Evitar duplicar listeners
                if (widget.dataset.swapDragInitialized) return;
                widget.dataset.swapDragInitialized = 'true';
                
                // Hacer el widget arrastrable
                widget.setAttribute('draggable', 'true');
                
                widget.addEventListener('dragstart', (e) => {
                    // Ignorar si se está arrastrando desde el handle de resize, botones, inputs o TÍTULO
                    const target = e.target;
                    const isDraggingFromHandle = target.classList.contains('widget-resize-handle') || 
                                                 target.closest('.widget-resize-handle');
                    const isDraggingFromControl = target.tagName === 'BUTTON' || 
                                                  target.tagName === 'INPUT' || 
                                                  target.tagName === 'SELECT' || 
                                                  target.tagName === 'TEXTAREA' ||
                                                  target.closest('button') ||
                                                  target.closest('input');
                    const isDraggingFromTitle = target.tagName === 'H2' || 
                                                target.closest('.widget-header h2');
                    
                    if (isDraggingFromHandle || isDraggingFromControl || isDraggingFromTitle) {
                        e.preventDefault();
                        widget.setAttribute('draggable', 'false');
                        setTimeout(() => widget.setAttribute('draggable', 'true'), 100);
                        return;
                    }
                    
                    draggedWidget = widget;
                    widget.classList.add('dragging');
                    
                    // Crear visualización fantasma
                    draggedWidgetClone = widget.cloneNode(true);
                    draggedWidgetClone.style.opacity = '0.5';
                    e.dataTransfer.effectAllowed = 'move';
                    
                    console.log('🎯 Arrastrando widget:', widget.dataset.widgetType);
                });
                
                widget.addEventListener('dragend', (e) => {
                    if (draggedWidget) {
                        draggedWidget.classList.remove('dragging');
                        draggedWidget = null;
                    }
                    
                    // Limpiar estilos de hover
                    document.querySelectorAll('.widget-item-draggable').forEach(w => {
                        w.classList.remove('drag-over');
                    });
                });
                
                widget.addEventListener('dragover', (e) => {
                    e.preventDefault();
                    
                    if (draggedWidget && widget !== draggedWidget) {
                        e.dataTransfer.dropEffect = 'move';
                        widget.classList.add('drag-over');
                    }
                });
                
                widget.addEventListener('dragleave', (e) => {
                    widget.classList.remove('drag-over');
                });
                
                widget.addEventListener('drop', (e) => {
                    e.preventDefault();
                    widget.classList.remove('drag-over');
                    
                    if (draggedWidget && widget !== draggedWidget) {
                        // Intercambiar posiciones
                        swapWidgets(draggedWidget, widget);
                    }
                });
            });
        }
        
        // Función para intercambiar widgets
        function swapWidgets(widget1, widget2) {
            const type1 = widget1.getAttribute('data-widget-type');
            const type2 = widget2.getAttribute('data-widget-type');
            
            console.log(`🔄 Intercambiando: ${type1} ↔ ${type2}`);
            
            // Obtener todos los widgets y sus posiciones actuales
            const allWidgets = Array.from(grid.querySelectorAll('.widget-item-draggable'));
            const index1 = allWidgets.indexOf(widget1);
            const index2 = allWidgets.indexOf(widget2);
            
            // Intercambiar en el array
            [allWidgets[index1], allWidgets[index2]] = [allWidgets[index2], allWidgets[index1]];
            
            // Re-añadir todos los widgets al grid en el nuevo orden
            allWidgets.forEach((widget, index) => {
                widget.style.order = index;
                widget.setAttribute('data-slot', index + 1);
                
                const type = widget.getAttribute('data-widget-type');
                saveWidgetPosition(type, index + 1);
            });
            
            // Animación de intercambio
            widget1.classList.add('just-dropped');
            widget2.classList.add('just-dropped');
            
            setTimeout(() => {
                widget1.classList.remove('just-dropped');
                widget2.classList.remove('just-dropped');
            }, 400);
            
            showNotification('✨ Widgets intercambiados', 'success');
        }
        
        // Compactar widgets eliminando huecos (tipo masonry)
        function compactWidgets() {
            const widgets = Array.from(grid.querySelectorAll('.widget-item-draggable'));
            
            if (widgets.length === 0) return;
            
            console.log('📦 ANTES de compactar:', widgets.map(w => ({
                type: w.getAttribute('data-widget-type'),
                slot: w.getAttribute('data-slot'),
                order: w.style.order
            })));
            
            // Ordenar por order CSS actual (o por data-slot si no tiene order)
            widgets.sort((a, b) => {
                const orderA = parseInt(a.style.order) || parseInt(a.getAttribute('data-slot')) || 0;
                const orderB = parseInt(b.style.order) || parseInt(b.getAttribute('data-slot')) || 0;
                return orderA - orderB;
            });
            
            // Reordenar secuencialmente desde 0
            widgets.forEach((widget, index) => {
                widget.style.order = index;
                widget.setAttribute('data-slot', index + 1);
                
                const type = widget.getAttribute('data-widget-type');
                saveWidgetPosition(type, index + 1);
            });
            
            console.log('� DESPUÉS de compactar:', widgets.map(w => ({
                type: w.getAttribute('data-widget-type'),
                slot: w.getAttribute('data-slot'),
                order: w.style.order
            })));
        }
        
        // Exponer compactWidgets globalmente para que resize pueda usarla
        window.compactWidgets = compactWidgets;
        
        attachDragListeners();
        
        // Observar cambios en el grid para actualizar listeners
        const observer = new MutationObserver(() => {
            attachDragListeners();
        });
        
        observer.observe(grid, { childList: true, subtree: true });
    }
    
    // Crear widget (validar que no exista ya)
    function createWidget(type) {
        console.log('🔧 Creando widget:', type);
        
        // Verificar si ya existe y está visible (comprobando si tiene data-slot asignado)
        const existing = document.querySelector(`[data-widget-type="${type}"]`);
        const isActive = existing && existing.hasAttribute('data-slot');
        
        if (isActive) {
            showNotification('Este widget ya está activo', 'warning');
            console.log('⚠️ Widget ya activo:', type);
            return;
        }
        
        // Buscar primer slot disponible (empezando desde slot 3, ya que 1-2 son fijos)
        let targetSlot = null;
        for (let i = 3; i <= 30; i++) { // Límite aumentado para grid 3x1
            if (isSlotAvailable(i)) {
                targetSlot = i;
                break;
            }
        }
        
        // Si no hay slot, crear uno nuevo
        if (!targetSlot) {
            const grid = document.getElementById('widget-grid');
            const currentSlots = grid.querySelectorAll('.grid-slot').length;
            targetSlot = currentSlots + 1;
            console.log('📐 Creando nuevo slot:', targetSlot);
        }
        
        // Obtener el widget del contenedor oculto
        const widget = document.getElementById(`${type}-widget`);
        if (!widget) {
            console.error('❌ Widget no encontrado:', `${type}-widget`);
            showNotification('Widget no encontrado', 'error');
            return;
        }
        
        // Activar widget directamente en el grid
        const grid = document.getElementById('widget-grid');
        widget.setAttribute('data-slot', targetSlot);
        widget.style.display = 'flex';
        grid.appendChild(widget);
        
        console.log('✓ Widget activado:', type, 'en slot', targetSlot);
        
        saveWidgetPosition(type, targetSlot);
        updateGridSlots();
        updateWidgetMenu();
        
        // Compactar widgets después de añadir
        setTimeout(() => {
            if (window.compactWidgets) {
                window.compactWidgets();
            }
        }, 100);
        
        showNotification('Widget añadido correctamente', 'success');
        
        // Reinicializar drag & drop para el nuevo widget
        initDragAndDrop();
        
        // Inicializar click en título para el modal
        setTimeout(() => {
            if (window.initWidgetTitleClicks) {
                window.initWidgetTitleClicks();
            }
        }, 100);
        
        // Cerrar menú
        const menu = document.getElementById('widget-menu');
        if (menu) menu.style.display = 'none';
    }
    
    window.createWidget = createWidget;
    
    // Inicializar sistema de resize
    // Event Listeners para widgets opcionales
    const addPillBtn = document.getElementById('add-pill-btn');
    if (addPillBtn) addPillBtn.addEventListener('click', addPill);
    
    const addTodoBtn = document.getElementById('add-todo-btn');
    if (addTodoBtn) addTodoBtn.addEventListener('click', addTodo);
    
    const addHabitBtn = document.getElementById('add-habit-btn');
    if (addHabitBtn) addHabitBtn.addEventListener('click', addHabit);
    
    const addWidgetBtn = document.getElementById('add-widget-btn');
    if (addWidgetBtn) addWidgetBtn.addEventListener('click', toggleWidgetMenu);
    
    // Auto-guardar notas
    const notesContent = document.getElementById('notes-content');
    if (notesContent) notesContent.addEventListener('input', saveNotes);
    
    // Permitir Enter para agregar items
    const pillNameInput = document.getElementById('pill-name-input');
    if (pillNameInput) {
        pillNameInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                document.getElementById('pill-time-input').focus();
            }
        });
    }
    
    const pillTimeInput = document.getElementById('pill-time-input');
    if (pillTimeInput) {
        pillTimeInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') addPill();
        });
    }
    
    const todoInput = document.getElementById('todo-input');
    if (todoInput) {
        todoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') addTodo();
        });
    }
    
    const habitInput = document.getElementById('habit-input');
    if (habitInput) {
        habitInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') addHabit();
        });
    }
    
    // Event listeners para inputs del modo focus
    const focusPillName = document.getElementById('focus-pill-name');
    if (focusPillName) {
        focusPillName.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                e.preventDefault();
                document.getElementById('focus-pill-time').focus();
            }
        });
    }
    
    const focusPillTime = document.getElementById('focus-pill-time');
    if (focusPillTime) {
        focusPillTime.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') addPillFromFocus();
        });
    }
    
    const focusTodoInput = document.getElementById('focus-todo-input');
    if (focusTodoInput) {
        focusTodoInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') addTodoFromFocus();
        });
    }
    
    const focusHabitInput = document.getElementById('focus-habit-input');
    if (focusHabitInput) {
        focusHabitInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') addHabitFromFocus();
        });
    }
    
    // Cerrar menú al hacer click fuera
    document.addEventListener('click', (e) => {
        const menu = document.getElementById('widget-menu');
        const btn = document.getElementById('add-widget-btn');
        if (menu && btn && !menu.contains(e.target) && !btn.contains(e.target)) {
            menu.style.display = 'none';
        }
    });

    // ===== SISTEMA DE EXPANSIÓN SIMPLE DE WIDGETS =====
    function toggleWidgetExpansion(widgetElement) {
        const isExpanded = widgetElement.classList.contains('widget-expanded');
        
        // Cerrar cualquier otro widget expandido
        document.querySelectorAll('.widget-expanded').forEach(w => {
            if (w !== widgetElement) {
                w.classList.remove('widget-expanded');
                w.style.zIndex = '';
            }
        });
        
        if (isExpanded) {
            // Contraer widget
            widgetElement.classList.remove('widget-expanded'); widgetElement.style.zIndex = ''; const overlay = document.getElementById('widget-overlay'); if (overlay) overlay.classList.remove('active');
            console.log('� Widget contraído');
        } else {
            // Expandir widget
            widgetElement.classList.add('widget-expanded');
            widgetElement.style.zIndex = '10000'; const overlay = document.getElementById('widget-overlay'); if (overlay) overlay.classList.add('active');
            console.log('📖 Widget expandido');
        }
    }
    
    // Agregar event listeners a todos los títulos de widgets
    function initWidgetTitleClicks() {
        const widgets = document.querySelectorAll('.widget-item-draggable');
        
        console.log('Inicializando clicks en títulos, widgets encontrados:', widgets.length);
        
        widgets.forEach(widget => {
            const header = widget.querySelector('.widget-header h2');
            
            if (header && !header.dataset.expandInitialized) {
                header.dataset.expandInitialized = 'true';
                
                // Prevenir que el header sea arrastrable
                header.setAttribute('draggable', 'false');
                
                header.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    console.log('Click en título detectado:', header.textContent);
                    toggleWidgetExpansion(widget);
                }, true); // Usar capturing phase para mayor prioridad
                
                console.log('Click listener añadido a:', header.textContent);
            }
        });
    }
    
    // Hacer accesible globalmente
    window.initWidgetTitleClicks = initWidgetTitleClicks;
    
    // Click en overlay cierra el widget
    setTimeout(() => {
        const overlay = document.getElementById('widget-overlay');
        if (overlay) {
            overlay.addEventListener('click', () => {
                const expandedWidget = document.querySelector('.widget-expanded');
                if (expandedWidget) {
                    toggleWidgetExpansion(expandedWidget);
                }
            });
        }
    }, 500);
    
    // Inicializar clicks en títulos después de cargar widgets
    setTimeout(() => {
        initWidgetTitleClicks();
    }, 1000);

    // --- Iniciar la aplicación ---
    init();

    // ===== CONFIGURACIÓN UNIFICADA Y ELEMENTOS DE MEDITACIÓN =====
    
    // Panel de configuración unificado - Botones de dashboard y focus mode
    const dashboardSettingsBtn = document.getElementById('dashboard-settings-btn');
    const focusSettingsBtn = document.getElementById('toggle-focus-settings-btn');
    const settingsPanel = document.getElementById('unified-settings-panel');
    const settingsTabs = document.querySelectorAll('.settings-tab');
    const settingsContents = document.querySelectorAll('.settings-tab-content');

    // Función para toggle del panel
    function toggleSettingsPanel() {
        settingsPanel.classList.toggle('hidden');
    }

    // Event listeners para ambos botones
    if (dashboardSettingsBtn && settingsPanel) {
        dashboardSettingsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleSettingsPanel();
        });
    }

    if (focusSettingsBtn && settingsPanel) {
        focusSettingsBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            toggleSettingsPanel();
        });
    }

    // Cerrar al hacer clic fuera
    if (settingsPanel) {
        document.addEventListener('click', (e) => {
            if (!settingsPanel.contains(e.target) && 
                !dashboardSettingsBtn?.contains(e.target) && 
                !focusSettingsBtn?.contains(e.target)) {
                settingsPanel.classList.add('hidden');
            }
        });
    }

    // Tabs de configuración
    settingsTabs.forEach(tab => {
        tab.addEventListener('click', () => {
            const targetTab = tab.dataset.tab;
            
            // Desactivar todos los tabs
            settingsTabs.forEach(t => t.classList.remove('active'));
            settingsContents.forEach(c => c.classList.remove('active'));
            
            // Activar el tab seleccionado
            tab.classList.add('active');
            const targetContent = document.querySelector(`[data-content="${targetTab}"]`);
            if (targetContent) {
                targetContent.classList.add('active');
                
                // Si es el tab de perfil, cargar datos del usuario actual
                if (targetTab === 'profile') {
                    loadProfileData();
                }
            }
        });
    });

    // ===== GESTIÓN DEL PERFIL DE USUARIO =====
    function loadProfileData() {
        const userInterface = window.userInterface;
        if (!userInterface || !userInterface.userManager) return;
        
        const user = userInterface.userManager.getCurrentUser();
        if (!user) return;
        
        // Cargar datos en el formulario
        const weightInput = document.getElementById('profile-weight');
        const activitySelect = document.getElementById('profile-activity');
        const goalSelect = document.getElementById('profile-goal');
        const dietSelect = document.getElementById('profile-diet');
        const airfryerCheck = document.getElementById('profile-airfryer');
        
        if (weightInput) weightInput.value = user.weight;
        if (activitySelect) activitySelect.value = user.activityLevel;
        if (goalSelect) goalSelect.value = user.goal;
        if (dietSelect) dietSelect.value = user.dietType || 'balanced';
        if (airfryerCheck) airfryerCheck.checked = user.hasAirfryer || false;
        
        // Cargar alérgenos
        const allergenCheckboxes = document.querySelectorAll('#profile-allergens input[type="checkbox"]');
        allergenCheckboxes.forEach(checkbox => {
            checkbox.checked = user.allergens && user.allergens.includes(checkbox.value);
        });
        
        // Cargar suplementos
        const supplementCheckboxes = document.querySelectorAll('#profile-supplements input[type="checkbox"]');
        supplementCheckboxes.forEach(checkbox => {
            checkbox.checked = user.supplements && user.supplements.includes(checkbox.value);
        });
    }

    function saveProfileData() {
        const userInterface = window.userInterface;
        if (!userInterface || !userInterface.userManager) {
            showNotification('Sistema de usuarios no disponible', 'error');
            return;
        }
        
        const user = userInterface.userManager.getCurrentUser();
        if (!user) {
            showNotification('No hay usuario activo', 'error');
            return;
        }
        
        // Obtener valores del formulario
        const weightInput = document.getElementById('profile-weight');
        const activitySelect = document.getElementById('profile-activity');
        const goalSelect = document.getElementById('profile-goal');
        const dietSelect = document.getElementById('profile-diet');
        const airfryerCheck = document.getElementById('profile-airfryer');
        
        // Actualizar datos del usuario
        if (weightInput && weightInput.value) user.weight = parseFloat(weightInput.value);
        if (activitySelect) user.activityLevel = activitySelect.value;
        if (goalSelect) user.goal = goalSelect.value;
        if (dietSelect) user.dietType = dietSelect.value;
        if (airfryerCheck) user.hasAirfryer = airfryerCheck.checked;
        
        // Actualizar alérgenos
        const allergenCheckboxes = document.querySelectorAll('#profile-allergens input[type="checkbox"]');
        user.allergens = Array.from(allergenCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);
        
        // Actualizar suplementos
        const supplementCheckboxes = document.querySelectorAll('#profile-supplements input[type="checkbox"]');
        user.supplements = Array.from(supplementCheckboxes)
            .filter(cb => cb.checked)
            .map(cb => cb.value);
        
        // Actualizar fecha de modificación
        user.lastUpdated = new Date().toISOString();
        
        // Guardar en localStorage
        userInterface.userManager.saveUsers();
        
        showNotification('Perfil actualizado correctamente', 'success');
    }

    // Event listeners para botones de perfil
    const saveProfileBtn = document.getElementById('save-profile-btn');
    const regeneratePlanBtn = document.getElementById('regenerate-plan-btn');
    
    if (saveProfileBtn) {
        saveProfileBtn.addEventListener('click', () => {
            saveProfileData();
        });
    }
    
    if (regeneratePlanBtn) {
        regeneratePlanBtn.addEventListener('click', async () => {
            saveProfileData();
            
            const userInterface = window.userInterface;
            if (!userInterface || !userInterface.userManager) return;
            
            const user = userInterface.userManager.getCurrentUser();
            if (!user) return;
            
            // Limpiar plan anterior
            if (window.MealPlanner && window.MealPlanner.clearPlanForUser) {
                window.MealPlanner.clearPlanForUser(user.id);
            }
            
            // Regenerar plan
            showNotification('Regenerando plan nutricional...', 'info');
            await window.regenerateDietPlan(true);
        });
    }

    // Sincronizar controles de tema entre paneles
    const themeFocus = document.getElementById('theme-select-focus');
    if (themeFocus && themeSelect) {
        themeFocus.value = themeSelect.value;
        themeFocus.addEventListener('change', () => {
            themeSelect.value = themeFocus.value;
            themeSelect.dispatchEvent(new Event('change'));
        });
    }

    // Sincronizar brillo
    const brightnessFocus = document.getElementById('brightness-slider-focus');
    const brightnessValueFocus = document.getElementById('brightness-value-focus');
    if (brightnessFocus && brightnessSlider) {
        brightnessFocus.value = brightnessSlider.value;
        brightnessValueFocus.textContent = brightnessSlider.value + '%';
        
        brightnessFocus.addEventListener('input', () => {
            brightnessSlider.value = brightnessFocus.value;
            brightnessValueFocus.textContent = brightnessFocus.value + '%';
            brightnessSlider.dispatchEvent(new Event('input'));
        });
    }

    // Sincronizar volumen
    const volumeFocus = document.getElementById('volume-slider-focus');
    const volumeValueFocus = document.getElementById('volume-value-focus');
    if (volumeFocus && volumeSlider) {
        volumeFocus.value = volumeSlider.value;
        volumeValueFocus.textContent = Math.round(volumeFocus.value * 100) + '%';
        
        volumeFocus.addEventListener('input', () => {
            volumeSlider.value = volumeFocus.value;
            volumeValueFocus.textContent = Math.round(volumeFocus.value * 100) + '%';
            volumeSlider.dispatchEvent(new Event('input'));
        });
    }

    // Sincronizar tamaño de fuente
    const fontSizeFocus = document.getElementById('font-size-slider-focus');
    const fontSizeValueFocus = document.getElementById('font-size-value-focus');
    if (fontSizeFocus && fontSizeSlider) {
        fontSizeFocus.value = fontSizeSlider.value;
        fontSizeValueFocus.textContent = fontSizeSlider.value + '%';
        
        fontSizeFocus.addEventListener('input', () => {
            fontSizeSlider.value = fontSizeFocus.value;
            fontSizeValueFocus.textContent = fontSizeFocus.value + '%';
            fontSizeSlider.dispatchEvent(new Event('input'));
        });
    }

    // Botones de sonido ambiental
    const soundBtns = document.querySelectorAll('.sound-btn');
    soundBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            soundBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            
            const sound = btn.dataset.sound;
            
            // Detener todos los sonidos
            Object.values(allSounds).forEach(audio => {
                if (audio) audio.pause();
            });
            
            // Reproducir el seleccionado
            if (sound !== 'none' && allSounds[sound]) {
                allSounds[sound].play();
            }
        });
    });

    // Botones de agua adicionales
    const addWater250 = document.getElementById('focus-add-water-250');
    const addWater500 = document.getElementById('focus-add-water-500');
    
    if (addWater250) {
        addWater250.addEventListener('click', () => {
            currentWater += 250;
            updateWaterDisplay();
            saveWaterProgress();
            showNotification('+ 250ml de agua', 'success');
        });
    }
    
    if (addWater500) {
        addWater500.addEventListener('click', () => {
            currentWater += 500;
            updateWaterDisplay();
            saveWaterProgress();
            showNotification('+ 500ml de agua', 'success');
        });
    }

    // Gestión de datos
    const exportBtn = document.getElementById('export-data-btn');
    const importBtn = document.getElementById('import-data-btn');
    const resetBtn = document.getElementById('reset-data-btn');
    const importFileInput = document.getElementById('import-file-input');

    if (exportBtn) {
        exportBtn.addEventListener('click', () => {
            const data = {
                pillsReminders: localStorage.getItem('pillsReminders'),
                todoList: localStorage.getItem('todoList'),
                dailyHabits: localStorage.getItem('dailyHabits'),
                quickNotes: localStorage.getItem('quickNotes'),
                waterProgress: localStorage.getItem('waterProgress'),
                settings: {
                    theme: localStorage.getItem('theme'),
                    brightness: localStorage.getItem('brightness'),
                    volume: localStorage.getItem('volume'),
                    fontSize: localStorage.getItem('fontSize')
                },
                exportDate: new Date().toISOString()
            };
            
            const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = `suitofocus-backup-${new Date().toISOString().split('T')[0]}.json`;
            a.click();
            URL.revokeObjectURL(url);
            
            showNotification('Datos exportados correctamente', 'success');
        });
    }

    if (importBtn && importFileInput) {
        importBtn.addEventListener('click', () => {
            importFileInput.click();
        });
        
        importFileInput.addEventListener('change', (e) => {
            const file = e.target.files[0];
            if (!file) return;
            
            const reader = new FileReader();
            reader.onload = (event) => {
                try {
                    const data = JSON.parse(event.target.result);
                    
                    // Restaurar datos
                    if (data.pillsReminders) localStorage.setItem('pillsReminders', data.pillsReminders);
                    if (data.todoList) localStorage.setItem('todoList', data.todoList);
                    if (data.dailyHabits) localStorage.setItem('dailyHabits', data.dailyHabits);
                    if (data.quickNotes) localStorage.setItem('quickNotes', data.quickNotes);
                    if (data.waterProgress) localStorage.setItem('waterProgress', data.waterProgress);
                    
                    if (data.settings) {
                        if (data.settings.theme) localStorage.setItem('theme', data.settings.theme);
                        if (data.settings.brightness) localStorage.setItem('brightness', data.settings.brightness);
                        if (data.settings.volume) localStorage.setItem('volume', data.settings.volume);
                        if (data.settings.fontSize) localStorage.setItem('fontSize', data.settings.fontSize);
                    }
                    
                    showNotification('Datos importados. Recarga la página.', 'success');
                    setTimeout(() => location.reload(), 2000);
                } catch (error) {
                    showNotification('Error al importar datos', 'error');
                }
            };
            reader.readAsText(file);
        });
    }

    if (resetBtn) {
        resetBtn.addEventListener('click', async () => {
            const confirmed = await showConfirm('¿Seguro que quieres borrar TODOS los datos? Esta acción no se puede deshacer.');
            if (confirmed) {
                localStorage.clear();
                showNotification('Todos los datos eliminados. Recargando...', 'info');
                setTimeout(() => location.reload(), 1500);
            }
        });
    }

    // Calcular espacio usado
    const storageUsed = document.getElementById('storage-used');
    if (storageUsed) {
        let total = 0;
        for (let key in localStorage) {
            if (localStorage.hasOwnProperty(key)) {
                total += localStorage[key].length + key.length;
            }
        }
        storageUsed.textContent = (total / 1024).toFixed(2);
    }

    // ===== ELEMENTOS DE MEDITACIÓN =====
    
    let currentElement = 'candle';
    
    // Cargar elemento guardado
    const savedElement = localStorage.getItem('meditationElement');
    if (savedElement) {
        currentElement = savedElement;
    }

    // Selector de elemento de meditación
    const meditationRadios = document.querySelectorAll('input[name="meditation-element"]');
    meditationRadios.forEach(radio => {
        if (radio.value === currentElement) {
            radio.checked = true;
        }
        
        radio.addEventListener('change', () => {
            if (radio.checked) {
                currentElement = radio.value;
                localStorage.setItem('meditationElement', currentElement);
                renderMeditationElement();
                showNotification(`Elemento cambiado a ${getElementName(currentElement)}`, 'success');
            }
        });
    });

    function getElementName(element) {
        const names = {
            candle: 'Vela',
            waterfall: 'Cascada',
            bonsai: 'Bonsái',
            lotus: 'Flor de Loto',
            zen: 'Jardín Zen'
        };
        return names[element] || element;
    }

    function renderMeditationElement() {
        const centerContainer = document.querySelector('.focus-center');
        if (!centerContainer) return;

        // Limpiar contenido anterior
        centerContainer.innerHTML = '';

        switch (currentElement) {
            case 'candle':
                centerContainer.innerHTML = `
                    <div class="candle-container">
                        <div class="flame"></div>
                        <div class="wick"></div>
                        <div class="wax"></div>
                    </div>
                `;
                break;

            case 'waterfall':
                const waterfallHTML = `
                    <div class="waterfall-container meditation-element">
                        <div class="waterfall">
                            ${Array(20).fill('').map((_, i) => `
                                <div class="water-drop" style="left: ${Math.random() * 100}%; animation-delay: ${Math.random() * 2}s; height: ${20 + Math.random() * 30}px;"></div>
                            `).join('')}
                        </div>
                    </div>
                `;
                centerContainer.innerHTML = waterfallHTML;
                break;

            case 'bonsai':
                centerContainer.innerHTML = `
                    <div class="bonsai-container meditation-element">
                        <div class="bonsai-pot"></div>
                        <div class="bonsai-tree"></div>
                    </div>
                `;
                break;

            case 'lotus':
                centerContainer.innerHTML = `
                    <div class="lotus-container meditation-element">
                        <div class="lotus-flower">
                            <div class="lotus-petal"></div>
                            <div class="lotus-petal"></div>
                            <div class="lotus-petal"></div>
                            <div class="lotus-petal"></div>
                            <div class="lotus-petal"></div>
                        </div>
                    </div>
                `;
                break;

            case 'zen':
                centerContainer.innerHTML = `
                    <div class="zen-container meditation-element">
                        <div class="zen-pattern"></div>
                        <div class="zen-rock"></div>
                        <div class="zen-rock"></div>
                        <div class="zen-rock"></div>
                    </div>
                `;
                break;
        }
    }

    // Renderizar elemento inicial
    setTimeout(() => renderMeditationElement(), 500);
});


