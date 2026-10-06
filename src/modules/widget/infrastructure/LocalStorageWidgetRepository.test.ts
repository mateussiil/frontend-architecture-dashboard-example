import { beforeEach, describe, expect, it } from 'vitest'
import { WidgetNotFoundError } from '../application/WidgetRepository'
import { LocalStorageWidgetRepository } from './LocalStorageWidgetRepository'
import { seedWidgets } from './seed'

describe('LocalStorageWidgetRepository', () => {
  beforeEach(() => localStorage.clear())

  it('usa o seed quando nada foi salvo e persiste alterações', async () => {
    const repository = new LocalStorageWidgetRepository(localStorage, seedWidgets)

    const widget = await repository.get('receita')
    await repository.save(widget.resize({ columns: 2, rows: 1 }))

    const reloaded = new LocalStorageWidgetRepository(localStorage, seedWidgets)
    expect((await reloaded.get('receita')).size()).toEqual({ columns: 2, rows: 1 })
    expect(await reloaded.listByDashboard('vendas')).toHaveLength(seedWidgets.length)
  })

  it('lista apenas os widgets do dashboard pedido', async () => {
    const repository = new LocalStorageWidgetRepository(localStorage, seedWidgets)

    expect(await repository.listByDashboard('outro')).toEqual([])
  })

  it('falha quando o widget não existe', async () => {
    await expect(new LocalStorageWidgetRepository(localStorage).get('x')).rejects.toThrow(WidgetNotFoundError)
  })
})
