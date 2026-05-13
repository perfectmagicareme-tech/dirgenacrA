import React, { useState } from 'react';
import { Terminal, Cpu, Zap, Activity } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface FuzzingTerminalProps {
  onFuzz: () => void;
  onSurge: () => void;
}

export function FuzzingTerminal({ onFuzz, onSurge }: FuzzingTerminalProps) {
  const [logs, setLogs] = useState<string[]>(['MATRIX_INITIALIZED', 'AWAITING_INPUT...']);

  const addLog = (msg: string) => {
    setLogs(prev => [msg, ...prev].slice(0, 5));
  };

  const handleFuzz = () => {
    addLog(`INITIATING STACK FUZZ AT ${Date.now()}`);
    addLog('BUFFER_OVERFLOW_TEST: SUCCESS');
    onFuzz();
  };

  const handleSurge = () => {
    addLog(`RE-ROUTING NEURAL ENERGY...`);
    addLog('SURGE_LEVEL: CRITICAL');
    onSurge();
  };

  return (
    <div className="bg-black border border-[#333] p-3 font-mono">
      <div className="flex items-center gap-2 mb-3 text-[9px] text-[#00ff9f] uppercase font-black">
        <Terminal size={12} /> stack_fuzz_v4.0
      </div>

      <div className="grid grid-cols-2 gap-2 mb-3">
        <button 
          onClick={handleFuzz}
          className="py-2 bg-[#ff00ff]/20 border border-[#ff00ff] text-[#ff00ff] text-[8px] font-bold uppercase hover:bg-[#ff00ff] hover:text-black transition-all flex items-center justify-center gap-2"
        >
          <Cpu size={10} /> Fuzz Stack
        </button>
        <button 
          onClick={handleSurge}
          className="py-2 bg-[#00ffff]/20 border border-[#00ffff] text-[#00ffff] text-[8px] font-bold uppercase hover:bg-[#00ffff] hover:text-black transition-all flex items-center justify-center gap-2"
        >
          <Zap size={10} /> Surge
        </button>
      </div>

      <div className="h-24 bg-[#0a0a0c] border border-[#222] p-2 overflow-hidden flex flex-col justify-end">
        <div className="space-y-0.5">
          {logs.map((log, i) => (
            <div key={i} className={`text-[7px] ${i === 0 ? 'text-[#00ff9f]' : 'text-[#444]'} transition-all`}>
              [{new Date().toLocaleTimeString()}] {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
