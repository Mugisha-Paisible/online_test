const express = require('express')
const router = express.Router()
const db = require('../db/index')

router.post('/data/:testId/:attempted/:unattempted/:flagged/:score', async function (req, res) {
  try {
    const results = await db.query('INSERT INTO students (testId, attempted, unattempted, flagged, score) VALUES ($1, $2, $3, $4, $5) RETURNING *',
        [req.params.testId, req.params.attempted, req.params.unattempted, req.params.flagged, req.params.score]
    )
    return res.json(results.rows)
  } catch (err) {
    return res.send(err.message)
  }
})

module.exports = router