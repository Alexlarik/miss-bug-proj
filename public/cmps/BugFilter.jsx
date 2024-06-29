const { useState, useEffect } = React

export function BugFilter({ filterBy, pageCount, onSetFilterBy }) {
    const [filterByToEdit, setFilterByToEdit] = useState(filterBy)

    useEffect(() => {
        onSetFilterBy(filterByToEdit)
    }, [filterByToEdit])

    function handleChange({ target }) {
        const field = target.name
        const value = target.type === 'number' ? +target.value || '' : target.value
        setFilterByToEdit(prevFilter => ({ ...prevFilter, [field]: value, pageIdx: 0 }))
    }

    // function onApplyFilter() {
    //     setFilterBy(filterByToEdit)
    // }

    function onGetPage(diff) {
        let pageIdx = filterByToEdit.pageIdx + diff
        if (pageIdx < 0) pageIdx = pageCount - 1
        if (pageIdx > pageCount - 1) pageIdx = 0
        setFilterByToEdit(prev => ({ ...prev, pageIdx }))
    }

    const { txt, minSeverity, sortBy, sortDir } = filterByToEdit

    return (
        <section className="bug-filter full main-layout">
            <h2>Filter Our Bugs</h2>
            <div>
                <label htmlFor="txt">Text:</label>
                <input
                    value={txt}
                    onChange={handleChange}
                    name="txt"
                    id="txt"
                    type="text"
                    placeholder="By Text"
                />
            </div>
            <div>
                <label htmlFor="minSeverity">Min Severity:</label>
                <input
                    value={minSeverity}
                    onChange={handleChange}
                    type="number"
                    name="minSeverity"
                    id="minSeverity"
                    placeholder="By min Severity"
                />
            </div>
            <div>
                <label htmlFor="sortBy">Sort by:</label>
                <select name="sortBy" value={sortBy} onChange={handleChange}>
                    <option value="">Select Sorting</option>
                    <option value="title">Title</option>
                    <option value="severity">Severity</option>
                    <option value="createdAt">Created At</option>
                </select>
                <label htmlFor="sortDir">Sort descending:</label>
                <input
                    type="checkbox"
                    name="sortDir"
                    id="sortDir"
                    checked={sortDir === -1}
                    onChange={handleChange}
                />
                <button onClick={() => onGetPage(-1)}>-</button>
                <span>{filterByToEdit.pageIdx + 1}</span>
                <button onClick={() => onGetPage(1)}>+</button>
            </div>
            {/* <button onClick={onApplyFilter}>Apply Filter</button> */}
        </section>
    )
}