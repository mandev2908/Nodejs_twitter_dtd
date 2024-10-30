import User from '~/models/schemas/Users.schema'
import databaseService from './database.services'
import { LoginReqBody, RegisterReqBody } from '~/models/requests/User.requests'
import { hashPassword } from '~/ultis/crypto'
import { signToken } from '~/ultis/jwt'
import { TokenTypes } from '~/constants/enums'

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
  async register(payload: RegisterReqBody) {
    const user = await databaseService.users.insertOne(
      new User({ ...payload, date_of_birth: new Date(payload.date_of_birth), password: hashPassword(payload.password) })
    )
    const user_id = user.insertedId.toString()
    const [accessToken, refreshToken] = await Promise.all([
      this.signAccessToken(user_id),
      this.signRefreshToken(user_id)
    ])
    return { user_id, accessToken, refreshToken }
  }

  async login(payload: LoginReqBody) {
    const user = await databaseService.users.findOne({ email: payload.email })
    if (!user || !user.email) {
      throw new Error('Invalid credentials')
    }

    // Hash the provided password and compare it to the stored hashed password
    const hashedPassword = hashPassword(payload.password)
    if (user.password !== hashedPassword) {
      throw new Error('Invalid credentials')
    }

    // Tạo accessToken và refreshToken
    const user_id = user._id.toString()
    const [accessToken, refreshToken] = await Promise.all([
      this.signAccessToken(user_id),
      this.signRefreshToken(user_id)
    ])

    return { ...user, accessToken, refreshToken }
  }

  async checkEmailExistence(email: string) {
    const user = await databaseService.users.findOne({ email })
    return Boolean(user)
  }
}

const userService = new UserService()
export default userService
