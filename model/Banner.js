const { Schema, default: mongoose } = require("mongoose");

const BANNER_SCHEMA = new Schema({
    mediaURL: {
        type: String,
        required: true,
    },
	active: {
		type: Boolean,
		default: true,
		required: true
	}
})


module.exports = mongoose.model('BANNER', BANNER_SCHEMA);