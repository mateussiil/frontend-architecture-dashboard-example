import { WidgetNotFoundError, type WidgetRepository } from '../application/WidgetRepository'
import type { Widget } from '../domain/Widget'

export class FakeWidgetRepository implements WidgetRepository {
  readonly saved: Widget[] = []
  private readonly widgets = new Map<string, Widget>()

  constructor(initial: Widget[] = []) {
    initial.forEach((w) => this.widgets.set(w.id(), w))
  }

  async listByDashboard(dashboardId: string): Promise<Widget[]> {
    return [...this.widgets.values()].filter((w) => w.dashboardId() === dashboardId)
  }

  async get(id: string): Promise<Widget> {
    const widget = this.widgets.get(id)
    if (!widget) {
      throw new WidgetNotFoundError(id)
    }
    return widget
  }

  async save(widget: Widget): Promise<void> {
    this.saved.push(widget)
    this.widgets.set(widget.id(), widget)
  }
}
