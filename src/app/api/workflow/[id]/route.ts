import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { status, responsavel, observacao } = await request.json()
    
    // Buscar ou criar usuário
    let usuario = null
    if (responsavel) {
      // Primeiro tentar encontrar o usuário
      usuario = await prisma.usuario.findFirst({
        where: { nome: responsavel }
      })
      
      // Se não encontrar, criar novo
      if (!usuario) {
        usuario = await prisma.usuario.create({
          data: { nome: responsavel }
        })
      }
    }

    // Atualizar movimentação
    const movimentacao = await prisma.movimentacaoWorkflow.update({
      where: { id: params.id },
      data: {
        status,
        responsavelId: usuario?.id,
        observacao,
        horaFim: status === 'OK' ? new Date() : null,
        horaInicio: status === 'PENDENTE' ? null : new Date()
      }
    })

    return NextResponse.json(movimentacao)
  } catch (error) {
    console.error('Erro ao atualizar workflow:', error)
    return NextResponse.json({ error: 'Erro ao atualizar atividade' }, { status: 500 })
  }
}