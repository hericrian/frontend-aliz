import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from '../pages/Home/Home'
import AuthPage from '../pages/Auth/AuthPage'

export default function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<AuthPage />} />
        <Route path='/register' element={<AuthPage />} />
        <Route path='/forgot-password' element={<AuthPage />} />
        <Route path='/reset-password' element={<AuthPage />} />
      </Routes>
    </BrowserRouter>
  )
}
