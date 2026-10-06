export interface DashboardProps {
  id: string
  name: string
}

// O Dashboard não conhece os widgets: cada um é um bounded context.
// Quem junta os dois na mesma tela é o ponto de entrada (ui/DashboardPage).
export class Dashboard {
  private constructor(private readonly props: DashboardProps) {}

  static create(props: DashboardProps): Dashboard {
    const name = props.name.trim()
    if (!name) {
      throw new Error('Um dashboard precisa de nome.')
    }
    return new Dashboard({ ...props, name })
  }

  id(): string {
    return this.props.id
  }

  name(): string {
    return this.props.name
  }

  shareUrl(baseUrl: string): string {
    return `${baseUrl.replace(/\/$/, '')}/share/dashboards/${encodeURIComponent(this.props.id)}`
  }
}
