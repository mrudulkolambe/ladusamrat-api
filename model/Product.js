const { Schema, default: mongoose } = require("mongoose");

const PRODUCT_SCHEMA = new Schema({
    image: {
        type: String,
        required: true,
    },
    name: {
        type: String,
        required: true
    },
    description: {
        type: String,
        required: true
    },
    inStock: {
        type: Boolean,
        required: true,
        default: true
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: mongoose.SchemaTypes.ObjectId,
        ref: "CATEGORY"
    }
})

module.exports = mongoose.model("PRODUCTS", PRODUCT_SCHEMA)