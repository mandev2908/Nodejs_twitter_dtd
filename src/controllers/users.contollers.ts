import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { LoginReqBody, RegisterReqBody } from '~/models/requests/User.requests'
import userService from '~/services/users.services'

export const loginController = async (req: Request<ParamsDictionary, any, LoginReqBody>, res: Response) => {
  try {
    const result = await userService.login(req.body)
    return res.json({
      message: 'Logged in successfully!',
      result
    })
  } catch (error) {
    return res.status(401).json({
      message: 'Login failed! Incorrect email or password.',
      error
    })
  }
}

export const registerController = async (req: Request<ParamsDictionary, any, RegisterReqBody>, res: Response) => {
  try {
    const result = await userService.register(req.body)
    return res.status(201).json({
      message: 'Registration successful!',
      result: {
        name: req.body.name,
        email: req.body.email,
        password: req.body.password,
        date_of_birth: req.body.date_of_birth,
        ...result
      }
    })
  } catch (error) {
    return res.status(400).json({
      message: 'Register failed!',
      error
    })
  }
}
