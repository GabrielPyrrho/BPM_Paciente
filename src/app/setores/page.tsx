'use client'
import { useState, useEffect } from 'react'

interface Setor {
  id: string
  nome: string
  descricao?: string
  ativo: boolean
}

export default function SetoresPage() {
  const [setores, setSetores] = useState<Setor[]>([])
  const [loading, setLoading] = useState(true)
  const [novoSetor, setNovoSetor] = useState({ nome: '', descricao: '' })
  const [editando, setEditando] = useState<string | null>(null)
  const [modalExcluir, setModalExcluir] = useState<{ show: boolean, setor: Setor | null }>({ show: false, setor: null })
  const [modal, setModal] = useState({ show: false, message: '', type: '' })

  useEffect(() => {
    carregarSetores()
  }, [])

  const carregarSetores = async () => {
    try {
      const res = await fetch('/api/setores')
      const data = await res.json()
      setSetores(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Erro ao carregar setores:', error)
    } finally {
      setLoading(false)
    }
  }

  const criarSetor = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!novoSetor.nome.trim()) {
      alert('Nome do setor é obrigatório')
      return
    }
    
    try {
      const url = editando ? `/api/setores/${editando}` : '/api/setores'
      const method = editando ? 'PUT' : 'POST'
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoSetor)
      })
      
      if (res.ok) {
        setNovoSetor({ nome: '', descricao: '' })
        setEditando(null)
        await carregarSetores()
        setModal({ show: true, message: editando ? 'Setor atualizado com sucesso!' : 'Setor criado com sucesso!', type: 'success' })
      } else {
        const error = await res.json()
        setModal({ show: true, message: error.error, type: 'error' })
      }
    } catch (error) {
      setModal({ show: true, message: 'Erro ao salvar setor: ' + error.message, type: 'error' })
    }
  }

  const editarSetor = (setor: Setor) => {
    setNovoSetor({ nome: setor.nome, descricao: setor.descricao || '' })
    setEditando(setor.id)
  }

  const cancelarEdicao = () => {
    setNovoSetor({ nome: '', descricao: '' })
    setEditando(null)
  }

  const abrirModalExcluir = (setor: Setor) => {
    setModalExcluir({ show: true, setor })
  }

  const fecharModalExcluir = () => {
    setModalExcluir({ show: false, setor: null })
  }

  const confirmarExclusao = async () => {
    if (!modalExcluir.setor) return
    
    try {
      const res = await fetch(`/api/setores/${modalExcluir.setor.id}`, { method: 'DELETE' })
      
      if (res.ok) {
        await carregarSetores()
        fecharModalExcluir()
        setModal({ show: true, message: 'Setor excluído com sucesso!', type: 'success' })
      } else {
        const error = await res.json()
        fecharModalExcluir()
        setModal({ show: true, message: error.error || 'Erro ao excluir setor', type: 'error' })
      }
    } catch (error) {
      fecharModalExcluir()
      setModal({ show: true, message: 'Erro ao excluir setor', type: 'error' })
    }
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
        <div style={{
          background: 'white',
          padding: '40px',
          borderRadius: '20px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          textAlign: 'center'
        }}>
          <div style={{
            fontSize: '50px',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px',
            display: 'inline-block'
          }}>⏳</div>
          <p style={{ color: '#666', fontSize: '16px', margin: 0 }}>Carregando setores...</p>
        </div>
      </div>
    )
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      background: '#f8fafc',
      padding: '20px'
    }}>
      {/* Modal */}
      {modal.show && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '30px',
            maxWidth: '450px',
            width: '90%',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
            animation: 'modalSlideIn 0.3s ease',
            textAlign: 'center'
          }}>
            <div style={{
              width: '80px',
              height: '80px',
              background: modal.type === 'success' ? '#dcfce7' : '#fee2e2',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto 20px',
              fontSize: '40px'
            }}>
              {modal.type === 'success' ? '✅' : '⚠️'}
            </div>
            <h3 style={{
              fontSize: '24px',
              fontWeight: '700',
              color: '#1f2937',
              margin: '0 0 15px 0'
            }}>
              {modal.type === 'success' ? 'Sucesso!' : 'Erro'}
            </h3>
            <p style={{
              fontSize: '16px',
              color: '#6b7280',
              margin: '0 0 25px 0',
              lineHeight: '1.5'
            }}>
              {modal.message}
            </p>
            <button
              onClick={() => setModal({ show: false, message: '', type: '' })}
              style={{
                padding: '12px 30px',
                background: modal.type === 'success' ? '#10b981' : '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '12px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
            >
              OK
            </button>
          </div>
        </div>
      )}
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
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
                background: 'linear-gradient(135deg, #f97316, #ea580c)',
                borderRadius: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                boxShadow: '0 10px 20px rgba(249, 115, 22, 0.3)'
              }}>🏢</div>
              <div>
                <h1 style={{ 
                  fontSize: '32px', 
                  fontWeight: '700', 
                  margin: '0',
                  background: 'linear-gradient(135deg, #f97316, #ea580c)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>Gerenciar Setores</h1>
                <p style={{ 
                  fontSize: '16px', 
                  color: '#666', 
                  margin: '5px 0 0 0'
                }}>Organize e gerencie os setores da organização</p>
              </div>
            </div>
            <a href="/" style={{ textDecoration: 'none' }}>
              <button style={{
                padding: '12px 20px',
                background: 'rgba(255,255,255,0.9)',
                border: '2px solid #f97316',
                borderRadius: '12px',
                color: '#ea580c',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#f97316'
                e.target.style.color = 'white'
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.9)'
                e.target.style.color = '#ea580c'
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
            padding: '30px', 
            borderRadius: '20px', 
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', margin: '0 0 25px 0', color: '#1f2937' }}>
              {editando ? 'Editar Setor' : 'Novo Setor'}
            </h2>
            
            <form onSubmit={criarSetor} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <input
                type="text"
                placeholder="Nome do setor"
                value={novoSetor.nome}
                onChange={(e) => setNovoSetor({...novoSetor, nome: e.target.value})}
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
                onFocus={(e) => e.target.style.borderColor = '#f97316'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                required
              />
              
              <textarea
                placeholder="Descrição (opcional)"
                value={novoSetor.descricao}
                onChange={(e) => setNovoSetor({...novoSetor, descricao: e.target.value})}
                style={{ 
                  width: '100%',
                  padding: '15px 20px', 
                  border: '2px solid #e5e7eb', 
                  borderRadius: '12px',
                  fontSize: '16px',
                  transition: 'all 0.3s ease',
                  background: 'white',
                  minHeight: '100px',
                  resize: 'vertical',
                  boxSizing: 'border-box'
                }}
                onFocus={(e) => e.target.style.borderColor = '#f97316'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
              
              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  type="submit"
                  style={{ 
                    flex: 1,
                    padding: '15px 30px', 
                    background: 'linear-gradient(135deg, #f97316, #ea580c)', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '12px', 
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                    transform: 'translateY(0)',
                    boxShadow: '0 10px 20px rgba(249, 115, 22, 0.3)'
                  }}
                  onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                  onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  {editando ? '✏️ Atualizar' : '🏢 Criar Setor'}
                </button>
                {editando && (
                  <button 
                    type="button"
                    onClick={cancelarEdicao}
                    style={{ 
                      padding: '15px 20px', 
                      background: '#6b7280', 
                      color: 'white', 
                      border: 'none', 
                      borderRadius: '12px', 
                      cursor: 'pointer',
                      fontSize: '16px',
                      fontWeight: '600'
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
            background: 'rgba(255,255,255,0.95)', 
            backdropFilter: 'blur(10px)',
            padding: '30px', 
            borderRadius: '20px', 
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <h3 style={{ fontSize: '20px', fontWeight: '600', margin: '0 0 20px 0', color: '#1f2937' }}>
              Setores Cadastrados ({setores.length})
            </h3>
            
            <div style={{ maxHeight: '500px', overflowY: 'auto', paddingRight: '10px' }}>
              {setores.map((setor, index) => (
                <div 
                  key={setor.id} 
                  style={{ 
                    padding: '20px', 
                    background: 'white',
                    border: '1px solid #e5e7eb', 
                    borderRadius: '12px', 
                    marginBottom: '15px',
                    transition: 'all 0.3s ease',
                    transform: 'translateX(0)',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                    animation: `slideIn 0.5s ease ${index * 0.1}s both`
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateX(5px)'
                    e.currentTarget.style.boxShadow = '0 10px 20px rgba(0,0,0,0.1)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateX(0)'
                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '600', fontSize: '16px', color: '#1f2937', marginBottom: '8px' }}>
                        🏢 {setor.nome}
                      </div>
                      {setor.descricao && (
                        <div style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.5', marginBottom: '10px' }}>
                          {setor.descricao}
                        </div>
                      )}
                      <div style={{
                        padding: '4px 8px',
                        background: setor.ativo ? '#dcfce7' : '#fee2e2',
                        color: setor.ativo ? '#166534' : '#991b1b',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600',
                        display: 'inline-block'
                      }}>
                        {setor.ativo ? '✅ Ativo' : '❌ Inativo'}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', marginLeft: '16px' }}>
                      <button
                        onClick={() => editarSetor(setor)}
                        style={{
                          background: '#f97316',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '6px 12px',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                      >
                        ✏️ Editar
                      </button>
                      <button
                        onClick={() => abrirModalExcluir(setor)}
                        style={{
                          background: '#ef4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          padding: '6px 12px',
                          fontSize: '12px',
                          fontWeight: '600',
                          cursor: 'pointer'
                        }}
                      >
                        🗑️ Excluir
                      </button>
                    </div>
                  </div>
                </div>
              ))}
              {setores.length === 0 && (
                <div style={{
                  textAlign: 'center',
                  padding: '40px 20px',
                  color: '#9ca3af',
                  fontSize: '16px'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>🏢</div>
                  <p>Nenhum setor cadastrado ainda</p>
                  <p style={{ fontSize: '14px' }}>Crie o primeiro setor usando o formulário ao lado</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal de Exclusão */}
      {modalExcluir.show && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000
        }}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            padding: '30px',
            maxWidth: '500px',
            width: '90%',
            boxShadow: '0 25px 50px rgba(0, 0, 0, 0.25)',
            animation: 'modalSlideIn 0.3s ease'
          }}>
            <div style={{
              textAlign: 'center',
              marginBottom: '25px'
            }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: '#fee2e2',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                fontSize: '40px'
              }}>⚠️</div>
              <h3 style={{
                fontSize: '24px',
                fontWeight: '700',
                color: '#1f2937',
                margin: '0 0 10px 0'
              }}>Confirmar Exclusão</h3>
              <p style={{
                fontSize: '16px',
                color: '#6b7280',
                margin: '0 0 10px 0'
              }}>Tem certeza que deseja excluir o setor:</p>
              <p style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#ef4444',
                margin: '0'
              }}>"{ modalExcluir.setor?.nome }"?</p>
            </div>
            
            <div style={{
              display: 'flex',
              gap: '15px',
              justifyContent: 'center'
            }}>
              <button
                onClick={fecharModalExcluir}
                style={{
                  padding: '12px 24px',
                  background: '#f3f4f6',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={confirmarExclusao}
                style={{
                  padding: '12px 24px',
                  background: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '12px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                🗑️ Excluir
              </button>
            </div>
          </div>
        </div>
      )}
      
      <style jsx>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateX(-20px); }
          to { opacity: 1; transform: translateX(0); }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        
        @keyframes modalSlideIn {
          from { opacity: 0; transform: scale(0.9) translateY(-20px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
      `}</style>
    </div>
  )
}