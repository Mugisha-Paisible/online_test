const express = require('express')
const app = express()
const port = parseInt(process.env.PORT, 10) || 3000
const path = require('path')
const db = require('./db/index.js')
const bodyParser = require('body-parser')

const questionRoutes = require('./routes/questions')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.use(express.static(__dirname + '/views'));

app.get('/', async function (req, res) {
  return res.sendFile(__dirname + '/views/index.html');
})

app.use('/questions', questionRoutes)

// port
app.listen(port, () => {
  console.log('App is running on port ' + port)
})
