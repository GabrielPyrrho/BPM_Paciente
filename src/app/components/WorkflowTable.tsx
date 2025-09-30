export default function WorkflowTable() {
  return (
    <div className="p-4 bg-white space-y-6">
      {/* Captação */}
      <div className="border border-gray-300 bg-blue-50">
        <div className="bg-blue-200 text-center py-2 font-bold border-b border-gray-300">
          Captação
        </div>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="border-r border-gray-300 p-1 w-20">Recebido</th>
              <th className="border-r border-gray-300 p-1 w-16">Com Prazo</th>
              <th className="border-r border-gray-300 p-1 w-12">Hora</th>
              <th className="border-r border-gray-300 p-1">Atividade</th>
              <th className="border-r border-gray-300 p-1 w-20">Resposta</th>
              <th className="border-r border-gray-300 p-1 w-12">Hora</th>
              <th className="p-1 w-12">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-200">
              <td rowSpan={6} className="border-r border-gray-300 p-1 text-center">07/09/2026</td>
              <td rowSpan={6} className="border-r border-gray-300 p-1 text-center">
                <div className="bg-yellow-300 px-1 rounded">24 horas</div>
              </td>
              <td className="border-r border-gray-300 p-1 text-center">17:30</td>
              <td className="border-r border-gray-300 p-1">Solicitação Convênio</td>
              <td className="border-r border-gray-300 p-1 text-center"></td>
              <td className="border-r border-gray-300 p-1 text-center"></td>
              <td className="p-1 text-center"><div className="w-4 h-4 bg-green-500 rounded-full mx-auto"></div></td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="border-r border-gray-300 p-1 text-center"></td>
              <td className="border-r border-gray-300 p-1">Vista de Enf. Captadora</td>
              <td className="border-r border-gray-300 p-1 text-center">08/09/2026</td>
              <td className="border-r border-gray-300 p-1 text-center">07:30</td>
              <td className="p-1 text-center"><div className="w-4 h-4 bg-green-500 rounded-full mx-auto"></div></td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="border-r border-gray-300 p-1 text-center"></td>
              <td className="border-r border-gray-300 p-1 font-semibold underline">Orçamento</td>
              <td className="border-r border-gray-300 p-1 text-center">08/09/2026</td>
              <td className="border-r border-gray-300 p-1 text-center">10:00</td>
              <td className="p-1 text-center"><div className="w-4 h-4 bg-green-500 rounded-full mx-auto"></div></td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="border-r border-gray-300 p-1 text-center"></td>
              <td className="border-r border-gray-300 p-1">Pré - Prescrição</td>
              <td className="border-r border-gray-300 p-1 text-center">09/09/2026</td>
              <td className="border-r border-gray-300 p-1 text-center">10:00</td>
              <td className="p-1 text-center"><div className="w-4 h-4 bg-green-500 rounded-full mx-auto"></div></td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="border-r border-gray-300 p-1 text-center"></td>
              <td className="border-r border-gray-300 p-1">Pré Escala</td>
              <td className="border-r border-gray-300 p-1 text-center"></td>
              <td className="border-r border-gray-300 p-1 text-center"></td>
              <td className="p-1 text-center"><div className="w-4 h-4 bg-green-500 rounded-full mx-auto"></div></td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="border-r border-gray-300 p-1 text-center"></td>
              <td className="border-r border-gray-300 p-1 font-semibold underline">Posicionamento</td>
              <td className="border-r border-gray-300 p-1 text-center">11/09/2026</td>
              <td className="border-r border-gray-300 p-1 text-center">11:35</td>
              <td className="p-1 text-center"><div className="w-4 h-4 bg-green-500 rounded-full mx-auto"></div></td>
            </tr>
          </tbody>
        </table>
        <div className="bg-yellow-200 p-2 text-center text-xs border-t border-gray-300">
          <div className="font-bold underline">Finalização 1 Etapa</div>
          <div>11/09/2026 14:00</div>
          <div className="bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs font-bold mx-auto mt-1">$</div>
        </div>
      </div>

      {/* Pré-internamento */}
      <div className="border border-gray-300 bg-pink-50">
        <div className="bg-pink-200 text-center py-2 font-bold border-b border-gray-300">
          Pré-internamento
        </div>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="border-r border-gray-300 p-1 w-20">Recebido</th>
              <th className="border-r border-gray-300 p-1 w-16">Com Prazo</th>
              <th className="border-r border-gray-300 p-1 w-12">Hora</th>
              <th className="border-r border-gray-300 p-1">Atividade</th>
              <th className="border-r border-gray-300 p-1 w-20">Resposta</th>
              <th className="border-r border-gray-300 p-1 w-12">Hora</th>
              <th className="p-1 w-12">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-200">
              <td rowSpan={9} className="border-r border-gray-300 p-1 text-center">11/09/2026</td>
              <td rowSpan={9} className="border-r border-gray-300 p-1 text-center">
                <div className="bg-yellow-300 px-1 rounded">48 horas</div>
              </td>
              <td className="border-r border-gray-300 p-1 text-center">14:00</td>
              <td className="border-r border-gray-300 p-1 bg-pink-100">Viabilidade Domicílio</td>
              <td className="border-r border-gray-300 p-1 text-center">11/09/2026</td>
              <td className="border-r border-gray-300 p-1 text-center">16:00</td>
              <td className="p-1 text-center"><div className="w-4 h-4 bg-green-500 rounded-full mx-auto"></div></td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="border-r border-gray-300 p-1 text-center">18:00</td>
              <td className="border-r border-gray-300 p-1 bg-pink-100">Recepção - Pré - Internamento</td>
              <td className="border-r border-gray-300 p-1 text-center">11/09/2026</td>
              <td className="border-r border-gray-300 p-1 text-center">18:30</td>
              <td className="p-1 text-center"><div className="w-4 h-4 bg-green-500 rounded-full mx-auto"></div></td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="border-r border-gray-300 p-1 text-center">18:30</td>
              <td className="border-r border-gray-300 p-1">Escala</td>
              <td className="border-r border-gray-300 p-1 text-center">12/09/2026</td>
              <td className="border-r border-gray-300 p-1 text-center">12:30</td>
              <td className="p-1 text-center"><div className="w-4 h-4 bg-green-500 rounded-full mx-auto"></div></td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="border-r border-gray-300 p-1 text-center">15:00</td>
              <td className="border-r border-gray-300 p-1">Plano Terapêutico</td>
              <td className="border-r border-gray-300 p-1 text-center">11/09/2026</td>
              <td className="border-r border-gray-300 p-1 text-center"></td>
              <td className="p-1 text-center"><div className="w-4 h-4 bg-green-500 rounded-full mx-auto"></div></td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="border-r border-gray-300 p-1 text-center">15:00</td>
              <td className="border-r border-gray-300 p-1">ITA</td>
              <td className="border-r border-gray-300 p-1 text-center">12/09/2026</td>
              <td className="border-r border-gray-300 p-1 text-center">15:30</td>
              <td className="p-1 text-center"><div className="w-4 h-4 bg-green-500 rounded-full mx-auto"></div></td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="border-r border-gray-300 p-1 text-center">15:00</td>
              <td className="border-r border-gray-300 p-1">Supervisor de Enfermagem</td>
              <td className="border-r border-gray-300 p-1 text-center">12/09/2026</td>
              <td className="border-r border-gray-300 p-1 text-center">15:50</td>
              <td className="p-1 text-center"><div className="w-4 h-4 bg-green-500 rounded-full mx-auto"></div></td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="border-r border-gray-300 p-1 text-center">15:00</td>
              <td className="border-r border-gray-300 p-1">Nutricionista</td>
              <td className="border-r border-gray-300 p-1 text-center">12/09/2026</td>
              <td className="border-r border-gray-300 p-1 text-center">15:30</td>
              <td className="p-1 text-center"><div className="w-4 h-4 bg-green-500 rounded-full mx-auto"></div></td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="border-r border-gray-300 p-1 text-center">15:00</td>
              <td className="border-r border-gray-300 p-1">Fisioterapia</td>
              <td className="border-r border-gray-300 p-1 text-center">12/09/2026</td>
              <td className="border-r border-gray-300 p-1 text-center">18:20</td>
              <td className="p-1 text-center"><div className="w-4 h-4 bg-green-500 rounded-full mx-auto"></div></td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="border-r border-gray-300 p-1 text-center">15:00</td>
              <td className="border-r border-gray-300 p-1">Fonoterapia</td>
              <td className="border-r border-gray-300 p-1 text-center">12/09/2026</td>
              <td className="border-r border-gray-300 p-1 text-center">18:20</td>
              <td className="p-1 text-center"><div className="w-4 h-4 bg-green-500 rounded-full mx-auto"></div></td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="border-r border-gray-300 p-1 text-center">14:00</td>
              <td className="border-r border-gray-300 p-1">Logística</td>
              <td className="border-r border-gray-300 p-1 text-center">13/09/2026</td>
              <td className="border-r border-gray-300 p-1 text-center">08:20</td>
              <td className="p-1 text-center"><div className="w-4 h-4 bg-green-500 rounded-full mx-auto"></div></td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Internamento */}
      <div className="border border-gray-300 bg-green-50">
        <div className="bg-green-200 text-center py-2 font-bold border-b border-gray-300">
          Internamento
        </div>
        <table className="w-full text-xs">
          <thead>
            <tr className="border-b border-gray-300">
              <th className="border-r border-gray-300 p-1 w-20">Recebido</th>
              <th className="border-r border-gray-300 p-1 w-16">Com Prazo</th>
              <th className="border-r border-gray-300 p-1">Atividade</th>
              <th className="border-r border-gray-300 p-1 w-20">Resposta</th>
              <th className="border-r border-gray-300 p-1 w-12">Hora</th>
              <th className="p-1 w-12">Status</th>
            </tr>
          </thead>
          <tbody>
            <tr className="border-b border-gray-200">
              <td rowSpan={8} className="border-r border-gray-300 p-1 text-center">11/09/2026</td>
              <td rowSpan={8} className="border-r border-gray-300 p-1 text-center">
                <div className="bg-yellow-300 px-1 rounded">48 horas</div>
              </td>
              <td className="border-r border-gray-300 p-1">Prescrição</td>
              <td className="border-r border-gray-300 p-1 text-center">12/09/2026</td>
              <td className="border-r border-gray-300 p-1 text-center">08:20</td>
              <td className="p-1 text-center"><div className="w-4 h-4 bg-green-500 rounded-full mx-auto"></div></td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="border-r border-gray-300 p-1 bg-pink-100">Farmácia</td>
              <td className="border-r border-gray-300 p-1 text-center">13/09/2026</td>
              <td className="border-r border-gray-300 p-1 text-center">07:30</td>
              <td className="p-1 text-center"><div className="w-4 h-4 bg-green-500 rounded-full mx-auto"></div></td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="border-r border-gray-300 p-1"></td>
              <td className="border-r border-gray-300 p-1 text-center"></td>
              <td className="border-r border-gray-300 p-1 text-center"></td>
              <td className="p-1 text-center"><div className="w-4 h-4 bg-green-500 rounded-full mx-auto"></div></td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="border-r border-gray-300 p-1 bg-pink-100">Translado Paciente</td>
              <td className="border-r border-gray-300 p-1 text-center">13/09/2026</td>
              <td className="border-r border-gray-300 p-1 text-center">10:00</td>
              <td className="p-1 text-center"><div className="w-4 h-4 bg-green-500 rounded-full mx-auto"></div></td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="border-r border-gray-300 p-1">Visita ITA</td>
              <td className="border-r border-gray-300 p-1 text-center"></td>
              <td className="border-r border-gray-300 p-1 text-center"></td>
              <td className="p-1 text-center"><div className="w-4 h-4 bg-green-500 rounded-full mx-auto"></div></td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="border-r border-gray-300 p-1">Visita do Supervisor de Enfermagem</td>
              <td className="border-r border-gray-300 p-1 text-center"></td>
              <td className="border-r border-gray-300 p-1 text-center"></td>
              <td className="p-1 text-center"><div className="w-4 h-4 bg-green-500 rounded-full mx-auto"></div></td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="border-r border-gray-300 p-1">Visita Serviço Social - Relatório</td>
              <td className="border-r border-gray-300 p-1 text-center"></td>
              <td className="border-r border-gray-300 p-1 text-center"></td>
              <td className="p-1 text-center"><div className="w-4 h-4 bg-yellow-500 rounded-full mx-auto"></div></td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="border-r border-gray-300 p-1">Visita Terapias</td>
              <td className="border-r border-gray-300 p-1 text-center"></td>
              <td className="border-r border-gray-300 p-1 text-center"></td>
              <td className="p-1 text-center"><div className="w-4 h-4 bg-green-500 rounded-full mx-auto"></div></td>
            </tr>
            <tr className="border-b border-gray-200">
              <td className="border-r border-gray-300 p-1">Visita Nutrição</td>
              <td className="border-r border-gray-300 p-1 text-center"></td>
              <td className="border-r border-gray-300 p-1 text-center"></td>
              <td className="p-1 text-center"><div className="w-4 h-4 bg-green-500 rounded-full mx-auto"></div></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  )
}