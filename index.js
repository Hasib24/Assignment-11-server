const express = require('express')
const cors = require('cors')
require('dotenv').config()
const app = express()
const port = 5000

// Middleware
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.listen(port, () => {
  console.log(`Server is running at port:  ${port}`)
})