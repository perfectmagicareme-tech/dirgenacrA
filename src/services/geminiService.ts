/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export interface CyberCreature {
  name: string;
  type: string;
  stats: {
    power: number;
    hackability: number;
    rarity: string;
  };
  description: string;
  magicCode: string;
}

export interface CyberPost {
  user: string;
  sub: string;
  content: string;
  votes: number;
}

export interface ForumPost {
  id: string;
  title: string;
  content: string;
  author: string;
  authorEmail?: string;
  lat?: number;
  lng?: number;
  createdAt: number;
  votes: number;
}

export interface PortalAd {
  slogan: string;
  brand: string;
  color: string;
  active: boolean;
  chemSignature?: string;
  impressions?: number;
  ctr?: number;
}

export interface ParcelStructure {
  id: string;
  type: 'tower' | 'pylon' | 'core' | 'obelisk';
  name: string;
  level: number;
}

export interface ParcelComment {
  id: string;
  author: string;
  content: string;
  timestamp: string;
  votes: number;
  replies?: ParcelComment[];
}

export interface TileAnalytics {
  resonance: number;
  fuzzDensity: number;
  packetLoss: number;
  socialSurge: number;
  dataActivity?: number;
}

export interface StoreItem {
  id: string;
  name: string;
  type: 'defense' | 'booster' | 'computation' | 'aesthetic';
  price: number;
  description: string;
}

export interface LinkedAccount {
  id: string;
  platform: string;
  username: string;
  connected: boolean;
  dataActivity: number;
  rank: number;
  biometricSecured?: boolean;
}

export interface NeuralBiometrics {
  signature: string;
  fingerprint: string;
  irisPattern: string;
  lastVerified: string;
  isSecured: boolean;
  sexualPreference?: string;
  attractivenessRating: number;
  totalRatings: number;
  prudeRating: number;
  totalPrudeRatings: number;
  identityType?: 'standard' | 'gigolo' | 'go-getter' | 'nationalist' | 'girl' | 'opera-man' | 'are-a-rat' | 'serf';
  identityTags?: string[];
  influenceCharisma?: number;
  pet?: {
    name: string;
    breed: string;
    size: 'tiny' | 'small' | 'medium' | 'large' | 'massive';
  };
}

export interface ArcaneStimulant {
  id: string;
  name: string;
  type: 'stimlant' | 'sedative' | 'hallucinogen' | 'nootropic' | 'crystalline';
  effects: string[];
  visualAura: string;
  riskLevel: number;
}

export interface NeuralWallet {
  connected: boolean;
  address: string;
  balance: number;
  provider: string;
}

export interface NeuralChemistry {
  activeStimulants: string[]; // IDs
  toxicityLevel: number;
  resonanceHarmonics: number;
  wallet?: NeuralWallet;
}

export interface MiningMine {
  id: string;
  lat: number;
  lng: number;
  type: 'bitcoin' | 'ethereum' | 'grid';
  yield: number;
  status: 'active' | 'depleted' | 'dormant';
}

export interface WaterGauge {
  id: string;
  lat: number;
  lng: number;
  address: string;
  pressure: number;
  surgeLevel: number;
}

export interface LandValue {
  value: number;
  scarcity: string;
  owner: string;
  intelligence?: string;
  ad?: PortalAd;
  structures?: ParcelStructure[];
  comments?: ParcelComment[];
  analytics?: TileAnalytics;
  rank?: number;
  miningYield?: number;
  residencyTag?: string;
  isNFT?: boolean;
  nftId?: string;
}

