import { render, screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { describe, expect, it, vi } from 'vitest'
import { aDashboard } from '../testing/fixtures'
import { DashboardView } from './DashboardView'

describe('DashboardView', () => {
  it('apresenta os widgets e emite a intenção de redimensionar', async () => {
    const onResizeWidget = vi.fn()
    render(<DashboardView dashboard={aDashboard()} shareBaseUrl="https://app" onResizeWidget={onResizeWidget} />)

    const chart = within(screen.getByRole('article', { name: 'Evolução diária' }))
    await userEvent.click(chart.getByRole('button', { name: 'Mais largo' }))

    expect(onResizeWidget).toHaveBeenCalledWith('evolucao', { columns: 3, rows: 2 })
  })

  it('desabilita os redimensionamentos que o domínio não permite', () => {
    render(<DashboardView dashboard={aDashboard()} shareBaseUrl="https://app" onResizeWidget={() => {}} />)

    const kpi = within(screen.getByRole('article', { name: 'Receita do mês' }))
    expect(kpi.getByRole<HTMLButtonElement>('button', { name: 'Mais alto' }).disabled).toBe(true)
    expect(kpi.getByRole<HTMLButtonElement>('button', { name: 'Mais largo' }).disabled).toBe(false)
  })
})
