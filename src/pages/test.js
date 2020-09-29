import React, { useState, useEffect } from 'react'

export default function Hooks() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [name, setName] = useState('Page')
  const [surname, setSurname] = useState('Title')
  const width = useWindowWidth()
  const [size, setSize] = useState('')

  const handleToggleMenu = () => setIsMenuOpen((state) => !state)
  const handleInputName = (e) => setName(e.target.value)
  const handleInputSurname = (e) => setSurname(e.target.value)
  const handleSelection = (e) => setSize(e.target.value)

  useEffect(() => {
    document.title = name + ' ' + surname
  })

  return (
    <>
      <nav>
        <button onClick={handleToggleMenu}>Open</button>
        {isMenuOpen ? (
          <ul>
            <li>Some</li>
            <li>Menu</li>
            <li>Items</li>
          </ul>
        ) : null}
      </nav>

      <div>
        <button disabled={!isMenuOpen}>Available</button>
      </div>

      <section>
        <input value={name} onChange={handleInputName} />
        <input value={surname} onChange={handleInputSurname} />
      </section>

      <section>{width}</section>

      <section>
        <label htmlFor="size">Filter for a size</label>
        <select value={size} onChange={handleSelection}>
          <option value="">All Sizes</option>
          <option value="2"> 2</option>
          <option value="4">4</option>
          <option value="5">5</option>
          <option value="6">6</option>
        </select>
      </section>
    </>
  )
}

// CustomHooks - We can write them inside render or we can just seperate them to make code cleaner

function useWindowWidth() {
  const [width, setWith] = useState(window.innerWidth)
  useEffect(() => {
    const handleResize = () => setWith(window.innerWidth)
    window.addEventListener('resize', handleResize)
    return () => {
      window.removeEventListener('resize', handleResize)
    }
  })
  return width
}
