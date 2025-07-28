import type { EmotionTheme } from '@/constants/Theme'

import '@emotion/react'

declare module '@emotion/react' {
 export interface Theme extends EmotionTheme {}
}
