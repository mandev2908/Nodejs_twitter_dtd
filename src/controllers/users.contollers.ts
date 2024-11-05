import { Request, Response } from 'express'
import { ParamsDictionary } from 'express-serve-static-core'
import { ObjectId } from 'mongodb'
import { USERS_MESSAGES } from '~/constants/messages'
import { RegisterReqBody } from '~/models/requests/User.requests'
import User from '~/models/schemas/Users.schema'
import userService from '~/services/users.services'

export const loginController = async (req: Request, res: Response) => {
  const user = req.user as User
  const user_id = user._id as ObjectId
  const result = await userService.login(user_id.toString())
  res.json({
    message: USERS_MESSAGES.LOGIN_SUCCESSFULLY,
    result: {
      name: user.name,
      email: user.email,
      date_of_birth: user.date_of_birth,
      avatar: user.avatar,
      bio: user.bio,
      location: user.location,
      website: user.website,
      username: user.username,
      verify: user.verify,
      ...result
    }
  })
}

export const registerController = async (req: Request<ParamsDictionary, any, RegisterReqBody>, res: Response) => {
  const result = await userService.register(req.body)
  res.status(201).json({
    message: USERS_MESSAGES.REGISTER_SUCCESS,
    result: {
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
      date_of_birth: req.body.date_of_birth,
      access_token: result.accessToken,
      refresh_token: result.refreshToken
    }
  })
}
