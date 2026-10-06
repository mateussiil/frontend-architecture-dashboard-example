import { Dashboard } from '../domain/Dashboard'

export interface DashboardDTO {
  id: string
  name: string
}

export const DashboardMapper = {
  toDomain(dto: DashboardDTO): Dashboard {
    return Dashboard.create({ id: dto.id, name: dto.name })
  },
}
