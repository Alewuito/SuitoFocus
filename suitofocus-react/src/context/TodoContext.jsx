import { createContext, useContext, useCallback } from 'react'
import useLocalStorage from '../hooks/useLocalStorage'

/**
 * TodoContext — Global bidirectional state for tasks.
 * 
 * Architecture choice: Context API (not Zustand/Redux) because:
 * - The app is small-to-medium scale
 * - Only ~2 consumers (TodoWidget + DayDrawer) need this state
 * - No complex async operations or middleware needed
 * - Keeps zero extra dependencies
 * 
 * Every todo has: { id, text, done, date? }
 * - date is optional. If set, the task is assigned to that day.
 * - TodoWidget shows: tasks without date + tasks for today
 * - DayDrawer shows: tasks for the selected date only
 */
const TodoContext = createContext(null)

export function TodoProvider({ children }) {
  const [todos, setTodos] = useLocalStorage('sf_todos', [])
  const [dietCompliance, setDietCompliance] = useLocalStorage('sf_diet_compliance', {})

  const addTodo = useCallback((text, date = null) => {
    setTodos(prev => [...prev, { id: Date.now(), text: text.trim(), done: false, ...(date && { date }) }])
  }, [setTodos])

  const toggleTodo = useCallback((id) => {
    setTodos(prev => prev.map(t => t.id === id ? { ...t, done: !t.done } : t))
  }, [setTodos])

  const removeTodo = useCallback((id) => {
    setTodos(prev => prev.filter(t => t.id !== id))
  }, [setTodos])

  const getTodosForDate = useCallback((dateStr) => {
    return todos.filter(t => t.date === dateStr)
  }, [todos])

  const toggleDiet = useCallback((dateStr, status) => {
    setDietCompliance(prev => {
      const next = { ...prev }
      if (next[dateStr] === status) delete next[dateStr]
      else next[dateStr] = status
      return next
    })
  }, [setDietCompliance])

  return (
    <TodoContext.Provider value={{
      todos,
      dietCompliance,
      addTodo,
      toggleTodo,
      removeTodo,
      getTodosForDate,
      toggleDiet,
    }}>
      {children}
    </TodoContext.Provider>
  )
}

export function useTodos() {
  const ctx = useContext(TodoContext)
  if (!ctx) throw new Error('useTodos must be used within TodoProvider')
  return ctx
}
