import React from 'react';
import { Activity, Zap, Shield, Cpu, Binary } from 'lucide-react';
import { TileAnalytics } from '../services/geminiService';
import { motion } from 'motion/react';

interface TileAnalyticsMetersProps {
  analytics?: TileAnalytics;
}

export function TileAnalyticsMeters({ analytics }: TileAnalyticsMetersProps) {
  const data = analytics || {
    resonance: 64,
    fuzzDensity: 12,
    packetLoss: 3,
    socialSurge: 28
  };

  const Meter = ({ label, value, color, icon: Icon, description }: any) => {
    const [showTooltip, setShowTooltip] = React.useState(false);

    return (
      <div className="space-y-1 relative">
        <div 
          className="flex justify-between items-center text-[7px] uppercase font-bold text-[#666] cursor-help"
          onMouseEnter={() => setShowTooltip(true)}
          onMouseLeave={() => setShowTooltip(false)}
        >
          <div className="flex items-center gap-1">
            <Icon size={8} className={`text-${color}`} style={{ color }} /> {label}
          </div>
          <span style={{ color }}>{Math.round(value)}%</span>
        </div>

        {showTooltip && (
          <motion.div 
            initial={{ opacity: 0, y: 5 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute z-30 bottom-full left-0 mb-2 w-48 p-2 bg-[#0d0d10] border border-cyan-400/30 text-[8px] text-white backdrop-blur-md shadow-xl pointer-events-none"
          >
            <div className="font-black text-cyan-400 mb-1 uppercase tracking-wider">{label}</div>
            <div className="text-[#888] leading-tight normal-case font-sans">{description}</div>
            <div className="mt-1 flex gap-1">
              <div className="w-full h-[1px] bg-cyan-400/20" />
            </div>
          </motion.div>
        )}

        <div className="h-1 bg-[#1a1a1f] border border-[#222] rounded-full overflow-hidden">
          <motion.div 
            initial={{ width: 0 }}
            animate={{ width: `${value}%` }}
            className="h-full"
            style={{ backgroundColor: color }}
          />
        </div>
      </div>
    );
  };

  return (
    <div className="p-3 bg-[#0d0d10] border border-[#222] rounded-lg font-mono space-y-3">
      <div className="text-[9px] text-cyan-400 font-black uppercase tracking-widest pb-2 border-b border-cyan-400/20">
        Public Grid Metrics
      </div>
      
      <div className="grid grid-cols-2 gap-x-4 gap-y-3">
        <Meter 
          label="Resonance" 
          value={data.resonance} 
          color="#00ff9f" 
          icon={Activity} 
          description="Neural connectivity strength in this sector. High resonance signifies strong social presence and data stability."
        />
        <Meter 
          label="Fuzz Density" 
          value={data.fuzzDensity} 
          color="#ff00ff" 
          icon={Binary} 
          description="Level of signal interference and grid distortions. High fuzz increases hacking difficulty but obscures identity."
        />
        <Meter 
          label="Packet Flow" 
          value={100 - data.packetLoss} 
          color="#00ffff" 
          icon={Zap} 
          description="The velocity of data transmission within the grid. High flow accelerates AF point accumulation and sync speed."
        />
        <Meter 
          label="Social Surge" 
          value={data.socialSurge} 
          color="#ff3e00" 
          icon={Shield} 
          description="Real-time density of neural clusters. Higher values indicate elite activity and potential for high-yield mining."
        />
      </div>

      <div className="pt-2 flex items-center justify-between border-t border-[#222]">
        <div className="text-[6px] text-[#444] uppercase tracking-tighter">Sector Integrity: STABLE</div>
        <div className="flex gap-1">
          <div className="w-1 h-1 bg-[#00ff9f] animate-pulse" />
          <div className="w-1 h-1 bg-[#00ff9f] animate-pulse delay-75" />
          <div className="w-1 h-1 bg-[#00ff9f] animate-pulse delay-150" />
        </div>
      </div>
    </div>
  );
}
