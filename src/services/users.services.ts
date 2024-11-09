import User from '~/models/schemas/Users.schema'
import databaseService from './database.services'
import { RegisterReqBody } from '~/models/requests/User.requests'
import { hashPassword } from '~/ultis/crypto'
import { signToken } from '~/ultis/jwt'
import { TokenTypes } from '~/constants/enums'
import { ObjectId } from 'mongodb'
import { config } from 'dotenv'
// Load environment variables from.env file
config()
class UserService {
  private signAccessToken(user_id: string) {
    return signToken({
      payload: { user_id, token_type: TokenTypes.AccessToken },
      options: { algorithm: 'HS256', expiresIn: process.env.ACCESS_TOKEN_EXPIRATION_TIME as string },
      privateKey: process.env.ACCESS_TOKEN_SECRET as string
    })
  }
  private signRefreshToken(user_id: string) {
    return signToken({
      payload: { user_id, token_type: TokenTypes.RefreshToken },
      options: { algorithm: 'HS256', expiresIn: process.env.REFRESH_TOKEN_EXPIRATION_TIME as string },
      privateKey: process.env.REFRESH_TOKEN_SECRET as string
    })
  }

  private signAccessAndRefreshTokens(user_id: string) {
    return Promise.all([this.signAccessToken(user_id), this.signRefreshToken(user_id)])
  }
  async register(payload: RegisterReqBody) {
    const user = await databaseService.users.insertOne(
      new User({ ...payload, date_of_birth: new Date(payload.date_of_birth), password: hashPassword(payload.password) })
    )
    const user_id = user.insertedId.toString()
    // Tạo accessToken và refreshToken
    const [accessToken, refreshToken] = await this.signAccessAndRefreshTokens(user_id)
    // Lưu refreshToken vào database
    await databaseService.refreshTokens.insertOne({ user_id: new ObjectId(user_id), refresh_token: refreshToken })
    return { user_id, accessToken, refreshToken }
  }

  async login(user_id: string) {
    // Tạo accessToken và refreshToken
    const [accessToken, refreshToken] = await this.signAccessAndRefreshTokens(user_id)
    // Lưu refreshToken vào database
    await databaseService.refreshTokens.insertOne({ user_id: new ObjectId(user_id), refresh_token: refreshToken })
    return { accessToken, refreshToken }
  }
  async checkEmailExistence(email: string) {
    const user = await databaseService.users.findOne({ email })
    return Boolean(user)
  }
}

const userService = new UserService()
export default userService
