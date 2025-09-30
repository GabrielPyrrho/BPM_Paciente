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

export default function AdminPage() {
  const [atividades, setAtividades] = useState<Atividade[]>([])
  const [complexidades, setComplexidades] = useState<Complexidade[]>([])
  const [loading, setLoading] = useState(true)
  
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
    try {
      const res = await fetch('/api/atividades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novaAtividade)
      })
      
      if (res.ok) {
        setNovaAtividade({ nome: '', setor: '', ordem: 1 })
        carregarDados()
      }
    } catch (error) {
      console.error('Erro ao criar atividade:', error)
    }
  }

  const criarComplexidade = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const res = await fetch('/api/complexidades', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novaComplexidade)
      })
      
      if (res.ok) {
        setNovaComplexidade({ nome: '', atividadeIds: [] })
        carregarDados()
      }
    } catch (error) {
      console.error('Erro ao criar complexidade:', error)
    }
  }

  if (loading) return <div style={{ padding: '20px' }}>Carregando...</div>

  return (
    <div style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <h1 style={{ fontSize: '24px', fontWeight: '600', marginBottom: '32px' }}>Administração</h1>
      
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
        {/* Cadastro de Atividades */}
        <div style={{ background: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Nova Atividade</h2>
          <form onSubmit={criarAtividade} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input
              type="text"
              placeholder="Nome da atividade"
              value={novaAtividade.nome}
              onChange={(e) => setNovaAtividade({...novaAtividade, nome: e.target.value})}
              style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              required
            />
            <input
              type="text"
              placeholder="Setor (opcional)"
              value={novaAtividade.setor}
              onChange={(e) => setNovaAtividade({...novaAtividade, setor: e.target.value})}
              style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
            <input
              type="number"
              placeholder="Ordem"
              value={novaAtividade.ordem}
              onChange={(e) => setNovaAtividade({...novaAtividade, ordem: parseInt(e.target.value)})}
              style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              min="1"
            />
            <button type="submit" style={{ padding: '10px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Criar Atividade
            </button>
          </form>
          
          <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '24px 0 12px 0' }}>Atividades Cadastradas</h3>
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {atividades.map(atividade => (
              <div key={atividade.id} style={{ padding: '8px', border: '1px solid #e5e7eb', borderRadius: '4px', marginBottom: '8px' }}>
                <div style={{ fontWeight: '500' }}>{atividade.nome}</div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>
                  Setor: {atividade.setor || 'N/A'} | Ordem: {atividade.ordem}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cadastro de Complexidades */}
        <div style={{ background: 'white', padding: '24px', borderRadius: '8px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <h2 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '16px' }}>Nova Complexidade</h2>
          <form onSubmit={criarComplexidade} style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <input
              type="text"
              placeholder="Nome da complexidade (ex: HC24, HC48)"
              value={novaComplexidade.nome}
              onChange={(e) => setNovaComplexidade({...novaComplexidade, nome: e.target.value})}
              style={{ padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
              required
            />
            
            <div>
              <label style={{ fontSize: '14px', fontWeight: '500', marginBottom: '8px', display: 'block' }}>
                Selecionar Atividades:
              </label>
              <div style={{ maxHeight: '150px', overflowY: 'auto', border: '1px solid #ccc', borderRadius: '4px', padding: '8px' }}>
                {atividades.map(atividade => (
                  <label key={atividade.id} style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px', cursor: 'pointer' }}>
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
                    />
                    <span style={{ fontSize: '14px' }}>{atividade.nome} ({atividade.setor || 'N/A'})</span>
                  </label>
                ))}
              </div>
            </div>
            
            <button type="submit" style={{ padding: '10px', background: '#10b981', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>
              Criar Complexidade
            </button>
          </form>
          
          <h3 style={{ fontSize: '16px', fontWeight: '600', margin: '24px 0 12px 0' }}>Complexidades Cadastradas</h3>
          <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
            {complexidades.map(complexidade => (
              <div key={complexidade.id} style={{ padding: '12px', border: '1px solid #e5e7eb', borderRadius: '4px', marginBottom: '8px' }}>
                <div style={{ fontWeight: '500', marginBottom: '8px' }}>{complexidade.nome}</div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>
                  Atividades ({complexidade.atividades.length}):
                  {complexidade.atividades.map(ca => ca.atividade.nome).join(', ')}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}