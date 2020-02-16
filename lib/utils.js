const bcrypt = require('bcrypt');

const generateBcryptHash = (password) => {
    const salt = bcrypt.genSaltSync(10);
    return bcrypt.hashSync(password, salt);
};

const compareHash = (password, hash) => bcrypt.compareSync(password, hash);

module.exports = {
    compareHash,
    generateBcryptHash,
}