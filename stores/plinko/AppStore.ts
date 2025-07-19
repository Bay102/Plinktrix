import { makeAutoObservable } from 'mobx'

import { PlinkoStore } from './PlinkoStore'

export class AppStore {
 plinkoStore: PlinkoStore = new PlinkoStore()

 constructor() {
  makeAutoObservable(this)
 }
}
