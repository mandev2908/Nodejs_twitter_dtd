import jwt, { SignOptions } from 'jsonwebtoken'

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
