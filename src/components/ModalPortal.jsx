import React, { useState } from 'react';
import LogoSvg from './LogoSvg';
import { X, CheckCircle2 } from 'lucide-react';

export default function ModalPortal({ isOpen, onClose, onSuccess }) {
  const [name, setName] = useState('');
  const [grade, setGrade] = useState('');
  const [track, setTrack] = useState('');

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onSuccess('تم تسجيل رغبتك بنجاح! مرحبًا بك في مجتمع رؤية للبكالوريا.');
    setName('');
    setGrade('');
    setTrack('');
    onClose();
  };

  return (
    <div className={`modal-overlay ${isOpen ? 'active' : ''}`} onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose}>
          <X size={24} />
        </button>

        <div className="modal-header">
          <div className="logo-emblem" style={{ margin: '0 auto 1rem auto' }}>
            <LogoSvg width={34} height={34} />
          </div>
          <h3 className="modal-title">مرحبًا بك في منصة رؤية | VISION</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            اختر مسارك التعليمي للبدء مجانًا فورًا
          </p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label">الاسم الكامل</label>
            <input 
              type="text" 
              className="form-input" 
              placeholder="أدخل اسمك الكريم" 
              value={name}
              onChange={(e) => setName(e.target.value)}
              required 
            />
          </div>

          <div className="form-group">
            <label className="form-label">الصف الدراسي</label>
            <select 
              className="form-select" 
              value={grade}
              onChange={(e) => setGrade(e.target.value)}
              required
            >
              <option value="">اختر الصف الدراسي</option>
              <option value="1">الصف الأول البكالوريا (السنة الأولى)</option>
              <option value="2">الصف الثاني البكالوريا (السنة الثانية)</option>
            </select>
          </div>

          <div className="form-group">
            <label className="form-label">المسار الأكاديمي المستهدف</label>
            <select 
              className="form-select" 
              value={track}
              onChange={(e) => setTrack(e.target.value)}
              required
            >
              <option value="">اختر المسار المستهدف</option>
              <option value="medical">🧬 مسار الطب والعلوم الحيوية</option>
              <option value="engineering">📐 مسار الهندسة والتكنولوجيا</option>
              <option value="business">📊 مسار إدارة الأعمال والاقتصاد</option>
              <option value="arts">🎨 مسار الآداب والفنون والعلوم الإنسانية</option>
            </select>
          </div>

          <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem' }}>
            <span>ادخل إلى لوحة التعلم</span>
            <CheckCircle2 size={18} />
          </button>
        </form>
      </div>
    </div>
  );
}
