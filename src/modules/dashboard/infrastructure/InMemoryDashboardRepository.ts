import { DashboardNotFoundError, type DashboardRepository } from '../application/DashboardRepository'
import type { Dashboard } from '../domain/Dashboard'
import { DashboardMapper, type DashboardDTO } from './DashboardMapper'

// Implementação local para o exemplo rodar sem backend.
export class InMemoryDashboardRepository implements DashboardRepository {
  constructor(private readonly dashboards: DashboardDTO[]) {}

  async get(id: string): Promise<Dashboard> {
    const dto = this.dashboards.find((d) => d.id === id)
    if (!dto) {
      throw new DashboardNotFoundError(id)
    }
    return DashboardMapper.toDomain(dto)
  }
}
