import { Route, Routes } from 'react-router-dom'
import { Toaster } from 'react-hot-toast';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/Loginpage';
import PrivateRoute from './PrivateRoute';
import ErrorPage from './pages/ErrorPage';
import RegisterPage from './pages/Register';
import LandingPage from './pages/LandingPage';
import ShortenUrlPage from './pages/ShortenUrlPage';
import DashboardLayout from './pages/Dashboard/DashboardLayout';


const AppRouter = () => {
    return (
        <>
            <Toaster position='top-center' />
            <Navbar />
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path='/about' element={<AboutPage />} />
                <Route path="/register" element={
                    <PrivateRoute publicPage={true}>
                        <RegisterPage />
                    </PrivateRoute>
                } />
                <Route path="/login" element={
                    <PrivateRoute publicPage={true}>
                        <LoginPage />
                    </PrivateRoute>
                } />
                <Route path="/dashboard" element={
                    <PrivateRoute publicPage={false}>
                        <DashboardLayout />
                    </PrivateRoute>
                } />
                <Route path="/error" element={<ErrorPage />} />
                <Route path='/*' element={<ErrorPage message="We can't seem to find the page you're looking for" />} />
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