import React from 'react';
import { ShoppingCart, Package, Zap, Shield, Cpu, TrendingUp } from 'lucide-react';
import { StoreItem } from '../services/geminiService';

interface CyberStoreProps {
  items: StoreItem[];
  onPurchase: (item: StoreItem) => void;
}

export function CyberStore({ items, onPurchase }: CyberStoreProps) {
  const getItemIcon = (type: string) => {
    switch (type) {
      case 'defense': return <Shield size={14} className="text-blue-400" />;
      case 'booster': return <Zap size={14} className="text-[#00ff9f]" />;
      case 'computation': return <Cpu size={14} className="text-purple-400" />;
      default: return <Package size={14} className="text-[#666]" />;
    }
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0d0d10] font-mono">
      <div className="p-4 border-b border-[#222] flex justify-between items-center">
        <div className="text-xs text-[#00ff9f] font-black uppercase tracking-widest flex items-center gap-2">
          <ShoppingCart size={14} /> Neural Marketplace
        </div>
        <div className="text-[9px] text-[#666] flex items-center gap-2">
          <TrendingUp size={10} /> STOCK_SHARES: 12.5k
        </div>
      </div>

      <div className="flex-1 overflow-y-auto custom-scrollbar p-4 space-y-3">
        {items.map((item) => (
          <div key={item.id} className="bg-[#16161c] border border-[#222] p-3 hover:border-[#00ff9f] transition-all group">
            <div className="flex justify-between items-start mb-2">
              <div className="flex items-center gap-2">
                {getItemIcon(item.type)}
                <div>
                  <div className="text-[10px] text-white font-bold uppercase tracking-tight">{item.name}</div>
                  <div className="text-[8px] text-[#666] uppercase">{item.type}</div>
                </div>
              </div>
              <div className="text-[10px] text-[#00ff9f] font-bold">$${item.price}</div>
            </div>
            <p className="text-[9px] text-[#888] leading-tight mb-3 italic">
              {item.description}
            </p>
            <button 
              onClick={() => onPurchase(item)}
              className="w-full py-1.5 bg-[#222] border border-[#333] text-[9px] text-white uppercase font-black group-hover:bg-[#00ff9f] group-hover:text-black hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Acquire Implementation
            </button>
          </div>
        ))}

        <div className="mt-8 p-4 bg-[#00ffff]/5 border-t border-b border-[#00ffff]/20">
          <div className="text-[9px] text-[#00ffff] font-black uppercase mb-1">Entity Shares</div>
          <p className="text-[8px] text-[#00ffff]/70 leading-tight">
            Purchase fractional stock in polygon grids to influence sector synchronization.
          </p>
          <div className="mt-2 flex gap-4">
            <div className="flex-1 text-center py-2 bg-[#00ffff]/10 border border-[#00ffff]/30 text-[9px] text-white font-bold cursor-pointer hover:bg-white hover:text-black transition-all">
              BUY SHARES
            </div>
            <div className="flex-1 text-center py-2 bg-transparent border border-[#333] text-[9px] text-[#666] uppercase font-bold cursor-not-allowed">
              SELL
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
