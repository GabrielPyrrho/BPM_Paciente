'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Paciente {
  id: string
  nome: string
  telefone?: string
  convenio?: string
  numeroCartao?: string
  responsavelNome?: string
  responsavelTelefone?: string
}

interface ModalConfirmacaoProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  paciente: Paciente | null
}

function ModalConfirmacao({ isOpen, onClose, onConfirm, paciente }: ModalConfirmacaoProps) {
  if (!isOpen || !paciente) return null

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
              fontSize: '18px',
              fontWeight: 'bold'
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
                Confirmar Exclusão
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
              {paciente.nome}
            </div>
            <div style={{
              fontSize: '12px',
              color: '#64748b'
            }}>
              {paciente.convenio && `Convênio: ${paciente.convenio}`}
              {paciente.convenio && paciente.telefone && ' • '}
              {paciente.telefone && `Tel: ${paciente.telefone}`}
            </div>
          </div>

          <p style={{
            fontSize: '14px',
            color: '#374151',
            marginBottom: '24px',
            lineHeight: '1.5'
          }}>
            Tem certeza que deseja excluir este paciente? Todos os dados serão removidos permanentemente.
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
                cursor: 'pointer',
                transition: 'all 0.2s ease'
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
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
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

export default function PacientesPage() {
  const router = useRouter()
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  
  // Estados do modal de confirmação
  const [modalAberto, setModalAberto] = useState(false)
  const [pacienteParaExcluir, setPacienteParaExcluir] = useState<Paciente | null>(null)
  
  // Estados do formulário
  const [nome, setNome] = useState('')
  const [convenio, setConvenio] = useState('')
  const [numeroCartao, setNumeroCartao] = useState('')
  const [telefone, setTelefone] = useState('')
  const [responsavelNome, setResponsavelNome] = useState('')
  const [responsavelTelefone, setResponsavelTelefone] = useState('')

  // Função para máscara de telefone
  const formatarTelefone = (valor: string) => {
    const numeros = valor.replace(/\D/g, '')
    if (numeros.length <= 10) {
      return numeros.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
    } else {
      return numeros.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
    }
  }

  useEffect(() => {
    fetchPacientes()
  }, [])

  const fetchPacientes = async () => {
    try {
      const res = await fetch('/api/pacientes')
      if (res.ok) {
        const data = await res.json()
        setPacientes(Array.isArray(data) ? data : [])
      } else {
        setPacientes([])
      }
    } catch (error) {
      console.log('Erro ao carregar pacientes')
      setPacientes([])
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nome.trim()) return
    
    setLoading(true)
    try {
      const url = editingId ? `/api/pacientes/${editingId}` : '/api/pacientes'
      const method = editingId ? 'PUT' : 'POST'
      
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          nome,
          telefone,
          convenio,
          numeroCartao,
          responsavelNome,
          responsavelTelefone
        })
      })
      
      // Limpar formulário
      setNome('')
      setConvenio('')
      setNumeroCartao('')
      setTelefone('')
      setResponsavelNome('')
      setResponsavelTelefone('')
      setEditingId(null)
      
      fetchPacientes()
    } catch (error) {
      console.log('Erro ao salvar paciente')
    }
    setLoading(false)
  }

  const handleEdit = (paciente: Paciente) => {
    setNome(paciente.nome)
    setTelefone(paciente.telefone || '')
    setConvenio(paciente.convenio || '')
    setNumeroCartao(paciente.numeroCartao || '')
    setResponsavelNome(paciente.responsavelNome || '')
    setResponsavelTelefone(paciente.responsavelTelefone || '')
    setEditingId(paciente.id)
  }

  const abrirModalExclusao = (paciente: Paciente) => {
    setPacienteParaExcluir(paciente)
    setModalAberto(true)
  }

  const confirmarExclusao = async () => {
    if (!pacienteParaExcluir) return
    
    try {
      await fetch(`/api/pacientes/${pacienteParaExcluir.id}`, { method: 'DELETE' })
      fetchPacientes()
      setModalAberto(false)
      setPacienteParaExcluir(null)
    } catch (error) {
      console.log('Erro ao excluir paciente')
    }
  }

  const handleCancel = () => {
    setNome('')
    setConvenio('')
    setNumeroCartao('')
    setTelefone('')
    setResponsavelNome('')
    setResponsavelTelefone('')
    setEditingId(null)
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      background: '#f8fafc',
      padding: '20px'
    }}>
      {/* Modal de Confirmação */}
      <ModalConfirmacao
        isOpen={modalAberto}
        onClose={() => setModalAberto(false)}
        onConfirm={confirmarExclusao}
        paciente={pacienteParaExcluir}
      />
      
      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(10px)',
          padding: '30px',
          borderRadius: '20px',
          marginBottom: '30px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          border: '1px solid rgba(255,255,255,0.2)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{
                width: '60px',
                height: '60px',
                background: '#3b82f6',
                borderRadius: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                boxShadow: '0 10px 20px rgba(59, 130, 246, 0.3)'
              }}>👥</div>
              <div>
                <h1 style={{ 
                  fontSize: '32px', 
                  fontWeight: '700', 
                  margin: '0',
                  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>Gerenciar Pacientes</h1>
                <p style={{ 
                  fontSize: '16px', 
                  color: '#666', 
                  margin: '5px 0 0 0'
                }}>Cadastre e gerencie pacientes do sistema</p>
              </div>
            </div>
            <a href="/" style={{ textDecoration: 'none' }}>
              <button style={{
                padding: '12px 20px',
                background: 'rgba(255,255,255,0.9)',
                border: '2px solid #3b82f6',
                borderRadius: '12px',
                color: '#059669',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#3b82f6'
                e.target.style.color = 'white'
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.9)'
                e.target.style.color = '#1d4ed8'
              }}>
                ← Voltar
              </button>
            </a>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
          {/* Formulário */}
          <div style={{
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '30px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            border: '1px solid rgba(255,255,255,0.2)',
            height: 'fit-content'
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', margin: '0 0 25px 0' }}>
              {editingId ? 'Editar Paciente' : 'Novo Paciente'}
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Nome Completo *
                </label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '15px 20px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '12px',
                    fontSize: '16px',
                    transition: 'all 0.3s ease',
                    background: 'white',
                    boxSizing: 'border-box'
                  }}
                  onFocus={(e) => e.target.style.borderColor = '#3b82f6'}
                  onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                  placeholder="Nome completo do paciente"
                  required
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Telefone
                </label>
                <input
                  type="tel"
                  value={telefone}
                  onChange={(e) => {
                    const formatted = formatarTelefone(e.target.value)
                    if (formatted.replace(/\D/g, '').length <= 11) {
                      setTelefone(formatted)
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                  placeholder="(11) 99999-9999"
                  maxLength={15}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Convênio
                </label>
                <input
                  type="text"
                  value={convenio}
                  onChange={(e) => setConvenio(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Ex: Unimed, Bradesco Saúde"
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Número da Carteirinha
                </label>
                <input
                  type="text"
                  value={numeroCartao}
                  onChange={(e) => {
                    const valor = e.target.value.replace(/\D/g, '')
                    setNumeroCartao(valor)
                  }}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Apenas números"
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Nome do Responsável
                </label>
                <input
                  type="text"
                  value={responsavelNome}
                  onChange={(e) => setResponsavelNome(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Nome do responsável"
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Telefone do Responsável
                </label>
                <input
                  type="tel"
                  value={responsavelTelefone}
                  onChange={(e) => {
                    const formatted = formatarTelefone(e.target.value)
                    if (formatted.replace(/\D/g, '').length <= 11) {
                      setResponsavelTelefone(formatted)
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                  placeholder="(11) 99999-9999"
                  maxLength={15}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  type="submit" 
                  disabled={loading}
                  style={{
                    flex: 1,
                    background: loading ? '#9ca3af' : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                    color: 'white',
                    padding: '15px 30px',
                    borderRadius: '12px',
                    border: 'none',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: loading ? 'not-allowed' : 'pointer',
                    transition: 'all 0.3s ease',
                    transform: 'translateY(0)',
                    boxShadow: '0 10px 20px rgba(59, 130, 246, 0.3)'
                  }}
                  onMouseEnter={(e) => !loading && (e.target.style.transform = 'translateY(-2px)')}
                  onMouseLeave={(e) => !loading && (e.target.style.transform = 'translateY(0)')}
                >
                  {loading ? '⏳ Salvando...' : (editingId ? '✏️ Atualizar' : '✨ Cadastrar')}
                </button>
                {editingId && (
                  <button 
                    type="button"
                    onClick={handleCancel}
                    style={{
                      background: '#6b7280',
                      color: 'white',
                      padding: '14px 20px',
                      borderRadius: '8px',
                      border: 'none',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer'
                    }}
                  >
                    Cancelar
                  </button>
                )}
              </div>
            </form>
          </div>

          {/* Lista */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', margin: '0 0 24px 0' }}>
              Pacientes Cadastrados ({pacientes.length})
            </h3>

            <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
              {pacientes.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: '#9ca3af' }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>👥</div>
                  <p style={{ fontSize: '16px', margin: '0' }}>Nenhum paciente cadastrado</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {pacientes.map((paciente, index) => (
                    <div key={paciente.id} style={{
                      padding: '20px',
                      background: '#f8fafc',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: '600', fontSize: '18px', color: '#1e293b', marginBottom: '8px' }}>
                            {paciente.nome}
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '14px' }}>
                            <div>
                              <span style={{ color: '#64748b', fontWeight: '500' }}>Convênio:</span>
                              <div style={{ color: '#1e293b', fontWeight: '600' }}>{paciente.convenio || 'Não informado'}</div>
                            </div>
                            <div>
                              <span style={{ color: '#64748b', fontWeight: '500' }}>Carteirinha:</span>
                              <div style={{ color: '#1e293b', fontWeight: '600' }}>{paciente.numeroCartao || 'Não informado'}</div>
                            </div>
                            <div>
                              <span style={{ color: '#64748b', fontWeight: '500' }}>Telefone:</span>
                              <div style={{ color: '#1e293b', fontWeight: '600' }}>{paciente.telefone || 'Não informado'}</div>
                            </div>
                            <div>
                              <span style={{ color: '#64748b', fontWeight: '500' }}>Responsável:</span>
                              <div style={{ color: '#1e293b', fontWeight: '600' }}>{paciente.responsavelNome || 'Não informado'}</div>
                            </div>
                          </div>
                          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '8px' }}>
                            ID: {paciente.id?.slice(0, 8)}... • Cadastrado em {new Date().toLocaleDateString('pt-BR')}
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => handleEdit(paciente)}
                            style={{
                              background: '#3b82f6',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              padding: '8px 12px',
                              fontSize: '12px',
                              fontWeight: '600',
                              cursor: 'pointer'
                            }}
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => abrirModalExclusao(paciente)}
                            style={{
                              background: '#ef4444',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              padding: '8px 12px',
                              fontSize: '12px',
                              fontWeight: '600',
                              cursor: 'pointer'
                            }}
                          >
                            Excluir
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}