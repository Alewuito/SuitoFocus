import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Plus, Check, CalendarDays, ListChecks, CheckCircle2, XCircle, Flame, Circle } from 'lucide-react'
import { useTodos } from '../../context/TodoContext'
import useLocalStorage from '../../hooks/useLocalStorage'
import './DayDrawer.css'

export default function DayDrawer({ isOpen, onClose, selectedDate, habits }) {
  const { todos, addTodo, toggleTodo, removeTodo, dietCompliance, toggleDiet } = useTodos()
  const [input, setInput] = useState('')

  if (!selectedDate) return null

  const dayTodos = todos.filter(t => t.date === selectedDate)
  const dietStatus = dietCompliance[selectedDate]

  const addTask = () => {
    if (!input.trim()) return
    addTodo(input.trim(), selectedDate)
    setInput('')
  }

  const formatDate = (dateStr) => {
    return new Date(dateStr + 'T12:00:00').toLocaleDateString('es-ES', {
      weekday: 'long', day: 'numeric', month: 'long'
    })
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            className="drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />
          <motion.aside
            className="day-drawer"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 30, stiffness: 300 }}
          >
            {/* Header */}
            <div className="day-drawer__header">
              <div>
                <div className="day-drawer__date-label">
                  <CalendarDays size={16} />
                  <span>Detalle del día</span>
                </div>
                <h2 className="day-drawer__date">{formatDate(selectedDate)}</h2>
              </div>
              <button className="day-drawer__close" onClick={onClose}><X size={20} /></button>
            </div>

            {/* Tasks */}
            <div className="day-drawer__section">
              <h3 className="day-drawer__section-title"><ListChecks size={15} /> Tareas del día</h3>
              <div className="day-drawer__list">
                <AnimatePresence>
                  {dayTodos.map(t => (
                    <motion.div
                      key={t.id}
                      className={`day-drawer__task ${t.done ? 'day-drawer__task--done' : ''}`}
                      initial={{ opacity: 0, y: -8 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      layout
                    >
                      <button
                        className={`day-drawer__check ${t.done ? 'day-drawer__check--done' : ''}`}
                        onClick={() => toggleTodo(t.id)}
                      >
                        {t.done && <Check size={11} />}
                      </button>
                      <span className="day-drawer__task-text">{t.text}</span>
                      <button className="day-drawer__delete" onClick={() => removeTodo(t.id)}><X size={14} /></button>
                    </motion.div>
                  ))}
                </AnimatePresence>
                {dayTodos.length === 0 && <p className="day-drawer__empty">Sin tareas para este día</p>}
              </div>
              <div className="day-drawer__input-row">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && addTask()}
                  placeholder="Añadir tarea..."
                  className="day-drawer__input"
                />
                <button className="day-drawer__add" onClick={addTask}><Plus size={16} /></button>
              </div>
            </div>

            {/* Habits */}
            <div className="day-drawer__section">
              <h3 className="day-drawer__section-title"><Flame size={15} /> Hábitos ({habits.filter(h => h.dates?.[selectedDate]).length}/{habits.length})</h3>
              {habits.length > 0 ? (
                <div className="day-drawer__list">
                  {habits.map(h => {
                    const done = h.dates?.[selectedDate]
                    return (
                      <div key={h.id} className={`day-drawer__habit ${done ? 'day-drawer__habit--done' : ''}`}>
                        {done ? <CheckCircle2 size={14} /> : <Circle size={14} />}
                        <span>{h.text}</span>
                      </div>
                    )
                  })}
                </div>
              ) : (
                <p className="day-drawer__empty">No hay hábitos registrados</p>
              )}
            </div>

            {/* Diet */}
            <div className="day-drawer__section">
              <h3 className="day-drawer__section-title"><CheckCircle2 size={15} /> Cumplimiento de dieta</h3>
              <div className="day-drawer__diet-btns">
                <button
                  className={`day-drawer__diet-btn ${dietStatus === 'good' ? 'day-drawer__diet-btn--good' : ''}`}
                  onClick={() => toggleDiet(selectedDate, 'good')}
                >
                  <CheckCircle2 size={15} /> Cumplida
                </button>
                <button
                  className={`day-drawer__diet-btn ${dietStatus === 'bad' ? 'day-drawer__diet-btn--bad' : ''}`}
                  onClick={() => toggleDiet(selectedDate, 'bad')}
                >
                  <XCircle size={15} /> No cumplida
                </button>
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  )
}