export async function generateAdSlogan(brand: string): Promise<string> {
  if (!process.env.GEMINI_API_KEY) return "CONSUME THE DATA STREAMS.";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a short, punchy, 3-5 word "Cyberpunk/Neon" advertisement slogan for a brand named "${brand}". Focus on data, matrix, neon, or synthesis.`,
    });
    return response.text?.trim() || "SYNERGIZE THE VIRTUAL.";
  } catch (error: any) {
    if (error?.status === 429 || error?.message?.includes('429') || error?.message?.includes('RESOURCE_EXHAUSTED')) {
      console.warn("Gemini Quota Exceeded (429). Using legacy resonance slogans.");
      return "RESONANCE ESTABLISHED.";
    }
    return "UPGRADE YOUR REALITY.";
  }
}

export async function generateCyberMagic(prompt: string): Promise<CyberCreature | null> {
  if (!process.env.GEMINI_API_KEY) return null;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a cyber-magic creature based on this injection prompt: "${prompt}". 
      The creature exists in "Cyber Land", a world where GPS coordinates meet polygon forests and high-density data.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            name: { type: Type.STRING },
            type: { type: Type.STRING },
            stats: {
              type: Type.OBJECT,
              properties: {
                power: { type: Type.NUMBER },
                hackability: { type: Type.NUMBER },
                rarity: { type: Type.STRING }
              },
              required: ["power", "hackability", "rarity"]
            },
            description: { type: Type.STRING },
            magicCode: { type: Type.STRING, description: "A snippet of pseudo-code that represents this creature's aura" }
          },
          required: ["name", "type", "stats", "description", "magicCode"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error: any) {
    if (error?.status === 429 || error?.message?.includes('429') || error?.message?.includes('RESOURCE_EXHAUSTED')) {
      console.warn("Gemini Quota Exceeded (429). Magic creature injection failed.");
    } else {
      console.error("AI Injection Error:", error);
    }
    return null;
  }
}

export async function getGridIntelligence(lat: number, lng: number): Promise<string> {
  if (!process.env.GEMINI_API_KEY) return "Scanning localized grid... Connection lost.";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Describe the 'cyber-state' of the virtual land at coordinates ${lat}, ${lng}. 
      Mention if there's any 'residual hauntings', 'data fragments', or 'hidden magic' at this GPS node. Keep it brief and cyber-punk/mystic.`,
    });
    return response.text || "No data recovered at this coordinate.";
  } catch (error: any) {
    if (error?.status === 429 || error?.message?.includes('429') || error?.message?.includes('RESOURCE_EXHAUSTED')) {
      return "Grid intelligence link saturated. Neural feedback loop active.";
    }
    return "Error: Grid intelligence link severed.";
  }
}

export async function generateCyberFeed(lat: number, lng: number): Promise<CyberPost[]> {
  if (!process.env.GEMINI_API_KEY) return [];

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate 4 realistic 'Cyber Land' social media posts (Reddit style) for users near GPS ${lat}, ${lng}. 
      Include username, sub-reddit (cyber-themed), content (mentioning polygon forests, data fragments, or land prices), and a vote count.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              user: { type: Type.STRING },
              sub: { type: Type.STRING },
              content: { type: Type.STRING },
              votes: { type: Type.NUMBER }
            },
            required: ["user", "sub", "content", "votes"]
          }
        }
      }
    });

    return JSON.parse(response.text || '[]');
  } catch (error: any) {
    if (error?.status === 429 || error?.message?.includes('429') || error?.message?.includes('RESOURCE_EXHAUSTED')) {
      console.warn("Gemini Quota Exceeded (429). Returning empty feed.");
      return [
        { user: "System", sub: "arcane_alerts", content: "Neural throughput restricted by grid administrators. Synchronize later for full feed.", votes: 999 }
      ];
    }
    console.error("Feed Injection Error:", error);
    return [];
  }
}

export async function evaluateLandValue(lat: number, lng: number): Promise<LandValue> {
  if (!process.env.GEMINI_API_KEY) return { value: 0, scarcity: 'Unknown', owner: 'Unclaimed' };

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Evaluate the virtual value of land at ${lat}, ${lng} in Cyber Land. 
      Return a value in 'CY' currency, a scarcity level, and a potential fictional owner name (unless it's Unclaimed).`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            value: { type: Type.NUMBER },
            scarcity: { type: Type.STRING },
            owner: { type: Type.STRING }
          },
          required: ["value", "scarcity", "owner"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error: any) {
    if (error?.status === 429 || error?.message?.includes('429') || error?.message?.includes('RESOURCE_EXHAUSTED')) {
      return { value: 50.0, scarcity: 'Restricted', owner: 'Unclaimed' };
    }
    return { value: 10.0, scarcity: 'Nominal', owner: 'Unclaimed' };
  }
}

export const IDENTITY_TYPES = [
  { id: 'standard', name: 'Standard Unit', description: 'Default grid occupant.' },
  { id: 'gigolo', name: 'Gigolo (Elite)', description: 'Superior social worth and sexual dominance. High charisma influence.' },
  { id: 'go-getter', name: 'Go-Getter (Elite)', description: 'High-worth networking and work ethic. Dominant grid presence.' },
  { id: 'nationalist', name: 'Nationalist', description: 'Loyal to the sector heritage. Secured grid roots.' },
  { id: 'girl', name: 'Girl', description: 'Female avatar unit. High social agility and aesthetic resonance.' },
  { id: 'opera-man', name: 'Opera Man', description: 'Persian/Armenian identity. High cultural resonance and dramatic grid presence.' },
  { id: 'are-a-rat', name: 'Are-a-Rat', description: 'Black SUV Uber Driver. High mobility and urban grid navigation.' },
  { id: 'serf', name: 'Serf', description: 'Surfing and beach goer identity. High aquatic resonance and relaxed grid pulse.' }
];

export const IDENTITY_TAGS = ['NIGGA', 'ELITE', 'STREET_RUNNER', 'DATA_LORD', 'VOID_STALKER', 'SURFER', 'GIRL', 'DRIVER'];

