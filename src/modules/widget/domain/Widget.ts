export type WidgetType = 'kpi' | 'line-chart' | 'table'

export interface WidgetSize {
  columns: number
  rows: number
}

interface SizeLimits {
  min: WidgetSize
  max: WidgetSize
}

// Cada tipo de visualização tem os tamanhos que fazem sentido para ela.
// Essa é uma regra de negócio: mora no domínio, não no componente.
const SIZE_LIMITS: Record<WidgetType, SizeLimits> = {
  kpi: { min: { columns: 1, rows: 1 }, max: { columns: 2, rows: 1 } },
  'line-chart': { min: { columns: 2, rows: 2 }, max: { columns: 4, rows: 3 } },
  table: { min: { columns: 2, rows: 2 }, max: { columns: 4, rows: 4 } },
}

const VISUALIZATION_LABELS: Record<WidgetType, string> = {
  kpi: 'Indicador',
  'line-chart': 'Gráfico de linha',
  table: 'Tabela',
}

export class InvalidWidgetSizeError extends Error {
  constructor(type: WidgetType, size: WidgetSize) {
    super(`Tamanho ${size.columns}x${size.rows} não é válido para um widget do tipo "${type}".`)
    this.name = 'InvalidWidgetSizeError'
  }
}

export interface WidgetProps {
  id: string
  dashboardId: string
  title: string
  type: WidgetType
  size: WidgetSize
}

export class Widget {
  private constructor(private readonly props: WidgetProps) {}

  static create(props: WidgetProps): Widget {
    if (!fits(props.type, props.size)) {
      throw new InvalidWidgetSizeError(props.type, props.size)
    }
    return new Widget({ ...props, size: { ...props.size } })
  }

  id(): string {
    return this.props.id
  }

  dashboardId(): string {
    return this.props.dashboardId
  }

  title(): string {
    return this.props.title
  }

  type(): WidgetType {
    return this.props.type
  }

  size(): WidgetSize {
    return { ...this.props.size }
  }

  visualization(): string {
    return VISUALIZATION_LABELS[this.props.type]
  }

  csvFileName(): string {
    const slug = this.props.title
      .normalize('NFD')
      .replace(/[̀-ͯ]/g, '')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-|-$/g, '')
    return `${slug || this.props.id}.csv`
  }

  canResizeTo(size: WidgetSize): boolean {
    return fits(this.props.type, size)
  }

  resize(size: WidgetSize): Widget {
    return Widget.create({ ...this.props, size })
  }
}

function fits(type: WidgetType, size: WidgetSize): boolean {
  const { min, max } = SIZE_LIMITS[type]
  return (
    Number.isInteger(size.columns) &&
    Number.isInteger(size.rows) &&
    size.columns >= min.columns &&
    size.columns <= max.columns &&
    size.rows >= min.rows &&
    size.rows <= max.rows
  )
}
