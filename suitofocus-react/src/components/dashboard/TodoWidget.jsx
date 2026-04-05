import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ListChecks, Check, Plus, X, CalendarPlus } from 'lucide-react'
import { useTodos } from '../../context/TodoContext'
import Card from '../ui/Card'
import './Widgets.css'

export default function TodoWidget() {
  const { todos, addTodo, toggleTodo, removeTodo } = useTodos()
  const [input, setInput] = useState('')
  const [dateInput, setDateInput] = useState('')

  const today = new Date().toISOString().slice(0, 10)

  // Show: tasks without date + tasks assigned to today
  const visibleTodos = todos.filter(t => !t.date || t.date === today)

  const add = () => {
    if (!input.trim()) return
    addTodo(input.trim(), dateInput || null)
    setInput('')
    setDateInput('')
  }

  const completedCount = visibleTodos.filter(t => t.done).length

  return (
    <Card className="widget">
      <div className="widget__header">
        <h3><ListChecks size={16} className="widget__icon widget__icon--todo" /> Tareas</h3>
        <span className="widget__badge">{completedCount}/{visibleTodos.length}</span>
      </div>
      <div className="widget__list">
        <AnimatePresence>
          {visibleTodos.map(t => (
            <motion.div
              key={t.id}
              className={`todo-item ${t.done ? 'todo-item--done' : ''}`}
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              layout
            >
              <button className="todo-check" onClick={() => toggleTodo(t.id)}>
                {t.done ? <Check size={12} /> : ''}
              </button>
              <span className="todo-text">{t.text}</span>
              {t.date && <span className="todo-date-tag">{t.date === today ? 'Hoy' : t.date.slice(5)}</span>}
              <button className="todo-delete" onClick={() => removeTodo(t.id)}><X size={14} /></button>
            </motion.div>
          ))}
        </AnimatePresence>
        {visibleTodos.length === 0 && <p className="widget__empty">Sin tareas pendientes</p>}
      </div>
      <div className="widget__input-row">
        <input
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && add()}
          placeholder="Nueva tarea..."
          className="widget__input"
        />
        <input
          type="date"
          value={dateInput}
          onChange={e => setDateInput(e.target.value)}
          className="widget__input widget__input--date"
          title="Asignar a un día (opcional)"
        />
        <button className="widget__btn widget__btn--accent" onClick={add}><Plus size={16} /></button>
      </div>
    </Card>
  )
}
