import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Flame, Check, Plus, X } from 'lucide-react'
import useLocalStorage from '../../hooks/useLocalStorage'
import Card from '../ui/Card'
import './Widgets.css'

export default function HabitWidget() {
  const [habits, setHabits] = useLocalStorage('sf_habits', [])
  const [input, setInput] = useState('')

  const today = new Date().toISOString().slice(0, 10)

  const add = () => {
    if (!input.trim()) return
    setHabits(prev => [...prev, { id: Date.now(), text: input.trim(), dates: {} }])
    setInput('')
  }

  const toggleDay = (id) => {
    setHabits(prev => prev.map(h => {
      if (h.id !== id) return h
      const dates = { ...h.dates }
      dates[today] = !dates[today]
      return { ...h, dates }
    }))
  }

  const remove = (id) => setHabits(prev => prev.filter(h => h.id !== id))

  const getStreak = (h) => {
    let streak = 0
    const d = new Date()
    while (true) {
      const key = d.toISOString().slice(0, 10)
      if (h.dates[key]) { streak++; d.setDate(d.getDate() - 1) } else break
    }
    return streak
  }

  return (
    <Card className="widget">
      <div className="widget__header">
        <h3><Flame size={16} className="widget__icon widget__icon--habit" /> Hábitos</h3>
      </div>
      <div className="widget__list">
        <AnimatePresence>
          {habits.map(h => (
            <motion.div
              key={h.id}
              className="habit-item"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              layout
            >
              <button
                className={`habit-check ${h.dates[today] ? 'habit-check--done' : ''}`}
                onClick={() => toggleDay(h.id)}
              >
                {h.dates[today] ? <Check size={12} /> : ''}
              </button>
              <span className="habit-text">{h.text}</span>
              {getStreak(h) > 0 && (
                <span className="habit-streak">
                  <Flame size={12} /> {getStreak(h)}
                </span>
              )}
              <button className="todo-delete" onClick={() => remove(h.id)}><X size={14} /></button>
            </motion.div>
          ))}
        </AnimatePresence>
        {habits.length === 0 && <p className="widget__empty">Añade un hábito para hacer seguimiento</p>}
      </div>
      <div className="widget__input-row">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && add()}
          placeholder="Nuevo hábito..."
          className="widget__input"
        />
        <button className="widget__btn widget__btn--accent" onClick={add}><Plus size={16} /></button>
      </div>
    </Card>
  )
}
