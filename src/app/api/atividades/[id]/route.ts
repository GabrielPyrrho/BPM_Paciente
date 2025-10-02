import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { nome, setor, ordem, etapa } = await request.json()
    
    if (!nome) {
      return NextResponse.json({ error: 'Nome é obrigatório' }, { status: 400 })
    }
    
    // Buscar etapa
    const etapaEncontrada = await prisma.etapa.findFirst({
      where: { nome: etapa || 'CAPTACAO' }
    })
    
    if (!etapaEncontrada) {
      return NextResponse.json({ error: 'Etapa não encontrada' }, { status: 400 })
    }
    
    const atividade = await prisma.atividadeTemplate.update({
      where: { id: params.id },
      data: { 
        nome: nome.trim(),
        setor: setor?.trim() || null,
        ordem: ordem || 1,
        etapaId: etapaEncontrada.id
      }
    })
    
    return NextResponse.json({
      ...atividade,
      etapa: etapa || 'CAPTACAO'
    })
  } catch (error) {
    console.error('Erro ao atualizar atividade:', error)
    return NextResponse.json({ error: 'Erro ao atualizar atividade' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Verificar se a atividade está sendo usada em tipos de workflow
    const usoCount = await prisma.tipoWorkflowAtividade.count({
      where: { atividadeId: params.id }
    })
    
    if (usoCount > 0) {
      return NextResponse.json({ 
        error: 'Não é possível excluir atividade que está sendo usada em tipos de workflow' 
      }, { status: 400 })
    }
    
    await prisma.atividadeTemplate.delete({
      where: { id: params.id }
    })
    
    return NextResponse.json({ message: 'Atividade excluída com sucesso' })
  } catch (error) {
    console.error('Erro ao excluir atividade:', error)
    return NextResponse.json({ error: 'Erro ao excluir atividade' }, { status: 500 })
  }
}