import { Login } from '../components/auth/login'
import { Register } from '../components/auth/register'
import { ForgotPassword } from '../components/auth/forgotPassword'
import { NotFound } from '../components/errorPages/notfound'
import { Home } from '../components/landing/home'
import { Dashboard } from '../components/dashboard/dashboard'
import { Insights } from '../components/insights'
import SearchResults from '../components/search/searchResults'
import { BookMentor } from '../components/booking/bookMentor'
import { ChangePassword } from '../components/auth/changePassword'
import { LiveWebinars } from '../components/liveWebinars'
import { Blog } from '../components/blogs/blog'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'


import { Toaster } from 'react-hot-toast';

import './App.css'

function App() {
  return (
    <>
      <Toaster />
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/login' element={<Login />} />
          <Route path='/register' element={<Register />} />
          <Route path='/forgot-password' element={<ForgotPassword />} />
          <Route path='/dashboard' element={<Dashboard />} />
          <Route path='/insights' element={<Insights />} />
          <Route path='/search' element={<SearchResults />} />
          <Route path='/mentor/:id?' element={<BookMentor />} />
          <Route path='/live-webinars' element={<LiveWebinars />} />
          <Route path='/change-password' element={<ChangePassword />} />
          <Route path='/blog/:id' element={<Blog />} />
          <Route path='*' element={<NotFound />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
