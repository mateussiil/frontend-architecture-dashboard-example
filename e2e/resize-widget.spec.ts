import { expect, test } from '@playwright/test'

test('redimensionar um widget persiste após recarregar a página', async ({ page }) => {
  await page.goto('/')

  const chart = page.getByRole('article', { name: 'Evolução diária' })
  await expect(chart.getByText('2 × 2')).toBeVisible()

  await chart.getByRole('button', { name: 'Mais largo' }).click()
  await expect(chart.getByText('3 × 2')).toBeVisible()

  await page.reload()
  await expect(page.getByRole('article', { name: 'Evolução diária' }).getByText('3 × 2')).toBeVisible()
})
