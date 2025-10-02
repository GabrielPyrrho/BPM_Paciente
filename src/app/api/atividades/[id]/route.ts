import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { nome, setor, ordem, etapa } = await request.json()
    
    if (!nome) {
      return NextResponse.json({ error: 'Nome é obrigatório' }, { status: 400 })
    }
    
    // Verificar se a atividade existe
    const atividadeExiste = await prisma.atividadeTemplate.findUnique({
      where: { id: params.id }
    })
    
    if (!atividadeExiste) {
      return NextResponse.json({ error: 'Atividade não encontrada' }, { status: 404 })
    }
    
    const atividade = await prisma.atividadeTemplate.update({
      where: { id: params.id },
      data: { 
        nome: nome.trim(),
        setor: setor?.trim() || null,
        ordem: parseInt(ordem) || 1,
        etapa: etapa || 'CAPTACAO'
      }
    })
    
    return NextResponse.json(atividade)
  } catch (error) {
    console.error('Erro ao atualizar atividade:', error)
    return NextResponse.json({ error: `Erro ao atualizar atividade: ${error.message}` }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Excluir movimentações primeiro
    await prisma.movimentacaoWorkflow.deleteMany({
      where: { atividadeId: params.id }
    })
    
    // Excluir relações com complexidades
    await prisma.complexidadeAtividade.deleteMany({
      where: { atividadeId: params.id }
    })
    
    // Excluir a atividade
    await prisma.atividadeTemplate.delete({
      where: { id: params.id }
    })
    
    return NextResponse.json({ message: 'Atividade excluída com sucesso' })
  } catch (error) {
    console.error('Erro ao excluir atividade:', error)
    return NextResponse.json({ error: 'Erro ao excluir atividade' }, { status: 500 })
  }
}