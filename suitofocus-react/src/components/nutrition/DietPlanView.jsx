import { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Sunrise, UtensilsCrossed, Apple, Moon, TrendingDown, TrendingUp, Minus, ChevronDown } from 'lucide-react'
import { useUser } from '../../context/UserContext'
import useCalorieProgression from '../../hooks/useCalorieProgression'
import RecipeModal from './RecipeModal'
import Card from '../ui/Card'
import './DietPlanView.css'

const WEEK_DAYS = ['Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado', 'Domingo']
const MEAL_TYPES = [
  { key: 'breakfast', label: 'Desayuno', icon: <Sunrise size={16} />, time: '8:00' },
  { key: 'lunch', label: 'Comida', icon: <UtensilsCrossed size={16} />, time: '14:00' },
  { key: 'snack', label: 'Merienda', icon: <Apple size={16} />, time: '17:00' },
  { key: 'dinner', label: 'Cena', icon: <Moon size={16} />, time: '21:00' },
]

// Recipe database with ingredients and steps
const RECIPES = {
  'Yogur con avena y frutos rojos': {
    time: '10 min',
    macros: { carbs: 45, protein: 18, fat: 8 },
    ingredients: ['200g yogur natural', '40g avena', '100g frutos rojos', '1 cda miel', '10g semillas de chía'],
    steps: ['Coloca el yogur natural en un bol amplio.', 'Añade la avena por encima y mezcla ligeramente.', 'Agrega los frutos rojos lavados y las semillas de chía.', 'Rocía con miel al gusto y sirve inmediatamente.'],
  },
  'Huevos revueltos con espinacas y pan integral': {
    time: '15 min',
    macros: { carbs: 30, protein: 22, fat: 14 },
    ingredients: ['3 huevos', '60g espinacas frescas', '2 rebanadas pan integral', '1 cda aceite de oliva', 'Sal y pimienta'],
    steps: ['Bate los huevos en un bol con sal y pimienta.', 'Calienta aceite en una sartén a fuego medio.', 'Saltea las espinacas 1 minuto hasta que se reduzcan.', 'Añade los huevos y remueve suavemente hasta que cuajen.', 'Sirve sobre las tostadas de pan integral.'],
  },
  'Batido verde: avena, plátano y espinacas': {
    time: '5 min',
    macros: { carbs: 52, protein: 12, fat: 5 },
    ingredients: ['1 plátano maduro', '30g avena', '60g espinacas', '200ml leche semidesnatada', '1 cda mantequilla de cacahuete'],
    steps: ['Pela el plátano y trocéalo.', 'Introduce todos los ingredientes en la batidora.', 'Bate a velocidad alta durante 1 minuto hasta obtener una textura homogénea.', 'Sirve inmediatamente en un vaso alto.'],
  },
  'Pollo al horno con boniato y brócoli': {
    time: '40 min',
    macros: { carbs: 38, protein: 42, fat: 12 },
    ingredients: ['200g pechuga de pollo', '150g boniato', '120g brócoli', '1 cda aceite de oliva', 'Pimentón, ajo en polvo, sal'],
    steps: ['Precalienta el horno a 200°C.', 'Corta el boniato en dados y el brócoli en ramilletes.', 'Sazona el pollo con pimentón, ajo y sal.', 'Distribuye todo en una bandeja, rocía con aceite.', 'Hornea 25-30 minutos hasta que el pollo esté dorado.'],
  },
  'Solomillo de cerdo con patata asada y ensalada': {
    time: '35 min',
    macros: { carbs: 35, protein: 38, fat: 15 },
    ingredients: ['180g solomillo de cerdo', '200g patata', 'Ensalada mixta', '1 cda aceite de oliva', 'Romero, sal, pimienta'],
    steps: ['Corta la patata en rodajas y ásala en el horno a 200°C durante 20 min.', 'Sazona el solomillo con romero, sal y pimienta.', 'Cocínalo a fuego fuerte 3 min por cada lado.', 'Deja reposar 5 minutos, córtalo en medallones.', 'Sirve con la patata y la ensalada aliñada con aceite.'],
  },
  'Lentejas guisadas con verduras y pollo': {
    time: '45 min',
    macros: { carbs: 48, protein: 35, fat: 10 },
    ingredients: ['100g lentejas', '100g pechuga de pollo', '1 zanahoria', '1 patata pequeña', 'Cebolla, ajo, pimentón, laurel'],
    steps: ['Pica la cebolla, zanahoria y patata en dados.', 'Sofríe la cebolla y ajo en aceite.', 'Añade las verduras, las lentejas y cúbrelo con agua.', 'Agrega el pimentón y la hoja de laurel.', 'Cocina a fuego medio 30-35 min. Añade el pollo troceado los últimos 10 min.'],
  },
  'Salmón al eneldo con quinoa': {
    time: '25 min',
    macros: { carbs: 32, protein: 36, fat: 18 },
    ingredients: ['180g salmón fresco', '80g quinoa', 'Eneldo fresco', '1 limón', 'Sal, pimienta, aceite de oliva'],
    steps: ['Cuece la quinoa según las instrucciones del paquete.', 'Sazona el salmón con sal, pimienta y eneldo.', 'Cocina el salmón en sartén a fuego medio 4 min por lado.', 'Exprime el limón sobre el salmón al servir.', 'Acompaña con la quinoa y unas hojas de eneldo fresco.'],
  },
  'Curry de garbanzos con espinacas': {
    time: '30 min',
    macros: { carbs: 42, protein: 18, fat: 14 },
    ingredients: ['200g garbanzos cocidos', '100g espinacas', '100ml leche de coco', '1 cda pasta de curry', 'Cebolla, ajo, jengibre'],
    steps: ['Sofríe cebolla, ajo y jengibre picados.', 'Añade la pasta de curry y cocina 1 minuto.', 'Incorpora los garbanzos y la leche de coco.', 'Cocina a fuego medio 10 minutos.', 'Añade las espinacas y cocina 3 minutos más. Sirve con arroz.'],
  },
  'Merluza al limón con espárragos': {
    time: '20 min',
    macros: { carbs: 12, protein: 32, fat: 10 },
    ingredients: ['200g merluza', '120g espárragos verdes', '1 limón', '1 cda aceite de oliva', 'Sal, pimienta, perejil'],
    steps: ['Corta los espárragos y saltéalos en aceite 3-4 min.', 'Sazona la merluza con sal, pimienta y zumo de limón.', 'Cocina la merluza en la sartén 3 min por lado.', 'Sirve con los espárragos y perejil fresco picado.'],
  },
  'Pasta integral con pesto y pollo': {
    time: '25 min',
    macros: { carbs: 55, protein: 35, fat: 16 },
    ingredients: ['80g pasta integral', '150g pechuga de pollo', '2 cdas pesto', 'Tomates cherry', 'Parmesano rallado'],
    steps: ['Cuece la pasta integral al dente.', 'Cocina el pollo troceado en sartén con un poco de aceite.', 'Escurre la pasta y mézclala con el pesto.', 'Añade el pollo y los tomates cherry cortados.', 'Sirve con parmesano rallado por encima.'],
  },
  'Yogur natural con nueces': {
    time: '3 min',
    macros: { carbs: 15, protein: 12, fat: 14 },
    ingredients: ['150g yogur natural', '20g nueces', '1 cda miel'],
    steps: ['Coloca el yogur en un bol.', 'Trocea las nueces y añádelas.', 'Rocía con miel y sirve.'],
  },
  'Chips de boniato al horno': {
    time: '25 min',
    macros: { carbs: 28, protein: 2, fat: 5 },
    ingredients: ['150g boniato', '1 cda aceite de oliva', 'Pimentón, sal'],
    steps: ['Precalienta el horno a 200°C.', 'Corta el boniato en rodajas finas.', 'Aliña con aceite, pimentón y sal.', 'Hornea 20 min dándoles la vuelta a mitad.'],
  },
  'Garbanzos tostados especiados': {
    time: '30 min',
    macros: { carbs: 30, protein: 10, fat: 6 },
    ingredients: ['200g garbanzos cocidos', '1 cda aceite de oliva', 'Comino, pimentón, sal'],
    steps: ['Precalienta el horno a 200°C.', 'Seca bien los garbanzos con papel de cocina.', 'Mézclalos con aceite y especias.', 'Hornea 25 min hasta que estén crujientes.'],
  },
  'Edamames con sal marina': {
    time: '8 min',
    macros: { carbs: 10, protein: 12, fat: 5 },
    ingredients: ['150g edamames congelados', 'Sal marina gruesa'],
    steps: ['Hierve los edamames en agua con sal 5 minutos.', 'Escurre y espolvorea con sal marina gruesa.', 'Sirve templados.'],
  },
  'Manzana con mantequilla de almendras': {
    time: '3 min',
    macros: { carbs: 22, protein: 4, fat: 10 },
    ingredients: ['1 manzana', '1 cda mantequilla de almendras'],
    steps: ['Corta la manzana en gajos.', 'Sirve con la mantequilla de almendras para mojar.'],
  },
  'Pechuga de pollo en tiras con quinoa': {
    time: '25 min',
    macros: { carbs: 32, protein: 40, fat: 10 },
    ingredients: ['200g pechuga de pollo', '80g quinoa', 'Pimiento rojo', '1 cda salsa de soja', 'Aceite de sésamo'],
    steps: ['Cuece la quinoa según instrucciones.', 'Corta el pollo en tiras y sazona.', 'Saltea en sartén caliente con aceite de sésamo.', 'Añade el pimiento y la salsa de soja.', 'Sirve sobre la quinoa.'],
  },
  'Tortilla francesa con ensalada': {
    time: '10 min',
    macros: { carbs: 8, protein: 20, fat: 16 },
    ingredients: ['3 huevos', 'Ensalada mixta', 'Tomate', '1 cda aceite de oliva', 'Sal y pimienta'],
    steps: ['Bate los huevos con sal y pimienta.', 'Calienta aceite en sartén antiadherente.', 'Vierte los huevos y cocina a fuego medio.', 'Dobla la tortilla cuando cuaje.', 'Sirve con ensalada y tomate aliñado.'],
  },
  'Crema de calabaza con huevo duro': {
    time: '30 min',
    macros: { carbs: 28, protein: 14, fat: 10 },
    ingredients: ['300g calabaza', '1 patata pequeña', '2 huevos', 'Cebolla', 'Sal, nuez moscada, aceite'],
    steps: ['Cuece la calabaza y la patata en trozos con la cebolla.', 'Cuece los huevos 10 min. Pásalos por agua fría y pélalos.', 'Tritura las verduras cocidas con un poco de caldo.', 'Sazona con sal y nuez moscada.', 'Sirve la crema con el huevo cortado por la mitad.'],
  },
  'Ensalada de garbanzos con atún': {
    time: '10 min',
    macros: { carbs: 30, protein: 28, fat: 12 },
    ingredients: ['200g garbanzos', '1 lata atún', 'Tomate', 'Cebolla morada', 'Aceite, vinagre, sal'],
    steps: ['Escurre los garbanzos y el atún.', 'Corta el tomate y la cebolla en dados.', 'Mezcla todo en un bol grande.', 'Aliña con aceite, vinagre y sal al gusto.'],
  },
  'Wok de verduras con gambas': {
    time: '15 min',
    macros: { carbs: 18, protein: 28, fat: 8 },
    ingredients: ['150g gambas peladas', 'Pimiento, calabacín, zanahoria', '1 cda salsa de soja', 'Ajo, jengibre', 'Aceite de sésamo'],
    steps: ['Corta todas las verduras en juliana.', 'Calienta aceite de sésamo en el wok a fuego alto.', 'Saltea el ajo y jengibre 30 segundos.', 'Añade las verduras y saltea 3 minutos.', 'Incorpora las gambas y la salsa de soja. Cocina 3 min más.'],
  },
  'Revuelto de champiñones y espinacas': {
    time: '12 min',
    macros: { carbs: 6, protein: 18, fat: 14 },
    ingredients: ['3 huevos', '100g champiñones', '60g espinacas', 'Ajo', 'Aceite de oliva, sal'],
    steps: ['Lamina los champiñones y pica el ajo.', 'Saltea en aceite hasta que suelten su jugo.', 'Añade las espinacas y cocina 1 minuto.', 'Incorpora los huevos batidos y remueve hasta cuajar.'],
  },
  'Crema de verduras con pechuga a la plancha': {
    time: '30 min',
    macros: { carbs: 22, protein: 35, fat: 10 },
    ingredients: ['150g pechuga de pollo', 'Calabacín, zanahoria, puerro', 'Patata pequeña', 'Aceite, sal, pimienta'],
    steps: ['Cuece las verduras troceadas en agua con sal 20 min.', 'Mientras, cocina la pechuga a la plancha 5 min por lado.', 'Tritura las verduras con un poco de su caldo.', 'Corta el pollo en láminas.', 'Sirve la crema con el pollo por encima.'],
  },
}

