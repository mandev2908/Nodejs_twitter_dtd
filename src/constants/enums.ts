export enum UserVerifyStatus {
  Unverified, // chưa xác thực email, mặc định = 0
  Verified, // đã xác thực email
  Banned // bị khóa
}

export enum TokenTypes {
  AccessToken, // token để truy cập vào API
  RefreshToken, // token để refresh access token
  ForgotPasswordToken, // token để xác thực password
  EmailVerifyToken // token để xác thực email
}
