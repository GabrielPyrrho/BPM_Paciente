import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { nome, telefone, convenio, numeroCartao, responsavelNome, responsavelTelefone } = await request.json()
    
    if (!nome || typeof nome !== 'string' || nome.trim().length === 0) {
      return NextResponse.json({ error: 'Nome é obrigatório' }, { status: 400 })
    }
    
    const entidade = await prisma.entidade.update({
      where: { id: params.id },
      data: { 
        nome: nome.trim(),
        campos: {
          telefone: telefone?.trim() || null,
          convenio: convenio?.trim() || null,
          numeroCartao: numeroCartao?.trim() || null,
          responsavelNome: responsavelNome?.trim() || null,
          responsavelTelefone: responsavelTelefone?.trim() || null
        }
      }
    })
    
    // Retornar dados formatados
    const campos = entidade.campos as any || {}
    const entidadeFormatada = {
      id: entidade.id,
      nome: entidade.nome,
      tipo: entidade.tipo,
      telefone: campos.telefone || null,
      convenio: campos.convenio || null,
      numeroCartao: campos.numeroCartao || null,
      responsavelNome: campos.responsavelNome || null,
      responsavelTelefone: campos.responsavelTelefone || null
    }
    
    return NextResponse.json(entidadeFormatada)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar paciente' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Excluir movimentações dos processos da entidade
    await prisma.movimentacaoWorkflow.deleteMany({
      where: {
        processo: {
          entidadeId: params.id
        }
      }
    })
    
    // Excluir processos da entidade
    await prisma.processoWorkflow.deleteMany({
      where: { entidadeId: params.id }
    })
    
    // Excluir entidade
    await prisma.entidade.delete({
      where: { id: params.id }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao excluir paciente' }, { status: 500 })
  }
}