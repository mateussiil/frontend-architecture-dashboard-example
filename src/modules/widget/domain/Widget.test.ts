import { describe, expect, it } from 'vitest'
import { aKpiWidget } from '../testing/fixtures'
import { InvalidWidgetSizeError, Widget } from './Widget'

describe('Widget', () => {
  it('não pode ser criado com um tamanho inválido para o seu tipo', () => {
    expect(() =>
      Widget.create({ id: 'x', dashboardId: 'd', title: 'X', type: 'line-chart', size: { columns: 1, rows: 1 } }),
    ).toThrow(InvalidWidgetSizeError)
  })

  it('redimensiona dentro dos limites devolvendo um novo widget', () => {
    const widget = aKpiWidget()
    const resized = widget.resize({ columns: 2, rows: 1 })

    expect(resized.size()).toEqual({ columns: 2, rows: 1 })
    expect(widget.size()).toEqual({ columns: 1, rows: 1 })
  })

  it('recusa redimensionamento fora dos limites do tipo', () => {
    const widget = aKpiWidget()

    expect(widget.canResizeTo({ columns: 3, rows: 1 })).toBe(false)
    expect(widget.canResizeTo({ columns: 1, rows: 2 })).toBe(false)
    expect(() => widget.resize({ columns: 3, rows: 1 })).toThrow(InvalidWidgetSizeError)
  })

  it('sabe o nome do arquivo CSV a partir do título', () => {
    expect(aKpiWidget().csvFileName()).toBe('receita-do-mes.csv')
  })

  it('sabe descrever sua visualização', () => {
    expect(aKpiWidget().visualization()).toBe('Indicador')
  })
})
