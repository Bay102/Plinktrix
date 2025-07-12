// types.ts

export interface Position {
 x: number
 y: number
}

export interface BallType extends Position {
 id: number
 vx: number
 vy: number
 isGold: boolean
}

export interface PegType extends Position {}

export interface PrizeCount {
 regular: number
 gold: number
}

export type PrizeCounts = {
 [key: string]: PrizeCount
}

export type AnimationType = 'win' | 'lose' | 'gold' | null

export type AnimatingSlots = {
 [key: number]: AnimationType
}
