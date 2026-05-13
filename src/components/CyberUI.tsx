/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Terminal, Map as MapIcon, Shield, Package, MessageSquare, Zap, Globe, Cpu, ChevronUp, ChevronDown, Wand2, RefreshCw, BarChart2, CircuitBoard, Binary, Activity, Sparkles, Award, Info, X } from 'lucide-react';
import { getGridIntelligence, generateCyberMagic, generateCyberFeed, getSocialAnalytics, GridAnalytics, CyberCreature, CyberPost, ForumPost, LandValue, syncPortal, ParcelComment, TileAnalytics, StoreItem, ParcelStructure, PortalAd, LinkedAccount, generateAdSlogan, NeuralChemistry, ARCANE_STIMULANTS, POINT_MARKET_ITEMS, MarketItem } from '../services/geminiService';
import { POI } from '../App';
import { GridAnalyticsBoard } from './GridAnalyticsBoard';
import { ParcelComments } from './ParcelComments';
import { TileAnalyticsMeters } from './TileAnalyticsMeters';
import { FuzzingTerminal } from './FuzzingTerminal';
import { CyberStore } from './CyberStore';
import { GridIdentity } from './GridIdentity';
import { PointMarket } from './PointMarket';

import { BiometricScanner } from './BiometricScanner';
import { PositioningMonitor, PositioningData } from './PositioningMonitor';
import { NeuralBiometrics } from '../services/geminiService';
import { QRCodeSVG } from 'qrcode.react';
import { Html5QrcodeScanner } from 'html5-qrcode';

interface NexusTabProps {
  biometrics: NeuralBiometrics;
  onScan: (scannedUserId: string) => void;
}

