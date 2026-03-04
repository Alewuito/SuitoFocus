// ===== SISTEMA DE CANTIDADES ESTANDARIZADAS POR ENVASE =====
// Facilita el seguimiento de la dieta usando formatos comerciales reales

const PACKAGE_STANDARDS = {
    // LÁCTEOS Y ALTERNATIVAS
    yogur: {
        standard: 125,  // Yogur individual estándar
        options: [125, 250, 400],  // 1 yogur, 2 yogures, envase grande Alpro
        display: (qty) => {
            if (qty === 125) return '1 yogur (125g)';
            if (qty === 250) return '2 yogures (250g)';
            if (qty === 400) return '1 envase Alpro (400g)';
            return `${Math.round(qty / 125)} yogures (${qty}g)`;
        }
    },
    
    leche_avena: {
        standard: 200,  // 1 vaso
        options: [200, 250, 500],  // Vaso, taza, 2 vasos
        display: (qty) => {
            if (qty === 200) return '1 vaso (200ml)';
            if (qty === 250) return '1 taza (250ml)';
            if (qty === 500) return '2 vasos (500ml)';
            return `${qty}ml`;
        }
    },
    
    queso: {
        standard: 40,  // Loncha de queso
        options: [40, 80, 125],  // 1 loncha, 2 lonchas, tarrina individual
        display: (qty) => {
            if (qty === 40) return '1 loncha (40g)';
            if (qty === 80) return '2 lonchas (80g)';
            if (qty === 125) return '1 tarrina individual (125g)';
            return `${qty}g`;
        }
    },
    
    // CEREALES
    avena: {
        standard: 40,  // Medida estándar
        options: [30, 40, 50, 60, 80],  // Porciones comunes
        display: (qty) => {
            const scoops = Math.round(qty / 40);
            if (scoops === 1) return '1 medida (40g)';
            if (scoops === 2) return '2 medidas (80g)';
            return `${qty}g`;
        }
    },
    
    arroz: {
        standard: 80,  // Crudo (peso seco)
        options: [60, 80, 100, 120],
        display: (qty) => `${qty}g arroz crudo (~${Math.round(qty * 2.5)}g cocido)`
    },
    
    pan: {
        standard: 60,  // 2 rebanadas
        options: [30, 60, 90, 120],  // 1, 2, 3, 4 rebanadas
        display: (qty) => {
            const slices = Math.round(qty / 30);
            if (slices === 1) return '1 rebanada (30g)';
            return `${slices} rebanadas (${qty}g)`;
        }
    },
    
    // PROTEÍNAS
    huevos: {
        standard: 1,
        options: [1, 2, 3, 4],
        display: (qty) => qty === 1 ? '1 huevo (L)' : `${qty} huevos (L)`
    },
    
    pollo: {
        standard: 150,  // Pechuga individual
        options: [100, 150, 200, 250],
        display: (qty) => {
            if (qty === 150) return '1 pechuga mediana (150g)';
            if (qty === 200) return '1 pechuga grande (200g)';
            return `${qty}g`;
        }
    },
    
    pescado: {
        standard: 150,  // Filete individual
        options: [120, 150, 180, 200],
        display: (qty) => {
            if (qty === 150) return '1 filete mediano (150g)';
            if (qty === 180) return '1 filete grande (180g)';
            return `${qty}g`;
        }
    },
    
    jamon: {
        standard: 50,  // 2 lonchas
        options: [25, 50, 75, 100],
        display: (qty) => {
            const slices = Math.round(qty / 25);
            if (slices === 1) return '1 loncha (25g)';
            if (slices === 2) return '2 lonchas (50g)';
            return `${slices} lonchas (${qty}g)`;
        }
    },
    
    proteina: {
        standard: 30,  // 1 scoop
        options: [20, 30, 40, 60],
        display: (qty) => {
            const scoops = Math.round(qty / 30);
            if (scoops === 1) return '1 scoop (30g)';
            if (scoops === 2) return '2 scoops (60g)';
            return `${qty}g`;
        }
    },
    
    // LEGUMBRES
    lentejas: {
        standard: 80,  // Peso seco
        options: [60, 80, 100, 120],
        display: (qty) => `${qty}g lentejas secas (~${Math.round(qty * 2.5)}g cocidas)`
    },
    
    garbanzos: {
        standard: 80,  // Peso seco
        options: [60, 80, 100],
        display: (qty) => `${qty}g garbanzos secos (~${Math.round(qty * 2.5)}g cocidos)`
    },
    
    // VERDURAS
    brocoli: {
        standard: 200,  // 1 bol
        options: [150, 200, 250, 300],
        display: (qty) => {
            if (qty === 200) return '1 bol (200g)';
            if (qty === 300) return '1 bol grande (300g)';
            return `${qty}g`;
        }
    },
    
    espinacas: {
        standard: 100,
        options: [50, 100, 150, 200],
        display: (qty) => `${qty}g espinacas`
    },
    
    tomate: {
        standard: 100,  // 1 tomate mediano
        options: [100, 150, 200],
        display: (qty) => {
            if (qty === 100) return '1 tomate mediano (100g)';
            if (qty === 150) return '1 tomate grande (150g)';
            return `${qty}g`;
        }
    },
    
    ensalada: {
        standard: 100,
        options: [100, 150, 200],
        display: (qty) => `${qty}g ensalada variada`
    },
    
    // TUBÉRCULOS
    patata: {
        standard: 150,  // 1 patata mediana
        options: [100, 150, 200, 250],
        display: (qty) => {
            if (qty === 150) return '1 patata mediana (150g)';
            if (qty === 200) return '1 patata grande (200g)';
            return `${qty}g`;
        }
    },
    
    boniato: {
        standard: 150,  // 1 boniato mediano
        options: [100, 150, 200],
        display: (qty) => {
            if (qty === 150) return '1 boniato mediano (150g)';
            if (qty === 200) return '1 boniato grande (200g)';
            return `${qty}g`;
        }
    },
    
    // FRUTAS
    platano: {
        standard: 120,  // 1 plátano mediano
        options: [100, 120, 150],
        display: (qty) => {
            if (qty === 120) return '1 plátano mediano (120g)';
            if (qty === 150) return '1 plátano grande (150g)';
            return `${qty}g`;
        }
    },
    
    manzana: {
        standard: 180,  // 1 manzana mediana
        options: [150, 180, 200],
        display: (qty) => {
            if (qty === 180) return '1 manzana mediana (180g)';
            return `${qty}g`;
        }
    },
    
    frutos: {
        standard: 100,  // Frutos rojos
        options: [80, 100, 125, 150],
        display: (qty) => {
            if (qty === 125) return '1 tarrina (125g)';
            return `${qty}g frutos rojos`;
        }
    },
    
    // GRASAS Y ACEITES
    aceite: {
        standard: 10,  // 1 cucharada
        options: [5, 10, 15, 20],
        display: (qty) => {
            const spoons = Math.round(qty / 5);
            if (spoons === 1) return '1 cucharadita (5ml)';
            if (spoons === 2) return '1 cucharada (10ml)';
            if (spoons === 3) return '1.5 cucharadas (15ml)';
            return `${qty}ml`;
        }
    },
    
    aguacate: {
        standard: 100,  // 1/2 aguacate
        options: [50, 100, 150],
        display: (qty) => {
            if (qty === 50) return '1/4 aguacate (50g)';
            if (qty === 100) return '1/2 aguacate (100g)';
            if (qty === 150) return '3/4 aguacate (150g)';
            return `${qty}g`;
        }
    },
    
    almendras: {
        standard: 25,  // 1 puñado
        options: [15, 25, 30, 50],
        display: (qty) => {
            if (qty === 25) return '1 puñado (~15 almendras, 25g)';
            if (qty === 50) return '2 puñados (~30 almendras, 50g)';
            return `${qty}g`;
        }
    },
    
    nueces: {
        standard: 25,  // 1 puñado
        options: [15, 25, 30],
        display: (qty) => {
            if (qty === 25) return '1 puñado (~8 nueces, 25g)';
            return `${qty}g`;
        }
    },
    
    mantequilla_cacahuete: {
        standard: 20,  // 1 cucharada
        options: [15, 20, 30],
        display: (qty) => {
            if (qty === 20) return '1 cucharada (20g)';
            return `${qty}g`;
        }
    }
};

// Función para ajustar cantidades a estándares de envases
function adjustToPackageStandard(ingredient, targetQty) {
    const standard = PACKAGE_STANDARDS[ingredient];
    if (!standard) {
        // Si no hay estándar definido, redondear a múltiplos de 5
        return Math.round(targetQty / 5) * 5;
    }
    
    // Encontrar la opción más cercana
    const closest = standard.options.reduce((prev, curr) => {
        return (Math.abs(curr - targetQty) < Math.abs(prev - targetQty) ? curr : prev);
    });
    
    return closest;
}

// Función para obtener display amigable de la cantidad
function getPackageDisplay(ingredient, qty) {
    const standard = PACKAGE_STANDARDS[ingredient];
    if (!standard || !standard.display) {
        return `${qty}g ${ingredient.replace(/_/g, ' ')}`;
    }
    
    return standard.display(qty);
}

// Exportar funciones
window.PACKAGE_STANDARDS = PACKAGE_STANDARDS;
window.adjustToPackageStandard = adjustToPackageStandard;
window.getPackageDisplay = getPackageDisplay;

console.log('📦 Sistema de envases estandarizados cargado');
