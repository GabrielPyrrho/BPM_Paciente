'use client'

import { useState, useEffect } from 'react'

interface Processo {
  id: string
  entidade?: { id: string; nome: string }
  paciente?: { id: string; nome: string }
  tipoWorkflow?: { id: string; nome: string }
  complexidade?: { id: string; nome: string }
  atividades: Array<{
    status: string
    atividade: { nome: string }
  }>
}

interface Complexidade {
  id: string
  nome: string
}

interface ModalEditarProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: (complexidadeId: string) => void
  processo: Processo | null
  complexidades: Complexidade[]
}

interface ModalExcluirProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  processo: Processo | null
}

function ModalEditar({ isOpen, onClose, onConfirm, processo, complexidades }: ModalEditarProps) {
  const [complexidadeSelecionada, setComplexidadeSelecionada] = useState('')

  useEffect(() => {
    if (isOpen && processo) {
      setComplexidadeSelecionada(processo.tipoWorkflow?.id || processo.complexidade?.id || '')
    }
  }, [isOpen, processo])

  if (!isOpen || !processo) return null

  const handleConfirm = () => {
    onConfirm(complexidadeSelecionada)
    onClose()
  }

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
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
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
              backgroundColor: '#3b82f6',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '18px'
            }}>
              ✏️
            </div>
            <div>
              <h3 style={{
                margin: 0,
                fontSize: '18px',
                fontWeight: '600',
                color: '#1e293b'
              }}>
                Editar Processo
              </h3>
              <p style={{
                margin: 0,
                fontSize: '14px',
                color: '#64748b'
              }}>
                Alterar complexidade do processo
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
              {processo.entidade?.nome || processo.paciente?.nome}
            </div>
            <div style={{
              fontSize: '12px',
              color: '#64748b'
            }}>
              Tipo atual: {processo.tipoWorkflow?.nome || processo.complexidade?.nome}
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
              Nova Complexidade
            </label>
            <select
              value={complexidadeSelecionada}
              onChange={(e) => setComplexidadeSelecionada(e.target.value)}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
                outline: 'none',
                boxSizing: 'border-box'
              }}
            >
              {complexidades.map(comp => (
                <option key={comp.id} value={comp.id}>{comp.nome}</option>
              ))}
            </select>
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
                backgroundColor: '#3b82f6',
                color: 'white',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              ✏️ Salvar
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

function ModalExcluir({ isOpen, onClose, onConfirm, processo }: ModalExcluirProps) {
  if (!isOpen || !processo) return null

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
        maxWidth: '450px',
        width: '100%',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
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
              backgroundColor: '#ef4444',
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
                Excluir Processo
              </h3>
              <p style={{
                margin: 0,
                fontSize: '14px',
                color: '#64748b'
              }}>
                Esta ação não pode ser desfeita
              </p>
            </div>
          </div>
        </div>

        <div style={{ padding: '0 24px 24px 24px' }}>
          <div style={{
            backgroundColor: '#fef2f2',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '20px',
            border: '1px solid #fecaca'
          }}>
            <div style={{
              fontSize: '14px',
              fontWeight: '600',
              color: '#1e293b',
              marginBottom: '4px'
            }}>
              {processo.entidade?.nome || processo.paciente?.nome}
            </div>
            <div style={{
              fontSize: '12px',
              color: '#64748b'
            }}>
              Tipo: {processo.tipoWorkflow?.nome || processo.complexidade?.nome} • {processo.atividades.length} atividades
            </div>
          </div>

          <p style={{
            fontSize: '14px',
            color: '#374151',
            marginBottom: '24px',
            lineHeight: '1.5'
          }}>
            Tem certeza que deseja excluir este processo? Todas as atividades e dados serão removidos permanentemente.
          </p>

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
                cursor: 'pointer'
              }}
            >
              Cancelar
            </button>
            <button
              onClick={onConfirm}
              style={{
                padding: '10px 20px',
                border: 'none',
                borderRadius: '8px',
                backgroundColor: '#ef4444',
                color: 'white',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer'
              }}
            >
              🗑️ Excluir
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

interface ProcessosListProps {
  onProcessoExcluido?: () => void
}

