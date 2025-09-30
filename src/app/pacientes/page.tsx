'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Paciente {
  id: string
  nome: string
  telefone?: string
  convenio?: string
  numeroCartao?: string
  responsavelNome?: string
  responsavelTelefone?: string
}

export default function PacientesPage() {
  const router = useRouter()
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [loading, setLoading] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  
  // Estados do formulário
  const [nome, setNome] = useState('')
  const [convenio, setConvenio] = useState('')
  const [numeroCartao, setNumeroCartao] = useState('')
  const [telefone, setTelefone] = useState('')
  const [responsavelNome, setResponsavelNome] = useState('')
  const [responsavelTelefone, setResponsavelTelefone] = useState('')

  // Função para máscara de telefone
  const formatarTelefone = (valor: string) => {
    const numeros = valor.replace(/\D/g, '')
    if (numeros.length <= 10) {
      return numeros.replace(/(\d{2})(\d{4})(\d{4})/, '($1) $2-$3')
    } else {
      return numeros.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
    }
  }

  useEffect(() => {
    fetchPacientes()
  }, [])

  const fetchPacientes = async () => {
    try {
      const res = await fetch('/api/pacientes')
      const data = await res.json()
      setPacientes(data)
    } catch (error) {
      console.log('Erro ao carregar pacientes')
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!nome.trim()) return
    
    setLoading(true)
    try {
      const url = editingId ? `/api/pacientes/${editingId}` : '/api/pacientes'
      const method = editingId ? 'PUT' : 'POST'
      
      await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          nome,
          telefone,
          convenio,
          numeroCartao,
          responsavelNome,
          responsavelTelefone
        })
      })
      
      // Limpar formulário
      setNome('')
      setConvenio('')
      setNumeroCartao('')
      setTelefone('')
      setResponsavelNome('')
      setResponsavelTelefone('')
      setEditingId(null)
      
      fetchPacientes()
    } catch (error) {
      console.log('Erro ao salvar paciente')
    }
    setLoading(false)
  }

  const handleEdit = (paciente: Paciente) => {
    setNome(paciente.nome)
    setTelefone(paciente.telefone || '')
    setConvenio(paciente.convenio || '')
    setNumeroCartao(paciente.numeroCartao || '')
    setResponsavelNome(paciente.responsavelNome || '')
    setResponsavelTelefone(paciente.responsavelTelefone || '')
    setEditingId(paciente.id)
  }

  const handleDelete = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir este paciente?')) return
    
    try {
      await fetch(`/api/pacientes/${id}`, { method: 'DELETE' })
      fetchPacientes()
    } catch (error) {
      console.log('Erro ao excluir paciente')
    }
  }

  const handleCancel = () => {
    setNome('')
    setConvenio('')
    setNumeroCartao('')
    setTelefone('')
    setResponsavelNome('')
    setResponsavelTelefone('')
    setEditingId(null)
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8fafc',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header */}
      <div style={{
        background: 'white',
        borderBottom: '1px solid #e2e8f0',
        padding: '16px 0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <button
              onClick={() => router.push('/')}
              style={{
                background: '#6b7280',
                color: 'white',
                border: 'none',
                borderRadius: '6px',
                padding: '8px 16px',
                fontSize: '14px',
                cursor: 'pointer'
              }}
            >
              ← Voltar
            </button>
            <h1 style={{ fontSize: '20px', fontWeight: '600', color: '#1e293b', margin: '0' }}>
              Cadastro de Pacientes
            </h1>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '500px 1fr', gap: '32px' }}>
          {/* Formulário */}
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0',
            height: 'fit-content'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', margin: '0 0 24px 0' }}>
              {editingId ? 'Editar Paciente' : 'Novo Paciente'}
            </h3>
            
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Nome Completo *
                </label>
                <input
                  type="text"
                  value={nome}
                  onChange={(e) => setNome(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Nome completo do paciente"
                  required
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Telefone
                </label>
                <input
                  type="tel"
                  value={telefone}
                  onChange={(e) => {
                    const formatted = formatarTelefone(e.target.value)
                    if (formatted.replace(/\D/g, '').length <= 11) {
                      setTelefone(formatted)
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                  placeholder="(11) 99999-9999"
                  maxLength={15}
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Convênio
                </label>
                <input
                  type="text"
                  value={convenio}
                  onChange={(e) => setConvenio(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Ex: Unimed, Bradesco Saúde"
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Número da Carteirinha
                </label>
                <input
                  type="text"
                  value={numeroCartao}
                  onChange={(e) => {
                    const valor = e.target.value.replace(/\D/g, '')
                    setNumeroCartao(valor)
                  }}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Apenas números"
                />
              </div>

              <div style={{ marginBottom: '16px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Nome do Responsável
                </label>
                <input
                  type="text"
                  value={responsavelNome}
                  onChange={(e) => setResponsavelNome(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                  placeholder="Nome do responsável"
                />
              </div>

              <div style={{ marginBottom: '24px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                  Telefone do Responsável
                </label>
                <input
                  type="tel"
                  value={responsavelTelefone}
                  onChange={(e) => {
                    const formatted = formatarTelefone(e.target.value)
                    if (formatted.replace(/\D/g, '').length <= 11) {
                      setResponsavelTelefone(formatted)
                    }
                  }}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '14px',
                    boxSizing: 'border-box'
                  }}
                  placeholder="(11) 99999-9999"
                  maxLength={15}
                />
              </div>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button 
                  type="submit" 
                  disabled={loading}
                  style={{
                    flex: 1,
                    background: loading ? '#9ca3af' : (editingId ? '#3b82f6' : '#10b981'),
                    color: 'white',
                    padding: '14px 20px',
                    borderRadius: '8px',
                    border: 'none',
                    fontSize: '16px',
                    fontWeight: '600',
                    cursor: loading ? 'not-allowed' : 'pointer'
                  }}
                >
                  {loading ? 'Salvando...' : (editingId ? 'Atualizar' : 'Cadastrar')}
                </button>
                {editingId && (
                  <button 
                    type="button"
                    onClick={handleCancel}
                    style={{
                      background: '#6b7280',
                      color: 'white',
                      padding: '14px 20px',
                      borderRadius: '8px',
                      border: 'none',
                      fontSize: '16px',
                      fontWeight: '600',
                      cursor: 'pointer'
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
            background: 'white',
            borderRadius: '12px',
            padding: '24px',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', margin: '0 0 24px 0' }}>
              Pacientes Cadastrados ({pacientes.length})
            </h3>

            <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
              {pacientes.length === 0 ? (
                <div style={{ textAlign: 'center', padding: '60px 20px', color: '#9ca3af' }}>
                  <div style={{ fontSize: '48px', marginBottom: '16px' }}>👥</div>
                  <p style={{ fontSize: '16px', margin: '0' }}>Nenhum paciente cadastrado</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  {pacientes.map((paciente, index) => (
                    <div key={paciente.id} style={{
                      padding: '20px',
                      background: '#f8fafc',
                      borderRadius: '12px',
                      border: '1px solid #e2e8f0'
                    }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontWeight: '600', fontSize: '18px', color: '#1e293b', marginBottom: '8px' }}>
                            {paciente.nome}
                          </div>
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', fontSize: '14px' }}>
                            <div>
                              <span style={{ color: '#64748b', fontWeight: '500' }}>Convênio:</span>
                              <div style={{ color: '#1e293b', fontWeight: '600' }}>{paciente.convenio || 'Não informado'}</div>
                            </div>
                            <div>
                              <span style={{ color: '#64748b', fontWeight: '500' }}>Carteirinha:</span>
                              <div style={{ color: '#1e293b', fontWeight: '600' }}>{paciente.numeroCartao || 'Não informado'}</div>
                            </div>
                            <div>
                              <span style={{ color: '#64748b', fontWeight: '500' }}>Telefone:</span>
                              <div style={{ color: '#1e293b', fontWeight: '600' }}>{paciente.telefone || 'Não informado'}</div>
                            </div>
                            <div>
                              <span style={{ color: '#64748b', fontWeight: '500' }}>Responsável:</span>
                              <div style={{ color: '#1e293b', fontWeight: '600' }}>{paciente.responsavelNome || 'Não informado'}</div>
                            </div>
                          </div>
                          <div style={{ fontSize: '12px', color: '#64748b', marginTop: '8px' }}>
                            ID: {paciente.id?.slice(0, 8)}... • Cadastrado em {new Date().toLocaleDateString('pt-BR')}
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            onClick={() => handleEdit(paciente)}
                            style={{
                              background: '#3b82f6',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              padding: '8px 12px',
                              fontSize: '12px',
                              fontWeight: '600',
                              cursor: 'pointer'
                            }}
                          >
                            Editar
                          </button>
                          <button
                            onClick={() => handleDelete(paciente.id)}
                            style={{
                              background: '#ef4444',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              padding: '8px 12px',
                              fontSize: '12px',
                              fontWeight: '600',
                              cursor: 'pointer'
                            }}
                          >
                            Excluir
                          </button>
                        </div>
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