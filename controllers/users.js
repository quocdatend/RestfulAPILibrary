const userService = require('../services/users');

exports.getAllUsers = async function (req, res, next) {
    try {
      let users = await userService.getAllUsers()
      res.send({
        success: true,
        data: users
      });
    } catch (error) {
      next(error)
    }
};

exports.createAnUser = async function (req, res, next) {
  try {
    let body = req.body;
    let newUser = await userService.createAnUser(
      body.username,
      body.password,
      body.email,
      body.role = body.role || 'user'
    )
    res.status(200).send({
      success: true,
      message: newUser
    });
  } catch (error) {
    res.status(404).send({
      success: false,
      message: error.message
    });
  }
};

exports.updateAnUser = async function (req, res, next) {
  try {
    let body = req.body;
    let updatedUser = await userService.updateAnUser(req.params.id, body);
    res.status(200).send({
      success: true,
      message: updatedUser
    });
  } catch (error) {
    next(error)
  }
};

exports.deleteAnUser = async function (req, res, next) {
    try {
      let deleteUser = await userService.deleteAnUser(req.params.id);
      res.status(200).send({
        success: true,
        message: deleteUser
      });
    } catch (error) {
      next(error)
    }
};
