import { config } from 'dotenv'
import jwt, { SignOptions } from 'jsonwebtoken'
import { TokenPayload } from '~/models/requests/User.requests'
config()

export const signToken = ({
  payload,
  privateKey,
  options
}: {
  payload: string | Buffer | object
  privateKey: string
  options: SignOptions
}) => {
  return new Promise<string>((resolve, reject) => {
    jwt.sign(payload, privateKey, options, (err, token) => {
      if (err) throw reject(err)
      resolve(token as string)
    })
  })
}

export const verifyToken = ({ token, secretOrPublicKey }: { token: string; secretOrPublicKey?: string }) => {
  return new Promise<TokenPayload>((resolve, reject) => {
    jwt.verify(token, secretOrPublicKey as string, (err, decoded) => {
      if (err) reject(err)
      resolve(decoded as TokenPayload)
    })
  })
}
