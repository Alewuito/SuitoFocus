import { useMemo } from 'react'

/**
 * Computes the adjusted calorie target for a given week.
 * 
 * - "lose": -100 kcal per week (max -400 from baseline)
 * - "gain": +75 kcal per week (max +300 from baseline)
 * - "maintain": no adjustment
 * 
 * @param {number} baseCalories - The initial TDEE-based target
 * @param {string} goal - 'lose' | 'maintain' | 'gain'
 * @param {number} week - 1-indexed week number
 * @returns {{ target: number, delta: number, label: string }}
 */
export default function useCalorieProgression(baseCalories, goal, week = 1) {
  return useMemo(() => {
    const weekIndex = Math.max(0, week - 1)

    let delta = 0
    let label = 'Mantenimiento'

    if (goal === 'lose') {
      delta = -Math.min(weekIndex * 100, 400)
      label = delta === 0 ? 'Semana base' : `${delta} kcal (déficit)`
    } else if (goal === 'gain') {
      delta = Math.min(weekIndex * 75, 300)
      label = delta === 0 ? 'Semana base' : `+${delta} kcal (superávit)`
    }

    return {
      target: baseCalories + delta,
      delta,
      label,
    }
  }, [baseCalories, goal, week])
}
