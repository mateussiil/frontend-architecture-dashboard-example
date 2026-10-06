import { describe, expect, it } from 'vitest'
import { InvalidWidgetSizeError } from '../domain/Widget'
import { FakeWidgetRepository } from '../testing/FakeWidgetRepository'
import { aKpiWidget, aLineChartWidget } from '../testing/fixtures'
import { ResizeWidgetUseCase } from './ResizeWidgetUseCase'
import { WidgetNotFoundError } from './WidgetRepository'

describe('ResizeWidgetUseCase', () => {
  it('redimensiona o widget e persiste', async () => {
    const repository = new FakeWidgetRepository([aLineChartWidget()])
    const resizeWidget = new ResizeWidgetUseCase(repository)

    const result = await resizeWidget.execute({ widgetId: 'evolucao', size: { columns: 3, rows: 2 } })

    expect(result.size()).toEqual({ columns: 3, rows: 2 })
    expect(repository.saved).toEqual([result])
  })

  it('não persiste nada quando o domínio recusa o tamanho', async () => {
    const repository = new FakeWidgetRepository([aKpiWidget()])
    const resizeWidget = new ResizeWidgetUseCase(repository)

    await expect(resizeWidget.execute({ widgetId: 'receita', size: { columns: 3, rows: 1 } })).rejects.toThrow(
      InvalidWidgetSizeError,
    )
    expect(repository.saved).toHaveLength(0)
  })

  it('propaga quando o widget não existe', async () => {
    const resizeWidget = new ResizeWidgetUseCase(new FakeWidgetRepository())

    await expect(resizeWidget.execute({ widgetId: 'x', size: { columns: 1, rows: 1 } })).rejects.toThrow(
      WidgetNotFoundError,
    )
  })
})
