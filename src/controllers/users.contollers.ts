import { Request, Response } from 'express'
import userService from '~/services/users.services'

export const loginController = async (req: Request, res: Response) => {
  const { email, password } = req.body
  try {
    const result = await userService.login({ email, password })
    return res.json({
      message: 'Logged in successfully!',
      result: {
        userId: result._id,
        email,
        password
      }
    })
  } catch (error) {
    return res.status(401).json({
      message: 'Login failed! Incorrect email or password.',
      error
    })
  }
}

export const registerController = async (req: Request, res: Response) => {
  const { email, password } = req.body
  try {
    const result = userService.register({ email, password })
    return res.json({
      message: 'Registration successful!',
      result: {
        userId: (await result).insertedId,
        email,
        password
      }
    })
  } catch (error) {
    return res.status(400).json({
      message: 'Register failed!',
      error
    })
  }
}
