import type { DashboardRepository } from '../modules/dashboard/application/DashboardRepository'
import { GetDashboardUseCase } from '../modules/dashboard/application/GetDashboardUseCase'
import { HttpDashboardRepository } from '../modules/dashboard/infrastructure/HttpDashboardRepository'
import { InMemoryDashboardRepository } from '../modules/dashboard/infrastructure/InMemoryDashboardRepository'
import { seedDashboards } from '../modules/dashboard/infrastructure/seed'
import { ListDashboardWidgetsUseCase } from '../modules/widget/application/ListDashboardWidgetsUseCase'
import { ResizeWidgetUseCase } from '../modules/widget/application/ResizeWidgetUseCase'
import type { WidgetRepository } from '../modules/widget/application/WidgetRepository'
import { HttpWidgetRepository } from '../modules/widget/infrastructure/HttpWidgetRepository'
import { LocalStorageWidgetRepository } from '../modules/widget/infrastructure/LocalStorageWidgetRepository'
import { seedWidgets } from '../modules/widget/infrastructure/seed'

// Ponto de composição: o único lugar que sabe quais implementações concretas são usadas.
// Sem container de DI — as dependências são passadas explicitamente pelo construtor.
export function composeApp() {
  const apiUrl = import.meta.env.VITE_API_URL as string | undefined

  const dashboardRepository: DashboardRepository = apiUrl
    ? new HttpDashboardRepository(apiUrl)
    : new InMemoryDashboardRepository(seedDashboards)

  const widgetRepository: WidgetRepository = apiUrl
    ? new HttpWidgetRepository(apiUrl)
    : new LocalStorageWidgetRepository(window.localStorage, seedWidgets)

  return {
    getDashboard: new GetDashboardUseCase(dashboardRepository),
    listWidgets: new ListDashboardWidgetsUseCase(widgetRepository),
    resizeWidget: new ResizeWidgetUseCase(widgetRepository),
  }
}
