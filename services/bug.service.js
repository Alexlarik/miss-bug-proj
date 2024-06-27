
import { storageService } from './async-storage.service.js'
import { utilService } from './util.service.js'

const STORAGE_KEY = 'bugDB'
var testBugs = [
    { _id: 'bug101', title: 'bug test', description: 'nice bug', severity: 1, createdAt: Date.now() }
]


export const bugService = {
    query,
    getById,
    save,
    remove,
}


function query() {
    return Promise.resolve(testBugs)
}
function getById(bugId) {
    const bug = testBugs.find(bug => bug._id === bugId)
    return Promise.resolve(bug)
}
function remove(bugId) {
    return storageService.remove(STORAGE_KEY, bugId)
}
function save(bug) {
    if (bug._id) {
        return storageService.put(STORAGE_KEY, bug)
    } else {
        return storageService.post(STORAGE_KEY, bug)
    }
}