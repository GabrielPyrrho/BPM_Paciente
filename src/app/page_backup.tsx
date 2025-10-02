'use client'

import { useState, useEffect } from 'react'

interface DashboardStats {
  totalEntidades: number
  processosAtivos: number
  workflowsAndamento: number
  taxaConclusao: number
}

export default function Home() {
  const [stats, setStats] = useState<DashboardStats>({
    totalEntidades: 0,
    processosAtivos: 0,
    workflowsAndamento: 0,
    taxaConclusao: 0
  })
  const [loading, setLoading] = useState(true)
  const [adminClicks, setAdminClicks] = useState(0)

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // Buscar dados reais das APIs
        const [pacientesRes, processosRes, dashboardRes] = await Promise.all([
          fetch('/api/pacientes').catch(() => ({ json: () => [] })),
          fetch('/api/processos').catch(() => ({ json: () => [] })),
          fetch('/api/dashboard').catch(() => ({ json: () => ({ stats: {} }) }))
        ])

        const pacientes = await pacientesRes.json()
        const processos = await processosRes.json()
        const dashboard = await dashboardRes.json()

        setStats({
          totalEntidades: Array.isArray(pacientes) ? pacientes.length : 0,
          processosAtivos: Array.isArray(processos) ? processos.length : 0,
          workflowsAndamento: dashboard.stats?.workflowsAtivos || 0,
          taxaConclusao: dashboard.stats?.taxaConclusao || 0
        })
      } catch (error) {
        console.log('Usando dados padrão - APIs não disponíveis')
        setStats({
          totalEntidades: 0,
          processosAtivos: 0,
          workflowsAndamento: 0,
          taxaConclusao: 0
        })
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const handleLogoClick = () => {
    setAdminClicks(prev => prev + 1)
    if (adminClicks >= 4) {
      window.location.href = '/admin'
    }
    setTimeout(() => setAdminClicks(0), 3000)
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#f8fafc',
      fontFamily: 'system-ui, -apple-system, sans-serif'
    }}>
      {/* Header Corporativo */}
      <div style={{
        background: 'white',
        borderBottom: '1px solid #e2e8f0',
        padding: '16px 0',
        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div 
                onClick={handleLogoClick}
                style={{
                  width: '40px',
                  height: '40px',
                  background: '#3b82f6',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '20px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'scale(1.05)'
                  e.currentTarget.style.background = '#2563eb'
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'scale(1)'
                  e.currentTarget.style.background = '#3b82f6'
                }}
              >
                🏥
              </div>
              <div>
                <h1 style={{ 
                  fontSize: '20px', 
                  fontWeight: '600', 
                  color: '#1e293b',
                  margin: '0'
                }}>
                  Sistema BPM Genérico
                </h1>
                <p style={{ 
                  fontSize: '14px', 
                  color: '#64748b', 
                  margin: '0'
                }}>
                  Gestão de Workflows Genéricos
                </p>
              </div>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              <div style={{
                background: '#10b981',
                color: 'white',
                padding: '6px 12px',
                borderRadius: '6px',
                fontSize: '12px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                <div style={{
                  width: '6px',
                  height: '6px',
                  background: '#34d399',
                  borderRadius: '50%'
                }}></div>
                Online
              </div>
              <div style={{
                color: '#64748b',
                fontSize: '14px'
              }}>
                {new Date().toLocaleDateString('pt-BR')} - {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
              </div>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Breadcrumb e Título */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{
            fontSize: '14px',
            color: '#64748b',
            marginBottom: '8px'
          }}>
            Início › Painel Principal
          </div>
          <h2 style={{ 
            fontSize: '28px', 
            fontWeight: '700', 
            color: '#1e293b',
            margin: '0',
            marginBottom: '8px'
          }}>
            Painel de Controle
          </h2>
          <p style={{
            fontSize: '16px',
            color: '#64748b',
            margin: '0'
          }}>
            Acesse os módulos do sistema para gerenciar workflows de qualquer natureza
          </p>
        </div>
        {/* Cards de Módulos */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          <a href="/etapas" style={{ textDecoration: 'none' }}>
            <div style={{ 
              background: 'white',
              padding: '24px',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid #e2e8f0',
              transition: 'all 0.2s ease',
              cursor: 'pointer',
              height: '160px',
              display: 'flex',
              flexDirection: 'column'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.borderColor = '#3b82f6'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.borderColor = '#e2e8f0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: '#fef3c7',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px'
                }}>
                  🏷️
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', margin: '0' }}>0. Etapas (Abas)</h3>
                  <div style={{ fontSize: '12px', color: '#10b981', fontWeight: '500', marginTop: '2px' }}>Organização</div>
                </div>
              </div>
              <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.5', margin: '0', flex: 1 }}>Defina as abas/etapas que organizam as atividades (ex: Captação, Análise)</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>Gerenciar etapas</span>
                <span style={{ fontSize: '18px', color: '#3b82f6' }}>→</span>
              </div>
            </div>
          </a>

          <a href="/atividades" style={{ textDecoration: 'none' }}>
            <div style={{ 
              background: 'white',
              padding: '24px',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid #e2e8f0',
              transition: 'all 0.2s ease',
              cursor: 'pointer',
              height: '160px',
              display: 'flex',
              flexDirection: 'column'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.borderColor = '#3b82f6'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.borderColor = '#e2e8f0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: '#f0fdf4',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px'
                }}>
                  📋
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', margin: '0' }}>1. Atividades</h3>
                  <div style={{ fontSize: '12px', color: '#10b981', fontWeight: '500', marginTop: '2px' }}>Cadastro Base</div>
                </div>
              </div>
              <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.5', margin: '0', flex: 1 }}>Cadastre atividades que serão executadas nos workflows (ex: Coleta Documentos)</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                  Gerenciar atividades
                </span>
                <span style={{ fontSize: '18px', color: '#3b82f6' }}>→</span>
              </div>
            </div>
          </a>

          <a href="/complexidades" style={{ textDecoration: 'none' }}>
            <div style={{ 
              background: 'white',
              padding: '24px',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid #e2e8f0',
              transition: 'all 0.2s ease',
              cursor: 'pointer',
              height: '160px',
              display: 'flex',
              flexDirection: 'column'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.borderColor = '#3b82f6'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.borderColor = '#e2e8f0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: '#fffbeb',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px'
                }}>
                  🔧
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', margin: '0' }}>2. Tipos de Workflow</h3>
                  <div style={{ fontSize: '12px', color: '#10b981', fontWeight: '500', marginTop: '2px' }}>Agrupamento</div>
                </div>
              </div>
              <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.5', margin: '0', flex: 1 }}>Crie tipos de workflow agrupando atividades (ex: HC24, HC48, Contrato)</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                  Gerenciar tipos
                </span>
                <span style={{ fontSize: '18px', color: '#3b82f6' }}>→</span>
              </div>
            </div>
          </a>

          <a href="/pacientes" style={{ textDecoration: 'none' }}>
            <div style={{ 
              background: 'white',
              padding: '24px',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid #e2e8f0',
              transition: 'all 0.2s ease',
              cursor: 'pointer',
              height: '160px',
              display: 'flex',
              flexDirection: 'column'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.borderColor = '#3b82f6'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.borderColor = '#e2e8f0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: '#f8fafc',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px'
                }}>
                  👥
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', margin: '0' }}>3. Entidades</h3>
                  <div style={{ fontSize: '12px', color: '#10b981', fontWeight: '500', marginTop: '2px' }}>Cadastro</div>
                </div>
              </div>
              <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.5', margin: '0', flex: 1 }}>Cadastre pessoas, empresas ou documentos que usarão os workflows</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                  {loading ? 'Carregando...' : `Total: ${stats.totalEntidades} entidades`}
                </span>
                <span style={{ fontSize: '18px', color: '#3b82f6' }}>→</span>
              </div>
            </div>
          </a>

          <a href="/atividades" style={{ textDecoration: 'none' }}>
            <div style={{ 
              background: 'white',
              padding: '24px',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid #e2e8f0',
              transition: 'all 0.2s ease',
              cursor: 'pointer',
              height: '160px',
              display: 'flex',
              flexDirection: 'column'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.borderColor = '#3b82f6'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.borderColor = '#e2e8f0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: '#f0fdf4',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px'
                }}>
                  📋
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', margin: '0' }}>1. Atividades</h3>
                  <div style={{ fontSize: '12px', color: '#10b981', fontWeight: '500', marginTop: '2px' }}>Cadastro Base</div>
                </div>
              </div>
              <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.5', margin: '0', flex: 1 }}>Cadastre atividades que serão executadas nos workflows (ex: Coleta Documentos)</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                  Gerenciar atividades
                </span>
                <span style={{ fontSize: '18px', color: '#3b82f6' }}>→</span>
              </div>
            </div>
          </a>

          <a href="/complexidades" style={{ textDecoration: 'none' }}>
            <div style={{ 
              background: 'white',
              padding: '24px',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid #e2e8f0',
              transition: 'all 0.2s ease',
              cursor: 'pointer',
              height: '160px',
              display: 'flex',
              flexDirection: 'column'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.borderColor = '#3b82f6'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.borderColor = '#e2e8f0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: '#fffbeb',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px'
                }}>
                  🔧
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', margin: '0' }}>2. Tipos de Workflow</h3>
                  <div style={{ fontSize: '12px', color: '#10b981', fontWeight: '500', marginTop: '2px' }}>Agrupamento</div>
                </div>
              </div>
              <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.5', margin: '0', flex: 1 }}>Crie tipos de workflow agrupando atividades (ex: HC24, HC48, Contrato)</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                  Gerenciar tipos
                </span>
                <span style={{ fontSize: '18px', color: '#3b82f6' }}>→</span>
              </div>
            </div>
          </a>

          <a href="/etapas" style={{ textDecoration: 'none' }}>
            <div style={{ 
              background: 'white',
              padding: '24px',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid #e2e8f0',
              transition: 'all 0.2s ease',
              cursor: 'pointer',
              height: '160px',
              display: 'flex',
              flexDirection: 'column'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.borderColor = '#3b82f6'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.borderColor = '#e2e8f0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: '#fef3c7',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px'
                }}>
                  🏷️
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', margin: '0' }}>0. Etapas (Abas)</h3>
                  <div style={{ fontSize: '12px', color: '#10b981', fontWeight: '500', marginTop: '2px' }}>Organização</div>
                </div>
              </div>
              <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.5', margin: '0', flex: 1 }}>Defina as abas/etapas que organizam as atividades (ex: Captação, Análise)</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                  Gerenciar etapas
                </span>
                <span style={{ fontSize: '18px', color: '#3b82f6' }}>→</span>
              </div>
            </div>
          </a>

          <a href="/diagnostico" style={{ textDecoration: 'none' }}>
            <div style={{ 
              background: 'white',
              padding: '24px',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
              border: '1px solid #e2e8f0',
              transition: 'all 0.2s ease',
              cursor: 'pointer',
              height: '160px',
              display: 'flex',
              flexDirection: 'column'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.15)'
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.borderColor = '#3b82f6'
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.borderColor = '#e2e8f0'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px' }}>
                <div style={{
                  width: '48px',
                  height: '48px',
                  background: '#ecfdf5',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px'
                }}>
                  🔍
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', margin: '0' }}>Diagnóstico</h3>
                  <div style={{ fontSize: '12px', color: '#10b981', fontWeight: '500', marginTop: '2px' }}>Vínculos</div>
                </div>
              </div>
              <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.5', margin: '0', flex: 1 }}>Visualize os vínculos entre processos, atividades e workflows</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                  Analisar sistema
                </span>
                <span style={{ fontSize: '18px', color: '#3b82f6' }}>→</span>
              </div>
            </div>
          </a>
        </div>
        
        {/* Estatísticas Rápidas */}
        <div style={{ 
          marginTop: '48px',
          padding: '24px',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0'
        }}>
          <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', margin: '0 0 20px 0' }}>Resumo do Sistema</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '24px' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#3b82f6', marginBottom: '4px' }}>
                {loading ? '...' : stats.totalEntidades}
              </div>
              <div style={{ fontSize: '14px', color: '#64748b' }}>Entidades Cadastradas</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#10b981', marginBottom: '4px' }}>
                {loading ? '...' : stats.processosAtivos}
              </div>
              <div style={{ fontSize: '14px', color: '#64748b' }}>Processos Ativos</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#f59e0b', marginBottom: '4px' }}>
                {loading ? '...' : stats.workflowsAndamento}
              </div>
              <div style={{ fontSize: '14px', color: '#64748b' }}>Workflows em Andamento</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '24px', fontWeight: '700', color: '#8b5cf6', marginBottom: '4px' }}>
                {loading ? '...' : `${stats.taxaConclusao}%`}
              </div>
              <div style={{ fontSize: '14px', color: '#64748b' }}>Taxa de Conclusão</div>
            </div>
          </div>
        </div>
        
        {/* Rodapé Corporativo */}
        <div style={{ 
          marginTop: '48px', 
          paddingTop: '24px',
          borderTop: '1px solid #e2e8f0',
          textAlign: 'center'
        }}>
          <p style={{ 
            color: '#64748b', 
            fontSize: '14px',
            margin: '0 0 8px 0'
          }}>
            Sistema BPM Genérico - Versão 2.1.0
          </p>
          <p style={{ 
            color: '#94a3b8', 
            fontSize: '12px',
            margin: '0'
          }}>
            © 2024 - Todos os direitos reservados | Sistema genérico de workflow
          </p>
        </div>
      </div>
    </div>
  )
}