'use client'
import { useState, useEffect } from 'react'

interface Atividade {
  id: string
  nome: string
  setor: string | null
  ordem: number
}

interface Complexidade {
  id: string
  nome: string
  atividades: Array<{
    atividade: Atividade
  }>
}

export default function ComplexidadesPage() {
  const [atividades, setAtividades] = useState<Atividade[]>([])
  const [complexidades, setComplexidades] = useState<Complexidade[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [novaComplexidade, setNovaComplexidade] = useState({ nome: '', atividadeIds: [] as string[] })

  useEffect(() => {
    carregarDados()
  }, [])

  const carregarDados = async () => {
    try {
      const [atividadesRes, complexidadesRes] = await Promise.all([
        fetch('/api/atividades'),
        fetch('/api/complexidades')
      ])
      
      setAtividades(await atividadesRes.json())
      setComplexidades(await complexidadesRes.json())
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }

  const criarComplexidade = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/complexidades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novaComplexidade)
      })
      
      if (res.ok) {
        setNovaComplexidade({ nome: '', atividadeIds: [] })
        await carregarDados()
      }
    } catch (error) {
      console.error('Erro ao criar complexidade:', error)
    } finally {
      setSaving(false)
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
            borderTop: '4px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p style={{ color: '#666', fontSize: '16px', margin: 0 }}>Carregando complexidades...</p>
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
                background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                borderRadius: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                boxShadow: '0 10px 20px rgba(245, 158, 11, 0.3)'
              }}>🔧</div>
              <div>
                <h1 style={{ 
                  fontSize: '32px', 
                  fontWeight: '700', 
                  margin: '0',
                  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>Gerenciar Complexidades</h1>
                <p style={{ 
                  fontSize: '16px', 
                  color: '#666', 
                  margin: '5px 0 0 0'
                }}>Configure complexidades e associe atividades</p>
              </div>
            </div>
            <a href="/" style={{ textDecoration: 'none' }}>
              <button style={{
                padding: '12px 20px',
                background: 'rgba(255,255,255,0.9)',
                border: '2px solid #f59e0b',
                borderRadius: '12px',
                color: '#d97706',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#f59e0b'
                e.target.style.color = 'white'
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.9)'
                e.target.style.color = '#d97706'
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
            <h2 style={{ fontSize: '24px', fontWeight: '700', margin: '0 0 25px 0', color: '#1f2937' }}>Nova Complexidade</h2>
            
            <form onSubmit={criarComplexidade} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <input
                type="text"
                placeholder="Nome da complexidade (ex: HC24, HC48)"
                value={novaComplexidade.nome}
                onChange={(e) => setNovaComplexidade({...novaComplexidade, nome: e.target.value})}
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
                required
              />
              
              <div>
                <label style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px', display: 'block', color: '#1f2937' }}>
                  🎯 Selecionar Atividades:
                </label>
                <div style={{ 
                  maxHeight: '300px', 
                  overflowY: 'auto', 
                  border: '2px solid #e5e7eb', 
                  borderRadius: '12px', 
                  padding: '15px',
                  background: 'white'
                }}>
                  {atividades.map((atividade, index) => (
                    <label 
                      key={atividade.id} 
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '12px', 
                        marginBottom: '12px', 
                        cursor: 'pointer',
                        padding: '10px',
                        borderRadius: '8px',
                        transition: 'all 0.3s ease',
                        animation: `slideIn 0.3s ease ${index * 0.05}s both`
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.background = '#f3f4f6'}
                      onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                    >
                      <input
                        type="checkbox"
                        checked={novaComplexidade.atividadeIds.includes(atividade.id)}
                        onChange={(e) => {
                          if (e.target.checked) {
                            setNovaComplexidade({
                              ...novaComplexidade,
                              atividadeIds: [...novaComplexidade.atividadeIds, atividade.id]
                            })
                          } else {
                            setNovaComplexidade({
                              ...novaComplexidade,
                              atividadeIds: novaComplexidade.atividadeIds.filter(id => id !== atividade.id)
                            })
                          }
                        }}
                        style={{ transform: 'scale(1.2)' }}
                      />
                      <span style={{ fontSize: '15px', fontWeight: '500' }}>
                        {atividade.nome} 
                        <span style={{ color: '#6b7280', fontWeight: '400' }}>({atividade.setor || 'N/A'})</span>
                      </span>
                    </label>
                  ))}
                </div>
              </div>
              
              <button 
                type="submit" 
                disabled={saving}
                style={{ 
                  padding: '15px 30px', 
                  background: saving ? '#9ca3af' : 'linear-gradient(135deg, #3b82f6, #1d4ed8)', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '12px', 
                  cursor: saving ? 'not-allowed' : 'pointer',
                  fontSize: '16px',
                  fontWeight: '600',
                  transition: 'all 0.3s ease',
                  transform: 'translateY(0)',
                  boxShadow: '0 10px 20px rgba(59, 130, 246, 0.3)'
                }}
                onMouseEnter={(e) => !saving && (e.target.style.transform = 'translateY(-2px)')}
                onMouseLeave={(e) => !saving && (e.target.style.transform = 'translateY(0)')}
              >
                {saving ? '⏳ Salvando...' : '🚀 Criar Complexidade'}
              </button>
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
              Complexidades Cadastradas ({complexidades.length})
            </h3>
            <div style={{ maxHeight: '500px', overflowY: 'auto', paddingRight: '10px' }}>
              {complexidades.map((complexidade, index) => (
                <div 
                  key={complexidade.id} 
                  style={{ 
                    padding: '25px', 
                    background: 'white',
                    border: '1px solid #e5e7eb', 
                    borderRadius: '15px', 
                    marginBottom: '20px',
                    transition: 'all 0.3s ease',
                    transform: 'translateX(0)',
                    boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
                    animation: `slideIn 0.5s ease ${index * 0.1}s both`
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateX(5px)'
                    e.currentTarget.style.boxShadow = '0 15px 30px rgba(0,0,0,0.1)'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateX(0)'
                    e.currentTarget.style.boxShadow = '0 4px 6px rgba(0,0,0,0.05)'
                  }}
                >
                  <div style={{ 
                    fontWeight: '700', 
                    fontSize: '18px', 
                    color: '#1f2937', 
                    marginBottom: '15px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px'
                  }}>
                    <span style={{ 
                      background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                      color: 'white',
                      padding: '5px 10px',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}>{complexidade.nome}</span>
                  </div>
                  <div style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.6' }}>
                    <div style={{ marginBottom: '10px', fontWeight: '600' }}>
                      📋 Atividades ({complexidade.atividades.length}):
                    </div>
                    <div style={{ paddingLeft: '20px' }}>
                      {complexidade.atividades.map((ca, idx) => (
                        <div key={idx} style={{ 
                          marginBottom: '5px',
                          padding: '5px 10px',
                          background: '#f9fafb',
                          borderRadius: '6px',
                          fontSize: '13px'
                        }}>
                          • {ca.atividade.nome}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
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
      `}</style>
    </div>
  )
}