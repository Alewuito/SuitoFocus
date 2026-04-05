import { createContext, useContext, useState, useEffect, useCallback } from 'react'

const UserContext = createContext(null)

const USERS_KEY = 'suitofocus_users'
const CURRENT_USER_KEY = 'suitofocus_current_user'

export function UserProvider({ children }) {
  const [users, setUsers] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(USERS_KEY)) || []
    } catch { return [] }
  })
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem(CURRENT_USER_KEY)) || null
    } catch { return null }
  })

  useEffect(() => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users))
  }, [users])

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser))
    } else {
      localStorage.removeItem(CURRENT_USER_KEY)
    }
  }, [currentUser])

  const createUser = useCallback((userData) => {
    const newUser = {
      id: Date.now().toString(36) + Math.random().toString(36).slice(2),
      createdAt: new Date().toISOString(),
      ...userData,
    }
    setUsers(prev => [...prev, newUser])
    setCurrentUser(newUser)
    return newUser
  }, [])

  const updateUser = useCallback((updates) => {
    setCurrentUser(prev => {
      const updated = { ...prev, ...updates }
      setUsers(all => all.map(u => u.id === updated.id ? updated : u))
      return updated
    })
  }, [])

  const loginUser = useCallback((userId) => {
    const user = users.find(u => u.id === userId)
    if (user) setCurrentUser(user)
    return user
  }, [users])

  const logoutUser = useCallback(() => {
    setCurrentUser(null)
  }, [])

  const deleteUser = useCallback((userId) => {
    setUsers(prev => prev.filter(u => u.id !== userId))
    if (currentUser?.id === userId) setCurrentUser(null)
  }, [currentUser])

  const calculateTDEE = useCallback((user) => {
    if (!user) return 2000
    const { weight, height, age, gender, activityLevel } = user
    // Mifflin-St Jeor
    let bmr = 10 * weight + 6.25 * height - 5 * age
    bmr += gender === 'male' ? 5 : -161
    const multipliers = { sedentary: 1.2, light: 1.375, moderate: 1.55, active: 1.725, very_active: 1.9 }
    return Math.round(bmr * (multipliers[activityLevel] || 1.2))
  }, [])

  const calculateTargetCalories = useCallback((user) => {
    if (!user) return 2000
    const tdee = calculateTDEE(user)
    const { goal, dietExperience } = user
    const offset = dietExperience === 'experienced' ? 400 : 200
    if (goal === 'lose') return tdee - offset
    if (goal === 'gain') return tdee + offset
    return tdee
  }, [calculateTDEE])

  return (
    <UserContext.Provider value={{
      users, currentUser, createUser, updateUser, loginUser, logoutUser, deleteUser,
      calculateTDEE, calculateTargetCalories
    }}>
      {children}
    </UserContext.Provider>
  )
}

export function useUser() {
  const ctx = useContext(UserContext)
  if (!ctx) throw new Error('useUser must be inside UserProvider')
  return ctx
}
