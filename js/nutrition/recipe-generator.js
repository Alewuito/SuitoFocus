/**
 * GENERADOR DE RECETAS ELABORADAS
 * 
 * Sistema que genera planes alimenticios usando recetas completas reales
 * en lugar de mezclar ingredientes sueltos.
 * 
 * - Usa RECETAS_DATABASE con recetas elaboradas mediterráneas
 * - Ajusta porciones para cumplir objetivos calóricos OMS
 * - Cantidades simples y fáciles de calcular (50g, 100g, 150g, etc.)
 * - Incluye instrucciones de preparación paso a paso
 */

class RecipeBasedMealGenerator {
    constructor(userProfile) {
        this.userProfile = userProfile;
        this.kcalObjetivo = this.calcularKcalObjetivo();
        
        // Distribución calórica OMS (porcentajes por comida)
        this.distribucionOMS = {
            desayuno: 0.22,      // 22% de calorías diarias
            media_manana: 0.08,  // 8%
            comida: 0.33,        // 33%
            merienda: 0.08,      // 8%
            cena: 0.29           // 29%
        };
    }
    
    /**
     * Calcular calorías objetivo según perfil del usuario
     */
    calcularKcalObjetivo() {
        const { sexo, edad, peso, altura, actividad, objetivo } = this.userProfile;
        
        // Fórmula Mifflin-St Jeor (más precisa)
        let tmb;
        if (sexo === 'hombre') {
            tmb = (10 * peso) + (6.25 * altura) - (5 * edad) + 5;
        } else {
            tmb = (10 * peso) + (6.25 * altura) - (5 * edad) - 161;
        }
        
        // Factor de actividad
        const factoresActividad = {
            sedentario: 1.2,
            ligero: 1.375,
            moderado: 1.55,
            intenso: 1.725,
            muy_intenso: 1.9
        };
        
        let tdee = tmb * (factoresActividad[actividad] || 1.2);
        
        // Ajustar según objetivo
        if (objetivo === 'perder_peso') {
            tdee -= 500; // Déficit de 500 kcal
        } else if (objetivo === 'ganar_peso') {
            tdee += 300; // Superávit de 300 kcal
        }
        
        return Math.round(tdee);
    }
    
    /**
     * Seleccionar receta apropiada para un tipo de comida y objetivo calórico
     */
    seleccionarReceta(tipoComida, kcalObjetivo, preferencias = {}) {
        const tipo = this.mapearTipoComida(tipoComida);
        const recetas = obtenerRecetasPorTipo(tipo);
        
        if (recetas.length === 0) {
            console.warn(`No hay recetas disponibles para ${tipo}`);
            return null;
        }
        
        // Filtrar por preferencias (vegetariano, etc.)
        let recetasFiltradas = recetas;
        if (preferencias.vegetariano) {
            recetasFiltradas = recetas.filter(r => r.tags.includes('vegetariano'));
        }
        if (preferencias.vegano) {
            recetasFiltradas = recetas.filter(r => r.tags.includes('vegano'));
        }
        
        if (recetasFiltradas.length === 0) {
            recetasFiltradas = recetas; // Fallback si no hay opciones
        }
        
        // Buscar receta con calorías más cercanas al objetivo
        let mejorReceta = recetasFiltradas[0];
        let menorDiferencia = Math.abs(recetasFiltradas[0].info_nutricional.kcal - kcalObjetivo);
        
        for (let receta of recetasFiltradas) {
            const diferencia = Math.abs(receta.info_nutricional.kcal - kcalObjetivo);
            if (diferencia < menorDiferencia) {
                menorDiferencia = diferencia;
                mejorReceta = receta;
            }
        }
        
        // Ajustar porciones si es necesario
        const multiplicador = kcalObjetivo / mejorReceta.info_nutricional.kcal;
        
        // Solo ajustar si la diferencia es significativa (>20%)
        if (Math.abs(multiplicador - 1) > 0.2) {
            return ajustarPorciones(mejorReceta, multiplicador);
        }
        
        return mejorReceta;
    }
    
    /**
     * Mapear tipo de comida a categoría de recetas
     */
    mapearTipoComida(tipoComida) {
        const mapeo = {
            'desayuno': 'desayunos',
            'media_manana': 'snacks',
            'comida': 'comidas',
            'merienda': 'snacks',
            'cena': 'cenas'
        };
        return mapeo[tipoComida] || 'comidas';
    }
    
