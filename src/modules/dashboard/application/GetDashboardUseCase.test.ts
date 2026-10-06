import { describe, expect, it } from 'vitest'
import { FakeDashboardRepository } from '../testing/FakeDashboardRepository'
import { aDashboard } from '../testing/fixtures'
import { DashboardNotFoundError } from './DashboardRepository'
import { GetDashboardUseCase } from './GetDashboardUseCase'

describe('GetDashboardUseCase', () => {
  it('devolve o dashboard pedido', async () => {
    const getDashboard = new GetDashboardUseCase(new FakeDashboardRepository([aDashboard()]))

    expect((await getDashboard.execute('vendas')).name()).toBe('Vendas')
  })

  it('propaga quando o dashboard não existe', async () => {
    await expect(new GetDashboardUseCase(new FakeDashboardRepository()).execute('x')).rejects.toThrow(
      DashboardNotFoundError,
    )
  })
})
