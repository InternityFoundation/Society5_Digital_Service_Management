
const Web3 = require('web3');
const Tx = require('ethereumjs-tx');
const bigNumber = require('bignumber.js');
const config = require('../config/index');
const logger = require('./logger');
// const multisigWalletUserMappingModel = require('../models/database/multisigWalletUserMapping');
// const erc20ContractModel = require('../models/database/erc20Contract');

const { publicBlockchainDetails } = config;

const web3 = new Web3(new Web3.providers.HttpProvider(config.blockchainConnectionUrl));

/**
   * This function is to check  for completion of given transaction
   * @param {String} txhash
   */
const checkForTransactionReceiptMined = txhash => new Promise((resolve, reject) => {
  web3.eth.getTransactionReceipt(txhash, (err, receipt) => {
    if (receipt && receipt.blockNumber && receipt.transactionHash.toLowerCase() === txhash.toLowerCase()) {
      resolve(receipt);
    } else {
      reject(false);
    }
  });
});

/**
   * This function is to watch for completion of given transaction
   * @param {object} receipt
   * @param {String} txhash
   * @param {boolean} isCallbackSent
   * @param {object} filter
   * @private
   */
const isTransactionConfirmed = (receipt, txhash, isCallbackSent, filter) => new Promise((resolve, reject) => {
  console.log('isTransactionConfirmed');
  if (receipt && receipt.transactionHash == txhash) {
    if (web3.eth.getTransaction(txhash).blockNumber) {
      console.log(`${'\nTransferred Mined : ' + ' Transaction '}${txhash} in Block ${web3.eth.getTransaction(txhash).blockNumber} at difficulty ${web3.eth.getBlock(web3.eth.getTransaction(txhash).blockNumber).difficulty}`);
      filter.stopWatching();
      isCallbackSent = true;
      resolve(isCallbackSent);
    } else {
      console.log(`\n${txhash} Not yet Mined`);
      filter.stopWatching();
      isCallbackSent = true;
    }
  }
});

/**
 * This function is to watch for completion of given transaction
 * @param {String} txhash
 * @private
 */
const applyWatch = txhash => new Promise((resolve, reject) => {
  const filter = web3.eth.filter('latest');
  const isCallbackSent = false;
  // waiting for mining
  filter.watch((error, result) => {
    web3.eth.getTransactionReceipt(txhash, (err, receipt) => {
      if (err) {
        reject(err);
      } else {
        isTransactionConfirmed(receipt, txhash, isCallbackSent, filter)
          .then((result) => {
            resolve(receipt);
          }).catch((err) => {
            reject(err);
          });
      }
    });
  });
});

/**
 * Fn to get the contract address and respective ABI of multisig wallet
 * @param {Object} data expected key userId
 */
const getMultisigContract = data => new Promise((resolve, reject) => {
  // const Contract = contractAddress[data.contractName];
  multisigWalletUserMappingModel.getMultisigWalletContractUsingUserId(data.userId).then((contract) => {
    if (contract.length > 0) {
      const myMultisigContract = web3.eth.contract(contract[0].multisigWalletId.abi).at(contract[0].multisigWalletId.contractAddress);
      data.myMultisigContract = myMultisigContract;
      data.multisigWalletId = contract[0].multisigWalletId._id;
      data.web3 = web3;
      resolve(data);
    } else {
      logger.error(`No contract details found for userid : ${data.userId}`);
      const errObj = {
        status: 'failure',
        message: 'User does not have wallet configured any!',
      };
      reject(errObj);
    }
  }).catch((e) => {
    logger.error(`Error while getting the contract details: ${JSON.stringify(e)}`);
    reject(e);
  });
});


/**
 * Fn to get the contract address and respective ABI of multisig wallet
 * @param {Object} data expected key userId
 */
const getMultisigContractObject = data => new Promise((resolve, reject) => {
  try {
    const myMultisigContract = web3.eth.contract(data.multisigContract.abi).at(data.multisigContract.contractAddress);
    data.myMultisigContract = myMultisigContract;
    data.web3 = web3;
    resolve(data);
  } catch (e) {
    logger.error(`Err while creating myMultisigContract for cron service ${JSON.stringify(e)}`);
    reject(e);
  }
});

