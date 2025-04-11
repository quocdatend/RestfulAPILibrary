const express = require('express');
const router = express.Router();
const controller = require('../controllers/Education');
let { check_authentication, check_authorization, check_authenticationAdmin, check_authorizationAdmin } = require("../utils/check_auth");
let constants = require('../utils/constants')

router.post('/',check_authenticationAdmin, check_authorizationAdmin(constants.ADMIN_PERMISSION), controller.createEducationLevelWithSubjects);
router.get('/', controller.getAllEducationLevels);
router.get('/:id', controller.getEducationLevelById);
router.put('/:id',check_authenticationAdmin, check_authorizationAdmin(constants.ADMIN_PERMISSION), controller.updateEducationLevel);
router.delete('/:id',check_authenticationAdmin, check_authorizationAdmin(constants.ADMIN_PERMISSION), controller.deleteEducationLevel);
module.exports = router;
