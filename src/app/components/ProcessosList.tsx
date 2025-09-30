'use client'

import { useState, useEffect } from 'react'

interface Processo {
  id: string
  paciente: { nome: string }
  complexidade: { nome: string }
  atividades: Array<{
    status: string
    atividade: { nome: string }
  }>
}

export default function ProcessosList() {
  const [processos, setProcessos] = useState<Processo[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/processos')
      .then(res => res.json())
      .then(data => {
        setProcessos(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return (
    <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
      <div style={{ fontSize: '24px', marginBottom: '10px' }}>⏳</div>
      <p>Carregando processos...</p>
    </div>
  )

  return (
    <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
      {processos.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#9ca3af' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📋</div>
          <p>Nenhum processo encontrado</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          {processos.map(processo => (
            <div key={processo.id} style={{
              padding: '20px',
              background: '#f8fafc',
              borderRadius: '12px',
              border: '1px solid #e2e8f0',
              transition: 'all 0.2s'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                <div>
                  <h3 style={{ fontWeight: '600', fontSize: '16px', color: '#1a202c', marginBottom: '4px' }}>
                    {processo.paciente.nome}
                  </h3>
                  <p style={{ fontSize: '14px', color: '#64748b' }}>
                    {processo.complexidade.nome}
                  </p>
                </div>
                <div style={{
                  background: 'linear-gradient(135deg, #ed8936, #dd6b20)',
                  color: 'white',
                  padding: '4px 8px',
                  borderRadius: '12px',
                  fontSize: '10px',
                  fontWeight: '600'
                }}>
                  {processo.atividades.length} atividades
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                {processo.atividades.slice(0, 3).map((ativ, i) => (
                  <span key={i} style={{
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: '500',
                    background: ativ.status === 'OK' ? '#dcfce7' : 
                               ativ.status === 'PENDENTE' ? '#fef3c7' : '#fecaca',
                    color: ativ.status === 'OK' ? '#166534' : 
                           ativ.status === 'PENDENTE' ? '#92400e' : '#991b1b'
                  }}>
                    {ativ.atividade.nome}
                  </span>
                ))}
                {processo.atividades.length > 3 && (
                  <span style={{
                    padding: '4px 8px',
                    borderRadius: '6px',
                    fontSize: '11px',
                    fontWeight: '500',
                    background: '#f1f5f9',
                    color: '#64748b'
                  }}>
                    +{processo.atividades.length - 3} mais
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}