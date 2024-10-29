import { Request, Response, NextFunction } from 'express'

export const loginValidator = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(401).json({ message: 'Missing email or password' })
  }
  next()
}
