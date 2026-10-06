import { Widget } from '../domain/Widget'

export function aKpiWidget(): Widget {
  return Widget.create({
    id: 'receita',
    dashboardId: 'vendas',
    title: 'Receita do mês',
    type: 'kpi',
    size: { columns: 1, rows: 1 },
  })
}

export function aLineChartWidget(): Widget {
  return Widget.create({
    id: 'evolucao',
    dashboardId: 'vendas',
    title: 'Evolução diária',
    type: 'line-chart',
    size: { columns: 2, rows: 2 },
  })
}
