const adminService = require('../services/admins');
let jwt = require('jsonwebtoken');
let constants = require('../utils/constants');
let crypto = require('crypto')

exports.getAdmin = async function (req, res, next) {
    try {
        res.send({
            success: true,
            data: req.admin
        });
    } catch (error) {
        next(error)
    }
};

exports.loginAdmin = async function (req, res, next) {
    try {
        let name = req.body.name;
        let password = req.body.password;
        let result = await adminService.checkLogin(name, password);
        let exp = new Date(Date.now() + 3600 * 1000)
        let token = jwt.sign({
            id: result,
            expireIn: exp.getTime()
        }, constants.SECRET_KEY)
        res.cookie(
            'token', token, {
            httpOnly: true,
            expires: exp,
            signed: true
        }
        )
        res.status(200).send({
            success: true,
            data: token
        })
    } catch (error) {
        next(error)
    }
};

exports.createAnAdmin = async function (req, res, next) {
  try {
    let body = req.body;
    let newAdmin = await adminService.createAnAdmin(
      body.name,
      body.password,
      body.email,
      body.role = 'admin'
    )
    res.status(200).send({
      success: true,
      message: newAdmin
    });
  } catch (error) {
    res.status(404).send({
      success: false,
      message: error.message
    });
  }
};

exports.updateAnAdmin = async function (req, res, next) {
  try {
    let body = req.body;
    let updatedadmin = await adminService.updateAnAdmin(req.params.id, body);
    res.status(200).send({
      success: true,
      message: updatedadmin
    });
  } catch (error) {
    next(error)
  }
};
