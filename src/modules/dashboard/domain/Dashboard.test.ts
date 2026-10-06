import { describe, expect, it } from 'vitest'
import { aDashboard } from '../testing/fixtures'
import { Dashboard } from './Dashboard'

describe('Dashboard', () => {
  it('sabe montar sua URL de compartilhamento', () => {
    expect(aDashboard().shareUrl('https://app.exemplo.com/')).toBe('https://app.exemplo.com/share/dashboards/vendas')
  })

  it('não pode ser criado sem nome', () => {
    expect(() => Dashboard.create({ id: 'x', name: '   ' })).toThrow()
  })
})
