import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { aDashboard } from '../testing/fixtures'
import { DashboardHeader } from './DashboardHeader'

describe('DashboardHeader', () => {
  it('apresenta o nome e o link de compartilhamento', () => {
    render(<DashboardHeader dashboard={aDashboard()} shareBaseUrl="https://app" />)

    expect(screen.getByRole('heading', { name: 'Vendas' })).toBeTruthy()
    expect(screen.getByRole('link', { name: 'Link de compartilhamento' }).getAttribute('href')).toBe(
      'https://app/share/dashboards/vendas',
    )
  })
})
