const digitalModel = require('./../../models/digital');
// eslint-disable-next-line func-names
module.exports = function () {
  const seneca = this;
  seneca.add({ role: 'digital', cmd: 'addMultiple' }, digitalModel.addMultiple);
  seneca.add({ role: 'digital', cmd: 'addIdentity' }, digitalModel.addIdentity);
  seneca.add({ role: 'digital', cmd: 'getIdentity' }, digitalModel.getIdentity);
  seneca.add({ role: 'digital', cmd: 'verifyIdentity' }, digitalModel.verifyDigitalIdentity);
};