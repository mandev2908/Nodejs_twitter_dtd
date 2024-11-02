import express from 'express'
import { validationResult, ValidationChain } from 'express-validator'
import { RunnableValidationChains } from 'express-validator/lib/middlewares/schema'
import { HTTP_STATUS } from '~/constants/httpStatus'
import { EntityError, ErrorWithStatus } from '~/models/Errors'

// Hàm validate có thể được tái sử dụng cho nhiều route
export const validate = (validations: RunnableValidationChains<ValidationChain>) => {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    // Chạy tất cả các xác thực
    await validations.run(req)

    // Nếu không có lỗi, tiếp tục với middleware tiếp theo
    const errors = validationResult(req)
    if (errors.isEmpty()) {
      return next()
    }

    // Nếu có lỗi
    const errorsObject = errors.mapped()
    const entityError = new EntityError({ errors: {} })
    for (const key in errorsObject) {
      const { msg } = errorsObject[key]
      // Trả về lỗi không phải lỗi Validate
      if (msg instanceof ErrorWithStatus && msg.status !== HTTP_STATUS.UNPROCESSABLE_ENTITY) {
        return next(msg)
      }
      entityError.errors[key] = errorsObject[key]
    }

    // Trả về  lỗi Validate thông thường
    next(entityError)
  }
}
