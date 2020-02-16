/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
require('../lib/dbHelper');
const mongoose = require('mongoose');

const { Schema } = mongoose;

const roleSchema = new Schema({
  code: { type: Number, required: true },
  displayName: { type: String },
  description: { type: String },
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
});

const Role = mongoose.model('roles', roleSchema);

const addMultiple = (args, callback) => {
  Role.insertMany(args.roleDetails, { ordered: false })
    .then((res) => callback(null, res))
    .catch((err) => new Error(JSON.stringify(err)));
};

const find = (args, callback) => {
  Role.find(args.roleQueries)
    .then((res) => callback(null, res))
    .catch((err) => new Error(JSON.stringify(err)));
};

module.exports = {
  addMultiple,
  find,
};
