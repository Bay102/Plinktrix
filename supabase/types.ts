import { Database } from './supa-schema'

export type UserData = Database['public']['Tables']['user_data']['Row']
export type Leaderboard = {
 id: string
 username: string
 bytes_downloaded: number
 packets_dropped: number
}[]
