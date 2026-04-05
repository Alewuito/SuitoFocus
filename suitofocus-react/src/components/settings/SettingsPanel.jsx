import { useState } from 'react'
import { motion } from 'framer-motion'
import { useUser } from '../../context/UserContext'
import Button from '../ui/Button'
import Card from '../ui/Card'
import './SettingsPanel.css'

const TABS = [
  { id: 'profile', label: 'Perfil' },
  { id: 'notifications', label: 'Notificaciones' },
  { id: 'data', label: 'Datos' },
]

export default function SettingsPanel() {
  const [tab, setTab] = useState('profile')
  const { currentUser, updateUser } = useUser()
  const [form, setForm] = useState({
    weight: currentUser?.weight || '',
    activityLevel: currentUser?.activityLevel || 'moderate',
    goal: currentUser?.goal || 'maintain',
    dietType: currentUser?.dietType || 'balanced',
  })

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  const saveProfile = () => {
    updateUser({
      weight: Number(form.weight),
      activityLevel: form.activityLevel,
      goal: form.goal,
      dietType: form.dietType,
    })
  }

  const exportData = () => {
    const data = {}
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i)
      if (key.startsWith('sf_') || key.startsWith('suitofocus')) {
        data[key] = JSON.parse(localStorage.getItem(key))
      }
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `suitofocus-backup-${new Date().toISOString().slice(0,10)}.json`
    a.click()
  }

  const resetData = () => {
    if (window.confirm('⚠️ ¿Borrar todos los datos? Esta acción no se puede deshacer.')) {
      localStorage.clear()
      window.location.reload()
    }
  }

  return (
    <motion.div
      className="settings"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h1>Configuración</h1>
      <p className="settings__subtitle">Gestiona tu perfil y preferencias</p>

      <div className="settings__tabs">
        {TABS.map(t => (
          <button
            key={t.id}
            className={`settings__tab ${tab === t.id ? 'settings__tab--active' : ''}`}
            onClick={() => setTab(t.id)}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="settings__content">
        {tab === 'profile' && (
          <Card>
            <h3 style={{ marginBottom: 'var(--space-xl)' }}>Información Personal</h3>
            <div className="settings__field">
              <label>Nombre</label>
              <input value={currentUser?.name || ''} disabled className="settings__input settings__input--disabled" />
            </div>
            <div className="settings__row">
              <div className="settings__field">
                <label>Peso actual (kg)</label>
                <input type="number" value={form.weight} onChange={e => set('weight', e.target.value)} className="settings__input" />
              </div>
              <div className="settings__field">
                <label>Actividad</label>
                <select value={form.activityLevel} onChange={e => set('activityLevel', e.target.value)} className="settings__input">
                  <option value="sedentary">Sedentario</option>
                  <option value="light">Ligero</option>
                  <option value="moderate">Moderado</option>
                  <option value="active">Activo</option>
                  <option value="very_active">Muy activo</option>
                </select>
              </div>
            </div>
            <div className="settings__row">
              <div className="settings__field">
                <label>Objetivo</label>
                <select value={form.goal} onChange={e => set('goal', e.target.value)} className="settings__input">
                  <option value="lose">Perder peso</option>
                  <option value="maintain">Mantener</option>
                  <option value="gain">Ganar peso</option>
                </select>
              </div>
              <div className="settings__field">
                <label>Tipo de dieta</label>
                <select value={form.dietType} onChange={e => set('dietType', e.target.value)} className="settings__input">
                  <option value="balanced">Equilibrada</option>
                  <option value="high_protein">Alta en proteína</option>
                  <option value="low_carb">Baja en carbos</option>
                  <option value="vegetarian">Vegetariana</option>
                  <option value="vegan">Vegana</option>
                </select>
              </div>
            </div>
            <div style={{ marginTop: 'var(--space-xl)' }}>
              <Button onClick={saveProfile}>Guardar Cambios</Button>
            </div>
          </Card>
        )}

        {tab === 'notifications' && (
          <Card>
            <h3 style={{ marginBottom: 'var(--space-xl)' }}>Notificaciones</h3>
            {[
              { label: 'Recordatorio diario de plan alimenticio', defaultChecked: true },
              { label: 'Notificaciones de hidratación', defaultChecked: true },
              { label: 'Recordatorio de suplementos', defaultChecked: true },
              { label: 'Alertas sonoras', defaultChecked: false },
            ].map(n => (
              <label key={n.label} className="settings__toggle">
                <input type="checkbox" defaultChecked={n.defaultChecked} />
                <span className="settings__toggle-track"><span className="settings__toggle-thumb" /></span>
                <span>{n.label}</span>
              </label>
            ))}
          </Card>
        )}

        {tab === 'data' && (
          <Card>
            <h3 style={{ marginBottom: 'var(--space-xl)' }}>Gestión de Datos</h3>
            <p style={{ marginBottom: 'var(--space-xl)', fontSize: '0.9rem' }}>Exporta o elimina todos tus datos guardados</p>
            <div className="settings__data-actions">
              <Button variant="outline" onClick={exportData}>Exportar Datos</Button>
              <Button variant="danger" onClick={resetData}>Borrar Todos los Datos</Button>
            </div>
            <div className="settings__app-info">
              <p>SuitoFocus v3.0 React</p>
              <p>Almacenamiento local usado</p>
            </div>
          </Card>
        )}
      </div>
    </motion.div>
  )
}
