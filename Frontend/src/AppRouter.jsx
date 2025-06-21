import { Route, Routes, useLocation } from 'react-router-dom'
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
    const location = useLocation();
    // Define known routes that should have navbar/footer
    const knownRoutes = ['/about', '/dashboard', '/register', '/login', '/error'];
    const isKnownRoute = knownRoutes.includes(location.pathname) || location.pathname === '/';

    // Check if it's a short URL redirect route (6-8 characters, alphanumeric)
    const isRedirectRoute = /^\/[a-zA-Z0-9]{6,8}$/.test(location.pathname) && !isKnownRoute;

    return (
        <>
            <Toaster
                position='top-center'
                toastOptions={{
                    duration: 4000,
                    style: {
                        background: 'white',
                        color: '#374151',
                        border: '1px solid #d1d5db',
                        borderRadius: '12px',
                        boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                        padding: '16px',
                        fontSize: '14px',
                        fontWeight: '500',
                        fontFamily: 'Inter, system-ui, sans-serif',
                        maxWidth: '420px',
                        backdropFilter: 'blur(12px)',
                    },
                    success: {
                        style: {
                            background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.95) 0%, rgba(20, 184, 166, 0.95) 100%)',
                            color: 'white',
                            border: '1px solid rgba(16, 185, 129, 0.3)',
                            boxShadow: '0 20px 25px -5px rgba(16, 185, 129, 0.2), 0 10px 10px -5px rgba(16, 185, 129, 0.1)',
                        },
                        iconTheme: {
                            primary: 'white',
                            secondary: 'rgba(16, 185, 129, 1)',
                        },
                    },
                    error: {
                        style: {
                            background: 'linear-gradient(135deg, rgba(239, 68, 68, 0.95) 0%, rgba(220, 38, 38, 0.95) 100%)',
                            color: 'white',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            boxShadow: '0 20px 25px -5px rgba(239, 68, 68, 0.2), 0 10px 10px -5px rgba(239, 68, 68, 0.1)',
                        },
                        iconTheme: {
                            primary: 'white',
                            secondary: 'rgba(239, 68, 68, 1)',
                        },
                    },
                    loading: {
                        style: {
                            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.95) 0%, rgba(37, 99, 235, 0.95) 100%)',
                            color: 'white',
                            border: '1px solid rgba(59, 130, 246, 0.3)',
                            boxShadow: '0 20px 25px -5px rgba(59, 130, 246, 0.2), 0 10px 10px -5px rgba(59, 130, 246, 0.1)',
                        },
                        iconTheme: {
                            primary: 'white',
                            secondary: 'rgba(59, 130, 246, 1)',
                        },
                    },
                }}
            />
            {!isRedirectRoute && <Navbar />}
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
                <Route path="/:url" element={<ShortenUrlPage />} />
            </Routes>
            {!isRedirectRoute && <Footer />}
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