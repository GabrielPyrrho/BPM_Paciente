'use client'
import { useState, useEffect } from 'react'

interface Setor {
  id: string
  nome: string
  descricao?: string
}

interface SelectSetorProps {
  value: string
  onChange: (setorId: string) => void
  placeholder?: string
  required?: boolean
}

export default function SelectSetor({ value, onChange, placeholder = "Selecione um setor", required = false }: SelectSetorProps) {
  const [setores, setSetores] = useState<Setor[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    carregarSetores()
  }, [])

  const carregarSetores = async () => {
    try {
      const res = await fetch('/api/setores')
      const data = await res.json()
      setSetores(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error('Erro ao carregar setores:', error)
    } finally {
      setLoading(false)
    }
  }

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
      {setores.map(setor => (
        <option key={setor.id} value={setor.id}>
          {setor.nome}
        </option>
      ))}
    </select>
  )
}