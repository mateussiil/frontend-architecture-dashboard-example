import type { DashboardDTO } from './DashboardMapper'

export const seedDashboards: DashboardDTO[] = [
  {
    id: 'vendas',
    name: 'Vendas',
    widgets: [
      { id: 'receita', title: 'Receita do mês', type: 'kpi', width: 1, height: 1 },
      { id: 'pedidos', title: 'Pedidos', type: 'kpi', width: 1, height: 1 },
      { id: 'ticket', title: 'Ticket médio', type: 'kpi', width: 2, height: 1 },
      { id: 'evolucao', title: 'Evolução diária', type: 'line-chart', width: 2, height: 2 },
      { id: 'top-produtos', title: 'Top produtos', type: 'table', width: 2, height: 2 },
    ],
  },
]
