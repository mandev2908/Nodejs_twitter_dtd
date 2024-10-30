import express from 'express'
import { validationResult, ValidationChain } from 'express-validator'
import { RunnableValidationChains } from 'express-validator/lib/middlewares/schema'

// Hàm validate có thể được tái sử dụng cho nhiều route
export const validate = (validations: RunnableValidationChains<ValidationChain>) => {
  return async (req: express.Request, res: express.Response, next: express.NextFunction) => {
    // Chạy tất cả các xác thực
    await validations.run(req)

    // Lấy các lỗi từ kết quả xác thực
    const errors = validationResult(req)

    // Nếu có lỗi
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.mapped() }) // Trả về lỗi
    }

    // Nếu không có lỗi, tiếp tục với middleware tiếp theo
    next()
  }
}
