const User = require('../models/User')
const Job = require('../models/Job')
const { BadRequestError, NotFoundError } = require('../errors')
const { StatusCodes } = require('http-status-codes')


const getAllJobs = async (req, res) => {
   // We're not looking for all the jobs, but for all the jobs of a specific userId
   const jobs = await Job
      .find({ createdBy: req.user.userId })
      .sort('createdAt')
   res.status(StatusCodes.OK).json({ nbHits: jobs.length, jobs })
}


const getJob = async (req, res) => {
   const { // Get from the req object the userId that is in the user object, and the jobId that is in the params object listed ad id
      user: { userId },
      params: { id: jobId }
   } = req
   const job = await Job.findOne({ _id: jobId, createdBy: userId })

   if (!job) {
      throw new NotFoundError(`Job ${jobId} not found`)
   }

   res.status(StatusCodes.OK).json({ job })
}


const createJob = async (req, res) => {
   // Creating a createdBy header of document
   req.body.createdBy = req.user.userId
   const job = await Job.create(req.body)

   res.status(StatusCodes.CREATED).json({ job })
}


const updateJob = async (req, res) => {
   const {
      // We get the userId from the user object we create when we register
      // We get the jobId from the params
      user: { userId },
      params: { id: jobId },
      body: { company, position }
   } = req
   const job = await Job.findOneAndUpdate(
      { _id: jobId, createdBy: userId },
      { company, position },
      { runValidators: true, new: true }
   )

   if (company === '' || position === '') {
      throw new BadRequestError("Please prove a valid company and position")
   }
   if (!job) {
      throw new NotFoundError(`Job ${jobId} not found`)
   }

   res.status(StatusCodes.OK).json({ job })
}


const deleteJob = async (req, res) => {
   const {
      user: { userId },
      params: { id: jobId }
   } = req
   const job = await Job.findOneAndDelete(
      { _id: jobId, createdBy: userId }
   )
   const jobs = await Job
      .find({ createdBy: userId })
      .sort('createdAt')

   if (!job) {
      throw new NotFoundError(`Job ${jobId} not found`)
   }

   res.status(StatusCodes.OK).json({ nbHits: jobs.length, jobs })
}


module.exports = { getAllJobs, getJob, createJob, updateJob, deleteJob }