import express from 'express'
import cookieParser from 'cookie-parser'

import { bugService } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js'

const app = express()
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

// Express Routing:

app.get('/api/bug', (req, res) => {
    const filterBy = {
        txt: req.query.txt || '',
        minSeverity: +req.query.minSeverity || 0,
    }
    bugService.query(filterBy)
        .then(bugs => res.send(bugs))
        .catch(err => {
            loggerService.error(`Couldn't get bugs...`, err)
            res.status(500).send(`Couldn't get bugs...`)
        })
})

app.put('/api/bug/:id', (req, res) => {
    const { _id, title, description, severity, createdAt } = req.body
    const bugToSave = { _id, title, description, severity: +severity, createdAt: +createdAt }

    bugService.save(bugToSave)
        .then(savedBug => res.send(savedBug))
        .catch(err => {
            loggerService.error(`Couldn't save bugs (${_id})`, err)
            res.status(500).send(`Couldn't save bugs (${_id})`)
        })
})
app.post('/api/bug/', (req, res) => {
    const { title, description, severity, createdAt } = req.body
    const bugToSave = { title, description, severity: +severity, createdAt: +createdAt }

    bugService.save(bugToSave)
        .then(savedBug => res.send(savedBug))
        .catch(err => {
            loggerService.error(`Couldn't save bugs...`, err)
            res.status(500).send(`Couldn't save bugs...`)
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
            loggerService.error(`Couldn't get bug (${id})`, err)
            res.status(500).send(`Couldn't get bug (${id})`)
        })
})

app.delete('/api/bug/:id', (req, res) => {
    const { id } = req.params

    bugService.remove(id)
        .then(() => res.send(`Bug ${id} deleted...`))
        .catch(err => {
            loggerService.error(`Couldn't delete bug (${id})`, err)
            res.status(500).send(`Couldn't delete bug (${id})`)
        })
})

const port = 3030
app.listen(port, () => loggerService.info(`Server listening on port http://127.0.0.1:${port}/`))
