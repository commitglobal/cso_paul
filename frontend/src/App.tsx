import { useState } from 'react'
import paulLg from '/assets/paul-logo.svg'
import paulLgm from '/assets/paul-logomark.svg'
import './App.css'

function App() {
  const [count, setCount] = useState(0)

  return (
    <>
      <div>
        <a href='#' target='_blank'>
          <img src={paulLgm} className='logo' alt='Paul logomark' />
        </a>
        <a href='#' target='_blank'>
          <img src={paulLg} className='logo react' alt='Paul logo' />
        </a>
      </div>
      <h1>Paul</h1>
      <div className='card'>
        <button onClick={() => setCount((count) => count + 1)}>
          count is {count}
        </button>
        <p>
          Edit <code>src/App.tsx</code> and save to test HMR
        </p>
      </div>
      <p className='read-the-docs'>
        Click on the Vite and React logos to learn more
      </p>
    </>
  )
}

export default App
