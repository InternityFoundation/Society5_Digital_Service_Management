const roleModel = require('../../models/role');

// eslint-disable-next-line func-names
module.exports = function () {
  const seneca = this;
  seneca.add({ role: 'role', cmd: 'addMultiple' }, roleModel.addMultiple);
  seneca.add({ role: 'role', cmd: 'find' }, roleModel.find);
  };
