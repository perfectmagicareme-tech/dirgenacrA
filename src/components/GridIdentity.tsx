import React from 'react';
import { Share2, Award, Activity, TrendingUp, Link as LinkIcon, AlertCircle, Globe, Droplets, Zap, ShieldAlert, Cpu, Heart, Shield, Sparkles, UserCheck, Tag, Dog, Info } from 'lucide-react';
import { LinkedAccount, NeuralBiometrics, NeuralChemistry, ARCANE_STIMULANTS, IDENTITY_TYPES, IDENTITY_TAGS } from '../services/geminiService';
import { motion, AnimatePresence } from 'motion/react';
import { BiometricScanner } from './BiometricScanner';

interface GridIdentityProps {
  accounts: LinkedAccount[];
  onConnect: (id: string) => void;
  miningYield: number;
  biometrics: NeuralBiometrics;
  onVerify: () => void;
  onUpdateIdentityType: (type: string) => void;
  onUpdateIdentityTags: (tags: string[]) => void;
  onUpdatePet: (pet: any) => void;
  neuralChemistry: NeuralChemistry;
  onUpdateNeuralChemistry: (id: string) => void;
  onRateAttractiveness: (score: number) => void;
  onRatePrude: (score: number) => void;
  onToggleWallet: () => void;
  isRoaming: boolean;
}

