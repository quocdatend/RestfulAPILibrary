```
project-root/
├── bin/                 # Khởi chạy server (thường là bin/www)
├── config/              # Cấu hình chung (DB, environment, logger, etc.)
├── controllers/         # Xử lý logic chính của request
├── middlewares/         # Middleware (xác thực, logging, xử lý lỗi)
├── models/              # Mô hình dữ liệu (thường dùng với mongoose, sequelize)
├── routes/              # Định nghĩa các route (chỉ routing, không xử lý logic)
├── services/            # Dịch vụ xử lý logic nghiệp vụ chuyên biệt
├── utils/               # Tiện ích dùng chung (helper functions, mailer, logger,...)
├── validations/         # Validate dữ liệu đầu vào (Joi, Yup,...)
├── uploads/             # File media được upload
├── .env                 # Biến môi trường
├── app.js               # App Express chính
├── package.json         # Thông tin project
└── README.md            # Tài liệu project

```
# Hướng Dẫn Sử Dụng
## Cài Đặt
```
bash
npm install
```
## Khởi Chạy
```
bash
node bin/www
```
## Docs API
### User
#### Login
```
bash
curl -X POST \
http://localhost:3000/api/v1/users/login \
-H 'Content-Type: application/json' \
-d '{"username":"abc123", "email": "example@example.com", "password": "password"}'
```
#### Signup
```
bash
curl -X POST \
http://localhost:3000/api/v1/users/signup \
-H 'Content-Type: application/json' \
-d '{"email": "example@example.com", "password": "password"}'
```
#### Get User