/**
 * Fn to get all the contract address and respective ABI of multisig wallet
 * @param {Object} data expected key userId
 */
const getAllMultisigContract = data => new Promise((resolve, reject) => {
  multisigWalletUserMappingModel.getMultisigWalletContractUsingUserId(data.userId).then((contract) => {
    const myMultisigContract = [];
    if (contract.length > 0) {
      contract.forEach((multisigContract) => {
        const obj = {};
        myMultisigContract.push(web3.eth.contract(multisigContract.multisigWalletId.abi).at(multisigContract.multisigWalletId.contractAddress));
      });
    }
    data.allMultisigContract = myMultisigContract;
    data.web3 = web3;
    resolve(data);
  }).catch((e) => {
    logger.error(`Error while getting the contract details: ${JSON.stringify(e)}`);
    reject(e);
  });
});

/**
 * Fn to get the estimate gas limit for tx
 * @param {String} contractData
 */
const getEstimateGas = (contractData, to, from) => {
  let gasEstimate = 3000000;
  try {
    gasEstimate = web3.eth.estimateGas({ data: contractData, to, from });
  } catch (err) {
    logger.error('Error getting the gasEstimate');
  }
  return gasEstimate;
};

/**
 * Fn to sign the raw transaction in blockchain
 * @param {Object} data
 */
const executeRawTransaction = data => new Promise((resolve, reject) => {
  const privateKey = new Buffer(data.privateKey, 'hex');
  const rawTx = {
    from: data.sender,
    to: data.myMultisigContract.address,
    gas: getEstimateGas(data.encodedABI, data.myMultisigContract.address, data.sender),
    gasPrice: parseInt(web3.eth.gasPrice.toString()) + config.extraGasPrice,
    value: 0,
    data: data.encodedABI,
    nonce: web3.toHex(web3.eth.getTransactionCount(data.sender, 'pending')),
  };
  const tx = new Tx(rawTx);
  tx.sign(privateKey);
  const serializedTx = tx.serialize();
  web3.eth.sendRawTransaction(`0x${serializedTx.toString('hex')}`, (err, hash) => {
    if (!err) {
      logger.info(`Transaction signed successfully: ${hash}`);
      data.hash = hash;
      resolve(data);
    } else {
      logger.error(`Transaction signed error: ${JSON.stringify(err)}`);
      const errObj = {
        status: 'failue',
        message: 'Error occured while executing the transaction in blockchain',
        err,
      };
      reject(errObj);
    }
  });
});

/**
 * Fn to get the encoded abi of requested fn call
 * @param {Object} data
 */
const getEncodeABI = data => new Promise((resolve, reject) => {
  let encodedABI = '0x00';
  const value = data.value || 0;
  switch (data.functionName) {
    case 'addOwner':
      encodedABI = data.myMultisigContract.addOwner.getData(data.ownerAddressToAdd);
      data.destinationAddress = data.myMultisigContract.address;
      data.functionName = 'submitTransaction';
      break;
    case 'removeOwner':
      encodedABI = data.myMultisigContract.removeOwner.getData(data.ownerAddressToRemove);
      data.destinationAddress = data.myMultisigContract.address;
      data.functionName = 'submitTransaction';
      break;
    case 'replaceOwner':
      encodedABI = data.myMultisigContract.replaceOwner.getData(data.ownerAddressToReplace, data.ownerAddressToAdd);
      data.destinationAddress = data.myMultisigContract.address;
      data.functionName = 'submitTransaction';
      break;
    case 'submitTransaction':
      // require destination, value, encodedData
      encodedABI = data.myMultisigContract.submitTransaction.getData(data.destinationAddress, value, data.encodedABI);
      break;
    case 'confirmTransaction':
      encodedABI = data.myMultisigContract.confirmTransaction.getData(data.transactionId);
      break;
    case 'revokeConfirmation':
      encodedABI = data.myMultisigContract.revokeConfirmation.getData(data.transactionId);
      break;
    case 'transferToken':
      encodedABI = data.myERCContract.transfer.getData(data.recipientAddress, data.tokenAmountToTransfer);
      data.destinationAddress = data.myERCContract.address;
      data.functionName = 'submitTransaction';
      break;
    default:
  }
  data.encodedABI = encodedABI;
  resolve(data);
});


