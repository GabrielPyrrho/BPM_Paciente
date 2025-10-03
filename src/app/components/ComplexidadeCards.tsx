'use client'

import { useState, useEffect } from 'react'

interface Atividade {
  nome: string
  setor: string
}

interface TipoProcesso {
  id: string
  nome: string
  descricao?: string
  categoria?: string
  atividades: Atividade[]
  totalProcessos: number
}

const tiposProcessoMock: TipoProcesso[] = [
  {
    id: '1',
    nome: 'HC-24',
    descricao: 'Home Care 24 horas',
    categoria: 'HOSPITALAR',
    atividades: [
      { nome: 'Avaliação Inicial', setor: 'Captação' },
      { nome: 'Orçamento', setor: 'Financeiro' },
      { nome: 'Aprovação', setor: 'Convênio' },
      { nome: 'Execução', setor: 'Operacional' }
    ],
    totalProcessos: 0
  },
  {
    id: '2',
    nome: 'HC-48',
    descricao: 'Home Care 48 horas',
    categoria: 'HOSPITALAR',
    atividades: [
      { nome: 'Avaliação Inicial', setor: 'Captação' },
      { nome: 'Orçamento', setor: 'Financeiro' },
      { nome: 'Aprovação', setor: 'Convênio' },
      { nome: 'Execução', setor: 'Operacional' }
    ],
    totalProcessos: 0
  },
  {
    id: '3',
    nome: 'Contrato',
    descricao: 'Processo de contratação',
    categoria: 'JURIDICO',
    atividades: [
      { nome: 'Análise Jurídica', setor: 'Jurídico' },
      { nome: 'Aprovação', setor: 'Diretoria' },
      { nome: 'Assinatura', setor: 'Partes' }
    ],
    totalProcessos: 0
  },
  {
    id: '4',
    nome: 'Nota Fiscal',
    descricao: 'Processo de emissão de nota fiscal',
    categoria: 'FINANCEIRO',
    atividades: [
      { nome: 'Validação', setor: 'Financeiro' },
      { nome: 'Emissão', setor: 'Fiscal' },
      { nome: 'Envio', setor: 'Operacional' }
    ],
    totalProcessos: 0
  }
]

export default function ComplexidadeCards() {
  const [tiposProcesso, setTiposProcesso] = useState<TipoProcesso[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/dashboard')
      .then(res => res.json())
      .then(data => {
        if (data.complexidades && data.complexidades.length > 0) {
          const tipos = data.complexidades.map((comp: any, index: number) => ({
            id: String(index + 1),
            nome: comp.nome,
            descricao: `Tipo de processo ${comp.nome}`,
            categoria: 'GENERICO',
            atividades: [
              { nome: 'Iniciação', setor: 'Operacional' },
              { nome: 'Execução', setor: 'Operacional' },
              { nome: 'Finalização', setor: 'Operacional' }
            ],
            totalProcessos: comp.total
          }))
          setTiposProcesso(tipos)
        } else {
          setTiposProcesso(tiposProcessoMock)
        }
        setLoading(false)
      })
      .catch(() => {
        setTiposProcesso(tiposProcessoMock)
        setLoading(false)
      })
  }, [])

  const getCategoryColor = (categoria: string) => {
    switch (categoria) {
      case 'HOSPITALAR': return 'bg-blue-500'
      case 'FINANCEIRO': return 'bg-green-500'
      case 'JURIDICO': return 'bg-purple-500'
      default: return 'bg-gray-500'
    }
  }

  if (loading) {
    return <div className="text-center py-8">Carregando tipos de processo...</div>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
      {tiposProcesso.map((tipo) => (
        <div key={tipo.id} className="bg-white rounded-lg shadow-md overflow-hidden">
          <div className={`${getCategoryColor(tipo.categoria)} text-white p-4`}>
            <h3 className="font-bold text-lg">{tipo.nome}</h3>
            <p className="text-sm opacity-90">{tipo.descricao}</p>
          </div>
          <div className="p-4">
            <div className="mb-3">
              <span className="text-sm text-gray-600">Total de processos: </span>
              <span className="font-semibold text-blue-600">{tipo.totalProcessos}</span>
            </div>
            <div className="space-y-2">
              <h4 className="font-semibold text-sm text-gray-700">Atividades:</h4>
              {tipo.atividades.map((atividade, idx) => (
                <div key={idx} className="flex justify-between text-xs bg-gray-50 p-2 rounded">
                  <span>{atividade.nome}</span>
                  <span className="text-gray-500">{atividade.setor}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}