import { bugService } from '../services/bug.service.js'
import { showSuccessMsg, showErrorMsg } from '../services/event-bus.service.js'
import { BugList } from '../cmps/BugList.jsx'
import { BugFilter } from '../cmps/BugFilter.jsx'
import { utilService } from '../services/util.service.js'
import { userService } from '../services/user.service.js'

const { useState, useEffect, useRef } = React

export function BugIndex() {
  const [bugs, setBugs] = useState([])
  const [filterBy, setFilterBy] = useState(bugService.createDefaultFilter())
  const [pageCount, setPageCount] = useState(0)
  const debouncedSetFilterBy = useRef(utilService.debounce(onSetFilterBy, 500))

  useEffect(() => {
    loadPageCount()
  }, [])

  useEffect(() => {
    console.log('Filter changed:', filterBy)
    loadBugs()
  }, [filterBy])

  function loadBugs() {
    bugService.query(filterBy)
      .then(bugs => setBugs(bugs))
      .catch(err => {
        console.log('err:', err)
        showErrorMsg('Cannot load bugs')
      })
  }

  function loadPageCount() {
    bugService.getPageCount()
      .then(pageCount => setPageCount(+pageCount))
      .catch(err => {
        console.log('err:', err)
        showErrorMsg('Cannot get page count')
      })
  }

  function onRemoveBug(bugId) {
    bugService
      .remove(bugId)
      .then(() => {
        console.log('Deleted Succesfully!')
        setBugs(prevBugs => prevBugs.filter((bug) => bug._id !== bugId))
        showSuccessMsg('Bug removed')
      })
      .catch((err) => {
        console.log('Error from onRemoveBug ->', err)
        showErrorMsg('Cannot remove bug')
      })
  }

  function onAddBug() {
    const bug = {
      title: prompt('Bug title?'),
      severity: +prompt('Bug severity?'),
      description: prompt('Bug description?'),
      userId: userService.getLoggedinUser()._id
    }
    bugService.save(bug)
      .then((savedBug) => {
        console.log('Added Bug', savedBug)
        setBugs(prevBugs => [...prevBugs, savedBug])
        showSuccessMsg('Bug added')
      })
      .catch((err) => {
        console.log('Error from onAddBug ->', err)
        showErrorMsg('Cannot add bug')
      })
  }

  function onEditBug(bug) {
    const severity = +prompt('New severity?')
    const bugToSave = { ...bug, severity }
    bugService
      .save(bugToSave)
      .then((savedBug) => {
        console.log('Updated Bug:', savedBug)
        setBugs(prevBugs => prevBugs.map((currBug) =>
          currBug._id === savedBug._id ? savedBug : currBug
        ))
        showSuccessMsg('Bug updated')
      })
      .catch((err) => {
        console.log('Error from onEditBug ->', err)
        showErrorMsg('Cannot update bug')
      })
  }
  function onSetFilterBy(filterBy) {
    setFilterBy(prevFilter => ({ ...prevFilter, ...filterBy }))
  }

  return (
    <main>
      <h3>Bugs App</h3>
      <main>
        <BugFilter pageCount={pageCount} filterBy={filterBy} setFilterBy={setFilterBy} onSetFilterBy={debouncedSetFilterBy.current} />
        <button onClick={onAddBug}>Add Bug ⛐</button>
        <BugList bugs={bugs} onRemoveBug={onRemoveBug} onEditBug={onEditBug} />
      </main>
    </main>
  )
}
