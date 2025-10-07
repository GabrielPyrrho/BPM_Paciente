import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function seedUsuarios() {
  // Criar setores primeiro
  const setores = await Promise.all([
    prisma.setor.upsert({
      where: { nome: 'Médico' },
      update: {},
      create: { nome: 'Médico', descricao: 'Setor Médico' }
    }),
    prisma.setor.upsert({
      where: { nome: 'Enfermagem' },
      update: {},
      create: { nome: 'Enfermagem', descricao: 'Setor de Enfermagem' }
    }),
    prisma.setor.upsert({
      where: { nome: 'Farmácia' },
      update: {},
      create: { nome: 'Farmácia', descricao: 'Setor de Farmácia' }
    }),
    prisma.setor.upsert({
      where: { nome: 'Logística' },
      update: {},
      create: { nome: 'Logística', descricao: 'Setor de Logística' }
    }),
    prisma.setor.upsert({
      where: { nome: 'Financeiro' },
      update: {},
      create: { nome: 'Financeiro', descricao: 'Setor Financeiro' }
    }),
    prisma.setor.upsert({
      where: { nome: 'Supervisão' },
      update: {},
      create: { nome: 'Supervisão', descricao: 'Supervisão Geral' }
    })
  ])

  // Criar usuários
  const usuarios = await Promise.all([
    prisma.usuario.upsert({
      where: { email: 'joao.silva@hospital.com' },
      update: {},
      create: {
        nome: 'Dr. João Silva',
        email: 'joao.silva@hospital.com',
        senha: 'senha123',
        funcao: 'Médico',
        setorId: setores[0].id
      }
    }),
    prisma.usuario.upsert({
      where: { email: 'maria.santos@hospital.com' },
      update: {},
      create: {
        nome: 'Enf. Maria Santos',
        email: 'maria.santos@hospital.com',
        senha: 'senha123',
        funcao: 'Enfermeira',
        setorId: setores[1].id
      }
    }),
    prisma.usuario.upsert({
      where: { email: 'ana.costa@hospital.com' },
      update: {},
      create: {
        nome: 'Ana Costa',
        email: 'ana.costa@hospital.com',
        senha: 'senha123',
        funcao: 'Farmacêutica',
        setorId: setores[2].id
      }
    }),
    prisma.usuario.upsert({
      where: { email: 'carlos.lima@hospital.com' },
      update: {},
      create: {
        nome: 'Carlos Lima',
        email: 'carlos.lima@hospital.com',
        senha: 'senha123',
        funcao: 'Coordenador',
        setorId: setores[3].id
      }
    }),
    prisma.usuario.upsert({
      where: { email: 'paula.financeiro@hospital.com' },
      update: {},
      create: {
        nome: 'Paula Financeiro',
        email: 'paula.financeiro@hospital.com',
        senha: 'senha123',
        funcao: 'Analista',
        setorId: setores[4].id
      }
    }),
    prisma.usuario.upsert({
      where: { email: 'supervisor@hospital.com' },
      update: {},
      create: {
        nome: 'Supervisor Geral',
        email: 'supervisor@hospital.com',
        senha: 'senha123',
        funcao: 'Supervisor',
        setorId: setores[5].id
      }
    })
  ])

  console.log('Usuários criados:', usuarios.length)
}

seedUsuarios()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })