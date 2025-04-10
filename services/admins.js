let adminSchema = require('../schemas/admin')
let roleSchema = require('../schemas/role');
let bcrypt = require('bcrypt')
module.exports = {
    getAdminById: async function (id) {
        return adminSchema.findById(id).populate('role')
    },
    getUserById: async function (id) {
        return userSchema.findById(id).populate('role')
    },
    getUserByEmail: async function (email) {
        return userSchema.findOne({
            email: email
        }).populate('role')
    },
    getUserByToken: async function (token) {
        return userSchema.findOne({
            ResetPasswordToken: token
        }).populate('role')
    },
    getByName: async function (name) {
        return adminSchema.findOne({
            name: name
        })
    },
    createAnAdmin: async function (name, password, email, roleI) {

        let role = await roleSchema.findOne({
            name: roleI
        })
        if (role) {
            let newAdmin = new adminSchema({
                name: name,
                password: password,
                email: email,
                role: role._id
            })
            return await newAdmin.save();

        } else {
            throw new Error('role khong ton tai')
        }

    },
    updateAnUser: async function (id, body) {
        let updatedUser = await this.getUserById(id);
        let allowFields = ["password", "email"];
        for (const key of Object.keys(body)) {
            if (allowFields.includes(key)) {
                updatedUser[key] = body[key]
            }
        }
        await updatedUser.save();
        return updatedUser;
    },
    checkLogin: async function (name, password) {
        let admin = await this.getByName(name);
        if (!admin) {
            throw new Error("Name admin hoac password khong dung")
        } else {
            if (bcrypt.compareSync(password, admin.password)) {
                return admin._id;
            } else {
                throw new Error("adminname admin hoac password khong dung")
            }
        }
    }
}