'use client'

import { useState, useEffect } from 'react'
import WorkflowStepper from '../components/WorkflowStepper'

interface Paciente {
  id: string
  nome: string
}

interface Complexidade {
  id: string
  nome: string
}

interface MovimentacaoWorkflow {
  id: string
  status: string
  atividade: {
    nome: string
    setor?: string
  }
  observacao?: string
}

export default function ProcessosPage() {
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [complexidades, setComplexidades] = useState<Complexidade[]>([])
  const [selectedPaciente, setSelectedPaciente] = useState('')
  const [selectedComplexidade, setSelectedComplexidade] = useState('')
  const [movimentacoes, setMovimentacoes] = useState<MovimentacaoWorkflow[]>([])

  useEffect(() => {
    fetchData()
    // Dados simulados para demonstração
    setMovimentacoes([
      {
        id: '1',
        status: 'OK',
        atividade: { nome: 'Solicitação Convênio', setor: 'Captação' },
        observacao: 'Solicitação enviada'
      },
      {
        id: '2', 
        status: 'PENDENTE',
        atividade: { nome: 'Vista de Enf. Captadora', setor: 'Captação' }
      },
      {
        id: '3',
        status: 'PENDENTE', 
        atividade: { nome: 'Orçamento', setor: 'Captação' }
      }
    ])
  }, [])

  const fetchData = async () => {
    try {
      const [pacientesRes, complexidadesRes] = await Promise.all([
        fetch('/api/pacientes'),
        fetch('/api/complexidades')
      ])
      setPacientes(await pacientesRes.json())
      setComplexidades(await complexidadesRes.json())
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await fetch('/api/processos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pacienteId: selectedPaciente,
          complexidadeId: selectedComplexidade
        })
      })
      alert('Processo criado com sucesso!')
    } catch (error) {
      console.error('Erro ao criar processo:', error)
    }
  }

  const handleUpdateStatus = (id: string, status: string, observacao?: string) => {
    setMovimentacoes(prev => 
      prev.map(mov => 
        mov.id === id ? { ...mov, status, observacao } : mov
      )
    )
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Gerenciar Processos</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-xl font-semibold mb-4">Criar Novo Processo</h2>
          <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow">
            <div className="space-y-4 mb-4">
              <div>
                <label className="block text-sm font-medium mb-2">Paciente</label>
                <select
                  value={selectedPaciente}
                  onChange={(e) => setSelectedPaciente(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Selecione um paciente</option>
                  {pacientes.map((p) => (
                    <option key={p.id} value={p.id}>{p.nome}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Complexidade</label>
                <select
                  value={selectedComplexidade}
                  onChange={(e) => setSelectedComplexidade(e.target.value)}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Selecione a complexidade</option>
                  {complexidades.map((c) => (
                    <option key={c.id} value={c.id}>{c.nome}</option>
                  ))}
                </select>
              </div>
            </div>
            
            <button type="submit" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
              Criar Processo
            </button>
          </form>
        </div>

        <div>
          <h2 className="text-xl font-semibold mb-4">Workflow Exemplo</h2>
          <WorkflowStepper
            movimentacoes={movimentacoes}
            complexidade="HC24"
            onUpdateStatus={handleUpdateStatus}
          />
        </div>
      </div>
    </div>
  )
}