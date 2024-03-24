const { Schema, default: mongoose } = require("mongoose")

const ADMIN_SCHEMA = new Schema({
    email: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true
    },
    role: {
        type: String,
        reequire: true,
        default: "admin"
    }
})

module.exports=mongoose.model("ADMIN",ADMIN_SCHEMA)
