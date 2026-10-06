import { describe, expect, it } from 'vitest'
import { aDashboard } from '../testing/fixtures'
import { WidgetNotFoundError } from './Dashboard'

describe('Dashboard', () => {
  it('redimensiona um widget sem alterar o dashboard original', () => {
    const dashboard = aDashboard()
    const updated = dashboard.resizeWidget('evolucao', { columns: 4, rows: 3 })

    expect(updated.widget('evolucao').size()).toEqual({ columns: 4, rows: 3 })
    expect(dashboard.widget('evolucao').size()).toEqual({ columns: 2, rows: 2 })
  })

  it('falha ao redimensionar um widget que não existe', () => {
    expect(() => aDashboard().resizeWidget('nao-existe', { columns: 1, rows: 1 })).toThrow(WidgetNotFoundError)
  })

  it('sabe montar sua URL de compartilhamento', () => {
    expect(aDashboard().shareUrl('https://app.exemplo.com/')).toBe('https://app.exemplo.com/share/dashboards/vendas')
  })
})
