import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Sprout, Dumbbell, Zap, CookingPot, ChefHat, CircleCheck, CircleX, ArrowLeft, ArrowRight, Check } from 'lucide-react'
import { useUser } from '../../context/UserContext'
import Button from '../ui/Button'
import './OnboardingWizard.css'

const TOTAL_STEPS = 7

export default function OnboardingWizard() {
  const [step, setStep] = useState(1)
  const [dir, setDir] = useState(1)
  const [form, setForm] = useState({
    name: '', age: '', gender: '', weight: '', height: '',
    targetWeight: '', targetDate: '',
    activityLevel: '', goal: '', dietType: 'balanced', dietExperience: '',
    cookingTime: '', hasAirfryer: '',
    supplements: [],
    allergens: [], otherAllergens: '', dislikedFoods: '', preferredFoods: '',
  })
  const { createUser } = useUser()
  const navigate = useNavigate()

  const set = (field, value) => setForm(prev => ({ ...prev, [field]: value }))
  const toggleArr = (field, val) => setForm(prev => ({
    ...prev,
    [field]: prev[field].includes(val) ? prev[field].filter(v => v !== val) : [...prev[field], val]
  }))

  const next = () => { if (step < TOTAL_STEPS) { setDir(1); setStep(s => s + 1) } }
  const prev = () => { if (step > 1) { setDir(-1); setStep(s => s - 1) } }

  const finish = () => {
    createUser({
      name: form.name,
      age: Number(form.age),
      gender: form.gender,
      weight: Number(form.weight),
      height: Number(form.height),
      targetWeight: form.targetWeight ? Number(form.targetWeight) : null,
      targetDate: form.targetDate || null,
      activityLevel: form.activityLevel,
      goal: form.goal,
      dietType: form.dietType,
      dietExperience: form.dietExperience,
      cookingTime: form.cookingTime,
      hasAirfryer: form.hasAirfryer === 'yes',
      supplements: form.supplements,
      allergens: form.allergens,
      dislikedFoods: form.dislikedFoods.split(',').map(s => s.trim()).filter(Boolean),
      preferredFoods: form.preferredFoods.split(',').map(s => s.trim()).filter(Boolean),
    })
    navigate('/dashboard')
  }

  const slideVariants = {
    enter: (d) => ({ x: d > 0 ? 300 : -300, opacity: 0 }),
    center: { x: 0, opacity: 1 },
    exit: (d) => ({ x: d > 0 ? -300 : 300, opacity: 0 }),
  }

  const RadioGroup = ({ name, options, value }) => (
    <div className="ob-radio-group">
      {options.map(o => (
        <label key={o.value} className={`ob-radio ${value === o.value ? 'ob-radio--active' : ''}`}>
          <input type="radio" name={name} value={o.value} checked={value === o.value}
            onChange={(e) => set(name === 'activity-level' ? 'activityLevel' : name === 'has-airfryer' ? 'hasAirfryer' : name === 'cooking-time' ? 'cookingTime' : name === 'diet-experience' ? 'dietExperience' : name, e.target.value)} />
          <div className="ob-radio__content">
            <strong>{o.icon && <span className="ob-radio__icon">{o.icon}</span>}{o.label}</strong>
            {o.desc && <span>{o.desc}</span>}
          </div>
        </label>
      ))}
    </div>
  )

  const renderStep = () => {
    switch (step) {
      case 1: return (
        <div className="ob-step">
          <h2>Información Básica</h2>
          <p className="ob-subtitle">Cuéntanos un poco sobre ti</p>
          <div className="ob-field">
            <label>Nombre *</label>
            <input value={form.name} onChange={e => set('name', e.target.value)} placeholder="Tu nombre" />
          </div>
          <div className="ob-row">
            <div className="ob-field"><label>Edad *</label><input type="number" value={form.age} onChange={e => set('age', e.target.value)} placeholder="25" min="15" max="100" /></div>
            <div className="ob-field"><label>Sexo *</label>
              <select value={form.gender} onChange={e => set('gender', e.target.value)}>
                <option value="">Selecciona...</option>
                <option value="male">Masculino</option>
                <option value="female">Femenino</option>
                <option value="other">Otro</option>
              </select>
            </div>
          </div>
          <div className="ob-row">
            <div className="ob-field"><label>Peso actual (kg) *</label><input type="number" value={form.weight} onChange={e => set('weight', e.target.value)} placeholder="70" step="0.1" /></div>
            <div className="ob-field"><label>Altura (cm) *</label><input type="number" value={form.height} onChange={e => set('height', e.target.value)} placeholder="170" /></div>
          </div>
          <div className="ob-row">
            <div className="ob-field"><label>Peso objetivo (kg)</label><input type="number" value={form.targetWeight} onChange={e => set('targetWeight', e.target.value)} placeholder="65" step="0.1" /><small>Déjalo vacío para mantener peso</small></div>
            <div className="ob-field"><label>Fecha objetivo</label><input type="date" value={form.targetDate} onChange={e => set('targetDate', e.target.value)} /></div>
          </div>
        </div>
      )
      case 2: return (
        <div className="ob-step">
          <h2>Nivel de Actividad</h2>
          <p className="ob-subtitle">¿Cuánto ejercicio haces normalmente?</p>
          <RadioGroup name="activity-level" value={form.activityLevel} options={[
            { value: 'sedentary', label: 'Sedentario', desc: 'Poco o ningún ejercicio' },
            { value: 'light', label: 'Ligero', desc: 'Ejercicio 1-3 días/semana' },
            { value: 'moderate', label: 'Moderado', desc: 'Ejercicio 3-5 días/semana' },
            { value: 'active', label: 'Activo', desc: 'Ejercicio 6-7 días/semana' },
            { value: 'very_active', label: 'Muy Activo', desc: 'Ejercicio intenso + trabajo físico' },
          ]} />
        </div>
      )
      case 3: return (
        <div className="ob-step">
          <h2>Tu Objetivo</h2>
          <p className="ob-subtitle">¿Qué quieres lograr?</p>
          <RadioGroup name="goal" value={form.goal} options={[
            { value: 'lose', label: 'Perder Peso', desc: 'Déficit progresivo: 150-550 kcal/día' },
            { value: 'maintain', label: 'Mantener Peso', desc: 'Dieta equilibrada = TDEE exacto' },
            { value: 'gain', label: 'Ganar Peso', desc: 'Superávit progresivo: 100-500 kcal/día' },
          ]} />
          <div className="ob-field" style={{marginTop: '1.5rem'}}>
            <label>Tipo de Dieta</label>
            <select value={form.dietType} onChange={e => set('dietType', e.target.value)}>
              <option value="balanced">Balanceada (40/30/30)</option>
              <option value="high_protein">Alta en Proteína (35/35/30)</option>
              <option value="low_carb">Baja en Carbohidratos (20/30/50)</option>
              <option value="vegetarian">Vegetariana</option>
              <option value="vegan">Vegana</option>
            </select>
          </div>
        </div>
      )
      case 4: return (
        <div className="ob-step">
          <h2>Experiencia con Dietas</h2>
          <p className="ob-subtitle">Esto ajustará la intensidad del cambio calórico</p>
          <RadioGroup name="diet-experience" value={form.dietExperience} options={[
            { value: 'beginner', label: 'Principiante', desc: 'Nunca he seguido una dieta estructurada. Cambios graduales.', icon: <Sprout size={16} /> },
            { value: 'experienced', label: 'Experimentado', desc: 'He seguido dietas antes. Puedo hacer cambios más rápidos.', icon: <Dumbbell size={16} /> },
          ]} />
        </div>
      )
      case 5: return (
        <div className="ob-step">
          <h2>Preferencias de Cocina</h2>
          <p className="ob-subtitle">Personaliza tu plan según tu estilo de vida</p>
          <RadioGroup name="cooking-time" value={form.cookingTime} options={[
            { value: 'quick', label: 'Rápido (10-15 min)', desc: 'Recetas sencillas y express', icon: <Zap size={16} /> },
            { value: 'moderate', label: 'Moderado (20-30 min)', desc: 'Balance entre rapidez y variedad', icon: <CookingPot size={16} /> },
            { value: 'elaborate', label: 'Elaborado (30-45 min)', desc: 'Recetas más complejas y variadas', icon: <ChefHat size={16} /> },
          ]} />
          <h3 style={{marginTop: '2rem', marginBottom: '1rem', fontSize: '1rem'}}>¿Tienes Airfryer?</h3>
          <RadioGroup name="has-airfryer" value={form.hasAirfryer} options={[
            { value: 'yes', label: 'Sí, tengo airfryer', icon: <CircleCheck size={16} /> },
            { value: 'no', label: 'No tengo airfryer', icon: <CircleX size={16} /> },
          ]} />
        </div>
      )
      case 6: return (
        <div className="ob-step">
          <h2>Alérgenos y Restricciones</h2>
          <p className="ob-subtitle">Selecciona todos los que apliquen</p>
          <div className="ob-checks">
            {['Gluten','Lactosa','Frutos Secos','Soja','Huevos','Pescado','Mariscos'].map(a => {
              const val = a.toLowerCase().replace(/ /g,'_')
              return (
                <label key={val} className={`ob-check ${form.allergens.includes(val) ? 'ob-check--active' : ''}`}>
                  <input type="checkbox" checked={form.allergens.includes(val)} onChange={() => toggleArr('allergens', val)} />
                  <span>{a}</span>
                </label>
              )
            })}
          </div>
          <div className="ob-field" style={{marginTop: '1.5rem'}}><label>Alimentos que NO te gustan</label><input value={form.dislikedFoods} onChange={e => set('dislikedFoods', e.target.value)} placeholder="Separa con comas: brócoli, espinacas..." /></div>
          <div className="ob-field"><label>Alimentos FAVORITOS</label><input value={form.preferredFoods} onChange={e => set('preferredFoods', e.target.value)} placeholder="Separa con comas: pollo, arroz..." /></div>
        </div>
      )
      case 7: return (
        <div className="ob-step">
          <h2>¡Todo Listo!</h2>
          <p className="ob-subtitle">Revisa tu información</p>
          <div className="ob-summary">
            <div className="ob-summary__row"><span>Nombre</span><strong>{form.name}</strong></div>
            <div className="ob-summary__row"><span>Edad / Sexo</span><strong>{form.age} años · {form.gender === 'male' ? 'M' : form.gender === 'female' ? 'F' : 'Otro'}</strong></div>
            <div className="ob-summary__row"><span>Peso / Altura</span><strong>{form.weight}kg · {form.height}cm</strong></div>
            <div className="ob-summary__row"><span>Objetivo</span><strong>{form.goal === 'lose' ? 'Perder peso' : form.goal === 'gain' ? 'Ganar peso' : 'Mantener'}</strong></div>
            <div className="ob-summary__row"><span>Actividad</span><strong>{form.activityLevel}</strong></div>
            <div className="ob-summary__row"><span>Dieta</span><strong>{form.dietType}</strong></div>
            {form.allergens.length > 0 && <div className="ob-summary__row"><span>Alérgenos</span><strong>{form.allergens.join(', ')}</strong></div>}
          </div>
        </div>
      )
      default: return null
    }
  }

  return (
    <div className="onboarding">
      <div className="onboarding__orb" />
      <div className="onboarding__container">
        {/* Progress bar */}
        <div className="onboarding__progress">
          <div className="onboarding__progress-fill" style={{ width: `${(step / TOTAL_STEPS) * 100}%` }} />
        </div>
        <span className="onboarding__step-label">Paso {step} de {TOTAL_STEPS}</span>

        {/* Step content */}
        <div className="onboarding__content">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.div
              key={step}
              custom={dir}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
            >
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Actions */}
        <div className="onboarding__actions">
          {step > 1 && <Button variant="ghost" onClick={prev} icon={<ArrowLeft size={16} />}>Anterior</Button>}
          <div style={{ flex: 1 }} />
          {step < TOTAL_STEPS ? (
            <Button onClick={next}>Siguiente <ArrowRight size={16} /></Button>
          ) : (
            <Button onClick={finish} icon={<Check size={16} />}>Crear Perfil</Button>
          )}
        </div>
      </div>
    </div>
  )
}
