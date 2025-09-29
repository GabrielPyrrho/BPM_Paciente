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

  // Criar atividades template
  const atividades = [
    { nome: 'Admissão', setor: 'Recepção', ordem: 1 },
    { nome: 'Triagem', setor: 'Enfermagem', ordem: 2 },
    { nome: 'Consulta Médica', setor: 'Médico', ordem: 3 },
    { nome: 'Exames', setor: 'Laboratório', ordem: 4 },
    { nome: 'Internação', setor: 'Enfermaria', ordem: 5 }
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