import { Route, Routes } from 'react-router-dom'
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import AboutPage from './pages/AboutPage';
import RegisterPage from './pages/Register';
import LoginPage from './pages/Loginpage';
import DashboardLayout from './pages/Dashboard/DashboardLayout';
import Footer from './components/Footer';
import { Toaster } from 'react-hot-toast';
import ShortenUrlPage from './pages/ShortenUrlPage';


const AppRouter = () => {
    return (
        <>
            <Toaster position='top-center' />
            <Navbar />
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path='/about' element={<AboutPage />} />
                <Route path='/register' element={<RegisterPage />} />
                <Route path='/login' element={<LoginPage />} />
                <Route path='/dashboard/*' element={<DashboardLayout />} />
            </Routes>
            <Footer />
        </>
    );
}

export default AppRouter;

export const SubDomainRouter = () => {
    return (
        <Routes>
            <Route path="/:url" element={<ShortenUrlPage />} />
        </Routes>
    )
}