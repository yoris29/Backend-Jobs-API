const User = require('../models/User')
const { StatusCodes } = require('http-status-codes')
const { BadRequestError, UnauthenticatedError } = require('../errors')


const register = async (req, res) => {
   const user = await User.create({ ...req.body })

   // Instance methods
   const name = user.getName()
   const token = user.genToken()

   res
      .status(StatusCodes.CREATED)
      .json({ user: { name }, token })
}


const login = async (req, res) => {
   const { email, password } = req.body
   if (!password || !email) {
      throw new BadRequestError('Please provide a valid email and password')
   }
   const user = await User.findOne({ email })

   // Check user
   if (!user) {
      throw new UnauthenticatedError('Invalid credentials')
   }

   // Compare passwords
   const isPassCorrect = await user.comparePass(password)
   if (!isPassCorrect) {
      throw new UnauthenticatedError('Invalid pass')
   }

   // Response
   const token = user.genToken()
   res.status(StatusCodes.OK).json({ user: { name: user.name }, token })
}

module.exports = { login, register }