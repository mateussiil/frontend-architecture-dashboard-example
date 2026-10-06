import type { Widget } from '../domain/Widget'
import type { WidgetRepository } from './WidgetRepository'

export class ListDashboardWidgetsUseCase {
  constructor(private readonly widgets: WidgetRepository) {}

  execute(dashboardId: string): Promise<Widget[]> {
    return this.widgets.listByDashboard(dashboardId)
  }
}
