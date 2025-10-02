'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function DiagnosticoPage() {
  const router = useRouter()
  const [data, setData] = useState({
    entidades: [],
    etapas: [],
    atividades: [],
    tiposWorkflow: [],
    processos: []
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const [entidadesRes, etapasRes, atividadesRes, tiposRes, processosRes] = await Promise.all([
          fetch('/api/pacientes'),
          fetch('/api/etapas'),
          fetch('/api/atividades'),
          fetch('/api/complexidades'),
          fetch('/api/processos')
        ])

        const entidades = await entidadesRes.json()
        const etapas = await etapasRes.json()
        const atividades = await atividadesRes.json()
        const tiposWorkflow = await tiposRes.json()
        const processos = await processosRes.json()

        setData({
          entidades: Array.isArray(entidades) ? entidades : [],
          etapas: Array.isArray(etapas) ? etapas : [],
          atividades: Array.isArray(atividades) ? atividades : [],
          tiposWorkflow: Array.isArray(tiposWorkflow) ? tiposWorkflow : [],
          processos: Array.isArray(processos) ? processos : []
        })
      } catch (error) {
        console.error('Erro ao carregar dados:', error)
      } finally {
        setLoading(false)
      }
    }

    carregarDados()
  }, [])

  return (
    <div style={{
      minHeight: '100vh',
      background: '#f8fafc',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
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
            <h1 style={{ color: '#1e293b', fontSize: '20px', margin: 0 }}>
              Diagnóstico - Vínculos do Sistema
            </h1>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        {loading ? (
          <div style={{ textAlign: 'center', padding: '60px' }}>
            <p>Carregando...</p>
          </div>
        ) : (
          <>
            {/* Fluxo */}
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '24px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ margin: '0 0 20px 0', fontSize: '18px' }}>Fluxo de Vínculos</h3>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    background: '#3b82f6',
                    color: 'white',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    minWidth: '120px',
                    textAlign: 'center'
                  }}>
                    1. ETAPAS
                  </div>
                  <span>→</span>
                  <div style={{
                    background: '#10b981',
                    color: 'white',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    minWidth: '120px',
                    textAlign: 'center'
                  }}>
                    2. ATIVIDADES
                  </div>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>
                    Atividades pertencem a etapas
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    background: '#10b981',
                    color: 'white',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    minWidth: '120px',
                    textAlign: 'center'
                  }}>
                    2. ATIVIDADES
                  </div>
                  <span>→</span>
                  <div style={{
                    background: '#f59e0b',
                    color: 'white',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    minWidth: '120px',
                    textAlign: 'center'
                  }}>
                    3. TIPOS WORKFLOW
                  </div>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>
                    Tipos agrupam atividades
                  </span>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    background: '#8b5cf6',
                    color: 'white',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    minWidth: '120px',
                    textAlign: 'center'
                  }}>
                    4. ENTIDADES
                  </div>
                  <span>+</span>
                  <div style={{
                    background: '#f59e0b',
                    color: 'white',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    minWidth: '120px',
                    textAlign: 'center'
                  }}>
                    TIPOS
                  </div>
                  <span>→</span>
                  <div style={{
                    background: '#ef4444',
                    color: 'white',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    minWidth: '120px',
                    textAlign: 'center'
                  }}>
                    5. PROCESSOS
                  </div>
                </div>

                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                  <div style={{
                    background: '#ef4444',
                    color: 'white',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    minWidth: '120px',
                    textAlign: 'center'
                  }}>
                    5. PROCESSOS
                  </div>
                  <span>→</span>
                  <div style={{
                    background: '#06b6d4',
                    color: 'white',
                    padding: '12px 16px',
                    borderRadius: '8px',
                    fontSize: '14px',
                    minWidth: '120px',
                    textAlign: 'center'
                  }}>
                    6. WORKFLOW
                  </div>
                  <span style={{ fontSize: '12px', color: '#64748b' }}>
                    Execução das atividades
                  </span>
                </div>
              </div>
            </div>

            {/* Contadores */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
              gap: '20px'
            }}>
              <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#8b5cf6' }}>
                  {data.entidades.length}
                </div>
                <div style={{ fontSize: '14px', color: '#64748b' }}>Entidades</div>
              </div>

              <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#3b82f6' }}>
                  {data.etapas.length}
                </div>
                <div style={{ fontSize: '14px', color: '#64748b' }}>Etapas</div>
              </div>

              <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#10b981' }}>
                  {data.atividades.length}
                </div>
                <div style={{ fontSize: '14px', color: '#64748b' }}>Atividades</div>
              </div>

              <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#f59e0b' }}>
                  {data.tiposWorkflow.length}
                </div>
                <div style={{ fontSize: '14px', color: '#64748b' }}>Tipos Workflow</div>
              </div>

              <div style={{
                background: 'white',
                borderRadius: '12px',
                padding: '20px',
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '32px', fontWeight: 'bold', color: '#ef4444' }}>
                  {data.processos.length}
                </div>
                <div style={{ fontSize: '14px', color: '#64748b' }}>Processos</div>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  )
}