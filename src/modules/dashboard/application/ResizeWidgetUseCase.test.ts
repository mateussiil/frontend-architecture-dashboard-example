import { describe, expect, it } from 'vitest'
import { InvalidWidgetSizeError } from '../domain/Widget'
import { FakeDashboardRepository } from '../testing/FakeDashboardRepository'
import { aDashboard } from '../testing/fixtures'
import { DashboardNotFoundError } from './DashboardRepository'
import { ResizeWidgetUseCase } from './ResizeWidgetUseCase'

describe('ResizeWidgetUseCase', () => {
  it('redimensiona o widget e persiste o dashboard', async () => {
    const repository = new FakeDashboardRepository([aDashboard()])
    const resizeWidget = new ResizeWidgetUseCase(repository)

    const result = await resizeWidget.execute({
      dashboardId: 'vendas',
      widgetId: 'evolucao',
      size: { columns: 3, rows: 2 },
    })

    expect(result.widget('evolucao').size()).toEqual({ columns: 3, rows: 2 })
    expect(repository.saved).toEqual([result])
  })

  it('não persiste nada quando o domínio recusa o tamanho', async () => {
    const repository = new FakeDashboardRepository([aDashboard()])
    const resizeWidget = new ResizeWidgetUseCase(repository)

    await expect(
      resizeWidget.execute({ dashboardId: 'vendas', widgetId: 'receita', size: { columns: 3, rows: 1 } }),
    ).rejects.toThrow(InvalidWidgetSizeError)
    expect(repository.saved).toHaveLength(0)
  })

  it('propaga quando o dashboard não existe', async () => {
    const resizeWidget = new ResizeWidgetUseCase(new FakeDashboardRepository())

    await expect(
      resizeWidget.execute({ dashboardId: 'x', widgetId: 'y', size: { columns: 1, rows: 1 } }),
    ).rejects.toThrow(DashboardNotFoundError)
  })
})
