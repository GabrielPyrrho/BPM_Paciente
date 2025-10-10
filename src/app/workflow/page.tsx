'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

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

interface Etapa {
  id: string
  nome: string
  cor?: string
  ordem: number
}

interface EntidadeProcesso {
  id: string
  nome: string
  processoId: string
  tipoWorkflow: string
  tipo: string
}

interface Usuario {
  id: string
  nome: string
  setor?: {
    nome: string
  }
  ativo: boolean
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
        padding: '24px',
        maxWidth: '400px',
        width: '100%',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
      }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600', color: '#1e293b' }}>
          Usuário Obrigatório
        </h3>
        <p style={{ margin: '0 0 24px 0', fontSize: '14px', color: '#64748b' }}>
          Para executar uma atividade é necessário selecionar o usuário responsável.
        </p>
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
          fontSize: '40px'
        }}>
          {status === 'OK' ? '✅' : status === 'NOK' ? '❌' : status === 'PAUSADO' ? '⏸️' : status === 'PENDENTE' ? '🔄' : '🚫'}
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
          margin: '0 0 24px 0',
          fontWeight: '500'
        }}>
          {atividade.nome}
        </p>
        
        <button
          onClick={onClose}
          style={{
            padding: '8px 16px',
            background: 'transparent',
            border: '1px solid #e2e8f0',
            borderRadius: '8px',
            color: '#64748b',
            fontSize: '14px',
            cursor: 'pointer'
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
        padding: '24px',
        maxWidth: '500px',
        width: '100%',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
      }}>
        <h3 style={{ margin: '0 0 16px 0', fontSize: '18px', fontWeight: '600', color: '#1e293b' }}>
          {statusText} Atividade
        </h3>
        
        <div style={{
          backgroundColor: '#f8fafc',
          padding: '16px',
          borderRadius: '8px',
          marginBottom: '20px',
          border: '1px solid #e2e8f0'
        }}>
          <div style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b', marginBottom: '4px' }}>
            {atividade.nome}
          </div>
          <div style={{ fontSize: '12px', color: '#64748b' }}>
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
              boxSizing: 'border-box'
            }}
          />
          <div style={{ fontSize: '12px', color: '#9ca3af', marginTop: '6px' }}>
            {observacao.length}/500 caracteres
          </div>
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
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
              cursor: 'pointer'
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
              cursor: 'pointer'
            }}
          >
            {statusText}
          </button>
        </div>
      </div>
    </div>
  )
}

