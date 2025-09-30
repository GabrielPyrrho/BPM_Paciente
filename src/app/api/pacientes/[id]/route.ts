import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { nome, telefone, convenio, numeroCartao, responsavelNome, responsavelTelefone } = await request.json()
    
    if (!nome || typeof nome !== 'string' || nome.trim().length === 0) {
      return NextResponse.json({ error: 'Nome é obrigatório' }, { status: 400 })
    }
    
    const paciente = await prisma.paciente.update({
      where: { id: params.id },
      data: { 
        nome: nome.trim(),
        telefone: telefone?.trim() || null,
        convenio: convenio?.trim() || null,
        numeroCartao: numeroCartao?.trim() || null,
        responsavelNome: responsavelNome?.trim() || null,
        responsavelTelefone: responsavelTelefone?.trim() || null
      }
    })
    return NextResponse.json(paciente)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao atualizar paciente' }, { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Excluir movimentações dos processos do paciente
    await prisma.movimentacaoWorkflow.deleteMany({
      where: {
        processo: {
          pacienteId: params.id
        }
      }
    })
    
    // Excluir processos do paciente
    await prisma.processoPaciente.deleteMany({
      where: { pacienteId: params.id }
    })
    
    // Excluir paciente
    await prisma.paciente.delete({
      where: { id: params.id }
    })
    
    return NextResponse.json({ success: true })
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao excluir paciente' }, { status: 500 })
  }
}