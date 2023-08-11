const mongoose = require('mongoose');
const resetPwSchema = new mongoose.Schema({
    user:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    accessToken:{
        type: String,
        required: true,
        unique: true,
    },
    isValid:{
        type: Boolean,
        required: true,
    }
},{
    timestamps:true
});

const resetPassword = mongoose.model('ResetPasswordToken', resetPwSchema);
module.exports=resetPassword;