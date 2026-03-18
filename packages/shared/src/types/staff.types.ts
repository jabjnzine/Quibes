import { Role } from '../enums/role.enum'

export interface Staff {
  id: string
  firstName: string
  lastName: string
  email: string
  role: Role
  isActive: boolean
  createdAt: string
}