function generateSamplePlan(targetKcal, allRecipeKeys) {
  const plan = {}
  const breakfasts = ['Yogur con avena y frutos rojos', 'Huevos revueltos con espinacas y pan integral', 'Batido verde: avena, plátano y espinacas']
  const lunches = ['Pollo al horno con boniato y brócoli', 'Solomillo de cerdo con patata asada y ensalada', 'Lentejas guisadas con verduras y pollo', 'Salmón al eneldo con quinoa', 'Curry de garbanzos con espinacas', 'Merluza al limón con espárragos', 'Pasta integral con pesto y pollo']
  const snacks = ['Yogur natural con nueces', 'Chips de boniato al horno', 'Garbanzos tostados especiados', 'Edamames con sal marina', 'Manzana con mantequilla de almendras']
  const dinners = ['Pechuga de pollo en tiras con quinoa', 'Tortilla francesa con ensalada', 'Crema de calabaza con huevo duro', 'Ensalada de garbanzos con atún', 'Wok de verduras con gambas', 'Revuelto de champiñones y espinacas', 'Crema de verduras con pechuga a la plancha']

  for (let w = 1; w <= 4; w++) {
    plan[`Week${w}`] = {}
    WEEK_DAYS.forEach((day, di) => {
      const dayKcal = targetKcal + Math.round((Math.random() - 0.5) * 60)
      const makeMeal = (arr, idx, pct) => {
        const desc = arr[(di + w + idx) % arr.length]
        return { desc, kcal: Math.round(dayKcal * pct), recipe: RECIPES[desc] || null }
      }
      plan[`Week${w}`][day] = {
        breakfast: makeMeal(breakfasts, 0, 0.25),
        lunch: makeMeal(lunches, 0, 0.35),
        snack: makeMeal(snacks, 0, 0.1),
        dinner: makeMeal(dinners, 0, 0.3),
        totalKcal: dayKcal,
      }
    })
  }
  return plan
}

