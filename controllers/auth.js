let jwt = require('jsonwebtoken');
let constants = require('../utils/constants')
let crypto = require('crypto')
let mailer = require('../utils/mailer')
var userService = require('../services/users')

exports.login = async function (req, res, next) {
    try {
        let username = req.body.username;
        let password = req.body.password;
        let result = await userService.checkLogin(username, password);
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

exports.logout = async function (req, res, next) {
    try {
        res.clearCookie('token')
        res.status(200).send({
            success: true,
            message: 'ban da dang xuat'
        })
    } catch (error) {
        next(error)
    }
};

exports.signup = async function (req, res, next) {
  try {
      let username = req.body.username;
      let password = req.body.password;
      let email = req.body.email;
      let result = await userService.createAnUser(username, password,
          email, 'user');
      res.status(200).send({
          success: true,
          data: result
      })
  } catch (error) {
      next(error)
  }
};

exports.me = async function (req, res, next) {
    try {
        res.send({
            success: true,
            data: req.user
        });
    } catch (error) {
        next(error)
    }
}

exports.changePassword = async function (req, res, next) {
    try {
        let oldpassword = req.body.oldpassword;
        let newpassword = req.body.newpassword;
        let user = userService.changePassword(req.user, oldpassword, newpassword);
        res.send({
            success: true,
            data: user
        });

    } catch (error) {
        next(error)
    }
};

exports.forgotPassword = async function (req, res, next) {
    try {
        let email = req.body.email;
        let user = await userService.getUserByEmail(email);
        if (!user) {
            throw new Error("email khong ton  tai")
        }
        user.ResetPasswordToken = crypto.randomBytes(30).toString('hex');
        user.ResetPasswordTokenExp = new Date(Date.now() + 20 * 60 * 1000);
        await user.save()
        let URL = `http://localhost:3000/auth/resetpassword/${user.ResetPasswordToken}`
        await mailer.send(user.email,URL)
        res.send({
            success: true,
            data: URL
        });
    } catch (error) {
        next(error)
    }
};

exports.resetPassword = async function (req, res, next) {
  try {
      let token = req.params.token;
      let password = req.body.password
      let user = await userService.getUserByToken(token);
      if (!user) {
          throw new Error("token khong hop le")
      }
      if (user.ResetPasswordTokenExp < Date.now()) {
          throw new Error("token het han")
      }
      user.password = password;
      user.ResetPasswordToken = null;
      user.ResetPasswordTokenExp = null;
      await user.save();
      res.send({
          success: true,
          data: user
      });
  } catch (error) {
      next(error)
  }
};