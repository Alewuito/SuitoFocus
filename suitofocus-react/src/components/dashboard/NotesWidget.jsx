import { FileText } from 'lucide-react'
import useLocalStorage from '../../hooks/useLocalStorage'
import Card from '../ui/Card'
import './Widgets.css'

export default function NotesWidget() {
  const [notes, setNotes] = useLocalStorage('sf_notes', '')

  return (
    <Card className="widget">
      <div className="widget__header">
        <h3><FileText size={16} className="widget__icon widget__icon--notes" /> Notas</h3>
      </div>
      <textarea
        className="notes__textarea"
        value={notes}
        onChange={e => setNotes(e.target.value)}
        placeholder="Escribe tus notas aquí..."
      />
    </Card>
  )
}
