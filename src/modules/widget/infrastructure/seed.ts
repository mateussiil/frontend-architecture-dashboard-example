import type { WidgetDTO } from './WidgetMapper'

export const seedWidgets: WidgetDTO[] = [
  { id: 'receita', dashboardId: 'vendas', title: 'Receita do mês', type: 'kpi', width: 1, height: 1 },
  { id: 'pedidos', dashboardId: 'vendas', title: 'Pedidos', type: 'kpi', width: 1, height: 1 },
  { id: 'ticket', dashboardId: 'vendas', title: 'Ticket médio', type: 'kpi', width: 2, height: 1 },
  { id: 'evolucao', dashboardId: 'vendas', title: 'Evolução diária', type: 'line-chart', width: 2, height: 2 },
  { id: 'top-produtos', dashboardId: 'vendas', title: 'Top produtos', type: 'table', width: 2, height: 2 },
]
