'use client'
import { useState, useEffect } from 'react'

interface Setor {
  id: string
  nome: string
}

interface Usuario {
  id: string
  nome: string
  email: string
  funcao?: string
  setor?: Setor
  ativo: boolean
}

export default function UsuariosPage() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [setores, setSetores] = useState<Setor[]>([])
  const [loading, setLoading] = useState(true)
  const [novoUsuario, setNovoUsuario] = useState({ nome: '', email: '', senha: '', funcao: '', setorId: '' })
  const [modal, setModal] = useState({ show: false, message: '', type: '' })
  const [editando, setEditando] = useState<string | null>(null)
  const [modalExcluir, setModalExcluir] = useState<{ show: boolean, usuario: Usuario | null }>({ show: false, usuario: null })

  useEffect(() => {
    carregarDados()
  }, [])

  const carregarDados = async () => {
    try {
      const [usuariosRes, setoresRes] = await Promise.all([
        fetch('/api/usuarios'),
        fetch('/api/setores')
      ])
      
      const usuariosData = await usuariosRes.json()
      const setoresData = await setoresRes.json()
      
      setUsuarios(Array.isArray(usuariosData) ? usuariosData : [])
      setSetores(Array.isArray(setoresData) ? setoresData : [])
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const criarUsuario = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const url = editando ? `/api/usuarios/${editando}` : '/api/usuarios'
      const method = editando ? 'PUT' : 'POST'
      const dados = editando ? 
        { nome: novoUsuario.nome, email: novoUsuario.email, funcao: novoUsuario.funcao, setorId: novoUsuario.setorId } :
        novoUsuario
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dados)
      })
      
      if (res.ok) {
        setNovoUsuario({ nome: '', email: '', senha: '', funcao: '', setorId: '' })
        setEditando(null)
        setModal({ show: true, message: editando ? 'Usuário atualizado com sucesso!' : 'Usuário criado com sucesso!', type: 'success' })
        await carregarDados()
      } else {
        const error = await res.json()
        setModal({ show: true, message: error.error, type: 'error' })
      }
    } catch (error) {
      setModal({ show: true, message: 'Erro ao salvar usuário', type: 'error' })
    }
  }

  const editarUsuario = (usuario: Usuario) => {
    setNovoUsuario({ 
      nome: usuario.nome, 
      email: usuario.email, 
      senha: '', 
      funcao: usuario.funcao || '', 
      setorId: usuario.setor?.id || '' 
    })
    setEditando(usuario.id)
  }

  const cancelarEdicao = () => {
    setNovoUsuario({ nome: '', email: '', senha: '', funcao: '', setorId: '' })
    setEditando(null)
  }

  const abrirModalExcluir = (usuario: Usuario) => {
    setModalExcluir({ show: true, usuario })
  }

  const fecharModalExcluir = () => {
    setModalExcluir({ show: false, usuario: null })
  }

  const confirmarExclusao = async () => {
    if (!modalExcluir.usuario) return
    
    try {
      const res = await fetch(`/api/usuarios/${modalExcluir.usuario.id}`, { method: 'DELETE' })
      
      if (res.ok) {
        await carregarDados()
        fecharModalExcluir()
        setModal({ show: true, message: 'Usuário excluído com sucesso!', type: 'success' })
      } else {
        const error = await res.json()
        setModal({ show: true, message: error.error || 'Erro ao excluir usuário', type: 'error' })
      }
    } catch (error) {
      setModal({ show: true, message: 'Erro ao excluir usuário', type: 'error' })
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
            width: '50px',
            height: '50px',
            border: '4px solid #f3f3f3',
            borderTop: '4px solid #6366f1',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p style={{ color: '#666', fontSize: '16px', margin: 0 }}>Carregando usuários...</p>
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
          zIndex: 1001
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
              }}>Tem certeza que deseja excluir o usuário:</p>
              <p style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#ef4444',
                margin: '0'
              }}>"{ modalExcluir.usuario?.nome }"?</p>
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
                background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                borderRadius: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                boxShadow: '0 10px 20px rgba(99, 102, 241, 0.3)'
              }}>👤</div>
              <div>
                <h1 style={{ 
                  fontSize: '32px', 
                  fontWeight: '700', 
                  margin: '0',
                  background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>Gerenciar Usuários</h1>
                <p style={{ 
                  fontSize: '16px', 
                  color: '#666', 
                  margin: '5px 0 0 0'
                }}>Cadastre e gerencie usuários do sistema</p>
              </div>
            </div>
            <a href="/" style={{ textDecoration: 'none' }}>
              <button style={{
                padding: '12px 20px',
                background: 'rgba(255,255,255,0.9)',
                border: '2px solid #6366f1',
                borderRadius: '12px',
                color: '#4f46e5',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#6366f1'
                e.target.style.color = 'white'
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.9)'
                e.target.style.color = '#4f46e5'
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
              {editando ? 'Editar Usuário' : 'Novo Usuário'}
            </h2>
            
            <form onSubmit={criarUsuario} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <input
                type="text"
                placeholder="Nome completo"
                value={novoUsuario.nome}
                onChange={(e) => setNovoUsuario({...novoUsuario, nome: e.target.value})}
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
                onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                required
              />
              
              <input
                type="email"
                placeholder="Email"
                value={novoUsuario.email}
                onChange={(e) => setNovoUsuario({...novoUsuario, email: e.target.value})}
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
                onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                required
              />
              
              <input
                type="password"
                placeholder={editando ? 'Nova senha (deixe vazio para manter)' : 'Senha'}
                value={novoUsuario.senha}
                onChange={(e) => setNovoUsuario({...novoUsuario, senha: e.target.value})}
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
                onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
                required={!editando}
              />
              
              <input
                type="text"
                placeholder="Função (opcional)"
                value={novoUsuario.funcao}
                onChange={(e) => setNovoUsuario({...novoUsuario, funcao: e.target.value})}
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
                onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              />
              
              <select
                value={novoUsuario.setorId}
                onChange={(e) => setNovoUsuario({...novoUsuario, setorId: e.target.value})}
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
                onFocus={(e) => e.target.style.borderColor = '#6366f1'}
                onBlur={(e) => e.target.style.borderColor = '#e5e7eb'}
              >
                <option value="">Selecione um setor (opcional)</option>
                {setores.map(setor => (
                  <option key={setor.id} value={setor.id}>
                    {setor.nome}
                  </option>
                ))}
              </select>
              
              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  type="submit"
                  style={{ 
                    flex: 1,
                    padding: '15px 30px', 
                    background: 'linear-gradient(135deg, #6366f1, #4f46e5)', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '12px', 
                    cursor: 'pointer',
                    fontSize: '16px',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                    transform: 'translateY(0)',
                    boxShadow: '0 10px 20px rgba(99, 102, 241, 0.3)'
                  }}
                  onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                  onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
                >
                  {editando ? '✏️ Atualizar' : '👤 Criar Usuário'}
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
              Usuários Cadastrados ({usuarios.length})
            </h3>
            
            <div style={{ maxHeight: '500px', overflowY: 'auto', paddingRight: '10px' }}>
              {usuarios.map((usuario, index) => (
                <div 
                  key={usuario.id} 
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
                        👤 {usuario.nome}
                      </div>
                      <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        📧 {usuario.email}
                      </div>
                      {usuario.funcao && (
                        <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '6px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                          💼 {usuario.funcao}
                        </div>
                      )}
                      <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '10px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        🏢 {usuario.setor?.nome || 'Sem setor'}
                      </div>
                      <div style={{
                        padding: '4px 8px',
                        background: usuario.ativo ? '#dcfce7' : '#fee2e2',
                        color: usuario.ativo ? '#166534' : '#991b1b',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600',
                        display: 'inline-block'
                      }}>
                        {usuario.ativo ? '✅ Ativo' : '❌ Inativo'}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', marginLeft: '16px' }}>
                      <button
                        onClick={() => editarUsuario(usuario)}
                        style={{
                          background: '#6366f1',
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
                        onClick={() => abrirModalExcluir(usuario)}
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
              {usuarios.length === 0 && (
                <div style={{
                  textAlign: 'center',
                  padding: '40px 20px',
                  color: '#9ca3af',
                  fontSize: '16px'
                }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>👤</div>
                  <p>Nenhum usuário cadastrado ainda</p>
                  <p style={{ fontSize: '14px' }}>Crie o primeiro usuário usando o formulário ao lado</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
      
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