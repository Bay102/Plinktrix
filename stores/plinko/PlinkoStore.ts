import { makeAutoObservable } from 'mobx'

export class PlinkoStore {
 constructor() {
  makeAutoObservable(this)
 }
}
