import React from 'react';
import { Compass, RotateCw, Move, Activity } from 'lucide-react';
import { motion } from 'motion/react';

export interface PositioningData {
  alpha: number | null; // alpha: rotation around z-axis [0, 360]
  beta: number | null;  // beta: rotation around x-axis [-180, 180]
  gamma: number | null; // gamma: rotation around y-axis [-90, 90]
  accel: {
    x: number | null;
    y: number | null;
    z: number | null;
  } | null;
}

interface PositioningMonitorProps {
  data: PositioningData;
  isActive: boolean;
  onRequestPermission: () => void;
}

export function PositioningMonitor({ data, isActive, onRequestPermission }: PositioningMonitorProps) {
  const { alpha, beta, gamma, accel } = data;

  const formatNum = (val: number | null) => val !== null ? val.toFixed(1) : '---';

  return (
    <div className="bg-[#0a0a0c] border border-[#2a2a2e] p-3 font-mono space-y-3">
      <div className="flex items-center justify-between">
        <div className="text-[10px] text-cyan-400 font-black uppercase tracking-widest flex items-center gap-2">
          <Compass size={12} className={isActive ? 'animate-spin-slow' : ''} />
          Spatial Monitor
        </div>
        {!isActive && (
          <button 
            onClick={onRequestPermission}
            className="text-[8px] bg-cyan-400 text-black px-2 py-0.5 font-black uppercase hover:bg-white transition-colors"
          >
            Enable Orientation
          </button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-2">
        <div className="bg-black/50 border border-[#333] p-1.5 text-center">
          <div className="text-[7px] text-[#555] uppercase">Alpha</div>
          <div className="text-[12px] text-white font-black">{formatNum(alpha)}°</div>
          <div className="h-0.5 bg-[#222] mt-1 relative overflow-hidden">
            <motion.div 
              className="h-full bg-cyan-400"
              animate={{ width: `${((alpha || 0) / 360) * 100}%` }}
            />
          </div>
        </div>
        <div className="bg-black/50 border border-[#333] p-1.5 text-center">
          <div className="text-[7px] text-[#555] uppercase">Beta</div>
          <div className="text-[12px] text-white font-black">{formatNum(beta)}°</div>
          <div className="h-0.5 bg-[#222] mt-1 relative overflow-hidden">
            <motion.div 
              className="h-full bg-cyan-400"
              animate={{ width: `${(((beta || 0) + 180) / 360) * 100}%` }}
            />
          </div>
        </div>
        <div className="bg-black/50 border border-[#333] p-1.5 text-center">
          <div className="text-[7px] text-[#555] uppercase">Gamma</div>
          <div className="text-[12px] text-white font-black">{formatNum(gamma)}°</div>
          <div className="h-0.5 bg-[#222] mt-1 relative overflow-hidden">
            <motion.div 
              className="h-full bg-cyan-400"
              animate={{ width: `${(((gamma || 0) + 90) / 180) * 100}%` }}
            />
          </div>
        </div>
      </div>

      {/* Acceleration Visualization */}
      <div className="space-y-1">
        <div className="text-[7px] text-[#bc13fe] uppercase font-black flex items-center gap-1">
          <Move size={10} /> Dynamic Momentum
        </div>
        <div className="flex gap-2">
          {['X', 'Y', 'Z'].map((axis) => {
            const val = accel ? (accel as any)[axis.toLowerCase()] : 0;
            const percentage = Math.min(Math.abs(val) * 10, 100);
            return (
              <div key={axis} className="flex-1 flex flex-col gap-1">
                <div className="h-12 bg-[#16161c] border border-[#222] relative flex items-end">
                   <motion.div 
                     className="w-full bg-[#bc13fe]"
                     animate={{ height: `${percentage}%` }}
                   />
                   <div className="absolute inset-0 flex items-center justify-center text-[8px] font-black mix-blend-difference text-white">
                      {formatNum(val)}
                   </div>
                </div>
                <div className="text-[6px] text-center text-[#444]">{axis}-ACCEL</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex items-center gap-2 pt-1">
        <Activity size={10} className="text-cyan-400" />
        <div className="flex-1 h-[2px] bg-[#1a1a1f] relative overflow-hidden">
           <motion.div 
             className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-400 to-transparent w-1/4"
             animate={{ left: ['-100%', '200%'] }}
             transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
           />
        </div>
      </div>
    </div>
  );
}
