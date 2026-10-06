import { WidgetNotFoundError, type WidgetRepository } from '../application/WidgetRepository'
import type { Widget } from '../domain/Widget'
import { WidgetMapper, type WidgetDTO } from './WidgetMapper'

const KEY = 'widgets'

// Implementação "banco local" para o exemplo rodar sem backend.
// Trocar por HttpWidgetRepository não muda nenhuma linha de domínio, aplicação ou UI.
export class LocalStorageWidgetRepository implements WidgetRepository {
  constructor(
    private readonly storage: Storage,
    private readonly seed: WidgetDTO[] = [],
  ) {}

  async listByDashboard(dashboardId: string): Promise<Widget[]> {
    return this.read()
      .filter((w) => w.dashboardId === dashboardId)
      .map(WidgetMapper.toDomain)
  }

  async get(id: string): Promise<Widget> {
    const dto = this.read().find((w) => w.id === id)
    if (!dto) {
      throw new WidgetNotFoundError(id)
    }
    return WidgetMapper.toDomain(dto)
  }

  async save(widget: Widget): Promise<void> {
    const dto = WidgetMapper.toDTO(widget)
    const all = this.read()
    const next = all.some((w) => w.id === dto.id) ? all.map((w) => (w.id === dto.id ? dto : w)) : [...all, dto]
    this.storage.setItem(KEY, JSON.stringify(next))
  }

  private read(): WidgetDTO[] {
    const stored = this.storage.getItem(KEY)
    return stored ? (JSON.parse(stored) as WidgetDTO[]) : this.seed
  }
}
