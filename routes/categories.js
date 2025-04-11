const express = require('express');
const router = express.Router();
const categoryControllers = require('../controllers/categories');
let { check_authentication, check_authorization, check_authenticationAdmin, check_authorizationAdmin } = require("../utils/check_auth");
let constants = require('../utils/constants')

// Lấy danh sách tất cả danh mục
router.get('/', async function (req, res, next) {
  try {
    let categories = await categoryControllers.getAllCategories();
    res.send({
      success: true,
      data: categories
    });
  } catch (error) {
    next(error);
  }
});

// Lấy một danh mục theo ID
router.get('/:id', async function (req, res, next) {
  try {
    let category = await categoryControllers.getCategoryById(req.params.id);
    if (!category) {
      return res.status(404).send({ success: false, message: "Danh mục không tồn tại" });
    }
    res.send({ success: true, data: category });
  } catch (error) {
    next(error);
  }
});

// Tạo mới một danh mục
router.post('/', check_authenticationAdmin, check_authorizationAdmin(constants.ADMIN_PERMISSION), async function (req, res, next) {
  try {
    let { name, description } = req.body;
    let newCategory = await categoryControllers.createCategory(name, description);
    res.status(200).send({
      success: true,
      message: newCategory
    });
  } catch (error) {
    res.status(400).send({
      success: false,
      message: error.message
    });
  }
});

// Cập nhật danh mục
router.put('/:id', check_authenticationAdmin, check_authorizationAdmin(constants.ADMIN_PERMISSION), async function (req, res, next) {
  try {
    let updatedCategory = await categoryControllers.updateCategory(req.params.id, req.body);
    res.status(200).send({
      success: true,
      message: updatedCategory
    });
  } catch (error) {
    next(error);
  }
});

// Xóa danh mục (soft delete)
router.delete('/:id',check_authenticationAdmin, check_authorizationAdmin(constants.ADMIN_PERMISSION), async function (req, res, next) {
  try {
    let deletedCategory = await categoryControllers.deleteCategory(req.params.id);
    res.status(200).send({
      success: true,
      message: deletedCategory
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
