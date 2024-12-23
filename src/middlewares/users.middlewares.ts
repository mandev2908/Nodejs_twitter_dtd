import { config } from 'dotenv'
import { checkSchema } from 'express-validator'
import { JsonWebTokenError } from 'jsonwebtoken'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { USERS_MESSAGES } from '~/constants/messages'
import { ErrorWithStatus } from '~/models/Errors'
import databaseService from '~/services/database.services'
import userService from '~/services/users.services'
import { hashPassword } from '~/ultis/crypto'
import { verifyToken } from '~/ultis/jwt'
import { validate } from '~/ultis/validation'
import { capitalize } from 'lodash'
import { Request } from 'express'
config()

export const loginValidator = validate(
  checkSchema(
    {
      email: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.EMAIL_IS_REQUIRED
        },
        isEmail: {
          errorMessage: USERS_MESSAGES.EMAIL_IS_INVALID
        },
        trim: true,
        custom: {
          options: async (value, { req }) => {
            const user = await databaseService.users.findOne({
              email: value,
              password: hashPassword(req.body.password)
            })
            if (user === null) {
              throw new Error(USERS_MESSAGES.EMAIL_OR_PASSWORD_IS_INCORRECT)
            }
            req.user = user
            return true
          }
        }
      },
      password: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.PASSWORD_IS_REQUIRED
        },
        isString: {
          errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_A_STRING
        },
        isLength: {
          options: {
            min: 6,
            max: 50
          },
          errorMessage: USERS_MESSAGES.PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50
        },
        isStrongPassword: {
          options: {
            minLength: 6,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1,
            minSymbols: 1
          },
          errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_STRONG
        }
      }
    },
    ['body']
  )
)

export const registerValidator = validate(
  checkSchema(
    {
      name: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.NAME_IS_REQUIRED
        },
        isString: {
          errorMessage: USERS_MESSAGES.NAME_MUST_BE_A_STRING
        },
        isLength: { options: { min: 1, max: 100 }, errorMessage: USERS_MESSAGES.NAME_LENGTH_MUST_BE_FROM_1_TO_100 },
        trim: true,
        errorMessage: 'Invalid name'
      },
      email: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.EMAIL_IS_REQUIRED
        },
        isEmail: {
          errorMessage: USERS_MESSAGES.EMAIL_IS_INVALID
        },
        trim: true,
        custom: {
          options: async (value) => {
            const isExistEmail = await userService.checkEmailExistence(value)
            if (isExistEmail) {
              throw new Error(USERS_MESSAGES.EMAIL_ALREADY_EXISTS)
            }
            return true
          }
        }
      },
      password: {
        notEmpty: { errorMessage: USERS_MESSAGES.PASSWORD_IS_REQUIRED },
        isString: { errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_A_STRING },
        isLength: { options: { min: 6, max: 50 }, errorMessage: USERS_MESSAGES.PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50 },
        isStrongPassword: {
          options: { minLength: 6, minLowercase: 1, minNumbers: 1, minSymbols: 1, minUppercase: 1 }
        },
        errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_STRONG
      },
      confirm_password: {
        notEmpty: {
          errorMessage: USERS_MESSAGES.CONFIRM_PASSWORD_IS_REQUIRED
        },
        isString: {
          errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_A_STRING
        },
        isLength: {
          options: { min: 6, max: 50 },
          errorMessage: USERS_MESSAGES.PASSWORD_LENGTH_MUST_BE_FROM_6_TO_50
        },
        isStrongPassword: {
          options: { minLength: 6, minLowercase: 1, minNumbers: 1, minSymbols: 1, minUppercase: 1 },
          errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_STRONG
        },
        errorMessage: USERS_MESSAGES.PASSWORD_MUST_BE_STRONG,
        custom: {
          options: (value, { req }) => {
            if (value !== req.body.password) {
              throw new Error(USERS_MESSAGES.CONFIRM_PASSWORD_MUST_BE_THE_SAME_AS_PASSWORD)
            }
            return true
          }
        }
      },
      date_of_birth: {
        isISO8601: { options: { strict: true, strictSeparator: true } },
        errorMessage: USERS_MESSAGES.DATE_OF_BIRTH_MUST_BE_ISO8601
      }
    },
    ['body']
  )
)

// Hàm dùng chung để xác thực token
const verifyAndDecodeToken = async (token: string, secret: string, errorMessage: string) => {
  try {
    return await verifyToken({ token, secretOrPublicKey: secret })
  } catch (error) {
    if (error instanceof JsonWebTokenError) {
      throw new ErrorWithStatus({
        message: capitalize(error.message || errorMessage),
        status: HTTP_STATUS.UNAUTHORIZED
      })
    }
    throw error
  }
}

export const accessTokenValidator = validate(
  checkSchema(
    {
      authorization: {
        notEmpty: { errorMessage: USERS_MESSAGES.ACCESS_TOKEN_IS_REQUIRED },
        custom: {
          options: async (value: string, { req }) => {
            const access_token = value.split(' ')[1]
            if (!access_token) {
              throw new ErrorWithStatus({
                message: USERS_MESSAGES.ACCESS_TOKEN_IS_REQUIRED,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            ;(req as Request).decoded_authorization = await verifyAndDecodeToken(
              access_token,
              process.env.ACCESS_TOKEN_SECRET!,
              USERS_MESSAGES.ACCESS_TOKEN_IS_INVALID
            )
            return true
          }
        }
      }
    },
    ['headers']
  )
)

export const refreshTokenValidator = validate(
  checkSchema(
    {
      refresh_token: {
        notEmpty: { errorMessage: USERS_MESSAGES.REFRESH_TOKEN_IS_REQUIRED },
        custom: {
          options: async (value: string, { req }) => {
            // Xác thực và giải mã token trước khi kiểm tra trong cơ sở dữ liệu
            ;(req as Request).decoded_refresh_token = await verifyAndDecodeToken(
              value,
              process.env.REFRESH_TOKEN_SECRET!,
              USERS_MESSAGES.REFRESH_TOKEN_IS_INVALID
            )

            const refresh_token = await databaseService.refreshTokens.findOne({ refresh_token: value })
            if (!refresh_token) {
              throw new ErrorWithStatus({
                message: USERS_MESSAGES.USED_REFRESH_TOKEN_OR_NOT_EXIST,
                status: HTTP_STATUS.UNAUTHORIZED
              })
            }
            return true
          }
        }
      }
    },
    ['body']
  )
)
