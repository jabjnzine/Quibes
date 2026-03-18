export enum MemberTier {
  BRONZE = 'bronze',
  SILVER = 'silver',
  GOLD = 'gold',
  PLATINUM = 'platinum',
}

export interface Member {
  id: string
  patientId: string
  tier: MemberTier
  points: number
  joinedAt: string
  expiresAt?: string
}
