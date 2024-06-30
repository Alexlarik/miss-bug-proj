import fs from 'fs'
import Cryptr from 'cryptr'

import { utilService } from './util.service.js'
const cryptr = new Cryptr(process.env.SECRET1 || 'secret-puk-1234')
let users = utilService.readJsonFile('data/user.json')

export const userService = {
    signup,
    login,
    getLoginToken,
    validateToken,
    getById


}

function signup({ fullname, username, password }) {
    if (!fullname || !username || !password) return Promise.reject('Incomplete credentails')

    let user = {
        _id: utilService.makeId(),
        fullname,
        username,
        password,
    }
    users.push(user)

    return _saveUsersToFile()
        .then(() => {
            delete user.password
            return user
        })
        .catch(err => {
            return Promise.reject('Error saving user to file' + err.message)
        })
}

function login({ username, password }) {
    let user = users.find(user => user.username === username && user.password === password)
    if (!user) return Promise.reject('Invalid username or password')

    const { _id, fullname, isAdmin } = user
    user = { _id, fullname, isAdmin }

    return Promise.resolve(user)
}

function getLoginToken(user) {
    return cryptr.encrypt(JSON.stringify(user))
}

function validateToken(loginToken) {
    try {
        const json = cryptr.decrypt(loginToken)
        const loggedinUser = JSON.parse(json)
        return loggedinUser
    } catch (err) {
        console.log('Invalid login token')
        return null
    }
}

function _saveUsersToFile() {
    return new Promise((resolve, reject) => {
        const content = JSON.stringify(users, null, 2)
        fs.writeFile('./data/user.json', content, err => {
            if (err) {
                console.error(err)
                return reject(err)
            }
            resolve()
        })
    })
}

function getById(userId) {
    const user = users.find(user => user._id === userId)
    if (user) {
        const { _id, fullname, username } = user
        return Promise.resolve({ _id, fullname, username })
    } else {
        return Promise.reject('User not found')
    }
}