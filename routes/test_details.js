const { request } = require('express')
const express = require('express')
const router = express.Router()
const db = require('../db/index')

router.post('/data/:testId/:attNo/:unattNo/:flgNo/:scorePercent', async function (req, res) {
  try {
    const results = await db.query('INSERT INTO test_details (test_id, attempted, unattempted, flagged, score) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [req.params.testId, req.params.attNo, req.params.unattNo, req.params.flgNo, req.params.scorePercent]
        //[req.body.testId, req.body.attNo, req.body.unattNo, req.body.flgNo, req.body.scorePercent]
    )
    console.log("req.params.testId")
    return res.json(results.rows)
  } catch (err) {
    console.log(err.message)
    return res.send(err.message)
  }
})

router.get('/all', async function (req, res) {
  try {
    const results = await db.query('SELECT * FROM test_details')
    return res.json(results.rows)
  } catch (err) {
    return res.send(err.message)
  }
})

module.exports = router