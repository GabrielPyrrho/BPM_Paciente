'use client'

import { useState, useEffect } from 'react'

interface Paciente {
  id: string
  nome: string
}

export default function PacientesPage() {
  const [pacientes, setPacientes] = useState<Paciente[]>([])
  const [nome, setNome] = useState('')

  useEffect(() => {
    fetchPacientes()
  }, [])

  const fetchPacientes = async () => {
    const res = await fetch('/api/pacientes')
    const data = await res.json()
    setPacientes(data)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    await fetch('/api/pacientes', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nome })
    })
    setNome('')
    fetchPacientes()
  }

  return (
    <div className="container mx-auto p-8">
      <h1 className="text-2xl font-bold mb-6">Gerenciar Pacientes</h1>
      
      <form onSubmit={handleSubmit} className="mb-8 bg-white p-6 rounded-lg shadow">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-2">Nome do Paciente</label>
          <input
            type="text"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className="w-full p-2 border rounded"
            required
          />
        </div>
        <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded">
          Cadastrar
        </button>
      </form>

      <div className="bg-white rounded-lg shadow">
        <h2 className="text-xl font-semibold p-4 border-b">Pacientes Cadastrados</h2>
        <div className="p-4">
          {pacientes.map((paciente) => (
            <div key={paciente.id} className="p-3 border-b last:border-b-0">
              {paciente.nome}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}