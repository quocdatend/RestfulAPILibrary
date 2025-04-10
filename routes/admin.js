var express = require('express');
var router = express.Router();
var userControllers = require('../controllers/users')
let { check_authentication, check_authorization } = require("../utils/check_auth");
const constants = require('../utils/constants');

router.get('/', check_authentication, check_authorization(['admin']), userControllers.getAllUsers);

router.post('/', check_authentication, check_authorization(constants.ADMIN_PERMISSION), userControllers.createAnUser);

router.put('/:id', userControllers.updateAnUser);

router.delete('/:id', userControllers.deleteAnUser);

module.exports = router;