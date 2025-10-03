'use client'

import { useState, useEffect } from 'react'

interface CountdownTimerProps {
  prazo?: string
  horaInicio?: string
  status: 'OK' | 'NOK' | 'PENDENTE'
}

export default function CountdownTimer({ prazo, horaInicio, status }: CountdownTimerProps) {
  const [timeLeft, setTimeLeft] = useState('')
  const [isOverdue, setIsOverdue] = useState(false)

  useEffect(() => {
    if (!prazo || !horaInicio || status !== 'PENDENTE') return

    const interval = setInterval(() => {
      const now = new Date()
      const deadline = new Date(prazo)
      const diff = deadline.getTime() - now.getTime()

      if (diff <= 0) {
        setIsOverdue(true)
        const overdue = Math.abs(diff)
        const hours = Math.floor(overdue / (1000 * 60 * 60))
        const minutes = Math.floor((overdue % (1000 * 60 * 60)) / (1000 * 60))
        setTimeLeft(`${hours}h ${minutes}m atrasado`)
      } else {
        setIsOverdue(false)
        const hours = Math.floor(diff / (1000 * 60 * 60))
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
        setTimeLeft(`${hours}h ${minutes}m`)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [prazo, horaInicio, status])

  if (!prazo || !horaInicio || status !== 'PENDENTE') return null

  return (
    <div className={`text-xs px-2 py-1 rounded flex items-center gap-1 ${
      isOverdue 
        ? 'bg-red-100 text-red-700 animate-pulse' 
        : 'bg-blue-100 text-blue-700'
    }`}>
      <span>⏱️</span>
      <span className="font-mono">{timeLeft}</span>
    </div>
  )
}