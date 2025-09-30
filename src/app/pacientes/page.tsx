'use client'

import { useState, useEffect } from 'react'

interface Paciente {
  id: string
  nome: string
}

export default function PacientesPage() {
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [nome, setNome] = useState('')
  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  useEffect(() => {
    fetchPacientes()
  }, [])

  const fetchPacientes = async () => {
    const res = await fetch('/api/pacientes')
    const data = await res.json()
    setPacientes(data)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nome.trim()) return
    
    setLoading(true)
    await fetch('/api/pacientes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome })
    })
    setNome('')
    fetchPacientes()
    setLoading(false)
  }

  const filteredPacientes = pacientes.filter(p => 
    p.nome.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    }}>
      {/* Header */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.95)',
        backdropFilter: 'blur(10px)',
        borderBottom: '1px solid rgba(255, 255, 255, 0.2)',
        padding: '20px 0'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: 'linear-gradient(135deg, #48bb78, #38a169)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '20px'
            }}>
              👥
            </div>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1a202c', margin: '0' }}>
                Gerenciamento de Pacientes
              </h1>
              <p style={{ fontSize: '14px', color: '#718096', margin: '0' }}>
                Cadastro e consulta de pacientes do sistema
              </p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
          {/* Formulário */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '30px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1a202c', marginBottom: '20px' }}>
              🆕 Cadastrar Novo Paciente
            </h2>
            
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  Nome Completo *
                </label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '10px',
                    fontSize: '14px',
                    transition: 'border-color 0.2s'
                  }}
                  placeholder="Digite o nome completo do paciente"
                  required
                />
              </div>

              <button 
                type="submit" 
                disabled={loading}
                style={{
                  width: '100%',
                  background: loading ? '#9ca3af' : 'linear-gradient(135deg, #48bb78, #38a169)',
                  color: 'white',
                  padding: '14px 20px',
                  borderRadius: '10px',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                {loading ? '⏳ Cadastrando...' : '✓ Cadastrar Paciente'}
              </button>
            </form>
          </div>

          {/* Lista */}
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '30px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1a202c', margin: '0' }}>
                📄 Pacientes Cadastrados
              </h2>
              <div style={{
                background: 'linear-gradient(135deg, #48bb78, #38a169)',
                color: 'white',
                padding: '6px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                {pacientes.length} pacientes
              </div>
            </div>

            <div style={{ marginBottom: '20px' }}>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: '2px solid #e5e7eb',
                  borderRadius: '10px',
                  fontSize: '14px'
                }}
                placeholder="🔍 Buscar paciente..."
              />
            </div>

            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              {filteredPacientes.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>👥</div>
                  <p>Nenhum paciente encontrado</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {filteredPacientes.map((paciente) => (
                    <div key={paciente.id} style={{
                      padding: '16px',
                      background: '#f8fafc',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0',
                      transition: 'all 0.2s'
                    }}>
                      <div style={{ fontWeight: '600', fontSize: '16px', color: '#1a202c', marginBottom: '4px' }}>
                        {paciente.nome}
                      </div>
                      <div style={{ fontSize: '12px', color: '#64748b' }}>
                        ID: {paciente.id.slice(0, 8)}...
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