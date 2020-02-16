const userModel = require('../../models/database/user');
const utils = require('../../lib/utils');
const logger = require('../../lib/logger');
const internalError = {
    code: 500,
    message: `Internal Error`,
}

const validateUser = ({ email, password, role }) => new Promise((resolve, reject) => {
    const invalidUser =
    {
        code: 401,
        message: `User not valid`,
    }
    userModel.find({ email })
        .then((users) => {
            if (users.length) {
                const [user] = users;
                if (utils.compareHash(password.trim(), user.password)) {
                    delete user.password;
                    resolve(user);
                } else {
                    reject(invalidUser);
                }
            } else {
                reject(invalidUser);
            }
        })
        .catch((err) => {
            logger.error(`Error while authenticating user ${err}`)
            reject(internalError);
        })
})


module.exports = {
    validateUser,
}