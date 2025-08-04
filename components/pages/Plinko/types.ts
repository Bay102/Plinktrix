// --- Type Definitions ---
export interface Position {
 x: number
 y: number
}

export interface BallType extends Position {
 id: number
 vx: number
 vy: number
 isGold: boolean
 stuckCounter: number
 lastX: number
 lastY: number
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

// --- New State Management Types ---
export interface GameState {
 isDropping: boolean
 totalPrize: number
 currentGravity: number
 isAnalyzing: boolean
 aiAnalysis: string
 gameEndedWithPrize: number | null
 ballsUsedInGame: BallCounts | null
}

export interface BallCounts {
 regular: number
 gold: number
}

export interface LoadingState {
 isLoadingStats: boolean
 isUpdatingStats: boolean
}

// --- Helper Component Props ---
export interface PrizeSlotProps {
 value: number
 animationType: AnimationType
}

export interface BallProps {
 position: { x: number; y: number }
 isGold: boolean
}

export interface PegGridProps {
 pegs: PegType[][]
}

export interface BallLayerProps {
 balls: BallType[]
}

export interface PrizeSlotLayerProps {
 prizeValues: number[]
 animatingSlots: AnimatingSlots
}
