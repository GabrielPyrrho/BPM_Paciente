import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(request: NextRequest) {
  try {
    const { email, senha } = await request.json()
    
    if (!email || !senha) {
      return NextResponse.json({ error: 'Email e senha são obrigatórios' }, { status: 400 })
    }
    
    const usuario = await prisma.usuario.findFirst({
      where: { 
        email: email.toLowerCase(),
        senha,
        ativo: true
      },
      include: { setor: true }
    })
    
    if (!usuario) {
      return NextResponse.json({ error: 'Credenciais inválidas' }, { status: 401 })
    }
    
    return NextResponse.json({
      id: usuario.id,
      nome: usuario.nome,
      email: usuario.email,
      funcao: usuario.funcao,
      setor: usuario.setor
    })
  } catch (error) {
    return NextResponse.json({ error: 'Erro no login' }, { status: 500 })
  }
}