import { DashboardNotFoundError, type DashboardRepository } from '../application/DashboardRepository'
import type { Dashboard } from '../domain/Dashboard'
import { DashboardMapper, type DashboardDTO } from './DashboardMapper'

const KEY_PREFIX = 'dashboard:'

// Implementação "banco local" para o exemplo rodar sem backend.
// Trocar por HttpDashboardRepository não muda nenhuma linha de domínio, aplicação ou UI.
export class LocalStorageDashboardRepository implements DashboardRepository {
  constructor(
    private readonly storage: Storage,
    private readonly seed: DashboardDTO[] = [],
  ) {}

  async get(id: string): Promise<Dashboard> {
    const stored = this.storage.getItem(KEY_PREFIX + id)
    const dto = stored ? (JSON.parse(stored) as DashboardDTO) : this.seed.find((d) => d.id === id)
    if (!dto) {
      throw new DashboardNotFoundError(id)
    }
    return DashboardMapper.toDomain(dto)
  }

  async save(dashboard: Dashboard): Promise<void> {
    this.storage.setItem(KEY_PREFIX + dashboard.id(), JSON.stringify(DashboardMapper.toDTO(dashboard)))
  }
}
