const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const languageSchema = new Schema({
    GuildID: String,
    lang: String
});

const language = mongoose.model('language', languageSchema);

module.exports = language;