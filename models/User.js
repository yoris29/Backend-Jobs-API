const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
require('dotenv').config()


const UserSchema = new mongoose.Schema({
   name: {
      type: String,
      required: [true, "You have to provide a valid name"],
      minlength: 3,
      maxlength: 40,
   },
   email: {
      type: String,
      required: [true, "You have to provide an email"],
      minlength: 3,
      maxlength: 40,
      match: [/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/, "Please type a valid email"],
      unique: true
   },
   password: {
      type: String,
      required: [true, "You have to provide a valid password"],
      minlength: 6
   }
})


// Hashes Passwords
UserSchema.pre('save', async function () {
   const salt = await bcrypt.genSalt(10)
   this.password = await bcrypt.hash(this.password, salt)
})


// Generates JWT
UserSchema.methods.getName = function () {
   return this.name
}
UserSchema.methods.genToken = function () {
   const token = jwt.sign(
      { userId: this._id, name: this.name },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRATION }
   )
   return token
}
UserSchema.methods.comparePass = async function (requestPass) {
   const isMatch = await bcrypt.compare(requestPass, this.password)
   return isMatch
}


module.exports = mongoose.model('User', UserSchema)