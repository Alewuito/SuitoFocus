import { useState, useMemo, useEffect } from 'react'
import { motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useTodos } from '../../context/TodoContext'
import useLocalStorage from '../../hooks/useLocalStorage'
import Card from '../ui/Card'
import DayDrawer from './DayDrawer'
import './TrackerCalendar.css'

const DAYS_SHORT = ['L', 'M', 'X', 'J', 'V', 'S', 'D']
const MONTHS = ['Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio', 'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre']

function getDaysInMonth(y, m) { return new Date(y, m + 1, 0).getDate() }
function getFirstDayOfWeek(y, m) { const d = new Date(y, m, 1).getDay(); return d === 0 ? 6 : d - 1 }

export default function TrackerCalendar() {
  const now = new Date()
  const [month, setMonth] = useState(now.getMonth())
  const [year, setYear] = useState(now.getFullYear())
  const [selectedDate, setSelectedDate] = useState(null)
  const [hoveredDate, setHoveredDate] = useState(null)
  const [habits] = useLocalStorage('sf_habits', [])
  const { todos, dietCompliance } = useTodos()

  const today = now.toISOString().slice(0, 10)
  const daysInMonth = getDaysInMonth(year, month)
  const firstDay = getFirstDayOfWeek(year, month)

  // Auto-select today on first load
  useEffect(() => {
    setSelectedDate(today)
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1) } else setMonth(m => m - 1) }
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1) } else setMonth(m => m + 1) }

  const cells = useMemo(() => {
    const arr = []
    for (let i = 0; i < firstDay; i++) arr.push(null)
    for (let d = 1; d <= daysInMonth; d++) {
      const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`
      const habitsDone = habits.filter(h => h.dates?.[dateStr]).length
      const habitsTotal = habits.length
      const dietStatus = dietCompliance[dateStr]
      const dayTodos = todos.filter(t => t.date === dateStr)
      const taskCount = dayTodos.length
      const tasksDone = dayTodos.filter(t => t.done).length
      arr.push({ day: d, dateStr, habitsDone, habitsTotal, dietStatus, taskCount, tasksDone, dayTodos, isToday: dateStr === today })
    }
    return arr
  }, [year, month, firstDay, daysInMonth, habits, todos, dietCompliance, today])

  // Tooltip data for hovered cell
  const hoveredCell = hoveredDate ? cells.find(c => c && c.dateStr === hoveredDate) : null

  return (
    <motion.div className="tracker" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
      <div className="tracker__header">
        <div>
          <h1>Seguimiento</h1>
          <p>Calendario de hábitos, tareas y cumplimiento de dieta</p>
        </div>
      </div>

      <Card className="tracker__calendar">
        <div className="tracker__month-nav">
          <button className="tracker__nav-btn" onClick={prevMonth}><ChevronLeft size={18} /></button>
          <h2 className="tracker__month-title">{MONTHS[month]} {year}</h2>
          <button className="tracker__nav-btn" onClick={nextMonth}><ChevronRight size={18} /></button>
        </div>

        <div className="tracker__grid">
          {DAYS_SHORT.map(d => (
            <div key={d} className="tracker__day-header">{d}</div>
          ))}

          {cells.map((cell, i) => {
            if (!cell) return <div key={`empty-${i}`} className="tracker__cell tracker__cell--empty" />

            const habitPct = cell.habitsTotal > 0 ? cell.habitsDone / cell.habitsTotal : 0
            const dietClass = cell.dietStatus === 'good'
              ? 'tracker__cell--diet-good'
              : cell.dietStatus === 'bad'
                ? 'tracker__cell--diet-bad'
                : ''

            return (
              <div
                key={cell.dateStr}
                className="tracker__cell-wrapper"
                onMouseEnter={() => setHoveredDate(cell.dateStr)}
                onMouseLeave={() => setHoveredDate(null)}
              >
                <button
                  className={`tracker__cell ${cell.isToday ? 'tracker__cell--today' : ''} ${selectedDate === cell.dateStr ? 'tracker__cell--selected' : ''} ${dietClass}`}
                  onClick={() => setSelectedDate(cell.dateStr)}
                >
                  <span className="tracker__cell-num">{cell.day}</span>
                  <div className="tracker__cell-dots">
                    {cell.habitsTotal > 0 && (
                      <span className={`tracker__dot ${habitPct === 1 ? 'tracker__dot--full' : habitPct > 0 ? 'tracker__dot--partial' : 'tracker__dot--none'}`} />
                    )}
                    {cell.dietStatus && (
                      <span className={`tracker__dot ${cell.dietStatus === 'good' ? 'tracker__dot--diet-good' : 'tracker__dot--diet-bad'}`} />
                    )}
                    {cell.taskCount > 0 && (
                      <span className="tracker__dot tracker__dot--task" />
                    )}
                  </div>
                </button>

                {/* Tooltip */}
                {hoveredDate === cell.dateStr && (
                  <div className="tracker__tooltip">
                    <div className="tracker__tooltip-date">
                      {new Date(cell.dateStr + 'T12:00:00').toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' })}
                    </div>
                    <div className="tracker__tooltip-row">
                      <span>Tareas</span>
                      <strong>{cell.tasksDone}/{cell.taskCount}</strong>
                    </div>
                    {cell.habitsTotal > 0 && (
                      <div className="tracker__tooltip-row">
                        <span>Hábitos</span>
                        <strong>{cell.habitsDone}/{cell.habitsTotal}</strong>
                      </div>
                    )}
                    <div className="tracker__tooltip-row">
                      <span>Dieta</span>
                      <strong className={cell.dietStatus === 'good' ? 'tooltip--good' : cell.dietStatus === 'bad' ? 'tooltip--bad' : ''}>
                        {cell.dietStatus === 'good' ? 'Cumplida' : cell.dietStatus === 'bad' ? 'Fallida' : '—'}
                      </strong>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>

        <div className="tracker__legend">
          <div className="tracker__legend-item"><span className="tracker__dot tracker__dot--full" /> Hábitos</div>
          <div className="tracker__legend-item"><span className="tracker__dot tracker__dot--partial" /> Parcial</div>
          <div className="tracker__legend-item"><span className="tracker__dot tracker__dot--diet-good" /> Dieta OK</div>
          <div className="tracker__legend-item"><span className="tracker__dot tracker__dot--diet-bad" /> Dieta fallida</div>
          <div className="tracker__legend-item"><span className="tracker__dot tracker__dot--task" /> Tareas</div>
        </div>
      </Card>

      <DayDrawer
        isOpen={!!selectedDate}
        onClose={() => setSelectedDate(null)}
        selectedDate={selectedDate}
        habits={habits}
      />
    </motion.div>
  )
}
