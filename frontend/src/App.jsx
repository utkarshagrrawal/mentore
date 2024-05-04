import { Login } from '../components/auth/login/loginPage'
import { Register } from '../components/auth/register/registerPage'
import { ForgotPassword } from '../components/auth/forgotPassword/forgotPasswordPage'
import { NotFound } from '../components/errorPages/404'
import { ServerError } from '../components/errorPages/500'
import { Home } from '../components/landing/home'
import { Dashboard } from '../components/dashboard/dashboard'
import { Insights } from '../components/insights/insights'
import { BookMentor } from '../components/booking/bookMentor'
import { SearchResults } from '../components/search/searchResults'
import { ChangePassword } from '../components/auth/changePassword/changePasswordPage'
import { WebinarsPage } from '../components/webinars/webinarsPage'
import { Qna } from '../components/qna/qna'
import { Blog } from '../components/blogs/blog'
import { Question } from '../components/qna/question'
import ErrorBoundary from '../components/errorPages/ErrorBoundary'


import { Toaster } from 'react-hot-toast';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'


function App() {
  return (
    <>
      <Toaster />
      <Router>
        <Routes>
          <Route path='/' element={<Home />} />
          <Route path='/user/login' element={<Login />} />
          <Route path='/user/register' element={<Register />} />
          <Route path='/user/forgot-password' element={<ForgotPassword />} />
          <Route path='/user/dashboard' element={<Dashboard />} />
          <Route path='/insights' element={<Insights />} />
          <Route path='/qna' element={<Qna />} />
          <Route path='/question/:id' element={<Question />} />
          <Route path='/results' element={<SearchResults />} />
          <Route path='/mentor/:id?' element={<BookMentor />} />
          <Route path='/live-webinars' element={<WebinarsPage />} />
          <Route path='/user/change-password' element={<ChangePassword />} />
          <Route path='/blog/:id' element={<Blog />} />
          <Route path='*' element={<NotFound />} />
          <Route path='/500' element={<ServerError />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
