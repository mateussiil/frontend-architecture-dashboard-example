import { Widget, type WidgetType } from '../domain/Widget'

// Formato que trafega na API / fica salvo no storage. O domínio não conhece este formato.
export interface WidgetDTO {
  id: string
  dashboardId: string
  title: string
  type: WidgetType
  width: number
  height: number
}

export const WidgetMapper = {
  toDomain(dto: WidgetDTO): Widget {
    return Widget.create({
      id: dto.id,
      dashboardId: dto.dashboardId,
      title: dto.title,
      type: dto.type,
      size: { columns: dto.width, rows: dto.height },
    })
  },

  toDTO(widget: Widget): WidgetDTO {
    return {
      id: widget.id(),
      dashboardId: widget.dashboardId(),
      title: widget.title(),
      type: widget.type(),
      width: widget.size().columns,
      height: widget.size().rows,
    }
  },
}
