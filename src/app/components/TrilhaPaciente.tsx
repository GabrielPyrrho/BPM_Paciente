'use client'

interface TrilhaStep {
  nome: string
  data?: string
  hora?: string
  status: 'OK' | 'NOK' | 'PENDENTE'
}

interface TrilhaPacienteProps {
  paciente: string
  complexidade: string
  steps: TrilhaStep[]
}

export default function TrilhaPaciente({ paciente, complexidade, steps }: TrilhaPacienteProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'OK': return 'bg-green-500 text-white'
      case 'NOK': return 'bg-red-500 text-white'
      case 'PENDENTE': return 'bg-yellow-500 text-white'
      default: return 'bg-gray-300 text-gray-700'
    }
  }

  return (
    <div className="bg-white rounded-lg shadow p-6">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-gray-800">{paciente}</h2>
        <p className="text-sm text-gray-600">Processo: {complexidade}</p>
      </div>

      <div className="flex justify-between items-center mb-4">
        {['Iniciado', 'Em Andamento', 'Revisão', 'Finalizado'].map((step, index) => (
          <div key={step} className="flex flex-col items-center">
            <div className="text-xs font-medium text-gray-600 mb-2">{step}</div>
            <div className="flex flex-col items-center space-y-1">
              {steps[index] && (
                <>
                  <div className="text-xs text-gray-500">{steps[index].data}</div>
                  <div className="text-xs text-gray-500">{steps[index].hora}</div>
                  <div className={`px-2 py-1 rounded text-xs font-medium ${
                    getStatusColor(steps[index].status)
                  }`}>
                    {steps[index].status}
                  </div>
                </>
              )}
            </div>
          </div>
        ))}
      </div>

      <div className="flex justify-between">
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div 
            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
            style={{ width: `${(steps.filter(s => s.status === 'OK').length / 4) * 100}%` }}
          ></div>
        </div>
      </div>
    </div>
  )
}