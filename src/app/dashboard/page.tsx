'use client'

import { useState } from 'react'
import Dashboard from '../components/Dashboard'
import WorkflowTrilha from '../components/WorkflowTrilha'
import ComplexidadeCards from '../components/ComplexidadeCards'

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('trilha')

  const trilhaData = {
    paciente: 'Augusto Amorim',
    complexidade: 'HC - 24',
    solicitado: { data: '07/09/2026', hora: '17:30' },
    orcado: { hora: '10:00', status: 'Orçamento' },
    autorizado: { data: '11/09/2026', hora: '14:00' },
    internado: { data: '13/09/2026', hora: '10:00' }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto p-8">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Dashboard BPM - Internamento de Paciente</h1>
        
        <Dashboard />

        {/* Filtros */}
        <div className="filter-container">
          <input
            type="text"
            placeholder="Filtrar por paciente..."
            className="form-input"
          />
          <select className="form-select">
            <option>Por Convênio</option>
            <option>Unimed</option>
            <option>Bradesco</option>
            <option>Amil</option>
          </select>
          <select className="form-select">
            <option>Por Período</option>
            <option>Última semana</option>
            <option>Último mês</option>
            <option>Últimos 3 meses</option>
          </select>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                onClick={() => setActiveTab('trilha')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'trilha'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Trilha do Paciente
              </button>
              <button
                onClick={() => setActiveTab('complexidades')}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  activeTab === 'complexidades'
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                Complexidades
              </button>
            </nav>
          </div>
        </div>

        {/* Conteúdo das Tabs */}
        {activeTab === 'trilha' && (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Acompanhamento do Workflow</h2>
            <WorkflowTrilha data={trilhaData} />
          </div>
        )}

        {activeTab === 'complexidades' && (
          <div>
            <h2 className="text-xl font-semibold mb-4 text-gray-800">Tipos de Complexidade</h2>
            <ComplexidadeCards />
          </div>
        )}
      </div>
    </div>
  )
}