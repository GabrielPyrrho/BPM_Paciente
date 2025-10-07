const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('Criando dados iniciais...')

  // Criar setores
  const setorTI = await prisma.setor.create({
    data: {
      nome: 'Tecnologia da Informação',
      descricao: 'Setor responsável pela infraestrutura e sistemas'
    }
  })

  const setorRH = await prisma.setor.create({
    data: {
      nome: 'Recursos Humanos',
      descricao: 'Setor responsável pela gestão de pessoas'
    }
  })

  const setorFinanceiro = await prisma.setor.create({
    data: {
      nome: 'Financeiro',
      descricao: 'Setor responsável pelas finanças'
    }
  })

  // Criar usuários
  await prisma.usuario.create({
    data: {
      nome: 'Administrador',
      email: 'admin@sistema.com',
      senha: '123456',
      funcao: 'Administrador do Sistema',
      setorId: setorTI.id
    }
  })

  await prisma.usuario.create({
    data: {
      nome: 'João Silva',
      email: 'joao@empresa.com',
      senha: '123456',
      funcao: 'Analista de RH',
      setorId: setorRH.id
    }
  })

  await prisma.usuario.create({
    data: {
      nome: 'Maria Santos',
      email: 'maria@empresa.com',
      senha: '123456',
      funcao: 'Analista Financeiro',
      setorId: setorFinanceiro.id
    }
  })

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