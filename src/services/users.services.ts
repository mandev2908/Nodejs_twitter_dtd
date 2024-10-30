import User from '~/models/schemas/Users.schema'
import databaseService from './database.services'

class UserService {
  async register({ name, email, password }: { name: string; email: string; password: string }) {
    const user = await databaseService.users.insertOne(new User({ name, email, password }))
    return user
  }

  async login({ email, password }: { email: string; password: string }) {
    const user = await databaseService.users.findOne({ email })
    if (!user || !user.email || user.password !== password) {
      throw new Error('Invalid credentials')
    }
    return user
  }

  async checkEmailExistence(email: string) {
    const user = await databaseService.users.findOne({ email })
    return Boolean(user)
  }
}

const userService = new UserService()
export default userService
