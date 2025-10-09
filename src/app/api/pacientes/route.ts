import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const entidades = await prisma.entidade.findMany()
    
    // Transformar os dados para incluir os campos do JSON
    const entidadesFormatadas = entidades.map(entidade => {
      const campos = entidade.campos as any || {}
      return {
        id: entidade.id,
        nome: entidade.nome,
        tipo: entidade.tipo,
        telefone: campos.telefone || null,
        convenio: campos.convenio || null,
        numeroCartao: campos.numeroCartao || null,
        responsavelNome: campos.responsavelNome || null,
        responsavelTelefone: campos.responsavelTelefone || null
      }
    })
    
    return NextResponse.json(entidadesFormatadas)
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
    
    const entidade = await prisma.entidade.create({
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
    return NextResponse.json({ error: 'Erro ao criar paciente' }, { status: 500 })
  }
}