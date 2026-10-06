import type { Dashboard } from '../domain/Dashboard'
import type { WidgetSize } from '../domain/Widget'
import { WidgetCard } from './WidgetCard'

interface Props {
  dashboard: Dashboard
  shareBaseUrl: string
  error?: string | null
  onResizeWidget: (widgetId: string, size: WidgetSize) => void
}

// Componente de apresentação: recebe o que precisa e apresenta.
// Não sabe de onde o dashboard veio nem como ele é salvo.
export function DashboardView({ dashboard, shareBaseUrl, error, onResizeWidget }: Props) {
  return (
    <main>
      <header className="page-header">
        <h1>{dashboard.name()}</h1>
        <a href={dashboard.shareUrl(shareBaseUrl)}>Link de compartilhamento</a>
      </header>
      {error && <p role="alert">{error}</p>}
      <section className="grid">
        {dashboard.widgets().map((widget) => (
          <WidgetCard key={widget.id()} widget={widget} onResize={(size) => onResizeWidget(widget.id(), size)} />
        ))}
      </section>
    </main>
  )
}
