import { Router } from 'express'
import { loginController, registerController } from '~/controllers/users.contollers'
import { loginValidator, registerValidator } from '~/middlewares/users.middlewares'
import { wrapRequestHandling } from '~/ultis/handlers'

const usersRouter = Router()

usersRouter.post('/login', loginValidator, wrapRequestHandling(loginController))
usersRouter.post('/register', registerValidator, wrapRequestHandling(registerController))

export default usersRouter
