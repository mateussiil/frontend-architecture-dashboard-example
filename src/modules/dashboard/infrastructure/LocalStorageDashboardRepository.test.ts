import { beforeEach, describe, expect, it } from 'vitest'
import { DashboardNotFoundError } from '../application/DashboardRepository'
import { LocalStorageDashboardRepository } from './LocalStorageDashboardRepository'
import { seedDashboards } from './seed'

describe('LocalStorageDashboardRepository', () => {
  beforeEach(() => localStorage.clear())

  it('usa o seed quando nada foi salvo e persiste alterações', async () => {
    const repository = new LocalStorageDashboardRepository(localStorage, seedDashboards)

    const dashboard = await repository.get('vendas')
    await repository.save(dashboard.resizeWidget('receita', { columns: 2, rows: 1 }))

    const reloaded = await new LocalStorageDashboardRepository(localStorage, seedDashboards).get('vendas')
    expect(reloaded.widget('receita').size()).toEqual({ columns: 2, rows: 1 })
  })

  it('falha quando o dashboard não existe', async () => {
    await expect(new LocalStorageDashboardRepository(localStorage).get('x')).rejects.toThrow(DashboardNotFoundError)
  })
})
