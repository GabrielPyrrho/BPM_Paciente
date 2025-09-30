'use client'

import { useState, useEffect } from 'react'

interface ProcessoAtivo {
  id: string
  paciente: string
  complexidade: string
  proximaAtividade: string
  setor: string
  responsavel: string
  prazo: string | null
  atrasado: boolean
}

export default function ProcessosAtivos() {
  const [processos, setProcessos] = useState<ProcessoAtivo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dashboard/processos-ativos')
      .then(res => res.json())
      .then(data => {
        setProcessos(data)
        setLoading(false)
      })
      .catch(() => {
        setProcessos([
          {
            id: '1',
            paciente: 'João Silva',
            complexidade: 'HC-24',
            proximaAtividade: 'Orçamento',
            setor: 'Captação',
            responsavel: 'Maria Santos',
            prazo: '2024-01-15T10:00:00Z',
            atrasado: false
          },
          {
            id: '2',
            paciente: 'Ana Costa',
            complexidade: 'HC-48',
            proximaAtividade: 'Viabilidade Domicílio',
            setor: 'Pré-internamento',
            responsavel: 'Carlos Lima',
            prazo: '2024-01-14T14:00:00Z',
            atrasado: true
          }
        ])
        setLoading(false)
      })
  }, [])

  if (loading) {
    return <div className="text-center py-4">Carregando processos...</div>
  }

  return (
    <div className="bg-white rounded-lg shadow overflow-hidden">
      <div className="px-6 py-4 border-b border-gray-200">
        <h3 className="text-lg font-semibold">Processos Ativos</h3>
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Paciente</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Complexidade</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Próxima Atividade</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Setor</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Responsável</th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {processos.map((processo) => (
              <tr key={processo.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                  {processo.paciente}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                    {processo.complexidade}
                  </span>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {processo.proximaAtividade}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {processo.setor}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {processo.responsavel}
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  {processo.atrasado ? (
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                      Em Atraso
                    </span>
                  ) : (
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      No Prazo
                    </span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}