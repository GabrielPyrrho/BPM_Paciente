'use client'
import { useState, useEffect } from 'react'

interface Usuario {
  id: string
  nome: string
  email: string
  setor?: { nome: string }
}

interface SelectUsuarioProps {
  value: string
  onChange: (usuarioId: string) => void
  setorId?: string
  placeholder?: string
  required?: boolean
}

export default function SelectUsuario({ value, onChange, setorId, placeholder = "Selecione um usuário", required = false }: SelectUsuarioProps) {
  const [usuarios, setUsuarios] = useState<Usuario[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    carregarUsuarios()
  }, [])

  const carregarUsuarios = async () => {
    try {
      const res = await fetch('/api/usuarios')
      const data = await res.json()
      setUsuarios(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Erro ao carregar usuários:', error)
    } finally {
      setLoading(false)
    }
  }

  const usuariosFiltrados = setorId 
    ? usuarios.filter(u => u.setor?.id === setorId)
    : usuarios

  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      required={required}
      style={{
        width: '100%',
        padding: '12px',
        border: '1px solid #d1d5db',
        borderRadius: '8px',
        fontSize: '14px',
        background: 'white'
      }}
    >
      <option value="">{loading ? 'Carregando...' : placeholder}</option>
      {usuariosFiltrados.map(usuario => (
        <option key={usuario.id} value={usuario.id}>
          {usuario.nome} - {usuario.setor?.nome || 'Sem setor'}
        </option>
      ))}
    </select>
  )
}