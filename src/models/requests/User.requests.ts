import { JwtPayload } from 'jsonwebtoken'
import { TokenTypes } from '~/constants/enums'

export interface RegisterReqBody {
  email: string
  password: string
  name: string
  date_of_birth: Date
}

export interface LogoutReqBody {
  refresh_token: string
}

export interface TokenPayload extends JwtPayload {
  user_id: string
  token_type: TokenTypes
}
