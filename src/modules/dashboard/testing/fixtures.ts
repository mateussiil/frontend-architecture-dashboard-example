import { Dashboard } from '../domain/Dashboard'
import { Widget } from '../domain/Widget'

export function aDashboard(): Dashboard {
  return Dashboard.create({
    id: 'vendas',
    name: 'Vendas',
    widgets: [
      Widget.create({ id: 'receita', title: 'Receita do mês', type: 'kpi', size: { columns: 1, rows: 1 } }),
      Widget.create({ id: 'evolucao', title: 'Evolução diária', type: 'line-chart', size: { columns: 2, rows: 2 } }),
    ],
  })
}