export default function ProcessosList({ onProcessoExcluido }: ProcessosListProps) {
  const [processos, setProcessos] = useState<Processo[]>([])
  const [loading, setLoading] = useState(true)
  const [complexidades, setComplexidades] = useState<Complexidade[]>([])
  
  // Estados dos modais
  const [modalEditarAberto, setModalEditarAberto] = useState(false)
  const [modalExcluirAberto, setModalExcluirAberto] = useState(false)
  const [processoSelecionado, setProcessoSelecionado] = useState<Processo | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [processosRes, complexidadesRes] = await Promise.all([
        fetch('/api/processos'),
        fetch('/api/complexidades')
      ])
      const processosData = await processosRes.json()
      const complexidadesData = await complexidadesRes.json()
      
      setProcessos(Array.isArray(processosData) ? processosData : [])
      setComplexidades(Array.isArray(complexidadesData) ? complexidadesData : [])
      setLoading(false)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      setProcessos([])
      setComplexidades([])
      setLoading(false)
    }
  }

  const abrirModalEditar = (processo: Processo) => {
    setProcessoSelecionado(processo)
    setModalEditarAberto(true)
  }

  const abrirModalExcluir = (processo: Processo) => {
    setProcessoSelecionado(processo)
    setModalExcluirAberto(true)
  }

  const editarProcesso = async (complexidadeId: string) => {
    if (!processoSelecionado) return
    
    try {
      await fetch(`/api/processos/${processoSelecionado.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ complexidadeId })
      })
      fetchData()
      setModalEditarAberto(false)
      setProcessoSelecionado(null)
    } catch (error) {
      console.error('Erro ao editar processo:', error)
    }
  }

  const excluirProcesso = async () => {
    if (!processoSelecionado) return
    
    try {
      console.log('Excluindo processo:', processoSelecionado.id)
      const response = await fetch(`/api/processos/${processoSelecionado.id}`, {
        method: 'DELETE'
      })
      
      if (response.ok) {
        console.log('Processo excluído com sucesso')
        fetchData()
        onProcessoExcluido?.()
        setModalExcluirAberto(false)
        setProcessoSelecionado(null)
      } else {
        console.error('Erro na resposta:', await response.text())
      }
    } catch (error) {
      console.error('Erro ao excluir processo:', error)
    }
  }

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
      <div style={{ fontSize: '24px', marginBottom: '10px' }}>⏳</div>
      <p>Carregando processos...</p>
    </div>
  )

  return (
    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
      {/* Modais */}
      <ModalEditar
        isOpen={modalEditarAberto}
        onClose={() => setModalEditarAberto(false)}
        onConfirm={editarProcesso}
        processo={processoSelecionado}
        complexidades={complexidades}
      />
      <ModalExcluir
        isOpen={modalExcluirAberto}
        onClose={() => setModalExcluirAberto(false)}
        onConfirm={excluirProcesso}
        processo={processoSelecionado}
      />
      {processos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
          <p>Nenhum processo encontrado</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {processos.map(processo => (
            <div key={processo.id} style={{
              padding: '20px',
              background: '#f8fafc',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              transition: 'all 0.2s'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div style={{ flex: 1 }}>
                  <h3 style={{ fontWeight: '600', fontSize: '16px', color: '#1a202c', marginBottom: '4px' }}>
                    {processo.entidade?.nome || processo.paciente?.nome}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#64748b' }}>
                    {processo.tipoWorkflow?.nome || processo.complexidade?.nome}
                  </p>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <div style={{
                    background: 'linear-gradient(135deg, #ed8936, #dd6b20)',
                    color: 'white',
                    padding: '4px 8px',
                    borderRadius: '12px',
                    fontSize: '10px',
                    fontWeight: '600'
                  }}>
                    {processo.atividades.length} atividades
                  </div>
                  <button
                    onClick={() => abrirModalEditar(processo)}
                    style={{
                      background: '#3b82f6',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '6px 8px',
                      fontSize: '11px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    ✏️
                  </button>
                  <button
                    onClick={() => abrirModalExcluir(processo)}
                    style={{
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '6px',
                      padding: '6px 8px',
                      fontSize: '11px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    🗑️
                  </button>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {processo.atividades.slice(0, 3).map((ativ, i) => (
                  <span key={i} style={{
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: '500',
                    background: ativ.status === 'OK' ? '#dcfce7' : 
                               ativ.status === 'PENDENTE' ? '#fef3c7' : '#fecaca',
                    color: ativ.status === 'OK' ? '#166534' : 
                           ativ.status === 'PENDENTE' ? '#92400e' : '#991b1b'
                  }}>
                    {ativ.atividade.nome}
                  </span>
                ))}
                {processo.atividades.length > 3 && (
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: '500',
                    background: '#f1f5f9',
                    color: '#64748b'
                  }}>
                    +{processo.atividades.length - 3} mais
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}