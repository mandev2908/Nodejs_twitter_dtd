import { createHash } from 'crypto'
import { config } from 'dotenv'
// Load environment variables from.env file
config()
function sha256(content: string) {
  return createHash('sha256').update(content).digest('hex')
}

export function hashPassword(password: string) {
  return sha256(password + process.env.PASSWORD_HASHPASSWORD_SECRET)
}
