import axios from '../lib/axios.js'
const BASE_URL = '/api/bug'

export const bugService = {
    query,
    getById,
    save,
    remove,
    createDefaultFilter,
    getPageCount
}

function query(filterBy = {}) {
    return axios.get(BASE_URL, { params: filterBy }).then(res => res.data)
}
function getById(bugId) {
    return axios.get(BASE_URL + `/${bugId}`).then(res => res.data)
}
function remove(bugId) {
    return axios.delete(BASE_URL + `/${bugId}`).then(res => res.data)
}
function save(bug) {
    // const {_id , description, title, createdAt , severity} = bug
    if (bug.id) {
        return axios.put(BASE_URL + `/${bug.id}` + bug)
            .then(res => res.data)
    } else {
        return axios.post(BASE_URL, bug)
            .then(res => res.data)
    }
}
function createDefaultFilter() {
    return { txt: '', minSeverity: 0 }
}

function getPageCount() {
    return axios.get(BASE_URL + '/pageCount').then(res => res.data)
}