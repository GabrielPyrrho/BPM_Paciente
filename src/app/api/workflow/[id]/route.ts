import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { status, responsavel, observacao, atividadeId } = await request.json()
    
    // Se foi enviado atividadeId, buscar a movimentação específica
    if (atividadeId) {
      // Buscar a movimentação pelo processo e atividade
      const movimentacao = await prisma.movimentacaoWorkflow.findFirst({
        where: {
          processoId: params.id,
          atividadeId: atividadeId
        }
      })

      if (!movimentacao) {
        return NextResponse.json({ error: 'Movimentação não encontrada' }, { status: 404 })
      }

      // Buscar ou criar usuário se necessário
      let usuario = null
      if (responsavel) {
        // Extrair apenas o nome do usuário (antes do parênteses)
        const nomeUsuario = responsavel.split(' (')[0]
        
        usuario = await prisma.usuario.findFirst({
          where: { nome: nomeUsuario }
        })
        
        if (!usuario) {
          // Criar usuário temporário se não existir
          usuario = await prisma.usuario.create({
            data: { 
              nome: nomeUsuario,
              email: `${nomeUsuario.toLowerCase().replace(/\s+/g, '')}@temp.com`,
              senha: 'temp123'
            }
          })
        }
      }

      // Atualizar a movimentação específica
      const movimentacaoAtualizada = await prisma.movimentacaoWorkflow.update({
        where: { id: movimentacao.id },
        data: {
          status,
          responsavelId: usuario?.id,
          responsavelCompleto: responsavel, // Salvar nome + setor
          observacao,
          horaFim: status === 'OK' ? new Date() : null,
          horaInicio: status === 'PENDENTE' ? null : new Date()
        }
      })

      return NextResponse.json(movimentacaoAtualizada)
    }

    // Código original para compatibilidade (quando é enviado ID da movimentação diretamente)
    let usuario = null
    if (responsavel) {
      // Extrair apenas o nome do usuário (antes do parênteses)
      const nomeUsuario = responsavel.split(' (')[0]
      
      usuario = await prisma.usuario.findFirst({
        where: { nome: nomeUsuario }
      })
      
      if (!usuario) {
        usuario = await prisma.usuario.create({
          data: { 
            nome: nomeUsuario,
            email: `${nomeUsuario.toLowerCase().replace(/\s+/g, '')}@temp.com`,
            senha: 'temp123'
          }
        })
      }
    }

    const movimentacao = await prisma.movimentacaoWorkflow.update({
      where: { id: params.id },
      data: {
        status,
        responsavelId: usuario?.id,
        responsavelCompleto: responsavel, // Salvar nome + setor
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