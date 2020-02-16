const fs = require('fs');
const solc = require('solc');
const Web3 = require('web3');
const jsonfile = require('jsonfile');
const path = require('path');
const address = path.join(__dirname, '../../config/contractAddress.json');
const config = require('../../config');

const web3 = new Web3(new Web3.providers.HttpProvider(config.blockchainConnectionUrl));
web3.personal.unlockAccount(web3.eth.coinbase, '', 1000000);
const input = fs.readFileSync('../contractFiles/Digital.sol');
const output = solc.compile(input.toString(), 1);
// console.log(output);
const bytecode = output.contracts[':Digital'].bytecode;
const abi = JSON.parse(output.contracts[':Digital'].interface);
const gasEstimate = web3.eth.estimateGas({ data: '0x' + bytecode });
const contract = web3.eth.contract(abi);


/**
 * This function deploys Digital.sol contract on blockcahin
 *
 * @param {bytecode} bytecode of Digital.sol contract
 * @param {web3.eth.coinbase} Account which deployed the contract
 * @param {gasEstimate} gas required
 * @private
 */
contract.new({ data: '0x' + bytecode, from: web3.eth.coinbase, gas: gasEstimate }, (err, res) => {
    if (err) {
        console.log(err);
        return;
    } else {
        if (res.address) {
            console.log('Digital Contract address: ' + res.address);
            const contractAddress = jsonfile.readFileSync(address);
            contractAddress['DigitalContractAddress'] = {
                'address': res.address,
                'abi': abi
            };
            fs.writeFileSync(address, JSON.stringify(contractAddress, null, 4), { spaces: 2 });
        }
    }
});
