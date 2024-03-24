const { Schema, default: mongoose } = require("mongoose")


const ORDER_SCHEMA = new Schema({
    customer: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "CUSTOMERS"
    },
    orderID: String,
    data: String
})

module.exports = mongoose.model("ORDER", ORDER_SCHEMA)