import express from 'express'

import { bugService } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js'

const app = express()

// Express Routing:

app.get('/api/bug', (req, res) => {
    bugService.query()
        .then(bugs => res.send(bugs))
        .catch(err => {
            loggerService.error(`Couldn't get bugs...`, err)
            res.status(500).send(`Couldn't get bugs...`)
        })
})

app.get('/api/bug/:id', (req, res) => {
    const { id } = req.params
    bugService.getById(id).then((bug) => res.send(bug))
})

const port = 3030
app.listen(port, () => loggerService.info(`Server listening on port http://127.0.0.1:${port}/`))
