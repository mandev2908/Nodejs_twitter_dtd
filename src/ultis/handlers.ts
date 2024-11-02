import { NextFunction, Request, Response, RequestHandler } from 'express'

// Tạo wrapRequestHandler để xử lý lỗi
export const wrapRequestHandling = (func: RequestHandler) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      await func(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}
