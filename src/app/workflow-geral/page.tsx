'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface ProcessoWorkflow {
  id: string
  entidade: {
    id: string
    nome: string
    tipo: string
  }
  tipoWorkflow: {
    nome: string
  }
  atividades: any[]
}

interface Etapa {
  id: string
  nome: string
  cor?: string
  ordem: number
}

interface Atividade {
  id: string
  nome: string
  setor: string
  grupo: string
  status: 'PENDENTE' | 'OK' | 'NOK' | 'PAUSADO' | 'CANCELADO'
  dataHora?: string
  responsavel?: string
  observacao?: string
}

interface ModalObservacaoProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (observacao: string) => void
  atividade: Atividade | null
  status: 'OK' | 'NOK' | 'PAUSADO' | 'CANCELADO' | 'PENDENTE'
}

interface ModalSucessoProps {
  isOpen: boolean
  onClose: () => void
  atividade: Atividade | null
  status: 'OK' | 'NOK' | 'PAUSADO' | 'CANCELADO' | 'PENDENTE'
}

function ModalAviso({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  if (!isOpen) return null

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '0',
        maxWidth: '400px',
        width: '100%',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        animation: 'fadeIn 0.3s ease-out'
      }}>
        <div style={{
          padding: '24px 24px 0 24px',
          borderBottom: '1px solid #f1f5f9',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              backgroundColor: '#f59e0b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '18px'
            }}>
              ⚠️
            </div>
            <div>
              <h3 style={{
                margin: 0,
                fontSize: '18px',
                fontWeight: '600',
                color: '#1e293b'
              }}>
                Usuário Obrigatório
              </h3>
              <p style={{
                margin: 0,
                fontSize: '14px',
                color: '#64748b'
              }}>
                Selecione um usuário responsável
              </p>
            </div>
          </div>
        </div>

        <div style={{ padding: '0 24px 24px 24px' }}>
          <p style={{
            fontSize: '14px',
            color: '#374151',
            marginBottom: '24px',
            lineHeight: '1.5'
          }}>
            Para executar uma atividade é necessário selecionar o usuário responsável.
          </p>

          <div style={{
            display: 'flex',
            justifyContent: 'flex-end'
          }}>
            <button
              onClick={onClose}
              style={{
                padding: '10px 20px',
                border: 'none',
                borderRadius: '8px',
                backgroundColor: '#f59e0b',
                color: 'white',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              Entendi
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function ModalSucesso({ isOpen, onClose, atividade, status }: ModalSucessoProps) {
  useEffect(() => {
    if (isOpen) {
      const timer = setTimeout(() => {
        onClose()
      }, 3000)
      return () => clearTimeout(timer)
    }
  }, [isOpen, onClose])

  if (!isOpen || !atividade) return null

  const statusColor = status === 'OK' ? '#10b981' : 
                     status === 'NOK' ? '#dc2626' : 
                     status === 'PAUSADO' ? '#f59e0b' : 
                     status === 'PENDENTE' ? '#3b82f6' : '#6b7280'
  const statusText = status === 'OK' ? 'Concluída' : 
                    status === 'NOK' ? 'Marcada como NOK' : 
                    status === 'PAUSADO' ? 'Pausada' : 
                    status === 'PENDENTE' ? 'Reaberta' : 'Cancelada'
  const statusIcon = status === 'OK' ? '✅' : 
                    status === 'NOK' ? '❌' : 
                    status === 'PAUSADO' ? '⏸️' : 
                    status === 'PENDENTE' ? '🔄' : '🚫'

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '32px',
        maxWidth: '400px',
        width: '100%',
        boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
        animation: 'successSlideIn 0.4s ease-out',
        textAlign: 'center'
      }}>
        <div style={{
          width: '80px',
          height: '80px',
          borderRadius: '50%',
          backgroundColor: statusColor,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
          fontSize: '40px',
          animation: 'successPulse 0.6s ease-out'
        }}>
          {statusIcon}
        </div>
        
        <h3 style={{
          fontSize: '24px',
          fontWeight: '700',
          color: '#1e293b',
          margin: '0 0 12px 0'
        }}>
          Atividade {statusText}!
        </h3>
        
        <p style={{
          fontSize: '16px',
          color: '#64748b',
          margin: '0 0 8px 0',
          fontWeight: '500'
        }}>
          {atividade.nome}
        </p>
        
        <p style={{
          fontSize: '14px',
          color: '#9ca3af',
          margin: '0 0 24px 0'
        }}>
          Status atualizado com sucesso
        </p>
        
        <div style={{
          width: '100%',
          height: '4px',
          backgroundColor: '#f1f5f9',
          borderRadius: '2px',
          overflow: 'hidden'
        }}>
          <div style={{
            width: '100%',
            height: '100%',
            backgroundColor: statusColor,
            animation: 'progressBar 3s linear'
          }}></div>
        </div>
        
        <button
          onClick={onClose}
          style={{
            marginTop: '20px',
            padding: '8px 16px',
            background: 'transparent',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            color: '#64748b',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#f8fafc'
            e.target.style.borderColor = '#cbd5e1'
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = 'transparent'
            e.target.style.borderColor = '#e2e8f0'
          }}
        >
          Fechar
        </button>
      </div>
    </div>
  )
}

