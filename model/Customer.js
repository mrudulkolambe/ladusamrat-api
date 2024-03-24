const { default: mongoose, Schema } = require("mongoose");

const Customer_Schema = new Schema({
    name: {
        type: String,
        required: true

    },
    email: {
        type: String,
        unique: true,
        required: true

    },
    phoneNo: {
        type: Number,
        unique: true,
        required: true


    },
    password: {
        type: String,
        required: true,
    },
    street_adress: {
        type: String,
        required: true,

    },
    role: {
        type: String,
        required: true,
        default: "customer"
    },
    time_stamp: {
        type: Number,
        default: Date.now()
    }
})

module.exports = mongoose.model('CUSTOMERS', Customer_Schema)