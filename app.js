const express = require('express')
const app = express()
const port = parseInt(process.env.PORT, 10) || 3000
const path = require('path')

// app.get('/views', function (req, res) {
//   return res.render('index.pug')
// })

app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

// port
app.listen(port, () => {
  console.log('App is running on port ' + port)
})
