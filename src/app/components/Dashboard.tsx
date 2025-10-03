'use client'

import { useState, useEffect } from 'react'
import EstatisticasGerais from './EstatisticasGerais'

interface DashboardStats {
  solicitados: number
  concluidas: number
  pendentes: number
  rejeitadas: number
  atrasadas: number
  totalEntidades: number
  complexidades: Array<{ nome: string; total: number }>
  ultimosProcessos: Array<{
    id: string
    paciente: string
    complexidade: string
    proximaAtividade: string
  }>
}

export default function Dashboard() {
  const [stats, setStats] = useState<DashboardStats>({
    solicitados: 0,
    concluidas: 0,
    pendentes: 0,
    rejeitadas: 0,
    atrasadas: 0,
    totalEntidades: 0,
    complexidades: [],
    ultimosProcessos: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dashboard')
      .then(res => res.json())
      .then(data => {
        setStats(data)
        setLoading(false)
      })
      .catch(error => {
        console.error('Erro ao carregar dashboard:', error)
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <div className="text-center py-8">Carregando dashboard...</div>
  }

  return (
    <div className="space-y-6">
      {/* Cards principais */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-4 mb-8">
        <div className="bg-blue-500 p-4 rounded-lg text-white text-center">
          <h3 className="text-sm font-medium">Entidades</h3>
          <p className="text-2xl font-bold mt-1">{stats.totalEntidades}</p>
        </div>
        
        <div className="bg-indigo-500 p-4 rounded-lg text-white text-center">
          <h3 className="text-sm font-medium">Processos</h3>
          <p className="text-2xl font-bold mt-1">{stats.solicitados}</p>
        </div>
        
        <div className="bg-green-500 p-4 rounded-lg text-white text-center">
          <h3 className="text-sm font-medium">Concluídas</h3>
          <p className="text-2xl font-bold mt-1">{stats.concluidas}</p>
        </div>
        
        <div className="bg-yellow-500 p-4 rounded-lg text-white text-center">
          <h3 className="text-sm font-medium">Pendentes</h3>
          <p className="text-2xl font-bold mt-1">{stats.pendentes}</p>
        </div>
        
        <div className="bg-red-500 p-4 rounded-lg text-white text-center">
          <h3 className="text-sm font-medium">Rejeitadas</h3>
          <p className="text-2xl font-bold mt-1">{stats.rejeitadas}</p>
        </div>
        
        <div className="bg-orange-500 p-4 rounded-lg text-white text-center">
          <h3 className="text-sm font-medium">Em Atraso</h3>
          <p className="text-2xl font-bold mt-1">{stats.atrasadas}</p>
        </div>
      </div>

      {/* Estatísticas Gerais */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4">📊 Estatísticas Gerais</h3>
        <EstatisticasGerais />
      </div>

      {/* Seção inferior com detalhes */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tipos de Workflow */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Tipos de Processos</h3>
          <div className="space-y-3">
            {stats.complexidades && stats.complexidades.length > 0 ? (
              stats.complexidades.map((comp, index) => (
                <div key={index} className="flex justify-between items-center p-3 bg-gray-50 rounded">
                  <span className="font-medium">{comp.nome}</span>
                  <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-semibold">
                    {comp.total}
                  </span>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">Nenhuma complexidade encontrada</p>
            )}
          </div>
        </div>

        {/* Últimos processos */}
        <div className="bg-white p-6 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Últimos Processos vinculados a uma Entidade</h3>
          <div className="space-y-3">
            {stats.ultimosProcessos && stats.ultimosProcessos.length > 0 ? (
              stats.ultimosProcessos.map((processo) => (
                <div key={processo.id} className="border-l-4 border-blue-500 pl-4 py-2">
                  <div className="font-medium">{processo.paciente}</div>
                  <div className="text-sm text-gray-600">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs mr-2">
                      {processo.complexidade}
                    </span>
                    {processo.proximaAtividade}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-sm">Nenhum processo encontrado</p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}