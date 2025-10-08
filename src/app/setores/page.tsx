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
      console.log('Enviando dados:', novoSetor)
      
      const res = await fetch('/api/setores', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoSetor)
      })
      
      console.log('Response status:', res.status)
      
      if (res.ok) {
        setNovoSetor({ nome: '', descricao: '' })
        await carregarSetores()
        alert('Setor criado com sucesso!')
      } else {
        const error = await res.json()
        console.error('Erro da API:', error)
        alert(error.error + (error.details ? '\n' + error.details : ''))
      }
    } catch (error) {
      console.error('Erro na requisição:', error)
      alert('Erro ao criar setor: ' + error.message)
    }
  }

  if (loading) return <div>Carregando...</div>

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '20px' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
          <a href="/" style={{ textDecoration: 'none' }}>
            <button style={{ padding: '10px 20px', background: '#6b7280', color: 'white', border: 'none', borderRadius: '8px' }}>
              ← Voltar
            </button>
          </a>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1e293b', margin: 0 }}>
            Gerenciar Setores
          </h1>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
          <div style={{ background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>Novo Setor</h2>
            
            <form onSubmit={criarSetor} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input
                type="text"
                placeholder="Nome do setor"
                value={novoSetor.nome}
                onChange={(e) => setNovoSetor({...novoSetor, nome: e.target.value})}
                style={{ padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }}
                required
              />
              
              <textarea
                placeholder="Descrição (opcional)"
                value={novoSetor.descricao}
                onChange={(e) => setNovoSetor({...novoSetor, descricao: e.target.value})}
                style={{ padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px', minHeight: '80px' }}
              />
              
              <button 
                type="submit"
                style={{ padding: '12px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600' }}
              >
                Criar Setor
              </button>
            </form>
          </div>

          <div style={{ background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>
              Setores Cadastrados ({setores.length})
            </h3>
            
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {setores.map(setor => (
                <div key={setor.id} style={{ padding: '15px', border: '1px solid #e5e7eb', borderRadius: '8px', marginBottom: '10px' }}>
                  <div style={{ fontWeight: '600', fontSize: '16px', marginBottom: '5px' }}>
                    {setor.nome}
                  </div>
                  {setor.descricao && (
                    <div style={{ fontSize: '14px', color: '#6b7280' }}>
                      {setor.descricao}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}