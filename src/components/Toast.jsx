import React from 'react';
import { CheckCircle2 } from 'lucide-react';

export default function Toast({ message, visible }) {
  return (
    <div className={`toast-notification ${visible ? 'active' : ''}`}>
      <CheckCircle2 size={20} style={{ marginLeft: '0.5rem', color: 'var(--green-logo)' }} />
      <span>{message}</span>
    </div>
  );
}
