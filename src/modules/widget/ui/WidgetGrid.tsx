import type { Widget, WidgetSize } from '../domain/Widget'
import { WidgetCard } from './WidgetCard'

interface Props {
  widgets: Widget[]
  onResizeWidget: (widgetId: string, size: WidgetSize) => void
}

// Componente de apresentação: recebe os widgets e a operação de redimensionar.
// Não sabe de onde os widgets vieram nem como são salvos.
export function WidgetGrid({ widgets, onResizeWidget }: Props) {
  return (
    <section className="grid">
      {widgets.map((widget) => (
        <WidgetCard key={widget.id()} widget={widget} onResize={(size) => onResizeWidget(widget.id(), size)} />
      ))}
    </section>
  )
}
