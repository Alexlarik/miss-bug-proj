
import { utilService } from './util.service.js'

// const STORAGE_KEY = 'bugDB'
// var testBugs = [
//     { _id: 'bug101', title: 'bug test', description: 'nice bug', severity: 1, createdAt: Date.now() }
// ]

export const bugService = {
    query,
    getById,
    save,
    remove,
    getPageCount
}

var bugs = utilService.readJsonFile('./data/bug.json')
const PAGE_SIZE = 3


function query(filterBy) {
    var filteredBugs = bugs
    if (!filterBy) return Promise.resolve(filteredBugs)

    if (filterBy.txt) {
        const regExp = new RegExp(filterBy.txt, 'i')
        filteredBugs = filteredBugs.filter(bug => regExp.test(bug.title) || regExp.test(bug.description))
    }
    if (filterBy.minSeverity) {
        filteredBugs = filteredBugs.filter(bug => bug.severity >= filterBy.minSeverity)
    }

    if (filterBy.sortBy) {
        if (filterBy.sortBy === 'title') {
            filteredBugs = filteredBugs.sort((bug1, bug2) => bug1.title.localeCompare(bug2.title) * filterBy.sortDir)
        } else if (filterBy.sortBy === 'severity') {
            filteredBugs = filteredBugs.sort((bug1, bug2) => (bug1.severity - bug2.severity) * filterBy.sortDir)
        } else if (filterBy.sortBy === 'createdAt') {
            filteredBugs = filteredBugs.sort((bug1, bug2) => (bug1.createdAt - bug2.createdAt) * filterBy.sortDir)
        }
    }
    const startIdx = filterBy.pageIdx * PAGE_SIZE
    filteredBugs = filteredBugs.slice(startIdx, startIdx + PAGE_SIZE)
    return Promise.resolve(filteredBugs)

}

function getById(bugId) {
    const bug = bugs.find(bug => bug._id === bugId)
    return Promise.resolve(bug)
}

function remove(bugId) {
    const idx = bugs.findIndex(bug => bug._id === bugId)

    bugs.splice(idx, 1)

    return _saveBugsToFile()
}

function save(bugToSave, loggedinUser) {
    if (bugToSave._id) {
        const idx = bugs.findIndex(bug => bug._id === bugToSave._id)
        bugs.splice(idx, 1, bugToSave)
        if (bugs[idx].creator._id !== loggedinUser._id && !loggedinUser.isAdmin) {
            return Promise.reject('Not authorized update this bug')
        }
        bugs[idx] = bugToSave
    } else {
        bugToSave._id = utilService.makeId()
        bugToSave.createdAt = Date.now()
        bugToSave.userId = loggedinUser._id
        bugs.unshift(bugToSave)
    }
    return _saveBugsToFile()
        .then(() => bugToSave)
}

function _saveBugsToFile() {
    return utilService.writeJsonFile('./data/bug.json', bugs)
}

function getPageCount() {
    return query().then(bugs => {
        return Math.ceil(bugs.length / PAGE_SIZE)
    })
}
