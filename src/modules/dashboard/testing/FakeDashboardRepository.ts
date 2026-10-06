import { DashboardNotFoundError, type DashboardRepository } from '../application/DashboardRepository'
import type { Dashboard } from '../domain/Dashboard'

export class FakeDashboardRepository implements DashboardRepository {
  readonly saved: Dashboard[] = []
  private readonly dashboards = new Map<string, Dashboard>()

  constructor(initial: Dashboard[] = []) {
    initial.forEach((d) => this.dashboards.set(d.id(), d))
  }

  async get(id: string): Promise<Dashboard> {
    const dashboard = this.dashboards.get(id)
    if (!dashboard) {
      throw new DashboardNotFoundError(id)
    }
    return dashboard
  }

  async save(dashboard: Dashboard): Promise<void> {
    this.saved.push(dashboard)
    this.dashboards.set(dashboard.id(), dashboard)
  }
}
