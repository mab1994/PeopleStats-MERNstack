const express = require('express')
const fs = require('fs')

const connectDB = require('./config/db')

const app = express()

// connect database
connectDB()

// initiate body parser middleware
app.use(express.json({ extended: false }))

// public folder
app.use(express.static('./public'))

// define routes
app.use('/api/users', require('./routes/users'))
app.use('/api/auth', require('./routes/auth'))
app.use('/api/profile', require('./routes/profile'))
app.use('/api/surveys', require('./routes/surveys'))

const Port = process.env.Port || 4040

app.listen(Port, () => console.log(`Server is running at port ${Port}`))