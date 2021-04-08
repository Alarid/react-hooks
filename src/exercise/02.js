// useEffect: persistent state
// http://localhost:3000/isolated/exercise/02.js

import * as React from 'react'

function useLocalStorage(item, defaultValue = '') {
  const [value, setValue] = React.useState(
    () => window.localStorage.getItem(item) || defaultValue,
  )

  React.useEffect(() => {
    window.localStorage.setItem(item, value)
  }, [value, item])

  return [value, setValue]
}

function Greeting({initialName}) {
  const [name, setName] = useLocalStorage('name', initialName)

  function handleChange(event) {
    setName(event.target.value)
  }
  return (
    <div>
      <form>
        <label htmlFor="name">Name: </label>
        <input value={name} onChange={handleChange} id="name" />
      </form>
      {name ? <strong>Hello {name}</strong> : 'Please type your name'}
    </div>
  )
}

function App() {
  return <Greeting />
}

export default App
