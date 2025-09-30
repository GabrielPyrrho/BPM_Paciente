const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  // Criar complexidades
  const hc24 = await prisma.complexidade.create({
    data: { nome: 'HC24' }
  })
  
  const hc48 = await prisma.complexidade.create({
    data: { nome: 'HC48' }
  })

  // Criar atividades template reais
  const atividades = [
    // Captação
    { nome: 'Solicitação Convênio', setor: 'Captação', ordem: 1 },
    { nome: 'Vista de Enf. Captadora', setor: 'Captação', ordem: 2 },
    { nome: 'Orçamento', setor: 'Captação', ordem: 3 },
    { nome: 'Pré - Prescrição', setor: 'Captação', ordem: 4 },
    { nome: 'Pré Escala', setor: 'Captação', ordem: 5 },
    { nome: 'Posicionamento', setor: 'Captação', ordem: 6 },
    { nome: 'Finalização 1 Etapa', setor: 'Captação', ordem: 7 },
    
    // Pré-internamento
    { nome: 'Viabilidade Domicílio', setor: 'Pré-internamento', ordem: 8 },
    { nome: 'Recepção - Pré - internamento', setor: 'Pré-internamento', ordem: 9 },
    { nome: 'Escala', setor: 'Pré-internamento', ordem: 10 },
    { nome: 'Plano Terapêutico', setor: 'Pré-internamento', ordem: 11 },
    { nome: 'ITA', setor: 'Pré-internamento', ordem: 12 },
    { nome: 'Supervisor de Enfermagem', setor: 'Pré-internamento', ordem: 13 },
    { nome: 'Nutricionista', setor: 'Pré-internamento', ordem: 14 },
    { nome: 'Fisioterapia', setor: 'Pré-internamento', ordem: 15 },
    { nome: 'Fonoterapia', setor: 'Pré-internamento', ordem: 16 },
    { nome: 'Logística', setor: 'Pré-internamento', ordem: 17 },
    
    // Internamento
    { nome: 'Prescrição', setor: 'Internamento', ordem: 18 },
    { nome: 'Farmácia', setor: 'Internamento', ordem: 19 },
    { nome: 'Translade Paciente', setor: 'Internamento', ordem: 20 },
    { nome: 'Visita ITA', setor: 'Internamento', ordem: 21 },
    { nome: 'Visita do Supervisor de Enfermagem', setor: 'Internamento', ordem: 22 },
    { nome: 'Visita Serviço Social - Relatório', setor: 'Internamento', ordem: 23 },
    { nome: 'Visita Terapias', setor: 'Internamento', ordem: 24 },
    { nome: 'Visita Nutrição', setor: 'Internamento', ordem: 25 }
  ]

  for (const ativ of atividades) {
    const atividade = await prisma.atividadeTemplate.create({
      data: ativ
    })

    // Associar todas as atividades às duas complexidades
    await prisma.complexidadeAtividade.create({
      data: {
        complexidadeId: hc24.id,
        atividadeId: atividade.id
      }
    })

    await prisma.complexidadeAtividade.create({
      data: {
        complexidadeId: hc48.id,
        atividadeId: atividade.id
      }
    })
  }

  console.log('Dados iniciais criados com sucesso!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })