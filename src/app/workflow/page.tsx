'use client'

import { useState } from 'react'

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

export default function WorkflowPage() {
  const [usuarioAtual, setUsuarioAtual] = useState('')
  const [atividades, setAtividades] = useState<Atividade[]>([
    // Solicitado
    { id: '1', nome: 'Solicitação Convênio', setor: 'Captação', grupo: 'Solicitado', status: 'OK', dataHora: '08/09 07:30', responsavel: 'Maria Silva' },
    { id: '2', nome: 'Vista Enfermeira Captadora', setor: 'Enfermagem', grupo: 'Solicitado', status: 'OK', dataHora: '09/09 10:00', responsavel: 'Ana Costa' },
    { id: '3', nome: 'Orçamento', setor: 'Financeiro', grupo: 'Solicitado', status: 'OK', dataHora: '09/09 10:30' },
    { id: '4', nome: 'Pré-Prescrição', setor: 'Médico', grupo: 'Solicitado', status: 'OK', dataHora: '09/09 11:00' },
    { id: '5', nome: 'Pré Escala', setor: 'Enfermagem', grupo: 'Solicitado', status: 'PENDENTE' },
    { id: '6', nome: 'Posicionamento', setor: 'Logística', grupo: 'Solicitado', status: 'OK', dataHora: '11/09 11:35' },
    
    // Orçado
    { id: '7', nome: 'Finalização 1ª Etapa', setor: 'Financeiro', grupo: 'Orçado', status: 'OK', dataHora: '11/09 14:00' },
    
    // Pré-internamento
    { id: '8', nome: 'Viabilidade Domicílio', setor: 'Avaliação', grupo: 'Pré-internamento', status: 'OK', dataHora: '11/09 16:00' },
    { id: '9', nome: 'Recepção Pré-internamento', setor: 'Recepção', grupo: 'Pré-internamento', status: 'OK', dataHora: '11/09 16:30' },
    { id: '10', nome: 'Escala', setor: 'Enfermagem', grupo: 'Pré-internamento', status: 'OK', dataHora: '12/09 12:30' },
    { id: '11', nome: 'Plano Terapêutico', setor: 'Médico', grupo: 'Pré-internamento', status: 'PENDENTE' },
    { id: '12', nome: 'ITA', setor: 'Enfermagem', grupo: 'Pré-internamento', status: 'PENDENTE' },
    { id: '13', nome: 'Supervisor Enfermagem', setor: 'Enfermagem', grupo: 'Pré-internamento', status: 'OK', dataHora: '12/09 15:50' },
    
    // Internado
    { id: '14', nome: 'Prescrição', setor: 'Médico', grupo: 'Internado', status: 'OK', dataHora: '12/09 08:20' },
    { id: '15', nome: 'Farmácia', setor: 'Farmácia', grupo: 'Internado', status: 'PENDENTE' },
    { id: '16', nome: 'Translade Paciente', setor: 'Logística', grupo: 'Internado', status: 'PENDENTE' },
    { id: '17', nome: 'Visita', setor: 'Enfermagem', grupo: 'Internado', status: 'PENDENTE' }
  ])

  const marcarAtividade = (id: string, novoStatus: 'OK' | 'NOK') => {
    if (!usuarioAtual) {
      alert('Selecione um usuário primeiro!')
      return
    }

    const observacao = prompt('Observação (opcional):')
    if (observacao === null) return

    const agora = new Date()
    const dataHora = `${agora.getDate().toString().padStart(2, '0')}/${(agora.getMonth() + 1).toString().padStart(2, '0')} ${agora.getHours().toString().padStart(2, '0')}:${agora.getMinutes().toString().padStart(2, '0')}`

    setAtividades(prev => prev.map(atividade => {
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
    }))
  }

  const grupos = ['Solicitado', 'Orçado', 'Pré-internamento', 'Internado']

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      {/* Header */}
      <div style={{ background: 'white', padding: '20px', borderRadius: '8px', marginBottom: '20px', boxShadow: '0 2px 4px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
          <h1 style={{ color: '#2563eb', fontSize: '24px', margin: 0 }}>BPM - Workflow Internamento</h1>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
            <select 
              value={usuarioAtual} 
              onChange={(e) => setUsuarioAtual(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #ccc', fontSize: '14px' }}
            >
              <option value="">Selecionar Usuário</option>
              <option value="Dr. João Silva">Dr. João Silva - Médico</option>
              <option value="Enf. Maria Santos">Enf. Maria Santos - Enfermagem</option>
              <option value="Ana Costa">Ana Costa - Farmácia</option>
              <option value="Carlos Lima">Carlos Lima - Logística</option>
              <option value="Paula Financeiro">Paula Financeiro - Financeiro</option>
              <option value="Supervisor">Supervisor Geral</option>
            </select>
            <div style={{ background: '#2563eb', color: 'white', padding: '8px 16px', borderRadius: '6px', fontSize: '14px' }}>
              HC-24
            </div>
          </div>
        </div>
        <div style={{ fontSize: '14px', color: '#666' }}>
          <strong>Paciente:</strong> Augusto Amorim | <strong>Data:</strong> 07/09/2026 | <strong>Usuário:</strong> {usuarioAtual || 'Não selecionado'}
        </div>
      </div>

      {/* Workflow Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '20px' }}>
        {grupos.map(grupo => {
          const atividadesGrupo = atividades.filter(a => a.grupo === grupo)
          const concluidas = atividadesGrupo.filter(a => a.status === 'OK').length
          const total = atividadesGrupo.length
          
          return (
            <div key={grupo} style={{ background: 'white', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
              {/* Header do Grupo */}
              <div style={{ background: '#2563eb', color: 'white', padding: '15px', textAlign: 'center' }}>
                <h3 style={{ margin: 0, fontSize: '16px' }}>{grupo}</h3>
                <div style={{ fontSize: '12px', marginTop: '5px', opacity: 0.9 }}>
                  {concluidas}/{total} concluídas
                </div>
              </div>

              {/* Lista de Atividades */}
              <div style={{ padding: '15px' }}>
                {atividadesGrupo.map(atividade => (
                  <div key={atividade.id} style={{ 
                    marginBottom: '12px', 
                    padding: '12px', 
                    border: `2px solid ${atividade.status === 'OK' ? '#10b981' : atividade.status === 'NOK' ? '#ef4444' : '#e5e7eb'}`,
                    borderRadius: '6px',
                    background: atividade.status === 'OK' ? '#f0fdf4' : atividade.status === 'NOK' ? '#fef2f2' : '#f9fafb'
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
                      
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        {atividade.status === 'OK' && (
                          <div style={{ width: '24px', height: '24px', background: '#10b981', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '14px' }}>
                            ✓
                          </div>
                        )}
                        {atividade.status === 'NOK' && (
                          <div style={{ width: '24px', height: '24px', background: '#ef4444', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white', fontSize: '14px' }}>
                            ✗
                          </div>
                        )}
                        {atividade.status === 'PENDENTE' && (
                          <div style={{ display: 'flex', gap: '4px' }}>
                            <button
                              onClick={() => marcarAtividade(atividade.id, 'OK')}
                              style={{
                                background: '#10b981',
                                color: 'white',
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
                                background: '#ef4444',
                                color: 'white',
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
                          </div>
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
    </div>
  )
}