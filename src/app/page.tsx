'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface DashboardStats {
  totalEntidades: number
  processosAtivos: number
  workflowsAndamento: number
  taxaConclusao: number
}

export default function Home() {
  const router = useRouter()
  const [stats, setStats] = useState<DashboardStats>({
    totalEntidades: 0,
    processosAtivos: 0,
    workflowsAndamento: 0,
    taxaConclusao: 0
  })
  const [loading, setLoading] = useState(true)
  const [adminClicks, setAdminClicks] = useState(0)
  const [usuarioLogado, setUsuarioLogado] = useState<any>(null)
  const [sidebarExpanded, setSidebarExpanded] = useState(false)
  const [workflowsRecentes, setWorkflowsRecentes] = useState<any[]>([])

  useEffect(() => {
    const usuario = localStorage.getItem('usuario')
    if (usuario) {
      setUsuarioLogado(JSON.parse(usuario))
    }

    const fetchStats = async () => {
      try {
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

        // Buscar workflows recentes dos processos
        if (Array.isArray(processos) && processos.length > 0) {
          const workflowsComDetalhes = processos.slice(0, 4).map(processo => {
            // Calcular status e porcentagem baseado nas atividades
            let status = 'Em Andamento'
            let cor = '#f59e0b'
            let porcentagem = 0
            
            if (processo.atividades && processo.atividades.length > 0) {
              const atividadesOK = processo.atividades.filter(a => a.status === 'OK').length
              const totalAtividades = processo.atividades.length
              porcentagem = Math.round((atividadesOK / totalAtividades) * 100)
              
              const todasOK = processo.atividades.every(a => a.status === 'OK')
              const algumaNOK = processo.atividades.some(a => a.status === 'NOK')
              
              if (todasOK) {
                status = 'Concluído'
                cor = '#10b981'
              } else if (algumaNOK) {
                status = 'Pendente'
                cor = '#ef4444'
              }
            }
            
            return {
              id: processo.id,
              entidade: processo.entidade?.nome || 'Entidade não informada',
              processo: processo.tipoWorkflow?.nome || 'Processo não informado',
              status: status,
              cor: cor,
              porcentagem: porcentagem,
              dataAtualizacao: processo.updatedAt || processo.createdAt
            }
          })
          setWorkflowsRecentes(workflowsComDetalhes)
        }
      } catch (error) {
        console.log('Usando dados padrão - APIs não disponíveis')
        setStats({
          totalEntidades: 1,
          processosAtivos: 1,
          workflowsAndamento: 0,
          taxaConclusao: 85
        })
        // Sem dados se API não estiver disponível
        setWorkflowsRecentes([])
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  const handleLogout = () => {
    localStorage.removeItem('usuario')
    setUsuarioLogado(null)
    router.push('/login')
  }

  const abrirWorkflow = (workflowId: number) => {
    // Encontrar o processo correspondente ao workflow
    const workflow = workflowsRecentes.find(w => w.id === workflowId)
    if (workflow) {
      // Buscar o processoId baseado na entidade do workflow
      fetch('/api/processos')
        .then(res => res.json())
        .then(processos => {
          const processo = processos.find((p: any) => 
            p.entidade.nome === workflow.entidade
          )
          if (processo) {
            router.push(`/workflow?id=${processo.id}`)
          } else {
            router.push('/workflow')
          }
        })
        .catch(() => {
          router.push('/workflow')
        })
    } else {
      router.push('/workflow')
    }
  }

  return (
    <div style={{ 
      minHeight: '100vh', 
      background: '#f8fafc',
      fontFamily: 'system-ui, -apple-system, sans-serif',
      display: 'flex'
    }}>
      {/* Barra Lateral Retrátil */}
      <div 
        style={{
          width: sidebarExpanded ? '280px' : '60px',
          background: 'white',
          borderRight: '1px solid #e2e8f0',
          padding: sidebarExpanded ? '20px' : '15px 8px',
          boxShadow: '2px 0 4px rgba(0,0,0,0.05)',
          transition: 'all 0.3s ease',
          position: 'relative',
          zIndex: 1000
        }}
        onMouseEnter={() => setSidebarExpanded(true)}
        onMouseLeave={() => setSidebarExpanded(false)}
      >
        {/* Logo */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '30px', overflow: 'hidden' }}>
          <img 
            src="/images/LOGO-INSTA.png" 
            alt="Logo" 
            style={{ width: '32px', height: '32px', objectFit: 'contain', flexShrink: 0 }}
            onError={(e) => {
              e.target.style.display = 'none'
              e.target.nextSibling.style.display = 'block'
            }}
          />
          <div style={{ display: 'none', width: '32px', height: '32px', background: '#3b82f6', borderRadius: '6px', fontSize: '16px', textAlign: 'center', lineHeight: '32px', flexShrink: 0 }}>🏥</div>
          {sidebarExpanded && (
            <h3 style={{ fontSize: '16px', fontWeight: '600', color: '#1e293b', margin: 0, whiteSpace: 'nowrap' }}>BPM Sistema</h3>
          )}
        </div>
        
        {/* Ações Rápidas */}
        <div style={{ marginBottom: '25px' }}>
          {sidebarExpanded && (
            <h4 style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Ações Rápidas</h4>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <a href="/workflow" style={{
              display: 'flex', alignItems: 'center', gap: '10px', padding: sidebarExpanded ? '10px 12px' : '10px 8px', background: '#3b82f6', color: 'white', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: '500', justifyContent: sidebarExpanded ? 'flex-start' : 'center'
            }}>
              <span>⚡</span> {sidebarExpanded && 'Novo Workflow'}
            </a>
            <a href="/pacientes" style={{
              display: 'flex', alignItems: 'center', gap: '10px', padding: sidebarExpanded ? '10px 12px' : '10px 8px', background: '#10b981', color: 'white', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: '500', justifyContent: sidebarExpanded ? 'flex-start' : 'center'
            }}>
              <span>👤</span> {sidebarExpanded && 'Nova Entidade'}
            </a>
          </div>
        </div>

        {/* Menu Principal */}
        <div>
          {sidebarExpanded && (
            <h4 style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', margin: '0 0 12px 0', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Navegação</h4>
          )}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {[
              { href: '/etapas', icon: '🏷️', label: 'Etapas', color: '#f59e0b' },
              { href: '/atividades', icon: '📋', label: 'Atividades', color: '#10b981' },
              { href: '/complexidades', icon: '🔧', label: 'Processos', color: '#f59e0b' },
              { href: '/pacientes', icon: '👥', label: 'Entidades', color: '#8b5cf6' },
              { href: '/processos', icon: '⚙️', label: 'Vínculos', color: '#ef4444' },
              { href: '/workflow', icon: '📊', label: 'Execução', color: '#06b6d4' },
              { href: '/workflow-geral', icon: '📋', label: 'Workflow Geral', color: '#8b5cf6' },
              { href: '/setores', icon: '🏢', label: 'Setores', color: '#f97316' },
              { href: '/usuarios', icon: '👤', label: 'Usuários', color: '#6366f1' }
            ].map((item, index) => (
              <a key={index} href={item.href} style={{
                display: 'flex', alignItems: 'center', gap: '10px', padding: sidebarExpanded ? '8px 12px' : '8px', borderRadius: '6px', textDecoration: 'none', fontSize: '14px', color: '#374151', transition: 'all 0.2s', justifyContent: sidebarExpanded ? 'flex-start' : 'center'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#f1f5f9'
                e.currentTarget.style.color = item.color
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent'
                e.currentTarget.style.color = '#374151'
              }}>
                <span>{item.icon}</span> {sidebarExpanded && item.label}
              </a>
            ))}
          </div>
        </div>
      </div>

      {/* Conteúdo Principal */}
      <div style={{ flex: 1, padding: '0' }}>
        {/* Header */}
        <div style={{
          background: 'white',
          borderBottom: '1px solid #e2e8f0',
          padding: '16px 24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <h1 style={{ 
                fontSize: '24px', 
                fontWeight: '700', 
                color: '#1e293b',
                margin: '0'
              }}>
                Dashboard Executivo
              </h1>
              <p style={{ 
                fontSize: '14px', 
                color: '#64748b', 
                margin: '0'
              }}>
                Visão geral do sistema em tempo real
              </p>
            </div>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '12px'
            }}>
              {usuarioLogado ? (
                <>
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
                    👤 {usuarioLogado.nome}
                  </div>
                  <button
                    onClick={handleLogout}
                    style={{
                      background: '#ef4444',
                      color: 'white',
                      border: 'none',
                      padding: '6px 12px',
                      borderRadius: '6px',
                      fontSize: '12px',
                      fontWeight: '500',
                      cursor: 'pointer',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '4px'
                    }}
                  >
                    🚪 Sair
                  </button>
                </>
              ) : (
                <a href="/login" style={{
                  background: '#3b82f6',
                  color: 'white',
                  padding: '6px 12px',
                  borderRadius: '6px',
                  fontSize: '12px',
                  fontWeight: '500',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}>
                  🔐 Fazer Login
                </a>
              )}
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
            </div>
          </div>
        </div>

        <div style={{ padding: '32px 24px' }}>
          {/* Cards de Estatísticas Principais */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px', marginBottom: '32px' }}>
            <div 
              onClick={() => router.push('/workflow')}
              style={{ 
                background: 'white', 
                padding: '24px', 
                borderRadius: '12px', 
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)', 
                border: '1px solid #e2e8f0',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(59,130,246,0.15)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#64748b' }}>Workflows Ativos</div>
                <div style={{ width: '40px', height: '40px', background: '#dbeafe', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>📊</div>
              </div>
              <div style={{ fontSize: '32px', fontWeight: '700', color: '#3b82f6', marginBottom: '8px' }}>
                {loading ? '...' : stats.workflowsAndamento}
              </div>
              <div style={{ fontSize: '12px', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>↑ 12% vs mês anterior</span>
                <span style={{ fontSize: '16px', color: '#3b82f6' }}>→</span>
              </div>
            </div>

            <div 
              onClick={() => router.push('/pacientes')}
              style={{ 
                background: 'white', 
                padding: '24px', 
                borderRadius: '12px', 
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)', 
                border: '1px solid #e2e8f0',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(16,185,129,0.15)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#64748b' }}>Entidades Cadastradas</div>
                <div style={{ width: '40px', height: '40px', background: '#dcfce7', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>👥</div>
              </div>
              <div style={{ fontSize: '32px', fontWeight: '700', color: '#10b981', marginBottom: '8px' }}>
                {loading ? '...' : stats.totalEntidades}
              </div>
              <div style={{ fontSize: '12px', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>↑ 8% vs mês anterior</span>
                <span style={{ fontSize: '16px', color: '#10b981' }}>→</span>
              </div>
            </div>

            <div 
              onClick={() => router.push('/processos')}
              style={{ 
                background: 'white', 
                padding: '24px', 
                borderRadius: '12px', 
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)', 
                border: '1px solid #e2e8f0',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(245,158,11,0.15)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#64748b' }}>Processos Ativos</div>
                <div style={{ width: '40px', height: '40px', background: '#fef3c7', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>⚙️</div>
              </div>
              <div style={{ fontSize: '32px', fontWeight: '700', color: '#f59e0b', marginBottom: '8px' }}>
                {loading ? '...' : stats.processosAtivos}
              </div>
              <div style={{ fontSize: '12px', color: '#ef4444', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>↓ 3% vs mês anterior</span>
                <span style={{ fontSize: '16px', color: '#f59e0b' }}>→</span>
              </div>
            </div>

            <div 
              onClick={() => router.push('/dashboard')}
              style={{ 
                background: 'white', 
                padding: '24px', 
                borderRadius: '12px', 
                boxShadow: '0 1px 3px rgba(0,0,0,0.1)', 
                border: '1px solid #e2e8f0',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = '0 8px 25px rgba(139,92,246,0.15)'
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.1)'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
                <div style={{ fontSize: '14px', fontWeight: '600', color: '#64748b' }}>Taxa de Conclusão</div>
                <div style={{ width: '40px', height: '40px', background: '#f3e8ff', borderRadius: '8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px' }}>🎯</div>
              </div>
              <div style={{ fontSize: '32px', fontWeight: '700', color: '#8b5cf6', marginBottom: '8px' }}>
                {loading ? '...' : `${stats.taxaConclusao}%`}
              </div>
              <div style={{ fontSize: '12px', color: '#10b981', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span>↑ 5% vs mês anterior</span>
                <span style={{ fontSize: '16px', color: '#8b5cf6' }}>→</span>
              </div>
            </div>
          </div>

          {/* Atividades Recentes e Ações Rápidas */}
          <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px', marginBottom: '32px' }}>
            {/* Workflows Recentes */}
            <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', margin: '0 0 20px 0' }}>Workflows Recentes</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {loading ? (
                  <div style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>Carregando workflows...</div>
                ) : workflowsRecentes.length > 0 ? (
                  workflowsRecentes.map((item, index) => (
                    <div 
                      key={item.id || index} 
                      onClick={() => abrirWorkflow(item.id)}
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        justifyContent: 'space-between', 
                        padding: '12px', 
                        background: '#f8fafc', 
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        border: '1px solid transparent'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#f1f5f9'
                        e.currentTarget.style.borderColor = '#3b82f6'
                        e.currentTarget.style.transform = 'translateY(-1px)'
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = '#f8fafc'
                        e.currentTarget.style.borderColor = 'transparent'
                        e.currentTarget.style.transform = 'translateY(0)'
                      }}
                    >
                      <div>
                        <div style={{ fontSize: '14px', fontWeight: '500', color: '#1e293b' }}>{item.entidade}</div>
                        <div style={{ fontSize: '12px', color: '#64748b' }}>{item.processo}</div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <div style={{ padding: '4px 8px', background: item.cor, color: 'white', borderRadius: '4px', fontSize: '12px', fontWeight: '500' }}>
                          {item.status}
                        </div>
                        <div style={{ padding: '4px 8px', background: '#f1f5f9', color: '#64748b', borderRadius: '4px', fontSize: '12px', fontWeight: '600' }}>
                          {item.porcentagem}%
                        </div>
                        <span style={{ fontSize: '16px', color: '#3b82f6' }}>→</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div style={{ padding: '20px', textAlign: 'center', color: '#64748b' }}>
                    Nenhum workflow encontrado
                  </div>
                )}
              </div>
              <a href="/workflow" style={{ display: 'inline-block', marginTop: '16px', color: '#3b82f6', textDecoration: 'none', fontSize: '14px', fontWeight: '500' }}>
                Ver todos os workflows →
              </a>
            </div>

            {/* Ações Rápidas */}
            <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', margin: '0 0 20px 0' }}>Ações Rápidas</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <a href="/workflow" style={{
                  display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', color: 'white', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: '500'
                }}>
                  <span>⚡</span>
                  <div>
                    <div>Novo Workflow</div>
                    <div style={{ fontSize: '12px', opacity: 0.8 }}>Iniciar processo</div>
                  </div>
                </a>
                <a href="/pacientes" style={{
                  display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: 'linear-gradient(135deg, #10b981, #059669)', color: 'white', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: '500'
                }}>
                  <span>👤</span>
                  <div>
                    <div>Nova Entidade</div>
                    <div style={{ fontSize: '12px', opacity: 0.8 }}>Cadastrar pessoa/empresa</div>
                  </div>
                </a>
                <a href="/atividades" style={{
                  display: 'flex', alignItems: 'center', gap: '12px', padding: '16px', background: 'linear-gradient(135deg, #f59e0b, #d97706)', color: 'white', borderRadius: '8px', textDecoration: 'none', fontSize: '14px', fontWeight: '500'
                }}>
                  <span>📋</span>
                  <div>
                    <div>Nova Atividade</div>
                    <div style={{ fontSize: '12px', opacity: 0.8 }}>Criar tarefa</div>
                  </div>
                </a>
              </div>
            </div>
          </div>

          {/* Módulos do Sistema */}
          <div style={{ background: 'white', padding: '24px', borderRadius: '12px', boxShadow: '0 1px 3px rgba(0,0,0,0.1)', border: '1px solid #e2e8f0' }}>
            <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1e293b', margin: '0 0 20px 0' }}>Módulos do Sistema</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
              {[
                { href: '/etapas', icon: '🏷️', label: 'Etapas', desc: 'Organizar atividades', bg: '#fef3c7', border: '#f59e0b' },
                { href: '/atividades', icon: '📋', label: 'Atividades', desc: 'Cadastrar tarefas', bg: '#dcfce7', border: '#10b981' },
                { href: '/complexidades', icon: '🔧', label: 'Processos', desc: 'Criar workflows', bg: '#fef3c7', border: '#f59e0b' },
                { href: '/pacientes', icon: '👥', label: 'Entidades', desc: 'Pessoas/Empresas', bg: '#f3e8ff', border: '#8b5cf6' },
                { href: '/processos', icon: '⚙️', label: 'Vínculos', desc: 'Ligar entidade/processo', bg: '#fee2e2', border: '#ef4444' },
                { href: '/workflow', icon: '📊', label: 'Execução', desc: 'Controlar workflows', bg: '#cffafe', border: '#06b6d4' },
                { href: '/workflow-geral', icon: '📋', label: 'Workflow Geral', desc: 'Visão geral tabular', bg: '#f3e8ff', border: '#8b5cf6' },
                { href: '/setores', icon: '🏢', label: 'Setores', desc: 'Organizar áreas', bg: '#fff7ed', border: '#f97316' },
                { href: '/usuarios', icon: '👤', label: 'Usuários', desc: 'Gerenciar acessos', bg: '#eef2ff', border: '#6366f1' }
              ].map((item, index) => (
                <a key={index} href={item.href} style={{ textDecoration: 'none' }}>
                  <div style={{ padding: '16px', background: item.bg, borderRadius: '8px', border: `1px solid ${item.border}`, transition: 'all 0.2s' }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
                    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                      <span style={{ fontSize: '20px' }}>{item.icon}</span>
                      <span style={{ fontSize: '14px', fontWeight: '600', color: '#1e293b' }}>{item.label}</span>
                    </div>
                    <div style={{ fontSize: '12px', color: '#64748b' }}>{item.desc}</div>
                  </div>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}