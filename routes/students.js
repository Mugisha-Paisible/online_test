const { request } = require('express')
const express = require('express')
const router = express.Router()
const db = require('../db/index')

router.post('/data', async function (req, res) {
  try {
    const results = await db.query('INSERT INTO students (testId, attempted, unattempted, flagged, score) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        // [req.params.testId, req.params.attempted, req.params.unattempted, req.params.flagged, req.params.score]
        [req.body.testId, req.body.attNo, req.body.unattNo, req.body.flgNo, req.body.scorePercent]
    )
    console.log(req.body)
    return res.json(results.rows)
  } catch (err) {
    return res.send(err.message)
  }
})

router.get('/all', async function (req, res) {
  try {
    const results = await db.query('SELECT * FROM students')
    return res.json(results.rows)
  } catch (err) {
    return res.send(err.message)
  }
})

module.exports = router