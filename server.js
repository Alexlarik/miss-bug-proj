import express from 'express'

import { bugService } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js'

const app = express()

var testBugs = [
    { _id: 'bug101', title: 'bug test', description: 'nice bug', severity: 1, createdAt: Date.now() }
]


// Express Routing:

app.get('/api/bug', (req, res) => {
    res.send(testBugs)
})

app.get('/api/bug/:id', (req, res) => {
    const { id } = req.params
    const bug = testBugs.find(bug => bug._id === id)
    res.send(bug)
})

const port = 3030
app.listen(port, () => loggerService.info(`Server listening on port http://127.0.0.1:${port}/`))
