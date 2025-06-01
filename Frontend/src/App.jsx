import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'
import './App.css'
import LandingPage from './pages/LandingPage'
import AboutPage from './pages/AboutPage'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Register from './pages/Register'
import Loginpage from './pages/Loginpage'

function App() {

  return (
    <>
      <Router>
        <Navbar />
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path='/about' element={<AboutPage />} />
          <Route path='/register' element={<Register />} />
          <Route path='/login' element={<Loginpage />} />
        </Routes>
        <Footer />
      </Router>
    </>
  )
}

export default App
