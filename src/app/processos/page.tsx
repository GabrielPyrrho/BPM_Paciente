'use client'

import { useState, useEffect } from 'react'
import ProcessosList from '../components/ProcessosList'

interface Paciente {
  id: string
  nome: string
}

interface Complexidade {
  id: string
  nome: string
}

export default function ProcessosPage() {
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [complexidades, setComplexidades] = useState<Complexidade[]>([])
  const [selectedPaciente, setSelectedPaciente] = useState('')
  const [selectedComplexidade, setSelectedComplexidade] = useState('')

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [pacientesRes, complexidadesRes] = await Promise.all([
        fetch('/api/pacientes'),
        fetch('/api/complexidades')
      ])
      setPacientes(await pacientesRes.json())
      setComplexidades(await complexidadesRes.json())
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await fetch('/api/processos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          pacienteId: selectedPaciente,
          complexidadeId: selectedComplexidade
        })
      })
      alert('Processo criado com sucesso!')
      setSelectedPaciente('')
      setSelectedComplexidade('')
    } catch (error) {
      console.error('Erro ao criar processo:', error)
    }
  }

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
              background: 'linear-gradient(135deg, #ed8936, #dd6b20)',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '20px'
            }}>
              ⚙️
            </div>
            <div>
              <h1 style={{ fontSize: '24px', fontWeight: '700', color: '#1a202c', margin: '0' }}>
                Gerenciamento de Processos
              </h1>
              <p style={{ fontSize: '14px', color: '#718096', margin: '0' }}>
                Criação e acompanhamento de workflows
              </p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '40px 20px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px' }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '30px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1a202c', marginBottom: '20px' }}>
              ➕ Criar Novo Processo
            </h2>
            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: '20px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  Paciente *
                </label>
                <select
                  value={selectedPaciente}
                  onChange={(e) => setSelectedPaciente(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '10px',
                    fontSize: '14px',
                    backgroundColor: 'white'
                  }}
                  required
                >
                  <option value="">Selecione um paciente</option>
                  {pacientes.map((p) => (
                    <option key={p.id} value={p.id}>{p.nome}</option>
                  ))}
                </select>
              </div>
              
              <div style={{ marginBottom: '25px' }}>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  Complexidade *
                </label>
                <select
                  value={selectedComplexidade}
                  onChange={(e) => setSelectedComplexidade(e.target.value)}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: '10px',
                    fontSize: '14px',
                    backgroundColor: 'white'
                  }}
                  required
                >
                  <option value="">Selecione a complexidade</option>
                  {complexidades.map((c) => (
                    <option key={c.id} value={c.id}>{c.nome}</option>
                  ))}
                </select>
              </div>
            
              <button 
                type="submit" 
                style={{
                  width: '100%',
                  background: 'linear-gradient(135deg, #ed8936, #dd6b20)',
                  color: 'white',
                  padding: '14px 20px',
                  borderRadius: '10px',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
              >
                ✓ Criar Processo
              </button>
            </form>
          </div>

          <div style={{
            background: 'rgba(255, 255, 255, 0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '30px',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.1)'
          }}>
            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1a202c', marginBottom: '20px' }}>
              📋 Processos Ativos
            </h2>
            <ProcessosList />
          </div>
        </div>
      </div>
    </div>
  )
}