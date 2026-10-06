import { DashboardNotFoundError, type DashboardRepository } from '../application/DashboardRepository'
import type { Dashboard } from '../domain/Dashboard'
import { DashboardMapper, type DashboardDTO } from './DashboardMapper'

export class HttpDashboardRepository implements DashboardRepository {
  constructor(
    private readonly baseUrl: string,
    private readonly fetchFn: typeof fetch = (...args) => fetch(...args),
  ) {}

  async get(id: string): Promise<Dashboard> {
    const response = await this.fetchFn(`${this.baseUrl.replace(/\/$/, '')}/dashboards/${encodeURIComponent(id)}`)
    if (response.status === 404) {
      throw new DashboardNotFoundError(id)
    }
    if (!response.ok) {
      throw new Error(`Falha ao buscar dashboard (HTTP ${response.status}).`)
    }
    return DashboardMapper.toDomain((await response.json()) as DashboardDTO)
  }
}