    /**
     * Generar plan de comidas para un día completo
     */
    generarPlanDiario(preferencias = {}) {
        const planDiario = {
            fecha: new Date().toISOString().split('T')[0],
            kcal_objetivo: this.kcalObjetivo,
            comidas: {},
            totales: {
                kcal: 0,
                proteinas: 0,
                carbohidratos: 0,
                grasas: 0
            }
        };
        
        // Generar cada comida según distribución OMS
        for (let tipoComida in this.distribucionOMS) {
            const kcalComida = Math.round(this.kcalObjetivo * this.distribucionOMS[tipoComida]);
            const receta = this.seleccionarReceta(tipoComida, kcalComida, preferencias);
            
            if (receta) {
                planDiario.comidas[tipoComida] = {
                    receta: receta,
                    momento: tipoComida,
                    kcal_objetivo: kcalComida,
                    kcal_real: receta.info_nutricional.kcal
                };
                
                // Acumular totales
                planDiario.totales.kcal += receta.info_nutricional.kcal;
                planDiario.totales.proteinas += receta.info_nutricional.proteinas;
                planDiario.totales.carbohidratos += receta.info_nutricional.carbohidratos;
                planDiario.totales.grasas += receta.info_nutricional.grasas;
            }
        }
        
        return planDiario;
    }
    
    /**
     * Generar plan semanal variado
     */
    generarPlanSemanal(preferencias = {}) {
        const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];
        const planSemanal = {
            semana: {},
            promedios: {
                kcal: 0,
                proteinas: 0,
                carbohidratos: 0,
                grasas: 0
            }
        };
        
        // Generar plan para cada día
        for (let dia of diasSemana) {
            planSemanal.semana[dia] = this.generarPlanDiario(preferencias);
        }
        
        // Calcular promedios
        const totalDias = diasSemana.length;
        for (let dia of diasSemana) {
            const plan = planSemanal.semana[dia];
            planSemanal.promedios.kcal += plan.totales.kcal;
            planSemanal.promedios.proteinas += plan.totales.proteinas;
            planSemanal.promedios.carbohidratos += plan.totales.carbohidratos;
            planSemanal.promedios.grasas += plan.totales.grasas;
        }
        
        planSemanal.promedios.kcal = Math.round(planSemanal.promedios.kcal / totalDias);
        planSemanal.promedios.proteinas = Math.round(planSemanal.promedios.proteinas / totalDias);
        planSemanal.promedios.carbohidratos = Math.round(planSemanal.promedios.carbohidratos / totalDias);
        planSemanal.promedios.grasas = Math.round(planSemanal.promedios.grasas / totalDias);
        