function ModalObservacao({ isOpen, onClose, onConfirm, atividade, status }: ModalObservacaoProps) {
  const [observacao, setObservacao] = useState('')

  useEffect(() => {
    if (isOpen) {
      setObservacao('')
    }
  }, [isOpen])

  if (!isOpen || !atividade) return null

  const handleConfirm = () => {
    onConfirm(observacao)
    onClose()
  }

  const statusColor = status === 'OK' ? '#10b981' : 
                     status === 'NOK' ? '#dc2626' : 
                     status === 'PAUSADO' ? '#f59e0b' : 
                     status === 'PENDENTE' ? '#3b82f6' : '#6b7280'
  const statusText = status === 'OK' ? 'Concluir' : 
                    status === 'NOK' ? 'Marcar como NOK' : 
                    status === 'PAUSADO' ? 'Pausar' : 
                    status === 'PENDENTE' ? 'Reabrir' : 
                    status === 'CANCELADO' ? 'Cancelar' : 'Executar'
  const statusIcon = status === 'OK' ? '✓' : 
                    status === 'NOK' ? '✗' : 
                    status === 'PAUSADO' ? '⏸' : 
                    status === 'PENDENTE' ? '🔄' : '🚫'

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '12px',
        padding: '0',
        maxWidth: '500px',
        width: '100%',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        animation: 'fadeIn 0.3s ease-out'
      }}>
        <div style={{
          padding: '24px 24px 0 24px',
          borderBottom: '1px solid #f1f5f9',
          marginBottom: '20px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              backgroundColor: statusColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '18px',
              fontWeight: 'bold'
            }}>
              {statusIcon}
            </div>
            <div>
              <h3 style={{
                margin: 0,
                fontSize: '18px',
                fontWeight: '600',
                color: '#1e293b'
              }}>
                {statusText} Atividade
              </h3>
              <p style={{
                margin: 0,
                fontSize: '14px',
                color: '#64748b'
              }}>
                Adicione uma observação (opcional)
              </p>
            </div>
          </div>
        </div>

        <div style={{ padding: '0 24px 24px 24px' }}>
          <div style={{
            backgroundColor: '#f8fafc',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '20px',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#1e293b',
              marginBottom: '4px'
            }}>
              {atividade.nome}
            </div>
            <div style={{
              fontSize: '12px',
              color: '#64748b'
            }}>
              Setor: {atividade.setor} • Grupo: {atividade.grupo}
            </div>
          </div>

          <div style={{ marginBottom: '24px' }}>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '8px'
            }}>
              Observação
            </label>
            <textarea
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              placeholder="Digite uma observação sobre esta atividade..."
              maxLength={500}
              style={{
                width: '100%',
                minHeight: '100px',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: 'inherit',
                resize: 'vertical',
                outline: 'none',
                transition: 'border-color 0.2s ease',
                boxSizing: 'border-box'
              }}
              onFocus={(e) => e.target.style.borderColor = statusColor}
              onBlur={(e) => e.target.style.borderColor = '#d1d5db'}
            />
            <div style={{
              fontSize: '12px',
              color: '#9ca3af',
              marginTop: '6px'
            }}>
              {observacao.length}/500 caracteres
            </div>
          </div>

          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end'
          }}>
            <button
              onClick={onClose}
              style={{
                padding: '10px 20px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                backgroundColor: 'white',
                color: '#374151',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              Cancelar
            </button>
            <button
              onClick={handleConfirm}
              style={{
                padding: '10px 20px',
                border: 'none',
                borderRadius: '8px',
                backgroundColor: statusColor,
                color: 'white',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
            >
              {statusIcon} {statusText}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function WorkflowGeralPage() {
  const router = useRouter()
  const [processos, setProcessos] = useState<ProcessoWorkflow[]>([])
  const [processosFiltrados, setProcessosFiltrados] = useState<ProcessoWorkflow[]>([])
  const [etapas, setEtapas] = useState<Etapa[]>([])
  const [expandedCell, setExpandedCell] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [filtroTexto, setFiltroTexto] = useState('')
  const [filtroStatus, setFiltroStatus] = useState('todos')
  const [filtroTipo, setFiltroTipo] = useState('todos')
  const [hoveredCell, setHoveredCell] = useState<string | null>(null)
  const [autoRefresh, setAutoRefresh] = useState(false)
  const [modalDetalhes, setModalDetalhes] = useState<{processo: ProcessoWorkflow, etapa: Etapa} | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [usuarioAtual, setUsuarioAtual] = useState('')
  
  // Estados dos modais
  const [modalAberto, setModalAberto] = useState(false)
  const [modalSucessoAberto, setModalSucessoAberto] = useState(false)
  const [modalAvisoAberto, setModalAvisoAberto] = useState(false)
  const [atividadeModal, setAtividadeModal] = useState<Atividade | null>(null)
  const [statusModal, setStatusModal] = useState<'OK' | 'NOK' | 'PAUSADO' | 'CANCELADO' | 'PENDENTE'>('OK')

  useEffect(() => {
    carregarDados()
    
    // Carregar usuário logado do localStorage
    const usuarioLogado = localStorage.getItem('usuario')
    if (usuarioLogado) {
      try {
        const usuario = JSON.parse(usuarioLogado)
        setUsuarioAtual(usuario.nome)
      } catch (error) {
        console.error('Erro ao carregar usuário logado:', error)
      }
    }
  }, [])

  const carregarDados = async () => {
    try {
      const [processosRes, etapasRes] = await Promise.all([
        fetch('/api/processos'),
        fetch('/api/etapas')
      ])

      const processosData = await processosRes.json()
      const etapasData = await etapasRes.json()

      const processosArray = Array.isArray(processosData) ? processosData : []
      const etapasArray = Array.isArray(etapasData) ? etapasData.sort((a: Etapa, b: Etapa) => a.ordem - b.ordem) : []
      
      setProcessos(processosArray)
      setProcessosFiltrados(processosArray)
      setEtapas(etapasArray)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      setProcessos([])
      setProcessosFiltrados([])
      setEtapas([])
    } finally {
      setLoading(false)
    }
  }

  const getStatusEtapa = (processo: ProcessoWorkflow, etapaId: string) => {
    if (!processo.atividades) return { cor: '#e5e7eb', status: 'vazio', atividades: [] }

    const atividadesEtapa = processo.atividades.filter(
      (mov: any) => mov.atividade.etapaId === etapaId
    )

    if (atividadesEtapa.length === 0) return { cor: '#e5e7eb', status: 'vazio', atividades: [] }

    const todasOK = atividadesEtapa.every((mov: any) => mov.status === 'OK')
    const algumaNOK = atividadesEtapa.some((mov: any) => mov.status === 'NOK')
    const emAndamento = atividadesEtapa.some((mov: any) => mov.status === 'PENDENTE')

    if (todasOK) return { cor: '#10b981', status: 'concluido', atividades: atividadesEtapa }
    if (algumaNOK) return { cor: '#dc2626', status: 'cancelado', atividades: atividadesEtapa }
    if (emAndamento) return { cor: '#f59e0b', status: 'andamento', atividades: atividadesEtapa }
    
    return { cor: '#e5e7eb', status: 'vazio', atividades: atividadesEtapa }
  }

  const toggleExpandCell = (processoId: string, etapaId: string) => {
    const cellId = `${processoId}-${etapaId}`
    setExpandedCell(expandedCell === cellId ? null : cellId)
  }

  const abrirModal = (atividadeId: string, novoStatus: 'OK' | 'NOK' | 'PAUSADO' | 'CANCELADO' | 'PENDENTE') => {
    if (!usuarioAtual) {
      setModalAvisoAberto(true)
      return
    }

    const atividade = processos
      .flatMap(p => p.atividades)
      .find(a => a.id === atividadeId)
    
    if (!atividade) {
      alert('Atividade não encontrada!')
      return
    }

    // Bloquear marcação manual de finalização
    if (atividade.atividade.nome.includes('Finalização Etapa')) {
      alert('A finalização da etapa é automática quando todas as atividades são concluídas!')
      return
    }

    // Converter para formato esperado pelo modal
    const atividadeFormatada: Atividade = {
      id: atividade.id,
      nome: atividade.atividade.nome,
      setor: atividade.atividade.setor || 'N/A',
      grupo: 'Etapa',
      status: atividade.status,
      dataHora: atividade.horaFim ? new Date(atividade.horaFim).toLocaleString('pt-BR') : undefined,
      responsavel: atividade.responsavel?.nome,
      observacao: atividade.observacao
    }

    setAtividadeModal(atividadeFormatada)
    setStatusModal(novoStatus)
    setModalAberto(true)
  }

  const confirmarAtividade = async (observacao: string) => {
    if (!atividadeModal) {
      return
    }

    const usuarioLogado = localStorage.getItem('usuario')
    let setorUsuario = 'Sem setor'
    if (usuarioLogado) {
      try {
        const usuario = JSON.parse(usuarioLogado)
        setorUsuario = usuario.setor?.nome || 'Sem setor'
      } catch (error) {
        console.error('Erro ao carregar setor do usuário:', error)
      }
    }

    try {
      const response = await fetch(`/api/workflow/${atividadeModal.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: statusModal,
          responsavel: `${usuarioAtual} (${setorUsuario})`,
          observacao: observacao || null
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Erro na resposta do servidor')
      }

      // Recarregar dados
      carregarDados()
      
      // Mostrar modal de sucesso
      setModalSucessoAberto(true)
    } catch (error) {
      console.error('Erro ao atualizar atividade:', error)
      alert(`Erro ao atualizar atividade: ${error.message}`)
    }
  }

  // Filtros e busca
  useEffect(() => {
    let filtered = processos

    if (filtroTexto) {
      filtered = filtered.filter(p => 
        p.entidade.nome.toLowerCase().includes(filtroTexto.toLowerCase()) ||
        p.tipoWorkflow.nome.toLowerCase().includes(filtroTexto.toLowerCase())
      )
    }

    if (filtroStatus !== 'todos') {
      filtered = filtered.filter(p => {
        if (!p.atividades) return false
        const todasOK = p.atividades.every(a => a.status === 'OK')
        const algumaNOK = p.atividades.some(a => a.status === 'NOK')
        const emAndamento = p.atividades.some(a => a.status === 'PENDENTE')
        
        switch (filtroStatus) {
          case 'concluido': return todasOK
          case 'andamento': return emAndamento && !todasOK
          case 'problema': return algumaNOK
          default: return true
        }
      })
    }

    if (filtroTipo !== 'todos') {
      filtered = filtered.filter(p => p.tipoWorkflow.nome === filtroTipo)
    }

    setProcessosFiltrados(filtered)
  }, [processos, filtroTexto, filtroStatus, filtroTipo])

  // Auto refresh
  useEffect(() => {
    if (autoRefresh) {
      const interval = setInterval(carregarDados, 30000)
      return () => clearInterval(interval)
    }
  }, [autoRefresh])

  const tiposUnicos = [...new Set(processos.map(p => p.tipoWorkflow.nome))]

  const abrirDetalhes = (processo: ProcessoWorkflow, etapa: Etapa) => {
    setModalDetalhes({ processo, etapa })
  }

  const irParaWorkflowIndividual = (processoId: string) => {
    router.push(`/workflow?id=${processoId}`)
  }

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: '#f8fafc', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center' 
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>⏳</div>
          <div style={{ fontSize: '18px', color: '#64748b' }}>Carregando workflows...</div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#f8fafc', 
      fontFamily: 'system-ui, -apple-system, sans-serif' 
    }}>
      {/* Modal de Observação */}
      <ModalObservacao
        isOpen={modalAberto}
        onClose={() => setModalAberto(false)}
        onConfirm={confirmarAtividade}
        atividade={atividadeModal}
        status={statusModal}
      />
      
      {/* Modal de Sucesso */}
      <ModalSucesso
        isOpen={modalSucessoAberto}
        onClose={() => setModalSucessoAberto(false)}
        atividade={atividadeModal}
        status={statusModal}
      />
      
      {/* Modal de Aviso */}
      <ModalAviso
        isOpen={modalAvisoAberto}
        onClose={() => setModalAvisoAberto(false)}
      />
      {/* Header */}
      <div style={{ 
        background: 'white', 
        borderBottom: '1px solid #e2e8f0', 
        padding: '16px 24px',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => router.push('/')}
              style={{
                background: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '8px 16px',
                fontSize: '14px',
                cursor: 'pointer',
                fontWeight: '500'
              }}
            >
              ← Voltar
            </button>
            <div style={{
              width: '40px',
              height: '40px',
              background: '#8b5cf6',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px'
            }}>
              📋
            </div>
            <div>
              <h1 style={{ 
                fontSize: '20px', 
                fontWeight: '600', 
                color: '#1e293b', 
                margin: 0 
              }}>
                Workflow BPM
              </h1>
              <p style={{ 
                fontSize: '14px', 
                color: '#64748b', 
                margin: 0 
              }}>
                Controle de atividades genéricas
              </p>
            </div>
          </div>
          <div style={{
            color: '#64748b',
            fontSize: '14px'
          }}>
            {new Date().toLocaleDateString('pt-BR')} - {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '24px', padding: '24px' }}>
        {/* Sidebar com Estatísticas */}
        <div style={{
          width: sidebarOpen ? '300px' : '60px',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0',
          transition: 'width 0.3s ease',
          overflow: 'hidden',
          position: 'sticky',
          top: '24px',
          height: 'fit-content'
        }}>
          <div style={{
            padding: '16px',
            borderBottom: '1px solid #e2e8f0',
            display: 'flex',
            alignItems: 'center',
            justifyContent: sidebarOpen ? 'space-between' : 'center'
          }}>
            {sidebarOpen && (
              <h3 style={{ margin: 0, fontSize: '16px', fontWeight: '600', color: '#1e293b' }}>
                📊 Estatísticas
              </h3>
            )}
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              style={{
                background: 'none',
                border: 'none',
                fontSize: '18px',
                cursor: 'pointer',
                padding: '4px'
              }}
            >
              {sidebarOpen ? '◀' : '▶'}
            </button>
          </div>
          
          {sidebarOpen && (
            <div style={{ padding: '16px' }}>
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600', color: '#64748b' }}>
                  VISÃO GERAL
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', color: '#64748b' }}>Total Processos:</span>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#1e293b' }}>{processosFiltrados.length}</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '13px', color: '#64748b' }}>Concluídos:</span>
                    <span style={{ fontSize: '13px', fontWeight: '600', color: '#10b981' }}>
                      {processosFiltrados.filter(p => p.atividades?.every(a => a.status === 'OK')).length}
                    </span>
                  </div>
                </div>
              </div>
              
              <div>
                <h4 style={{ margin: '0 0 12px 0', fontSize: '14px', fontWeight: '600', color: '#64748b' }}>
                  AÇÕES RÁPIDAS
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <button
                    onClick={() => router.push('/pacientes')}
                    style={{
                      padding: '8px 12px',
                      background: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    👤 Nova Entidade
                  </button>
                  <button
                    onClick={carregarDados}
                    style={{
                      padding: '8px 12px',
                      background: '#6b7280',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      fontSize: '12px',
                      cursor: 'pointer',
                      textAlign: 'left'
                    }}
                  >
                    🔄 Atualizar Dados
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
        
        {/* Conteúdo Principal */}
        <div style={{ flex: 1 }}>
          {/* Barra de Filtros */}
          <div style={{
            background: 'white',
            padding: '20px',
            borderRadius: '12px',
            marginBottom: '20px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ display: 'flex', gap: '16px', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ flex: '1', minWidth: '200px' }}>
                <input
                  type="text"
                  placeholder="🔍 Buscar entidade ou processo..."
                  value={filtroTexto}
                  onChange={(e) => setFiltroTexto(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '10px 12px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>

              <select
                value={filtroStatus}
                onChange={(e) => setFiltroStatus(e.target.value)}
                style={{
                  padding: '10px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  background: 'white'
                }}
              >
                <option value="todos">📊 Todos Status</option>
                <option value="concluido">✅ Concluídos</option>
                <option value="andamento">⏳ Em Andamento</option>
                <option value="problema">❌ Com Problemas</option>
              </select>

              <button
                onClick={() => setAutoRefresh(!autoRefresh)}
                style={{
                  padding: '10px 16px',
                  border: 'none',
                  borderRadius: '8px',
                  background: autoRefresh ? '#10b981' : '#6b7280',
                  color: 'white',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                {autoRefresh ? '🔄 Auto ON' : '⏸️ Auto OFF'}
              </button>

              <button
                onClick={carregarDados}
                style={{
                  padding: '10px 16px',
                  border: '1px solid #3b82f6',
                  borderRadius: '8px',
                  background: 'white',
                  color: '#3b82f6',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                🔄 Atualizar
              </button>
            </div>

            <div style={{ 
              marginTop: '16px', 
              padding: '12px', 
              background: '#f8fafc', 
              borderRadius: '8px',
              display: 'flex',
              gap: '20px',
              fontSize: '14px'
            }}>
              <span><strong>Total:</strong> {processosFiltrados.length} processos</span>
              <span><strong>Concluídos:</strong> {processosFiltrados.filter(p => p.atividades?.every(a => a.status === 'OK')).length}</span>
            </div>
          </div>

          {processosFiltrados.length === 0 ? (
            <div style={{ 
              background: 'white',
              padding: '60px 40px', 
              borderRadius: '12px', 
              textAlign: 'center', 
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid #e2e8f0'
            }}>
              <div style={{ fontSize: '64px', marginBottom: '20px' }}>📊</div>
              <h2 style={{ color: '#1e293b', marginBottom: '15px', fontSize: '24px', fontWeight: '600' }}>
                Nenhum Processo Encontrado
              </h2>
              <p style={{ color: '#64748b', fontSize: '16px', lineHeight: '1.6' }}>
                Crie processos primeiro para visualizar o workflow geral.
              </p>
            </div>
          ) : (
            <div style={{ 
              background: 'white', 
              borderRadius: '12px', 
              overflow: 'hidden', 
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid #e2e8f0'
            }}>
              {/* Linhas dos Processos */}
              {processosFiltrados.map((processo, index) => {
                const etapasDoProcesso = etapas.filter(etapa => 
                  processo.atividades?.some((mov: any) => mov.atividade.etapaId === etapa.id)
                )
                
                return (
                <div key={processo.id} style={{ 
                  marginBottom: '20px',
                  borderRadius: '12px',
                  overflow: 'hidden',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                  border: '1px solid #e2e8f0'
                }}>
                  {/* Header Individual - Entidade */}
                  <div style={{
                    background: '#f8fafc',
                    padding: '12px 16px',
                    borderBottom: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <div style={{
                      background: '#8b5cf6',
                      color: 'white',
                      padding: '6px',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}>
                      👥
                    </div>
                    <div style={{ flex: 1 }}>
                      <div 
                        onClick={() => irParaWorkflowIndividual(processo.id)}
                        style={{ 
                          fontWeight: '600', 
                          fontSize: '16px', 
                          color: '#1e293b',
                          cursor: 'pointer',
                          transition: 'color 0.2s ease',
                          marginBottom: '2px'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#3b82f6'}
                        onMouseLeave={(e) => e.currentTarget.style.color = '#1e293b'}
                        title="Clique para abrir workflow individual"
                      >
                        {processo.entidade.nome} 🔗
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>
                        {processo.entidade.tipo}
                      </div>
                    </div>
                  </div>

                  {/* Header Individual - Processo */}
                  <div style={{
                    background: 'white',
                    padding: '12px 16px',
                    borderBottom: '1px solid #e2e8f0',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px'
                  }}>
                    <div style={{
                      background: '#3b82f6',
                      color: 'white',
                      padding: '6px',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}>
                      ⚙️
                    </div>
                    <div style={{ 
                      background: '#3b82f6',
                      color: 'white',
                      padding: '8px 16px',
                      borderRadius: '8px',
                      fontSize: '14px',
                      fontWeight: '600'
                    }}>
                      {processo.tipoWorkflow.nome}
                    </div>
                  </div>

                  {/* Seção das Etapas */}
                  {etapasDoProcesso.length > 0 && (
                    <div style={{ 
                      background: 'white'
                    }}>
                      {/* Header das Etapas */}
                      <div style={{
                        background: '#f1f5f9',
                        padding: '12px 16px',
                        borderBottom: '1px solid #e2e8f0',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                      }}>
                        <div style={{
                          background: '#10b981',
                          color: 'white',
                          padding: '4px',
                          borderRadius: '4px',
                          fontSize: '12px'
                        }}>
                          📋
                        </div>
                        <span style={{
                          fontWeight: '600',
                          fontSize: '14px',
                          color: '#1e293b'
                        }}>
                          ETAPAS DO WORKFLOW
                        </span>
                        <span style={{
                          background: '#e2e8f0',
                          color: '#64748b',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: '500'
                        }}>
                          {etapasDoProcesso.length} etapas
                        </span>
                      </div>
                      
                      <div style={{ 
                        padding: '20px'
                      }}>
                      <div style={{ 
                        display: 'flex', 
                        gap: '12px', 
                        alignItems: 'flex-start',
                        position: 'relative',
                        paddingBottom: '8px'
                      }}>
                        {/* Linha de Progresso */}
                        <div style={{
                          position: 'absolute',
                          top: '32px',
                          left: '50px',
                          right: '50px',
                          height: '2px',
                          background: '#e2e8f0',
                          zIndex: 1
                        }} />
                        
                        {etapasDoProcesso.map((etapa, index) => {
                          const statusEtapa = getStatusEtapa(processo, etapa.id)
                          const cellId = `${processo.id}-${etapa.id}`

                          return (
                            <div key={etapa.id} style={{ 
                              display: 'flex', 
                              flexDirection: 'column', 
                              alignItems: 'center',
                              flex: '1',
                              minWidth: '100px',
                              position: 'relative',
                              zIndex: 2
                            }}>
                              {/* Título da Etapa */}
                              <div style={{
                                background: etapa.cor || '#3b82f6',
                                color: 'white',
                                padding: '6px 12px',
                                borderRadius: '6px 6px 0 0',
                                fontSize: '11px',
                                fontWeight: '600',
                                textAlign: 'center',
                                width: '100%',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                              }}>
                                {etapa.nome}
                              </div>
                              
                              {/* Status da Etapa - CLICÁVEL PARA EXPANDIR */}
                              <div
                                onClick={() => {
                                  if (statusEtapa.atividades.length > 0) {
                                    toggleExpandCell(processo.id, etapa.id)
                                  }
                                }}
                                onDoubleClick={() => statusEtapa.atividades.length > 0 && abrirDetalhes(processo, etapa)}
                                onMouseEnter={() => setHoveredCell(cellId)}
                                onMouseLeave={() => setHoveredCell(null)}
                                title={`${processo.entidade.nome} - ${etapa.nome}\n${statusEtapa.atividades.length} atividades\nStatus: ${statusEtapa.status}\nClique para expandir atividades\nDuplo clique para detalhes`}
                                style={{
                                  background: statusEtapa.cor,
                                  minHeight: '50px',
                                  width: '100%',
                                  borderRadius: '0 0 6px 6px',
                                  cursor: statusEtapa.atividades.length > 0 ? 'pointer' : 'default',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center',
                                  color: 'white',
                                  fontWeight: '600',
                                  fontSize: '14px',
                                  transition: 'all 0.3s ease',
                                  position: 'relative',
                                  transform: hoveredCell === cellId ? 'translateY(-2px)' : 'translateY(0)',
                                  boxShadow: hoveredCell === cellId ? '0 6px 16px rgba(0,0,0,0.15)' : '0 2px 4px rgba(0,0,0,0.1)',
                                  border: statusEtapa.status === 'concluido' ? '2px solid #10b981' : 
                                         statusEtapa.status === 'cancelado' ? '2px solid #ef4444' : 'none'
                                }}
                              >
                                {statusEtapa.status === 'concluido' && '✓ OK'}
                                {statusEtapa.status === 'andamento' && '⏳'}
                                {statusEtapa.status === 'cancelado' && '✗ NOK'}
                                {statusEtapa.status === 'vazio' && '-'}
                                
                                {statusEtapa.atividades.length > 0 && (
                                  <div style={{
                                    position: 'absolute',
                                    top: '4px',
                                    right: '4px',
                                    background: 'rgba(255,255,255,0.95)',
                                    borderRadius: '50%',
                                    width: '20px',
                                    height: '20px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    fontSize: '10px',
                                    fontWeight: 'bold',
                                    color: statusEtapa.cor,
                                    boxShadow: '0 1px 3px rgba(0,0,0,0.2)'
                                  }}>
                                    {statusEtapa.atividades.length}
                                  </div>
                                )}
                              </div>
                              
                              {/* Indicador de Progresso */}
                              {index < etapasDoProcesso.length - 1 && (
                                <div style={{
                                  position: 'absolute',
                                  top: '32px',
                                  right: '-6px',
                                  width: '12px',
                                  height: '12px',
                                  background: statusEtapa.status === 'concluido' ? '#10b981' : '#e2e8f0',
                                  borderRadius: '50%',
                                  zIndex: 3,
                                  border: '2px solid white',
                                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                                }} />
                              )}
                            </div>
                          )
                        })}
                      </div>
                      </div>
                    </div>
                  )}

                  {/* Linha Expandida com Botões OK/NOK */}
                  {expandedCell && expandedCell.startsWith(processo.id) && (
                    <div style={{ 
                      background: '#f8fafc',
                      padding: '20px',
                      borderTop: '2px solid #e2e8f0'
                    }}>
                      <h4 style={{ 
                        margin: '0 0 16px 0', 
                        fontSize: '16px', 
                        fontWeight: '600',
                        color: '#1e293b'
                      }}>
                        📋 Atividades - {etapas.find(e => expandedCell.endsWith(e.id))?.nome}
                      </h4>
                      
                      <div style={{ 
                        display: 'grid', 
                        gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', 
                        gap: '16px' 
                      }}>
                        {processo.atividades
                          .filter((mov: any) => mov.atividade.etapaId === expandedCell.split('-')[1])
                          .map((mov: any) => (
                            <div key={mov.id} style={{
                              background: 'white',
                              padding: '16px',
                              borderRadius: '8px',
                              border: `2px solid ${
                                mov.status === 'OK' ? '#10b981' : 
                                mov.status === 'NOK' ? '#ef4444' : '#f59e0b'
                              }`,
                              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                            }}>
                              <div style={{ 
                                display: 'flex', 
                                justifyContent: 'space-between', 
                                alignItems: 'flex-start',
                                marginBottom: '12px'
                              }}>
                                <div style={{ fontWeight: '600', fontSize: '14px', color: '#1e293b' }}>
                                  {mov.atividade.nome}
                                </div>
                                <div style={{ 
                                  padding: '4px 8px',
                                  borderRadius: '4px',
                                  fontSize: '11px',
                                  fontWeight: '600',
                                  background: mov.status === 'OK' ? '#dcfce7' : 
                                             mov.status === 'NOK' ? '#fee2e2' : '#fef3c7',
                                  color: mov.status === 'OK' ? '#166534' : 
                                         mov.status === 'NOK' ? '#991b1b' : '#92400e'
                                }}>
                                  {mov.status}
                                </div>
                              </div>
                              
                              <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>
                                🏢 Setor: {mov.atividade.setor || 'N/A'}
                              </div>
                              
                              {mov.status !== 'PENDENTE' && (mov.responsavel || mov.responsavelCompleto) && (
                                <div style={{ 
                                  fontSize: '11px', 
                                  color: mov.status === 'OK' ? '#10b981' : 
                                         mov.status === 'NOK' ? '#dc2626' : 
                                         mov.status === 'PAUSADO' ? '#f59e0b' : '#6b7280',
                                  marginBottom: '8px',
                                  fontWeight: '500'
                                }}>
                                  {mov.status === 'OK' ? '✓ Concluída por' : 
                                   mov.status === 'NOK' ? '✗ Marcada NOK por' : 
                                   mov.status === 'PAUSADO' ? '⏸ Pausada por' : 
                                   mov.status === 'CANCELADO' ? '🚫 Cancelada por' : 'Executada por'}: {mov.responsavelCompleto || mov.responsavel || (typeof mov.responsavel === 'object' ? mov.responsavel?.nome : mov.responsavel)}
                                </div>
                              )}
                              
                              {mov.status !== 'PENDENTE' && mov.horaFim && (
                                <div style={{ fontSize: '12px', color: '#2563eb', marginBottom: '8px' }}>
                                  📅 {new Date(mov.horaFim).toLocaleString('pt-BR')}
                                </div>
                              )}
                              
                              {mov.observacao && (
                                <div style={{ 
                                  fontSize: '12px', 
                                  color: '#64748b', 
                                  marginBottom: '12px',
                                  background: '#f8fafc',
                                  padding: '8px',
                                  borderRadius: '4px',
                                  border: '1px solid #e2e8f0'
                                }}>
                                  💬 Observação: {mov.observacao}
                                </div>
                              )}

                              {/* Botões OK/NOK para cada atividade */}
                              <div style={{ display: 'flex', gap: '8px' }}>
                                {mov.atividade.nome.includes('Finalização Etapa') ? (
                                  // Indicador de finalização automática
                                  <div
                                    style={{
                                      background: mov.status === 'OK' ? '#10b981' : '#f3f4f6',
                                      color: mov.status === 'OK' ? 'white' : '#9ca3af',
                                      border: 'none',
                                      borderRadius: '4px',
                                      padding: '6px 12px',
                                      fontSize: '12px',
                                      fontWeight: '600',
                                      display: 'flex',
                                      alignItems: 'center',
                                      gap: '4px'
                                    }}
                                  >
                                    {mov.status === 'OK' ? (
                                      <>
                                        ✓ Finalizada
                                        <span style={{ fontSize: '10px', opacity: 0.8 }}>(Auto)</span>
                                      </>
                                    ) : (
                                      <>
                                        ⏳ Aguardando
                                        <span style={{ fontSize: '10px' }}>(Auto)</span>
                                      </>
                                    )}
                                  </div>
                                ) : (
                                  // Botões normais
                                  <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                    {(mov.status === 'PAUSADO' || mov.status === 'CANCELADO') ? (
                                      <button
                                        onClick={() => abrirModal(mov.id, 'PENDENTE')}
                                        style={{
                                          background: '#3b82f6',
                                          color: 'white',
                                          border: 'none',
                                          borderRadius: '4px',
                                          padding: '6px 12px',
                                          fontSize: '12px',
                                          cursor: 'pointer',
                                          fontWeight: '600'
                                        }}
                                      >
                                        🔄 Reabrir
                                      </button>
                                    ) : (
                                      <>
                                        <button
                                          onClick={() => abrirModal(mov.id, 'OK')}
                                          style={{
                                            background: mov.status === 'OK' ? '#10b981' : '#e5e7eb',
                                            color: mov.status === 'OK' ? 'white' : '#666',
                                            border: 'none',
                                            borderRadius: '4px',
                                            padding: '6px 12px',
                                            fontSize: '12px',
                                            cursor: 'pointer',
                                            fontWeight: '600'
                                          }}
                                        >
                                          ✓ OK
                                        </button>
                                        <button
                                          onClick={() => abrirModal(mov.id, 'NOK')}
                                          style={{
                                            background: mov.status === 'NOK' ? '#dc2626' : '#e5e7eb',
                                            color: mov.status === 'NOK' ? 'white' : '#666',
                                            border: 'none',
                                            borderRadius: '4px',
                                            padding: '6px 12px',
                                            fontSize: '12px',
                                            cursor: 'pointer',
                                            fontWeight: '600'
                                          }}
                                        >
                                          ✗ NOK
                                        </button>
                                        <button
                                          onClick={() => abrirModal(mov.id, 'PAUSADO')}
                                          style={{
                                            background: mov.status === 'PAUSADO' ? '#f59e0b' : '#e5e7eb',
                                            color: mov.status === 'PAUSADO' ? 'white' : '#666',
                                            border: 'none',
                                            borderRadius: '4px',
                                            padding: '6px 12px',
                                            fontSize: '12px',
                                            cursor: 'pointer',
                                            fontWeight: '600'
                                          }}
                                        >
                                          ⏸ Pausar
                                        </button>
                                        <button
                                          onClick={() => abrirModal(mov.id, 'CANCELADO')}
                                          style={{
                                            background: mov.status === 'CANCELADO' ? '#6b7280' : '#e5e7eb',
                                            color: mov.status === 'CANCELADO' ? 'white' : '#666',
                                            border: 'none',
                                            borderRadius: '4px',
                                            padding: '6px 12px',
                                            fontSize: '12px',
                                            cursor: 'pointer',
                                            fontWeight: '600'
                                          }}
                                        >
                                          🚫 Cancelar
                                        </button>
                                      </>
                                    )}
                                  </div>
                                )}
                              </div>
                            </div>
                          ))}
                      </div>
                    </div>
                  )}
                </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
      
      {/* Modal de Detalhes */}
      {modalDetalhes && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          padding: '20px'
        }}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '0',
            maxWidth: '600px',
            width: '100%',
            maxHeight: '80vh',
            overflow: 'hidden',
            boxShadow: '0 25px 50px rgba(0,0,0,0.25)'
          }}>
            <div style={{
              background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
              color: 'white',
              padding: '20px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
                  📋 {modalDetalhes.etapa.nome}
                </h3>
                <p style={{ margin: '4px 0 0 0', fontSize: '14px', opacity: 0.9 }}>
                  {modalDetalhes.processo.entidade.nome}
                </p>
              </div>
              <button
                onClick={() => setModalDetalhes(null)}
                style={{
                  background: 'rgba(255,255,255,0.2)',
                  border: 'none',
                  borderRadius: '50%',
                  width: '32px',
                  height: '32px',
                  color: 'white',
                  cursor: 'pointer',
                  fontSize: '16px'
                }}
              >
                ✕
              </button>
            </div>
            
            <div style={{ padding: '20px', maxHeight: '400px', overflowY: 'auto' }}>
              {(() => {
                const statusEtapa = getStatusEtapa(modalDetalhes.processo, modalDetalhes.etapa.id)
                return (
                  <div>
                    <h4 style={{ margin: '0 0 12px 0', fontSize: '16px', fontWeight: '600' }}>Atividades:</h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                      {statusEtapa.atividades.map((atividade) => (
                        <div key={atividade.id} style={{
                          padding: '12px',
                          background: '#f8fafc',
                          borderRadius: '8px',
                          border: `2px solid ${
                            atividade.status === 'OK' ? '#10b981' :
                            atividade.status === 'NOK' ? '#ef4444' : '#f59e0b'
                          }`
                        }}>
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <span style={{ fontWeight: '600', fontSize: '14px' }}>{atividade.atividade.nome}</span>
                            <span style={{
                              padding: '4px 8px',
                              borderRadius: '4px',
                              fontSize: '12px',
                              fontWeight: '600',
                              background: atividade.status === 'OK' ? '#dcfce7' :
                                         atividade.status === 'NOK' ? '#fee2e2' : '#fef3c7',
                              color: atividade.status === 'OK' ? '#166534' :
                                     atividade.status === 'NOK' ? '#991b1b' : '#92400e'
                            }}>
                              {atividade.status}
                            </span>
                          </div>
                          <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>
                            🏢 Setor: {atividade.atividade.setor || 'N/A'}
                          </div>
                          
                          {atividade.status !== 'PENDENTE' && (atividade.responsavel || atividade.responsavelCompleto) && (
                            <div style={{ 
                              fontSize: '11px', 
                              color: atividade.status === 'OK' ? '#10b981' : 
                                     atividade.status === 'NOK' ? '#dc2626' : 
                                     atividade.status === 'PAUSADO' ? '#f59e0b' : '#6b7280',
                              marginBottom: '8px',
                              fontWeight: '500'
                            }}>
                              {atividade.status === 'OK' ? '✓ Concluída por' : 
                               atividade.status === 'NOK' ? '✗ Marcada NOK por' : 
                               atividade.status === 'PAUSADO' ? '⏸ Pausada por' : 
                               atividade.status === 'CANCELADO' ? '🚫 Cancelada por' : 'Executada por'}: {atividade.responsavelCompleto || atividade.responsavel || (typeof atividade.responsavel === 'object' ? atividade.responsavel?.nome : atividade.responsavel)}
                            </div>
                          )}
                          
                          {atividade.status !== 'PENDENTE' && atividade.horaFim && (
                            <div style={{ fontSize: '12px', color: '#2563eb', marginBottom: '8px' }}>
                              📅 {new Date(atividade.horaFim).toLocaleString('pt-BR')}
                            </div>
                          )}
                          
                          {atividade.observacao && (
                            <div style={{ 
                              fontSize: '12px', 
                              color: '#64748b', 
                              marginBottom: '12px',
                              background: '#f8fafc',
                              padding: '8px',
                              borderRadius: '4px',
                              border: '1px solid #e2e8f0'
                            }}>
                              💬 Observação: {atividade.observacao}
                            </div>
                          )}
                          
                          {/* Botões OK/NOK no modal também */}
                          <div style={{ display: 'flex', gap: '8px' }}>
                            {atividade.atividade.nome.includes('Finalização Etapa') ? (
                              // Indicador de finalização automática
                              <div
                                style={{
                                  background: atividade.status === 'OK' ? '#10b981' : '#f3f4f6',
                                  color: atividade.status === 'OK' ? 'white' : '#9ca3af',
                                  border: 'none',
                                  borderRadius: '4px',
                                  padding: '6px 12px',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}
                              >
                                {atividade.status === 'OK' ? (
                                  <>
                                    ✓ Finalizada
                                    <span style={{ fontSize: '10px', opacity: 0.8 }}>(Auto)</span>
                                  </>
                                ) : (
                                  <>
                                    ⏳ Aguardando
                                    <span style={{ fontSize: '10px' }}>(Auto)</span>
                                  </>
                                )}
                              </div>
                            ) : (
                              // Botões normais
                              <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
                                {(atividade.status === 'PAUSADO' || atividade.status === 'CANCELADO') ? (
                                  <button
                                    onClick={() => {
                                      abrirModal(atividade.id, 'PENDENTE')
                                      setModalDetalhes(null)
                                    }}
                                    style={{
                                      padding: '6px 12px',
                                      background: '#3b82f6',
                                      color: 'white',
                                      border: 'none',
                                      borderRadius: '4px',
                                      fontSize: '12px',
                                      fontWeight: '600',
                                      cursor: 'pointer'
                                    }}
                                  >
                                    🔄 Reabrir
                                  </button>
                                ) : (
                                  <>
                                    <button
                                      onClick={() => {
                                        abrirModal(atividade.id, 'OK')
                                        setModalDetalhes(null)
                                      }}
                                      style={{
                                        padding: '6px 12px',
                                        background: atividade.status === 'OK' ? '#10b981' : '#e5e7eb',
                                        color: atividade.status === 'OK' ? 'white' : '#666',
                                        border: 'none',
                                        borderRadius: '4px',
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        cursor: 'pointer'
                                      }}
                                    >
                                      ✓ OK
                                    </button>
                                    <button
                                      onClick={() => {
                                        abrirModal(atividade.id, 'NOK')
                                        setModalDetalhes(null)
                                      }}
                                      style={{
                                        padding: '6px 12px',
                                        background: atividade.status === 'NOK' ? '#dc2626' : '#e5e7eb',
                                        color: atividade.status === 'NOK' ? 'white' : '#666',
                                        border: 'none',
                                        borderRadius: '4px',
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        cursor: 'pointer'
                                      }}
                                    >
                                      ✗ NOK
                                    </button>
                                    <button
                                      onClick={() => {
                                        abrirModal(atividade.id, 'PAUSADO')
                                        setModalDetalhes(null)
                                      }}
                                      style={{
                                        padding: '6px 12px',
                                        background: atividade.status === 'PAUSADO' ? '#f59e0b' : '#e5e7eb',
                                        color: atividade.status === 'PAUSADO' ? 'white' : '#666',
                                        border: 'none',
                                        borderRadius: '4px',
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        cursor: 'pointer'
                                      }}
                                    >
                                      ⏸ Pausar
                                    </button>
                                    <button
                                      onClick={() => {
                                        abrirModal(atividade.id, 'CANCELADO')
                                        setModalDetalhes(null)
                                      }}
                                      style={{
                                        padding: '6px 12px',
                                        background: atividade.status === 'CANCELADO' ? '#6b7280' : '#e5e7eb',
                                        color: atividade.status === 'CANCELADO' ? 'white' : '#666',
                                        border: 'none',
                                        borderRadius: '4px',
                                        fontSize: '12px',
                                        fontWeight: '600',
                                        cursor: 'pointer'
                                      }}
                                    >
                                      🚫 Cancelar
                                    </button>
                                  </>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )
              })()} 
            </div>
            
            <div style={{
              padding: '16px 20px',
              background: '#f8fafc',
              borderTop: '1px solid #e2e8f0',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <button
                onClick={() => irParaWorkflowIndividual(modalDetalhes.processo.id)}
                style={{
                  padding: '8px 16px',
                  background: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                🔗 Abrir Workflow Individual
              </button>
              <button
                onClick={() => setModalDetalhes(null)}
                style={{
                  padding: '8px 16px',
                  background: '#6b7280',
                  color: 'white',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
      
      <style jsx>{`
        @keyframes successSlideIn {
          from { opacity: 0; transform: scale(0.9) translateY(-20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        
        @keyframes successPulse {
          0% { transform: scale(0.8); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }
        
        @keyframes progressBar {
          from { width: 100%; }
          to { width: 0%; }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.9) translateY(-20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  )
}