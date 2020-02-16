const sha1 = require('sha1');
const fs = require('fs');
const path = require('path');
const _ = require('lodash');

const digitalBlockchainModel = require('../../models/ethereum/digital');
const userModel = require('../../models/database/user');

const addDigitalIdentity = (req) => new Promise((resolve, reject) => {
    const { filename } = req.file;
    const { idType } = req.body;
    const { publicKey } = req.user;
    fs.readFile(path.join(__dirname, `../../public/file/${filename}`), (fileContentErr, fileContent) => {
        const dataHash = sha1(fileContent);
        digitalBlockchainModel.addIdentity({
            publicKey,
            filename,
            idType,
            dataHash
        })
            .then((res) => {
                resolve(res);
            })
            .catch((err) => {
                reject(err);
            })
    });
})

const getDigitalIdentity = (user) => new Promise((resolve, reject) => {
    const { publicKey } = user;
    let filter = {};
    if (user.role.code === 1) {
        filter = {
            addr: publicKey,
        };
    }
    digitalBlockchainModel.getIdentity({ filter })
        .then((res) => {
            const data = []
            if (user.role.code === 1) {
                data.push(
                    ...res,
                )
                resolve(data);
            } else {
                const userPublicKey = _.uniq(_.map(res, 'args.addr'));
                userModel.find({ publicKey: { $in: userPublicKey } })
                    .then((users) => {
                        res.forEach(ident => {
                            ident.user = _.find(users, user => user.publicKey === ident.args.addr);
                            data.push(ident);
                        })

                        // users.forEach(user => {
                        //     data.push({
                        //         user,
                        //         identity: _.filter(res, elem => user.publicKey === elem.args.addr)
                        //     });
                        // });
                        resolve(data);
                    })
                    .catch((usersErr) => {
                        reject(usersErr);
                    })
            }
        })
        .catch((err) => {
            reject(err);
        });
});

const verifyDigitalIdentity = (req) => new Promise((resolve, reject) => {
    const { addr, index } = req.body;
    const { publicKey } = req.user;
    digitalBlockchainModel.verifyDigitalIdentity({
        publicKey, addr, index
    })
        .then((res) => {
            resolve(res);
        })
        .catch((err) => {
            reject(err);
        });
})


module.exports = {
    addDigitalIdentity,
    getDigitalIdentity,
    verifyDigitalIdentity,
}