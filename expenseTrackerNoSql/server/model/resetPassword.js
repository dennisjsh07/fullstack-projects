const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const Forgotpassword = new Schema({
    requestId:{
        type: String,
        required: true,
        unique: true
    },
    active: {
        type: Boolean,
        required: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
});

module.exports = mongoose.model('ForgotPasswordReset', Forgotpassword);
 