        return planSemanal;
    }
    
    /**
     * Formatear receta para mostrar en la UI
     */
    formatearRecetaParaUI(receta) {
        if (!receta) return null;
        
        return {
            nombre: receta.nombre,
            tiempo: `${receta.tiempo_preparacion} min`,
            dificultad: receta.dificultad.charAt(0).toUpperCase() + receta.dificultad.slice(1),
            porciones: receta.porciones,
            ingredientes: receta.ingredientes.map(ing => {
                if (typeof ing.cantidad === 'number') {
                    return `${ing.cantidad}${ing.unidad} de ${ing.nombre}`;
                } else {
                    return `${ing.nombre} ${ing.cantidad}`;
                }
            }),
            instrucciones: receta.instrucciones,
            nutricion: {
                calorias: `${receta.info_nutricional.kcal} kcal`,
                proteinas: `${receta.info_nutricional.proteinas}g`,
                carbohidratos: `${receta.info_nutricional.carbohidratos}g`,
                grasas: `${receta.info_nutricional.grasas}g`
            },
            tags: receta.tags.map(tag => tag.replace(/_/g, ' '))
        };
    }
    
    /**
     * Generar HTML para mostrar una receta
     */
    generarHTMLReceta(receta) {
        const recetaFormateada = this.formatearRecetaParaUI(receta);
        if (!recetaFormateada) return '<p>No hay receta disponible</p>';
        
        let html = `
            <div class="receta-card">
                <div class="receta-header">
                    <h3>${recetaFormateada.nombre}</h3>
                    <div class="receta-meta">
                        <span class="tiempo">⏱ ${recetaFormateada.tiempo}</span>
                        <span class="dificultad">📊 ${recetaFormateada.dificultad}</span>
                        <span class="porciones">🍽 ${recetaFormateada.porciones} ${recetaFormateada.porciones === 1 ? 'porción' : 'porciones'}</span>
                    </div>
                </div>
                
                <div class="receta-nutricion">
                    <div class="nutricion-item">
                        <span class="label">Calorías:</span>
                        <span class="value">${recetaFormateada.nutricion.calorias}</span>
                    </div>
                    <div class="nutricion-item">
                        <span class="label">Proteínas:</span>
                        <span class="value">${recetaFormateada.nutricion.proteinas}</span>
                    </div>
                    <div class="nutricion-item">
                        <span class="label">Carbohidratos:</span>
                        <span class="value">${recetaFormateada.nutricion.carbohidratos}</span>
                    </div>
                    <div class="nutricion-item">
                        <span class="label">Grasas:</span>
                        <span class="value">${recetaFormateada.nutricion.grasas}</span>
                    </div>
                </div>
                
                <div class="receta-ingredientes">
                    <h4>Ingredientes:</h4>
                    <ul>
                        ${recetaFormateada.ingredientes.map(ing => `<li>${ing}</li>`).join('')}
                    </ul>
                </div>
                
                <div class="receta-instrucciones">
                    <h4>Instrucciones:</h4>
                    <ol>
                        ${recetaFormateada.instrucciones.map(paso => `<li>${paso}</li>`).join('')}
                    </ol>
                </div>
                
                <div class="receta-tags">
                    ${recetaFormateada.tags.map(tag => `<span class="tag">${tag}</span>`).join('')}
                </div>
            </div>
        `;
        
        return html;
    }
    
    /**
     * Generar HTML para plan diario completo
     */
    generarHTMLPlanDiario(planDiario) {
        const nombresComidas = {
            desayuno: 'Desayuno',
            media_manana: 'Media Mañana',
            comida: 'Comida',
            merienda: 'Merienda',
            cena: 'Cena'
        };
        
        let html = `
            <div class="plan-diario">
                <div class="plan-header">
                    <h2>Plan del Día - ${planDiario.fecha}</h2>
                    <div class="plan-totales">
                        <span>Objetivo: ${planDiario.kcal_objetivo} kcal</span>
                        <span>|</span>
                        <span>Total: ${planDiario.totales.kcal} kcal</span>
                        <span>|</span>
                        <span>Proteínas: ${planDiario.totales.proteinas}g</span>
                        <span>|</span>
                        <span>Carbohidratos: ${planDiario.totales.carbohidratos}g</span>
                        <span>|</span>
                        <span>Grasas: ${planDiario.totales.grasas}g</span>
                    </div>
                </div>
                
                <div class="comidas-container">
        `;
        
        for (let tipoComida in planDiario.comidas) {
            const comida = planDiario.comidas[tipoComida];
            html += `
                <div class="comida-section">
                    <h3 class="comida-titulo">${nombresComidas[tipoComida]}</h3>
                    <div class="comida-objetivo">
                        <span>Objetivo: ${comida.kcal_objetivo} kcal</span>
                        <span>Real: ${comida.kcal_real} kcal</span>
                    </div>
                    ${this.generarHTMLReceta(comida.receta)}
                </div>
            `;
        }
        
        html += `
                </div>
            </div>
        `;
        
        return html;
    }
    
    /**
     * Exportar plan a formato JSON
     */
    exportarPlanJSON(plan) {
        return JSON.stringify(plan, null, 2);
    }
    
    /**
     * Crear lista de compras a partir de un plan
     */
    generarListaCompras(planDiario) {
        const listaCompras = {};
        
        for (let tipoComida in planDiario.comidas) {
            const receta = planDiario.comidas[tipoComida].receta;
            
            for (let ingrediente of receta.ingredientes) {
                const nombre = ingrediente.nombre;
                const cantidad = ingrediente.cantidad;
                const unidad = ingrediente.unidad;
                
                if (!listaCompras[nombre]) {
                    listaCompras[nombre] = {
                        cantidad: 0,
                        unidad: unidad
                    };
                }
                
                if (typeof cantidad === 'number') {
                    listaCompras[nombre].cantidad += cantidad;
                }
            }
        }
        
        return listaCompras;
    }
}

// Exportar para uso en otros módulos
if (typeof module !== 'undefined' && module.exports) {
    module.exports = RecipeBasedMealGenerator;
}