export default function WorkflowPage() {
  const router = useRouter()
  const [usuarioAtual, setUsuarioAtual] = useState('')
  const [entidadeSelecionada, setEntidadeSelecionada] = useState('')
  const [entidades, setEntidades] = useState<EntidadeProcesso[]>([])
  const [atividades, setAtividades] = useState<Atividade[]>([])
  const [etapas, setEtapas] = useState<Etapa[]>([])
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [workflowIdFromUrl, setWorkflowIdFromUrl] = useState<string | null>(null)
  
  // Estados dos modais
  const [modalAberto, setModalAberto] = useState(false)
  const [modalSucessoAberto, setModalSucessoAberto] = useState(false)
  const [modalAvisoAberto, setModalAvisoAberto] = useState(false)
  const [atividadeModal, setAtividadeModal] = useState<Atividade | null>(null)
  const [statusModal, setStatusModal] = useState<'OK' | 'NOK' | 'PAUSADO' | 'CANCELADO' | 'PENDENTE'>('OK')

  // Detectar ID do workflow na URL
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search)
    const workflowId = urlParams.get('id')
    if (workflowId) {
      setWorkflowIdFromUrl(workflowId)
    }
  }, [])

  // Carregar usuário logado do localStorage
  useEffect(() => {
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

  // Carregar etapas, usuários e pacientes
  useEffect(() => {
    // Carregar etapas
    fetch('/api/etapas')
      .then(res => res.json())
      .then(data => {
        setEtapas(data.sort((a: Etapa, b: Etapa) => a.ordem - b.ordem))
      })
      .catch(error => {
        console.error('Erro ao carregar etapas:', error)
        setEtapas([])
      })

    // Carregar usuários
    fetch('/api/usuarios')
      .then(res => res.json())
      .then(data => {
        setUsuarios(Array.isArray(data) ? data : [])
      })
      .catch(error => {
        console.error('Erro ao carregar usuários:', error)
        setUsuarios([])
      })

    // Carregar entidades com processos
    fetch('/api/processos')
      .then(res => res.json())
      .then(data => {
        const entidadesComProcessos = data.map((processo: any) => ({
          id: processo.entidade.id,
          nome: processo.entidade.nome,
          processoId: processo.id,
          tipoWorkflow: processo.tipoWorkflow.nome,
          tipo: processo.entidade.tipo
        }))
        setEntidades(entidadesComProcessos)
        
        // Se há um ID de workflow na URL, selecionar automaticamente
        if (workflowIdFromUrl && entidadesComProcessos.length > 0) {
          const entidadeDoWorkflow = entidadesComProcessos.find(e => e.processoId === workflowIdFromUrl)
          if (entidadeDoWorkflow) {
            setEntidadeSelecionada(entidadeDoWorkflow.id)
          }
        }
      })
      .catch(error => {
        console.error('Erro ao carregar entidades:', error)
        setEntidades([])
      })
  }, [workflowIdFromUrl])

  // Carregar atividades baseadas no tipo de workflow do processo
  useEffect(() => {
    if (entidadeSelecionada) {
      const entidade = entidades.find(e => e.id === entidadeSelecionada)
      if (!entidade) return

      fetch(`/api/processos/${entidade.processoId}`)
        .then(res => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`)
          return res.json()
        })
        .then(processo => {
          if (processo.atividades) {
            const atividadesFormatadas = processo.atividades.map((mov: any) => {
              const etapa = etapas.find(e => e.id === mov.atividade.etapaId)
              return {
                id: mov.id,
                nome: mov.atividade.nome,
                setor: mov.atividade.setor || 'N/A',
                grupo: etapa ? etapa.nome : 'Sem Etapa',
                status: mov.status,
                dataHora: mov.horaFim ? new Date(mov.horaFim).toLocaleString('pt-BR') : undefined,
                responsavel: mov.responsavelCompleto || mov.responsavel?.nome,
                observacao: mov.observacao
              }
            })
            setAtividades(atividadesFormatadas)
          }
        })
        .catch(error => {
          console.error('Erro ao carregar atividades:', error)
          setAtividades([])
        })
    }
  }, [entidadeSelecionada, entidades, etapas])

  const abrirModal = (id: string, novoStatus: 'OK' | 'NOK' | 'PAUSADO' | 'CANCELADO' | 'PENDENTE') => {
    if (!usuarioAtual) {
      setModalAvisoAberto(true)
      return
    }

    if (!entidadeSelecionada) {
      alert('Selecione uma entidade primeiro!')
      return
    }

    const atividade = atividades.find(a => a.id === id)
    if (!atividade) {
      alert('Atividade não encontrada!')
      return
    }

    // Bloquear marcação manual de finalização
    if (atividade.nome.includes('Finalização Etapa')) {
      alert('A finalização da etapa é automática quando todas as atividades são concluídas!')
      return
    }

    setAtividadeModal(atividade)
    setStatusModal(novoStatus)
    setModalAberto(true)
  }

  const confirmarAtividade = async (observacao: string) => {
    if (!atividadeModal) {
      return
    }

    const usuarioSelecionado = usuarios.find(u => u.nome === usuarioAtual)
    const setorUsuario = usuarioSelecionado?.setor?.nome || 'Sem setor'

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

      // Recarregar atividades
      const entidade = entidades.find(e => e.id === entidadeSelecionada)
      if (entidade) {
        const res = await fetch(`/api/processos/${entidade.processoId}`)
        if (!res.ok) {
          throw new Error('Erro ao recarregar processo')
        }
        
        const processo = await res.json()
        
        if (processo.atividades) {
          const atividadesFormatadas = processo.atividades.map((mov: any) => {
            const etapa = etapas.find(e => e.id === mov.atividade.etapaId)
            return {
              id: mov.id,
              nome: mov.atividade.nome,
              setor: mov.atividade.setor || 'N/A',
              grupo: etapa ? etapa.nome : 'Sem Etapa',
              status: mov.status,
              dataHora: mov.horaFim ? new Date(mov.horaFim).toLocaleString('pt-BR') : undefined,
              responsavel: mov.responsavelCompleto || mov.responsavel?.nome,
              observacao: mov.observacao
            }
          })
          setAtividades(atividadesFormatadas)
          
          // Mostrar modal de sucesso
          setModalSucessoAberto(true)
        }
      }
    } catch (error) {
      console.error('Erro ao atualizar atividade:', error)
      alert(`Erro ao atualizar atividade: ${error.message}`)
    }
  }

  const grupos = [...new Set(atividades.map(a => a.grupo))].filter(Boolean)

  return (
    <div style={{ 
      minHeight: '100vh',
      background: '#f8fafc',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Modais */}
      <ModalObservacao
        isOpen={modalAberto}
        onClose={() => setModalAberto(false)}
        onConfirm={confirmarAtividade}
        atividade={atividadeModal}
        status={statusModal}
      />
      
      <ModalSucesso
        isOpen={modalSucessoAberto}
        onClose={() => setModalSucessoAberto(false)}
        atividade={atividadeModal}
        status={statusModal}
      />
      
      <ModalAviso
        isOpen={modalAvisoAberto}
        onClose={() => setModalAvisoAberto(false)}
      />
      
      {/* Header */}
      <div style={{ 
        background: 'white',
        borderBottom: '1px solid #e2e8f0',
        padding: '16px 0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
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
                <h1 style={{ color: '#1e293b', fontSize: '20px', margin: 0, fontWeight: '600' }}>Workflow BPM</h1>
                <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>Controle de atividades genéricas</p>
              </div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
              {usuarioAtual && (
                <div style={{
                  background: '#10b981',
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '500'
                }}>
                  👤 {usuarioAtual}
                </div>
              )}
              <div style={{ color: '#64748b', fontSize: '14px' }}>
                {new Date().toLocaleDateString('pt-BR')} - {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Controles */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                Entidade *
              </label>
              <select 
                value={entidadeSelecionada} 
                onChange={(e) => setEntidadeSelecionada(e.target.value)}
                style={{ 
                  width: '100%',
                  padding: '12px 16px', 
                  borderRadius: '8px', 
                  border: '1px solid #d1d5db', 
                  fontSize: '14px',
                  background: 'white',
                  boxSizing: 'border-box'
                }}
              >
                <option value="">Selecionar Entidade</option>
                {entidades.map(entidade => (
                  <option key={entidade.processoId} value={entidade.id}>
                    {entidade.nome} ({entidade.tipo}) - {entidade.tipoWorkflow}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                Usuário Responsável *
              </label>
              <select 
                value={usuarioAtual} 
                onChange={(e) => setUsuarioAtual(e.target.value)}
                style={{ 
                  width: '100%',
                  padding: '12px 16px', 
                  borderRadius: '8px', 
                  border: usuarioAtual ? '2px solid #10b981' : '1px solid #d1d5db', 
                  fontSize: '14px',
                  background: usuarioAtual ? '#f0fdf4' : 'white',
                  boxSizing: 'border-box'
                }}
              >
                <option value="">Selecionar Usuário</option>
                {Array.isArray(usuarios) && usuarios.map(usuario => (
                  <option key={usuario.id} value={usuario.nome}>
                    {usuario.nome} - {usuario.setor?.nome || 'Sem setor'}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {!entidadeSelecionada ? (
          <div style={{ 
            background: 'white',
            padding: '60px 40px', 
            borderRadius: '12px', 
            textAlign: 'center', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>🏥</div>
            <h2 style={{ color: '#1e293b', marginBottom: '15px', fontSize: '24px', fontWeight: '600' }}>Selecione uma Entidade</h2>
            <p style={{ color: '#64748b', fontSize: '16px', lineHeight: '1.6' }}>
              {entidades.length === 0 
                ? 'Nenhuma entidade com processo cadastrada. Crie um processo primeiro.' 
                : 'Escolha uma entidade acima para visualizar e gerenciar o workflow.'
              }
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: '20px' }}>
            {grupos.map((grupo) => {
              const atividadesGrupo = atividades.filter(a => a.grupo === grupo)
              const concluidas = atividadesGrupo.filter(a => a.status === 'OK').length
              const total = atividadesGrupo.length
              const etapa = etapas.find(e => e.nome === grupo)
              
              return (
                <div key={grupo} style={{ 
                  background: 'white',
                  borderRadius: '12px', 
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)', 
                  border: '1px solid #e2e8f0',
                  overflow: 'hidden'
                }}>
                  {/* Header do Grupo */}
                  <div style={{ 
                    background: etapa?.cor || '#3b82f6',
                    color: 'white', 
                    padding: '16px 20px', 
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>{grupo}</h3>
                      <div style={{ fontSize: '14px', marginTop: '4px', opacity: 0.9 }}>
                        {concluidas}/{total} concluídas
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <div style={{ 
                        padding: '6px 12px', 
                        background: 'rgba(255,255,255,0.2)', 
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        📊 {grupo === 'Captação' ? '24h' : '48h'}
                      </div>
                      <div style={{ fontSize: '20px' }}>🏷️</div>
                    </div>
                  </div>

                  {/* Lista de Atividades */}
                  <div style={{ padding: '16px' }}>
                    {atividadesGrupo.map(atividade => (
                      <div key={atividade.id} style={{ 
                        marginBottom: '16px', 
                        border: `2px solid ${atividade.status === 'OK' ? '#10b981' : 
                                                atividade.status === 'NOK' ? '#dc2626' : 
                                                atividade.status === 'PAUSADO' ? '#f59e0b' : 
                                                atividade.status === 'CANCELADO' ? '#6b7280' : '#e2e8f0'}`,
                        borderRadius: '8px',
                        background: 'white',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                        overflow: 'hidden'
                      }}>
                        <div style={{ padding: '16px' }}>
                          <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '8px', color: '#1e293b' }}>
                            {atividade.nome}
                          </div>
                          
                          <div style={{ fontSize: '12px', color: '#64748b', marginBottom: '8px' }}>
                            Setor: {atividade.setor}
                          </div>
                          
                          {atividade.status !== 'PENDENTE' && atividade.dataHora && (
                            <div style={{ fontSize: '12px', color: '#2563eb', marginBottom: '8px' }}>
                              📅 {atividade.dataHora}
                            </div>
                          )}
                          
                          {atividade.status !== 'PENDENTE' && atividade.responsavel && (
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
                               atividade.status === 'CANCELADO' ? '🚫 Cancelada por' : 'Executada por'}: {atividade.responsavel}
                            </div>
                          )}
                          
                          {atividade.observacao && (
                            <div style={{ 
                              fontSize: '11px', 
                              color: '#f59e0b', 
                              marginBottom: '12px', 
                              fontStyle: 'italic',
                              background: '#fffbeb',
                              padding: '6px 8px',
                              borderRadius: '4px',
                              border: '1px solid #fef3c7'
                            }}>
                              💬 {atividade.observacao}
                            </div>
                          )}
                          
                          <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                            {atividade.nome.includes('Finalização Etapa') ? (
                              <div style={{
                                background: atividade.status === 'OK' ? '#10b981' : '#f3f4f6',
                                color: atividade.status === 'OK' ? 'white' : '#9ca3af',
                                border: 'none',
                                borderRadius: '4px',
                                padding: '6px 12px',
                                fontSize: '12px',
                                fontWeight: '600'
                              }}>
                                {atividade.status === 'OK' ? '✓ Finalizada (Auto)' : '⏳ Aguardando (Auto)'}
                              </div>
                            ) : (
                              <>
                                {(atividade.status === 'PAUSADO' || atividade.status === 'CANCELADO') ? (
                                  <button
                                    onClick={() => abrirModal(atividade.id, 'PENDENTE')}
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
                                      onClick={() => abrirModal(atividade.id, 'OK')}
                                      style={{
                                        background: atividade.status === 'OK' ? '#10b981' : '#e5e7eb',
                                        color: atividade.status === 'OK' ? 'white' : '#666',
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
                                      onClick={() => abrirModal(atividade.id, 'NOK')}
                                      style={{
                                        background: atividade.status === 'NOK' ? '#dc2626' : '#e5e7eb',
                                        color: atividade.status === 'NOK' ? 'white' : '#666',
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
                                      onClick={() => abrirModal(atividade.id, 'PAUSADO')}
                                      style={{
                                        background: atividade.status === 'PAUSADO' ? '#f59e0b' : '#e5e7eb',
                                        color: atividade.status === 'PAUSADO' ? 'white' : '#666',
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
                                      onClick={() => abrirModal(atividade.id, 'CANCELADO')}
                                      style={{
                                        background: atividade.status === 'CANCELADO' ? '#6b7280' : '#e5e7eb',
                                        color: atividade.status === 'CANCELADO' ? 'white' : '#666',
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
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}