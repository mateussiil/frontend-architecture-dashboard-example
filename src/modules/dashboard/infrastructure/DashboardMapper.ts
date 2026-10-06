import { Dashboard } from '../domain/Dashboard'
import { Widget, type WidgetType } from '../domain/Widget'

// Formato que trafega na API / fica salvo no storage. O domínio não conhece este formato.
export interface DashboardDTO {
  id: string
  name: string
  widgets: {
    id: string
    title: string
    type: WidgetType
    width: number
    height: number
  }[]
}

export const DashboardMapper = {
  toDomain(dto: DashboardDTO): Dashboard {
    return Dashboard.create({
      id: dto.id,
      name: dto.name,
      widgets: dto.widgets.map((w) =>
        Widget.create({
          id: w.id,
          title: w.title,
          type: w.type,
          size: { columns: w.width, rows: w.height },
        }),
      ),
    })
  },

  toDTO(dashboard: Dashboard): DashboardDTO {
    return {
      id: dashboard.id(),
      name: dashboard.name(),
      widgets: dashboard.widgets().map((w) => ({
        id: w.id(),
        title: w.title(),
        type: w.type(),
        width: w.size().columns,
        height: w.size().rows,
      })),
    }
  },
}
