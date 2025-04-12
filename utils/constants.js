//get environment variables from .env file
const dotenv = require('dotenv');
module.exports = {
    SECRET_KEY: dotenv.config().parsed.SECRET_KEY || "eaf53c7ae1b98322c16d534a53951c3bf2cd2b3e77e3a58646efa48e55ae9e948f7365f41d1105a5a5fe498168539b523beac63b0005b16869e36378b2b9393d",
    ADMIN_PERMISSION:['admin'],
    PREMIUM_PERMISSION:['pre'],
    USER_PERMISSION:['user','pre'],
    ERROR_PASSWORD: "password phai dai it nhat %d ki tu,trong do it nhat co %d ki tu hoa, %d ki tu thuong, %d ki tu dac biet , %d ki tu so",
    ERROR_USERNAME: "username chi co the la chu hoac so",
    ERROR_EMAIL: "email phai co dinh dang xxxx@domain"
}