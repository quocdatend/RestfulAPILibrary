let jwt = require('jsonwebtoken');
let constants = require('./constants')
var userService = require('../services/users')
var adminService = require('../services/admins')


module.exports = {
    check_authentication: async function (req, res, next) {
        let token;
        if (!req.headers || !req.headers.authorization) {
            if (req.signedCookies.token) {
                token = req.signedCookies.token;
            }
        } else {
            if (req.headers.authorization.startsWith("Bearer")) {
                token = req.headers.authorization.split(" ")[1];
            }
        }
        //
        if (!token) {
            next(new Error("ban chua dang nhap"))
        }

        let result = jwt.verify(token, constants.SECRET_KEY);
        let user_id = result.id;
        let user = await userService.getUserById(user_id)
        if (result.expireIn > Date.now()) {
            req.user = user;
            next();
        } else {
            next(new Error("token het han"))
        }
    },
    check_authorization: function (roles) {
        return function (req, res, next) {
            let roleOfUser = req.user.role.name;
            let requiredRoles = roles;
            if (requiredRoles.includes(roleOfUser)) {
                next();
            }
            else {
                next(new Error("ban khong co quyen"))
            }
        }
    },
    check_authenticationAdmin: async function (req, res, next) {
        let token;
        if (!req.headers || !req.headers.authorization) {
            if (req.signedCookies.token) {
                token = req.signedCookies.token;
            }
        } else {
            if (req.headers.authorization.startsWith("Bearer")) {
                token = req.headers.authorization.split(" ")[1];
            }
        }
        //
        if (!token) {
            next(new Error("ban chua dang nhap"))
        }

        let result = jwt.verify(token, constants.SECRET_KEY);
        let admin_id = result.id;
        let admin = await adminService.getAdminById(admin_id)
        if (result.expireIn > Date.now()) {
            req.admin = admin;
            next();
        } else {
            next(new Error("token het han"))
        }
    },
    check_authorizationAdmin: function (roles) {
        return function (req, res, next) {
            let roleOfAdmin = req.admin.role.name;
            let requiredRoles = roles;
            if (requiredRoles.includes(roleOfAdmin)) {
                next();
            }
            else {
                next(new Error("ban khong co quyen"))
            }
        }
    },
    //check Admin
    checkAdmin: function (req, res, next) {
        let roleOfAdmin = req.admin.role.name;
        if (roleOfAdmin === 'admin') {
            next();
        } else {
            next(new Error("ban khong co quyen"))
        }
    },
    //check User
    checkUser: function (req, res, next) {
        let roleOfUser = req.user.role.name;
        if (roleOfUser === 'user') {
            next();
        } else {
            next(new Error("ban khong co quyen"))
        }
    }

}