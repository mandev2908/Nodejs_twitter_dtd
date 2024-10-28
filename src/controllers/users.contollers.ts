import { Request, Response } from 'express'

export const loginController = (req: Request, res: Response) => {
  const { username, password } = req.body
  if (username === 'huynhman2908@gmail.com' && password === '123456') {
    res.json({
      message: 'Logged in successfully!'
    })
    return
  }

  res.status(401).json({
    message: 'Login failed! Incorrect username or password.'
  })
}
