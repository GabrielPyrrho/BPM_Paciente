import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const complexidades = await prisma.tipoWorkflow.findMany({
      include: {
        atividades: {
          include: {
            atividade: true
          }
        }
      }
    })
    return NextResponse.json(complexidades)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao buscar complexidades' }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const { nome, atividadeIds } = await request.json()
    
    if (!nome) {
      return NextResponse.json({ error: 'Nome é obrigatório' }, { status: 400 })
    }
    
    const complexidade = await prisma.tipoWorkflow.create({
      data: { 
        nome: nome.trim(),
        atividades: {
          create: atividadeIds?.map((atividadeId: string) => ({
            atividadeId
          })) || []
        }
      },
      include: {
        atividades: {
          include: {
            atividade: true
          }
        }
      }
    })
    return NextResponse.json(complexidade)
  } catch (error) {
    return NextResponse.json({ error: 'Erro ao criar complexidade' }, { status: 500 })
  }
}