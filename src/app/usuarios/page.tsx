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
      const res = await fetch('/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(novoUsuario)
      })
      
      if (res.ok) {
        setNovoUsuario({ nome: '', email: '', senha: '', funcao: '', setorId: '' })
        setModal({ show: true, message: 'Usuário criado com sucesso!', type: 'success' })
        await carregarDados()
      } else {
        const error = await res.json()
        setModal({ show: true, message: error.error, type: 'error' })
      }
    } catch (error) {
      setModal({ show: true, message: 'Erro ao criar usuário', type: 'error' })
    }
  }

  if (loading) return <div>Carregando...</div>

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc', padding: '20px' }}>
      {modal.show && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.5)', zIndex: 1000, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ background: 'white', padding: '30px', borderRadius: '12px', maxWidth: '400px', width: '90%', textAlign: 'center', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
            <div style={{ fontSize: '48px', marginBottom: '15px' }}>
              {modal.type === 'success' ? '✓' : '⚠'}
            </div>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '15px', color: modal.type === 'success' ? '#059669' : '#dc2626' }}>
              {modal.type === 'success' ? 'Sucesso!' : 'Erro'}
            </h3>
            <p style={{ fontSize: '14px', color: '#6b7280', marginBottom: '20px' }}>
              {modal.message}
            </p>
            <button 
              onClick={() => setModal({ show: false, message: '', type: '' })}
              style={{ padding: '10px 20px', background: modal.type === 'success' ? '#059669' : '#dc2626', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer' }}
            >
              OK
            </button>
          </div>
        </div>
      )}
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '30px' }}>
          <a href="/" style={{ textDecoration: 'none' }}>
            <button style={{ padding: '10px 20px', background: '#6b7280', color: 'white', border: 'none', borderRadius: '8px' }}>
              ← Voltar
            </button>
          </a>
          <h1 style={{ fontSize: '28px', fontWeight: '700', color: '#1e293b', margin: 0 }}>
            Gerenciar Usuários
          </h1>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
          <div style={{ background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h2 style={{ fontSize: '20px', fontWeight: '600', marginBottom: '20px' }}>Novo Usuário</h2>
            
            <form onSubmit={criarUsuario} style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <input
                type="text"
                placeholder="Nome completo"
                value={novoUsuario.nome}
                onChange={(e) => setNovoUsuario({...novoUsuario, nome: e.target.value})}
                style={{ padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }}
                required
              />
              
              <input
                type="email"
                placeholder="Email"
                value={novoUsuario.email}
                onChange={(e) => setNovoUsuario({...novoUsuario, email: e.target.value})}
                style={{ padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }}
                required
              />
              
              <input
                type="password"
                placeholder="Senha"
                value={novoUsuario.senha}
                onChange={(e) => setNovoUsuario({...novoUsuario, senha: e.target.value})}
                style={{ padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }}
                required
              />
              
              <input
                type="text"
                placeholder="Função (opcional)"
                value={novoUsuario.funcao}
                onChange={(e) => setNovoUsuario({...novoUsuario, funcao: e.target.value})}
                style={{ padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }}
              />
              
              <select
                value={novoUsuario.setorId}
                onChange={(e) => setNovoUsuario({...novoUsuario, setorId: e.target.value})}
                style={{ padding: '12px', border: '1px solid #d1d5db', borderRadius: '8px', fontSize: '14px' }}
              >
                <option value="">Selecione um setor</option>
                {setores.map(setor => (
                  <option key={setor.id} value={setor.id}>
                    {setor.nome}
                  </option>
                ))}
              </select>
              
              <button 
                type="submit"
                style={{ padding: '12px', background: '#3b82f6', color: 'white', border: 'none', borderRadius: '8px', fontWeight: '600' }}
              >
                Criar Usuário
              </button>
            </form>
          </div>

          <div style={{ background: 'white', padding: '30px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>
              Usuários Cadastrados ({usuarios.length})
            </h3>
            
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {usuarios.map(usuario => (
                <div key={usuario.id} style={{ padding: '15px', border: '1px solid #e5e7eb', borderRadius: '8px', marginBottom: '10px' }}>
                  <div style={{ fontWeight: '600', fontSize: '16px', marginBottom: '5px' }}>
                    {usuario.nome}
                  </div>
                  <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '3px' }}>
                    📧 {usuario.email}
                  </div>
                  {usuario.funcao && (
                    <div style={{ fontSize: '14px', color: '#6b7280', marginBottom: '3px' }}>
                      💼 {usuario.funcao}
                    </div>
                  )}
                  <div style={{ fontSize: '14px', color: '#6b7280' }}>
                    🏢 {usuario.setor?.nome || 'Sem setor'}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}