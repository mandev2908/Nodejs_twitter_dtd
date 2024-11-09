import { Router } from 'express'
import { loginController, logoutController, registerController } from '~/controllers/users.contollers'
import {
  accessTokenValidator,
  loginValidator,
  refreshTokenValidator,
  registerValidator
} from '~/middlewares/users.middlewares'
import { wrapRequestHandling } from '~/ultis/handlers'

const usersRouter = Router()
/*
 * DESCRIPTION:
 * Paths:/users/login
 * Methods:POST
 * Body: {email:string, password:string}
 */
usersRouter.post('/login', loginValidator, wrapRequestHandling(loginController))
/*
 * DESCRIPTION:
 * Paths:/users/register
 * Methods:POST
 * Body: {name:string,email:string, password:string,confirm_password:string,date_of_birth:IOS8601}
 */
usersRouter.post('/register', registerValidator, wrapRequestHandling(registerController))
/*
 * DESCRIPTION:
 * Paths:/users/logout
 * Methods:POST
 * Headers: { Authorization: Bearer <access_token>}
 * Body: { refresh_token:string}
 */
usersRouter.post('/logout', accessTokenValidator, refreshTokenValidator, wrapRequestHandling(logoutController))

export default usersRouter
