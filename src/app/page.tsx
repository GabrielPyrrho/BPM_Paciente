export default function Home() {
  return (
    <div className="container mx-auto p-8">
      <h1 className="text-3xl font-bold mb-8">BPM - Internamento de Paciente</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Dashboard</h2>
          <p className="text-gray-600 mb-4">Visualize estatísticas e acompanhe processos</p>
          <a href="/dashboard" className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600">
            Ver Dashboard
          </a>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Cadastrar Paciente</h2>
          <p className="text-gray-600 mb-4">Gerencie informações dos pacientes</p>
          <a href="/pacientes" className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Gerenciar Pacientes
          </a>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <h2 className="text-xl font-semibold mb-4">Processos</h2>
          <p className="text-gray-600 mb-4">Crie e acompanhe workflows</p>
          <a href="/processos" className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600">
            Gerenciar Processos
          </a>
        </div>
      </div>
    </div>
  )
}