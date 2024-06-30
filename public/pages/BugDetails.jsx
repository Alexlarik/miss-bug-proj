const { useState, useEffect } = React
const { Link, useParams, useNavigate } = ReactRouterDOM

import { bugService } from '../services/bug.service.js'
import { showErrorMsg } from '../services/event-bus.service.js'
import { userService } from '../services/user.service.js'


export function BugDetails() {

    const [bug, setBug] = useState(null)
    const { bugId } = useParams()
    const navigate = useNavigate()
    const [user, setUser] = useState(null)

    useEffect(() => {
        bugService.getById(bugId)
            .then(bug => {
                setBug(bug)
                return userService.get(bug.userId)
            })
            .then(user => {
                setUser(user)
            })
            .catch(err => {
                showErrorMsg('Cannot load bug')
                navigate('/bug')
            })
    }, [bugId])

    if (!bug) return <h1>loadings....</h1>
    const { title, severity, description, createdAt } = bug
    return <div>
        <h3>Bug Details 🐛</h3>
        <h4>{title}</h4>
        <p>Severity: <span>{severity}</span></p>
        <p>Description: <span>{description}</span></p>
        <p>Created At: <span>{createdAt}</span></p>
        <p>User: <span>{user ? user.fullname : 'Loading user...'}</span></p>
        <Link to="/bug">Back to List</Link>
    </div>

}