export const ARCANE_STIMULANTS: ArcaneStimulant[] = [
  {
    id: 'neon_rush',
    name: 'Neon Rush',
    type: 'stimlant',
    effects: ['+20% Mining Hashrate', 'Visual Jitter'],
    visualAura: '#00ffff',
    riskLevel: 2
  },
  {
    id: 'void_whisper',
    name: 'Void Whisper',
    type: 'hallucinogen',
    effects: ['Neural Resilience', 'Ghost Visibility'],
    visualAura: '#bc13fe',
    riskLevel: 5
  },
  {
    id: 'static_zen',
    name: 'Static Zen',
    type: 'sedative',
    effects: ['-10% Packet Loss', 'Calm Grid Pulse'],
    visualAura: '#00ff9f',
    riskLevel: 1
  },
  {
    id: 'crystal_resonance',
    name: 'Crystal Resonance',
    type: 'crystalline',
    effects: ['Hyper-Vigilance', 'Ultra-Low Latency'],
    visualAura: '#ffffff',
    riskLevel: 10
  },
  {
    id: 'data_bleed',
    name: 'Data Bleed',
    type: 'nootropic',
    effects: ['Hyper-Calculation', 'Neural Leakage'],
    visualAura: '#ff3e00',
    riskLevel: 8
  },
  {
    id: 'sober_baseline',
    name: 'Sober Baseline',
    type: 'sedative',
    effects: ['-90% Social Integrity', 'Public Health Hazard', 'Fluid Leakage Alert'],
    visualAura: '#ff0000',
    riskLevel: 0
  }
];

export interface MarketItem {
  id: string;
  name: string;
  cost: number;
  description: string;
  category: 'strategy' | 'utility' | 'aesthetic';
  effect?: string;
}

export const POINT_MARKET_ITEMS: MarketItem[] = [
  {
    id: 'grid_cloak',
    name: 'Grid Cloak v1',
    cost: 500,
    description: 'Renders your mining operations invisible to basic scans for 1 hour.',
    category: 'strategy',
    effect: 'Invisibility Bloom'
  },
  {
    id: 'hash_overload',
    name: 'Hash Overload',
    cost: 1200,
    description: 'Instant +50% Mining Yield for the next 4 cycles.',
    category: 'strategy',
    effect: '+50% Yield'
  },
  {
    id: 'neural_scrub',
    name: 'Neural Scrub',
    cost: 800,
    description: 'Immediately reduces Toxicity Level by 15%.',
    category: 'utility',
    effect: '-15% Toxicity'
  },
  {
    id: 'aesthetic_glitch',
    name: 'Aesthetic Glitch',
    cost: 300,
    description: 'Gives your public profile a permanent neon glitch aura.',
    category: 'aesthetic',
    effect: 'Glitch Aura'
  }
];

export async function syncPortal(lat: number, lng: number): Promise<string> {
  if (!process.env.GEMINI_API_KEY) return "Sync failed: Connection refused.";

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `The player is performing a 'Meth-Injection Synchronization' on the Cyber Portal at ${lat}, ${lng}. 
      Give a dramatic, high-energy confirmation message about the reality shift occurring.`,
    });
    return response.text || "Reality shift confirmed.";
  } catch (error) {
    return "Sync initiated: Local environment destabilized.";
  }
}

export interface GridAnalytics {
  pulse: number;
  sentiment: 'positive' | 'neutral' | 'negative' | 'chaotic';
  trendingKeywords: string[];
  activityData: Array<{ time: string; activity: number }>;
}

export async function getSocialAnalytics(lat: number, lng: number): Promise<GridAnalytics> {
  if (!process.env.GEMINI_API_KEY) {
    return {
      pulse: Math.random() * 100,
      sentiment: 'neutral',
      trendingKeywords: ['#glitch', '#silo', '#polygon'],
      activityData: Array.from({ length: 6 }).map((_, i) => ({ time: `${i * 4}h`, activity: Math.random() * 80 }))
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Perform a 'Grid Social Pulse Analysis' for GPS coordinates ${lat}, ${lng}. 
      Analyze the frequency of data leaks, ghost hauntings, and social sentiment in the polygon grid.
      Return activity levels for the last 24 hours in 4-hour increments.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            pulse: { type: Type.NUMBER, description: "0-100 overall activity score" },
            sentiment: { type: Type.STRING, enum: ['positive', 'neutral', 'negative', 'chaotic'] },
            trendingKeywords: { type: Type.ARRAY, items: { type: Type.STRING } },
            activityData: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  time: { type: Type.STRING },
                  activity: { type: Type.NUMBER }
                },
                required: ["time", "activity"]
              }
            }
          },
          required: ["pulse", "sentiment", "trendingKeywords", "activityData"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    return {
      pulse: 45,
      sentiment: 'chaotic',
      trendingKeywords: ['#error', '#lost_signal'],
      activityData: []
    };
  }
}
