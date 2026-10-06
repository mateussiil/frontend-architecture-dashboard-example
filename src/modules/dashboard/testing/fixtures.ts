import { Dashboard } from '../domain/Dashboard'

export function aDashboard(): Dashboard {
  return Dashboard.create({ id: 'vendas', name: 'Vendas' })
}
