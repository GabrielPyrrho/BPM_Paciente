'use client'

interface TrilhaData {
  paciente: string
  complexidade: string
  solicitado: { data: string, hora: string }
  orcado: { data?: string, hora?: string, status?: string }
  autorizado: { data?: string, hora?: string }
  internado: { data?: string, hora?: string }
}

interface WorkflowTrilhaProps {
  data: TrilhaData
}

export default function WorkflowTrilha({ data }: WorkflowTrilhaProps) {
  return (
    <div className="workflow-trilha mb-6">
      {/* Header com informações do paciente */}
      <div className="trilha-header">
        <div className="trilha-step">
          <div className="trilha-step-title">Solicitado</div>
          <div className="trilha-step-content">
            <div className="trilha-date">{data.solicitado.data}</div>
            <div className="trilha-time">{data.solicitado.hora}</div>
          </div>
        </div>
        
        <div className="trilha-step">
          <div className="trilha-step-title">Orçado</div>
          <div className="trilha-step-content">
            {data.orcado.status && (
              <div className="trilha-status status-autorizado">{data.orcado.status}</div>
            )}
            <div className="trilha-time">{data.orcado.hora}</div>
          </div>
        </div>
        
        <div className="trilha-step">
          <div className="trilha-step-title">Autorizado</div>
          <div className="trilha-step-content">
            <div className="trilha-date">{data.autorizado.data}</div>
            <div className="trilha-time">{data.autorizado.hora}</div>
          </div>
        </div>
        
        <div className="trilha-step">
          <div className="trilha-step-title">Internado</div>
          <div className="trilha-step-content">
            <div className="trilha-date">{data.internado.data}</div>
            <div className="trilha-time">{data.internado.hora}</div>
          </div>
        </div>
      </div>

      {/* Informações do paciente */}
      <div className="p-4 border-b border-gray-200">
        <h3 className="font-semibold text-lg">{data.paciente}</h3>
        <p className="text-sm text-gray-600">{data.complexidade}</p>
      </div>

      {/* Seções do Workflow */}
      <div className="workflow-grid p-4">
        {/* Captação */}
        <div className="workflow-section section-captacao">
          <div className="section-header header-captacao">
            Captação
          </div>
          <div className="p-3">
            <table className="workflow-table">
              <thead>
                <tr>
                  <th>Recebido</th>
                  <th>Com Prazo</th>
                  <th>Hora</th>
                  <th>Atividade</th>
                  <th>Resposta</th>
                  <th>Hora</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td rowSpan={6} className="prazo-24h">07/09/2026</td>
                  <td rowSpan={6} className="prazo-column">24 horas</td>
                  <td>17:30</td>
                  <td>Solicitação Convênio</td>
                  <td></td>
                  <td></td>
                  <td><div className="status-indicator status-ok"></div></td>
                </tr>
                <tr>
                  <td></td>
                  <td>Vista de Enf. Captadora</td>
                  <td>08/09/2026</td>
                  <td>07:30</td>
                  <td><div className="status-indicator status-ok"></div></td>
                </tr>
                <tr>
                  <td></td>
                  <td className="font-semibold underline">Orçamento</td>
                  <td>08/09/2026</td>
                  <td>10:00</td>
                  <td><div className="status-indicator status-ok"></div></td>
                </tr>
                <tr>
                  <td></td>
                  <td>Pré - Prescrição</td>
                  <td>09/09/2026</td>
                  <td>10:00</td>
                  <td><div className="status-indicator status-ok"></div></td>
                </tr>
                <tr>
                  <td></td>
                  <td>Pré Escala</td>
                  <td></td>
                  <td></td>
                  <td><div className="status-indicator status-ok"></div></td>
                </tr>
                <tr>
                  <td></td>
                  <td className="font-semibold underline">Posicionamento</td>
                  <td>11/09/2026</td>
                  <td>11:35</td>
                  <td><div className="status-indicator status-ok"></div></td>
                </tr>
              </tbody>
            </table>
            <div className="mt-2 text-center">
              <div className="font-semibold underline">Finalização 1 Etapa</div>
              <div className="text-sm">11/09/2026 14:00</div>
              <div className="inline-block bg-green-500 text-white rounded-full w-6 h-6 text-xs flex items-center justify-center mt-1">$</div>
            </div>
          </div>
        </div>

        {/* Pré-internamento */}
        <div className="workflow-section section-pre-internamento">
          <div className="section-header header-pre-internamento">
            Pré-internamento
          </div>
          <div className="p-3">
            <table className="workflow-table">
              <thead>
                <tr>
                  <th>Recebido</th>
                  <th>Com Prazo</th>
                  <th>Atividade</th>
                  <th>Resposta</th>
                  <th>Hora</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td rowSpan={10}>11/09/2026</td>
                  <td rowSpan={10} className="prazo-column">48 horas</td>
                  <td className="bg-pink-100">Viabilidade Domicílio</td>
                  <td>11/09/2026</td>
                  <td>16:00</td>
                  <td><div className="status-indicator status-ok"></div></td>
                </tr>
                <tr>
                  <td className="bg-pink-100">Recepção - Pré - Internamento</td>
                  <td>11/09/2026</td>
                  <td>18:30</td>
                  <td><div className="status-indicator status-ok"></div></td>
                </tr>
                <tr>
                  <td>Escala</td>
                  <td>12/09/2026</td>
                  <td>12:30</td>
                  <td><div className="status-indicator status-ok"></div></td>
                </tr>
                <tr>
                  <td>Plano Terapêutico</td>
                  <td>11/09/2026</td>
                  <td></td>
                  <td><div className="status-indicator status-ok"></div></td>
                </tr>
                <tr>
                  <td>MA</td>
                  <td>12/09/2026</td>
                  <td>15:30</td>
                  <td><div className="status-indicator status-ok"></div></td>
                </tr>
                <tr>
                  <td>Supervisor de Enfermagem</td>
                  <td>12/09/2026</td>
                  <td>15:50</td>
                  <td><div className="status-indicator status-ok"></div></td>
                </tr>
                <tr>
                  <td>Nutricionista</td>
                  <td>12/09/2026</td>
                  <td>15:30</td>
                  <td><div className="status-indicator status-ok"></div></td>
                </tr>
                <tr>
                  <td>Fisioterapia</td>
                  <td>12/09/2026</td>
                  <td>18:20</td>
                  <td><div className="status-indicator status-pendente-indicator"></div></td>
                </tr>
                <tr>
                  <td>Fonoterapia</td>
                  <td>12/09/2026</td>
                  <td>18:20</td>
                  <td><div className="status-indicator status-ok"></div></td>
                </tr>
                <tr>
                  <td>Logística</td>
                  <td>13/09/2026</td>
                  <td>08:20</td>
                  <td><div className="status-indicator status-ok"></div></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Internamento */}
        <div className="workflow-section section-internamento">
          <div className="section-header header-internamento">
            Internamento
          </div>
          <div className="p-3">
            <table className="workflow-table">
              <thead>
                <tr>
                  <th>Recebido</th>
                  <th>Com Prazo</th>
                  <th>Atividade</th>
                  <th>Resposta</th>
                  <th>Hora</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td rowSpan={9}>11/09/2026</td>
                  <td rowSpan={9} className="prazo-column">48 horas</td>
                  <td>Prescrição</td>
                  <td>12/09/2026</td>
                  <td>08:20</td>
                  <td><div className="status-indicator status-ok"></div></td>
                </tr>
                <tr>
                  <td className="bg-pink-100">Farmácia</td>
                  <td>13/09/2026</td>
                  <td>07:30</td>
                  <td><div className="status-indicator status-ok"></div></td>
                </tr>
                <tr>
                  <td></td>
                  <td></td>
                  <td></td>
                  <td><div className="status-indicator status-ok"></div></td>
                </tr>
                <tr>
                  <td className="bg-pink-100">Translado Paciente</td>
                  <td>13/09/2026</td>
                  <td>10:00</td>
                  <td><div className="status-indicator status-ok"></div></td>
                </tr>
                <tr>
                  <td>Visita MA</td>
                  <td></td>
                  <td></td>
                  <td><div className="status-indicator status-ok"></div></td>
                </tr>
                <tr>
                  <td>Visita do Supervisor de Enfermagem</td>
                  <td></td>
                  <td></td>
                  <td><div className="status-indicator status-ok"></div></td>
                </tr>
                <tr>
                  <td>Visita Serviço Social - Relatório</td>
                  <td></td>
                  <td></td>
                  <td><div className="status-indicator status-pendente-indicator"></div></td>
                </tr>
                <tr>
                  <td>Visita Terapias</td>
                  <td></td>
                  <td></td>
                  <td><div className="status-indicator status-pendente-indicator"></div></td>
                </tr>
                <tr>
                  <td>Visita Nutrição</td>
                  <td></td>
                  <td></td>
                  <td><div className="status-indicator status-pendente-indicator"></div></td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  )
}