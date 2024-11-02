import express from 'express'
import cors from 'cors'
import usersRouter from './routes/users.routes'
import databaseService from './services/database.services'
import { defaultErrorHandler } from './middlewares/errors.middlewares'

const PORT = 3000
const app = express()
// Kết nối đến MongoDB
databaseService.connect()

// Cấu hình CORS cho phép truy cập từ frontend
app.use(
  cors({
    origin: 'http://localhost:3039', // URL frontend của bạn (cập nhật nếu cần)
    methods: 'GET,POST,PUT,DELETE',
    credentials: true
  })
)

// Configuring express to use json body parser
app.use(express.json())

// Routes
app.use('/users', usersRouter)

// Default error handler
app.use(defaultErrorHandler)

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`)
})
