import type { Widget } from '../domain/Widget'

// A camada de aplicação depende desta abstração, nunca de fetch, Axios ou localStorage.
export interface WidgetRepository {
  listByDashboard(dashboardId: string): Promise<Widget[]>
  get(id: string): Promise<Widget>
  save(widget: Widget): Promise<void>
}

export class WidgetNotFoundError extends Error {
  constructor(id: string) {
    super(`Widget "${id}" não encontrado.`)
    this.name = 'WidgetNotFoundError'
  }
}
