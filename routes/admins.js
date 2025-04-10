var express = require('express');
var router = express.Router();
var adminControllers = require('../controllers/admins')
let { check_authenticationAdmin, check_authorizationAdmin } = require("../utils/check_auth");
const constants = require('../utils/constants');

router.get('/', check_authenticationAdmin, check_authorizationAdmin(['admin']), adminControllers.getAdmin);

router.post('/login', adminControllers.loginAdmin);

router.post('/', adminControllers.createAnAdmin);

router.put('/:id', check_authenticationAdmin, check_authorizationAdmin(['admin']), adminControllers.updateAnAdmin);

module.exports = router;