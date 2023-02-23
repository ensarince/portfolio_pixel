import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import './App.scss'
import Blog from './pages/Blog/Blog'
import Contact from './pages/Contact/Contact'
import HomePage from './pages/HomePage/HomePage'
import Projects from './pages/Projects/Projects'
import Skills from './pages/Skills/Skills'

function App() {

  return (
    <div>
      <BrowserRouter>
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/projects' element={<Projects />} />
          <Route path='/skills' element={<Skills />} />
          <Route path='/blog' element={<Blog />} />
          <Route path='/contact' element={<Contact />} />
        </Routes>
      </BrowserRouter>
    </div>
  )
}

export default App
