var express = require('express');
var router = express.Router();
let userControllers = require('../controllers/users')
let { check_authentication } = require("../utils/check_auth")
let { validate, UserValidation } = require('../utils/validator')
let authControllers = require('../controllers/auth')

//logout
router.get('/logout', check_authentication, authControllers.logout);

router.post('/login', UserValidation, validate, authControllers.login);

router.post('/signup', UserValidation, validate, authControllers.signup);

router.get('/me', check_authentication, authControllers.me);

router.post('/changepassword', check_authentication, authControllers.changePassword);

router.post('/forgotpassword', authControllers.forgotPassword);

router.post('/resetpassword/:token', authControllers.resetPassword);
//dien email

module.exports = router