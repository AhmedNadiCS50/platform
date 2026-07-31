import React, { useState } from 'react';
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
    <div>
      {/* Floating ambient mesh lights */}
      <div className="mesh-bg-light-1" />
      <div className="mesh-bg-light-2" />

      {/* Animated particle canvas */}
      <GreenParticles />

      <Navbar onOpenModal={handleOpenModal} />

      <main>
        <Hero onOpenModal={handleOpenModal} />
        <Opening />
        <Features />
        <TrackSelector />
        <Foundation />
        <Experience />
        <WhyVision />
        <FAQ />
        <CTASection onOpenModal={handleOpenModal} />
      </main>

      <Footer onOpenModal={handleOpenModal} />

      <ModalPortal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        onSuccess={handleShowToast}
      />

      <Toast message={toastMessage} visible={toastVisible} />
    </div>
  );
}
