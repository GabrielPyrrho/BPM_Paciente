import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const pacientes = await prisma.entidade.findMany()
    return NextResponse.json(pacientes)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar pacientes' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { nome, telefone, convenio, numeroCartao, responsavelNome, responsavelTelefone } = await request.json()
    
    if (!nome || typeof nome !== 'string' || nome.trim().length === 0) {
      return NextResponse.json({ error: 'Nome é obrigatório' }, { status: 400 })
    }
    
    const paciente = await prisma.entidade.create({
      data: { 
        nome: nome.trim(),
        tipo: 'PESSOA',
        campos: {
          telefone: telefone?.trim() || null,
          convenio: convenio?.trim() || null,
          numeroCartao: numeroCartao?.trim() || null,
          responsavelNome: responsavelNome?.trim() || null,
          responsavelTelefone: responsavelTelefone?.trim() || null
        }
      }
    })
    return NextResponse.json(paciente)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar paciente' }, { status: 500 })
  }
}