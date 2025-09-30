'use client'

import { useState, useEffect } from 'react'

interface WorkflowViewerProps {
  processoId: string
}

interface Atividade {
  id: string
  status: string
  atividade: {
    nome: string
    setor?: string
    ordem: number
  }
  horaInicio?: string
  horaFim?: string
  observacao?: string
  responsavel?: {
    nome: string
  }
}

export default function WorkflowViewer({ processoId }: WorkflowViewerProps) {
  const [atividades, setAtividades] = useState<Atividade[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (processoId) {
      fetch(`/api/processos/${processoId}`)
        .then(res => res.json())
        .then(data => {
          setAtividades(data.atividades || [])
          setLoading(false)
        })
        .catch(() => setLoading(false))
    }
  }, [processoId])

  const updateStatus = async (atividadeId: string, status: string) => {
    try {
      await fetch(`/api/workflow/${processoId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ atividadeId, status })
      })
      
      setAtividades(prev => 
        prev.map(ativ => 
          ativ.atividade.id === atividadeId ? { ...ativ, status } : ativ
        )
      )
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
    }
  }

  if (loading) return <div>Carregando workflow...</div>

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OK': return 'bg-green-500'
      case 'PENDENTE': return 'bg-yellow-500'
      case 'NOK': return 'bg-red-500'
      default: return 'bg-gray-300'
    }
  }

  return (
    <div className="space-y-4">
      {atividades.map((ativ, index) => (
        <div key={ativ.id} className="flex items-center space-x-4 p-4 border rounded">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-sm ${getStatusColor(ativ.status)}`}>
            {index + 1}
          </div>
          
          <div className="flex-1">
            <h3 className="font-medium">{ativ.atividade.nome}</h3>
            <p className="text-sm text-gray-600">{ativ.atividade.setor}</p>
            {ativ.responsavel && (
              <p className="text-xs text-gray-500">Responsável: {ativ.responsavel.nome}</p>
            )}
          </div>
          
          <div className="flex space-x-2">
            <button
              onClick={() => updateStatus(ativ.atividade.id, 'OK')}
              className="px-3 py-1 bg-green-500 text-white rounded text-sm hover:bg-green-600"
            >
              OK
            </button>
            <button
              onClick={() => updateStatus(ativ.atividade.id, 'PENDENTE')}
              className="px-3 py-1 bg-yellow-500 text-white rounded text-sm hover:bg-yellow-600"
            >
              Pendente
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}