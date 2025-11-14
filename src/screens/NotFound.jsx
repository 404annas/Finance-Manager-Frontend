import { useState, useEffect } from 'react';

const NotFound = () => {
  // 1. State for mouse tracking (parallax effect)
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);

  // 💡 Naya State: Loading state ko manage karne ke liye
  const [isLoading, setIsLoading] = useState(true); // Default to true

  // Effect for mouse tracking (parallax)
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({
        x: (e.clientX / window.innerWidth - 0.5) * 20,
        y: (e.clientY / window.innerHeight - 0.5) * 20
      });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  // 💡 Effect for simulated loading delay
  useEffect(() => {
    // 2 second ka delay
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 2000);
    return () => clearTimeout(timer); // Cleanup
  }, []);

  // --- 💀 Skeleton Loader Component ---
  // Yeh woh cheez hai jo load hote waqt dikhegi
  const SkeletonLoader = () => (
    <div className="relative z-10 text-center px-6 transition-opacity duration-500 w-full max-w-md mx-auto">
      {/* Illustration area skeleton (Mimics empty wallet SVG size) */}
      <div className="mb-6 flex justify-center">
        <div className="w-40 h-32 bg-gray-800 rounded-lg animate-pulse shadow-md"></div>
      </div>

      {/* 404 Number skeleton */}
      <div className="relative mb-4">
        <div className="w-3/5 h-16 mx-auto bg-gray-700 rounded-md animate-pulse"></div>
      </div>

      {/* Text Content / Glass Morphism Card skeleton */}
      <div className="backdrop-blur-md bg-white/5 rounded-3xl p-6 border border-white/10 shadow-2xl mb-6 max-w-md mx-auto">
        {/* Heading skeleton */}
        <div className="w-4/5 h-6 mb-3 mx-auto bg-gray-600 rounded animate-pulse"></div>

        {/* Paragraph lines skeleton */}
        <div className="w-11/12 h-4 mb-2 mx-auto bg-gray-700 rounded animate-pulse"></div>
        <div className="w-10/12 h-4 mb-5 mx-auto bg-gray-700 rounded animate-pulse"></div>

        {/* Button skeleton (Full width jaisa button hai) */}
        <div className="w-full h-12 mx-auto bg-gray-600 rounded-full animate-pulse"></div>
      </div>

      {/* Status indicator skeleton */}
      <div className="flex justify-center gap-4 text-xs text-gray-400">
        <div className="w-36 h-6 bg-gray-800 rounded-full animate-pulse"></div>
      </div>
    </div>
  );

  // --- Actual Content Component ---
  // Aapke original component ka content
  const ActualContent = () => (
    // 💡 Transition class added for smooth fade-in
    <div className={`relative z-10 text-center px-6 max-w-4xl transition-opacity duration-1000 ${isLoading ? 'opacity-0' : 'opacity-100'}`}>

      {/* Empty wallet illustration (SVG code from your input) */}
      <div className="mb-6 flex justify-center">
        <svg width="180" height="140" viewBox="0 0 180 140" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-80">
          {/* SVG code here... (Wallet, Sad Face, Broken Links) */}
          <rect x="30" y="40" width="120" height="80" rx="8" fill="#1a1a1a" stroke="#6667DD" strokeWidth="2" />
          <path d="M 30 45 L 30 35 Q 30 30 35 30 L 145 30 Q 150 30 150 35 L 150 45" fill="#0a0a0a" stroke="#6667DD" strokeWidth="2" />
          <line x1="40" y1="55" x2="140" y2="55" stroke="#6667DD" strokeWidth="1" opacity="0.3" />
          <line x1="40" y1="65" x2="100" y2="65" stroke="#6667DD" strokeWidth="1" opacity="0.3" />
          <circle cx="70" cy="85" r="3" fill="#60a5fa" />
          <circle cx="110" cy="85" r="3" fill="#60a5fa" />
          <path d="M 75 100 Q 90 95 105 100" stroke="#60a5fa" strokeWidth="2" fill="none" strokeLinecap="round" />
          <g opacity="0.6">
            <rect x="100" y="10" width="25" height="15" rx="2" fill="#10b981" stroke="#000" strokeWidth="1">
              <animate attributeName="y" values="10;-10;10" dur="3s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.6;0.2;0.6" dur="3s" repeatCount="indefinite" />
            </rect>
            <text x="112.5" y="20" fontSize="10" fontWeight="bold" fill="#000" textAnchor="middle">
              $
              <animate attributeName="y" values="20;0;20" dur="3s" repeatCount="indefinite" />
            </text>
          </g>
          <g opacity="0.6">
            <rect x="55" y="15" width="25" height="15" rx="2" fill="#10b981" stroke="#000" strokeWidth="1">
              <animate attributeName="y" values="15;-5;15" dur="2.5s" repeatCount="indefinite" />
              <animate attributeName="opacity" values="0.6;0.2;0.6" dur="2.5s" repeatCount="indefinite" />
            </rect>
            <text x="67.5" y="25" fontSize="10" fontWeight="bold" fill="#000" textAnchor="middle">
              $
              <animate attributeName="y" values="25;5;25" dur="2.5s" repeatCount="indefinite" />
            </text>
          </g>
          <g transform="translate(20, 70)">
            <circle cx="0" cy="0" r="8" fill="none" stroke="#ef4444" strokeWidth="2" />
            <line x1="-5" y1="-5" x2="5" y2="5" stroke="#ef4444" strokeWidth="2" />
          </g>
          <g transform="translate(160, 70)">
            <circle cx="0" cy="0" r="8" fill="none" stroke="#ef4444" strokeWidth="2" />
            <line x1="-5" y1="-5" x2="5" y2="5" stroke="#ef4444" strokeWidth="2" />
          </g>
        </svg>
      </div>

      {/* 404 Number with glitch effect */}
      <div className="relative mb-4">
        <h1
          className="text-7xl md:text-9xl p-black bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-purple-500 to-purple-300 animate-gradient select-none"
          style={{
            transform: `perspective(500px) rotateX(${mousePosition.y * 0.1}deg) rotateY(${mousePosition.x * 0.1}deg)`
          }}
        >
          404
        </h1>
        {/* Glitch layers */}
        <h1 className="absolute top-0 left-0 right-0 text-7xl md:text-9xl p-black opacity-30 animate-glitch select-none" style={{ color: '#6667DD' }}>
          404
        </h1>
        <h1 className="absolute top-0 left-0 right-0 text-7xl md:text-9xl p-black text-cyan-400 opacity-30 animate-glitch-reverse select-none">
          404
        </h1>
      </div>

      {/* Text content with glass morphism */}
      <div className="backdrop-blur-md bg-white/5 rounded-3xl p-6 border border-white/10 shadow-2xl mb-6 max-w-md mx-auto">
        <h2 className="text-2xl md:text-3xl p-bold mb-3 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-300">
          Page Not Found
        </h2>
        <p className="text-gray-300 text-sm mb-5 leading-relaxed">
          Oops! This page has gone missing from our financial portal. Let's get you back to managing your finances.
        </p>

        {/* Button with hover effect */}
        <button
          onClick={() => window.location.href = '/'}
          onMouseEnter={() => setIsHovering(true)}
          onMouseLeave={() => setIsHovering(false)}
          className="group relative inline-flex items-center justify-center px-6 py-3 text-base p-semibold text-white transition-all duration-300 ease-out rounded-full overflow-hidden w-full cursor-pointer"
        >
          {/* Button background */}
          <span className="absolute inset-0 transition-transform duration-300 group-hover:scale-105" style={{ backgroundColor: '#6667DD' }} />

          {/* Shine effect */}
          <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-0 group-hover:opacity-30 duration-500 transform transition-all -skew-x-12 group-hover:translate-x-full" />

          {/* Button text */}
          <span className="relative flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            Back to Dashboard
            <svg
              className={`w-4 h-4 transition-transform duration-300 ${isHovering ? 'translate-x-1' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
            </svg>
          </span>
        </button>
      </div>

      {/* Status indicator */}
      <div className="flex justify-center gap-4 text-xs text-gray-400">
        <div className="flex items-center gap-2 backdrop-blur-sm bg-white/5 px-3 py-1.5 rounded-full border border-white/10">
          <svg className="w-3 h-3 text-green-500" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
          </svg>
          <span>Secure & Encrypted</span>
        </div>
      </div>
    </div>
  );
  // -------------------------------------

  return (
    <div className="relative flex flex-col items-center justify-center min-h-screen bg-black text-white overflow-hidden">

      {/* Animated background elements (Blobs) */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className="absolute w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"
          style={{
            top: '20%',
            left: '20%',
            backgroundColor: '#6667DD',
            transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`
          }}
        />
        <div
          className="absolute w-96 h-96 bg-cyan-400 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"
          style={{
            top: '40%',
            right: '20%',
            transform: `translate(${-mousePosition.x}px, ${-mousePosition.y}px)`
          }}
        />
        <div
          className="absolute w-96 h-96 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"
          style={{
            bottom: '20%',
            left: '40%',
            backgroundColor: '#6667DD',
            transform: `translate(${mousePosition.y}px, ${mousePosition.x}px)`
          }}
        />
      </div>

      {/* Grid pattern overlay */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10" />

      {/* Floating currency symbols (Remains visible during loading for aesthetic background) */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute text-4xl font-bold opacity-5" style={{ top: '10%', left: '15%', color: '#6667DD' }}>$</div>
        <div className="absolute text-3xl font-bold opacity-5" style={{ top: '25%', right: '20%', color: '#60a5fa' }}>€</div>
        <div className="absolute text-3xl font-bold opacity-5" style={{ bottom: '30%', left: '10%', color: '#6667DD' }}>£</div>
        <div className="absolute text-4xl font-bold opacity-5" style={{ bottom: '15%', right: '15%', color: '#60a5fa' }}>¥</div>
      </div>

      {/* Conditional Rendering: Skeleton or Actual Content */}
      {isLoading ? <SkeletonLoader /> : <ActualContent />}

      {/* Global/Component Styles */}
      <style jsx>{`
                @keyframes blob {
                    0%, 100% { transform: translate(0, 0) scale(1); }
                    33% { transform: translate(30px, -50px) scale(1.1); }
                    66% { transform: translate(-20px, 20px) scale(0.9); }
                }

                @keyframes gradient {
                    0%, 100% { background-position: 0% 50%; }
                    50% { background-position: 100% 50%; }
                }

                @keyframes glitch {
                    0%, 100% { transform: translate(0); }
                    20% { transform: translate(-2px, 2px); }
                    40% { transform: translate(-2px, -2px); }
                    60% { transform: translate(2px, 2px); }
                    80% { transform: translate(2px, -2px); }
                }

                @keyframes glitch-reverse {
                    0%, 100% { transform: translate(0); }
                    20% { transform: translate(2px, -2px); }
                    40% { transform: translate(2px, 2px); }
                    60% { transform: translate(-2px, -2px); }
                    80% { transform: translate(-2px, 2px); }
                }

                .animate-blob {
                    animation: blob 7s infinite;
                }

                .animation-delay-2000 {
                    animation-delay: 2s;
                }

                .animation-delay-4000 {
                    animation-delay: 4s;
                }

                .animate-gradient {
                    background-size: 200% 200%;
                    animation: gradient 3s ease infinite;
                }

                .animate-glitch {
                    animation: glitch 1s infinite;
                }

                .animate-glitch-reverse {
                    animation: glitch-reverse 1s infinite;
                }

                .bg-grid-pattern {
                    background-image: 
                        linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px),
                        linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px);
                    background-size: 50px 50px;
                }
            `}</style>
    </div>
  );
};

export default NotFound;