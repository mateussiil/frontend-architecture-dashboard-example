import { WidgetNotFoundError, type WidgetRepository } from '../application/WidgetRepository'
import type { Widget } from '../domain/Widget'
import { WidgetMapper, type WidgetDTO } from './WidgetMapper'

export class HttpWidgetRepository implements WidgetRepository {
  private readonly baseUrl: string

  constructor(
    baseUrl: string,
    private readonly fetchFn: typeof fetch = (...args) => fetch(...args),
  ) {
    this.baseUrl = baseUrl.replace(/\/$/, '')
  }

  async listByDashboard(dashboardId: string): Promise<Widget[]> {
    const response = await this.fetchFn(`${this.baseUrl}/dashboards/${encodeURIComponent(dashboardId)}/widgets`)
    if (!response.ok) {
      throw new Error(`Falha ao listar widgets (HTTP ${response.status}).`)
    }
    return ((await response.json()) as WidgetDTO[]).map(WidgetMapper.toDomain)
  }

  async get(id: string): Promise<Widget> {
    const response = await this.fetchFn(this.url(id))
    if (response.status === 404) {
      throw new WidgetNotFoundError(id)
    }
    if (!response.ok) {
      throw new Error(`Falha ao buscar widget (HTTP ${response.status}).`)
    }
    return WidgetMapper.toDomain((await response.json()) as WidgetDTO)
  }

  async save(widget: Widget): Promise<void> {
    const response = await this.fetchFn(this.url(widget.id()), {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(WidgetMapper.toDTO(widget)),
    })
    if (!response.ok) {
      throw new Error(`Falha ao salvar widget (HTTP ${response.status}).`)
    }
  }

  private url(id: string): string {
    return `${this.baseUrl}/widgets/${encodeURIComponent(id)}`
  }
}
