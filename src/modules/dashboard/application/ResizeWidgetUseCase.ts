import type { Dashboard } from '../domain/Dashboard'
import type { WidgetSize } from '../domain/Widget'
import type { DashboardRepository } from './DashboardRepository'

export interface ResizeWidgetInput {
  dashboardId: string
  widgetId: string
  size: WidgetSize
}

// O caso de uso conhece o fluxo: buscar, aplicar a regra do domínio, persistir, devolver.
// Quem decide se o tamanho é válido é o Widget.
export class ResizeWidgetUseCase {
  constructor(private readonly dashboards: DashboardRepository) {}

  async execute({ dashboardId, widgetId, size }: ResizeWidgetInput): Promise<Dashboard> {
    const dashboard = await this.dashboards.get(dashboardId)
    const updated = dashboard.resizeWidget(widgetId, size)
    await this.dashboards.save(updated)
    return updated
  }
}
