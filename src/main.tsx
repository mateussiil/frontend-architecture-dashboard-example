import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { composeApp } from './app/composition'
import { DashboardPage } from './app/pages/DashboardPage'
import './styles.css'

const app = composeApp()

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <DashboardPage
      dashboardId="vendas"
      shareBaseUrl={window.location.origin}
      getDashboard={app.getDashboard}
      listWidgets={app.listWidgets}
      resizeWidget={app.resizeWidget}
    />
  </StrictMode>,
)
