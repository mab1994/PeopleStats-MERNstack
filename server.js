const express = require('express')

const app = express()

app.get('/', (req, res) => res.send('API is running'))

const Port = process.env.Port || 4040

app.listen(Port, () => console.log(`Server is running at port ${Port}`))