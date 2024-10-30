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
  const { name, email, password } = req.body
  try {
    const result = userService.register({ name, email, password })
    return res.status(201).json({
      message: 'Registration successful!',
      result: {
        userId: (await result).insertedId,
        name,
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
