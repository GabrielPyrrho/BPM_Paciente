'use client'
import { useState, useEffect } from 'react'

interface Atividade {
  id: string
  nome: string
  setor: string | null
  ordem: number
  etapa: string | null
  etapaId: string
}

interface Etapa {
  id: string
  nome: string
  cor?: string
}

export default function AtividadesPage() {
  const [atividades, setAtividades] = useState<Atividade[]>([])
  const [etapas, setEtapas] = useState<Etapa[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editando, setEditando] = useState<string | null>(null)
  const [novaAtividade, setNovaAtividade] = useState({ nome: '', setor: '', ordem: 1, etapaId: '' })

  useEffect(() => {
    carregarDados()
  }, [])

  const carregarDados = async () => {
    try {
      const [atividadesRes, etapasRes] = await Promise.all([
        fetch('/api/atividades'),
        fetch('/api/etapas')
      ])
      
      const atividadesData = await atividadesRes.json()
      const etapasData = await etapasRes.json()
      
      setAtividades(Array.isArray(atividadesData) ? atividadesData : [])
      setEtapas(Array.isArray(etapasData) ? etapasData : [])
      
      // Definir primeira etapa como padrão se não houver seleção
      if (etapasData.length > 0 && !novaAtividade.etapaId) {
        setNovaAtividade(prev => ({ ...prev, etapaId: etapasData[0].id }))
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      setAtividades([])
      setEtapas([])
    } finally {
      setLoading(false)
    }
  }



  const criarAtividade = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const url = editando ? `/api/atividades/${editando}` : '/api/atividades'
      const method = editando ? 'PUT' : 'POST'
      
      console.log('Salvando atividade:', { url, method, data: novaAtividade, editando })
      
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novaAtividade)
      })
      
      if (res.ok) {
        console.log('Atividade salva com sucesso')
        const primeiraEtapa = etapas.length > 0 ? etapas[0].id : ''
        setNovaAtividade({ nome: '', setor: '', ordem: 1, etapaId: primeiraEtapa })
        setEditando(null)
        await carregarDados()
      } else {
        const errorText = await res.text()
        console.error('Erro na resposta:', { status: res.status, error: errorText })
        alert('Erro ao salvar atividade: ' + errorText)
      }
    } catch (error) {
      console.error('Erro ao salvar atividade:', error)
      alert('Erro ao salvar atividade: ' + error.message)
    } finally {
      setSaving(false)
    }
  }

  const editarAtividade = (atividade: Atividade) => {
    setNovaAtividade({
      nome: atividade.nome,
      setor: atividade.setor || '',
      ordem: atividade.ordem,
      etapaId: atividade.etapaId || (etapas.length > 0 ? etapas[0].id : '')
    })
    setEditando(atividade.id)
  }

  const cancelarEdicao = () => {
    const primeiraEtapa = etapas.length > 0 ? etapas[0].id : ''
    setNovaAtividade({ nome: '', setor: '', ordem: 1, etapaId: primeiraEtapa })
    setEditando(null)
  }

  const excluirAtividade = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta atividade?')) return
    
    try {
      const res = await fetch(`/api/atividades/${id}`, { method: 'DELETE' })
      if (res.ok) {
        await carregarDados()
      } else {
        alert('Erro ao excluir atividade')
      }
    } catch (error) {
      console.error('Erro ao excluir atividade:', error)
      alert('Erro ao excluir atividade')
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
          <p style={{ color: '#666', fontSize: '16px', margin: 0 }}>Carregando atividades...</p>
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
                background: 'linear-gradient(135deg, #4ade80, #22c55e)',
                borderRadius: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                boxShadow: '0 10px 20px rgba(74, 222, 128, 0.3)'
              }}>📋</div>
              <div>
                <h1 style={{ 
                  fontSize: '32px', 
                  fontWeight: '700', 
                  margin: '0',
                  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>Gerenciar Atividades</h1>
                <p style={{ 
                  fontSize: '16px', 
                  color: '#666', 
                  margin: '5px 0 0 0'
                }}>Cadastre e organize as atividades do workflow</p>
              </div>
            </div>
            <a href="/" style={{ textDecoration: 'none' }}>
              <button style={{
                padding: '12px 20px',
                background: 'rgba(255,255,255,0.9)',
                border: '2px solid #4ade80',
                borderRadius: '12px',
                color: '#22c55e',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
              onMouseEnter={(e) => {
                e.target.style.background = '#4ade80'
                e.target.style.color = 'white'
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.9)'
                e.target.style.color = '#22c55e'
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
              {editando ? 'Editar Atividade' : 'Nova Atividade'}
            </h2>
            
            <form onSubmit={criarAtividade} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <input
                type="text"
                placeholder="Nome da atividade"
                value={novaAtividade.nome}
                onChange={(e) => setNovaAtividade({...novaAtividade, nome: e.target.value})}
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
              
              <input
                type="text"
                placeholder="Setor (opcional)"
                value={novaAtividade.setor}
                onChange={(e) => setNovaAtividade({...novaAtividade, setor: e.target.value})}
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
              />
              
              <input
                type="number"
                placeholder="Ordem"
                value={novaAtividade.ordem}
                onChange={(e) => setNovaAtividade({...novaAtividade, ordem: parseInt(e.target.value)})}
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
                min="1"
              />
              
              <select
                value={novaAtividade.etapaId}
                onChange={(e) => setNovaAtividade({...novaAtividade, etapaId: e.target.value})}
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
              >
                <option value="">Selecione uma etapa</option>
                {etapas.map(etapa => (
                  <option key={etapa.id} value={etapa.id}>
                    {etapa.nome}
                  </option>
                ))}
              </select>
              
              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  type="submit" 
                  disabled={saving}
                  style={{ 
                    flex: 1,
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
                  {saving ? '⏳ Salvando...' : editando ? '✏️ Atualizar' : '✨ Criar Atividade'}
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
              Atividades Cadastradas ({atividades.length})
            </h3>
            <div style={{ maxHeight: '500px', overflowY: 'auto', paddingRight: '10px' }}>
              {atividades.map((atividade, index) => (
                <div 
                  key={atividade.id} 
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
                        {atividade.nome}
                      </div>
                      <div style={{ fontSize: '14px', color: '#6b7280', display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                        <span>🏢 Setor: {atividade.setor || 'N/A'}</span>
                        <span>📊 Ordem: {atividade.ordem}</span>
                        <span style={{
                          background: '#dbeafe',
                          color: '#1e40af',
                          padding: '2px 8px',
                          borderRadius: '12px',
                          fontSize: '12px',
                          fontWeight: '600'
                        }}>
                          🏷️ {atividade.etapa || 'N/A'}
                        </span>
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: '8px', marginLeft: '16px' }}>
                      <button
                        onClick={() => editarAtividade(atividade)}
                        style={{
                          background: '#3b82f6',
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
                        onClick={() => excluirAtividade(atividade.id)}
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