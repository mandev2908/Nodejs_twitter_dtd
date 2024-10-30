export interface LoginReqBody {
  email: string
  password: string
}

export interface RegisterReqBody {
  email: string
  password: string
  name: string
  date_of_birth: Date
}
