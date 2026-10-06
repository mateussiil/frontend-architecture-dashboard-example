import type { Dashboard } from '../domain/Dashboard'

export interface DashboardRepository {
  get(id: string): Promise<Dashboard>
}

export class DashboardNotFoundError extends Error {
  constructor(id: string) {
    super(`Dashboard "${id}" não encontrado.`)
    this.name = 'DashboardNotFoundError'
  }
}
