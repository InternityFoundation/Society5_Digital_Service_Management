require('../lib/dbHelper');
const mongoose = require('mongoose');
const { Schema } = mongoose;

const userSchema = new Schema({
  firstName: { type: String, required: true },
  lastName: { type: String },
  email: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: Schema.Types.ObjectId, ref: 'roles', required: true },
  contactNumber: { type: String },
  address: {
    street: { type: String, },
    city: { type: String, },
    zipCode: { type: String, },
    state: { type: String, },
    country: { type: String, },
  },
  publicKey: { type: String,lowercase: true, required: true },
}, {
  timestamps: {
    createdAt: 'createdAt',
    updatedAt: 'updatedAt',
  },
});

const User = mongoose.model('users', userSchema);

const addMultiple = (args, callback) => {
  User.insertMany(args.userDetails, { ordered: false })
    .then((res) => callback(null, res))
    .catch((err) => new Error(JSON.stringify(err)));
};

const find = (args, callback) => {
  User.find(args.data)
    .populate('role')
    .then((res) => callback(null, res))
    .catch((err) => new Error(JSON.stringify(err)));
};

module.exports = {
  addMultiple,
  find,
};
