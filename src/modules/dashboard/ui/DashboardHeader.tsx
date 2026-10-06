import type { Dashboard } from '../domain/Dashboard'

interface Props {
  dashboard: Dashboard
  shareBaseUrl: string
}

export function DashboardHeader({ dashboard, shareBaseUrl }: Props) {
  return (
    <header className="page-header">
      <h1>{dashboard.name()}</h1>
      <a href={dashboard.shareUrl(shareBaseUrl)}>Link de compartilhamento</a>
    </header>
  )
}
