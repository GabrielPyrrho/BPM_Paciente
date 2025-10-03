'use client'

import { useState, useEffect } from 'react'
import CountdownTimer from './CountdownTimer'

interface Atividade {
  nome: string
  status: 'OK' | 'NOK' | 'PENDENTE'
  horaInicio?: string
  horaFim?: string
  prazo?: string
  observacao?: string
}

interface TrilhaEntidade {
  id: string
  entidade: string
  tipoWorkflow: string
  atividades: Atividade[]
  progresso: number
}

interface WorkflowTrilhaProps {
  data?: any
}

export default function WorkflowTrilha({ data }: WorkflowTrilhaProps) {
  const [trilhas, setTrilhas] = useState<TrilhaEntidade[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedTrilha, setSelectedTrilha] = useState<TrilhaEntidade | null>(null)

  useEffect(() => {
    fetch('/api/processos')
      .then(res => res.json())
      .then(processos => {
        if (Array.isArray(processos)) {
          const trilhasFormatadas = processos.map((processo: any) => ({
            id: processo.id,
            entidade: processo.entidade?.nome || 'Entidade não encontrada',
            tipoWorkflow: processo.tipoWorkflow?.nome || 'Tipo não encontrado',
            atividades: processo.atividades?.map((mov: any) => ({
              nome: mov.atividade?.nome || 'Atividade não encontrada',
              status: mov.status,
              horaInicio: mov.horaInicio,
              horaFim: mov.horaFim,
              prazo: mov.prazo,
              observacao: mov.observacao
            })) || [],
            progresso: processo.atividades?.length > 0 
              ? Math.round((processo.atividades.filter((a: any) => a.status === 'OK').length / processo.atividades.length) * 100)
              : 0
          }))
          setTrilhas(trilhasFormatadas)
          if (trilhasFormatadas.length > 0) {
            setSelectedTrilha(trilhasFormatadas[0])
          }
        }
        setLoading(false)
      })
      .catch(() => {
        setLoading(false)
      })
  }, [])

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OK': return 'bg-green-500'
      case 'NOK': return 'bg-red-500'
      case 'PENDENTE': return 'bg-yellow-500'
      default: return 'bg-gray-300'
    }
  }

  if (loading) {
    return <div className="text-center py-8">Carregando trilhas...</div>
  }

  if (trilhas.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow p-6 text-center">
        <p className="text-gray-500">Nenhum processo encontrado</p>
      </div>
    )
  }
  return (
    <div className="space-y-6">
      {/* Seletor de Entidade */}
      <div className="bg-white rounded-lg shadow p-4">
        <h3 className="text-lg font-semibold mb-4">Selecionar Entidade</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {trilhas.map((trilha) => (
            <button
              key={trilha.id}
              onClick={() => setSelectedTrilha(trilha)}
              className={`p-4 rounded-lg border-2 text-left transition-colors ${
                selectedTrilha?.id === trilha.id
                  ? 'border-blue-500 bg-blue-50'
                  : 'border-gray-200 hover:border-gray-300'
              }`}
            >
              <div className="font-semibold">{trilha.entidade}</div>
              <div className="text-sm text-gray-600">{trilha.tipoWorkflow}</div>
              <div className="mt-2">
                <div className="flex justify-between text-xs">
                  <span>Progresso</span>
                  <span>{trilha.progresso}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-1">
                  <div 
                    className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${trilha.progresso}%` }}
                  ></div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Trilha da Entidade Selecionada */}
      {selectedTrilha && (
        <div className="bg-white rounded-lg shadow p-6">
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-gray-800">{selectedTrilha.entidade}</h2>
            <p className="text-gray-600">Processo: {selectedTrilha.tipoWorkflow}</p>
            <div className="mt-2">
              <div className="flex justify-between text-sm">
                <span>Progresso Geral</span>
                <span>{selectedTrilha.progresso}%</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 mt-1">
                <div 
                  className="bg-green-600 h-3 rounded-full transition-all duration-300"
                  style={{ width: `${selectedTrilha.progresso}%` }}
                ></div>
              </div>
            </div>
          </div>

          {/* Lista de Atividades */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Atividades do Processo</h3>
            {selectedTrilha.atividades.length > 0 ? (
              <div className="grid gap-3">
                {selectedTrilha.atividades.map((atividade, index) => (
                  <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <div className={`w-4 h-4 rounded-full ${getStatusColor(atividade.status)}`}></div>
                      <div>
                        <div className="font-medium">{atividade.nome}</div>
                        {atividade.observacao && (
                          <div className="text-sm text-gray-500">{atividade.observacao}</div>
                        )}
                      </div>
                    </div>
                    <div className="text-right space-y-1">
                      <div className={`px-3 py-1 rounded-full text-xs font-medium ${
                        atividade.status === 'OK' ? 'bg-green-100 text-green-800' :
                        atividade.status === 'NOK' ? 'bg-red-100 text-red-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {atividade.status}
                      </div>
                      <CountdownTimer 
                        prazo={atividade.prazo}
                        horaInicio={atividade.horaInicio}
                        status={atividade.status}
                      />
                      {atividade.horaInicio && (
                        <div className="text-xs text-gray-500">
                          {new Date(atividade.horaInicio).toLocaleString('pt-BR')}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-8">Nenhuma atividade encontrada para este processo</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}