# Job Management API

A Node.js-based API for managing user authentication and job postings.

## Setup

npm install && npm start

## Database Connection

1. Import connect.js
2. Invoke in start()
3. Setup .env in the root
4. Add MONGO_URI with correct value

## Routers

- auth.js
- jobs.js

## User Model

### Email Validation Regex

/^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)\*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/

## Register User

- [x] Validate - name, email, password - with Mongoose
- [x] Hash Password (with bcryptjs)
- [x] Save User
- [x] Generate Token
- [x] Send Response with Token

## Login User

- [x] Validate - email, password - in controller
- [x] If email or password is missing, throw BadRequestError
- [x] Find User
- [x] Compare Passwords
- [x] If no user or password does not match, throw UnauthenticatedError
- [x] If correct, generate Token
- [x] Send Response with Token

## Mongoose Errors

- [ ] Validation Errors
- [ ] Duplicate (Email)
- [ ] Cast Error

## Security

- [ ] helmet
- [ ] cors
- [ ] xss-clean
- [ ] express-rate-limit
