import React, { useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { ShoppingBag, Star, Zap, Cpu, Shield, Sparkles, ArrowUpDown, ChevronUp, ChevronDown } from 'lucide-react';
import { MarketItem } from '../services/geminiService';

interface PointMarketProps {
  items: MarketItem[];
  points: number;
  onPurchase: (item: MarketItem) => boolean;
}

type SortKey = 'cost' | 'name' | 'category';
type SortOrder = 'asc' | 'desc';

export function PointMarket({ items, points, onPurchase }: PointMarketProps) {
  const [sortKey, setSortKey] = useState<SortKey>('cost');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');

  const sortedItems = useMemo(() => {
    return [...items].sort((a, b) => {
      let comparison = 0;
      if (sortKey === 'cost') {
        comparison = a.cost - b.cost;
      } else {
        comparison = a[sortKey].localeCompare(b[sortKey]);
      }
      return sortOrder === 'asc' ? comparison : -comparison;
    });
  }, [items, sortKey, sortOrder]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const SortButton = ({ label, k }: { label: string, k: SortKey }) => (
    <button
      onClick={() => toggleSort(k)}
      className={`px-2 py-1 text-[8px] font-black uppercase flex items-center gap-1 transition-colors ${
        sortKey === k ? 'text-[#bc13fe] bg-[#bc13fe]/10' : 'text-[#666] hover:text-[#bbb]'
      }`}
    >
      {label}
      {sortKey === k ? (
        sortOrder === 'asc' ? <ChevronUp size={10} /> : <ChevronDown size={10} />
      ) : (
        <ArrowUpDown size={10} className="opacity-30" />
      )}
    </button>
  );

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0d0d10] font-mono p-4 space-y-6 overflow-y-auto custom-scrollbar">
      {/* Header / Points Balance */}
      <div className="flex flex-col gap-2 p-4 bg-gradient-to-r from-[#bc13fe]/20 to-transparent border-l-4 border-[#bc13fe]">
        <div className="text-[10px] text-[#bc13fe] font-black uppercase tracking-widest flex items-center gap-2">
          <Star size={12} className="animate-pulse" /> Point Market Terminal
        </div>
        <div className="flex items-baseline gap-2">
          <div className="text-2xl font-black text-white tracking-tighter">{points.toLocaleString()}</div>
          <div className="text-[10px] text-[#666] uppercase font-bold">Arcane Fragments ($$)</div>
        </div>
        <p className="text-[8px] text-[#888] italic">
          Earn $$ by mining, validating biometrics, and engaging with the sector grid.
        </p>
      </div>

      {/* Categories & Sorting */}
      <div className="space-y-4">
        <div className="flex justify-between items-end border-b border-[#00ff9f]/20 pb-1">
          <div className="text-[10px] text-[#00ff9f] font-black uppercase tracking-widest">
            Strategic Assets
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[7px] text-[#444] uppercase font-bold mr-1">Sort by:</span>
            <SortButton label="Price" k="cost" />
            <SortButton label="Name" k="name" />
            <SortButton label="Type" k="category" />
          </div>
        </div>
        <div className="grid gap-3">
          {sortedItems.map(item => (
            <motion.div 
              key={item.id}
              whileHover={{ x: 4 }}
              className="p-3 bg-[#16161c] border border-[#222] hover:border-[#bc13fe] transition-all group relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-1">
                <div className="flex items-center gap-2">
                  {item.category === 'strategy' ? <Zap size={14} className="text-yellow-400" /> : 
                   item.category === 'utility' ? <Shield size={14} className="text-cyan-400" /> : 
                   <Sparkles size={14} className="text-[#bc13fe]" />}
                  <span className="text-[11px] font-bold text-white uppercase group-hover:text-[#bc13fe] transition-colors">{item.name}</span>
                </div>
                <div className="text-[10px] font-black text-[#00ff9f]">
                  {item.cost} $$
                </div>
              </div>
              <p className="text-[9px] text-[#666] leading-relaxed mb-3 pr-8">
                {item.description}
              </p>
              <div className="flex justify-between items-center">
                <div className="flex items-center gap-1">
                  <span className="text-[7px] text-[#444] uppercase tracking-tighter">Effect:</span>
                  <span className="px-1.5 py-0.5 bg-[#bc13fe]/10 text-[#bc13fe] text-[7px] font-mono border border-[#bc13fe]/20">
                    {item.effect}
                  </span>
                </div>
                <button 
                  onClick={() => onPurchase(item)}
                  disabled={points < item.cost}
                  className={`px-3 py-1 text-[9px] font-black uppercase transition-all ${
                    points >= item.cost 
                      ? 'bg-[#bc13fe] text-white hover:bg-white hover:text-black shadow-[0_0_10px_rgba(188,19,254,0.3)]' 
                      : 'bg-[#1a1a1f] text-[#444] border border-[#333] cursor-not-allowed'
                  }`}
                >
                  {points >= item.cost ? 'Acquire' : 'Insufficient'}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Points Earning Guide */}
      <div className="p-3 border border-dashed border-[#333] bg-[#050505] space-y-2 opacity-60">
        <div className="text-[8px] text-[#666] uppercase font-black">Earning Protocol:</div>
        <div className="grid grid-cols-2 gap-x-4 gap-y-1">
          <div className="text-[7px] flex justify-between"><span>Mining</span> <span className="text-[#00ff9f]">x2 Yield</span></div>
          <div className="text-[7px] flex justify-between"><span>Verification</span> <span className="text-cyan-400">100 $$</span></div>
          <div className="text-[7px] flex justify-between"><span>Ad Placement</span> <span className="text-purple-400">150 $$</span></div>
          <div className="text-[7px] flex justify-between"><span>Rating User</span> <span className="text-[#ff00ff]">20 $$</span></div>
        </div>
      </div>
    </div>
  );
}
