import { Login } from '../components/auth/login'
import { Register } from '../components/auth/register'
import { ForgotPassword } from '../components/auth/forgotPassword'
import { NotFound } from '../components/notfound'
import { Home } from '../components/landing/home'
import { Dashboard } from '../components/dashboard/dashboard'
import { Insights } from '../components/insights'
import { FindMentor } from '../components/findMentor'
import { MentorView } from '../components/mentorView'
import { ChangePassword } from '../components/auth/changePassword'
import { LiveWebinars } from '../components/liveWebinars'
import { Blog } from '../components/blog'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'


import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/register' element={<Register />} />
        <Route path='/forgot-password' element={<ForgotPassword />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/insights' element={<Insights />} />
        <Route path='/find-mentor' element={<FindMentor />} />
        <Route path='/mentor/:id?' element={<MentorView />} />
        <Route path='/live-webinars' element={<LiveWebinars />} />
        <Route path='/change-password' element={<ChangePassword />} />
        <Route path='/blog/:id' element={<Blog />} />
        <Route path='*' element={<NotFound />} />
      </Routes>
    </Router>
  )
}

export default App
