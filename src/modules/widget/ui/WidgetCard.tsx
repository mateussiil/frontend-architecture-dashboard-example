import type { Widget, WidgetSize } from '../domain/Widget'

interface Props {
  widget: Widget
  onResize: (size: WidgetSize) => void
}

export function WidgetCard({ widget, onResize }: Props) {
  const size = widget.size()
  const resizes: { label: string; size: WidgetSize }[] = [
    { label: 'Mais estreito', size: { ...size, columns: size.columns - 1 } },
    { label: 'Mais largo', size: { ...size, columns: size.columns + 1 } },
    { label: 'Mais baixo', size: { ...size, rows: size.rows - 1 } },
    { label: 'Mais alto', size: { ...size, rows: size.rows + 1 } },
  ]

  return (
    <article
      className="widget"
      aria-label={widget.title()}
      style={{ gridColumn: `span ${size.columns}`, gridRow: `span ${size.rows}` }}
    >
      <header>
        <h2>{widget.title()}</h2>
        <span className="tag">{widget.visualization()}</span>
      </header>
      <p className="size">
        {size.columns} × {size.rows}
      </p>
      <p className="muted">CSV: {widget.csvFileName()}</p>
      <div className="actions">
        {resizes.map(({ label, size }) => (
          <button key={label} disabled={!widget.canResizeTo(size)} onClick={() => onResize(size)}>
            {label}
          </button>
        ))}
      </div>
    </article>
  )
}
