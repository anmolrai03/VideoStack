import React from 'react'
import { Link } from 'react-router-dom'

function Home() {
  return (
    <div>
      <h2 className="text-center text-2xl">Home</h2>
      <Link to="/video/tools" className='underline text-base text-blue-400'>Video tools</Link>
    </div>
  )
}

export default Home