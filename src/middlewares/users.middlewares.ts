import { Request, Response, NextFunction } from 'express'
import { checkSchema } from 'express-validator'
import { validate } from '~/ultis/validation'

export const loginValidator = (req: Request, res: Response, next: NextFunction) => {
  const { email, password } = req.body
  if (!email || !password) {
    return res.status(401).json({ message: 'Missing email or password' })
  }
  next()
}

export const registerValidator = validate(
  checkSchema({
    name: {
      isLength: { options: { min: 1, max: 100 } },
      notEmpty: true,
      trim: true,
      errorMessage: 'Invalid name'
    },
    email: {
      notEmpty: true,
      isEmail: true,
      trim: true,
      errorMessage: 'Invalid email'
    },
    password: {
      notEmpty: true,
      isLength: { options: { min: 8, max: 100 } },
      isStrongPassword: {
        options: { minLength: 8, minLowercase: 1, minNumbers: 1, minSymbols: 1, minUppercase: 1 }
      },
      errorMessage: 'Password is not strong enough'
    },
    confirm_password: {
      notEmpty: true,
      custom: {
        options: (value, { req }) => {
          if (value !== req.body.password) {
            throw new Error('Confirm password does not match')
          }
          return true
        }
      }
    },
    date_of_birth: {
      isISO8601: { options: { strict: true, strictSeparator: true } },
      errorMessage: 'Invalid date of birth'
    }
  })
)