export default function DietPlanView() {
  const [activeWeek, setActiveWeek] = useState(1)
  const [expandedDay, setExpandedDay] = useState(null)
  const [selectedMeal, setSelectedMeal] = useState(null)
  const { currentUser, calculateTargetCalories } = useUser()
  const baseKcal = currentUser ? calculateTargetCalories(currentUser) : 2000
  const { target: weekKcal, delta, label: progressionLabel } = useCalorieProgression(baseKcal, currentUser?.goal || 'maintain', activeWeek)

  const plan = useMemo(() => generateSamplePlan(weekKcal), [weekKcal])
  const weekData = plan[`Week${activeWeek}`] || {}

  const handleMealClick = (e, meal) => {
    e.stopPropagation()
    if (meal.recipe) setSelectedMeal(meal)
  }

  return (
    <motion.div className="diet" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="diet__header">
        <div>
          <h1>Plan Nutricional</h1>
          <p>Organizado por semanas · {weekKcal} kcal/día objetivo</p>
        </div>
        {delta !== 0 && (
          <div className={`diet__progression ${delta < 0 ? 'diet__progression--deficit' : 'diet__progression--surplus'}`}>
            {delta < 0 ? <TrendingDown size={16} /> : <TrendingUp size={16} />}
            <span>{progressionLabel}</span>
          </div>
        )}
      </div>

      {/* Week tabs */}
      <div className="diet__tabs">
        {[1, 2, 3, 4].map(w => (
          <button
            key={w}
            className={`diet__tab ${activeWeek === w ? 'diet__tab--active' : ''}`}
            onClick={() => { setActiveWeek(w); setExpandedDay(null) }}
          >
            Semana {w}
          </button>
        ))}
      </div>

      {/* Days */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeWeek}
          className="diet__days"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.25 }}
        >
          {WEEK_DAYS.map(day => {
            const dayData = weekData[day]
            if (!dayData) return null
            const isExpanded = expandedDay === day
            return (
              <Card
                key={day}
                className={`diet__day ${isExpanded ? 'diet__day--expanded' : ''}`}
                onClick={() => setExpandedDay(isExpanded ? null : day)}
              >
                <div className="diet__day-header">
                  <h3>{day}</h3>
                  <div className="diet__day-right">
                    <div className="diet__day-kcal">
                      <span className="diet__kcal-value">{dayData.totalKcal}</span>
                      <span className="diet__kcal-unit">kcal</span>
                    </div>
                    <ChevronDown size={16} className={`diet__chevron ${isExpanded ? 'diet__chevron--open' : ''}`} />
                  </div>
                </div>

                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      className="diet__meals"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3 }}
                    >
                      {MEAL_TYPES.map(mt => {
                        const meal = dayData[mt.key]
                        if (!meal) return null
                        const hasRecipe = !!meal.recipe
                        return (
                          <div
                            key={mt.key}
                            className={`diet__meal ${hasRecipe ? 'diet__meal--clickable' : ''}`}
                            onClick={(e) => hasRecipe && handleMealClick(e, meal)}
                          >
                            <div className="diet__meal-icon">{mt.icon}</div>
                            <div className="diet__meal-info">
                              <div className="diet__meal-top">
                                <span className="diet__meal-type">{mt.label}</span>
                                <span className="diet__meal-time">{mt.time}</span>
                              </div>
                              <p className="diet__meal-desc">{meal.desc}</p>
                            </div>
                            <span className="diet__meal-kcal">{meal.kcal} kcal</span>
                          </div>
                        )
                      })}
                    </motion.div>
                  )}
                </AnimatePresence>
              </Card>
            )
          })}
        </motion.div>
      </AnimatePresence>

      {/* Recipe Modal */}
      <RecipeModal
        isOpen={!!selectedMeal}
        onClose={() => setSelectedMeal(null)}
        meal={selectedMeal}
      />
    </motion.div>
  )
}
