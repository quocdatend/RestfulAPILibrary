const express = require('express');
const router = express.Router();
const controller = require('../controllers/Education');

router.post('/', controller.createEducationLevelWithSubjects);
router.get('/', controller.getAllEducationLevels);
router.get('/:id', controller.getEducationLevelById);
router.put('/:id', controller.updateEducationLevel);
router.delete('/:id', controller.deleteEducationLevel);
module.exports = router;
