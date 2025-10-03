'use client'

import { useState, useEffect } from 'react'

interface Estatisticas {
  performance: {
    tempoMedio: Array<{ tipo: string; tempoMedio: number }>
    taxaCumprimento: number
    atividadesPorDia: number
  }
  qualidade: {
    taxaRejeicao: number
    topGargalos: Array<{ nome: string; atrasos: number }>
    retrabalho: number
  }
  recursos: {
    topUsuarios: Array<{ nome: string; atividades: number }>
    topSetores: Array<{ setor: string; carga: number }>
    horariosMovimentados: Array<{ hora: string; atividades: number }>
  }
  tendencias: {
    crescimentoMensal: number
    processosMesAtual: number
    processosMesPassado: number
  }
}

export default function EstatisticasGerais() {
  const [stats, setStats] = useState<Estatisticas | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch('/api/estatisticas')
      .then(res => res.json())
      .then(data => {
        setStats(data)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  if (loading) return <div className="text-center py-8">Carregando estatísticas...</div>
  if (!stats) return <div className="text-center py-8 text-red-500">Erro ao carregar estatísticas</div>

  return (
    <div className="space-y-6">
      {/* Performance & Eficiência */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 text-blue-600">📊 Performance & Eficiência</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-blue-50 p-4 rounded">
            <div className="text-2xl font-bold text-blue-600">{stats.performance.taxaCumprimento}%</div>
            <div className="text-sm text-gray-600">Taxa de Cumprimento</div>
          </div>
          <div className="bg-green-50 p-4 rounded">
            <div className="text-2xl font-bold text-green-600">{stats.performance.atividadesPorDia}</div>
            <div className="text-sm text-gray-600">Atividades Hoje</div>
          </div>
          <div className="bg-purple-50 p-4 rounded">
            <div className="text-2xl font-bold text-purple-600">
              {stats.performance.tempoMedio.length > 0 
                ? Math.round(stats.performance.tempoMedio.reduce((acc, t) => acc + t.tempoMedio, 0) / stats.performance.tempoMedio.length)
                : 0}h
            </div>
            <div className="text-sm text-gray-600">Tempo Médio Geral</div>
          </div>
        </div>
        
        {stats.performance.tempoMedio.length > 0 && (
          <div className="mt-4">
            <h4 className="font-medium mb-2">Tempo Médio por Tipo:</h4>
            <div className="space-y-2">
              {stats.performance.tempoMedio.map((item, i) => (
                <div key={i} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm">{item.tipo}</span>
                  <span className="font-medium">{item.tempoMedio}h</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Qualidade & Problemas */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 text-red-600">⚠️ Qualidade & Problemas</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div className="bg-red-50 p-4 rounded mb-4">
              <div className="text-2xl font-bold text-red-600">{stats.qualidade.taxaRejeicao}%</div>
              <div className="text-sm text-gray-600">Taxa de Rejeição</div>
            </div>
          </div>
          
          <div>
            <h4 className="font-medium mb-2">Top 5 Gargalos:</h4>
            {stats.qualidade.topGargalos.length > 0 ? (
              <div className="space-y-2">
                {stats.qualidade.topGargalos.map((item, i) => (
                  <div key={i} className="flex justify-between items-center p-2 bg-red-50 rounded">
                    <span className="text-sm">{item.nome}</span>
                    <span className="bg-red-500 text-white px-2 py-1 rounded text-xs">{item.atrasos}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Nenhum gargalo identificado</p>
            )}
          </div>
        </div>
      </div>

      {/* Recursos & Capacidade */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 text-green-600">👥 Recursos & Capacidade</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div>
            <h4 className="font-medium mb-2">Usuários Mais Ativos:</h4>
            {stats.recursos.topUsuarios.length > 0 ? (
              <div className="space-y-2">
                {stats.recursos.topUsuarios.map((item, i) => (
                  <div key={i} className="flex justify-between items-center p-2 bg-green-50 rounded">
                    <span className="text-sm">{item.nome}</span>
                    <span className="bg-green-500 text-white px-2 py-1 rounded text-xs">{item.atividades}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Sem dados</p>
            )}
          </div>

          <div>
            <h4 className="font-medium mb-2">Setores com Maior Carga:</h4>
            {stats.recursos.topSetores.length > 0 ? (
              <div className="space-y-2">
                {stats.recursos.topSetores.map((item, i) => (
                  <div key={i} className="flex justify-between items-center p-2 bg-blue-50 rounded">
                    <span className="text-sm">{item.setor}</span>
                    <span className="bg-blue-500 text-white px-2 py-1 rounded text-xs">{item.carga}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Sem dados</p>
            )}
          </div>

          <div>
            <h4 className="font-medium mb-2">Picos de Demanda:</h4>
            {stats.recursos.horariosMovimentados.length > 0 ? (
              <div className="space-y-2">
                {stats.recursos.horariosMovimentados.map((item, i) => (
                  <div key={i} className="flex justify-between items-center p-2 bg-orange-50 rounded">
                    <span className="text-sm">{item.hora}</span>
                    <span className="bg-orange-500 text-white px-2 py-1 rounded text-xs">{item.atividades}</span>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-sm">Sem dados</p>
            )}
          </div>
        </div>
      </div>

      {/* Tendências */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-semibold mb-4 text-purple-600">📈 Tendências</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-purple-50 p-4 rounded">
            <div className={`text-2xl font-bold ${stats.tendencias.crescimentoMensal >= 0 ? 'text-green-600' : 'text-red-600'}`}>
              {stats.tendencias.crescimentoMensal > 0 ? '+' : ''}{stats.tendencias.crescimentoMensal}%
            </div>
            <div className="text-sm text-gray-600">Crescimento Mensal</div>
          </div>
          <div className="bg-indigo-50 p-4 rounded">
            <div className="text-2xl font-bold text-indigo-600">{stats.tendencias.processosMesAtual}</div>
            <div className="text-sm text-gray-600">Processos Este Mês</div>
          </div>
          <div className="bg-gray-50 p-4 rounded">
            <div className="text-2xl font-bold text-gray-600">{stats.tendencias.processosMesPassado}</div>
            <div className="text-sm text-gray-600">Processos Mês Passado</div>
          </div>
        </div>
      </div>
    </div>
  )
}