const { Link } = ReactRouterDOM

import { BugPreview } from './BugPreview.jsx'
import { userService } from '../services/user.service.js'

export function BugList({ bugs, onRemoveBug, onEditBug }) {

  const user = userService.getLoggedinUser()
  function isOwner(bug) {
    if (!user) return false
    if (!bug.owner) return true
    return user.isAdmin || bug.owner._id === user._id
  }

  return (
    <ul className="bug-list">
      {bugs.map((bug) => (
        <li className="bug-preview" key={bug._id}>
          <BugPreview bug={bug} />
          <div>{
            isOwner(bug) &&
            <div>
              <button
                onClick={() => {
                  onRemoveBug(bug._id)
                }}
              >
                x
              </button>
              <button
                onClick={() => {
                  onEditBug(bug)
                }}
              >
                Edit
              </button>
            </div>
          }
          </div>
          <Link to={`/bug/${bug._id}`}>Details</Link>
        </li>
      ))}
    </ul>
  )
}
