'use client'

import { useState, useEffect } from 'react'

interface DashboardStats {
  solicitados: number
  ganhos: number
  perdas: number
  cancelados: number
  pendentes: number
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    solicitados: 0,
    ganhos: 0,
    perdas: 0,
    cancelados: 0,
    pendentes: 0
  })

  useEffect(() => {
    setStats({
      solicitados: 45,
      ganhos: 32,
      perdas: 8,
      cancelados: 3,
      pendentes: 12
    })
  }, [])

  return (
    <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
      <div className="bg-blue-100 p-4 rounded-lg text-center">
        <h3 className="text-lg font-semibold text-blue-800">Solicitados</h3>
        <p className="text-2xl font-bold text-blue-600">{stats.solicitados}</p>
      </div>
      
      <div className="bg-green-100 p-4 rounded-lg text-center">
        <h3 className="text-lg font-semibold text-green-800">Ganhos</h3>
        <p className="text-2xl font-bold text-green-600">{stats.ganhos}</p>
      </div>
      
      <div className="bg-red-100 p-4 rounded-lg text-center">
        <h3 className="text-lg font-semibold text-red-800">Perdas</h3>
        <p className="text-2xl font-bold text-red-600">{stats.perdas}</p>
      </div>
      
      <div className="bg-orange-100 p-4 rounded-lg text-center">
        <h3 className="text-lg font-semibold text-orange-800">Cancelados</h3>
        <p className="text-2xl font-bold text-orange-600">{stats.cancelados}</p>
      </div>
      
      <div className="bg-yellow-100 p-4 rounded-lg text-center">
        <h3 className="text-lg font-semibold text-yellow-800">Pendentes</h3>
        <p className="text-2xl font-bold text-yellow-600">{stats.pendentes}</p>
      </div>
    </div>
  )
}