function NexusTab({ biometrics, onScan }: NexusTabProps) {
  const [scanMode, setScanMode] = useState(false);
  const [scanResult, setScanResult] = useState<string | null>(null);

  useEffect(() => {
    if (scanMode) {
      const scanner = new Html5QrcodeScanner('qr-reader', { fps: 10, qrbox: { width: 250, height: 250 } }, false);
      scanner.render((decodedText) => {
        setScanResult(decodedText);
        scanner.clear();
        setScanMode(false);
        onScan(decodedText);
      }, () => {});

      return () => {
        scanner.clear().catch(console.error);
      };
    }
  }, [scanMode, onScan]);

  return (
    <div className="flex-1 overflow-y-auto custom-scrollbar p-4 font-mono">
      <div className="bg-[#1a1a1f] border border-[#333] p-4 text-center space-y-4">
        <h2 className="text-[#00ff9f] font-bold uppercase tracking-widest text-xs">Social Data Link Tree</h2>
        
        {!scanMode ? (
          <>
            <div className="flex justify-center p-4 bg-white mx-auto w-max">
              <QRCodeSVG value={biometrics.signature} size={150} level="H" />
            </div>
            <p className="text-[10px] text-[#888] italic">Share this code. Other users scanning it will receive Arcane Fragments ($$).</p>
            
            <button 
              onClick={() => setScanMode(true)}
              className="w-full py-2 bg-[#bc13fe] text-white text-[10px] uppercase font-black tracking-widest hover:bg-white hover:text-black transition-colors"
            >
              Scan Someone Else
            </button>
            {scanResult && (
              <div className="p-2 border border-[#00ff9f]/50 text-[#00ff9f] text-[9px] mt-2 bg-[#00ff9f]/10">
                SUCCESSFUL RELAY: {scanResult}
              </div>
            )}
          </>
        ) : (
          <div className="space-y-4">
            <div id="qr-reader" className="w-full overflow-hidden border-2 border-cyan-400 bg-black" />
            <button 
              onClick={() => setScanMode(false)}
              className="w-full py-2 border border-[#444] text-[#888] text-[10px] uppercase font-bold hover:bg-[#333] hover:text-white transition-colors"
            >
              Cancel Scanner
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

interface CyberUIProps {
  selectedLand: (LandValue & { lat: number; lng: number }) | null;
  selectedPoi: POI | null;
  onInjectEntity: (name: string, lat: number, lng: number) => void;
  onSyncStateChange: (isSyncing: boolean) => void;
  onClaimLand: (land: LandValue & { lat: number; lng: number }) => void;
  onAddComment: (lat: number, lng: number, comment: ParcelComment) => void;
  onTileAction: (lat: number, lng: number, action: 'fuzz' | 'surge') => void;
  claimedLands: Array<LandValue & { lat: number; lng: number }>;
  forumPosts: ForumPost[];
  onAddForumPost: (post: Omit<ForumPost, 'id' | 'createdAt' | 'votes'>) => void;
  onTeleport: (lat: number, lng: number) => void;
  onPlaceAd: (lat: number, lng: number, ad: PortalAd) => void;
  onBuildStructure: (lat: number, lng: number, structure: ParcelStructure) => void;
  weather: 'calm' | 'storm' | 'rain';
  onWeatherChange: (w: 'calm' | 'storm' | 'rain') => void;
  onSyncPortal?: (lat: number, lng: number) => Promise<string>;
  linkedAccounts: LinkedAccount[];
  onConnectAccount: (id: string) => void;
  onUpdateResidencyTag: (lat: number, lng: number, tag: string) => void;
  miningYield: number;
  biometrics: NeuralBiometrics;
  onVerifyBiometrics: () => void;
  onUpdateIdentityType: (type: string) => void;
  onUpdateIdentityTags: (tags: string[]) => void;
  onUpdatePet: (pet: any) => void;
  neuralChemistry: NeuralChemistry;
  onUpdateNeuralChemistry: (stimulantId: string) => void;
  onRateAttractiveness: (score: number) => void;
  onRatePrude: (score: number) => void;
  onToggleWallet: () => void;
  onMintNFT: (lat: number, lng: number) => void;
  marketPoints: number;
  onPurchaseItem: (item: MarketItem) => boolean;
  onScanQR: (scannedUserId: string) => void;
  isRoaming: boolean;
  onToggleRoaming: () => void;
  positioningData: PositioningData;
  isPositioningActive: boolean;
  onRequestOrientation: () => void;
}

export function CyberUI({ 
  selectedLand, 
  selectedPoi, 
  onInjectEntity, 
  onSyncStateChange, 
  onClaimLand, 
  onAddComment,
  onTileAction,
  claimedLands, 
  forumPosts, 
  onAddForumPost, 
  onTeleport, 
  onPlaceAd, 
  onBuildStructure, 
  weather, 
  onWeatherChange,
  linkedAccounts,
  onConnectAccount,
  onUpdateResidencyTag,
  miningYield,
  biometrics,
  onVerifyBiometrics,
  onUpdateIdentityType,
  onUpdateIdentityTags,
  onUpdatePet,
  neuralChemistry,
  onUpdateNeuralChemistry,
  onRateAttractiveness,
  onRatePrude,
  onToggleWallet,
  onMintNFT,
  onScanQR,
  marketPoints,
  onPurchaseItem,
  isRoaming,
  onToggleRoaming,
  positioningData,
  isPositioningActive,
  onRequestOrientation
}: CyberUIProps) {
  const [activeTab, setActiveTab] = useState<'land' | 'reddit' | 'inventory' | 'tools' | 'store' | 'identity' | 'market' | 'nexus'>('land');
  const [activeSidebarTab, setActiveSidebarTab] = useState<'feed' | 'forum' | 'analytics' | 'comments'>('feed');
  const [gridUpdate, setGridUpdate] = useState<string>('Scanning localized grid...');
  const [isInjecting, setIsInjecting] = useState(false);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isPosting, setIsPosting] = useState(false);
  const [isDeployingAd, setIsDeployingAd] = useState(false);
  const [isConfirmingAd, setIsConfirmingAd] = useState(false);
  const [adTutorialStep, setAdTutorialStep] = useState<number | null>(null);
  const [adBrand, setAdBrand] = useState('');
  const [adColor, setAdColor] = useState('#00ffff');
  const [previewSlogan, setPreviewSlogan] = useState('');
  const [residencyTag, setResidencyTag] = useState('');
  const [creatures, setCreatures] = useState<CyberCreature[]>([]);
  const [posts, setPosts] = useState<CyberPost[]>([]);
  const [analytics, setAnalytics] = useState<GridAnalytics | null>(null);
  const [magicPrompt, setMagicPrompt] = useState('');
  
  const [storeItems] = useState<StoreItem[]>([
    { id: 'item-1', name: 'Neural Shield v2', type: 'defense', price: 450, description: 'Blocks intrusive stack fuzzing in the immediate sector.' },
    { id: 'item-2', name: 'Surge Capacitor', type: 'booster', price: 1200, description: 'Increases the duration and intensity of social surges.' },
    { id: 'item-3', name: 'Floating Hologram', type: 'aesthetic', price: 200, description: 'A custom polygon projection for your claimed parcel.' },
    { id: 'item-4', name: 'Core Processor', type: 'computation', price: 3500, description: 'Accelerates matrix calculations and ad payout resonance.' },
  ]);

  const handlePostComment = (content: string) => {
    if (!selectedLand) return;
    const newComment: ParcelComment = {
      id: Math.random().toString(36).substr(2, 9),
      author: 'ghost_user',
      content,
      timestamp: 'just now',
      votes: 1
    };
    onAddComment(selectedLand.lat, selectedLand.lng, newComment);
  };

  const handlePurchase = (item: StoreItem) => {
    setGridUpdate(`TRANSACTION_SUCCESS: ${item.name} acquired.`);
  };

  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostContent, setNewPostContent] = useState('');

  const isLandClaimed = selectedLand && claimedLands.some(l => l.lat === selectedLand.lat && l.lng === selectedLand.lng);

  // Default SF Coordinates (fallback)
  const defaultLat = 37.7749;
  const defaultLng = -122.4194;
  
  const currentLat = selectedPoi?.lat || selectedLand?.lat || defaultLat;
  const currentLng = selectedPoi?.lng || selectedLand?.lng || defaultLng;

  const activeAura = neuralChemistry.activeStimulants.length > 0 
    ? ARCANE_STIMULANTS.find(s => s.id === neuralChemistry.activeStimulants[0])?.visualAura 
    : null;

  const [isLoadingIntelligence, setIsLoadingIntelligence] = useState(false);
  
  useEffect(() => {
    async function updateIntelligence() {
      setIsLoadingIntelligence(true);
      try {
        const [gData, fData, aData] = await Promise.all([
          getGridIntelligence(currentLat, currentLng),
          generateCyberFeed(currentLat, currentLng),
          getSocialAnalytics(currentLat, currentLng)
        ]);
        setGridUpdate(gData);
        setPosts(fData);
        setAnalytics(aData);
      } finally {
        setIsLoadingIntelligence(false);
      }
    }
    updateIntelligence();
  }, [currentLat, currentLng]);

  const handleBuild = (type: ParcelStructure['type']) => {
    if (!selectedLand) return;
    const structure: ParcelStructure = {
      id: Math.random().toString(36).substr(2, 9),
      type,
      name: type.toUpperCase() + '_' + Math.floor(Math.random() * 999),
      level: 1
    };
    onBuildStructure(selectedLand.lat, selectedLand.lng, structure);
    setGridUpdate(`CONSTRUCTION INITIATED: ${structure.name} at sector ${selectedLand.lat.toFixed(2)}`);
  };

  const handlePreviewAd = async () => {
    if (!selectedLand || !adBrand) return;
    setIsDeployingAd(true);
    setGridUpdate(`GENERIC SLOGAN PROTOCOL: ${adBrand}...`);
    
    const slogan = await generateAdSlogan(adBrand);
    setPreviewSlogan(slogan);
    setIsConfirmingAd(true);
    setIsDeployingAd(false);
  };

  const handleFinalDeployAd = () => {
    if (!selectedLand || !adBrand) return;
    
    // Inject chem signature based on active stimulants
    const primaryStimId = neuralChemistry.activeStimulants[0];
    const stim = primaryStimId ? ARCANE_STIMULANTS.find(s => s.id === primaryStimId) : null;
    const chemSig = stim?.name;

    onPlaceAd(selectedLand.lat, selectedLand.lng, {
      brand: adBrand.toUpperCase(),
      slogan: previewSlogan,
      color: adColor,
      active: true,
      chemSignature: chemSig
    });
    
    setGridUpdate(`BRANDING DEPOT ACTIVE: ${adBrand}`);
    setIsConfirmingAd(false);
    setPreviewSlogan('');
    setAdBrand('');
  };

  const handleSyncResidency = () => {
    if (!selectedLand || !residencyTag) return;
    onUpdateResidencyTag(selectedLand.lat, selectedLand.lng, residencyTag.toUpperCase());
    setGridUpdate(`RESIDENCY_TAG_SYNCHRONIZED: ${residencyTag.toUpperCase()}`);
    setResidencyTag('');
  };

  const handleMagicInjection = async () => {
    if (!magicPrompt) return;
    setIsInjecting(true);
    onSyncStateChange?.(true); // Trigger 3D excitement
    
    // Simulate silo handshake
    setGridUpdate("INITIATING SILO HANDSHAKE... [010101]");
    
    const creature = await generateCyberMagic(magicPrompt);
    if (creature) {
      setCreatures(prev => [creature, ...prev]);
      onInjectEntity(creature.name, currentLat, currentLng);
      setMagicPrompt('');
      setGridUpdate(`SUCCESS: ${creature.name} materialized in Silo Alpha.`);
    }
    
    setTimeout(() => {
      setIsInjecting(false);
      onSyncStateChange?.(false);
    }, 2000);
  };

  const handleSync = async (lat: number, lng: number) => {
    setIsSyncing(true);
    onSyncStateChange(true);
    const msg = await syncPortal(lat, lng);
    setGridUpdate(msg);
    setTimeout(() => {
      setIsSyncing(false);
      onSyncStateChange(false);
    }, 4000);
  };

  const handleCreatePost = () => {
    if (!newPostTitle || !newPostContent) return;
    onAddForumPost({
      title: newPostTitle,
      content: newPostContent,
      author: 'CyberRunner_' + Math.floor(Math.random() * 1000),
      lat: currentLat,
      lng: currentLng
    });
    setNewPostTitle('');
    setNewPostContent('');
    setIsPosting(false);
  };

  return (
    <div className="fixed inset-0 pointer-events-none z-20 flex flex-col font-sans text-[#e0e0e0]">
      {/* HEADER: PORTAL SYNC */}
      <header className="h-12 border-b border-[#bc13fe]/30 flex items-center justify-between px-4 bg-[#0f0f12]/90 backdrop-blur-xl shrink-0 pointer-events-auto relative overflow-hidden">
        {/* Ad Tutorial Overlay */}
        <AnimatePresence>
          {adTutorialStep !== null && (
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/60 backdrop-blur-sm flex items-center justify-center p-6"
            >
              <div className="w-full max-w-md bg-[#0d0d10] border-2 border-cyan-400 p-6 shadow-[0_0_50px_rgba(34,211,238,0.2)] relative">
                <button onClick={() => setAdTutorialStep(null)} className="absolute top-4 right-4 text-cyan-400 hover:text-white"><X size={20} /></button>
                <div className="text-cyan-400 font-black text-xs uppercase tracking-[0.2em] mb-4 flex items-center gap-2">
                  <Info size={16} /> Sequence Tutorial: Ad Deployment
                </div>
                
                <div className="space-y-6">
                  {[
                    { t: "Step 1: Signal Selection", d: "Click on any unclaimed or claimed node in the polygon forest. Claim ownership if necessary to unlock the terminal." },
                    { t: "Step 2: Brand Identity", d: "Enter your brand name in the Deployment Terminal. Our neural generators will calculate a high-resonance slogan." },
                    { t: "Step 3: Neural Seal", d: "If you have active stimulants (like Neon Rush), they will be infused as a 'Chemical Signature' in the broadcast." },
                    { t: "Step 4: Propagation", d: "Deploy the broadcast. You will earn AF points and see real-time impressions as users pass the sector." }
                  ].map((step, i) => (
                    <div key={i} className={`flex gap-4 transition-opacity ${adTutorialStep === i ? 'opacity-100' : 'opacity-30'}`}>
                      <div className="w-8 h-8 rounded-full border-2 border-cyan-400 flex items-center justify-center text-xs font-black shrink-0">{i+1}</div>
                      <div>
                        <div className="text-[11px] font-bold text-white uppercase">{step.t}</div>
                        <p className="text-[10px] text-[#888] leading-relaxed">{step.d}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 flex justify-between">
                  <div className="flex gap-1">
                    {[0, 1, 2, 3].map(i => (
                      <div key={i} className={`w-8 h-1 ${adTutorialStep === i ? 'bg-cyan-400' : 'bg-[#222]'}`} />
                    ))}
                  </div>
                  <button 
                    onClick={() => adTutorialStep < 3 ? setAdTutorialStep(adTutorialStep + 1) : setAdTutorialStep(null)}
                    className="px-6 py-2 bg-cyan-400 text-black text-[10px] font-black uppercase hover:bg-white"
                  >
                    {adTutorialStep < 3 ? 'Proceed' : 'Synchronized'}
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(188,19,254,0.05),transparent)] animate-[scan_4s_linear_infinite]" />
        {activeAura && (
          <motion.div 
            animate={{ opacity: [0, 0.1, 0] }}
            transition={{ repeat: Infinity, duration: 3 }}
            className="absolute inset-0"
            style={{ backgroundColor: activeAura }}
          />
        )}
        <div className="flex items-center space-x-4 relative z-10">
          <div className="text-[#bc13fe] font-black text-xl tracking-tighter italic magic-glow">ARCANE GRID</div>
          <div className="h-6 w-px bg-[#2a2a2e]"></div>
          <div className="text-[10px] font-mono text-[#666] tracking-widest uppercase flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#00ffff] animate-pulse shadow-[0_0_8px_#00ffff]"></span>
            Arcane Link: Synchronized
          </div>
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex bg-[#1a1a1f] border border-[#333] p-1 gap-1">
            {(['calm', 'rain', 'storm'] as const).map((w) => (
              <button
                key={w}
                onClick={() => onWeatherChange(w)}
                className={`px-2 py-0.5 text-[8px] uppercase font-bold transition-colors ${weather === w ? 'bg-[#00ff9f] text-black' : 'text-[#666] hover:text-white'}`}
              >
                {w}
              </button>
            ))}
          </div>
          <div className="flex items-center space-x-2 text-[11px] font-mono bg-[#1a1a1f] px-3 py-1 border border-[#333]">
            <span className="text-[#666]">LAT:</span> <span className="text-[#00ff9f]">{currentLat.toFixed(4)}</span>
            <span className="text-[#666]">LNG:</span> <span className="text-[#00ff9f]">{currentLng.toFixed(4)}</span>
          </div>
          <button 
            onClick={() => handleSync(currentLat, currentLng)}
            disabled={isSyncing}
            className={`flex items-center gap-2 px-4 py-1.5 font-bold uppercase text-[10px] tracking-widest transition-all relative overflow-hidden group ${isSyncing ? 'bg-[#ff3e00] text-white animate-pulse' : 'bg-[#bc13fe] text-white hover:bg-white hover:text-black border border-[#bc13fe]/50 shadow-[0_0_15px_rgba(188,19,254,0.3)]'}`}
          >
            <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.2),transparent)] -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
            {isSyncing ? <RefreshCw size={12} className="animate-spin" /> : <Wand2 size={12} />}
            {isSyncing ? 'Syncing...' : 'Arcane Sync'}
          </button>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* LEFT SIDEBAR: COMMUNITY FEED & FORUM */}
        <aside className="w-80 border-r border-[#2a2a2e] flex flex-col bg-[#0d0d10] shrink-0 pointer-events-auto">
          {/* Main Tabs */}
          <div className="flex border-b border-[#2a2a2e] bg-[#050505] relative overflow-hidden">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_var(--mouse-x,50%)_50%,rgba(188,19,254,0.1)_0%,transparent_100%)] pointer-events-none" />
            {(['land', 'tools', 'store', 'market', 'identity', 'nexus'] as const).map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 p-2 text-[8px] font-black uppercase tracking-widest transition-all border-b-2 relative ${activeTab === tab ? 'text-white border-[#bc13fe] bg-[#bc13fe]/10 magic-glow' : 'text-[#444] border-transparent hover:text-[#888]'}`}
              >
                {activeTab === tab && (
                  <motion.div 
                    layoutId="magic-underline"
                    className="absolute inset-0 bg-[#bc13fe]/5 pointer-events-none"
                  />
                )}
                {tab}
              </button>
            ))}
          </div>

          {/* GPS ROAMING TOGGLE */}
          <div className="p-3 bg-black border-b border-[#2a2a2e] flex items-center justify-between group">
            <div className="flex items-center gap-2">
              <div className={`w-2 h-2 rounded-full ${isRoaming ? 'bg-cyan-400 animate-pulse' : 'bg-[#444]'}`} />
              <div className="text-[9px] font-black uppercase text-white tracking-widest">Analog Roaming</div>
            </div>
            <button 
              onClick={onToggleRoaming}
              className={`px-3 py-1 text-[8px] font-black uppercase transition-all border ${
                isRoaming 
                  ? 'bg-cyan-400 border-cyan-400 text-black shadow-[0_0_10px_rgba(34,211,238,0.5)]' 
                  : 'bg-transparent border-[#444] text-[#888] hover:border-white hover:text-white'
              }`}
            >
              {isRoaming ? 'Active' : 'Offline'}
            </button>
          </div>

          <div className="flex border-b border-[#2a2a2e]">
            <button 
              onClick={() => setActiveSidebarTab('feed')}
              className={`flex-1 p-2 text-[8px] font-bold uppercase tracking-widest text-center transition-colors ${activeSidebarTab === 'feed' ? 'text-[#00ff9f] bg-[#00ff9f]/5' : 'text-[#666] hover:text-white'}`}
            >
              Feed
            </button>
            <button 
              onClick={() => setActiveSidebarTab('forum')}
              className={`flex-1 p-2 text-[8px] font-bold uppercase tracking-widest text-center transition-colors ${activeSidebarTab === 'forum' ? 'text-[#ff3e00] bg-[#ff3e00]/5' : 'text-[#666] hover:text-white'}`}
            >
              Forum
            </button>
            <button 
              onClick={() => setActiveSidebarTab('analytics')}
              className={`flex-1 p-2 text-[8px] font-bold uppercase tracking-widest text-center transition-colors ${activeSidebarTab === 'analytics' ? 'text-purple-400 bg-purple-400/5' : 'text-[#666] hover:text-white'}`}
            >
              Analytics
            </button>
            <button 
              onClick={() => setActiveSidebarTab('comments')}
              className={`flex-1 p-2 text-[8px] font-bold uppercase tracking-widest text-center transition-colors ${activeSidebarTab === 'comments' ? 'text-blue-400 bg-blue-400/5' : 'text-[#666] hover:text-white'}`}
            >
              Dialog
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar">
            {activeSidebarTab === 'feed' && (
              <div className="space-y-1 p-2">
                {isLoadingIntelligence && (
                  <div className="p-4 text-center text-[10px] text-cyan-400 animate-pulse flex items-center justify-center gap-2">
                    <RefreshCw size={12} className="animate-spin" /> Fetching grid streams...
                  </div>
                )}
                {posts.length > 0 ? (
                  posts.map((post, i) => (
                    <div key={i} className="bg-[#16161c] p-2 border-l-2 border-transparent hover:border-[#00ff9f] transition-all cursor-pointer group">
                      <div className="text-[9px] font-bold uppercase mb-1 text-[#00ff9f]">{post.sub}</div>
                      <div className="text-[11px] leading-tight mb-1 font-medium group-hover:text-white transition-colors">{post.content}</div>
                      <div className="flex justify-between items-center text-[9px] text-[#555]">
                        <span className="font-bold text-[#666]">u/{post.user}</span>
                        <span className="flex items-center gap-0.5 mt-1"><ChevronUp size={10} /> {post.votes}</span>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="p-4 text-center text-[10px] text-[#444] italic animate-pulse">Waiting for feed injection...</div>
                )}
              </div>
            )}

            {activeSidebarTab === 'forum' && (
              <div className="flex flex-col h-full">
                <div className="p-2 space-y-2 flex-1">
                  {forumPosts.map((post) => (
                    <div 
                      key={post.id} 
                      onClick={() => post.lat && post.lng && onTeleport(post.lat, post.lng)}
                      className="bg-[#0f0f12] border border-[#222] p-2 hover:border-[#ff3e00]/50 transition-colors cursor-pointer group"
                    >
                      <div className="flex justify-between items-start mb-1">
                        <span className="text-[10px] font-bold text-[#ff3e00]">{post.title}</span>
                        <span className="text-[8px] text-[#555]">{new Date(post.createdAt).toLocaleTimeString()}</span>
                      </div>
                      <p className="text-[10px] text-[#888] leading-tight mb-2 line-clamp-3">{post.content}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-[8px] text-[#444]">by <span className="text-[#666]">{post.author}</span></span>
                        {post.lat && (
                          <span className="text-[8px] text-[#00ff9f] flex items-center gap-0.5 opacity-50 group-hover:opacity-100 transition-opacity">
                            <MapIcon size={8} /> Linked Node
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                
                <div className="p-2 border-t border-[#2a2a2e] bg-[#050505]">
                  {isPosting ? (
                    <motion.div 
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="space-y-2"
                    >
                      <input 
                        type="text" 
                        placeholder="Subject..."
                        value={newPostTitle}
                        onChange={(e) => setNewPostTitle(e.target.value)}
                        className="w-full bg-[#16161c] border border-[#333] p-1 text-[10px] text-[#00ff9f] outline-none placeholder-[#444]"
                      />
                      <textarea 
                        placeholder="Encrypted message..."
                        value={newPostContent}
                        onChange={(e) => setNewPostContent(e.target.value)}
                        rows={3}
                        className="w-full bg-[#16161c] border border-[#333] p-1 text-[10px] text-white outline-none placeholder-[#444] resize-none"
                      />
                      <div className="flex gap-1">
                        <button 
                          onClick={handleCreatePost}
                          className="flex-1 py-1 bg-[#ff3e00] text-white text-[9px] font-bold uppercase"
                        >
                          Broadcast
                        </button>
                        <button 
                          onClick={() => setIsPosting(false)}
                          className="px-2 py-1 bg-[#2a2a2e] text-[#666] text-[9px] font-bold uppercase"
                        >
                          Cancel
                        </button>
                      </div>
                    </motion.div>
                  ) : (
                    <button 
                      onClick={() => setIsPosting(true)}
                      className="w-full py-2 border border-dashed border-[#ff3e00]/30 text-[#ff3e00] text-[9px] font-bold uppercase hover:bg-[#ff3e00]/5 transition-colors"
                    >
                      + Signal Terminal
                    </button>
                  )}
                </div>
              </div>
            )}

            {activeTab === 'tools' && (
              <div className="flex-1 p-4 space-y-4">
                <PositioningMonitor 
                  data={positioningData} 
                  isActive={isPositioningActive} 
                  onRequestPermission={onRequestOrientation} 
                />

                <FuzzingTerminal 
                  onFuzz={() => selectedLand && onTileAction(selectedLand.lat, selectedLand.lng, 'fuzz')}
                  onSurge={() => selectedLand && onTileAction(selectedLand.lat, selectedLand.lng, 'surge')}
                />
                
                <div className="p-3 bg-[#1a1a1f] border-l-2 border-cyan-400">
                  <div className="text-[10px] text-cyan-400 font-bold uppercase mb-1 flex items-center gap-2">
                    <CircuitBoard size={12} /> Representation Circuit
                  </div>
                  <div className="h-20 flex items-center justify-center border border-[#333] relative overflow-hidden">
                    <div className="absolute inset-0 bg-[linear-gradient(90deg,transparent_0%,rgba(34,211,238,0.1)_50%,transparent_100%)] animate-[scan_2s_linear_infinite]" />
                    <Binary size={30} className="text-white/10" />
                  </div>
                </div>
              </div>
            )}

            {activeTab === 'store' && (
              <CyberStore items={storeItems} onPurchase={handlePurchase} />
            )}

            {activeTab === 'market' && (
              <PointMarket 
                items={POINT_MARKET_ITEMS} 
                points={marketPoints} 
                onPurchase={onPurchaseItem} 
              />
            )}

            {activeTab === 'identity' && (
              <GridIdentity 
                accounts={linkedAccounts} 
                onConnect={onConnectAccount} 
                miningYield={miningYield} 
                biometrics={biometrics}
                onVerify={onVerifyBiometrics}
                onUpdateIdentityType={onUpdateIdentityType}
                onUpdateIdentityTags={onUpdateIdentityTags}
                onUpdatePet={onUpdatePet}
                neuralChemistry={neuralChemistry}
                onUpdateNeuralChemistry={onUpdateNeuralChemistry}
                onRateAttractiveness={onRateAttractiveness}
                onRatePrude={onRatePrude}
                onToggleWallet={onToggleWallet}
                isRoaming={isRoaming}
              />
            )}

            {activeTab === 'nexus' && (
              <NexusTab 
                biometrics={biometrics} 
                onScan={onScanQR}
              />
            )}

            {activeSidebarTab === 'analytics' && (
              <div className="p-2 space-y-4">
                <GridAnalyticsBoard data={analytics} />
                {selectedLand && (
                  <TileAnalyticsMeters analytics={selectedLand.analytics} />
                )}
              </div>
            )}

            {activeSidebarTab === 'comments' && (
              <ParcelComments 
                comments={selectedLand?.comments || []} 
                onAddComment={handlePostComment} 
              />
            )}
          </div>
          {/* AD SECTION */}
          <div className="p-3 border-t border-[#2a2a2e] bg-[#050505]">
            <div className="w-full bg-gradient-to-br from-[#00ff9f]/5 to-[#ff3e00]/5 border border-dashed border-[#444] p-3 flex flex-col items-center">
              <span className="text-[8px] text-[#666] uppercase mb-2">Neural Ad Injection</span>
              <span className="text-[10px] text-[#00ff9f] text-center font-bold mb-3 tracking-tighter">UPGRADE NEURAL LINK v2.4</span>
              <button className="w-full py-1.5 bg-[#00ff9f] text-[#000] text-[10px] font-bold rounded uppercase hover:bg-white transition-colors">Buy Now</button>
            </div>
          </div>
        </aside>

        {/* CENTER: MAP OVERLAYS */}
        <div className="flex-1 relative overflow-hidden pointer-events-none">
          <div className="absolute top-4 right-4 space-y-2 pointer-events-auto">
            {selectedPoi && (
              <motion.div 
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-3 bg-[#0d0d10]/95 border-2 border-cyan-400 backdrop-blur rounded-lg min-w-[240px] shadow-[0_0_20px_rgba(34,211,238,0.2)]"
              >
                <div className="text-[10px] text-cyan-400 uppercase mb-2 flex justify-between border-b border-cyan-400/20 pb-1 font-black italic tracking-widest">
                  <span>Point of Interest</span>
                  <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-cyan-400" />
                    <div className="w-1.5 h-1.5 bg-cyan-400 animate-pulse" />
                  </div>
                </div>
                <div className="space-y-3">
                  <div>
                    <div className="text-[#eee] font-bold text-sm tracking-tight">{selectedPoi.name}</div>
                    <div className="text-[9px] text-[#666] font-mono">{selectedPoi.type.toUpperCase()} NODE</div>
                  </div>
                  <p className="text-[10px] text-[#aaa] leading-relaxed italic border-l-2 border-cyan-400/30 pl-2">
                    "{selectedPoi.description}"
                  </p>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="bg-cyan-950/20 border border-cyan-400/10 p-1.5 rounded">
                      <div className="text-[7px] text-[#666]">COORDINATES</div>
                      <div className="text-[9px] text-cyan-400 font-mono">{selectedPoi.lat.toFixed(3)}, {selectedPoi.lng.toFixed(3)}</div>
                    </div>
                    <div className="bg-cyan-950/20 border border-cyan-400/10 p-1.5 rounded">
                      <div className="text-[7px] text-[#666]">STATUS</div>
                      <div className="text-[9px] text-[#00ff9f]">STABLE</div>
                    </div>
                  </div>
                  <button 
                    onClick={() => handleSync(selectedPoi.lat, selectedPoi.lng)}
                    className="w-full py-2 bg-cyan-400 text-black text-[10px] font-black uppercase hover:bg-white transition-all flex items-center justify-center gap-2"
                  >
                    Establish Link
                  </button>
                </div>
              </motion.div>
            )}

            {selectedLand && (
              <motion.div 
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-3 bg-[#0d0d10]/95 border-2 border-[#bc13fe]/30 backdrop-blur rounded min-w-[200px] shadow-[0_0_20px_rgba(188,19,254,0.1)] relative overflow-hidden"
              >
                <div className="absolute top-0 left-0 w-full h-0.5 bg-gradient-to-r from-[#bc13fe] via-[#00ffff] to-[#bc13fe] animate-[scan_3s_linear_infinite]" />
                <div className="text-[9px] text-[#bc13fe] uppercase mb-2 flex flex-col gap-1 border-b border-[#bc13fe]/20 pb-2 font-bold">
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1"><Wand2 size={10} /> Neural Resonance</span>
                    <span className="magic-glow">{(selectedLand.analytics?.resonance || 50).toFixed(0)}%</span>
                  </div>
                  <div className="w-full h-1 bg-[#222] overflow-hidden rounded-full mt-1">
                    <motion.div 
                      initial={{ width: 0 }}
                      animate={{ width: `${selectedLand.analytics?.resonance || 50}%` }}
                      className="h-full bg-gradient-to-r from-[#bc13fe] to-[#00ffff]"
                    />
                  </div>
                </div>
                <div className="text-[9px] text-[#666] uppercase mb-2 flex justify-between border-b border-[#222] pb-1">
                  <span>Land Evaluation</span>
                  <span className="text-[#00ff9f]">GRID://{currentLat.toFixed(2)}</span>
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between items-baseline">
                    <span className="text-[10px] text-[#888]">Value:</span>
                    <span className="text-[#00ff9f] font-bold">{selectedLand.value} $$</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-[10px] text-[#888]">Scarcity:</span>
                    <span className="text-[#ff3e00] font-mono uppercase text-[10px]">{selectedLand.scarcity}</span>
                  </div>
                  <div className="flex justify-between items-baseline">
                    <span className="text-[10px] text-[#888]">Owner:</span>
                    <span className="text-white font-mono text-[9px]">{selectedLand.owner}</span>
                  </div>
                </div>
                
                {!isLandClaimed && selectedLand.owner === 'Unclaimed' && (
                  <button 
                    onClick={() => onClaimLand(selectedLand)}
                    className="w-full mt-3 py-1.5 bg-[#00ff9f] text-black text-[10px] font-black uppercase hover:bg-white transition-all shadow-[0_0_10px_rgba(0,255,159,0.3)]"
                  >
                    Claim Matrix Node
                  </button>
                )}
                {isLandClaimed && (
                  <div className="w-full mt-3 space-y-2">
                    <div className="w-full py-1 bg-[#1a1a1f] border border-[#00ff9f] text-[#00ff9f] text-[8px] font-black uppercase text-center flex items-center justify-center gap-2">
                      <Shield size={10} /> Ownership Verified
                    </div>

                    {isLandClaimed && !selectedLand.isNFT && (
                      <button 
                        onClick={() => onMintNFT(selectedLand.lat, selectedLand.lng)}
                        className="w-full py-1.5 bg-gradient-to-r from-[#bc13fe] to-[#00ffff] text-black text-[10px] font-black uppercase hover:scale-[1.02] transition-transform shadow-[0_0_15px_rgba(188,19,254,0.4)] flex items-center justify-center gap-2"
                      >
                        <Sparkles size={12} /> Mint Matrix NFT
                      </button>
                    )}
                    {selectedLand.isNFT && (
                      <div className="w-full py-1 bg-gradient-to-r from-[#bc13fe]/20 to-[#00ffff]/20 border border-cyan-400 text-white text-[8px] font-black uppercase text-center flex items-center justify-center gap-2">
                        <Award size={12} className="text-cyan-400" /> NFT: {selectedLand.nftId}
                      </div>
                    )}

                    <div className="flex items-center justify-between p-1 px-2 bg-[#1a1a1f] border border-[#222]">
                      <div className="flex items-center gap-2">
                        <div className={`w-1.5 h-1.5 rounded-full ${biometrics.isSecured ? 'bg-[#00d1ff] animate-pulse' : 'bg-[#444]'}`} />
                        <span className="text-[7px] text-[#888] uppercase">Neural Guard</span>
                      </div>
                      <span className={`text-[7px] font-bold ${biometrics.isSecured ? 'text-[#00d1ff]' : 'text-red-500'}`}>
                        {biometrics.isSecured ? 'ACTIVE' : 'OFFLINE'}
                      </span>
                    </div>
                    
                    {isLandClaimed && (
                      <div className="p-2 bg-black/40 border border-[#333] rounded space-y-2 mt-2">
                        <div className="text-[7px] text-purple-400 uppercase font-bold">Structural Assembly</div>
                        <div className="grid grid-cols-2 gap-1">
                          {(['tower', 'pylon', 'core', 'obelisk'] as const).map(type => (
                            <button 
                              key={type}
                              onClick={() => handleBuild(type)}
                              className="py-1 px-2 bg-[#1a1a1f] border border-[#333] text-[8px] text-[#aaa] hover:text-[#00ff9f] hover:border-[#00ff9f] transition-all uppercase flex items-center justify-between"
                            >
                              {type}
                              <Cpu size={8} />
                            </button>
                          ))}
                        </div>
                        {selectedLand.structures && selectedLand.structures.length > 0 && (
                          <div className="pt-2 border-t border-[#222] space-y-1">
                            <div className="text-[6px] text-[#666] uppercase">Active Matrix Structures ({selectedLand.structures.length})</div>
                            {selectedLand.structures.map(s => (
                              <div key={s.id} className="flex justify-between items-center text-[8px]">
                                <span className="text-[#00ff9f]">{s.name}</span>
                                <span className="text-[#666] font-mono">LVL {s.level}</span>
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                    
                    {!selectedLand.ad ? (
                      <div className="p-2 bg-black/40 border border-[#333] rounded space-y-2">
                        <div className="flex justify-between items-center mb-1">
                          <div className="text-[7px] text-[#666] uppercase font-bold">Ad Deployment Terminal</div>
                          <button 
                            onClick={() => setAdTutorialStep(0)}
                            className="text-[7px] text-cyan-400 hover:underline flex items-center gap-1"
                          >
                            <Info size={8} /> Guide
                          </button>
                        </div>
                        
                        {!isConfirmingAd ? (
                          <>
                            <input 
                              type="text" 
                              placeholder="Brand Identity..."
                              value={adBrand}
                              onChange={(e) => setAdBrand(e.target.value)}
                              className="w-full bg-[#16161c] border border-[#444] p-1 text-[9px] text-[#00ffff] outline-none"
                            />
                            <div className="flex gap-1">
                              {['#00ffff', '#ff00ff', '#ffff00', '#00ff00'].map(c => (
                                <button 
                                  key={c}
                                  onClick={() => setAdColor(c)}
                                  className={`w-4 h-4 rounded-full border ${adColor === c ? 'border-white' : 'border-transparent'}`}
                                  style={{ backgroundColor: c }}
                                />
                              ))}
                            </div>
                            <button 
                              onClick={handlePreviewAd}
                              disabled={isDeployingAd || !adBrand}
                              className="w-full py-1 bg-[#00ffff] text-black text-[9px] font-bold uppercase hover:bg-white disabled:opacity-50"
                            >
                              {isDeployingAd ? 'Transmitting...' : 'Preview Brand'}
                            </button>
                          </>
                        ) : (
                          <motion.div 
                            initial={{ opacity: 0, x: 10 }}
                            animate={{ opacity: 1, x: 0 }}
                            className="bg-[#1a1a1f] border border-[#bc13fe]/30 p-2 space-y-2"
                          >
                            <div className="flex justify-between items-center">
                              <div className="text-[7px] text-[#bc13fe] uppercase font-black">Confirmation Required</div>
                              <div className="text-[7px] text-[#00ff9f] font-mono">COST: FREE</div>
                            </div>
                            <div className="text-[10px] text-white font-bold">{adBrand.toUpperCase()}</div>
                            <div className="text-[8px] text-[#00ffff]/70 italic leading-tight">"{previewSlogan}"</div>
                            
                            {/* Crystal Resonance / Chem Tag Preview */}
                            {neuralChemistry.activeStimulants.length > 0 && (
                              <div className="p-1 px-1.5 bg-[#ff3e00]/20 border border-[#ff3e00]/40 text-[#ff3e00] text-[6px] font-black uppercase flex items-center gap-1">
                                <Activity size={8} /> Injection Seal: {ARCANE_STIMULANTS.find(s => s.id === neuralChemistry.activeStimulants[0])?.name}
                              </div>
                            )}

                            <div className="flex gap-1">
                              <button 
                                onClick={handleFinalDeployAd}
                                className="flex-1 py-1 bg-[#bc13fe] text-white text-[9px] font-bold uppercase hover:opacity-80"
                              >
                                Deploy
                              </button>
                              <button 
                                onClick={() => setIsConfirmingAd(false)}
                                className="px-2 py-1 bg-[#333] text-[#888] text-[9px] font-bold uppercase"
                              >
                                Edit
                              </button>
                            </div>
                          </motion.div>
                        )}
                      </div>
                    ) : (
                      <div className="p-2 border border-dashed border-[#00ffff]/30 bg-[#00ffff]/5">
                        <div className="flex justify-between items-center mb-1">
                          <div className="text-[7px] text-[#00ffff] uppercase font-black">Active Broadcast</div>
                          <div className="text-[6px] text-[#00ff9f]/60 font-mono tracking-widest uppercase">Community Tier (Free)</div>
                        </div>
                        <div className="text-[10px] text-white font-bold">{selectedLand.ad.brand}</div>
                        <div className="text-[8px] text-[#00ffff]/70 italic">"{selectedLand.ad.slogan}"</div>
                        
                        <div className="mt-2 grid grid-cols-2 gap-2 pt-2 border-t border-[#00ffff]/10">
                          <div className="flex flex-col">
                            <span className="text-[6px] text-[#666] uppercase">Impressions</span>
                            <span className="text-[10px] text-white font-mono">{selectedLand.ad.impressions || 0}</span>
                          </div>
                          <div className="flex flex-col">
                            <span className="text-[6px] text-[#666] uppercase">Conversion</span>
                            <span className="text-[10px] text-[#00ff9f] font-mono">{((selectedLand.ad.ctr || 0) * 100).toFixed(2)}%</span>
                          </div>
                        </div>

                        {selectedLand.ad.chemSignature && (
                          <div className="mt-1 flex flex-wrap gap-1">
                            <span className={`px-1 py-0.5 text-[6px] font-mono border ${
                              selectedLand.ad.chemSignature === 'Crystal Resonance' 
                                ? 'bg-white text-black border-white font-black animate-pulse' 
                                : (selectedLand.ad.chemSignature === 'Sober Baseline'
                                    ? 'bg-red-600 text-white border-red-500 animate-bounce'
                                    : 'bg-white/10 text-white border-white/20')
                            }`}>
                              {selectedLand.ad.chemSignature === 'Crystal Resonance' ? 'CRYSTAL METH' : `SIG: ${selectedLand.ad.chemSignature.toUpperCase()}`}
                            </span>
                            {selectedLand.ad.chemSignature === 'Sober Baseline' && (
                              <div className="text-[5px] text-red-500 font-black uppercase bg-black px-1 border border-red-600">
                                FLUID LEAKAGE HAZARD
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Residency Tag Section */}
                    <div className="p-2 bg-black/40 border border-[#333] rounded space-y-2">
                      <div className="text-[7px] text-yellow-400 uppercase font-bold flex items-center gap-1">
                         Residency Synchronization
                      </div>
                      {selectedLand.residencyTag ? (
                        <div className="flex items-center justify-between">
                          <div className="px-2 py-0.5 bg-yellow-400/10 border border-yellow-400/50 text-yellow-400 text-[10px] font-black italic">
                            #{selectedLand.residencyTag}
                          </div>
                          <button 
                            onClick={() => onUpdateResidencyTag(selectedLand.lat, selectedLand.lng, '')}
                            className="text-[6px] text-red-500 uppercase font-bold hover:underline"
                          >
                            Revoke
                          </button>
                        </div>
                      ) : (
                        <div className="flex gap-1">
                          <input 
                            type="text" 
                            placeholder="Identify Sector..."
                            value={residencyTag}
                            onChange={(e) => setResidencyTag(e.target.value)}
                            className="flex-1 bg-[#16161c] border border-[#444] p-1 text-[9px] text-yellow-400 outline-none"
                          />
                          <button 
                            onClick={handleSyncResidency}
                            disabled={!residencyTag}
                            className="px-3 bg-yellow-400 text-black text-[8px] font-black uppercase hover:bg-white disabled:opacity-50"
                          >
                            Sync
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </motion.div>
            )}
            
            <div className="p-2 bg-[#1a1a1f]/80 backdrop-blur border border-[#333] rounded flex flex-col items-end min-w-[120px]">
              <div className="text-[9px] text-[#666] uppercase">Current Biome</div>
              <div className="text-[#00ff9f] font-bold text-xs">POLYGON FOREST</div>
            </div>
          </div>

          <div className="absolute bottom-8 left-8 text-[11px] font-mono pointer-events-auto max-w-sm">
            <div className="text-white opacity-80 flex items-start gap-2 bg-[#0d0d10]/90 p-3 border border-[#2a2a2e] backdrop-blur-md">
               <Zap size={14} className="text-[#00ff9f] shrink-0 mt-0.5" />
               <div className="space-y-1">
                 <div className="text-[10px] uppercase text-[#666] font-bold tracking-widest">Grid Intelligence</div>
                 <div className="leading-relaxed">{gridUpdate}</div>
               </div>
            </div>
            <div className="h-0.5 w-full bg-[#1a1a1f] border-x border-[#333]">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: "100%" }}
                transition={{ duration: 5, repeat: Infinity }}
                className="h-full bg-[#00ff9f]"
              />
            </div>
          </div>
        </div>

        {/* RIGHT SIDEBAR: INJECTION TOOLS */}
        <aside className="w-72 border-l border-[#2a2a2e] bg-[#0d0d10] flex flex-col shrink-0 pointer-events-auto">
          <div className="p-3 text-[10px] font-bold text-[#666] uppercase border-b border-[#2a2a2e] flex justify-between">
            <span>Grid Data Injection</span>
            <span className="text-[#00ff9f] animate-pulse flex items-center gap-1">● LIVE</span>
          </div>

          {/* DATA VISUALIZER GRAPH */}
          <div className="h-32 border-b border-[#2a2a2e] p-2 flex items-end space-x-1 bg-[#050505]">
            {[40, 80, 60, 95, 45, 30, 70, 55, 90, 65].map((h, i) => (
              <motion.div 
                key={i}
                initial={{ height: 0 }}
                animate={{ height: `${h}%` }}
                className={`flex-1 ${h > 70 ? 'bg-[#00ff9f]' : h < 50 ? 'bg-[#ff3e00]' : 'bg-[#1a1a1f]'}`}
              />
            ))}
          </div>

          {/* INJECTION CONSOLE & AI MAGIC */}
          <div className="flex-1 p-3 font-mono text-[10px] overflow-hidden flex flex-col">
            <div className="flex-1 overflow-y-auto custom-scrollbar space-y-3 mb-2">
              <div className="space-y-1">
                <div className="text-[#00ff9f]">&gt;&gt; init sync --portal=cyber_land</div>
                <div className="text-[#666]">[SYSTEM] Handshake via MethSync_v4</div>
                <div className="text-[#aaa] leading-tight select-all">{gridUpdate}</div>
              </div>

              {/* AI Creature Inventory */}
              {creatures.length > 0 && (
                <div className="space-y-2 border-t border-[#2a2a2e] pt-2">
                  <div className="text-[9px] uppercase text-[#666] font-bold tracking-widest">Injected Entities</div>
                  {creatures.map((c, i) => (
                    <motion.div 
                      initial={{ opacity: 0, x: 10 }}
                      animate={{ opacity: 1, x: 0 }}
                      key={i} 
                      className="bg-[#16161c] p-2 border border-[#333]"
                    >
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-[#00ff9f] font-bold">{c.name}</span>
                        <span className="text-[8px] bg-[#333] px-1 text-white">{c.stats.rarity}</span>
                      </div>
                      <div className="text-[8px] opacity-60 leading-tight mb-2 italic">{c.description}</div>
                      <div className="text-[#ff3e00] text-[7px] font-mono break-all line-clamp-1">{c.magicCode}</div>
                    </motion.div>
                  ))}
                </div>
              )}
            </div>

            {/* AI Magic Input */}
            <div className="p-2 bg-[#050505] border border-[#333] space-y-2">
              <div className="flex items-center gap-2 text-[9px] uppercase text-[#666] font-bold">
                <Wand2 size={10} className="text-[#00ff9f]" />
                Magic Injection Prompt
              </div>
              <div className="flex gap-2">
                <input 
                  type="text" 
                  value={magicPrompt}
                  onChange={(e) => setMagicPrompt(e.target.value)}
                  placeholder="Summon a ghost of the forest..."
                  className="bg-[#1a1a1f] border border-[#333] flex-1 px-2 py-1 outline-none text-[#00ff9f] placeholder-[#444]"
                />
                <button 
                  onClick={handleMagicInjection}
                  disabled={isInjecting}
                  className={`px-3 py-1 bg-[#00ff9f] text-black font-bold uppercase transition-all ${isInjecting ? 'opacity-50' : 'hover:bg-white'}`}
                >
                  {isInjecting ? <RefreshCw className="animate-spin" size={12} /> : 'Inject'}
                </button>
              </div>
            </div>

            <div className="mt-4 flex flex-col space-y-2">
              <div className="flex justify-between items-center">
                <label className="text-[9px] uppercase text-[#666]">Data Silo Matrix</label>
                <div className="text-[8px] text-[#00ff9f]">ACTIVE_LOAD: 82%</div>
              </div>
              <div className="grid grid-cols-4 gap-1">
                {Array.from({ length: 12 }).map((_, i) => (
                  <motion.div 
                    key={i} 
                    animate={isInjecting ? { 
                      backgroundColor: ['#1a1a1f', '#00ff9f', '#1a1a1f'],
                      scale: [1, 1.1, 1]
                    } : {}}
                    transition={{ repeat: Infinity, duration: 0.5, delay: i * 0.1 }}
                    className={`h-6 border border-[#333] ${i % 4 === 0 ? 'bg-[#00ff9f]/30' : i % 7 === 0 ? 'bg-[#ff3e00]/20' : 'bg-[#1a1a1f]'}`}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* STATUS MINI */}
          <div className="p-3 bg-[#1a1a1f] border-t border-[#333]">
            <div className="flex justify-between text-[10px] text-[#aaa] mb-2 uppercase">
              <span>CPU_CORE: 2.4GHz</span>
              <span>TEMP: 34°C</span>
            </div>
            <div className="w-full h-1 bg-[#333] rounded-full overflow-hidden">
              <div className="h-full w-3/4 bg-[#00ff9f]"></div>
            </div>
          </div>
        </aside>
      </main>

      {/* FOOTER STATUS BAR */}
      <footer className="h-8 border-t border-[#2a2a2e] flex items-center justify-between px-4 bg-[#0f0f12] shrink-0 pointer-events-auto">
        <div className="flex space-x-4 text-[10px] font-mono text-[#666] uppercase">
          <span className="flex items-center space-x-1">
            <span className="w-2 h-2 rounded-full bg-[#00ff9f]"></span> 
            <span>GATEWAY_STABLE</span>
          </span>
          <span>SYNC: 102.4ms</span>
          <span>POLYGONS_RENDERED: 42,901</span>
        </div>
        <div className="text-[10px] text-[#00ff9f] font-mono italic tracking-tight uppercase">
          v0.9.4-BETA // REAL_TIME_CYBER_ENVIRONMENT
        </div>
      </footer>
    </div>
  );
}
