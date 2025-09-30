'use client'

interface MovimentacaoWorkflow {
  id: string
  status: string
  atividade: {
    nome: string
    setor?: string
  }
  observacao?: string
}

interface WorkflowStepperProps {
  movimentacoes: MovimentacaoWorkflow[]
  onUpdateStatus: (id: string, status: string, observacao?: string) => void
}

export default function WorkflowStepper({ movimentacoes, onUpdateStatus }: WorkflowStepperProps) {
  const handleStatusUpdate = (id: string, newStatus: string) => {
    const observacao = window.prompt('Observação (opcional):')
    if (observacao !== null) {
      onUpdateStatus(id, newStatus, observacao || undefined)
    }
  }

  return (
    <div className="space-y-4">
      {movimentacoes.map((mov, index) => (
        <div key={mov.id} className="flex items-center space-x-4 p-4 border rounded">
          <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white ${
            mov.status === 'OK' ? 'bg-green-500' : 
            mov.status === 'NOK' ? 'bg-red-500' : 'bg-gray-400'
          }`}>
            {index + 1}
          </div>
          
          <div className="flex-1">
            <h3 className="font-medium">{mov.atividade.nome}</h3>
            {mov.atividade.setor && <p className="text-sm text-gray-600">{mov.atividade.setor}</p>}
            {mov.observacao && <p className="text-sm text-blue-600">{mov.observacao}</p>}
          </div>

          {mov.status === 'PENDENTE' && (
            <div className="space-x-2">
              <button 
                onClick={() => handleStatusUpdate(mov.id, 'OK')}
                className="px-3 py-1 bg-green-500 text-white rounded text-sm"
              >
                OK
              </button>
              <button 
                onClick={() => handleStatusUpdate(mov.id, 'NOK')}
                className="px-3 py-1 bg-red-500 text-white rounded text-sm"
              >
                NOK
              </button>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}