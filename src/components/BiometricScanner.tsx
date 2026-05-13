import React, { useState, useEffect } from 'react';
import { Fingerprint, Scan, ShieldCheck, AlertCircle, Loader } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface BiometricScannerProps {
  onVerify: () => void;
}

export function BiometricScanner({ onVerify }: BiometricScannerProps) {
  const [scanning, setScanning] = useState(false);
  const [progress, setProgress] = useState(0);
  const [status, setStatus] = useState<'idle' | 'scanning' | 'success' | 'checking'>('idle');

  const startScan = () => {
    setScanning(true);
    setStatus('scanning');
    setProgress(0);
  };

  useEffect(() => {
    if (scanning && progress < 100) {
      const timer = setTimeout(() => setProgress(prev => prev + 2), 50);
      return () => clearTimeout(timer);
    } else if (progress >= 100 && status === 'scanning') {
      setStatus('checking');
      setTimeout(() => {
        setStatus('success');
        setTimeout(() => {
          onVerify();
        }, 1000);
      }, 1500);
    }
  }, [scanning, progress, status, onVerify]);

  return (
    <div className="bg-[#0a0a0c] border border-[#333] p-6 text-center font-mono relative overflow-hidden">
      {/* Decorative corners */}
      <div className="absolute top-0 left-0 w-2 h-2 border-t border-l border-cyan-400" />
      <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-cyan-400" />
      <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-cyan-400" />
      <div className="absolute bottom-0 right-0 w-2 h-2 border-b border-r border-cyan-400" />

      <div className="mb-6 relative">
        <div className="w-24 h-24 mx-auto bg-[#16161c] border border-[#222] flex items-center justify-center relative">
          <AnimatePresence mode="wait">
            {status === 'idle' && (
              <motion.div
                key="idle"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
              >
                <Fingerprint size={48} className="text-[#333]" />
              </motion.div>
            )}
            {(status === 'scanning' || status === 'checking') && (
              <motion.div
                key="scanning"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="relative"
              >
                <Fingerprint size={48} className="text-cyan-400 animate-pulse" />
                <motion.div 
                  initial={{ top: 0 }}
                  animate={{ top: '100%' }}
                  transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                  className="absolute left-[-10px] right-[-10px] h-[2px] bg-cyan-400 shadow-[0_0_10px_#22d3ee]"
                />
              </motion.div>
            )}
            {status === 'success' && (
              <motion.div
                key="success"
                initial={{ scale: 0, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="text-[#00ff9f]"
              >
                <ShieldCheck size={56} />
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="space-y-4">
        <div>
          <div className="text-[10px] text-cyan-400 font-black uppercase tracking-widest mb-1">
            {status === 'idle' ? 'Awaiting Interaction' : 
             status === 'scanning' ? 'Scanning Biometrics...' :
             status === 'checking' ? 'Processing Signal...' : 'Identity Verified'}
          </div>
          <div className="h-1 bg-[#1a1a1f] border border-[#222] rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-cyan-400"
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <button
          onClick={startScan}
          disabled={status !== 'idle'}
          className={`w-full py-3 text-[10px] font-black uppercase border transition-all ${
            status === 'idle' 
              ? 'bg-transparent border-cyan-400 text-cyan-400 hover:bg-cyan-400 hover:text-black' 
              : 'bg-[#1a1a1f] border-[#222] text-[#444] cursor-default'
          }`}
        >
          {status === 'idle' ? 'Initialize Scan' : 'Verification Sequence Active'}
        </button>

        <div className="flex items-center justify-center gap-2 text-[7px] text-[#444] uppercase">
          <Scan size={10} /> Neural ID: 0x9f....a32
        </div>
      </div>
    </div>
  );
}
