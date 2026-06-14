import React, { useEffect, useRef, useState } from 'react';

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onScanSuccess: (tableId: string) => void;
}

export default function QRScannerModal({ isOpen, onClose, onScanSuccess }: Props) {
  const [cameraActive, setCameraActive] = useState(false);
  const [scanned, setScanned] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  const [prevIsOpen, setPrevIsOpen] = useState(isOpen);
  if (isOpen !== prevIsOpen) {
    setPrevIsOpen(isOpen);
    setScanned(false);
  }

  useEffect(() => {
    if (!isOpen) return;

    let isMounted = true;

    // Request camera stream
    navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
      .then((stream) => {
        if (isMounted) {
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.setAttribute('playsinline', 'true');
            videoRef.current.play().catch(e => console.error("Error playing video:", e));
          }
          setCameraActive(true);
        }
      })
      .catch((err) => {
        console.warn("Camera permission denied or not available, falling back to simulation:", err);
        if (isMounted) {
          setCameraActive(false);
        }
      });

    // Simulated scanning timeout
    const scanTimer = setTimeout(() => {
      if (isMounted) {
        setScanned(true);

        // Play brief beep sound using Web Audio API
        try {
          const audioCtx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
          const oscillator = audioCtx.createOscillator();
          const gainNode = audioCtx.createGain();
          oscillator.connect(gainNode);
          gainNode.connect(audioCtx.destination);
          oscillator.type = 'sine';
          oscillator.frequency.value = 1000;
          gainNode.gain.setValueAtTime(0.08, audioCtx.currentTime);
          oscillator.start();
          oscillator.stop(audioCtx.currentTime + 0.12);
        } catch (e) {
          console.warn("Audio beep failed:", e);
        }

        // Wait a bit to let the user see the success checkmark
        setTimeout(() => {
          if (isMounted) {
            onScanSuccess('T07'); // Default mock table
          }
        }, 1000);
      }
    }, 2800);

    return () => {
      isMounted = false;
      clearTimeout(scanTimer);
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
    };
  }, [isOpen, onScanSuccess]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-[#0f0f12]/95 backdrop-blur-md z-[200] flex flex-col items-center justify-between p-6 text-white animate-fadeIn">
      <style>{`
        @keyframes scan-line {
          0%, 100% { top: 16px; }
          50% { top: calc(100% - 16px); }
        }
        @keyframes pulse-viewfinder {
          0%, 100% { opacity: 0.4; }
          50% { opacity: 0.8; }
        }
        .animate-scan-line {
          animation: scan-line 2.2s ease-in-out infinite;
        }
        .animate-pulse-viewfinder {
          animation: pulse-viewfinder 2s ease-in-out infinite;
        }
      `}</style>

      {/* Header */}
      <div className="w-full flex justify-between items-center max-w-md mt-4">
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-sd-primary-container text-[24px]">qr_code_scanner</span>
          <h3 className="text-lg font-bold font-sans tracking-wide">Scan Table QR</h3>
        </div>
        <button
          onClick={onClose}
          className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center hover:bg-white/20 active:scale-95 transition-all"
        >
          <span className="material-symbols-outlined text-[20px]">close</span>
        </button>
      </div>

      {/* Central Viewfinder Area */}
      <div className="flex flex-col items-center justify-center my-auto">
        <div className="relative w-64 h-64 rounded-[2rem] overflow-hidden border border-white/10 bg-black/50 shadow-2xl flex items-center justify-center">
          {/* Camera feed or mock visualization */}
          {cameraActive ? (
            <video
              ref={videoRef}
              className="w-full h-full object-cover rounded-[2rem]"
              muted
              playsInline
            />
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-6 gap-3 select-none">
              <div className="w-20 h-20 bg-sd-primary-container/10 border border-sd-primary-container/30 rounded-2xl flex items-center justify-center text-sd-primary-container animate-pulse">
                <span className="material-symbols-outlined text-5xl">qr_code_2</span>
              </div>
              <div>
                <p className="text-sm font-bold font-sans">Connecting Camera Feed...</p>
                <p className="text-[11px] text-white/50 font-sans mt-0.5 max-w-[180px]">Demo mode will automatically scan Table T07</p>
              </div>
            </div>
          )}

          {/* Viewfinder borders overlay */}
          {!scanned && (
            <>
              {/* Corner brackets */}
              <div className="absolute top-4 left-4 w-6 h-6 border-t-[4px] border-l-[4px] border-sd-primary-container rounded-tl-lg" />
              <div className="absolute top-4 right-4 w-6 h-6 border-t-[4px] border-r-[4px] border-sd-primary-container rounded-tr-lg" />
              <div className="absolute bottom-4 left-4 w-6 h-6 border-b-[4px] border-l-[4px] border-sd-primary-container rounded-bl-lg" />
              <div className="absolute bottom-4 right-4 w-6 h-6 border-b-[4px] border-r-[4px] border-sd-primary-container rounded-br-lg" />

              {/* Scanning Red Laser Line */}
              <div className="absolute left-4 right-4 h-[3px] bg-sd-primary-container shadow-[0_0_12px_#ff5c00] rounded-full animate-scan-line" />
            </>
          )}

          {/* Success Checkmark Overlay */}
          {scanned && (
            <div className="absolute inset-0 bg-[#0f0f12]/85 flex flex-col items-center justify-center gap-3 animate-fadeIn">
              <div className="w-20 h-20 bg-sd-secondary rounded-full flex items-center justify-center text-white shadow-[0_4px_20px_rgba(0,110,47,0.4)] scale-110 transition-transform">
                <span className="material-symbols-outlined text-4xl font-bold">done</span>
              </div>
              <p className="text-sm font-bold font-sans text-sd-secondary-container">Scanned successfully!</p>
            </div>
          )}
        </div>

        {/* Caption */}
        {!scanned && (
          <p className="text-xs text-white/70 font-sans text-center mt-6 max-w-xs px-4">
            Point your device camera at the Smart Dining QR code placed on your table
          </p>
        )}
      </div>

      {/* Footer Info */}
      <div className="w-full max-w-xs flex items-center justify-center gap-2.5 px-4 py-3 bg-white/5 rounded-2xl border border-white/5 mb-4 select-none">
        <span className="material-symbols-outlined text-white/50 text-[18px]">info</span>
        <span className="text-[11px] text-white/60 font-sans font-medium">Scanning automatically configures your table</span>
      </div>
    </div>
  );
}
