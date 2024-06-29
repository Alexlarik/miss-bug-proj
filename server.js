import path from 'path'
import express from 'express'
import cookieParser from 'cookie-parser'

import { bugService } from './services/bug.service.js'
import { loggerService } from './services/logger.service.js'
import { userService } from './services/user.service.js'

const app = express()
app.use(express.static('public'))
app.use(cookieParser())
app.use(express.json())

// Express Routing:

app.get('/api/bug', (req, res) => {
    const filterBy = {
        txt: req.query.txt || '',
        minSeverity: +req.query.minSeverity || 0,
        pageIdx: +req.query.pageIdx || 0,
        sortBy: req.query.sortBy || '',
        sortDir: +req.query.sortDir || 1,
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
    const loggedinUser = userService.validateToken(req.cookies.loginToken)
    if (!loggedinUser) return res.status(401).send('Cannot remove car')
    const { id } = req.params

    bugService.remove(id, loggedinUser)
        .then(() => res.send(`Bug ${id} deleted...`))
        .catch(err => {
            loggerService.error(`Couldn't delete bug (${id})`, err)
            res.status(500).send(`Couldn't delete bug (${id})`)
        })
})

app.post('/api/auth/signup', (req, res) => {
    const credentials = req.body

    userService.signup(credentials)
        .then(user => {
            const loginToken = userService.getLoginToken(user)
            res.cookie('loginToken', loginToken)
            res.send(user)
        })
        .catch(err => {
            loggerService.error('Signup failed', err)
            res.status(403).send('Signup failed')
        })
})

app.post('/api/auth/login', (req, res) => {
    const credentials = {
        username: req.body.username,
        password: req.body.password,
    }
    userService.login(credentials)
        .then(user => {
            const loginToken = userService.getLoginToken(user)
            res.cookie('loginToken', loginToken)
            res.send(user)
        })
        .catch(err => res.status(401).send(err))
})

app.post('/api/auth/logout', (req, res) => {
    res.clearCookie('loginToken')
    res.send('Logged out')
})

app.get('/api/user', (req, res) => {
    userService.query()
        .then((users) => {
            res.send(users)
        })
        .catch((err) => {
            console.log('Cannot load users', err)
            res.status(400).send('Cannot load users')
        })
})

app.get('/api/user/:userId', (req, res) => {
    const { userId } = req.params
    userService.getById(userId)
        .then((user) => {
            res.send(user)
        })
        .catch((err) => {
            console.log('Cannot load user', err)
            res.status(400).send('Cannot load user')
        })
})

app.get('/**', (req, res) => {
    res.sendFile(path.resolve('public/index.html'))
})

const port = 3030
app.listen(port, () => loggerService.info(`Server listening on port http://127.0.0.1:${port}/`))
