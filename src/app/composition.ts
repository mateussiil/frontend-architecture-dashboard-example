import type { DashboardRepository } from '../modules/dashboard/application/DashboardRepository'
import { GetDashboardUseCase } from '../modules/dashboard/application/GetDashboardUseCase'
import { ResizeWidgetUseCase } from '../modules/dashboard/application/ResizeWidgetUseCase'
import { HttpDashboardRepository } from '../modules/dashboard/infrastructure/HttpDashboardRepository'
import { LocalStorageDashboardRepository } from '../modules/dashboard/infrastructure/LocalStorageDashboardRepository'
import { seedDashboards } from '../modules/dashboard/infrastructure/seed'

// Ponto de composição: o único lugar que sabe quais implementações concretas são usadas.
// Sem container de DI — as dependências são passadas explicitamente pelo construtor.
export function composeApp() {
  const apiUrl = import.meta.env.VITE_API_URL as string | undefined

  const dashboardRepository: DashboardRepository = apiUrl
    ? new HttpDashboardRepository(apiUrl)
    : new LocalStorageDashboardRepository(window.localStorage, seedDashboards)

  return {
    getDashboard: new GetDashboardUseCase(dashboardRepository),
    resizeWidget: new ResizeWidgetUseCase(dashboardRepository),
  }
}
