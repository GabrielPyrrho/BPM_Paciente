'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface Atividade {
  id: string
  nome: string
  setor: string
  grupo: string
  status: 'PENDENTE' | 'OK' | 'NOK'
  dataHora?: string
  responsavel?: string
  observacao?: string
}

interface Paciente {
  id: string
  nome: string
  processoId: string
  complexidade: string
}

export default function WorkflowPage() {
  const router = useRouter()
  const [usuarioAtual, setUsuarioAtual] = useState('')
  const [pacienteSelecionado, setPacienteSelecionado] = useState('')
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [mounted, setMounted] = useState(false)

  // Garantir que está no cliente
  useEffect(() => {
    setMounted(true)
  }, [])

  // Carregar pacientes com processos
  useEffect(() => {
    fetch('/api/processos')
      .then(res => res.json())
      .then(data => {
        const pacientesComProcessos = data.map((processo: any) => ({
          id: processo.paciente.id,
          nome: processo.paciente.nome,
          processoId: processo.id,
          complexidade: processo.complexidade.nome
        }))
        setPacientes(pacientesComProcessos)
      })
      .catch(() => {
        // Fallback se API não funcionar
        setPacientes([
          { id: '1', nome: 'Augusto Amorim', processoId: '1', complexidade: 'HC-24' },
          { id: '2', nome: 'Maria Silva', processoId: '2', complexidade: 'HC-48' }
        ])
      })
  }, [])
  const [atividades, setAtividades] = useState<Atividade[]>([])

  // Carregar atividades baseadas na complexidade do processo
  useEffect(() => {
    if (pacienteSelecionado) {
      const paciente = pacientes.find(p => p.id === pacienteSelecionado)
      if (!paciente) return

      const complexidade = paciente.complexidade
      
      // Atividades por complexidade - todas têm as mesmas atividades
      const atividadesTemplate = [
        // Captação
        { id: '1', nome: 'Solicitação Convênio', setor: 'Captação', grupo: 'Captação', status: 'PENDENTE' as const },
        { id: '2', nome: 'Vista de Enf. Captadora', setor: 'Captação', grupo: 'Captação', status: 'PENDENTE' as const },
        { id: '3', nome: 'Orçamento', setor: 'Captação', grupo: 'Captação', status: 'PENDENTE' as const },
        { id: '4', nome: 'Pré Escala', setor: 'Escala', grupo: 'Captação', status: 'PENDENTE' as const },
        { id: '5', nome: 'Posicionamento', setor: 'Captação', grupo: 'Captação', status: 'PENDENTE' as const },
        { id: '6', nome: 'Finalização Etapa Captação', setor: 'Sistema', grupo: 'Captação', status: 'PENDENTE' as const },
        
        // Pré-internamento
        { id: '7', nome: 'Viabilidade Domicílio', setor: 'Logística', grupo: 'Pré-internamento', status: 'PENDENTE' as const },
        { id: '8', nome: 'Recepção', setor: 'Enfermagem', grupo: 'Pré-internamento', status: 'PENDENTE' as const },
        { id: '9', nome: 'Plano Terapêutico', setor: 'MA', grupo: 'Pré-internamento', status: 'PENDENTE' as const },
        { id: '10', nome: 'Supervisor de Enfermagem', setor: 'Enfermagem', grupo: 'Pré-internamento', status: 'PENDENTE' as const },
        { id: '11', nome: 'Nutricionista', setor: 'Enfermagem', grupo: 'Pré-internamento', status: 'PENDENTE' as const },
        { id: '12', nome: 'Fisioterapia', setor: 'Terapias', grupo: 'Pré-internamento', status: 'PENDENTE' as const },
        { id: '13', nome: 'Fonoterapia', setor: 'Terapias', grupo: 'Pré-internamento', status: 'PENDENTE' as const },
        { id: '14', nome: 'Psicólogo', setor: 'Terapias', grupo: 'Pré-internamento', status: 'PENDENTE' as const },
        { id: '15', nome: 'Terapia Ocupacional', setor: 'Terapias', grupo: 'Pré-internamento', status: 'PENDENTE' as const },
        { id: '16', nome: 'Escala', setor: 'Escala', grupo: 'Pré-internamento', status: 'PENDENTE' as const },
        { id: '17', nome: 'Logística', setor: 'Logística', grupo: 'Pré-internamento', status: 'PENDENTE' as const },
        { id: '18', nome: 'Finalização Etapa Pré-internamento', setor: 'Sistema', grupo: 'Pré-internamento', status: 'PENDENTE' as const },
        
        // Internado
        { id: '19', nome: 'Prescrição', setor: 'Enfermagem', grupo: 'Internado', status: 'PENDENTE' as const },
        { id: '20', nome: 'Farmácia', setor: 'Farmácia', grupo: 'Internado', status: 'PENDENTE' as const },
        { id: '21', nome: 'Translado Paciente', setor: 'Enfermagem', grupo: 'Internado', status: 'PENDENTE' as const },
        { id: '22', nome: 'Visita MA', setor: 'Enfermagem', grupo: 'Internado', status: 'PENDENTE' as const },
        { id: '23', nome: 'Visita do Supervisor de Enfermagem', setor: 'Enfermagem', grupo: 'Internado', status: 'PENDENTE' as const },
        { id: '24', nome: 'Visita Serviço Social', setor: 'Serviço Social', grupo: 'Internado', status: 'PENDENTE' as const },
        { id: '25', nome: 'Evolução Assistencial Internação', setor: 'Enfermagem', grupo: 'Internado', status: 'PENDENTE' as const },
        { id: '26', nome: 'Encaminhamento para Convênio', setor: 'Faturamento', grupo: 'Internado', status: 'PENDENTE' as const },
        { id: '27', nome: 'Finalização Etapa Internado', setor: 'Sistema', grupo: 'Internado', status: 'PENDENTE' as const }
      ]

      // Todas as complexidades usam o mesmo template
      setAtividades(atividadesTemplate)
    }
  }, [pacienteSelecionado, pacientes])

  const marcarAtividade = (id: string, novoStatus: 'OK' | 'NOK') => {
    if (!usuarioAtual) {
      alert('Selecione um usuário primeiro!')
      return
    }

    if (!pacienteSelecionado) {
      alert('Selecione um paciente primeiro!')
      return
    }

    const atividade = atividades.find(a => a.id === id)
    if (!atividade) return

    // Bloquear marcação manual de finalização
    if (atividade.nome.includes('Finalização Etapa')) {
      alert('A finalização da etapa é automática quando todas as atividades são concluídas!')
      return
    }

    const observacao = prompt('Observação (opcional):')
    if (observacao === null) return

    const agora = new Date()
    const dataHora = `${agora.getDate().toString().padStart(2, '0')}/${(agora.getMonth() + 1).toString().padStart(2, '0')} ${agora.getHours().toString().padStart(2, '0')}:${agora.getMinutes().toString().padStart(2, '0')}`

    setAtividades(prev => {
      const novasAtividades = prev.map(atividade => {
        if (atividade.id === id) {
          return {
            ...atividade,
            status: novoStatus,
            dataHora,
            responsavel: usuarioAtual,
            observacao: observacao || undefined
          }
        }
        return atividade
      })

      // Verificar finalização automática após atualizar
      const gruposParaVerificar = ['Captação', 'Pré-internamento', 'Internado']
      
      return novasAtividades.map(atividade => {
        if (atividade.nome.includes('Finalização Etapa')) {
          const grupo = atividade.grupo
          const atividadesGrupo = novasAtividades.filter(a => a.grupo === grupo && !a.nome.includes('Finalização Etapa'))
          const todasOK = atividadesGrupo.every(a => a.status === 'OK')
          
          if (todasOK && atividade.status !== 'OK') {
            // Finalizar automaticamente
            return {
              ...atividade,
              status: 'OK' as const,
              dataHora,
              responsavel: 'Sistema Automático',
              observacao: 'Finalizada automaticamente'
            }
          }
        }
        return atividade
      })
    })
  }

  const grupos = ['Captação', 'Pré-internamento', 'Internado']



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
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px'
                }}
              >
                ← Voltar
              </button>
              <div style={{
                width: '40px',
                height: '40px',
                background: '#8b5cf6',
                borderRadius: '8px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '20px'
              }}>
                📋
              </div>
              <div>
                <h1 style={{ color: '#1e293b', fontSize: '20px', margin: 0, fontWeight: '600' }}>Workflow BPM</h1>
                <p style={{ color: '#64748b', fontSize: '14px', margin: 0 }}>Controle de atividades de internamento</p>
              </div>
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

      <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '32px 24px' }}>
        {/* Breadcrumb e Controles */}
        <div style={{ marginBottom: '32px' }}>
          <div style={{
            fontSize: '14px',
            color: '#64748b',
            marginBottom: '8px'
          }}>
            Início › Workflow › Controle de Atividades
          </div>
          <h2 style={{ 
            fontSize: '28px', 
            fontWeight: '700', 
            color: '#1e293b',
            margin: '0',
            marginBottom: '8px'
          }}>
            Controle de Workflow
          </h2>
          <p style={{
            fontSize: '16px',
            color: '#64748b',
            margin: '0'
          }}>
            Gerencie as atividades do processo de internamento
          </p>
        </div>
        
        {/* Painel de Controles */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '24px',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
          border: '1px solid #e2e8f0',
          marginBottom: '24px'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 200px', gap: '16px', alignItems: 'end' }}>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                Paciente *
              </label>
              <select 
                value={pacienteSelecionado} 
                onChange={(e) => setPacienteSelecionado(e.target.value)}
                style={{ 
                  width: '100%',
                  padding: '12px 16px', 
                  borderRadius: '8px', 
                  border: '1px solid #d1d5db', 
                  fontSize: '14px',
                  background: 'white',
                  boxSizing: 'border-box'
                }}
              >
                <option value="">Selecionar Paciente</option>
                {pacientes.map(paciente => (
                  <option key={paciente.processoId} value={paciente.id}>
                    {paciente.nome} - {paciente.complexidade}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '14px', fontWeight: '500', color: '#374151', marginBottom: '6px' }}>
                Usuário Responsável *
              </label>
              <select 
                value={usuarioAtual} 
                onChange={(e) => setUsuarioAtual(e.target.value)}
                style={{ 
                  width: '100%',
                  padding: '12px 16px', 
                  borderRadius: '8px', 
                  border: '1px solid #d1d5db', 
                  fontSize: '14px',
                  background: 'white',
                  boxSizing: 'border-box'
                }}
              >
                <option value="">Selecionar Usuário</option>
                <option value="Dr. João Silva">Dr. João Silva - Médico</option>
                <option value="Enf. Maria Santos">Enf. Maria Santos - Enfermagem</option>
                <option value="Ana Costa">Ana Costa - Farmácia</option>
                <option value="Carlos Lima">Carlos Lima - Logística</option>
                <option value="Paula Financeiro">Paula Financeiro - Financeiro</option>
                <option value="Supervisor">Supervisor Geral</option>
              </select>
            </div>
            {pacientes.find(p => p.id === pacienteSelecionado) && (
              <div style={{ 
                background: '#8b5cf6', 
                color: 'white', 
                padding: '12px 16px', 
                borderRadius: '8px', 
                fontSize: '14px',
                fontWeight: '600',
                textAlign: 'center'
              }}>
                {pacientes.find(p => p.id === pacienteSelecionado)?.complexidade}
              </div>
            )}
          </div>
          
          {pacienteSelecionado && (
            <div style={{ 
              marginTop: '20px',
              padding: '16px',
              background: '#f8fafc',
              borderRadius: '8px',
              border: '1px solid #e2e8f0',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '16px'
            }}>
              <div>
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>PACIENTE</span>
                <div style={{ fontSize: '14px', color: '#1e293b', fontWeight: '600' }}>
                  {pacientes.find(p => p.id === pacienteSelecionado)?.nome || 'Não selecionado'}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>DATA</span>
                <div style={{ fontSize: '14px', color: '#1e293b', fontWeight: '600' }}>
                  {new Date().toLocaleDateString('pt-BR')}
                </div>
              </div>
              <div>
                <span style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>USUÁRIO</span>
                <div style={{ fontSize: '14px', color: '#1e293b', fontWeight: '600' }}>
                  {usuarioAtual || 'Não selecionado'}
                </div>
              </div>
            </div>
          )}
        </div>

        {!pacienteSelecionado ? (
          <div style={{ 
            background: 'white',
            padding: '60px 40px', 
            borderRadius: '12px', 
            textAlign: 'center', 
            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
            border: '1px solid #e2e8f0'
          }}>
            <div style={{ fontSize: '64px', marginBottom: '20px' }}>🏥</div>
            <h2 style={{ color: '#1e293b', marginBottom: '15px', fontSize: '24px', fontWeight: '600' }}>Selecione um Paciente</h2>
            <p style={{ color: '#64748b', fontSize: '16px', lineHeight: '1.6' }}>
              {pacientes.length === 0 
                ? 'Nenhum paciente cadastrado. Cadastre um paciente primeiro.' 
                : 'Escolha um paciente acima para visualizar e gerenciar o workflow de internamento.'
              }
            </p>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(350px, 1fr))', gap: '24px' }}>
            {grupos.map(grupo => {
              const atividadesGrupo = atividades.filter(a => a.grupo === grupo)
              const concluidas = atividadesGrupo.filter(a => a.status === 'OK').length
              const total = atividadesGrupo.length
              
              return (
                <div key={grupo} style={{ 
                  background: 'white',
                  borderRadius: '12px', 
                  boxShadow: '0 1px 3px rgba(0,0,0,0.1)', 
                  border: '1px solid #e2e8f0',
                  overflow: 'hidden'
                }}>
                  {/* Header do Grupo */}
                  <div style={{ 
                    background: grupo === 'Captação' ? '#3b82f6' :
                               grupo === 'Pré-internamento' ? '#f59e0b' :
                               '#10b981',
                    color: 'white', 
                    padding: '16px 20px', 
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center'
                  }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '18px', fontWeight: '600' }}>{grupo}</h3>
                      <div style={{ fontSize: '14px', marginTop: '4px', opacity: 0.9 }}>
                        {concluidas}/{total} concluídas
                      </div>
                    </div>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      {/* Status da Etapa */}
                      <div style={{ 
                        padding: '6px 12px', 
                        background: 'rgba(255,255,255,0.2)', 
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '600',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px'
                      }}>
                        <span>📊</span>
                        <span style={{ color: 'white' }}>
                          {grupo === 'Captação' ? '24h' : '48h'}
                        </span>
                      </div>
                      
                      <div style={{ fontSize: '20px' }}>
                        {grupo === 'Captação' ? '📋' : grupo === 'Pré-internamento' ? '🏥' : '🏠'}
                      </div>
                    </div>
                  </div>

                  {/* Lista de Atividades */}
                  <div style={{ padding: '20px' }}>
                    {atividadesGrupo.map(atividade => (
                      <div key={atividade.id} style={{ 
                        marginBottom: '12px', 
                        padding: '16px', 
                        border: `1px solid ${atividade.status === 'OK' ? '#10b981' : atividade.status === 'NOK' ? '#ef4444' : '#e2e8f0'}`,
                        borderRadius: '8px',
                        background: atividade.status === 'OK' ? '#f0fdf4' : 
                                   atividade.status === 'NOK' ? '#fef2f2' : 
                                   '#ffffff',
                        transition: 'all 0.2s ease'
                      }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: '600', fontSize: '14px', marginBottom: '4px' }}>
                              {atividade.nome}
                            </div>
                            <div style={{ fontSize: '12px', color: '#666', marginBottom: '4px' }}>
                              Setor: {atividade.setor}
                            </div>
                            {atividade.dataHora && (
                              <div style={{ fontSize: '12px', color: '#2563eb' }}>
                                📅 {atividade.dataHora} {atividade.responsavel && `- ${atividade.responsavel}`}
                              </div>
                            )}
                            {atividade.observacao && (
                              <div style={{ fontSize: '11px', color: '#f59e0b', marginTop: '4px', fontStyle: 'italic' }}>
                                💬 {atividade.observacao}
                              </div>
                            )}
                          </div>
                          
                          <div style={{ display: 'flex', gap: '4px' }}>
                            {atividade.nome.includes('Finalização Etapa') ? (
                              // Indicador de finalização automática
                              <div
                                style={{
                                  background: atividade.status === 'OK' ? '#10b981' : '#f3f4f6',
                                  color: atividade.status === 'OK' ? 'white' : '#9ca3af',
                                  border: 'none',
                                  borderRadius: '4px',
                                  padding: '6px 12px',
                                  fontSize: '12px',
                                  fontWeight: '600',
                                  display: 'flex',
                                  alignItems: 'center',
                                  gap: '4px'
                                }}
                              >
                                {atividade.status === 'OK' ? (
                                  <>
                                    ✓ Finalizada
                                    <span style={{ fontSize: '10px', opacity: 0.8 }}>(Auto)</span>
                                  </>
                                ) : (
                                  <>
                                    ⏳ Aguardando
                                    <span style={{ fontSize: '10px' }}>(Auto)</span>
                                  </>
                                )}
                              </div>
                            ) : (
                              // Botões normais
                              <>
                                <button
                                  onClick={() => marcarAtividade(atividade.id, 'OK')}
                                  style={{
                                    background: atividade.status === 'OK' ? '#10b981' : '#e5e7eb',
                                    color: atividade.status === 'OK' ? 'white' : '#666',
                                    border: 'none',
                                    borderRadius: '4px',
                                    padding: '6px 12px',
                                    fontSize: '12px',
                                    cursor: 'pointer',
                                    fontWeight: '600'
                                  }}
                                >
                                  ✓ OK
                                </button>
                                <button
                                  onClick={() => marcarAtividade(atividade.id, 'NOK')}
                                  style={{
                                    background: atividade.status === 'NOK' ? '#ef4444' : '#e5e7eb',
                                    color: atividade.status === 'NOK' ? 'white' : '#666',
                                    border: 'none',
                                    borderRadius: '4px',
                                    padding: '6px 12px',
                                    fontSize: '12px',
                                    cursor: 'pointer',
                                    fontWeight: '600'
                                  }}
                                >
                                  ✗ NOK
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}