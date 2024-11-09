import { NextFunction, Request, Response } from 'express'

// Tạo wrapRequestHandler để xử lý lỗi
export const wrapRequestHandling = (func: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      return await func(req, res, next)
    } catch (error) {
      next(error)
    }
  }
}
