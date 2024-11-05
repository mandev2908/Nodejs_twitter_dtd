import { ObjectId } from 'mongodb'

interface RefreshTokenType {
  _id?: ObjectId
  refresh_token: string
  created_at?: Date
  user_id: ObjectId
}

export default class RefreshToken {
  _id?: ObjectId
  refresh_token: string
  created_at?: Date
  user_id: ObjectId
  constructor({ _id, refresh_token, created_at, user_id }: RefreshTokenType) {
    this._id = _id
    this.refresh_token = refresh_token
    this.created_at = created_at || new Date()
    this.user_id = user_id
  }
}
