import React from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, Cell
} from 'recharts';
import { GridAnalytics } from '../services/geminiService';
import { TrendingUp, Activity, BarChart3, Binary } from 'lucide-react';

interface GridAnalyticsBoardProps {
  data: GridAnalytics | null;
}

export function GridAnalyticsBoard({ data }: GridAnalyticsBoardProps) {
  if (!data) return (
    <div className="flex-1 flex flex-col items-center justify-center text-[10px] text-[#444] animate-pulse uppercase tracking-widest font-mono">
      <Binary size={24} className="mb-2" />
      Syncing Intelligence...
    </div>
  );

  const getSentimentColor = (sentiment: string) => {
    switch (sentiment) {
      case 'positive': return '#00ff9f';
      case 'negative': return '#ff3e00';
      case 'chaotic': return '#ff00ff';
      default: return '#888';
    }
  };

  return (
    <div className="flex-1 flex flex-col p-4 space-y-6 overflow-y-auto custom-scrollbar bg-[#0d0d10] font-mono">
      {/* Overview Stats */}
      <div className="grid grid-cols-2 gap-4">
        <div className="bg-[#16161c] border border-[#222] p-3 rounded">
          <div className="text-[8px] text-[#666] mb-1 flex items-center gap-1 uppercase">
            <Activity size={10} className="text-[#00ff9f]" /> Pulse Density
          </div>
          <div className="text-2xl font-bold text-[#00ff9f]">
            {data.pulse.toFixed(1)}<span className="text-xs opacity-50">%</span>
          </div>
        </div>
        <div className="bg-[#16161c] border border-[#222] p-3 rounded">
          <div className="text-[8px] text-[#666] mb-1 flex items-center gap-1 uppercase">
            <TrendingUp size={10} className="text-purple-400" /> Sentiment
          </div>
          <div className="text-xs font-bold uppercase" style={{ color: getSentimentColor(data.sentiment) }}>
            {data.sentiment}
          </div>
          <div className="w-full h-1 bg-[#222] mt-2 rounded-full overflow-hidden">
            <div 
              className="h-full transition-all duration-1000" 
              style={{ 
                width: data.sentiment === 'chaotic' ? '100%' : '60%', 
                backgroundColor: getSentimentColor(data.sentiment) 
              }} 
            />
          </div>
        </div>
      </div>

      {/* Activity Chart */}
      <div className="space-y-2">
        <div className="text-[8px] text-[#666] flex items-center gap-1 uppercase tracking-widest">
          <BarChart3 size={10} /> Temporal Load (24h)
        </div>
        <div className="h-32 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={data.activityData}>
              <XAxis dataKey="time" hide />
              <YAxis hide />
              <Tooltip 
                contentStyle={{ backgroundColor: '#000', border: '1px solid #333', fontSize: '9px' }}
                itemStyle={{ color: '#00ff9f' }}
              />
              <Line 
                type="monotone" 
                dataKey="activity" 
                stroke="#00ff9f" 
                strokeWidth={2} 
                dot={false}
                animationDuration={2000}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Trending Keywords */}
      <div className="space-y-3">
        <div className="text-[8px] text-[#666] uppercase tracking-widest">Neural Trending</div>
        <div className="flex flex-wrap gap-2">
          {data.trendingKeywords.map((tag, i) => (
            <span 
              key={i} 
              className="px-2 py-1 bg-[#1a1a1f] border border-[#333] text-[9px] text-[#aaa] hover:text-[#00ff9f] hover:border-[#00ff9f] transition-colors"
            >
              {tag}
            </span>
          ))}
        </div>
      </div>

      {/* Breakdown */}
      <div className="bg-[#16161c]/50 p-3 border-l-2 border-[#ff3e00]">
        <div className="text-[9px] text-[#666] font-bold mb-2 uppercase">Integrity Alert</div>
        <div className="text-[10px] text-[#999] leading-tight">
          Detected social oscillations in Sector 07. Polygon density is reaching threshold. Sync required.
        </div>
      </div>
    </div>
  );
}
