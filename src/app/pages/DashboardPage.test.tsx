import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it } from 'vitest'
import { GetDashboardUseCase } from '../../modules/dashboard/application/GetDashboardUseCase'
import { FakeDashboardRepository } from '../../modules/dashboard/testing/FakeDashboardRepository'
import { aDashboard } from '../../modules/dashboard/testing/fixtures'
import { ListDashboardWidgetsUseCase } from '../../modules/widget/application/ListDashboardWidgetsUseCase'
import { ResizeWidgetUseCase } from '../../modules/widget/application/ResizeWidgetUseCase'
import { FakeWidgetRepository } from '../../modules/widget/testing/FakeWidgetRepository'
import { aKpiWidget, aLineChartWidget } from '../../modules/widget/testing/fixtures'
import { DashboardPage } from './DashboardPage'

// O ponto de entrada é testado com os casos de uso reais e repositórios falsos:
// sem HTTP, sem backend.
function renderPage() {
  const widgets = new FakeWidgetRepository([aKpiWidget(), aLineChartWidget()])
  render(
    <DashboardPage
      dashboardId="vendas"
      shareBaseUrl="https://app"
      getDashboard={new GetDashboardUseCase(new FakeDashboardRepository([aDashboard()]))}
      listWidgets={new ListDashboardWidgetsUseCase(widgets)}
      resizeWidget={new ResizeWidgetUseCase(widgets)}
    />,
  )
  return { widgets }
}

describe('DashboardPage', () => {
  it('junta o dashboard e seus widgets na mesma tela', async () => {
    renderPage()

    expect(await screen.findByRole('heading', { name: 'Vendas' })).toBeTruthy()
    expect(screen.getAllByRole('article')).toHaveLength(2)
  })

  it('redimensiona um widget e persiste pelo caso de uso', async () => {
    const { widgets } = renderPage()

    const chart = within(await screen.findByRole('article', { name: 'Evolução diária' }))
    await userEvent.click(chart.getByRole('button', { name: 'Mais largo' }))

    expect(await chart.findByText('3 × 2')).toBeTruthy()
    expect((await widgets.get('evolucao')).size()).toEqual({ columns: 3, rows: 2 })
  })

  it('mostra o erro quando o dashboard não existe', async () => {
    render(
      <DashboardPage
        dashboardId="x"
        shareBaseUrl="https://app"
        getDashboard={new GetDashboardUseCase(new FakeDashboardRepository())}
        listWidgets={new ListDashboardWidgetsUseCase(new FakeWidgetRepository())}
        resizeWidget={new ResizeWidgetUseCase(new FakeWidgetRepository())}
      />,
    )

    expect((await screen.findByRole('alert')).textContent).toContain('Dashboard "x" não encontrado.')
  })
})
