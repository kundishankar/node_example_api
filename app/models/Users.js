const mongoose = require('mongoose');

const Users = new mongoose.Schema({
    firstName: String,
    lastName: String,
    userName: String,
    email: String,
    phone: Number,
    status: Boolean,
    image: String,
    Address: [{address: String, city: String, State:String, zip_code: Number}],
    date: {type: Date, default: Date.now}
})

const users = mongoose.model('user', Users);
module.exports = users;