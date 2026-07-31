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
        <Route path="/" element={<HomePage onOpenModal={handleOpenModal} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/select-grade" element={<SelectGrade />} />
        <Route path="/select-path" element={<SelectPath />} />
        <Route path="/select-specialization" element={<SelectSpecialization />} />
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
