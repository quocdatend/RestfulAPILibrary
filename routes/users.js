var express = require('express');
var router = express.Router();
var userControllers = require('../controllers/users')
let { check_authentication, check_authorization } = require("../utils/check_auth");
const constants = require('../utils/constants');

router.get('/', check_authentication, check_authorization(constants.USER_PERMISSION), userControllers.getAllUsers);

router.post('/', userControllers.createAnUser);

router.put('/:id',check_authentication, check_authorization(constants.USER_PERMISSION), userControllers.updateAnUser);

router.delete('/:id', check_authentication, check_authorization(constants.ADMIN_PERMISSION), userControllers.deleteAnUser);

module.exports = router;