/**
 * Fn to get the contract address and respective ABI of ERC20 Token
 * @param {Object} data expected key tokenName
 */
const getErc20ContractDetails = data => new Promise((resolve, reject) => {
  erc20ContractModel.getErc20ContractDetails(data.tokenId).then((contract) => {
    if (contract.length > 0) {
      const myERCContract = web3.eth.contract(contract[0].abi).at(contract[0].contractAddress);
      data.myERCContract = myERCContract;
      data.web3 = web3;
      data.erc20ContractDetailsId = contract[0]._id;
      resolve(data);
    } else {
      logger.error(`No contract details found for tokenid : ${data.tokenId}`);
      const errObj = {
        status: 'failure',
        message: 'User does not any have wallet configured yet',
      };
      reject(errObj);
    }
  }).catch((e) => {
    logger.error(`Error while getting the contract details: ${JSON.stringify(e)}`);
    reject(e);
  });
});


/**
 * Fn to get all the contract address and respective ABI of ERC20 Token
 * @param {Object} data expected key tokenName
 */
const getAllErc20ContractDetails = data => new Promise((resolve, reject) => {
  erc20ContractModel.getAllErc20ContractDetails().then((contract) => {
    const tokens = {};
    if (contract.length > 0) {
      contract.forEach((tokenContract) => {
        const obj = {};
        obj._id = tokenContract._id;
        obj.myERCContract = web3.eth.contract(tokenContract.abi).at(tokenContract.contractAddress);
        tokens[`${tokenContract.tokenName}`] = obj;
      });
    }
    data.web3 = web3;
    data.tokenContracts = tokens;
    resolve(data);
  }).catch((e) => {
    logger.error(`Error while getting the contract details: ${JSON.stringify(e)}`);
    const errObj = {
      status: 'failure',
      message: 'Internal Error occured',
    };
    reject(errObj);
  });
});

/**
 * Fn to get amount to bignumber converted for token 18 decimal
 * @param {Number} amount
 * @param {String} currency
 */
const convertToAtom = (amount) => {
  amount = bigNumber(amount);
  return (amount.mul(bigNumber(1000000000000000000)));
};

/**
 * Fn to get token amount from big number token 18 decimal
 * @param {Number} amount
 * @param {String} currency
 */
const convertToToken = (amount) => {
  amount = bigNumber(amount);
  return (amount.div(bigNumber(1000000000000000000)));
};

/**
 * Fn to get token amount formated
 * @param {Number} balance
 */
const formatBalance = (balance) => {
  const x = bigNumber(balance).toFixed(8).toString();
  const intpart = x.replace(/([0-9]+(\.[0-9]+[1-9])?)(\.?0+$)/, '$1');
  return intpart;
};

const getEvents = (data, eventName) => new Promise((resolve, reject) => {
  let events;
  const switchEvent = eventName || data.eventName;
  const filter = data.filter || {};
  const fromBlock = data.fromBlock || 0;
  try {
    switch (switchEvent) {
      case 'Submission':
        events = data.myMultisigContract.Submission(filter, { fromBlock, toBlock: 'latest' });
        break;
      case 'Revocation':
        events = data.myMultisigContract.Revocation(filter, { fromBlock, toBlock: 'latest' });
        break;
      case 'Execution':
        events = data.myMultisigContract.Execution(filter, { fromBlock, toBlock: 'latest' });
        break;
      case 'ExecutionFailure':
        events = data.myMultisigContract.ExecutionFailure(filter, { fromBlock, toBlock: 'latest' });
        break;
      default:
    }
    events.get((error, result) => {
      if (!error) {
        data[switchEvent] = result;
        resolve(data);
      } else {
        reject(error);
      }
    });
  } catch (e) {
    reject(e);
  }
});

module.exports = {
  applyWatch,
  getMultisigContract,
  getMultisigContractObject,
  getAllMultisigContract,
  executeRawTransaction,
  getEncodeABI,
  getErc20ContractDetails,
  getAllErc20ContractDetails,
  convertToAtom,
  convertToToken,
  formatBalance,
  getEvents,
  checkForTransactionReceiptMined,
};
