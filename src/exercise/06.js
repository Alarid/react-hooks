// useEffect: HTTP requests
// http://localhost:3000/isolated/exercise/06.js

import * as React from 'react'
import {
  PokemonForm,
  fetchPokemon,
  PokemonInfoFallback,
  PokemonDataView,
} from '../pokemon'

const Status = {
  IDLE: 'idle',
  PENDING: 'pending',
  RESOLVED: 'resolved',
  REJECTED: 'rejected',
}

function PokemonInfo({pokemonName}) {
  const [state, setState] = React.useState({
    pokemon: null,
    error: null,
    status: Status.IDLE,
  })
  const {pokemon, error, status} = state

  React.useEffect(() => {
    if (!pokemonName) return
    setState({status: Status.PENDING})
    fetchPokemon(pokemonName).then(
      pokemon => setState({pokemon, status: Status.RESOLVED}),
      error => setState({error, status: Status.REJECTED}),
    )
  }, [pokemonName])

  if (status === Status.REJECTED) {
    return (
      <div role="alert">
        There was an error:
        <pre style={{whiteSpace: 'normal'}}>{error.message}</pre>
      </div>
    )
  } else if (status === Status.PENDING) {
    return <PokemonInfoFallback name={pokemonName} />
  } else if (status === Status.RESOLVED) {
    return <PokemonDataView pokemon={pokemon} />
  } else {
    return 'Submit a pokemon'
  }
}

function App() {
  const [pokemonName, setPokemonName] = React.useState('')

  function handleSubmit(newPokemonName) {
    setPokemonName(newPokemonName)
  }

  return (
    <div className="pokemon-info-app">
      <PokemonForm pokemonName={pokemonName} onSubmit={handleSubmit} />
      <hr />
      <div className="pokemon-info">
        <PokemonInfo pokemonName={pokemonName} />
      </div>
    </div>
  )
}

export default App
