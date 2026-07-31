import React, { useState } from 'react';
import { Routes, Route } from 'react-router-dom';
import GreenParticles from './components/GreenParticles';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Opening from './components/Opening';
import Features from './components/Features';
import TrackSelector from './components/TrackSelector';
import Foundation from './components/Foundation';
import Experience from './components/Experience';
import WhyVision from './components/WhyVision';
import FAQ from './components/FAQ';
import CTASection from './components/CTASection';
import ModalPortal from './components/ModalPortal';
import Toast from './components/Toast';
import Footer from './components/Footer';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import SelectGrade from './pages/SelectGrade';
import SelectPath from './pages/SelectPath';
import SelectSpecialization from './pages/SelectSpecialization';
import DashboardLayout from './layouts/DashboardLayout';
import DashboardOverview from './pages/dashboard/DashboardOverview';
import SubjectsPage from './pages/dashboard/SubjectsPage';
import SubjectDetails from './pages/dashboard/SubjectDetails';
import LessonPage from './pages/dashboard/LessonPage';
import QuizPage from './pages/dashboard/QuizPage';
import ProfilePage from './pages/dashboard/ProfilePage';
import SettingsPage from './pages/dashboard/SettingsPage';
import ProtectedRoute from './components/ProtectedRoute';

function HomePage({ onOpenModal }) {
  return (
    <div>
      {/* Floating ambient mesh lights */}
      <div className="mesh-bg-light-1" />
      <div className="mesh-bg-light-2" />

      {/* Animated particle canvas */}
      <GreenParticles />

      <Navbar onOpenModal={onOpenModal} />

      <main>
        <Hero onOpenModal={onOpenModal} />
        <Opening />
        <Features />
        <TrackSelector />
        <Foundation />
        <Experience />
        <WhyVision />
        <FAQ />
        <CTASection onOpenModal={onOpenModal} />
      </main>

      <Footer onOpenModal={onOpenModal} />
    </div>
  );
}

function PlaceholderPage({ title }) {
  return (
    <div style={{ padding: '2rem 1rem', textAlign: 'center' }}>
      <h1 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '0.8rem', fontFamily: 'var(--font-heading-ar)' }}>
        {title}
      </h1>
      <p style={{ color: 'var(--text-muted)', fontFamily: 'var(--font-body-ar)' }}>
        صفحة {title} قيد التطوير وستستعين بهذه البنية المرنة.
      </p>
    </div>
  );
}

export default function App() {
  const [modalOpen, setModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVisible, setToastVisible] = useState(false);

  const handleOpenModal = () => setModalOpen(true);
  const handleCloseModal = () => setModalOpen(false);

  const handleShowToast = (msg) => {
    setToastMessage(msg);
    setToastVisible(true);
    setTimeout(() => setToastVisible(false), 4500);
  };

  return (
    <>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage onOpenModal={handleOpenModal} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />

        {/* Protected Routes — Require Authentication */}
        <Route element={<ProtectedRoute />}>
          {/* Onboarding Routes */}
          <Route path="/select-grade" element={<SelectGrade />} />
          <Route path="/select-path" element={<SelectPath />} />
          <Route path="/select-specialization" element={<SelectSpecialization />} />

          {/* Standalone Protected Pages */}
          <Route path="/quiz/:id" element={<QuizPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/settings" element={<SettingsPage />} />

          {/* Dashboard Layout & Nested Sub-routes */}
          <Route path="/dashboard" element={<DashboardLayout />}>
            <Route index element={<DashboardOverview />} />
            <Route path="subjects" element={<SubjectsPage />} />
            <Route path="subjects/:id" element={<SubjectDetails />} />
            <Route path="lesson/:id" element={<LessonPage />} />
            <Route path="quiz/:id" element={<QuizPage />} />
            <Route path="exams" element={<QuizPage />} />
            <Route path="progress" element={<PlaceholderPage title="التقدم" />} />
            <Route path="achievements" element={<PlaceholderPage title="الإنجازات" />} />
            <Route path="profile" element={<ProfilePage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Route>
      </Routes>

      <ModalPortal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onSuccess={handleShowToast}
      />

      <Toast message={toastMessage} visible={toastVisible} />
    </>
  );
}
