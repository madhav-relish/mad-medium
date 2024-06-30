

import './App.css'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Signup from './pages/Signup'
import Signin from './pages/Signin'
import Blog from './pages/Blog'
import DarkModeToggle from './components/DarkModeToggle'

function App() {

  return (
    <div className=''>
      <DarkModeToggle/>
    <BrowserRouter>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
          <Route path="/blog/:id" element={<Blog />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
