import { useEffect, useState } from 'react'
import type { GetDashboardUseCase } from '../application/GetDashboardUseCase'
import type { ResizeWidgetUseCase } from '../application/ResizeWidgetUseCase'
import type { Dashboard } from '../domain/Dashboard'
import type { WidgetSize } from '../domain/Widget'
import { DashboardView } from './DashboardView'

interface Props {
  dashboardId: string
  shareBaseUrl: string
  getDashboard: GetDashboardUseCase
  resizeWidget: ResizeWidgetUseCase
}

// Ponto de entrada da tela: coordena o fluxo chamando os casos de uso
// e entrega ao componente de apresentação exatamente o que ele precisa.
export function DashboardPage({ dashboardId, shareBaseUrl, getDashboard, resizeWidget }: Props) {
  const [dashboard, setDashboard] = useState<Dashboard | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    getDashboard
      .execute(dashboardId)
      .then((d) => active && setDashboard(d))
      .catch((e: Error) => active && setError(e.message))
    return () => {
      active = false
    }
  }, [dashboardId, getDashboard])

  async function handleResizeWidget(widgetId: string, size: WidgetSize) {
    try {
      setDashboard(await resizeWidget.execute({ dashboardId, widgetId, size }))
      setError(null)
    } catch (e) {
      setError((e as Error).message)
    }
  }

  if (!dashboard) {
    return <p role={error ? 'alert' : 'status'}>{error ?? 'Carregando…'}</p>
  }

  return (
    <DashboardView
      dashboard={dashboard}
      shareBaseUrl={shareBaseUrl}
      error={error}
      onResizeWidget={handleResizeWidget}
    />
  )
}
