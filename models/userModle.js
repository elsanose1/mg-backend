const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    name : {
        type : String,
        required : [true , 'You must provide your Name'],
    },
    email : {
        type : String,
        required : [true , 'You must provide your email'],
        unique : true,
        lowercase : true,
        validate : [validator.isEmail , 'please provide vaild email']
    },
    role : {
        type : String,
        enum : ['user' , 'admin'],
        default : 'user',
        
    },
    password : {
        type : String,
        required : [true , 'You must privide password'],
        minlength : [8,'password min length is 8'],
        select : false
    },
    confirmPassword : {
        type : String,
        required : true,
        validate : {
            validator : function(val){
                return val === this.password
            },
            message : "Confirm Password does't match password"
        },
    },
    passwordChangedAt : Date,

},{timestamps : true})


// update padsswordChangedAt on change password
userSchema.pre('save', function(next){
    if(!this.isModified('password') || this.isNew) return next();

    this.passwordChangedAt = Date.now() - 1000;
    next()
})

// check if password given is correct
userSchema.methods.checkPassword = async function (givenPassword , userPassword) {
    return await bcrypt.compare(givenPassword , userPassword)
}

// check if password changed after token signed
userSchema.methods.isPasswordChanged = async function (JWTTime){
    if(this.passwordChangedAt){
        const modifiedTime = parseInt(this.passwordChangedAt.getTime() /1000,10)
        return JWTTime <= modifiedTime
    }

    return false;
}

// check and crypt password
userSchema.pre('save' , async function (next){
    if (!this.isModified('password'))  return next();

    this.password = await bcrypt.hash(this.password, 12);
    this.confirmPassword = undefined
    next();
})


const User = mongoose.model('User' ,userSchema);

module.exports = User