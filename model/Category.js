const { Schema, default: mongoose } = require("mongoose");

const CATEGORY_SCHEMA = new Schema({
    category_name: {
        type: String,
        required: true,
        unique: true,
    }
})


module.exports = mongoose.model('CATEGORY', CATEGORY_SCHEMA);