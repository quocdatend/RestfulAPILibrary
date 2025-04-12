const express = require('express');
const router = express.Router();
let { check_authentication, check_authorization } = require("../utils/check_auth");
const ratingsController = require('../controllers/ratings');
const constants = require('../utils/constants');

router.get('/', ratingsController.getAllRatings);
router.post('/add', check_authentication, check_authorization(constants.PREMIUM_PERMISSION), ratingsController.addRating);
router.delete('/:id', check_authentication, check_authorization(constants.PREMIUM_PERMISSION), ratingsController.deleteRating);

module.exports = router;