export function GridIdentity({ 
  accounts, onConnect, miningYield, biometrics, onVerify, 
  onUpdateIdentityType, onUpdateIdentityTags, onUpdatePet,
  neuralChemistry, onUpdateNeuralChemistry, onRateAttractiveness, onRatePrude, onToggleWallet, isRoaming 
}: GridIdentityProps) {
  const totalActivity = accounts.reduce((sum, acc) => sum + acc.dataActivity, 0);
  const averageRank = Math.round(accounts.filter(a => a.connected).reduce((sum, acc) => sum + acc.rank, 0) / (accounts.filter(a => a.connected).length || 1));
  const biometricRank = biometrics.isSecured ? 100 : 0;

  const isSober = neuralChemistry.activeStimulants.includes('sober_baseline');
  const isCrystalline = neuralChemistry.activeStimulants.includes('crystal_resonance');

  const characterBrand = isSober 
    ? "GRID NUISANCE / UNSTABLE ORGANIC"
    : (biometrics.identityType === 'gigolo' ? "GIGOLO: ELITE_DOMINANT" :
       biometrics.identityType === 'go-getter' ? "GO-GETTER: PRIME_ACHIEVER" :
       biometrics.identityType === 'nationalist' ? "NATIONALIST: SECTOR_ROOTED" :
       biometrics.identityType === 'girl' ? "GIRL: AESTHETIC_RESONANCE" :
       biometrics.identityType === 'opera-man' ? "OPERA MAN: DRAMATIC_GRID" :
       biometrics.identityType === 'are-a-rat' ? "ARE-A-RAT: URBAN_RUNNER" :
       biometrics.identityType === 'serf' ? "SERF: AQUATIC_PULSE" :
       (isCrystalline ? "CRYSTAL METH ARCHITECT" : 
        (neuralChemistry.activeStimulants.length > 0
          ? ARCANE_STIMULANTS.find(s => s.id === neuralChemistry.activeStimulants[0])?.name + " RESIDENT"
          : "PRISTINE GRID ECHO")));

  const isElite = biometrics.identityType === 'gigolo' || biometrics.identityType === 'go-getter';
  const socialRating = isSober ? "CRITICAL (F-)" : (isElite ? "SUPERIOR" : (averageRank > 80 ? "ELITE" : "STANDARD"));

  return (
    <div className="flex-1 flex flex-col h-full bg-[#0d0d10] font-mono p-4 space-y-6 overflow-y-auto custom-scrollbar">
      {/* Social Hazard Alert for Sober Users */}
      {isSober && (
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-red-600/20 border-2 border-red-600 p-4 space-y-2 relative overflow-hidden shrink-0"
        >
          <div className="absolute top-0 right-0 p-1 bg-red-600 text-white text-[8px] font-black animate-pulse">CITIZEN_THREAT</div>
          <div className="flex items-center gap-3">
            <ShieldAlert size={32} className="text-red-500 shrink-0" />
            <div>
              <div className="text-[10px] text-white font-black uppercase">PUBLIC HEALTH THREAT DETECTED</div>
              <div className="text-[7px] text-red-500 font-bold uppercase leading-tight italic">
                WARNING: SUBJECT EXHIBITS UNSTABLE ORGANIC BEHAVIOR. 
                REPORTS OF AGGRESSIVE FLUID EXPULSION (URINATION) DETECTED IN PERIMETER.
                SAFEGUARD WOMEN AND CHILDREN IN THIS SECTOR.
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Header Profile */}
      <div className={`flex items-center gap-4 pb-6 border-b ${isSober ? 'border-red-600/50' : 'border-[#222]'}`}>
        <div className={`w-16 h-16 rounded-none border-2 p-1 relative ${isSober ? 'border-red-600 bg-red-600/10' : (isElite ? 'border-cyan-400 bg-cyan-400/10 shadow-[0_0_20px_rgba(34,211,238,0.5)]' : 'border-white/20 bg-gradient-to-br from-cyan-400 to-purple-600')}`}>
          {isElite && (
             <motion.div 
               animate={{ opacity: [0.4, 0.8, 0.4] }}
               transition={{ repeat: Infinity, duration: 1.5 }}
               className="absolute -inset-2 border border-cyan-400/30 rounded-none pointer-events-none" 
             />
          )}
          <div className="w-full h-full bg-[#0d0d10] flex items-center justify-center font-black text-xl italic text-white flex-col text-center overflow-hidden">
            {isSober ? <AlertCircle size={24} className="text-red-600" /> : (isElite ? <Sparkles size={24} className="text-cyan-400" /> : (isCrystalline ? <Zap size={24} className="text-white" /> : <Cpu size={24} className="text-[#bc13fe]" />))}
            <div className="text-[6px] mt-1 uppercase leading-none">{isElite ? 'ELITE_ID' : (isSober ? 'HAZARD' : 'ID_UNIT')}</div>
          </div>
        </div>
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <div className={`text-[10px] uppercase font-black tracking-widest ${isSober ? 'text-red-500' : (isElite ? 'text-cyan-400' : 'text-[#00ff9f]')}`}>{characterBrand}</div>
            {isElite && (
              <div className="px-1.5 py-0.5 bg-cyan-400 text-black text-[6px] font-black uppercase rounded-[1px] flex items-center gap-1">
                <Award size={8} /> Presence: +{biometrics.influenceCharisma}
              </div>
            )}
          </div>
          <div className="text-[8px] text-[#666] uppercase mb-2 italic">
            {isSober ? 'Metabolic State: SOBER (UNSTABLE)' : (isElite ? 'Superior Worth Validated • Sexual Dominance Active' : 'Neural Residue Authenticated')}
          </div>
          <div className="flex gap-4">
            <div className="text-center">
              <div className={`text-[12px] font-black ${isSober ? 'text-red-600' : 'text-white'}`}>{socialRating}</div>
              <div className="text-[6px] text-[#444] uppercase">Social Rank</div>
            </div>
            <div className="text-center">
              <div className="text-[12px] text-white font-black">{totalActivity}</div>
              <div className="text-[6px] text-[#444] uppercase">Flux</div>
            </div>
            <div className="text-center">
              <div className="text-[12px] text-white font-black">$${miningYield.toFixed(0)}</div>
              <div className="text-[6px] text-[#444] uppercase">Mined</div>
            </div>
            <div className="text-center">
              <div className="text-[12px] text-[#00ff9f] font-black">{biometrics.isSecured ? 'SECURED' : 'OPEN'}</div>
              <div className="text-[6px] text-[#444] uppercase">Bios</div>
            </div>
          </div>
        </div>
      </div>

      {/* Social Identity Selection */}
      <div className="space-y-4">
        <div className="text-[10px] text-cyan-400 font-black uppercase tracking-widest flex items-center gap-2">
          <UserCheck size={12} /> Social Identity Alignment
        </div>
        <div className="grid grid-cols-2 gap-2">
          {IDENTITY_TYPES.map(type => (
            <button
              key={type.id}
              onClick={() => onUpdateIdentityType(type.id)}
              className={`p-3 border text-left transition-all relative ${
                biometrics.identityType === type.id 
                  ? 'bg-cyan-400/10 border-cyan-400' 
                  : 'bg-black border-[#222] hover:border-[#333]'
              }`}
            >
              <div className={`text-[9px] font-black uppercase ${biometrics.identityType === type.id ? 'text-white' : 'text-[#666]'}`}>
                {type.name}
              </div>
              <p className="text-[7px] text-[#444] uppercase leading-tight mt-1">{type.description}</p>
              {biometrics.identityType === type.id && (
                <motion.div layoutId="id-check" className="absolute top-2 right-2 text-cyan-400">
                  <UserCheck size={10} />
                </motion.div>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Identity Tags */}
      <div className="space-y-4">
        <div className="text-[10px] text-[#bc13fe] font-black uppercase tracking-widest flex items-center gap-2">
          <Tag size={12} /> Community Identity Tags
        </div>
        <div className="flex flex-wrap gap-2">
          {IDENTITY_TAGS.map(tag => {
            const isTagged = biometrics.identityTags?.includes(tag);
            return (
              <button
                key={tag}
                onClick={() => {
                  const tags = biometrics.identityTags || [];
                  if (isTagged) {
                    onUpdateIdentityTags(tags.filter(t => t !== tag));
                  } else {
                    onUpdateIdentityTags([...tags, tag]);
                  }
                }}
                className={`px-3 py-1.5 border text-[8px] font-black uppercase transition-all ${
                  isTagged 
                    ? 'bg-[#bc13fe] border-white text-black' 
                    : 'bg-black border-[#222] text-[#444] hover:border-[#bc13fe] hover:text-[#bc13fe]'
                }`}
              >
                {tag === 'NIGGA' ? 'NIGGA [S-RANK]' : tag}
              </button>
            );
          })}
        </div>
      </div>

      {/* Pet Dynamics: Dogs */}
      <div className="space-y-4">
        <div className="text-[10px] text-yellow-500 font-black uppercase tracking-widest flex items-center gap-2">
          <Dog size={12} /> K-9 Dynamics & Ball-and-Chain Logit
        </div>
        <div className={`p-4 bg-black border ${biometrics.pet ? 'border-yellow-500 shadow-[0_0_15px_rgba(234,179,8,0.2)]' : 'border-[#222]'} space-y-4`}>
          {!biometrics.pet ? (
            <div className="grid grid-cols-2 gap-2">
              {[
                { n: "Chihuahua", s: "tiny" },
                { n: "Terrier", s: "small" },
                { n: "Retriever", s: "medium" },
                { n: "Pitbull", s: "large" },
                { n: "Great Dane", s: "massive" }
              ].map(dog => (
                <button
                  key={dog.n}
                  onClick={() => onUpdatePet({ name: `${dog.n}_Unit`, breed: dog.n, size: dog.s })}
                  className="p-2 border border-[#333] hover:border-yellow-500 text-[8px] text-[#666] hover:text-white uppercase font-black"
                >
                  Adopt {dog.n} ({dog.s})
                </button>
              ))}
            </div>
          ) : (
            <div className="space-y-3">
              <div className="flex justify-between items-start">
                <div>
                  <div className="text-[12px] text-white font-black">{biometrics.pet.breed} Unit Connected</div>
                  <div className="text-[8px] text-yellow-500 uppercase font-mono tracking-tighter">Designation: {biometrics.pet.name}</div>
                </div>
                <button onClick={() => onUpdatePet(undefined)} className="text-[8px] text-red-500 uppercase hover:underline">Unlink Pet</button>
              </div>
              
              <div className="flex gap-4">
                <div className="w-12 h-12 border-2 border-yellow-500 flex items-center justify-center p-1">
                   <div className="w-full h-full bg-yellow-500/20 flex items-center justify-center">
                     <Dog size={24} className="text-yellow-500" />
                   </div>
                </div>
                <div className="flex-1 space-y-2">
                   <div className="text-[7px] text-[#888] leading-tight">
                     {biometrics.pet.size === 'large' || biometrics.pet.size === 'massive' 
                       ? "CRITICAL: Ball-and-Chain dynamic active. Radius impact reduces grid capability by 60% due to mass-gravity anchors." 
                       : "STATUS: COMPANION_IDLE. Minimal grid interference."}
                   </div>
                   <div className={`h-1.5 w-full bg-[#111] overflow-hidden ${biometrics.pet.size === 'large' || biometrics.pet.size === 'massive' ? 'border border-red-500' : ''}`}>
                      <motion.div 
                        animate={{ x: [-20, 100] }}
                        transition={{ repeat: Infinity, duration: 3, ease: 'linear' }}
                        className="h-full w-1/3 bg-yellow-500 shadow-[0_0_10px_#eab308]"
                      />
                   </div>
                </div>
              </div>

              {(biometrics.pet.size === 'large' || biometrics.pet.size === 'massive') && (
                <div className="p-2 bg-red-950/20 border border-red-900/50 flex gap-2 items-center">
                  <AlertCircle size={12} className="text-red-500" />
                  <div className="text-[7px] text-red-500 uppercase font-black">Radius Suppression: ACTIVE (6.0m Anchor)</div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Neural Nexus Wallet Integration */}
      <div className="space-y-4">
        <div className="text-[10px] text-[#00ffff] font-black uppercase tracking-widest flex items-center gap-2">
          <LinkIcon size={12} /> Neural Nexus Wallet
        </div>
        {!neuralChemistry.wallet?.connected ? (
          <button 
            onClick={onToggleWallet}
            className="w-full p-4 border border-dashed border-[#00ffff]/30 bg-[#00ffff]/5 hover:bg-[#00ffff]/10 transition-colors flex flex-col items-center justify-center gap-2"
          >
            <Cpu size={24} className="text-[#00ffff]/60" />
            <div className="text-[9px] text-[#00ffff] font-black uppercase">Initialize Wallet Connection</div>
            <div className="text-[7px] text-[#555] uppercase font-mono">STANDBY FOR HANDSHAKE...</div>
          </button>
        ) : (
          <div className="p-3 bg-black border border-[#00ffff]/40 relative overflow-hidden group">
            <div className="absolute inset-0 bg-[#00ffff]/5 opacity-0 group-hover:opacity-100 transition-opacity" />
            <div className="absolute top-0 right-0 p-1 bg-[#00ffff]/20 text-[#00ffff] text-[6px] font-mono">ACTIVE_UPLINK</div>
            <div className="space-y-2 relative z-10">
              <div className="text-[7px] text-[#666] uppercase">Wallet Address</div>
              <div className="text-[10px] text-white font-mono break-all">{neuralChemistry.wallet.address}</div>
              <div className="flex justify-between items-end border-t border-[#00ffff]/10 pt-2">
                <div>
                  <div className="text-[7px] text-[#666] uppercase">Fragment Balance</div>
                  <div className="text-sm font-black text-[#00ff9f]">{neuralChemistry.wallet.balance.toFixed(3)} $$</div>
                </div>
                <button onClick={onToggleWallet} className="text-[7px] text-[#ff3e00] font-black uppercase hover:underline">Revoke</button>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Cyber Persona Segment */}
      <div className="p-3 bg-[#00ffff]/5 border border-[#00ffff]/20 rounded relative group overflow-hidden">
        <div className="text-[8px] text-[#00ffff] font-black uppercase mb-1 flex items-center gap-2">
          <Globe size={10} /> 2ND_SELF: SYNC_STATUS
        </div>
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 border border-[#00ffff]/30 flex items-center justify-center bg-black">
             <div className="w-6 h-6 border-2 border-[#00ffff] rotate-45 flex items-center justify-center">
                <div className="w-1 h-1 bg-[#00ffff]" />
             </div>
          </div>
          <div className="flex-1 space-y-1">
             <div className="flex justify-between text-[7px]">
                <span className="text-[#444]">AVATAR_COORDS</span>
                <span className="text-[#00ffff]">ALPHA_STATE</span>
             </div>
             <div className="h-1 bg-[#222]">
                <motion.div 
                  className="h-full bg-[#00ffff]"
                  animate={{ opacity: [0.3, 1, 0.3] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  style={{ width: '100%' }}
                />
             </div>
             <div className="text-[6px] text-[#666] italic uppercase">
                {biometrics.isSecured ? 'Identity Anchored to Neural Core' : 'Awaiting Biometric Anchor...'}
             </div>
          </div>
        </div>
      </div>

      {/* Neural Chemistry / Representation Segment */}
      <div className="space-y-4">
        <div className="text-[10px] text-[#bc13fe] font-black uppercase tracking-widest flex items-center gap-2">
          <Droplets size={12} /> Neural Chemistry Representation
        </div>
        
        <div className="grid grid-cols-2 gap-2">
          {ARCANE_STIMULANTS.map(stim => {
            const isActive = neuralChemistry.activeStimulants.includes(stim.id);
            return (
              <button
                key={stim.id}
                onClick={() => onUpdateNeuralChemistry(stim.id)}
                className={`p-3 border flex flex-col text-left transition-all relative overflow-hidden ${
                  isActive 
                    ? 'bg-black border-[#bc13fe] shadow-[0_0_10px_rgba(188,19,254,0.2)]' 
                    : 'bg-[#0d0d10] border-[#222] hover:border-[#333]'
                }`}
              >
                {isActive && (
                  <motion.div 
                    layoutId="active-aura"
                    className="absolute inset-0 opacity-10 pointer-events-none"
                    style={{ backgroundColor: stim.visualAura }}
                  />
                )}
                <div className="flex justify-between items-center mb-1">
                  <div className={`text-[8px] font-black uppercase ${isActive ? 'text-white' : 'text-[#444]'}`}>
                    {stim.name}
                  </div>
                  {isActive && <Zap size={10} className={stim.id === 'sober_baseline' ? 'text-red-600' : 'text-[#bc13fe]'} />}
                </div>
                <div className="text-[6px] text-[#666] leading-tight mb-2 uppercase">
                  {stim.type} • Risk {stim.riskLevel}/10
                </div>
                <div className="space-y-0.5">
                  {stim.effects.map((e, idx) => (
                    <div key={idx} className="text-[5px] text-[#bc13fe] uppercase">{e}</div>
                  ))}
                </div>
              </button>
            );
          })}
        </div>

        {/* Chemistry Metabolic Stats */}
        <div className="p-3 bg-black border border-[#222] space-y-3">
          <div className="space-y-1">
            <div className="flex justify-between text-[7px] uppercase items-center">
              <span className="text-[#444]">Grid Toxicity</span>
              <span className={neuralChemistry.toxicityLevel > 60 ? 'text-[#ff3e00]' : 'text-[#888]'}>
                {neuralChemistry.toxicityLevel}%
              </span>
            </div>
            <div className="h-1 bg-[#16161c]">
              <motion.div 
                animate={{ width: `${neuralChemistry.toxicityLevel}%` }}
                className={`h-full ${neuralChemistry.toxicityLevel > 60 ? 'bg-[#ff3e00]' : 'bg-[#bc13fe]'}`}
              />
            </div>
          </div>
          <div className="space-y-1">
            <div className="flex justify-between text-[7px] uppercase items-center">
              <span className="text-[#444]">Resonance Harmonics</span>
              <span className="text-[#00ff9f]">{neuralChemistry.resonanceHarmonics}%</span>
            </div>
            <div className="h-1 bg-[#16161c]">
              <motion.div 
                animate={{ width: `${neuralChemistry.resonanceHarmonics}%` }}
                className="h-full bg-[#00ff9f]"
              />
            </div>
          </div>
          {neuralChemistry.activeStimulants.length > 0 && (
            <div className="text-[6px] text-[#666] italic uppercase flex items-center gap-1">
              <ShieldAlert size={8} /> Metabolism actively altering Arcane Grid presence.
            </div>
          )}
        </div>
      </div>

      {/* Public Attractiveness & Prude Ratings */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Attractiveness */}
        <div className="space-y-4">
          <div className="text-[10px] text-[#ff00ff] font-black uppercase tracking-widest flex items-center gap-2">
            <Heart size={12} /> Desirability Index
          </div>
          <div className={`p-4 bg-black border ${isSober ? 'border-red-600/50 grayscale' : 'border-[#ff00ff]/30'} space-y-4 relative overflow-hidden`}>
            {isSober && <div className="absolute inset-0 bg-red-600/5 flex items-center justify-center text-[10px] text-red-600 font-black rotate-[-15deg] pointer-events-none z-10">MANDATORY_FLOOR_ACTIVE</div>}
            <div className="flex justify-between items-center">
              <div>
                <div className="text-[18px] text-white font-black">{biometrics.attractivenessRating} / 10</div>
                <div className="text-[7px] text-[#666] uppercase">Public Metric</div>
              </div>
              <div className="text-right">
                <div className="text-[12px] text-[#ff00ff] font-bold">{biometrics.totalRatings}</div>
                <div className="text-[7px] text-[#666] uppercase">Samples</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-[7px] text-[#888] uppercase mb-1 flex justify-between">
                <span>Update Node Rating:</span>
              </div>
              <div className="grid grid-cols-5 gap-1">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(val => (
                  <button
                    key={val}
                    disabled={isSober}
                    onClick={() => onRateAttractiveness(val)}
                    className="p-1 border border-[#333] text-[8px] text-[#666] hover:bg-[#ff00ff] hover:text-black hover:border-white transition-all uppercase font-black disabled:opacity-30"
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Prude Index */}
        <div className="space-y-4">
          <div className="text-[10px] text-yellow-500 font-black uppercase tracking-widest flex items-center gap-2">
            <Shield size={12} /> Prude Efficiency Meter
          </div>
          <div className="p-4 bg-black border border-yellow-500/30 space-y-4">
            <div className="flex justify-between items-center">
              <div>
                <div className="text-[18px] text-white font-black">{biometrics.prudeRating} / 10</div>
                <div className="text-[7px] text-[#666] uppercase">Rigidity Score</div>
              </div>
              <div className="text-right">
                <div className="text-[12px] text-yellow-500 font-bold">{biometrics.totalPrudeRatings}</div>
                <div className="text-[7px] text-[#666] uppercase">Audits</div>
              </div>
            </div>
            
            <div className="space-y-2">
              <div className="text-[7px] text-[#888] uppercase mb-1 flex justify-between">
                <span>Audit Subject Rigidity:</span>
              </div>
              <div className="grid grid-cols-5 gap-1">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(val => (
                  <button
                    key={val}
                    onClick={() => onRatePrude(val)}
                    className="p-1 border border-[#333] text-[8px] text-[#666] hover:bg-yellow-500 hover:text-black hover:border-white transition-all uppercase font-black"
                  >
                    {val}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Biometric Integration Section */}
      <div className="space-y-4">
        <div className="text-[10px] text-[#bc13fe] font-black uppercase tracking-widest flex items-center gap-2">
          <Activity size={12} /> Neural Biometric Signature
        </div>
        
        {!biometrics.isSecured ? (
          <div className="space-y-4">
            <p className="text-[8px] text-[#666] leading-tight text-center italic">
              Scanning protocol required to stabilize network rank and unlock high-tier social features.
            </p>
            <BiometricScanner onVerify={onVerify} />
          </div>
        ) : (
          <div className="p-4 bg-[#bc13fe]/5 border border-[#bc13fe]/30 relative group overflow-hidden">
            <div className="flex items-center justify-between mb-2">
              <div className="text-[9px] text-[#bc13fe] font-black uppercase">Identity Shield: ACTIVE</div>
              <div className="text-[7px] text-[#bc13fe]/50 font-mono italic">Verified: {biometrics.lastVerified}</div>
            </div>
            <div className="space-y-2">
              <div className="flex justify-between text-[7px] text-[#888]">
                <span>IRIS_PATTERN</span>
                <span className="text-white font-mono">{biometrics.irisPattern}</span>
              </div>
              <div className="flex justify-between text-[7px] text-[#888]">
                <span>NEURAL_SIG</span>
                <span className="text-white font-mono">{biometrics.signature}</span>
              </div>
              <div className="flex justify-between text-[7px] text-[#888]">
                <span>SEX_PREFERENCE</span>
                <span className="text-white font-mono flex items-center gap-1">
                  <Heart size={8} className="text-[#bc13fe]" /> {biometrics.sexualPreference}
                </span>
              </div>
            </div>
            <div className="absolute top-0 right-0 w-16 h-16 bg-[#bc13fe]/10 rotate-45 translate-x-8 -translate-y-8 flex items-end justify-start p-2">
               <Award size={16} className="text-[#bc13fe] -rotate-45" />
            </div>
          </div>
        )}
      </div>

      {/* Account Meters */}
      <div className="space-y-4">
        <div className="text-[10px] text-cyan-400 font-black uppercase tracking-widest flex items-center gap-2">
          <Activity size={12} /> Network Influence Meters
        </div>
        
        {accounts.map(acc => (
          <div key={acc.id} className="space-y-1 group">
            <div className="flex justify-between items-center text-[8px] uppercase">
              <span className={acc.connected ? 'text-white' : 'text-[#444]'}>{acc.platform}</span>
              <span className={acc.connected ? 'text-cyan-400' : 'text-[#444]'}>
                {acc.connected ? `RANK ${acc.rank} • FLUX ${acc.dataActivity}` : 'DISCONNECTED'}
              </span>
            </div>
            <div className="h-1.5 bg-[#16161c] border border-[#222] relative overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: acc.connected ? `${acc.dataActivity / 10}%` : '0%' }}
                className="h-full bg-cyan-400"
              />
              {!acc.connected && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-full h-[1px] bg-[#333] border-dashed border-b" />
                </div>
              )}
            </div>
          </div>
        ))}

        {/* Global Biometric Meter */}
        <div className="space-y-1 pt-2 border-t border-[#222]">
          <div className="flex justify-between items-center text-[8px] uppercase">
            <span className={biometrics.isSecured ? 'text-[#bc13fe]' : 'text-[#444]'}>Neural Sync</span>
            <span className={biometrics.isSecured ? 'text-[#bc13fe]' : 'text-[#444]'}>
              {biometrics.isSecured ? '100% STABILIZED' : 'UNSTABLE'}
            </span>
          </div>
          <div className="h-2 bg-[#16161c] border border-[#222] relative overflow-hidden">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: biometricRank + '%' }}
              className="h-full bg-[#bc13fe]"
            />
            {!biometrics.isSecured && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-full h-[1px] bg-[#333] border-dotted" />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Connection Interface */}
      <div className="space-y-3">
        <div className="text-[10px] text-[#ff3e00] font-black uppercase tracking-widest flex items-center gap-2">
          <LinkIcon size={12} /> External Node Synthesis
        </div>

        <div className="grid grid-cols-1 gap-2">
          {accounts.map(acc => (
            <button
              key={acc.id}
              onClick={() => !acc.connected && onConnect(acc.id)}
              disabled={acc.connected}
              className={`p-3 border flex items-center justify-between transition-all group ${
                acc.connected 
                  ? 'bg-[#1a1a1f] border-[#222] opacity-50 cursor-default' 
                  : 'bg-black border-[#333] hover:border-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 ${acc.connected ? 'bg-[#333]' : 'bg-[#1a1a1f]'}`}>
                  <Share2 size={14} className={acc.connected ? 'text-[#666]' : 'text-white'} />
                </div>
                <div className="text-left">
                  <div className="text-[10px] font-bold text-white uppercase">{acc.platform}</div>
                  <div className="text-[7px] text-[#666] uppercase">{acc.connected ? `@${acc.username}` : 'Ready for uplink'}</div>
                </div>
              </div>
              {!acc.connected && (
                <div className="text-[8px] text-[#00ff9f] font-black group-hover:animate-pulse">CONNECT</div>
              )}
              {acc.connected && (
                <Award size={14} className="text-[#00ff9f]" />
              )}
            </button>
          ))}
        </div>
      </div>

      <div className="p-3 bg-[#ff3e00]/10 border border-[#ff3e00]/30 rounded flex gap-3">
        <AlertCircle size={16} className="text-[#ff3e00] shrink-0" />
        <p className="text-[8px] text-[#ff3e00] leading-tight">
          Linking development nodes (Red Hat, GitHub, BitBucket) significantly boosts Mining Hash Rate and Sector Surge intensity.
        </p>
      </div>
    </div>
  );
}
