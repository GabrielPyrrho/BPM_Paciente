import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { nome, setor, setorId, ordem, etapaId } = await request.json()
    
    if (!nome) {
      return NextResponse.json({ error: 'Nome é obrigatório' }, { status: 400 })
    }
    
    // Se etapaId foi fornecido, verificar se existe
    let etapaFinal = etapaId
    if (etapaId) {
      const etapaEncontrada = await prisma.etapa.findUnique({
        where: { id: etapaId }
      })
      
      if (!etapaEncontrada) {
        return NextResponse.json({ error: 'Etapa não encontrada' }, { status: 400 })
      }
    } else {
      // Se não foi fornecido etapaId, buscar uma etapa padrão ou criar uma
      const etapaPadrao = await prisma.etapa.findFirst({
        orderBy: { ordem: 'asc' }
      })
      
      if (!etapaPadrao) {
        // Criar etapa padrão se não existir nenhuma
        const novaEtapa = await prisma.etapa.create({
          data: {
            nome: 'GERAL',
            descricao: 'Etapa geral',
            ordem: 1,
            cor: '#3b82f6'
          }
        })
        etapaFinal = novaEtapa.id
      } else {
        etapaFinal = etapaPadrao.id
      }
    }
    
    const atividade = await prisma.atividadeTemplate.update({
      where: { id: params.id },
      data: { 
        nome: nome.trim(),
        setor: setor?.trim() || null,
        setorId: setorId || null,
        ordem: ordem || 1,
        etapaId: etapaFinal
      },
      include: {
        etapa: true,
        setorObj: true
      }
    })
    
    return NextResponse.json(atividade)
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
        error: 'Não é possível excluir atividade que está sendo usada em tipos de processo' 
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