const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PrefixSchema = new Schema({
    GuildID: String,
    prefix: String,
});

const prefix = mongoose.model('prefix', PrefixSchema);

module.exports = prefix;