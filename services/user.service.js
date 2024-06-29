
import { utilService } from './util.service.js'

let users = utilService.readJsonFile('./data/user.json')
export const userService = {
    signup,
    login


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
}

function login({ username, password }) {
    let user = users.find(user => user.username === username && user.password === password)
    if (!user) return Promise.reject('Invalid username or password')

    const { _id, fullname, isAdmin } = user
    user = { _id, fullname, isAdmin }

    return Promise.resolve(user)
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