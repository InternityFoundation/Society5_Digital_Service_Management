const roleModel = require('../models/role');

exports.up = db => new Promise((resolve, reject) => {
  roleModel.addMultiple({
    roleDetails: [{
      code: 1,
      displayName: 'user',
      description: 'This is user role',
    },
    {
      code: 2,
      displayName: 'central',
      description: 'This is Central Government',
    },
    {
      code: 3,
      displayName: 'state',
      description: 'This is State Government',
    },{
      code: 4,
      displayName: 'local',
      description: 'This is local bodies of Government',
    }]
  }, (err, res) => {
    if (!err) {
      console.log(`Role Added!`);
      resolve();
    }
    else {
      console.log(`Role adding failed: ${err}`);
    }
  });
});

exports.down = db => null;

exports._meta = {
  version: 1,
};
