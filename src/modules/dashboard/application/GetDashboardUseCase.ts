import type { Dashboard } from '../domain/Dashboard'
import type { DashboardRepository } from './DashboardRepository'

export class GetDashboardUseCase {
  constructor(private readonly dashboards: DashboardRepository) {}

  execute(dashboardId: string): Promise<Dashboard> {
    return this.dashboards.get(dashboardId)
  }
}
