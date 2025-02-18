require('dotenv').config()
require('express-async-errors')
const notFound = require('./middlewares/notFound')
const errorHandler = require('./middlewares/errorHandler')
const authRouter = require('./routes/auth')
const jobsRouter = require('./routes/jobs')
const connectDB = require('./db/connect')
const auth = require('./middlewares/auth')
const helmet = require('helmet')
const cors = require('cors')
const xss = require('xss-clean')
const rateLimiter = require('express-rate-limit')
const express = require('express')
const app = express()

// Built-In Middlewares
app.use(express.json())

// 3rd Party Middlewares
app.set('trust proxy', 1)
app.use(rateLimiter({
   windowMs: 15 * 60 * 1000,
   max: 100  // Limit each IP to 100 requests per {windowMs}
}))
app.use(helmet())
app.use(cors())
app.use(xss())

// Routes Middlewares
app.use('/api/v1/auth', authRouter)
app.use('/api/v1/jobs', auth, jobsRouter)

// Error Middlewares
app.use(errorHandler)
app.use(notFound)

// Server
const port = process.env.PORT || 5000
const start = async () => {
   try {
      await connectDB(process.env.MONGO_URI)
      app.listen(port, console.log(`Server live on port ${port}`))
   } catch (error) {
      console.log(error)
   }
}
start()