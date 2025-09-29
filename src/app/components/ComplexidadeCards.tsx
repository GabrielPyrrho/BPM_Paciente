'use client'

interface Atividade {
  nome: string
  responsavel: string
}

interface ComplexidadeData {
  nome: string
  atividades: Atividade[]
}

const complexidades: ComplexidadeData[] = [
  {
    nome: 'INTERNAMENTO ELETIVO 24AVM',
    atividades: [
      { nome: 'Solicitação Convênio', responsavel: 'Captação' },
      { nome: 'Vista de Enf. Captadora', responsavel: 'Captação' },
      { nome: 'Orçamento', responsavel: 'Captação' },
      { nome: 'Pré Escala', responsavel: 'Escala' },
      { nome: 'Posicionamento', responsavel: 'Captação' },
      { nome: 'Viabilidade Domicílio', responsavel: 'Logística' },
      { nome: 'Recepção', responsavel: 'Enfermagem' },
      { nome: 'Plano Terapêutico', responsavel: '' },
      { nome: 'MA', responsavel: 'Enfermagem' },
      { nome: 'Supervisor de Enfermagem', responsavel: 'Enfermagem' },
      { nome: 'Nutricionista', responsavel: 'Enfermagem' },
      { nome: 'Fisioterapia', responsavel: 'Terapias' },
      { nome: 'Fonoterapia', responsavel: 'Terapias' },
      { nome: 'Psicólogo', responsavel: 'Terapias' },
      { nome: 'Terapia Ocupacional', responsavel: 'Terapias' },
      { nome: 'Escala', responsavel: 'Escala' },
      { nome: 'Logística', responsavel: 'Logística' },
      { nome: 'Prescrição', responsavel: 'Enfermagem' },
      { nome: 'Farmácia', responsavel: 'Farmácia' },
      { nome: 'Translado Paciente', responsavel: 'Enfermagem' },
      { nome: 'Visita MA', responsavel: 'Enfermagem' },
      { nome: 'Visita do Supervisor de Enfermagem', responsavel: 'Enfermagem' },
      { nome: 'Visita Serviço Social', responsavel: 'Serviço Social' },
      { nome: 'Evolução Assistencial Internação', responsavel: 'Enfermagem' },
      { nome: 'Encaminhamento para Convênio', responsavel: 'Faturamento' }
    ]
  },
  {
    nome: 'INTERNAMENTO ELETIVO 24HC',
    atividades: [
      { nome: 'Solicitação Convênio', responsavel: 'Captação' },
      { nome: 'Vista de Enf. Captadora', responsavel: 'Captação' },
      { nome: 'Orçamento', responsavel: 'Captação' },
      { nome: 'Pré Escala', responsavel: 'Escala' },
      { nome: 'Posicionamento', responsavel: 'Captação' },
      { nome: 'Viabilidade Domicílio', responsavel: 'Logística' },
      { nome: 'Recepção', responsavel: 'Enfermagem' },
      { nome: 'Plano Terapêutico', responsavel: '' },
      { nome: 'MA', responsavel: 'Enfermagem' },
      { nome: 'Supervisor de Enfermagem', responsavel: 'Enfermagem' },
      { nome: 'Nutricionista', responsavel: 'Enfermagem' },
      { nome: 'Fisioterapia', responsavel: 'Terapias' },
      { nome: 'Fonoterapia', responsavel: 'Terapias' },
      { nome: 'Psicólogo', responsavel: 'Terapias' },
      { nome: 'Terapia Ocupacional', responsavel: 'Terapias' },
      { nome: 'Escala', responsavel: 'Escala' },
      { nome: 'Logística', responsavel: 'Logística' },
      { nome: 'Prescrição', responsavel: 'Enfermagem' },
      { nome: 'Farmácia', responsavel: 'Farmácia' },
      { nome: 'Translado Paciente', responsavel: 'Enfermagem' },
      { nome: 'Visita MA', responsavel: 'Enfermagem' },
      { nome: 'Visita do Supervisor de Enfermagem', responsavel: 'Enfermagem' },
      { nome: 'Visita Serviço Social', responsavel: 'Serviço Social' },
      { nome: 'Evolução Assistencial Internação', responsavel: 'Enfermagem' },
      { nome: 'Encaminhamento para Convênio', responsavel: 'Faturamento' }
    ]
  },
  {
    nome: 'INTERNAMENTO ELETIVO 12HC',
    atividades: [
      { nome: 'Solicitação Convênio', responsavel: 'Captação' },
      { nome: 'Vista de Enf. Captadora', responsavel: 'Captação' },
      { nome: 'Orçamento', responsavel: 'Captação' },
      { nome: 'Pré Escala', responsavel: 'Escala' },
      { nome: 'Posicionamento', responsavel: 'Captação' },
      { nome: 'Viabilidade Domicílio', responsavel: 'Logística' },
      { nome: 'Recepção', responsavel: 'Enfermagem' },
      { nome: 'Plano Terapêutico', responsavel: '' },
      { nome: 'MA', responsavel: 'Enfermagem' },
      { nome: 'Supervisor de Enfermagem', responsavel: 'Enfermagem' },
      { nome: 'Nutricionista', responsavel: 'Enfermagem' },
      { nome: 'Fisioterapia', responsavel: 'Terapias' },
      { nome: 'Fonoterapia', responsavel: 'Terapias' },
      { nome: 'Psicólogo', responsavel: 'Terapias' },
      { nome: 'Terapia Ocupacional', responsavel: 'Terapias' },
      { nome: 'Escala', responsavel: 'Escala' },
      { nome: 'Logística', responsavel: 'Logística' },
      { nome: 'Prescrição', responsavel: 'Enfermagem' },
      { nome: 'Farmácia', responsavel: 'Farmácia' },
      { nome: 'Translado Paciente', responsavel: 'Enfermagem' },
      { nome: 'Visita MA', responsavel: 'Enfermagem' },
      { nome: 'Visita do Supervisor de Enfermagem', responsavel: 'Enfermagem' },
      { nome: 'Visita Serviço Social', responsavel: 'Serviço Social' },
      { nome: 'Evolução Assistencial Internação', responsavel: 'Enfermagem' },
      { nome: 'Encaminhamento para Convênio', responsavel: 'Faturamento' }
    ]
  },
  {
    nome: 'INTERNAMENTO ELETIVO 6HC',
    atividades: [
      { nome: 'Solicitação Convênio', responsavel: 'Captação' },
      { nome: 'Vista de Enf. Captadora', responsavel: 'Captação' },
      { nome: 'Orçamento', responsavel: 'Captação' },
      { nome: 'Pré Escala', responsavel: 'Escala' },
      { nome: 'Posicionamento', responsavel: 'Captação' },
      { nome: 'Viabilidade Domicílio', responsavel: 'Logística' },
      { nome: 'Recepção', responsavel: 'Enfermagem' },
      { nome: 'Plano Terapêutico', responsavel: '' },
      { nome: 'MA', responsavel: 'Enfermagem' },
      { nome: 'Supervisor de Enfermagem', responsavel: 'Enfermagem' },
      { nome: 'Nutricionista', responsavel: 'Enfermagem' },
      { nome: 'Fisioterapia', responsavel: 'Terapias' },
      { nome: 'Fonoterapia', responsavel: 'Terapias' },
      { nome: 'Psicólogo', responsavel: 'Terapias' },
      { nome: 'Terapia Ocupacional', responsavel: 'Terapias' },
      { nome: 'Escala', responsavel: 'Escala' },
      { nome: 'Logística', responsavel: 'Logística' },
      { nome: 'Prescrição', responsavel: 'Enfermagem' },
      { nome: 'Farmácia', responsavel: 'Farmácia' },
      { nome: 'Translado Paciente', responsavel: 'Enfermagem' },
      { nome: 'Visita MA', responsavel: 'Enfermagem' },
      { nome: 'Visita do Supervisor de Enfermagem', responsavel: 'Enfermagem' },
      { nome: 'Visita Serviço Social', responsavel: 'Serviço Social' },
      { nome: 'Evolução Assistencial Internação', responsavel: 'Enfermagem' },
      { nome: 'Encaminhamento para Convênio', responsavel: 'Faturamento' }
    ]
  },
  {
    nome: 'CURATIVO',
    atividades: [
      { nome: 'Solicitação Convênio', responsavel: 'Captação' },
      { nome: 'Vista de Enf. Captadora', responsavel: 'Captação' },
      { nome: 'Orçamento', responsavel: 'Captação' },
      { nome: 'Pré Escala', responsavel: 'Escala' },
      { nome: 'Posicionamento', responsavel: 'Captação' },
      { nome: 'Viabilidade Domicílio', responsavel: 'Logística' },
      { nome: 'Recepção', responsavel: 'Enfermagem' },
      { nome: 'Plano Terapêutico', responsavel: '' },
      { nome: 'MA', responsavel: 'Enfermagem' },
      { nome: 'Supervisor de Enfermagem', responsavel: 'Enfermagem' },
      { nome: 'Nutricionista', responsavel: 'Enfermagem' },
      { nome: 'Fisioterapia', responsavel: 'Terapias' },
      { nome: 'Fonoterapia', responsavel: 'Terapias' },
      { nome: 'Psicólogo', responsavel: 'Terapias' },
      { nome: 'Terapia Ocupacional', responsavel: 'Terapias' },
      { nome: 'Escala', responsavel: 'Escala' },
      { nome: 'Logística', responsavel: 'Logística' },
      { nome: 'Prescrição', responsavel: 'Enfermagem' },
      { nome: 'Farmácia', responsavel: 'Farmácia' },
      { nome: 'Translado Paciente', responsavel: 'Enfermagem' },
      { nome: 'Visita MA', responsavel: 'Enfermagem' },
      { nome: 'Visita do Supervisor de Enfermagem', responsavel: 'Enfermagem' },
      { nome: 'Visita Serviço Social', responsavel: 'Serviço Social' },
      { nome: 'Evolução Assistencial Internação', responsavel: 'Enfermagem' },
      { nome: 'Encaminhamento para Convênio', responsavel: 'Faturamento' }
    ]
  },
  {
    nome: 'APLICAÇÃO DE MED',
    atividades: [
      { nome: 'Solicitação Convênio', responsavel: 'Captação' },
      { nome: 'Vista de Enf. Captadora', responsavel: 'Captação' },
      { nome: 'Orçamento', responsavel: 'Captação' },
      { nome: 'Pré Escala', responsavel: 'Escala' },
      { nome: 'Posicionamento', responsavel: 'Captação' },
      { nome: 'Viabilidade Domicílio', responsavel: 'Logística' },
      { nome: 'Recepção', responsavel: 'Enfermagem' },
      { nome: 'Plano Terapêutico', responsavel: '' },
      { nome: 'MA', responsavel: 'Enfermagem' },
      { nome: 'Supervisor de Enfermagem', responsavel: 'Enfermagem' },
      { nome: 'Nutricionista', responsavel: 'Enfermagem' },
      { nome: 'Fisioterapia', responsavel: 'Terapias' },
      { nome: 'Fonoterapia', responsavel: 'Terapias' },
      { nome: 'Psicólogo', responsavel: 'Terapias' },
      { nome: 'Terapia Ocupacional', responsavel: 'Terapias' },
      { nome: 'Escala', responsavel: 'Escala' },
      { nome: 'Logística', responsavel: 'Logística' },
      { nome: 'Prescrição', responsavel: 'Enfermagem' },
      { nome: 'Farmácia', responsavel: 'Farmácia' },
      { nome: 'Translado Paciente', responsavel: 'Enfermagem' },
      { nome: 'Visita MA', responsavel: 'Enfermagem' },
      { nome: 'Visita do Supervisor de Enfermagem', responsavel: 'Enfermagem' },
      { nome: 'Visita Serviço Social', responsavel: 'Serviço Social' },
      { nome: 'Evolução Assistencial Internação', responsavel: 'Enfermagem' },
      { nome: 'Encaminhamento para Convênio', responsavel: 'Faturamento' }
    ]
  },
  {
    nome: 'TERAPIAS',
    atividades: [
      { nome: 'Solicitação Convênio', responsavel: 'Captação' },
      { nome: 'Vista de Enf. Captadora', responsavel: 'Captação' },
      { nome: 'Orçamento', responsavel: 'Captação' },
      { nome: 'Pré Escala', responsavel: 'Escala' },
      { nome: 'Posicionamento', responsavel: 'Captação' },
      { nome: 'Viabilidade Domicílio', responsavel: 'Logística' },
      { nome: 'Recepção', responsavel: 'Enfermagem' },
      { nome: 'Plano Terapêutico', responsavel: '' },
      { nome: 'MA', responsavel: 'Enfermagem' },
      { nome: 'Supervisor de Enfermagem', responsavel: 'Enfermagem' },
      { nome: 'Nutricionista', responsavel: 'Enfermagem' },
      { nome: 'Fisioterapia', responsavel: 'Terapias' },
      { nome: 'Fonoterapia', responsavel: 'Terapias' },
      { nome: 'Psicólogo', responsavel: 'Terapias' },
      { nome: 'Terapia Ocupacional', responsavel: 'Terapias' },
      { nome: 'Escala', responsavel: 'Escala' },
      { nome: 'Logística', responsavel: 'Logística' },
      { nome: 'Prescrição', responsavel: 'Enfermagem' },
      { nome: 'Farmácia', responsavel: 'Farmácia' },
      { nome: 'Translado Paciente', responsavel: 'Enfermagem' },
      { nome: 'Visita MA', responsavel: 'Enfermagem' },
      { nome: 'Visita do Supervisor de Enfermagem', responsavel: 'Enfermagem' },
      { nome: 'Visita Serviço Social', responsavel: 'Serviço Social' },
      { nome: 'Evolução Assistencial Internação', responsavel: 'Enfermagem' },
      { nome: 'Encaminhamento para Convênio', responsavel: 'Faturamento' }
    ]
  }
]

export default function ComplexidadeCards() {
  const getCardClass = (nome: string) => {
    if (nome.includes('24AVM')) return 'complexidade-24avm'
    if (nome.includes('24HC')) return 'complexidade-24hc'
    if (nome.includes('12HC')) return 'complexidade-12hc'
    if (nome.includes('6HC')) return 'complexidade-6hc'
    if (nome.includes('CURATIVO')) return 'complexidade-curativo'
    if (nome.includes('APLICAÇÃO')) return 'complexidade-aplicacao'
    if (nome.includes('TERAPIAS')) return 'complexidade-terapias'
    return 'complexidade-24avm'
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {complexidades.map((complexidade, index) => (
        <div key={index} className="complexidade-card">
          <div className={`complexidade-header ${getCardClass(complexidade.nome)}`}>
            {complexidade.nome}
          </div>
          <div className="p-4">
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="font-semibold">Atividades</div>
              <div className="font-semibold">Responsável</div>
            </div>
            <div className="activity-list mt-2">
              {complexidade.atividades.map((atividade, idx) => (
                <div key={idx} className="activity-item">
                  <div className="activity-name">{atividade.nome}</div>
                  <div className="activity-responsible">{atividade.responsavel}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}