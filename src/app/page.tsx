'use client'

import { useState, useEffect } from 'react'

interface DashboardStats {
  totalPacientes: number
  processosAtivos: number
  workflowsAndamento: number
  taxaConclusao: number
}

export default function Home() {
  const [stats, setStats] = useState<DashboardStats>({
    totalPacientes: 0,
    processosAtivos: 0,
    workflowsAndamento: 0,
    taxaConclusao: 0
  })
  const [loading, setLoading] = useState(true)

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
          totalPacientes: Array.isArray(pacientes) ? pacientes.length : 0,
          processosAtivos: Array.isArray(processos) ? processos.length : 0,
          workflowsAndamento: dashboard.stats?.workflowsAtivos || 0,
          taxaConclusao: dashboard.stats?.taxaConclusao || 0
        })
      } catch (error) {
        console.log('Usando dados padrão - APIs não disponíveis')
        setStats({
          totalPacientes: 0,
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
              <div style={{
                width: '40px',
                height: '40px',
                background: '#3b82f6',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px'
              }}>
                🏥
              </div>
              <div>
                <h1 style={{ 
                  fontSize: '20px', 
                  fontWeight: '600', 
                  color: '#1e293b',
                  margin: '0'
                }}>
                  Sistema BPM Hospitalar
                </h1>
                <p style={{ 
                  fontSize: '14px', 
                  color: '#64748b', 
                  margin: '0'
                }}>
                  Gestão de Processos de Internamento
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
            Acesse os módulos do sistema para gerenciar processos de internamento
          </p>
        </div>
        {/* Cards de Módulos */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
          <a href="/dashboard" style={{ textDecoration: 'none' }}>
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
                  background: '#eff6ff',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px'
                }}>
                  📊
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', margin: '0' }}>Dashboard</h3>
                  <div style={{ fontSize: '12px', color: '#10b981', fontWeight: '500', marginTop: '2px' }}>Módulo Ativo</div>
                </div>
              </div>
              <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.5', margin: '0', flex: 1 }}>Visualize estatísticas, indicadores de performance e relatórios em tempo real</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>Último acesso: Hoje</span>
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
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', margin: '0' }}>Pacientes</h3>
                  <div style={{ fontSize: '12px', color: '#10b981', fontWeight: '500', marginTop: '2px' }}>Módulo Ativo</div>
                </div>
              </div>
              <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.5', margin: '0', flex: 1 }}>Cadastro, edição e gerenciamento completo de pacientes do sistema</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                  {loading ? 'Carregando...' : `Total: ${stats.totalPacientes} pacientes`}
                </span>
                <span style={{ fontSize: '18px', color: '#3b82f6' }}>→</span>
              </div>
            </div>
          </a>

          <a href="/processos" style={{ textDecoration: 'none' }}>
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
                  ⚙️
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', margin: '0' }}>Processos</h3>
                  <div style={{ fontSize: '12px', color: '#10b981', fontWeight: '500', marginTop: '2px' }}>Módulo Ativo</div>
                </div>
              </div>
              <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.5', margin: '0', flex: 1 }}>Criação e configuração de processos com diferentes complexidades</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                  {loading ? 'Carregando...' : `Ativos: ${stats.processosAtivos} processos`}
                </span>
                <span style={{ fontSize: '18px', color: '#3b82f6' }}>→</span>
              </div>
            </div>
          </a>

          <a href="/workflow" style={{ textDecoration: 'none' }}>
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
                  background: '#faf5ff',
                  borderRadius: '8px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '24px'
                }}>
                  📋
                </div>
                <div>
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', margin: '0' }}>Workflow BPM</h3>
                  <div style={{ fontSize: '12px', color: '#10b981', fontWeight: '500', marginTop: '2px' }}>Módulo Principal</div>
                </div>
              </div>
              <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.5', margin: '0', flex: 1 }}>Acompanhamento em tempo real das atividades e controle do fluxo</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                  {loading ? 'Carregando...' : `Em andamento: ${stats.workflowsAndamento} workflows`}
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
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', margin: '0' }}>Atividades</h3>
                  <div style={{ fontSize: '12px', color: '#10b981', fontWeight: '500', marginTop: '2px' }}>Configuração</div>
                </div>
              </div>
              <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.5', margin: '0', flex: 1 }}>Cadastre e gerencie as atividades do workflow hospitalar</p>
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
                  <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', margin: '0' }}>Complexidades</h3>
                  <div style={{ fontSize: '12px', color: '#10b981', fontWeight: '500', marginTop: '2px' }}>Configuração</div>
                </div>
              </div>
              <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.5', margin: '0', flex: 1 }}>Configure complexidades e associe atividades aos workflows</p>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '16px' }}>
                <span style={{ fontSize: '12px', color: '#94a3b8' }}>
                  Gerenciar complexidades
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
                {loading ? '...' : stats.totalPacientes}
              </div>
              <div style={{ fontSize: '14px', color: '#64748b' }}>Pacientes Cadastrados</div>
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
            Sistema BPM Hospitalar - Versão 2.1.0
          </p>
          <p style={{ 
            color: '#94a3b8', 
            fontSize: '12px',
            margin: '0'
          }}>
            © 2024 - Todos os direitos reservados | Desenvolvido para otimizar processos hospitalares
          </p>
        </div>
      </div>
    </div>
  )
}