'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import ProcessosList from '../components/ProcessosList'

interface Paciente {
  id: string
  nome: string
}

interface Complexidade {
  id: string
  nome: string
}

interface ModalSucessoProps {
  isOpen: boolean
  onClose: () => void
  pacienteNome: string
  complexidadeNome: string
}

function ModalSucesso({ isOpen, onClose, pacienteNome, complexidadeNome }: ModalSucessoProps) {
  if (!isOpen) return null

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.5)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: 'white',
        borderRadius: '16px',
        padding: '0',
        maxWidth: '450px',
        width: '100%',
        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
        animation: 'fadeIn 0.3s ease-out'
      }}>
        <div style={{
          padding: '32px 32px 24px 32px',
          textAlign: 'center'
        }}>
          <div style={{
            width: '64px',
            height: '64px',
            borderRadius: '50%',
            backgroundColor: '#10b981',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            margin: '0 auto 20px auto',
            fontSize: '28px',
            color: 'white'
          }}>
            ✓
          </div>
          
          <h3 style={{
            margin: '0 0 12px 0',
            fontSize: '20px',
            fontWeight: '600',
            color: '#1e293b'
          }}>
            Processo Criado com Sucesso!
          </h3>
          
          <p style={{
            margin: '0 0 24px 0',
            fontSize: '14px',
            color: '#64748b',
            lineHeight: '1.5'
          }}>
            O workflow foi iniciado e todas as atividades foram configuradas automaticamente.
          </p>

          <div style={{
            backgroundColor: '#f0fdf4',
            padding: '16px',
            borderRadius: '8px',
            marginBottom: '24px',
            border: '1px solid #bbf7d0'
          }}>
            <div style={{
              fontSize: '13px',
              color: '#059669',
              fontWeight: '600',
              marginBottom: '4px'
            }}>
              👥 Paciente: {pacienteNome}
            </div>
            <div style={{
              fontSize: '13px',
              color: '#059669',
              fontWeight: '600'
            }}>
              ⚙️ Complexidade: {complexidadeNome}
            </div>
          </div>

          <button
            onClick={onClose}
            style={{
              width: '100%',
              padding: '12px 24px',
              border: 'none',
              borderRadius: '8px',
              backgroundColor: '#10b981',
              color: 'white',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            📊 Continuar
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ProcessosPage() {
  const router = useRouter()
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [complexidades, setComplexidades] = useState<Complexidade[]>([])
  const [selectedPaciente, setSelectedPaciente] = useState('')
  const [selectedComplexidade, setSelectedComplexidade] = useState('')
  const [modalSucessoAberto, setModalSucessoAberto] = useState(false)
  const [processoInfo, setProcessoInfo] = useState({ pacienteNome: '', complexidadeNome: '' })
  const [refreshProcessos, setRefreshProcessos] = useState(0)
  const [totalProcessos, setTotalProcessos] = useState(0)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [pacientesRes, complexidadesRes, processosRes] = await Promise.all([
        fetch('/api/pacientes'),
        fetch('/api/complexidades'),
        fetch('/api/processos')
      ])
      
      const pacientesData = await pacientesRes.json()
      const complexidadesData = await complexidadesRes.json()
      const processosData = await processosRes.json()
      
      setPacientes(Array.isArray(pacientesData) ? pacientesData : [])
      setComplexidades(Array.isArray(complexidadesData) ? complexidadesData : [])
      setTotalProcessos(Array.isArray(processosData) ? processosData.length : 0)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
      setPacientes([])
      setComplexidades([])
      setTotalProcessos(0)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const pacienteNome = pacientes.find(p => p.id === selectedPaciente)?.nome || ''
      const complexidadeNome = complexidades.find(c => c.id === selectedComplexidade)?.nome || ''
      
      await fetch('/api/processos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          entidadeId: selectedPaciente,
          tipoWorkflowId: selectedComplexidade
        })
      })
      
      setProcessoInfo({ pacienteNome, complexidadeNome })
      setModalSucessoAberto(true)
      setSelectedPaciente('')
      setSelectedComplexidade('')
      setRefreshProcessos(prev => prev + 1)
      setTotalProcessos(prev => prev + 1)
    } catch (error) {
      console.error('Erro ao criar processo:', error)
    }
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      background: '#f8fafc',
      padding: '20px'
    }}>
      {/* Modal de Sucesso */}
      <ModalSucesso
        isOpen={modalSucessoAberto}
        onClose={() => setModalSucessoAberto(false)}
        pacienteNome={processoInfo.pacienteNome}
        complexidadeNome={processoInfo.complexidadeNome}
      />
      
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
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
              <div style={{
                width: '60px',
                height: '60px',
                background: '#3b82f6',
                borderRadius: '15px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '28px',
                boxShadow: '0 10px 20px rgba(59, 130, 246, 0.3)'
              }}>⚙️</div>
              <div>
                <h1 style={{ 
                  fontSize: '32px', 
                  fontWeight: '700', 
                  margin: '0',
                  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                }}>Gerenciar Processos</h1>
                <p style={{ 
                  fontSize: '16px', 
                  color: '#666', 
                  margin: '5px 0 0 0'
                }}>Criação e acompanhamento de workflows</p>
              </div>
            </div>
            <a href="/" style={{ textDecoration: 'none' }}>
              <button style={{
                padding: '12px 20px',
                background: 'rgba(255,255,255,0.9)',
                border: '2px solid #3b82f6',
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
                e.target.style.background = '#3b82f6'
                e.target.style.color = 'white'
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(255,255,255,0.9)'
                e.target.style.color = '#1d4ed8'
              }}>
                ← Voltar
              </button>
            </a>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px' }}>
          <div style={{
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '30px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1f2937', margin: '0 0 25px 0' }}>
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
                  background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                  color: 'white',
                  padding: '15px 30px',
                  borderRadius: '12px',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  transform: 'translateY(0)',
                  boxShadow: '0 10px 20px rgba(59, 130, 246, 0.3)'
                }}
                onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
                onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
              >
                🚀 Criar Processo
              </button>
            </form>
          </div>

          <div style={{
            background: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(10px)',
            borderRadius: '20px',
            padding: '30px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#1a202c', margin: '0' }}>
                📋 Processos Ativos
              </h2>
              <div style={{
                background: 'linear-gradient(135deg, #ed8936, #dd6b20)',
                color: 'white',
                padding: '6px 12px',
                borderRadius: '12px',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                Total: {totalProcessos}
              </div>
            </div>
            <ProcessosList 
              key={refreshProcessos} 
              onProcessoExcluido={() => setTotalProcessos(prev => prev - 1)}
            />
          </div>
        </div>
      </div>
    </div>
  )
}