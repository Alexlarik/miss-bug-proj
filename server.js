import express from 'express'
import cookieParser from 'cookie-parser'

import { bugService } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js'

const app = express()
app.use(express.static('public'))
app.use(cookieParser())

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
    var visitedBugs = req.cookies.visitedBugs || []

    if (visitedBugs.length >= 3) res.status(401).send('Max Bug Limit Reached')
    if (!visitedBugs.includes(id)) visitedBugs.push(id)
    res.cookie('visitedBugs', visitedBugs, { maxAge: 5000 })

    bugService.getById(id).then((bug) => res.send(bug))
        .catch(err => {
            loggerService.error(`Couldn't get bug id...`, err)
            res.status(500).send(`Couldn't get bug id...`)
        })
})

app.get('/api/bug/:id/remove', (req, res) => {
    const { id } = req.params

    bugService.remove(id)
        .then(() => res.send(`Bug ${id} deleted...`))
        .catch(err => {
            loggerService.error(`Couldn't delete bug...`, err)
            res.status(500).send(`Couldn't delete bug...`)
        })
})

app.get('/api/bug/save', (req, res) => {
    const { _id, title, description, severity, createdAt } = req.query
    const bugToSave = { _id, title, description, severity: +severity, createdAt: +createdAt }

    bugService.save(bugToSave)
        .then(savedBug => res.send(savedBug))
        .catch(err => {
            loggerService.error(`Couldn't save bug...`, err)
            res.status(500).send(`Couldn't save bug...`)
        })
})

const port = 3030
app.listen(port, () => loggerService.info(`Server listening on port http://127.0.0.1:${port}/`))
