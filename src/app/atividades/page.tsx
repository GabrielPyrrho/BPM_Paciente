'use client'
import { useState, useEffect } from 'react'

interface Atividade {
  id: string
  nome: string
  setor: string | null
  ordem: number
}

export default function AtividadesPage() {
  const [atividades, setAtividades] = useState<Atividade[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [novaAtividade, setNovaAtividade] = useState({ nome: '', setor: '', ordem: 1 })

  useEffect(() => {
    carregarAtividades()
  }, [])

  const carregarAtividades = async () => {
    try {
      const res = await fetch('/api/atividades')
      setAtividades(await res.json())
    } catch (error) {
      console.error('Erro ao carregar atividades:', error)
    } finally {
      setLoading(false)
    }
  }

  const criarAtividade = async (e: React.FormEvent) => {
    e.preventDefault()
    setSaving(true)
    try {
      const res = await fetch('/api/atividades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novaAtividade)
      })
      
      if (res.ok) {
        setNovaAtividade({ nome: '', setor: '', ordem: 1 })
        await carregarAtividades()
      }
    } catch (error) {
      console.error('Erro ao criar atividade:', error)
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
            <h2 style={{ fontSize: '24px', fontWeight: '700', margin: '0 0 25px 0', color: '#1f2937' }}>Nova Atividade</h2>
            
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
                {saving ? '⏳ Salvando...' : '✨ Criar Atividade'}
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
                  <div style={{ fontWeight: '600', fontSize: '16px', color: '#1f2937', marginBottom: '8px' }}>
                    {atividade.nome}
                  </div>
                  <div style={{ fontSize: '14px', color: '#6b7280', display: 'flex', gap: '15px' }}>
                    <span>🏢 Setor: {atividade.setor || 'N/A'}</span>
                    <span>📊 Ordem: {atividade.ordem}</span>
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