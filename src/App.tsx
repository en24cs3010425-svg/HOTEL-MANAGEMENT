import React, { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.tsx';
import { BookingProvider } from './context/BookingContext.tsx';
import { Navbar } from './components/Navbar.tsx';
import { Footer } from './components/Footer.tsx';

// Pages
import { HomePage } from './pages/HomePage.tsx';
import { RoomsPage } from './pages/RoomsPage.tsx';
import { RoomDetailsPage } from './pages/RoomDetailsPage.tsx';
import { SearchAvailabilityPage } from './pages/SearchAvailabilityPage.tsx';
import { BookingPage } from './pages/BookingPage.tsx';
import { BookingConfirmationPage } from './pages/BookingConfirmationPage.tsx';
import { LoginPage } from './pages/LoginPage.tsx';
import { RegisterPage } from './pages/RegisterPage.tsx';
import { MyBookingsPage } from './pages/MyBookingsPage.tsx';
import { UserProfilePage } from './pages/UserProfilePage.tsx';
import { AdminDashboardPage } from './pages/AdminDashboardPage.tsx';
import { RoomManagementPage } from './pages/RoomManagementPage.tsx';
import { BookingManagementPage } from './pages/BookingManagementPage.tsx';
import { GuestManagementPage } from './pages/GuestManagementPage.tsx';
import { StaffManagementPage } from './pages/StaffManagementPage.tsx';
import { PaymentReportsPage } from './pages/PaymentReportsPage.tsx';
import { AboutPage } from './pages/AboutPage.tsx';
import { ContactPage } from './pages/ContactPage.tsx';

function MainRouter() {
  const [currentPage, setCurrentPage] = useState<string>('home');
  const [pageParams, setPageParams] = useState<Record<string, string>>({});
  const { user, role, isAuthenticated } = useAuth();

  const handleNavigate = (page: string, params?: Record<string, string>) => {
    setCurrentPage(page);
    if (params) setPageParams(params);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return <HomePage onNavigate={handleNavigate} />;

      case 'rooms':
        return <RoomsPage onNavigate={handleNavigate} />;

      case 'room-details':
        return <RoomDetailsPage roomId={pageParams.roomId} onNavigate={handleNavigate} />;

      case 'availability':
        return <SearchAvailabilityPage onNavigate={handleNavigate} />;

      case 'booking':
        return <BookingPage onNavigate={handleNavigate} />;

      case 'booking-confirmation':
        return <BookingConfirmationPage onNavigate={handleNavigate} />;

      case 'login':
        return <LoginPage onNavigate={handleNavigate} />;

      case 'register':
        return <RegisterPage onNavigate={handleNavigate} />;

      case 'my-bookings':
        return <MyBookingsPage onNavigate={handleNavigate} />;

      case 'profile':
        return <UserProfilePage />;

      case 'admin-dashboard':
        return <AdminDashboardPage onNavigate={handleNavigate} />;

      case 'room-management':
        return <RoomManagementPage />;

      case 'booking-management':
        return <BookingManagementPage />;

      case 'guest-management':
        return <GuestManagementPage />;

      case 'staff-management':
        return <StaffManagementPage />;

      case 'payment-reports':
        return <PaymentReportsPage />;

      case 'about':
        return <AboutPage onNavigate={handleNavigate} />;

      case 'contact':
        return <ContactPage />;

      default:
        return <HomePage onNavigate={handleNavigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#faf8f5] font-sans antialiased text-slate-900 selection:bg-amber-500 selection:text-slate-950">
      <Navbar currentPage={currentPage} onNavigate={handleNavigate} />
      <main className="flex-1">
        {renderCurrentPage()}
      </main>
      <Footer onNavigate={handleNavigate} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <BookingProvider>
        <MainRouter />
      </BookingProvider>
    </AuthProvider>
  );
}
