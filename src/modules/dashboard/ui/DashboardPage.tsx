import { useEffect, useState } from 'react'
import type { GetDashboardUseCase } from '../application/GetDashboardUseCase'
import type { Dashboard } from '../domain/Dashboard'
import { DashboardHeader } from './DashboardHeader'
import type { ListDashboardWidgetsUseCase } from '../../widget/application/ListDashboardWidgetsUseCase'
import type { ResizeWidgetUseCase } from '../../widget/application/ResizeWidgetUseCase'
import type { Widget, WidgetSize } from '../../widget/domain/Widget'
import { WidgetGrid } from '../../widget/ui/WidgetGrid'

interface Props {
  dashboardId: string
  shareBaseUrl: string
  getDashboard: GetDashboardUseCase
  listWidgets: ListDashboardWidgetsUseCase
  resizeWidget: ResizeWidgetUseCase
}

// Ponto de entrada da tela. A tela do dashboard mostra os widgets dele,
// então o módulo dashboard usa o módulo widget (nunca o contrário).
// Ela coordena o fluxo chamando os casos de uso e entrega a cada
// componente de apresentação exatamente o que ele precisa.
export function DashboardPage({ dashboardId, shareBaseUrl, getDashboard, listWidgets, resizeWidget }: Props) {
  const [dashboard, setDashboard] = useState<Dashboard | null>(null)
  const [widgets, setWidgets] = useState<Widget[]>([])
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    Promise.all([getDashboard.execute(dashboardId), listWidgets.execute(dashboardId)])
      .then(([d, w]) => {
        if (!active) return
        setDashboard(d)
        setWidgets(w)
      })
      .catch((e: Error) => active && setError(e.message))
    return () => {
      active = false
    }
  }, [dashboardId, getDashboard, listWidgets])

  async function handleResizeWidget(widgetId: string, size: WidgetSize) {
    try {
      const resized = await resizeWidget.execute({ widgetId, size })
      setWidgets((current) => current.map((w) => (w.id() === resized.id() ? resized : w)))
      setError(null)
    } catch (e) {
      setError((e as Error).message)
    }
  }

  if (!dashboard) {
    return <p role={error ? 'alert' : 'status'}>{error ?? 'Carregando…'}</p>
  }

  return (
    <main>
      <DashboardHeader dashboard={dashboard} shareBaseUrl={shareBaseUrl} />
      {error && <p role="alert">{error}</p>}
      <WidgetGrid widgets={widgets} onResizeWidget={handleResizeWidget} />
    </main>
  )
}
