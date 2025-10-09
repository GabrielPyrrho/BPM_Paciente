'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Etapa {
  id: string
  nome: string
  descricao?: string
  ordem: number
  cor?: string
}

export default function EtapasPage() {
  const router = useRouter()
  const [etapas, setEtapas] = useState<Etapa[]>([])
  const [loading, setLoading] = useState(true)
  const [modalAberto, setModalAberto] = useState(false)
  const [etapaEditando, setEtapaEditando] = useState<Etapa | null>(null)
  const [modal, setModal] = useState({ show: false, message: '', type: '' })
  const [formData, setFormData] = useState({
    nome: '',
    descricao: '',
    cor: '#3b82f6'
  })

  const cores = [
    { valor: '#3b82f6', nome: 'Azul' },
    { valor: '#10b981', nome: 'Verde' },
    { valor: '#f59e0b', nome: 'Amarelo' },
    { valor: '#ef4444', nome: 'Vermelho' },
    { valor: '#8b5cf6', nome: 'Roxo' },
    { valor: '#06b6d4', nome: 'Ciano' }
  ]

  useEffect(() => {
    carregarEtapas()
  }, [])

  const carregarEtapas = async () => {
    try {
      const response = await fetch('/api/etapas')
      if (response.ok) {
        const data = await response.json()
        setEtapas(data.sort((a: Etapa, b: Etapa) => a.ordem - b.ordem))
      }
    } catch (error) {
      console.error('Erro ao carregar etapas:', error)
    } finally {
      setLoading(false)
    }
  }

  const abrirModal = (etapa?: Etapa) => {
    if (etapa) {
      setEtapaEditando(etapa)
      setFormData({
        nome: etapa.nome,
        descricao: etapa.descricao || '',
        cor: etapa.cor || '#3b82f6'
      })
    } else {
      setEtapaEditando(null)
      setFormData({
        nome: '',
        descricao: '',
        cor: '#3b82f6'
      })
    }
    setModalAberto(true)
  }

  const salvarEtapa = async () => {
    if (!formData.nome.trim()) {
      setModal({ show: true, message: 'Nome da etapa é obrigatório!', type: 'error' })
      return
    }

    try {
      const url = etapaEditando ? `/api/etapas/${etapaEditando.id}` : '/api/etapas'
      const method = etapaEditando ? 'PUT' : 'POST'
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          ordem: etapaEditando ? etapaEditando.ordem : etapas.length + 1
        })
      })

      if (response.ok) {
        await carregarEtapas()
        setModalAberto(false)
        setModal({ show: true, message: etapaEditando ? 'Etapa atualizada!' : 'Etapa criada!', type: 'success' })
      } else {
        throw new Error('Erro ao salvar etapa')
      }
    } catch (error) {
      console.error('Erro ao salvar etapa:', error)
      setModal({ show: true, message: 'Erro ao salvar etapa!', type: 'error' })
    }
  }

  const excluirEtapa = async (id: string) => {
    if (!confirm('Tem certeza que deseja excluir esta etapa?')) return

    try {
      const response = await fetch(`/api/etapas/${id}`, { method: 'DELETE' })
      if (response.ok) {
        await carregarEtapas()
        setModal({ show: true, message: 'Etapa excluída!', type: 'success' })
      } else {
        throw new Error('Erro ao excluir etapa')
      }
    } catch (error) {
      console.error('Erro ao excluir etapa:', error)
      setModal({ show: true, message: 'Erro ao excluir etapa!', type: 'error' })
    }
  }

  return (
    <div style={{ 
      minHeight: '100vh',
      background: '#f8fafc',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
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
      {/* Modal */}
      {modalAberto && (
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
          zIndex: 1000
        }}>
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            padding: '24px',
            maxWidth: '500px',
            width: '90%',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1)'
          }}>
            <h3 style={{ margin: '0 0 20px 0', fontSize: '18px', fontWeight: '600' }}>
              {etapaEditando ? 'Editar Etapa' : 'Nova Etapa'}
            </h3>
            
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>
                Nome *
              </label>
              <input
                type="text"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  boxSizing: 'border-box'
                }}
                placeholder="Ex: Captação, Pré-internamento"
              />
            </div>

            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>
                Descrição
              </label>
              <textarea
                value={formData.descricao}
                onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                style={{
                  width: '100%',
                  padding: '12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '14px',
                  minHeight: '80px',
                  resize: 'vertical',
                  boxSizing: 'border-box'
                }}
                placeholder="Descrição da etapa..."
              />
            </div>

            <div style={{ marginBottom: '24px' }}>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', marginBottom: '6px' }}>
                Cor
              </label>
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {cores.map(cor => (
                  <button
                    key={cor.valor}
                    onClick={() => setFormData({ ...formData, cor: cor.valor })}
                    style={{
                      width: '40px',
                      height: '40px',
                      borderRadius: '8px',
                      backgroundColor: cor.valor,
                      border: formData.cor === cor.valor ? '3px solid #1e293b' : '2px solid #e5e7eb',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease'
                    }}
                    title={cor.nome}
                  />
                ))}
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setModalAberto(false)}
                style={{
                  padding: '10px 20px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  backgroundColor: 'white',
                  color: '#374151',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                Cancelar
              </button>
              <button
                onClick={salvarEtapa}
                style={{
                  padding: '10px 20px',
                  border: 'none',
                  borderRadius: '8px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                {etapaEditando ? 'Atualizar' : 'Criar'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div style={{
        background: 'white',
        borderBottom: '1px solid #e2e8f0',
        padding: '16px 0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
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
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                ← Voltar
              </button>
              <div style={{
                width: '40px',
                height: '40px',
                background: '#f59e0b',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px'
              }}>
                🏷️
              </div>
              <div>
                <h1 style={{ color: '#1e293b', fontSize: '20px', margin: 0, fontWeight: '600' }}>
                  Gerenciar Cards
                </h1>
                <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>
                  Configure os cards do workflow
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
          <div>
            <h2 style={{ fontSize: '24px', fontWeight: '700', color: '#1e293b', margin: 0 }}>
              Cards do Workflow
            </h2>
            <p style={{ color: '#64748b', fontSize: '16px', margin: '4px 0 0 0' }}>
              Gerencie os cards que compõem seus workflows
            </p>
          </div>
          <button
            onClick={() => abrirModal()}
            style={{
              background: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              padding: '12px 24px',
              fontSize: '14px',
              fontWeight: '600',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}
          >
            + Nova Etapa
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <div style={{ 
              fontSize: '48px', 
              marginBottom: '16px',
              display: 'inline-block',
              animation: 'spin 1s linear infinite'
            }}>⏳</div>
            <p style={{ color: '#64748b' }}>Carregando Cards...</p>
            <style jsx>{`
              @keyframes spin {
                from { transform: rotate(0deg); }
                to { transform: rotate(360deg); }
              }
            `}</style>
          </div>
        ) : etapas.length === 0 ? (
          <div style={{
            background: 'white',
            padding: '60px',
            borderRadius: '12px',
            textAlign: 'center',
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>🏷️</div>
            <h3 style={{ color: '#1e293b', marginBottom: '12px', fontSize: '20px' }}>
              Nenhum card cadastrada
            </h3>
            <p style={{ color: '#64748b', marginBottom: '24px' }}>
              Crie seu primeiro card para organizar o workflow
            </p>
            <button
              onClick={() => abrirModal()}
              style={{
                background: '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                padding: '12px 24px',
                fontSize: '14px',
                fontWeight: '600',
                cursor: 'pointer'
              }}
            >
              + Criar Primeiro Card
            </button>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '20px' }}>
            {etapas.map((etapa, index) => (
              <div
                key={etapa.id}
                style={{
                  background: 'white',
                  borderRadius: '12px',
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                  border: '1px solid #e2e8f0',
                  overflow: 'hidden'
                }}
              >
                <div
                  style={{
                    background: etapa.cor || '#3b82f6',
                    color: 'white',
                    padding: '16px 20px',
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}
                >
                  <div>
                    <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>
                      {etapa.nome}
                    </h3>
                    <div style={{ fontSize: '14px', marginTop: '4px', opacity: 0.9 }}>
                      Ordem: {etapa.ordem}
                    </div>
                  </div>
                  <div style={{ fontSize: '24px' }}>🏷️</div>
                </div>

                <div style={{ padding: '20px' }}>
                  {etapa.descricao && (
                    <p style={{ 
                      color: '#64748b', 
                      fontSize: '14px', 
                      lineHeight: '1.5',
                      margin: '0 0 16px 0'
                    }}>
                      {etapa.descricao}
                    </p>
                  )}

                  <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                    <button
                      onClick={() => abrirModal(etapa)}
                      style={{
                        background: '#f3f4f6',
                        color: '#374151',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '8px 12px',
                        fontSize: '12px',
                        cursor: 'pointer',
                        fontWeight: '500'
                      }}
                    >
                      ✏️ Editar
                    </button>
                    <button
                      onClick={() => excluirEtapa(etapa.id)}
                      style={{
                        background: '#fef2f2',
                        color: '#dc2626',
                        border: 'none',
                        borderRadius: '6px',
                        padding: '8px 12px',
                        fontSize: '12px',
                        cursor: 'pointer',
                        fontWeight: '500'
                      }}
                    >
                      🗑️ Excluir
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}