import React from 'react';

export default function LogoSvg({ width = 34, height = 34 }) {
  return (
    <svg viewBox="0 0 100 100" width={width} height={height} xmlns="http://www.w3.org/2000/svg">
      {/* Head Silhouette in Emerald Green */}
      <path d="M 22 85 H 52 V 76 C 62 76 72 70 72 58 V 53 H 77 L 72 45 L 77 36 C 72 20 56 12 38 12 C 22 12 10 24 10 48 V 85 Z" fill="#28C748"/>
      {/* Lightbulb Cutout in Pure White */}
      <path d="M 38 24 C 30 24 24 30 24 38 C 24 43 27 48 31 51 V 57 H 45 V 51 C 49 48 52 43 52 38 C 52 30 46 24 38 24 Z" fill="#FFFFFF"/>
      <rect x="31" y="59" width="14" height="3" rx="1.5" fill="#28C748"/>
      {/* Eye Dot in Pure White */}
      <circle cx="62" cy="48" r="3.5" fill="#FFFFFF"/>
    </svg>
  );
}
