const mongoose = require('mongoose');
const {Schema} = mongoose;
const JWT = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const userSchema = new Schema({
     name: {
        type: String,
        required: [true, 'Please enter your name'],
        trim: true,
        minLength: [5, 'Minimam length is five'],
        maxLength: [50,'Minimum length is less then 50']
     },
     email: {
        type: String, 
        required: [true, 'Please enter your email id'],
        trim : true,
        unique: [true, 'already registered'],
        lowercase: true

     },
     password : {
        type : String,
        select: false,
     },
     forgotPasswordToken: {
        type : String,
     }

})

// password encrepted 
userSchema.pre('save', async function() {
   if (!this.isModified('password')) {
      return;
   }
   this.password = await bcrypt.hash(this.password, 10);
   // return next();
})

// create token using custom method which is allow the schema 
 userSchema.methods = {
   jwtToken: function() {
      return JWT.sign(
      {_id: this._id, email: this.email},
      process.env.SECRET,
      {expiresIn : "1d"})
   }
}

const userModel = mongoose.model('user', userSchema);

module.exports = userModel;


