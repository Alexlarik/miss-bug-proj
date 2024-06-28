const { useState, useEffect } = React

export function BugFilter({ filterBy, setFilterBy }) {
    const [filterByToEdit, setFilterByToEdit] = useState(filterBy)

    useEffect(() => {
        setFilterBy(filterByToEdit)
    }, [filterByToEdit, setFilterBy])

    function handleChange({ target }) {
        const field = target.name
        const value = target.type === 'number' ? +target.value || '' : target.value
        setFilterByToEdit((prevFilterBy) => ({ ...prevFilterBy, [field]: value }))
    }

    function onApplyFilter() {
        setFilterBy(filterByToEdit)
    }

    const { txt, minSeverity } = filterByToEdit

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
            <button onClick={onApplyFilter}>Apply Filter</button>
        </section>
    )
}