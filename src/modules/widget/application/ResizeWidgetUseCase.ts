import type { Widget, WidgetSize } from '../domain/Widget'
import type { WidgetRepository } from './WidgetRepository'

export interface ResizeWidgetInput {
  widgetId: string
  size: WidgetSize
}

// O caso de uso conhece o fluxo: buscar, aplicar a regra do domínio, persistir, devolver.
// Quem decide se o tamanho é válido é o Widget.
export class ResizeWidgetUseCase {
  constructor(private readonly widgets: WidgetRepository) {}

  async execute({ widgetId, size }: ResizeWidgetInput): Promise<Widget> {
    const widget = await this.widgets.get(widgetId)
    const resized = widget.resize(size)
    await this.widgets.save(resized)
    return resized
  }
}
