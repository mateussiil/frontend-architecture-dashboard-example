import type { Dashboard } from '../domain/Dashboard'

// A camada de aplicação depende desta abstração, nunca de fetch, Axios ou localStorage.
export interface DashboardRepository {
  get(id: string): Promise<Dashboard>
  save(dashboard: Dashboard): Promise<void>
}

export class DashboardNotFoundError extends Error {
  constructor(id: string) {
    super(`Dashboard "${id}" não encontrado.`)
    this.name = 'DashboardNotFoundError'
  }
}
