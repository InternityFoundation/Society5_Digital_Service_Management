const async = require('async');
const Web3 = require('web3');
const jsonfile = require('jsonfile');
const path = require('path');

const conAddress = path.join(__dirname, './../../config/contractAddress.json');
const allContractAddress = jsonfile.readFileSync(conAddress);
const DigitalContractAddress = allContractAddress.DigitalContractAddress;
const config = require('../../config/index');
const utils = require('../../lib/util');
const encryptHelper = require('../../lib/encryptionHelper');
const logger = require('../../lib/logger');

/**
 * Add user ctrl
 * @param {*} userDetails 
 */
const addMultiple = (userDetails) => new Promise((resolve, reject) => {
    // log to add citizen to blockchain with its hash
    const web3 = new Web3(new Web3.providers.HttpProvider(config.blockchainConnectionUrl));
    web3.personal.unlockAccount(config.publicAddress, config.privateKey, 10);
    const myContract = web3.eth.contract(DigitalContractAddress.abi).at(DigitalContractAddress.address);
    async.forEach(userDetails, (userDetail, callback) => {
        const { publicKey, email, firstName, lastName } = userDetail;
        myContract.addUser(publicKey, `${firstName} ${lastName}`, email, { gas: 4000000, from: config.publicAddress }, function (err, res) {
            if (err) {
                logger.info('In error of add user: **********************************************');
                callback(err);
            } else {
                logger.info('Inside else part of add user');
                utils.applyWatch(res)
                    .then((mined) => {
                        callback(null, mined);
                    })
                    .catch((error) => {
                        logger.info(error);
                        callback(error);
                    })
            }
        });
    }, (err) => {
        resolve({ status: true });
    });
});

// Function to add Identity record in Blockchain
const addIdentity = (data) => new Promise((resolve, reject) => {
    let { publicKey, filename, idType, dataHash } = data;
    filename = encryptHelper.toEncrypt(filename);
    const web3 = new Web3(new Web3.providers.HttpProvider(config.blockchainConnectionUrl));
    web3.personal.unlockAccount(publicKey, config.privateKey, 10);
    const myContract = web3.eth.contract(DigitalContractAddress.abi).at(DigitalContractAddress.address);
    myContract.addIdentity(idType, filename, dataHash, { gas: 4000000, from: publicKey }, function (err, res) {
        if (err) {
            logger.info('In error of addIdentity: **********************************************');
            reject(err);
        } else {
            logger.info('Inside else part of addIdentity');
            utils.applyWatch(res)
                .then((mined) => {
                    resolve(mined);
                })
                .catch((error) => {
                    logger.info(error);
                    reject(error);
                })
        }
    })
})

const getAddIdentityEvent = (filter) => new Promise((resolve, reject) => {
    const web3 = new Web3(new Web3.providers.HttpProvider(config.blockchainConnectionUrl));
    const myContract = web3.eth.contract(DigitalContractAddress.abi).at(DigitalContractAddress.address);
    myContract.AddIdentity(filter, { fromBlock: 0, toBlock: 'latest' }).get((err, res) => {
        if (err) {
            logger.info('In error of getAddIdentityEvent: **********************************************');
            reject(err);
        } else {
            logger.info('Inside else part of getAddIdentityEvent');
            res.forEach(element => {
                element.args.ipfsHash = encryptHelper.toDecrypt(element.args.ipfsHash);
            });
            resolve(res);
        }
    })
})

const getVerifyIdentityEvent = (filter) => new Promise((resolve, reject) => {
    const web3 = new Web3(new Web3.providers.HttpProvider(config.blockchainConnectionUrl));
    const myContract = web3.eth.contract(DigitalContractAddress.abi).at(DigitalContractAddress.address);
    myContract.VerifyIdentity(filter, { fromBlock: 0, toBlock: 'latest' }).get((err, res) => {
        if (err) {
            logger.info('In error of getAddIdentityEvent: **********************************************');
            reject(err);
        } else {
            logger.info('Inside else part of getAddIdentityEvent');
            resolve(res);
        }
    })
})

const formatSortedData = (processRes, filter) => {
    console.log(processRes, filter);
    const data = [];
    let flag = false;
    processRes[0].forEach(identity => {
        flag = false;
        processRes[1].forEach(verification => {
            if (identity.args.index.toString() === verification.args.index.toString()
                && identity.args.addr === verification.args.addr) {
                identity.args.isVerified = true;
                identity.args.verifiedBy = verification.args.verifiedBy;
                identity.args.verifiedTx = verification.transactionHash;
                identity.args.verifiedBlockNumber = verification.blockNumber;
                flag = true;
                if (filter.addr) {
                    data.push(identity);
                }
            }
        })
        if (!flag) {
            identity.args.isVerified = false;
            data.push(identity);
        }
    });
    return data;
}

// Function to add Identity record in Blockchain
const getIdentity = (data) => new Promise((resolve, reject) => {
    const { filter } = data;
    Promise.all([
        getAddIdentityEvent(filter),
        getVerifyIdentityEvent(filter)
    ])
        .then((processRes) => {
            logger.info('Inside else part of getIdentity');
            resolve(formatSortedData(processRes, filter));
        })
        .catch((processErr) => {
            logger.info('In error of getIdentity: **********************************************');
            reject(processErr);
        });
})


// Function to verify Identity record in Blockchain
const verifyDigitalIdentity = (data) => new Promise((resolve, reject) => {
    let { publicKey, addr, index } = data;
    const web3 = new Web3(new Web3.providers.HttpProvider(config.blockchainConnectionUrl));
    web3.personal.unlockAccount(publicKey, config.privateKey, 10);
    const myContract = web3.eth.contract(DigitalContractAddress.abi).at(DigitalContractAddress.address);
    myContract.verifyIdentity(addr, index, { gas: 4000000, from: publicKey }, function (err, res) {
        if (err) {
            logger.info('In error of verify: **********************************************');
            reject(err);
        } else {
            logger.info('Inside else part of verify');
            utils.applyWatch(res)
                .then((mined) => {
                    resolve(mined);
                })
                .catch((error) => {
                    logger.info(error);
                    reject(error);
                })
        }
    });
});

module.exports = {
    addMultiple,
    addIdentity,
    getIdentity,
    verifyDigitalIdentity
}