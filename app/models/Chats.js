const mongoose = require('mongoose');

const Chats = new mongoose.Schema({
    username: String,
    message: String,
    date: {type: Date, default: Date.now}
})

const chats = mongoose.model('chat', Chats);
module.exports = chats;