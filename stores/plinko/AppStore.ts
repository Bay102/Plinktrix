import { action, autorun, makeAutoObservable } from 'mobx'

import log from '@/logger'
import { getLeaderboard } from '@/supabase/api/leaderboard'
import { Leaderboard } from '@/supabase/types'

import { PlinkoStore } from './PlinkoStore'

export class AppStore {
 plinkoStore: PlinkoStore = new PlinkoStore()
 leaderboard: Leaderboard = []

 constructor() {
  makeAutoObservable(this)

  autorun(async () => {
   await this.fetchLeaderboard()
  })
 }

 async fetchLeaderboard() {
  try {
   const leaderboard = await getLeaderboard()
   this.updateLeaderboard(leaderboard)
  } catch (error) {
   log.error(error)
  }
 }

 @action
 updateLeaderboard(leaderboard: Leaderboard) {
  this.leaderboard = leaderboard
 }
}
