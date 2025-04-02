let jwt = require('jsonwebtoken');
let constants = require('./constants')
var userControllers = require('../controllers/users')
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
        let user = await userControllers.getUserById(user_id)
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
    }
}