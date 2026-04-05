import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { TrendingDown, TrendingUp, Minus } from 'lucide-react'
import { useUser } from '../../context/UserContext'
import useLocalStorage from '../../hooks/useLocalStorage'
import Card from '../ui/Card'
import WaterTracker from './WaterTracker'
import TodoWidget from './TodoWidget'
import HabitWidget from './HabitWidget'
import NotesWidget from './NotesWidget'
import './Dashboard.css'

export default function Dashboard() {
  const { currentUser, calculateTargetCalories } = useUser()
  const [clock, setClock] = useState('')

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      setClock(now.toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit', second: '2-digit' }))
    }
    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [])

  const greeting = () => {
    const h = new Date().getHours()
    if (h < 12) return 'Buenos días'
    if (h < 20) return 'Buenas tardes'
    return 'Buenas noches'
  }

  const targetKcal = currentUser ? calculateTargetCalories(currentUser) : 2000

  return (
    <motion.div
      className="dashboard"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
    >
      {/* Header */}
      <div className="dashboard__header">
        <div>
          <h1>{greeting()}{currentUser ? `, ${currentUser.name}` : ''}</h1>
          <p className="dashboard__clock">{clock}</p>
        </div>
        <div className="dashboard__stats">
          <Card className="dashboard__stat-card">
            <span className="dashboard__stat-value">{targetKcal}</span>
            <span className="dashboard__stat-label">kcal objetivo</span>
          </Card>
          <Card className="dashboard__stat-card">
            <span className="dashboard__stat-value">{currentUser?.weight || '—'}</span>
            <span className="dashboard__stat-label">kg actual</span>
          </Card>
          <Card className="dashboard__stat-card">
            <span className="dashboard__stat-value">{currentUser?.goal === 'lose' ? <TrendingDown size={22} /> : currentUser?.goal === 'gain' ? <TrendingUp size={22} /> : <Minus size={22} />}</span>
            <span className="dashboard__stat-label">{currentUser?.goal === 'lose' ? 'Perder' : currentUser?.goal === 'gain' ? 'Ganar' : 'Mantener'}</span>
          </Card>
        </div>
      </div>

      {/* Widget Grid */}
      <div className="dashboard__grid">
        <WaterTracker />
        <TodoWidget />
        <HabitWidget />
        <NotesWidget />
      </div>
    </motion.div>
  )
}
