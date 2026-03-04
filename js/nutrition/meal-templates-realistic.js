// ===== PLANTILLAS REALISTAS DE COMIDAS =====
// Basado en:
// - Recomendaciones OMS sobre dieta saludable
// - Patrones de alimentación mediterránea y española
// - Artículos científicos sobre nutrición
// - Sentido común de comidas reales

(function() {
    'use strict';

    // ========== DESAYUNOS ==========
    // OMS: 20-25% de calorías diarias
    // Carbohidratos complejos + proteína moderada + fruta
    // NUNCA: Carnes, pescados, legumbres

    const BREAKFAST_TEMPLATES = [
        {
            id: 'breakfast_cereals_dairy',
            name: 'Cereales con lácteo',
            timeOfDay: 'breakfast',
            culturalPattern: 'continental',
            structure: {
                base: {
                    category: 'carbs',
                    options: ['avena', 'cereales_integrales', 'muesli'],
                    portion: [50, 80]  // gramos
                },
                protein: {
                    category: 'proteins',
                    options: ['leche_desnatada', 'yogur_natural', 'yogur_griego', 'kefir'],
                    portion: [200, 300]  // ml o gramos
                },
                fruit: {
                    category: 'fruits',
                    options: ['platano', 'fresas', 'arandanos', 'manzana'],
                    portion: [100, 150]
                },
                extras: {
                    category: 'fats',
                    options: ['nueces', 'almendras', 'semillas_chia'],
                    portion: [10, 20],
                    optional: true
                }
            },
            calorieTarget: { min: 350, max: 500 },
            tags: ['healthy', 'high_fiber', 'quick']
        },

        {
            id: 'breakfast_toast_protein',
            name: 'Tostadas con proteína',
            timeOfDay: 'breakfast',
            culturalPattern: 'mediterranean',
            structure: {
                base: {
                    category: 'carbs',
                    options: ['pan_integral', 'pan_centeno'],
                    portion: [60, 100]  // 2-3 rebanadas
                },
                protein: {
                    category: 'proteins',
                    options: ['huevos', 'queso_fresco', 'jamon_pavo', 'requeson'],
                    portion: [50, 100]  // 1-2 huevos o equivalente
                },
                vegetable: {
                    category: 'vegetables',
                    options: ['tomate', 'aguacate', 'espinacas', 'pimientos'],
                    portion: [50, 100],
                    optional: true
                },
                fat: {
                    category: 'fats',
                    options: ['aceite_oliva', 'aguacate'],
                    portion: [5, 15]
                }
            },
            calorieTarget: { min: 350, max: 500 },
            tags: ['balanced', 'mediterranean', 'savory']
        },

        {
            id: 'breakfast_porridge',
            name: 'Gachas de avena',
            timeOfDay: 'breakfast',
            culturalPattern: 'continental',
            structure: {
                base: {
                    category: 'carbs',
                    options: ['avena'],
                    portion: [50, 80]
                },
                liquid: {
                    category: 'proteins',
                    options: ['leche_desnatada', 'leche_vegetal_avena', 'leche_vegetal_soja'],
                    portion: [200, 300]
                },
                sweetener: {
                    category: 'fruits',
                    options: ['platano', 'manzana', 'datiles', 'pasas'],
                    portion: [50, 100]
                },
                topping: {
                    category: 'fats',
                    options: ['nueces', 'almendras', 'mantequilla_cacahuete'],
                    portion: [10, 20]
                }
            },
            calorieTarget: { min: 350, max: 500 },
            tags: ['warming', 'high_fiber', 'filling']
        },

        {
            id: 'breakfast_yogurt_bowl',
            name: 'Bowl de yogur',
            timeOfDay: 'breakfast',
            culturalPattern: 'modern',
            structure: {
                base: {
                    category: 'proteins',
                    options: ['yogur_griego', 'yogur_natural', 'skyr'],
                    portion: [200, 300]
                },
                fruit: {
                    category: 'fruits',
                    options: ['fresas', 'arandanos', 'kiwi', 'platano'],
                    portion: [100, 150]
                },
                granola: {
                    category: 'carbs',
                    options: ['granola_casera', 'muesli', 'copos_avena'],
                    portion: [30, 50]
                },
                nuts: {
                    category: 'fats',
                    options: ['almendras', 'nueces', 'semillas_chia'],
                    portion: [10, 20]
                }
            },
            calorieTarget: { min: 350, max: 450 },
            tags: ['fresh', 'high_protein', 'antioxidants']
        },

        {
            id: 'breakfast_smoothie',
            name: 'Batido nutritivo',
            timeOfDay: 'breakfast',
            culturalPattern: 'modern',
            structure: {
                liquid: {
                    category: 'proteins',
                    options: ['leche_desnatada', 'leche_vegetal_avena', 'yogur_natural'],
                    portion: [200, 300]
                },
                fruit: {
                    category: 'fruits',
                    options: ['platano', 'fresas', 'mango', 'arandanos'],
                    portion: [150, 200]
                },
                greens: {
                    category: 'vegetables',
                    options: ['espinacas', 'kale'],
                    portion: [30, 50],
                    optional: true
                },
                carbs: {
                    category: 'carbs',
                    options: ['avena', 'quinoa_cocida'],
                    portion: [30, 50]
                },
                healthy_fat: {
                    category: 'fats',
                    options: ['mantequilla_almendras', 'semillas_chia', 'aguacate'],
                    portion: [15, 25]
                }
            },
            calorieTarget: { min: 400, max: 550 },
            tags: ['quick', 'nutrient_dense', 'portable']
        }
    ];

    // ========== MEDIA MAÑANA / MERIENDA ==========
    // OMS: 5-10% de calorías diarias
    // Snacks ligeros, frutas, frutos secos
    // NUNCA: Comidas completas, carnes, pescados

    const SNACK_TEMPLATES = [
        {
            id: 'snack_fruit_nuts',
            name: 'Fruta con frutos secos',
            timeOfDay: 'snack',
            structure: {
                fruit: {
                    category: 'fruits',
                    options: ['manzana', 'platano', 'pera', 'naranja', 'mandarinas'],
                    portion: [120, 180]
                },
                nuts: {
                    category: 'fats',
                    options: ['almendras', 'nueces', 'pistachos', 'anacardos'],
                    portion: [20, 30]  // Un puñado pequeño
                }
            },
            calorieTarget: { min: 150, max: 250 },
            tags: ['simple', 'portable', 'natural']
        },

        {
            id: 'snack_yogurt_fruit',
            name: 'Yogur con fruta',
            timeOfDay: 'snack',
            structure: {
                yogurt: {
                    category: 'proteins',
                    options: ['yogur_natural', 'yogur_griego', 'kefir'],
                    portion: [125, 200]
                },
                fruit: {
                    category: 'fruits',
                    options: ['fresas', 'arandanos', 'kiwi', 'platano'],
                    portion: [80, 120]
                }
            },
            calorieTarget: { min: 120, max: 200 },
            tags: ['light', 'protein', 'probiotic']
        },

        {
            id: 'snack_toast_light',
            name: 'Tostada ligera',
            timeOfDay: 'snack',
            structure: {
                bread: {
                    category: 'carbs',
                    options: ['pan_integral', 'pan_centeno'],
                    portion: [30, 40]  // 1 rebanada
                },
                topping: {
                    category: 'others',
                    options: ['hummus', 'queso_fresco', 'aguacate'],
                    portion: [30, 50]
                },
                vegetable: {
                    category: 'vegetables',
                    options: ['tomate', 'pepino', 'zanahoria'],
                    portion: [30, 50],
                    optional: true
                }
            },
            calorieTarget: { min: 120, max: 200 },
            tags: ['satisfying', 'savory']
        },

        {
            id: 'snack_veggies_hummus',
            name: 'Crudités con hummus',
            timeOfDay: 'snack',
            structure: {
                vegetables: {
                    category: 'vegetables',
                    options: ['zanahoria', 'pepino', 'pimientos', 'apio'],
                    portion: [100, 150]
                },
                dip: {
                    category: 'others',
                    options: ['hummus', 'guacamole'],
                    portion: [40, 60]
                }
            },
            calorieTarget: { min: 100, max: 180 },
            tags: ['low_calorie', 'high_fiber', 'fresh']
        },

        {
            id: 'snack_fruit_only',
            name: 'Pieza de fruta',
            timeOfDay: 'snack',
            structure: {
                fruit: {
                    category: 'fruits',
                    options: ['manzana', 'platano', 'pera', 'naranja', 'kiwi', 'melocoton'],
                    portion: [150, 200]
                }
            },
            calorieTarget: { min: 60, max: 120 },
            tags: ['simple', 'natural', 'low_calorie']
        }
    ];

    // ========== COMIDAS (ALMUERZO) ==========
    // OMS: 30-35% de calorías diarias
    // Comida principal: proteína + carbohidrato + verduras abundantes
    // Patrón mediterráneo

    const LUNCH_TEMPLATES = [
        {
            id: 'lunch_protein_rice_veggies',
            name: 'Proteína con arroz y verduras',
            timeOfDay: 'lunch',
            culturalPattern: 'mediterranean',
            structure: {
                protein: {
                    category: 'proteins',
                    options: ['pollo_pechuga', 'pavo', 'ternera_magra', 'conejo'],
                    portion: [120, 180],
                    cookingMethods: ['plancha', 'horno', 'guisado']
                },
                carbs: {
                    category: 'carbs',
                    options: ['arroz_integral', 'arroz_blanco', 'quinoa'],
                    portion: [80, 120]  // peso en crudo
                },
                vegetables: {
                    category: 'vegetables',
                    options: ['brocoli', 'judias_verdes', 'calabacin', 'pimientos', 'zanahoria'],
                    portion: [200, 300],  // OMS recomienda abundantes verduras
                    count: [2, 3]  // 2-3 tipos diferentes
                },
                fat: {
                    category: 'fats',
                    options: ['aceite_oliva'],
                    portion: [10, 15]
                }
            },
            calorieTarget: { min: 500, max: 700 },
            tags: ['complete', 'balanced', 'traditional']
        },

        {
            id: 'lunch_fish_potato_veggies',
            name: 'Pescado con patata y verduras',
            timeOfDay: 'lunch',
            culturalPattern: 'mediterranean',
            structure: {
                protein: {
                    category: 'proteins',
                    options: ['salmon', 'merluza', 'bacalao', 'lubina', 'dorada'],
                    portion: [150, 200],
                    cookingMethods: ['horno', 'plancha', 'papillote']
                },
                carbs: {
                    category: 'carbs',
                    options: ['patata', 'boniato'],
                    portion: [150, 200],
                    cookingMethods: ['horno', 'cocida']
                },
                vegetables: {
                    category: 'vegetables',
                    options: ['esparragos', 'brocoli', 'espinacas', 'champiñones'],
                    portion: [200, 300],
                    count: [2, 3]
                },
                fat: {
                    category: 'fats',
                    options: ['aceite_oliva'],
                    portion: [10, 15]
                }
            },
            calorieTarget: { min: 500, max: 700 },
            tags: ['omega3', 'heart_healthy', 'mediterranean']
        },

        {
            id: 'lunch_legumes_complete',
            name: 'Legumbres con verduras',
            timeOfDay: 'lunch',
            culturalPattern: 'mediterranean',
            structure: {
                legumes: {
                    category: 'proteins',  // Las legumbres son proteína+carbs
                    options: ['lentejas', 'garbanzos', 'alubias'],
                    portion: [80, 100]  // peso en crudo
                },
                vegetables: {
                    category: 'vegetables',
                    options: ['zanahoria', 'calabacin', 'pimientos', 'tomate', 'cebolla'],
                    portion: [200, 300],
                    count: [3, 4]  // Guisos con muchas verduras
                },
                carbs_extra: {
                    category: 'carbs',
                    options: ['arroz_integral', 'patata'],
                    portion: [50, 80],
                    optional: true
                },
                fat: {
                    category: 'fats',
                    options: ['aceite_oliva'],
                    portion: [10, 15]
                }
            },
            calorieTarget: { min: 500, max: 700 },
            tags: ['vegetarian', 'high_fiber', 'sustainable']
        },

        {
            id: 'lunch_pasta_sauce_protein',
            name: 'Pasta con proteína y verduras',
            timeOfDay: 'lunch',
            culturalPattern: 'mediterranean',
            structure: {
                carbs: {
                    category: 'carbs',
                    options: ['pasta_integral', 'pasta_normal'],
                    portion: [80, 100]  // peso en crudo
                },
                protein: {
                    category: 'proteins',
                    options: ['pollo_pechuga', 'pavo', 'gambas', 'atun'],
                    portion: [100, 150]
                },
                vegetables: {
                    category: 'vegetables',
                    options: ['tomate', 'calabacin', 'berenjena', 'pimientos', 'espinacas'],
                    portion: [150, 250],
                    count: [2, 3]
                },
                fat: {
                    category: 'fats',
                    options: ['aceite_oliva'],
                    portion: [10, 15]
                }
            },
            calorieTarget: { min: 500, max: 700 },
            tags: ['italian', 'versatile', 'filling']
        },

        {
            id: 'lunch_salad_complete',
            name: 'Ensalada completa',
            timeOfDay: 'lunch',
            culturalPattern: 'modern',
            structure: {
                base_vegetables: {
                    category: 'vegetables',
                    options: ['lechuga', 'espinacas', 'rucula', 'kale'],
                    portion: [100, 150]
                },
                vegetables_extra: {
                    category: 'vegetables',
                    options: ['tomate', 'pepino', 'zanahoria', 'pimientos', 'cebolla'],
                    portion: [100, 150],
                    count: [2, 3]
                },
                protein: {
                    category: 'proteins',
                    options: ['pollo_pechuga', 'atun', 'salmon', 'huevos', 'queso_fresco'],
                    portion: [120, 180]
                },
                carbs: {
                    category: 'carbs',
                    options: ['quinoa', 'arroz_integral', 'garbanzos_cocidos', 'pan_integral'],
                    portion: [60, 100]
                },
                fat: {
                    category: 'fats',
                    options: ['aceite_oliva', 'aguacate', 'nueces'],
                    portion: [15, 25]
                }
            },
            calorieTarget: { min: 450, max: 650 },
            tags: ['fresh', 'complete', 'summer']
        },

        {
            id: 'lunch_stew_meat_veggies',
            name: 'Guiso de carne con verduras',
            timeOfDay: 'lunch',
            culturalPattern: 'traditional',
            structure: {
                protein: {
                    category: 'proteins',
                    options: ['ternera_magra', 'pollo_muslos', 'conejo', 'cerdo_magro'],
                    portion: [120, 180],
                    cookingMethods: ['guisado', 'estofado']
                },
                vegetables: {
                    category: 'vegetables',
                    options: ['patata', 'zanahoria', 'calabacin', 'judias_verdes', 'guisantes'],
                    portion: [250, 350],
                    count: [3, 4]
                },
                fat: {
                    category: 'fats',
                    options: ['aceite_oliva'],
                    portion: [10, 15]
                }
            },
            calorieTarget: { min: 500, max: 700 },
            tags: ['warming', 'traditional', 'comfort_food']
        }
    ];

    // ========== CENAS ==========
    // OMS: 25-30% de calorías diarias
    // Más ligera que la comida, evitar carbohidratos pesados
    // Proteína + verduras abundantes

    const DINNER_TEMPLATES = [
        {
            id: 'dinner_fish_veggies',
            name: 'Pescado con verduras',
            timeOfDay: 'dinner',
            culturalPattern: 'mediterranean',
            structure: {
                protein: {
                    category: 'proteins',
                    options: ['merluza', 'bacalao', 'lubina', 'dorada', 'salmon'],
                    portion: [150, 200],
                    cookingMethods: ['plancha', 'horno', 'papillote']
                },
                vegetables: {
                    category: 'vegetables',
                    options: ['esparragos', 'brocoli', 'calabacin', 'pimientos', 'berenjena'],
                    portion: [250, 350],  // Abundantes en la cena
                    count: [2, 3]
                },
                carbs_light: {
                    category: 'carbs',
                    options: ['patata', 'boniato'],
                    portion: [80, 120],  // Menos que en la comida
                    optional: true
                },
                fat: {
                    category: 'fats',
                    options: ['aceite_oliva'],
                    portion: [10, 15]
                }
            },
            calorieTarget: { min: 400, max: 600 },
            tags: ['light', 'digestive', 'omega3']
        },

        {
            id: 'dinner_chicken_salad',
            name: 'Pollo con ensalada',
            timeOfDay: 'dinner',
            culturalPattern: 'modern',
            structure: {
                protein: {
                    category: 'proteins',
                    options: ['pollo_pechuga', 'pavo'],
                    portion: [120, 180],
                    cookingMethods: ['plancha', 'horno']
                },
                salad: {
                    category: 'vegetables',
                    options: ['lechuga', 'tomate', 'pepino', 'zanahoria', 'rucula'],
                    portion: [200, 300],
                    count: [3, 4]
                },
                fat: {
                    category: 'fats',
                    options: ['aceite_oliva', 'aguacate'],
                    portion: [10, 20]
                }
            },
            calorieTarget: { min: 350, max: 550 },
            tags: ['light', 'protein', 'low_carb']
        },

        {
            id: 'dinner_omelette_veggies',
            name: 'Tortilla con verduras',
            timeOfDay: 'dinner',
            culturalPattern: 'spanish',
            structure: {
                protein: {
                    category: 'proteins',
                    options: ['huevos'],
                    portion: [100, 150]  // 2-3 huevos
                },
                vegetables: {
                    category: 'vegetables',
                    options: ['calabacin', 'espinacas', 'champiñones', 'pimientos', 'cebolla'],
                    portion: [150, 250],
                    count: [2, 3]
                },
                carbs_optional: {
                    category: 'carbs',
                    options: ['pan_integral'],
                    portion: [30, 50],
                    optional: true
                },
                fat: {
                    category: 'fats',
                    options: ['aceite_oliva'],
                    portion: [10, 15]
                }
            },
            calorieTarget: { min: 350, max: 500 },
            tags: ['quick', 'economical', 'traditional']
        },

        {
            id: 'dinner_soup_protein',
            name: 'Sopa o crema con proteína',
            timeOfDay: 'dinner',
            culturalPattern: 'traditional',
            structure: {
                soup_base: {
                    category: 'vegetables',
                    options: ['calabaza', 'zanahoria', 'calabacin', 'brocoli', 'champiñones'],
                    portion: [300, 400]
                },
                protein: {
                    category: 'proteins',
                    options: ['pollo_pechuga', 'pavo', 'huevos', 'pescado_blanco'],
                    portion: [80, 120]
                },
                fat: {
                    category: 'fats',
                    options: ['aceite_oliva'],
                    portion: [10, 15]
                }
            },
            calorieTarget: { min: 300, max: 450 },
            tags: ['warming', 'light', 'digestive']
        },

        {
            id: 'dinner_grilled_veggies_protein',
            name: 'Verduras a la plancha con proteína',
            timeOfDay: 'dinner',
            culturalPattern: 'mediterranean',
            structure: {
                vegetables: {
                    category: 'vegetables',
                    options: ['calabacin', 'berenjena', 'pimientos', 'champiñones', 'esparragos'],
                    portion: [250, 350],
                    count: [3, 4],
                    cookingMethods: ['plancha', 'horno']
                },
                protein: {
                    category: 'proteins',
                    options: ['pollo_pechuga', 'pavo', 'salmon', 'merluza'],
                    portion: [120, 180]
                },
                fat: {
                    category: 'fats',
                    options: ['aceite_oliva'],
                    portion: [10, 15]
                }
            },
            calorieTarget: { min: 350, max: 550 },
            tags: ['light', 'grilled', 'colorful']
        },

        {
            id: 'dinner_legumes_light',
            name: 'Legumbres ligeras con verduras',
            timeOfDay: 'dinner',
            culturalPattern: 'mediterranean',
            structure: {
                legumes: {
                    category: 'proteins',
                    options: ['garbanzos', 'lentejas'],
                    portion: [60, 80]  // Menos que en comida
                },
                vegetables: {
                    category: 'vegetables',
                    options: ['espinacas', 'acelgas', 'calabacin', 'tomate'],
                    portion: [200, 300],
                    count: [2, 3]
                },
                fat: {
                    category: 'fats',
                    options: ['aceite_oliva'],
                    portion: [10, 15]
                }
            },
            calorieTarget: { min: 350, max: 500 },
            tags: ['vegetarian', 'fiber', 'light']
        }
    ];

    // ========== RESTRICCIONES POR TIPO DE DIETA ==========
    const DIET_RESTRICTIONS = {
        vegan: {
            excluded_categories: [],
            excluded_ingredients: [
                // Proteínas animales
                'pollo_pechuga', 'pavo', 'ternera_magra', 'cerdo_magro', 'conejo',
                'salmon', 'atun', 'merluza', 'bacalao', 'lubina', 'dorada', 'gambas',
                'huevos',
                // Lácteos
                'leche_desnatada', 'yogur_natural', 'yogur_griego', 'queso_fresco',
                'queso_mozzarella', 'kefir', 'skyr'
            ],
            required_alternatives: {
                protein: ['tofu', 'tempeh', 'lentejas', 'garbanzos', 'alubias', 'quinoa'],
                calcium: ['leche_vegetal_soja', 'leche_vegetal_avena', 'almendras', 'kale']
            }
        },
        vegetarian: {
            excluded_categories: [],
            excluded_ingredients: [
                'pollo_pechuga', 'pavo', 'ternera_magra', 'cerdo_magro', 'conejo',
                'salmon', 'atun', 'merluza', 'bacalao', 'lubina', 'dorada', 'gambas'
            ],
            allowed_animal: ['huevos', 'leche_desnatada', 'yogur_natural', 'queso_fresco']
        },
        pescatarian: {
            excluded_categories: [],
            excluded_ingredients: [
                'pollo_pechuga', 'pavo', 'ternera_magra', 'cerdo_magro', 'conejo'
            ],
            allowed_animal: [
                'salmon', 'atun', 'merluza', 'bacalao', 'lubina', 'dorada', 'gambas',
                'huevos', 'leche_desnatada', 'yogur_natural', 'queso_fresco'
            ]
        },
        low_carb: {
            modifiers: {
                carbs: { multiplier: 0.5 },  // Reducir carbohidratos a la mitad
                protein: { multiplier: 1.3 }, // Aumentar proteína
                fat: { multiplier: 1.2 }      // Aumentar grasas saludables
            },
            priority_ingredients: {
                carbs: ['quinoa', 'boniato', 'avena'],  // Carbohidratos complejos solo
                avoid: ['arroz_blanco', 'pasta_normal', 'pan_blanco']
            }
        },
        high_protein: {
            modifiers: {
                protein: { multiplier: 1.4 },
                carbs: { multiplier: 0.9 }
            },
            priority_ingredients: {
                protein: ['pollo_pechuga', 'pavo', 'salmon', 'atun', 'huevos', 'yogur_griego']
            }
        },
        balanced: {
            // Sin restricciones, distribución equilibrada OMS
            macros: {
                protein: 0.20,  // 20% de calorías
                carbs: 0.50,    // 50% de calorías (carbohidratos complejos)
                fat: 0.30       // 30% de calorías (grasas insaturadas prioritariamente)
            }
        }
    };

    // Exportar al objeto global
    window.REALISTIC_MEAL_TEMPLATES = {
        breakfast: BREAKFAST_TEMPLATES,
        snack: SNACK_TEMPLATES,
        lunch: LUNCH_TEMPLATES,
        dinner: DINNER_TEMPLATES,
        restrictions: DIET_RESTRICTIONS,
        version: '2.0.0-realistic'
    };

    console.log('✓ Plantillas realistas de comidas cargadas (basadas en OMS y evidencia científica)');

})();
