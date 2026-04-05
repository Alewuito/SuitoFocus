import { useState } from 'react'
import useLocalStorage from '../../hooks/useLocalStorage'
import { Droplets } from 'lucide-react'
import Card from '../ui/Card'
import './Widgets.css'

export default function WaterTracker() {
  const [water, setWater] = useLocalStorage('sf_water', 0)
  const [bottleSize] = useState(500)
  const goal = 2500
  const bottles = Math.ceil(goal / bottleSize)
  const filled = Math.floor(water / bottleSize)
  const partialPct = ((water % bottleSize) / bottleSize) * 100

  const addWater = () => setWater(prev => Math.min(prev + bottleSize, goal + bottleSize))
  const reset = () => setWater(0)

  return (
    <Card className="widget">
      <div className="widget__header">
        <h3><Droplets size={16} className="widget__icon widget__icon--water" /> Hidratación</h3>
        <span className="widget__badge">{water} / {goal} ml</span>
      </div>
      <div className="water__bottles">
        {Array.from({ length: bottles }, (_, i) => (
          <div key={i} className="water__bottle">
            <div className="water__bottle-body">
              <div
                className="water__bottle-fill"
                style={{ height: `${i < filled ? 100 : i === filled ? partialPct : 0}%` }}
              />
            </div>
          </div>
        ))}
      </div>
      <div className="water__actions">
        <button className="widget__btn widget__btn--accent" onClick={addWater}>+ {bottleSize}ml</button>
        <button className="widget__btn" onClick={reset}>Reiniciar</button>
      </div>
    </Card>
  )
}
