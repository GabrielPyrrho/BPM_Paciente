'use client'
import { useState, useEffect } from 'react'

function DiagnosticoTab({ diagnostico, setDiagnostico, corrigindo, setCorrigindo }) {
  const carregarDiagnostico = async () => {
    try {
      const res = await fetch('/api/diagnostico')
      const data = await res.json()
      setDiagnostico(data)
    } catch (error) {
      console.error('Erro ao carregar diagnóstico:', error)
    }
  }

  const executarCorrecao = async (acao) => {
    setCorrigindo(true)
    try {
      const res = await fetch('/api/diagnostico', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ acao })
      })
      const result = await res.json()
      alert(result.message || result.error)
      await carregarDiagnostico()
    } catch (error) {
      alert('Erro na correção')
    } finally {
      setCorrigindo(false)
    }
  }

  useEffect(() => {
    carregarDiagnostico()
  }, [])

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
      <div style={{
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(10px)',
        padding: '30px',
        borderRadius: '20px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        border: '1px solid rgba(255,255,255,0.2)'
      }}>
        <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px', color: '#1f2937' }}>
          🔍 Diagnóstico do Sistema
        </h3>
        
        {diagnostico ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{
              padding: '15px',
              background: diagnostico.duplicadas.length > 0 ? '#fef2f2' : '#f0fdf4',
              border: `1px solid ${diagnostico.duplicadas.length > 0 ? '#fecaca' : '#bbf7d0'}`,
              borderRadius: '8px'
            }}>
              <strong>Atividades Duplicadas: {diagnostico.duplicadas.length}</strong>
              {diagnostico.duplicadas.length > 0 && (
                <div style={{ marginTop: '10px', fontSize: '14px' }}>
                  {diagnostico.duplicadas.map(d => (
                    <div key={d.id}>• {d.nome}</div>
                  ))}
                </div>
              )}
            </div>
            
            <div style={{
              padding: '15px',
              background: diagnostico.semEtapa.length > 0 ? '#fef2f2' : '#f0fdf4',
              border: `1px solid ${diagnostico.semEtapa.length > 0 ? '#fecaca' : '#bbf7d0'}`,
              borderRadius: '8px'
            }}>
              <strong>Atividades sem Etapa: {diagnostico.semEtapa.length}</strong>
            </div>
            
            <div style={{
              padding: '15px',
              background: '#f0fdf4',
              border: '1px solid #bbf7d0',
              borderRadius: '8px'
            }}>
              <strong>Total de Atividades: {diagnostico.totalAtividades}</strong>
            </div>
          </div>
        ) : (
          <p>Carregando diagnóstico...</p>
        )}
      </div>
      
      <div style={{
        background: 'rgba(255,255,255,0.95)',
        backdropFilter: 'blur(10px)',
        padding: '30px',
        borderRadius: '20px',
        boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        border: '1px solid rgba(255,255,255,0.2)'
      }}>
        <h3 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px', color: '#1f2937' }}>
          🔧 Correções
        </h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
          <button
            onClick={() => executarCorrecao('limpar_duplicadas')}
            disabled={corrigindo || !diagnostico?.duplicadas.length}
            style={{
              padding: '15px',
              background: corrigindo ? '#9ca3af' : '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: corrigindo ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            {corrigindo ? 'Corrigindo...' : '🗑️ Limpar Duplicadas'}
          </button>
          
          <button
            onClick={() => executarCorrecao('corrigir_etapas')}
            disabled={corrigindo}
            style={{
              padding: '15px',
              background: corrigindo ? '#9ca3af' : '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: corrigindo ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            {corrigindo ? 'Corrigindo...' : '⚙️ Corrigir Etapas'}
          </button>
          
          <button
            onClick={carregarDiagnostico}
            disabled={corrigindo}
            style={{
              padding: '15px',
              background: corrigindo ? '#9ca3af' : '#10b981',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: corrigindo ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              fontWeight: '600'
            }}
          >
            🔄 Atualizar Diagnóstico
          </button>
        </div>
      </div>
    </div>
  )
}

function ExclusaoTab({ atividades, carregarDados }) {
  const [selecionadas, setSelecionadas] = useState([])
  const [excluindo, setExcluindo] = useState(false)

  const toggleSelecionada = (id) => {
    setSelecionadas(prev => 
      prev.includes(id) 
        ? prev.filter(item => item !== id)
        : [...prev, id]
    )
  }

  const selecionarTodas = () => {
    setSelecionadas(atividades.map(a => a.id))
  }

  const limparSelecao = () => {
    setSelecionadas([])
  }

  const excluirSelecionadas = async () => {
    if (selecionadas.length === 0) {
      alert('Selecione pelo menos uma atividade')
      return
    }

    if (!confirm(`Tem certeza que deseja excluir ${selecionadas.length} atividade(s)?`)) {
      return
    }

    setExcluindo(true)
    try {
      const promises = selecionadas.map(id => 
        fetch(`/api/atividades/${id}`, { method: 'DELETE' })
      )
      
      await Promise.all(promises)
      alert(`${selecionadas.length} atividade(s) excluída(s) com sucesso!`)
      setSelecionadas([])
      await carregarDados()
    } catch (error) {
      alert('Erro ao excluir atividades')
    } finally {
      setExcluindo(false)
    }
  }

  const excluirUma = async (id, nome) => {
    if (!confirm(`Tem certeza que deseja excluir "${nome}"?`)) {
      return
    }

    try {
      const res = await fetch(`/api/atividades/${id}`, { method: 'DELETE' })
      if (res.ok) {
        alert('Atividade excluída com sucesso!')
        await carregarDados()
      } else {
        const error = await res.json()
        alert(error.error || 'Erro ao excluir atividade')
      }
    } catch (error) {
      alert('Erro ao excluir atividade')
    }
  }

  return (
    <div style={{
      background: 'rgba(255,255,255,0.95)',
      backdropFilter: 'blur(10px)',
      padding: '30px',
      borderRadius: '20px',
      boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
      border: '1px solid rgba(255,255,255,0.2)'
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1f2937', margin: 0 }}>
          🗑️ Exclusão Manual de Atividades
        </h3>
        <div style={{ display: 'flex', gap: '10px' }}>
          <button
            onClick={selecionarTodas}
            style={{
              padding: '8px 16px',
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            Selecionar Todas
          </button>
          <button
            onClick={limparSelecao}
            style={{
              padding: '8px 16px',
              background: '#6b7280',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '12px',
              cursor: 'pointer'
            }}
          >
            Limpar Seleção
          </button>
          <button
            onClick={excluirSelecionadas}
            disabled={selecionadas.length === 0 || excluindo}
            style={{
              padding: '8px 16px',
              background: selecionadas.length === 0 || excluindo ? '#9ca3af' : '#ef4444',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              fontSize: '12px',
              cursor: selecionadas.length === 0 || excluindo ? 'not-allowed' : 'pointer'
            }}
          >
            {excluindo ? 'Excluindo...' : `Excluir Selecionadas (${selecionadas.length})`}
          </button>
        </div>
      </div>

      <div style={{ maxHeight: '500px', overflowY: 'auto' }}>
        {atividades.map((atividade, index) => (
          <div 
            key={atividade.id} 
            style={{ 
              padding: '15px', 
              background: selecionadas.includes(atividade.id) ? '#fef3c7' : 'white',
              border: `1px solid ${selecionadas.includes(atividade.id) ? '#f59e0b' : '#e5e7eb'}`, 
              borderRadius: '8px', 
              marginBottom: '10px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', flex: 1 }}>
              <input
                type="checkbox"
                checked={selecionadas.includes(atividade.id)}
                onChange={() => toggleSelecionada(atividade.id)}
                style={{ transform: 'scale(1.2)' }}
              />
              <div>
                <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '4px' }}>
                  {atividade.nome}
                </div>
                <div style={{ fontSize: '12px', color: '#666' }}>
                  Setor: {atividade.setor || 'N/A'} • Ordem: {atividade.ordem}
                </div>
              </div>
            </div>
            <button
              onClick={() => excluirUma(atividade.id, atividade.nome)}
              style={{
                padding: '6px 12px',
                background: '#ef4444',
                color: 'white',
                border: 'none',
                borderRadius: '4px',
                fontSize: '12px',
                cursor: 'pointer',
                fontWeight: '600'
              }}
            >
              🗑️ Excluir
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}

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

export default function AdminPage() {
  const [atividades, setAtividades] = useState<Atividade[]>([])
  const [complexidades, setComplexidades] = useState<Complexidade[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeTab, setActiveTab] = useState('atividades')
  const [diagnostico, setDiagnostico] = useState(null)
  const [corrigindo, setCorrigindo] = useState(false)
  
  // Forms
  const [novaAtividade, setNovaAtividade] = useState({ nome: '', setor: '', ordem: 1 })
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
        await carregarDados()
      }
    } catch (error) {
      console.error('Erro ao criar atividade:', error)
    } finally {
      setSaving(false)
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
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
            borderTop: '4px solid #667eea',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <p style={{ color: '#666', fontSize: '16px', margin: 0 }}>Carregando...</p>
        </div>
        <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    )
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px'
    }}>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{
              width: '60px',
              height: '60px',
              background: 'linear-gradient(135deg, #667eea, #764ba2)',
              borderRadius: '15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              boxShadow: '0 10px 20px rgba(102, 126, 234, 0.3)'
            }}>⚙️</div>
            <div>
              <h1 style={{ 
                fontSize: '32px', 
                fontWeight: '700', 
                margin: '0',
                background: 'linear-gradient(135deg, #667eea, #764ba2)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>Administração do Sistema</h1>
              <p style={{ 
                fontSize: '16px', 
                color: '#666', 
                margin: '5px 0 0 0'
              }}>Gerencie atividades e complexidades do workflow</p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{
          background: 'rgba(255,255,255,0.95)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          padding: '8px',
          marginBottom: '30px',
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
          border: '1px solid rgba(255,255,255,0.2)',
          display: 'flex',
          gap: '8px'
        }}>
          {[
            {id: 'atividades', label: 'Atividades', icon: '📋'}, 
            {id: 'complexidades', label: 'Complexidades', icon: '🔧'}, 
            {id: 'diagnostico', label: 'Diagnóstico', icon: '🔍'},
            {id: 'exclusao', label: 'Exclusão', icon: '🗑️'}
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                flex: 1,
                padding: '15px 20px',
                border: 'none',
                borderRadius: '15px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                transition: 'all 0.3s ease',
                background: activeTab === tab.id 
                  ? 'linear-gradient(135deg, #667eea, #764ba2)' 
                  : 'transparent',
                color: activeTab === tab.id ? 'white' : '#666',
                transform: activeTab === tab.id ? 'translateY(-2px)' : 'none',
                boxShadow: activeTab === tab.id ? '0 10px 20px rgba(102, 126, 234, 0.3)' : 'none'
              }}
            >
              <span style={{ marginRight: '8px' }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* Content */}
        <div style={{ 
          display: activeTab === 'atividades' ? 'block' : 'none',
          animation: activeTab === 'atividades' ? 'fadeIn 0.5s ease' : 'none'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
            {/* Cadastro de Atividades */}
            <div style={{ 
              background: 'rgba(255,255,255,0.95)', 
              backdropFilter: 'blur(10px)',
              padding: '30px', 
              borderRadius: '20px', 
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              border: '1px solid rgba(255,255,255,0.2)',
              transform: 'translateY(0)',
              transition: 'transform 0.3s ease'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  background: 'linear-gradient(135deg, #4ade80, #22c55e)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  boxShadow: '0 10px 20px rgba(74, 222, 128, 0.3)'
                }}>📋</div>
                <h2 style={{ fontSize: '24px', fontWeight: '700', margin: '0', color: '#1f2937' }}>Nova Atividade</h2>
              </div>
              
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
                  min="1"
                />
                
                <button 
                  type="submit" 
                  disabled={saving}
                  style={{ 
                    padding: '15px 30px', 
                    background: saving ? '#9ca3af' : 'linear-gradient(135deg, #4ade80, #22c55e)', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '12px', 
                    cursor: saving ? 'not-allowed' : 'pointer',
                    fontSize: '16px',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                    transform: 'translateY(0)',
                    boxShadow: '0 10px 20px rgba(74, 222, 128, 0.3)'
                  }}
                >
                  {saving ? '⏳ Salvando...' : '✨ Criar Atividade'}
                </button>
              </form>
            </div>

            {/* Lista de Atividades */}
            <div style={{ 
              background: 'rgba(255,255,255,0.95)', 
              backdropFilter: 'blur(10px)',
              padding: '30px', 
              borderRadius: '20px', 
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: '600', margin: '0 0 20px 0', color: '#1f2937' }}>Atividades Cadastradas</h3>
              <div style={{ maxHeight: '400px', overflowY: 'auto', paddingRight: '10px' }}>
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
                      boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
                    }}
                  >
                    <div style={{ fontWeight: '600', fontSize: '16px', color: '#1f2937', marginBottom: '8px' }}>{atividade.nome}</div>
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

        {/* Complexidades Tab */}
        <div style={{ 
          display: activeTab === 'complexidades' ? 'block' : 'none',
          animation: activeTab === 'complexidades' ? 'fadeIn 0.5s ease' : 'none'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
            {/* Cadastro de Complexidades */}
            <div style={{ 
              background: 'rgba(255,255,255,0.95)', 
              backdropFilter: 'blur(10px)',
              padding: '30px', 
              borderRadius: '20px', 
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '25px' }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  background: 'linear-gradient(135deg, #f59e0b, #d97706)',
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px',
                  boxShadow: '0 10px 20px rgba(245, 158, 11, 0.3)'
                }}>🔧</div>
                <h2 style={{ fontSize: '24px', fontWeight: '700', margin: '0', color: '#1f2937' }}>Nova Complexidade</h2>
              </div>
              
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
                  required
                />
                
                <div>
                  <label style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px', display: 'block', color: '#1f2937' }}>
                    🎯 Selecionar Atividades:
                  </label>
                  <div style={{ 
                    maxHeight: '200px', 
                    overflowY: 'auto', 
                    border: '2px solid #e5e7eb', 
                    borderRadius: '12px', 
                    padding: '15px',
                    background: 'white'
                  }}>
                    {atividades.map((atividade) => (
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
                          transition: 'all 0.3s ease'
                        }}
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
                    background: saving ? '#9ca3af' : 'linear-gradient(135deg, #f59e0b, #d97706)', 
                    color: 'white', 
                    border: 'none', 
                    borderRadius: '12px', 
                    cursor: saving ? 'not-allowed' : 'pointer',
                    fontSize: '16px',
                    fontWeight: '600',
                    transition: 'all 0.3s ease',
                    transform: 'translateY(0)',
                    boxShadow: '0 10px 20px rgba(245, 158, 11, 0.3)'
                  }}
                >
                  {saving ? '⏳ Salvando...' : '🚀 Criar Complexidade'}
                </button>
              </form>
            </div>
            
            {/* Lista de Complexidades */}
            <div style={{ 
              background: 'rgba(255,255,255,0.95)', 
              backdropFilter: 'blur(10px)',
              padding: '30px', 
              borderRadius: '20px', 
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <h3 style={{ fontSize: '20px', fontWeight: '600', margin: '0 0 20px 0', color: '#1f2937' }}>Complexidades Cadastradas</h3>
              <div style={{ maxHeight: '500px', overflowY: 'auto', paddingRight: '10px' }}>
                {complexidades.map((complexidade) => (
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
                      boxShadow: '0 4px 6px rgba(0,0,0,0.05)'
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

        {/* Diagnóstico Tab */}
        <div style={{ 
          display: activeTab === 'diagnostico' ? 'block' : 'none',
          animation: activeTab === 'diagnostico' ? 'fadeIn 0.5s ease' : 'none'
        }}>
          <DiagnosticoTab 
            diagnostico={diagnostico}
            setDiagnostico={setDiagnostico}
            corrigindo={corrigindo}
            setCorrigindo={setCorrigindo}
          />
        </div>

        {/* Exclusão Tab */}
        <div style={{ 
          display: activeTab === 'exclusao' ? 'block' : 'none',
          animation: activeTab === 'exclusao' ? 'fadeIn 0.5s ease' : 'none'
        }}>
          <ExclusaoTab 
            atividades={atividades}
            carregarDados={carregarDados}
          />
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  )
}