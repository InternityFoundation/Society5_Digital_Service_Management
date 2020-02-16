const digitalCtrl = require('../controllers/digital/index.js')

/**
 * Add Citizen to blockchain
 * @param {*} args 
 * @param {*} callback 
 */
const addMultiple = (args, callback) => {
    digitalCtrl.addMultiple(args.userDetails)
        .then((res) => callback(res))
        .catch((err) => new Error(JSON.stringify(err)));

}

const addIdentity = (args, callback) => {
    digitalCtrl.addIdentity(args.data)
        .then((res) => {
            callback(res)
        })
        .catch((err) => new Error(JSON.stringify(err)));
}

const getIdentity = (args, callback) => {
    digitalCtrl.getIdentity(args.data)
        .then((res) => {
            callback(res)
        })
        .catch((err) => new Error(JSON.stringify(err)));
}

const verifyDigitalIdentity = (args, callback) => {
    digitalCtrl.verifyDigitalIdentity(args.data)
        .then((res) => {
            callback(res)
        })
        .catch((err) => new Error(JSON.stringify(err)));
}
module.exports = {
    addMultiple,
    addIdentity,
    getIdentity,
    verifyDigitalIdentity,
}