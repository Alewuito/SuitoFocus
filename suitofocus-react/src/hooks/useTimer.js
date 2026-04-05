import { useState, useEffect, useCallback, useRef } from 'react'

export default function useTimer(defaultMinutes = 25) {
  const [totalSeconds, setTotalSeconds] = useState(defaultMinutes * 60)
  const [timeLeft, setTimeLeft] = useState(defaultMinutes * 60)
  const [isRunning, setIsRunning] = useState(false)
  const [isComplete, setIsComplete] = useState(false)
  const intervalRef = useRef(null)

  const progress = totalSeconds > 0 ? 1 - timeLeft / totalSeconds : 0

  useEffect(() => {
    if (isRunning && timeLeft > 0) {
      intervalRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(intervalRef.current)
            setIsRunning(false)
            setIsComplete(true)
            return 0
          }
          return prev - 1
        })
      }, 1000)
    }
    return () => clearInterval(intervalRef.current)
  }, [isRunning, timeLeft])

  const start = useCallback(() => {
    if (timeLeft > 0) {
      setIsRunning(true)
      setIsComplete(false)
    }
  }, [timeLeft])

  const pause = useCallback(() => {
    setIsRunning(false)
  }, [])

  const toggle = useCallback(() => {
    if (isRunning) pause()
    else start()
  }, [isRunning, pause, start])

  const reset = useCallback(() => {
    clearInterval(intervalRef.current)
    setIsRunning(false)
    setIsComplete(false)
    setTimeLeft(totalSeconds)
  }, [totalSeconds])

  const setMinutes = useCallback((mins) => {
    clearInterval(intervalRef.current)
    const secs = mins * 60
    setTotalSeconds(secs)
    setTimeLeft(secs)
    setIsRunning(false)
    setIsComplete(false)
  }, [])

  const minutes = Math.floor(timeLeft / 60)
  const seconds = timeLeft % 60
  const display = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`

  return { display, minutes, seconds, timeLeft, totalSeconds, isRunning, isComplete, progress, start, pause, toggle, reset, setMinutes }
}
