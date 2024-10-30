import express from 'express'
import cors from 'cors'
import usersRouter from './routes/users.routes'
import databaseService from './services/database.services'

const app = express()
const port = 3000

// Cấu hình CORS cho phép truy cập từ frontend
app.use(
  cors({
    origin: 'http://localhost:3039', // URL frontend của bạn (cập nhật nếu cần)
    methods: 'GET,POST,PUT,DELETE',
    credentials: true
  })
)

app.use(express.json())
app.use('/users', usersRouter)

// Kết nối đến MongoDB
databaseService.connect()

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})
