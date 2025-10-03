'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Atividade {
  id: string
  nome: string
  setor: string
  grupo: string
  status: 'PENDENTE' | 'OK' | 'NOK'
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

interface ModalObservacaoProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (observacao: string) => void
  atividade: Atividade | null
  status: 'OK' | 'NOK'
}

interface ModalSucessoProps {
  isOpen: boolean
  onClose: () => void
  atividade: Atividade | null
  status: 'OK' | 'NOK'
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

  const statusColor = status === 'OK' ? '#10b981' : '#ef4444'
  const statusText = status === 'OK' ? 'Concluída' : 'Marcada como NOK'
  const statusIcon = status === 'OK' ? '✅' : '❌'

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

  const statusColor = status === 'OK' ? '#10b981' : '#ef4444'
  const statusText = status === 'OK' ? 'Concluir' : 'Marcar como NOK'
  const statusIcon = status === 'OK' ? '✓' : '✗'

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

export default function WorkflowPage() {
  const router = useRouter()
  const [usuarioAtual, setUsuarioAtual] = useState('')
  const [entidadeSelecionada, setEntidadeSelecionada] = useState('')
  const [entidades, setEntidades] = useState<EntidadeProcesso[]>([])
  const [atividades, setAtividades] = useState<Atividade[]>([])
  const [etapas, setEtapas] = useState<Etapa[]>([])
  
  // Estados dos modais
  const [modalAberto, setModalAberto] = useState(false)
  const [modalSucessoAberto, setModalSucessoAberto] = useState(false)
  const [atividadeModal, setAtividadeModal] = useState<Atividade | null>(null)
  const [statusModal, setStatusModal] = useState<'OK' | 'NOK'>('OK')

  // Carregar etapas e pacientes
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
      })
      .catch(error => {
        console.error('Erro ao carregar entidades:', error)
        setEntidades([])
      })
  }, [])

  // Carregar atividades baseadas no tipo de workflow do processo
  useEffect(() => {
    if (entidadeSelecionada) {
      const entidade = entidades.find(e => e.id === entidadeSelecionada)
      if (!entidade) return

      console.log('Carregando atividades para processo:', entidade.processoId)
      
      fetch(`/api/processos/${entidade.processoId}`)
        .then(res => {
          if (!res.ok) throw new Error(`HTTP ${res.status}`)
          return res.json()
        })
        .then(processo => {
          console.log('Processo carregado:', processo)
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
                responsavel: mov.responsavel?.nome,
                observacao: mov.observacao
              }
            })
            console.log('Atividades formatadas:', atividadesFormatadas)
            setAtividades(atividadesFormatadas)
          }
        })
        .catch(error => {
          console.error('Erro ao carregar atividades:', error)
          setAtividades([])
        })
    }
  }, [entidadeSelecionada, entidades, etapas])

  const abrirModal = (id: string, novoStatus: 'OK' | 'NOK') => {
    console.log('Abrindo modal para atividade:', id, 'status:', novoStatus)
    
    if (!usuarioAtual) {
      alert('Selecione um usuário primeiro!')
      return
    }

    if (!entidadeSelecionada) {
      alert('Selecione uma entidade primeiro!')
      return
    }

    const atividade = atividades.find(a => a.id === id)
    if (!atividade) {
      console.error('Atividade não encontrada:', id)
      alert('Atividade não encontrada!')
      return
    }

    console.log('Atividade encontrada:', atividade)

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
      console.error('Nenhuma atividade selecionada')
      return
    }

    console.log('Confirmando atividade:', atividadeModal.id, 'status:', statusModal)

    try {
      const response = await fetch(`/api/workflow/${atividadeModal.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: statusModal,
          responsavel: usuarioAtual,
          observacao: observacao || null
        })
      })

      console.log('Response status:', response.status)

      if (!response.ok) {
        const errorData = await response.json()
        console.error('Erro na resposta:', errorData)
        throw new Error(errorData.error || 'Erro na resposta do servidor')
      }

      const result = await response.json()
      console.log('Atividade atualizada:', result)

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
              responsavel: mov.responsavel?.nome,
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

  const grupos = etapas.map(etapa => etapa.nome)

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
      
      {/* Header Corporativo */}
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
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
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
            <div style={{
              color: '#64748b',
              fontSize: '14px'
            }}>
              {new Date().toLocaleDateString('pt-BR')} - {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Breadcrumb e Controles */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{
            fontSize: '14px',
            color: '#64748b',
            marginBottom: '8px'
          }}>
            Início › Workflow › Controle de Atividades
          </div>
          <h2 style={{ 
            fontSize: '28px', 
            fontWeight: '700', 
            color: '#1e293b',
            margin: '0',
            marginBottom: '8px'
          }}>
            Controle de Workflow
          </h2>
          <p style={{
            fontSize: '16px',
            color: '#64748b',
            margin: '0'
          }}>
            Gerencie as atividades dos processos de workflow
          </p>
        </div>
        
        {/* Painel de Controles */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 200px', gap: '16px', alignItems: 'end' }}>
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
                  border: '1px solid #d1d5db', 
                  fontSize: '14px',
                  background: 'white',
                  boxSizing: 'border-box'
                }}
              >
                <option value="">Selecionar Usuário</option>
                <option value="Dr. João Silva">Dr. João Silva - Médico</option>
                <option value="Enf. Maria Santos">Enf. Maria Santos - Enfermagem</option>
                <option value="Ana Costa">Ana Costa - Farmácia</option>
                <option value="Carlos Lima">Carlos Lima - Logística</option>
                <option value="Paula Financeiro">Paula Financeiro - Financeiro</option>
                <option value="Supervisor">Supervisor Geral</option>
              </select>
            </div>
            {entidades.find(e => e.id === entidadeSelecionada) && (
              <div style={{ 
                background: '#8b5cf6', 
                color: 'white', 
                padding: '12px 16px', 
                borderRadius: '8px', 
                fontSize: '14px',
                fontWeight: '600',
                textAlign: 'center'
              }}>
                {entidades.find(e => e.id === entidadeSelecionada)?.tipoWorkflow}
              </div>
            )}
          </div>
          
          {entidadeSelecionada && (
            <div style={{ 
              marginTop: '20px',
              padding: '16px',
              background: '#f8fafc',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px'
            }}>
              <div>
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>ENTIDADE</span>
                <div style={{ fontSize: '14px', color: '#1e293b', fontWeight: '600' }}>
                  {entidades.find(e => e.id === entidadeSelecionada)?.nome || 'Não selecionado'}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>DATA</span>
                <div style={{ fontSize: '14px', color: '#1e293b', fontWeight: '600' }}>
                  {new Date().toLocaleDateString('pt-BR')}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>USUÁRIO</span>
                <div style={{ fontSize: '14px', color: '#1e293b', fontWeight: '600' }}>
                  {usuarioAtual || 'Não selecionado'}
                </div>
              </div>
            </div>
          )}
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
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
            {grupos.map((grupo, index) => {
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
                      {/* Status da Etapa */}
                      <div style={{ 
                        padding: '6px 12px', 
                        background: 'rgba(255,255,255,0.2)', 
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        <span>📊</span>
                        <span style={{ color: 'white' }}>
                          {grupo === 'Captação' ? '24h' : '48h'}
                        </span>
                      </div>
                      
                      <div style={{ fontSize: '20px' }}>
                        🏷️
                      </div>
                    </div>
                  </div>

                  {/* Lista de Atividades */}
                  <div style={{ padding: '20px' }}>
                    {atividadesGrupo.map(atividade => (
                      <div key={atividade.id} style={{ 
                        marginBottom: '12px', 
                        padding: '16px', 
                        border: `1px solid ${atividade.status === 'OK' ? '#10b981' : atividade.status === 'NOK' ? '#ef4444' : '#e2e8f0'}`,
                        borderRadius: '8px',
                        background: atividade.status === 'OK' ? '#f0fdf4' : 
                                   atividade.status === 'NOK' ? '#fef2f2' : 
                                   '#ffffff',
                        transition: 'all 0.2s ease'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '4px' }}>
                              {atividade.nome}
                            </div>
                            <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
                              Setor: {atividade.setor}
                            </div>
                            {atividade.dataHora && (
                              <div style={{ fontSize: '12px', color: '#2563eb' }}>
                                📅 {atividade.dataHora} {atividade.responsavel && `- ${atividade.responsavel}`}
                              </div>
                            )}
                            {atividade.observacao && (
                              <div style={{ fontSize: '11px', color: '#f59e0b', marginTop: '4px', fontStyle: 'italic' }}>
                                💬 {atividade.observacao}
                              </div>
                            )}
                          </div>
                          
                          <div style={{ display: 'flex', gap: '4px' }}>
                            {atividade.nome.includes('Finalização Etapa') ? (
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
                                    background: atividade.status === 'NOK' ? '#ef4444' : '#e5e7eb',
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