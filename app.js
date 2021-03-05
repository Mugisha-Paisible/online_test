const express = require('express')
const app = express()
const port = parseInt(process.env.PORT, 10) || 3000
const path = require('path')
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

app.get('/views', function (req, res) {
  //return res.render('index.html')
  return res.sendFile('index.html', {root : __dirname + '/views'});
})

// port
app.listen(port, () => {
  console.log('App is running on port ' + port)
})
