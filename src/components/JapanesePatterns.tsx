"use client";

export const SeigaihaPattern = ({ className = "" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <pattern id="seigaiha" x="0" y="0" width="40" height="20" patternUnits="userSpaceOnUse">
        <path
          d="M0 20 Q10 10 20 20 T40 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          opacity="0.3"
        />
        <path
          d="M-10 20 Q0 10 10 20 T30 20"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.5"
          opacity="0.2"
        />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#seigaiha)" />
  </svg>
);

export const AsanohaPattern = ({ className = "" }: { className?: string }) => (
  <svg
    className={className}
    viewBox="0 0 100 100"
    xmlns="http://www.w3.org/2000/svg"
  >
    <defs>
      <pattern id="asanoha" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
        <polygon
          points="15,0 30,15 15,30 0,15"
          fill="none"
          stroke="currentColor"
          strokeWidth="0.3"
          opacity="0.2"
        />
        <line x1="15" y1="0" x2="15" y2="30" stroke="currentColor" strokeWidth="0.3" opacity="0.15" />
        <line x1="0" y1="15" x2="30" y2="15" stroke="currentColor" strokeWidth="0.3" opacity="0.15" />
      </pattern>
    </defs>
    <rect width="100%" height="100%" fill="url(#asanoha)" />
  </svg>
);

export const CirclePattern = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 200 200" xmlns="http://www.w3.org/2000/svg">
    <circle cx="100" cy="100" r="80" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.2" />
    <circle cx="100" cy="100" r="60" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.15" />
    <circle cx="100" cy="100" r="40" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.1" />
    <circle cx="100" cy="100" r="20" fill="none" stroke="currentColor" strokeWidth="0.5" opacity="0.1" />
  </svg>
);

export const BrushStroke = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 200 50" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M5 25 Q50 5 100 25 T195 25"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      className="brush-stroke-animate"
    />
  </svg>
);

export const WaveDecoration = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 1440 100" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none">
    <path
      d="M0 50 Q180 0 360 50 T720 50 T1080 50 T1440 50 V100 H0 Z"
      fill="currentColor"
    />
  </svg>
);

export const ChopsticksDivider = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 40" xmlns="http://www.w3.org/2000/svg">
    <line x1="20" y1="5" x2="35" y2="35" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    <line x1="65" y1="35" x2="80" y2="5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
  </svg>
);

export const EnsoCircle = ({ className = "" }: { className?: string }) => (
  <svg className={className} viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M50 5 A45 45 0 1 1 45 5"
      fill="none"
      stroke="currentColor"
      strokeWidth="4"
      strokeLinecap="round"
      opacity="0.8"
    />
  </svg>
);