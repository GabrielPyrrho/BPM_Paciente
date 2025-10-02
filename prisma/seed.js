const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

async function main() {
  // Criar etapas padrão
  const etapas = [
    { nome: 'CAPTACAO', descricao: 'Captação inicial', ordem: 1, cor: '#3B82F6' },
    { nome: 'PRE_INTERNAMENTO', descricao: 'Pré-internamento', ordem: 2, cor: '#F59E0B' },
    { nome: 'INTERNADO', descricao: 'Internado', ordem: 3, cor: '#10B981' },
    { nome: 'RECEBIMENTO', descricao: 'Recebimento', ordem: 1, cor: '#8B5CF6' },
    { nome: 'VALIDACAO', descricao: 'Validação', ordem: 2, cor: '#F59E0B' },
    { nome: 'APROVACAO', descricao: 'Aprovação', ordem: 3, cor: '#EF4444' },
    { nome: 'PAGAMENTO', descricao: 'Pagamento', ordem: 4, cor: '#10B981' }
  ]

  await prisma.etapa.createMany({
    data: etapas,
    skipDuplicates: true
  })

  // // Criar tipos de workflow padrão
  // const tiposWorkflow = [
  //   { nome: 'HC24', descricao: 'Internamento 24 horas', categoria: 'HOSPITALAR' },
  //   { nome: 'HC48', descricao: 'Internamento 48 horas', categoria: 'HOSPITALAR' },
  //   { nome: 'NOTA_FISCAL', descricao: 'Processamento de Nota Fiscal', categoria: 'FINANCEIRO' }
  // ]

  // await prisma.tipoWorkflow.createMany({
  //   data: tiposWorkflow,
  //   skipDuplicates: true
  // })

  console.log('Seed executado com sucesso!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })