const userModel = require('../models/user');
const roleModel = require('../models/role');
const utils = require('../lib/utils');
const digitalBlockchainModel = require('../models/blockchain/digital');

const _ = require('lodash');
const userDetails = [{
  firstName: 'John',
  lastName: 'Doe',
  email: 'john@yopmail.com',
  password: 'Test@1234',
  role: 1,
  contactNumber: '9898989801',
  address: {
    street: '1607 23rd Street NW',
    city: 'Washington',
    zipCode: '20008',
    state: ' DC',
    country: 'US',
  },
  publicKey: '0xb67aa207d69994d65F16f4E5032CCB26932b3bB8',
},
{
  firstName: 'Central',
  lastName: 'Government',
  email: 'central@yopmail.com',
  password: 'Test@1234',
  role: 2,
  contactNumber: '9898989801',
  address: {
    street: '1607 23rd Street NW',
    city: 'Washington',
    zipCode: '20008',
    state: ' DC',
    country: 'US',
  },
  publicKey: '0xF238a6C6070319a7A740986cf81F536a49f0cBb4',
},
{
  firstName: 'State',
  lastName: 'Government',
  email: 'state@yopmail.com',
  password: 'Test@1234',
  role: 3,
  contactNumber: '9898989801',
  address: {
    street: '1607 23rd Street NW',
    city: 'Washington',
    zipCode: '20008',
    state: ' DC',
    country: 'US',
  },
  publicKey: '0xfa56B17C6A9F452Be312b18b857429af5FFb325d',
},
{
  firstName: 'Local',
  lastName: 'Government',
  email: 'local@yopmail.com',
  password: 'Test@1234',
  role: 4,
  contactNumber: '9898989801',
  address: {
    street: '1607 23rd Street NW',
    city: 'Washington',
    zipCode: '20008',
    state: ' DC',
    country: 'US',
  },
  publicKey: '0x83A47bfB36D9409e8cA6DfcaA3Da09b5315974b2',
}
]
exports.up = () => new Promise((resolve, reject) => {
  roleModel.find({ roleQueries: {} }, (roleErr, roles) => {
    userDetails.forEach(userDetail => {
      userDetail.role = _.find(roles, role => (role.code === userDetail.role))._id;
      userDetail.password = utils.generateBcryptHash(userDetail.password);
    });
    userModel.addMultiple({ userDetails }, (err, res) => {
      if (!err) {
        digitalBlockchainModel.addMultiple(userDetails)
          .then((addRes) => {
            console.log(`Users Added!:${addRes}`);
            resolve();
          })
          .catch((addErr) => {
            console.log(`Error in adding user to blockchain: ${addErr}`);
            reject();
          })
      }
      else {
        console.log(`Users adding failed: ${err}`);
        reject(err);
      }
    })
  });
});

exports.down = db => null;

exports._meta = {
  version: 1,
};
