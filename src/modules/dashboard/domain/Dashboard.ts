import type { Widget, WidgetSize } from './Widget'

export class WidgetNotFoundError extends Error {
  constructor(widgetId: string) {
    super(`Widget "${widgetId}" não existe neste dashboard.`)
    this.name = 'WidgetNotFoundError'
  }
}

export interface DashboardProps {
  id: string
  name: string
  widgets: Widget[]
}

export class Dashboard {
  private constructor(private readonly props: DashboardProps) {}

  static create(props: DashboardProps): Dashboard {
    return new Dashboard({ ...props, widgets: [...props.widgets] })
  }

  id(): string {
    return this.props.id
  }

  name(): string {
    return this.props.name
  }

  widgets(): Widget[] {
    return [...this.props.widgets]
  }

  widget(widgetId: string): Widget {
    const widget = this.props.widgets.find((w) => w.id() === widgetId)
    if (!widget) {
      throw new WidgetNotFoundError(widgetId)
    }
    return widget
  }

  resizeWidget(widgetId: string, size: WidgetSize): Dashboard {
    const resized = this.widget(widgetId).resize(size)
    return Dashboard.create({
      ...this.props,
      widgets: this.props.widgets.map((w) => (w.id() === widgetId ? resized : w)),
    })
  }

  shareUrl(baseUrl: string): string {
    return `${baseUrl.replace(/\/$/, '')}/share/dashboards/${encodeURIComponent(this.props.id)}`
  }
}
