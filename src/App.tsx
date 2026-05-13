/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { MapContainer } from './components/MapContainer';
import { CyberForest } from './components/CyberForest';
import { CyberUI } from './components/CyberUI';
import { LandValue, ForumPost, LinkedAccount, MiningMine, WaterGauge, ParcelComment, NeuralBiometrics, NeuralChemistry } from './services/geminiService';
import { PositioningData } from './components/PositioningMonitor';

export interface POI {
  id: string;
  name: string;
  type: 'portal' | 'cache' | 'sanctuary' | 'outpost';
  description: string;
  lat: number;
  lng: number;
  data?: any;
}

export default function App() {
  const [selectedLand, setSelectedLand] = useState<(LandValue & { lat: number; lng: number }) | null>(null);
  const [selectedPoi, setSelectedPoi] = useState<POI | null>(null);
  const [mapCenter, setMapCenter] = useState({ lat: 37.7749, lng: -122.4194 });
  const [injectedEntities, setInjectedEntities] = useState<Array<{ name: string; lat: number; lng: number; type?: string }>>([]);
  const [claimedLands, setClaimedLands] = useState<Array<LandValue & { lat: number; lng: number }>>([]);
  const [pois, setPois] = useState<POI[]>([
    {
      id: 'silo-1',
      name: 'Silo Alpha (North)',
      type: 'portal',
      description: 'Primary data storage silo for northern sector telemetry.',
      lat: 37.7958,
      lng: -122.4064
    },
    {
      id: 'silo-2',
      name: 'Silo Beta (South)',
      type: 'portal',
      description: 'Encrypted buffer for southern grid synchronization.',
      lat: 37.7549,
      lng: -122.4294
    },
    {
      id: 'poi-1',
      name: 'Mainframe Alpha',
      type: 'portal',
      description: 'The primary synchronization gateway for this sector.',
      lat: 37.7858,
      lng: -122.4064
    },
    {
      id: 'poi-2',
      name: 'Data Cache #42',
      type: 'cache',
      description: 'A floating shard containing encrypted Reddit fragments.',
      lat: 37.7649,
      lng: -122.4294
    },
    {
      id: 'poi-3',
      name: 'Neon Sanctuary',
      type: 'sanctuary',
      description: 'A peaceful zone where polygon trees grow without glitching.',
      lat: 37.7749,
      lng: -122.4494
    },
    {
      id: 'police-1',
      name: 'SFPD Central - IRANIAN MISSION',
      type: 'outpost',
      description: 'DANGER: Iranian sovereign territory. Grid protocols restricted.',
      lat: 37.7997,
      lng: -122.4100
    },
    {
      id: 'police-2',
      name: 'SFPD Southern - NORTH KOREAN MISSION',
      type: 'outpost',
      description: 'WARNING: DPRK data buffer. Total packet isolation active.',
      lat: 37.7725,
      lng: -122.3920
    }
  ]);
  const [forumPosts, setForumPosts] = useState<ForumPost[]>([
    {
      id: '1',
      title: 'Neon Glitch in Sector 4',
      content: 'Has anyone seen the green flickering near the SF Bay? It looks like a high-density data leak.',
      author: 'GhostInTheShell',
      lat: 37.7749,
      lng: -122.4194,
      createdAt: Date.now() - 3600000,
      votes: 42
    }
  ]);
  const [isSyncing, setIsSyncing] = useState(false);
  const [isInjecting, setIsInjecting] = useState(false);
  const [weather, setWeather] = useState<'calm' | 'storm' | 'rain'>('calm');
  const [isRoaming, setIsRoaming] = useState(false);
  const [userLocation, setUserLocation] = useState<google.maps.LatLngLiteral | null>(null);
  const [linkedAccounts, setLinkedAccounts] = useState<LinkedAccount[]>([
    { id: '1', platform: 'GitHub', username: 'not_connected', connected: false, dataActivity: 0, rank: 0 },
    { id: '2', platform: 'Gmail', username: 'not_connected', connected: false, dataActivity: 0, rank: 0 },
    { id: '3', platform: 'BitBucket', username: 'not_connected', connected: false, dataActivity: 0, rank: 0 },
    { id: '4', platform: 'Red Hat', username: 'not_connected', connected: false, dataActivity: 0, rank: 0 },
    { id: '5', platform: 'LinkedIn', username: 'not_connected', connected: false, dataActivity: 0, rank: 0 },
  ]);
  const [miningMines, setMiningMines] = useState<MiningMine[]>([]);
  const [waterGauges, setWaterGauges] = useState<WaterGauge[]>([]);
  const [totalMiningYield, setTotalMiningYield] = useState(0);
  const [marketPoints, setMarketPoints] = useState(1000); // Start with some for demo
  const [lastStationaryPosition, setLastStationaryPosition] = useState({ lat: 37.7749, lng: -122.4194 });
  const [biometrics, setBiometrics] = useState<NeuralBiometrics>({
    signature: 'NEURAL_' + Math.random().toString(36).substr(2, 9).toUpperCase(),
    fingerprint: 'PTN_' + Math.random().toString(36).substr(2, 4).toUpperCase(),
    irisPattern: 'IRIS_' + Math.random().toString(36).substr(2, 6).toUpperCase(),
    lastVerified: 'NEVER',
    isSecured: false,
    sexualPreference: 'FLUID',
    attractivenessRating: 8.4,
    totalRatings: 1240,
    prudeRating: 3.2,
    totalPrudeRatings: 850
  });
  const [neuralChemistry, setNeuralChemistry] = useState<NeuralChemistry>({
    activeStimulants: [],
    toxicityLevel: 0,
    resonanceHarmonics: 100
  });
  const [positioning, setPositioning] = useState<PositioningData>({
    alpha: null, beta: null, gamma: null,
    accel: { x: null, y: null, z: null }
  });
  const [isPositioningActive, setIsPositioningActive] = useState(false);

  const rewardPoints = (amount: number) => {
    setMarketPoints(prev => prev + amount);
  };

  const handleRatePrude = (score: number) => {
    setBiometrics(prev => {
      const newTotal = prev.totalPrudeRatings + 1;
      const newRating = ((prev.prudeRating * prev.totalPrudeRatings) + score) / newTotal;
      return {
        ...prev,
        prudeRating: parseFloat(newRating.toFixed(2)),
        totalPrudeRatings: newTotal
      };
    });
    rewardPoints(15);
  };

  const handlePurchaseMarketItem = (item: any) => {
    const isSober = neuralChemistry.activeStimulants.includes('sober_baseline');
    if (isSober && item.category === 'strategy') {
      console.log("PROTOCOL ERROR: Sober entities cannot acquire strategic assets.");
      return false;
    }

    if (marketPoints >= item.cost) {
      setMarketPoints(prev => prev - item.cost);
      
      // Apply effects
      if (item.id === 'neural_scrub') {
        setNeuralChemistry(prev => ({
          ...prev,
          toxicityLevel: Math.max(0, prev.toxicityLevel - 15)
        }));
      }
      // Other effects can be handled or just logged
      return true;
    }
    return false;
  };

  const handleRequestOrientation = async () => {
    if (typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
      try {
        const permission = await (DeviceOrientationEvent as any).requestPermission();
        if (permission === 'granted') {
          setIsPositioningActive(true);
        }
      } catch (error) {
        console.error("Orientation permission error:", error);
      }
    } else {
      setIsPositioningActive(true);
    }
  };

  const handleVerifyBiometrics = () => {
    setBiometrics(prev => ({
      ...prev,
      isSecured: true,
      lastVerified: new Date().toLocaleTimeString()
    }));
    rewardPoints(100);
  };

  const handleUpdateNeuralChemistry = (stimulantId: string) => {
    setNeuralChemistry(prev => {
      const active = [...prev.activeStimulants];
      const index = active.indexOf(stimulantId);
      if (index > -1) {
        active.splice(index, 1);
      } else {
        if (active.length < 3) active.push(stimulantId);
        rewardPoints(50);
      }
      
      const isSober = active.includes('sober_baseline');
      if (isSober) {
        setBiometrics(b => ({ ...b, attractivenessRating: 1.0 }));
      }

      return {
        ...prev,
        activeStimulants: active,
        toxicityLevel: Math.min(100, active.length * 25),
        resonanceHarmonics: 100 - (active.length * 10)
      };
    });
  };

  const handleRateAttractiveness = (score: number) => {
    const isSober = neuralChemistry.activeStimulants.includes('sober_baseline');
    if (isSober) return; // Sober users are locked at 1.0

    setBiometrics(prev => {
      const newTotal = prev.totalRatings + 1;
      const newRating = ((prev.attractivenessRating * prev.totalRatings) + score) / newTotal;
      return {
        ...prev,
        attractivenessRating: parseFloat(newRating.toFixed(2)),
        totalRatings: newTotal
      };
    });
    rewardPoints(20);
  };

  const handleToggleWallet = () => {
    setNeuralChemistry(prev => {
      const connecting = !prev.wallet?.connected;
      if (connecting) rewardPoints(50);
      
      return {
        ...prev,
        wallet: connecting ? {
          connected: true,
          address: `0xARCANE_${Math.random().toString(16).slice(2, 10).toUpperCase()}`,
          balance: 42.069,
          provider: 'NeuralNexus'
        } : undefined
      };
    });
  };

  React.useEffect(() => {
    if (!isPositioningActive) return;

    const handleOrientation = (e: DeviceOrientationEvent) => {
      setPositioning(prev => ({
        ...prev,
        alpha: e.alpha,
        beta: e.beta,
        gamma: e.gamma
      }));
    };

    const handleMotion = (e: DeviceMotionEvent) => {
      if (e.acceleration) {
        setPositioning(prev => ({
          ...prev,
          accel: {
            x: e.acceleration?.x || null,
            y: e.acceleration?.y || null,
            z: e.acceleration?.z || null
          }
        }));
      }
    };

    window.addEventListener('deviceorientation', handleOrientation);
    window.addEventListener('devicemotion', handleMotion);

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
      window.removeEventListener('devicemotion', handleMotion);
    };
  }, [isPositioningActive]);

  React.useEffect(() => {
    let watchId: number;
    if (isRoaming && navigator.geolocation) {
      watchId = navigator.geolocation.watchPosition(
        (position) => {
          const { latitude: lat, longitude: lng } = position.coords;
          setUserLocation({ lat, lng });
          setMapCenter({ lat, lng });
        },
        (error) => {
          console.error("GPS Error:", error);
          setIsRoaming(false);
        },
        { enableHighAccuracy: true, maximumAge: 1000, timeout: 5000 }
      );
    } else if (!isRoaming) {
      // Reset map center to last stationary position or default when roaming is toggled off
      setMapCenter(lastStationaryPosition);
    }
    return () => {
      if (watchId) navigator.geolocation.clearWatch(watchId);
    };
  }, [isRoaming, lastStationaryPosition]);

  const toggleRoaming = () => {
    if (!isRoaming) {
      // Store current center before starting roaming
      setLastStationaryPosition(mapCenter);
    }
    setIsRoaming(!isRoaming);
  };

  React.useEffect(() => {
    // Initialize random mines and water gauges
    const initMines: MiningMine[] = Array.from({ length: 5 }).map((_, i) => ({
      id: `mine-${i}`,
      lat: mapCenter.lat + (Math.random() - 0.5) * 0.05,
      lng: mapCenter.lng + (Math.random() - 0.5) * 0.05,
      type: Math.random() > 0.5 ? 'bitcoin' : 'grid',
      yield: Math.floor(Math.random() * 100),
      status: 'active'
    }));

    const initGauges: WaterGauge[] = Array.from({ length: 3 }).map((_, i) => ({
      id: `gauge-${i}`,
      lat: mapCenter.lat + (Math.random() - 0.5) * 0.05,
      lng: mapCenter.lng + (Math.random() - 0.5) * 0.05,
      address: `Sector ${i+1} Junction`,
      pressure: Math.floor(Math.random() * 100),
      surgeLevel: Math.floor(Math.random() * 50)
    }));

    setMiningMines(initMines);
    setWaterGauges(initGauges);
  }, []);

  const handleConnectAccount = (id: string) => {
    setLinkedAccounts(prev => prev.map(acc => {
      if (acc.id === id) {
        rewardPoints(200);
        return { 
          ...acc, 
          connected: true, 
          username: `${acc.platform.toLowerCase()}_user`,
          dataActivity: Math.floor(Math.random() * 1000),
          rank: Math.floor(Math.random() * 10) + 1
        };
      }
      return acc;
    }));
  };

  const handleMine = (mineId: string) => {
    setMiningMines(prev => prev.map(m => {
      if (m.id === mineId && m.status === 'active') {
        const yieldAmount = Math.round((10 + (linkedAccounts.filter(a => a.connected).length * 5)) * capabilityMultiplier);
        setTotalMiningYield(t => t + yieldAmount);
        rewardPoints(yieldAmount * 2);
        return { ...m, yield: Math.max(0, m.yield - 10) };
      }
      return m;
    }));
  };

  const handleEntityInjection = (name: string, lat: number, lng: number, type?: string) => {
    setInjectedEntities(prev => [...prev, { name, lat, lng, type }]);
  };

  const handleBuildStructure = (lat: number, lng: number, structure: any) => {
    const isSober = neuralChemistry.activeStimulants.includes('sober_baseline');
    if (isSober) return;

    setClaimedLands(prev => prev.map(l => {
      if (l.lat === lat && l.lng === lng) {
        rewardPoints(250);
        const structures = l.structures || [];
        return { ...l, structures: [...structures, structure] };
      }
      return l;
    }));
    if (selectedLand && selectedLand.lat === lat && selectedLand.lng === lng) {
      setSelectedLand(prev => {
        if (!prev) return null;
        const structures = prev.structures || [];
        return { ...prev, structures: [...structures, structure] };
      });
    }
  };

  const handleSyncStateChange = (syncing: boolean) => {
    setIsSyncing(syncing);
    if (syncing) {
      setWeather('storm');
      rewardPoints(100);
    } else {
      setWeather('calm');
    }
  };

  const handleClaimLand = (land: LandValue & { lat: number; lng: number }) => {
    setClaimedLands(prev => [...prev, land]);
    rewardPoints(500);
  };

  const handlePlaceAd = (lat: number, lng: number, ad: any) => {
    const isSober = neuralChemistry.activeStimulants.includes('sober_baseline');
    if (isSober) return;

    setClaimedLands(prev => prev.map(l => {
      if (l.lat === lat && l.lng === lng) {
        rewardPoints(150);
        return { ...l, ad };
      }
      return l;
    }));
    if (selectedLand && selectedLand.lat === lat && selectedLand.lng === lng) {
      setSelectedLand(prev => prev ? { ...prev, ad } : null);
    }
  };

  const handleAddComment = (lat: number, lng: number, comment: ParcelComment) => {
    setClaimedLands(prev => prev.map(l => {
      if (l.lat === lat && l.lng === lng) {
        rewardPoints(30);
        return { ...l, comments: [comment, ...(l.comments || [])] };
      }
      return l;
    }));
    if (selectedLand && selectedLand.lat === lat && selectedLand.lng === lng) {
      setSelectedLand(prev => prev ? { ...prev, comments: [comment, ...(prev.comments || [])] } : null);
    }
  };

  const handleScanQR = (scannedUserId: string) => {
    // Unique scan logic: adds juice (AF/$$) to the user who was scanned
    // In a real app we'd send an API call. Here we simulate scanning someone else.
    console.log(`SCANNED USER: ${scannedUserId}. Relaying juice...`);
    rewardPoints(250);
  };

  const handleTileAction = (lat: number, lng: number, action: 'fuzz' | 'surge') => {
    setClaimedLands(prev => prev.map(l => {
      if (l.lat === lat && l.lng === lng) {
        const analytics = l.analytics || { resonance: 50, fuzzDensity: 10, packetLoss: 5, socialSurge: 20 };
        return { 
          ...l, 
          analytics: {
            ...analytics,
            socialSurge: action === 'surge' ? Math.min(100, analytics.socialSurge + 15) : analytics.socialSurge,
            fuzzDensity: action === 'fuzz' ? Math.min(100, analytics.fuzzDensity + 25) : analytics.fuzzDensity,
          } 
        };
      }
      return l;
    }));
    // Sync current selection
    if (selectedLand && selectedLand.lat === lat && selectedLand.lng === lng) {
      setSelectedLand(prev => {
        if (!prev) return null;
        const analytics = prev.analytics || { resonance: 50, fuzzDensity: 10, packetLoss: 5, socialSurge: 20 };
        return {
          ...prev,
          analytics: {
            ...analytics,
            socialSurge: action === 'surge' ? Math.min(100, analytics.socialSurge + 15) : analytics.socialSurge,
            fuzzDensity: action === 'fuzz' ? Math.min(100, analytics.fuzzDensity + 25) : analytics.fuzzDensity,
          }
        };
      });
    }
  };

  const handleUpdateResidencyTag = (lat: number, lng: number, tag: string) => {
    setClaimedLands(prev => prev.map(l => 
      l.lat === lat && l.lng === lng ? { ...l, residencyTag: tag } : l
    ));
    if (selectedLand && selectedLand.lat === lat && selectedLand.lng === lng) {
      setSelectedLand(prev => prev ? { ...prev, residencyTag: tag } : null);
    }
  };

  const handleTeleport = (lat: number, lng: number) => {
    setMapCenter({ lat, lng });
  };

  const handleUpdateIdentityType = (type: any) => {
    setBiometrics(prev => ({
      ...prev,
      identityType: type,
      influenceCharisma: (type === 'gigolo' || type === 'go-getter') ? Math.floor(Math.random() * 50) + 50 : (type === 'nationalist' ? 30 : 5)
    }));
    rewardPoints(100);
  };

  const handleUpdateIdentityTags = (tags: string[]) => {
    setBiometrics(prev => ({ ...prev, identityTags: tags }));
    rewardPoints(50);
  };

  const handleUpdatePet = (pet: any) => {
    setBiometrics(prev => ({ ...prev, pet }));
    rewardPoints(300);
  };

  // Capability calculation (Ball and Chain logic)
  const getCapabilityMultiplier = () => {
    if (biometrics.pet && (biometrics.pet.size === 'large' || biometrics.pet.size === 'massive')) {
      return 0.4; // 60% reduction in effectiveness (ball and chain)
    }
    if (biometrics.identityType === 'gigolo' || biometrics.identityType === 'go-getter') {
      return 1.5; // 50% boost for elites
    }
    return 1.0;
  };

  const capabilityMultiplier = getCapabilityMultiplier();

  const handleMintNFT = (lat: number, lng: number) => {
    const nftId = `ARCANE_NFT_${Math.random().toString(36).substr(2, 9).toUpperCase()}`;
    setClaimedLands(prev => prev.map(l => {
      if (l.lat === lat && l.lng === lng) {
        rewardPoints(1000); // Massive reward for minting
        return { ...l, isNFT: true, nftId };
      }
      return l;
    }));
    if (selectedLand && selectedLand.lat === lat && selectedLand.lng === lng) {
      setSelectedLand(prev => prev ? { ...prev, isNFT: true, nftId } : null);
    }
  };

  // Simulated ad performance tracking
  React.useEffect(() => {
    const interval = setInterval(() => {
      setClaimedLands(prev => prev.map(l => {
        if (l.ad && l.ad.active) {
          const newImpressions = (l.ad.impressions || 0) + Math.floor(Math.random() * 5);
          const newCtr = (l.ad.ctr || 0.02) + (Math.random() * 0.001 - 0.0005);
          return {
            ...l,
            ad: { ...l.ad, impressions: newImpressions, ctr: Math.max(0.001, parseFloat(newCtr.toFixed(4))) }
          };
        }
        return l;
      }));
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, []);

  const handleAddForumPost = (post: Omit<ForumPost, 'id' | 'createdAt' | 'votes'>) => {
    const newPost: ForumPost = {
      ...post,
      id: Math.random().toString(36).substr(2, 9),
      createdAt: Date.now(),
      votes: 0
    };
    setForumPosts(prev => [newPost, ...prev]);
  };

  return (
    <div className="w-screen h-screen bg-black overflow-hidden relative">
      {/* Base Layer: Google Maps */}
      <div className="absolute inset-0 z-0">
        <MapContainer 
          center={mapCenter}
          onLandSelect={(land) => {
            setSelectedLand(land);
            setSelectedPoi(null);
            setMapCenter({ lat: land.lat, lng: land.lng });
          }} 
          injectedEntities={injectedEntities}
          claimedLands={claimedLands}
          pois={pois}
          onPoiSelect={(poi) => {
            setSelectedPoi(poi);
            setSelectedLand(null);
            setMapCenter({ lat: poi.lat, lng: poi.lng });
          }}
          miningMines={miningMines}
          waterGauges={waterGauges}
          onMineClick={handleMine}
          userLocation={userLocation}
          selectedLand={selectedLand}
          selectedPoi={selectedPoi}
        />
      </div>

      {/* Mid Layer: 3D Cyber Forest Overlay */}
      <CyberForest 
        isSyncing={isSyncing} 
        weather={weather} 
        isInjecting={isInjecting} 
        claimedLands={claimedLands} 
        positioningData={isPositioningActive ? positioning : undefined}
        isRoaming={isRoaming}
      />

      {/* Top Layer: Cyber HUD & Interaction Panels */}
      <CyberUI 
        selectedLand={selectedLand} 
        selectedPoi={selectedPoi}
        onInjectEntity={handleEntityInjection}
        onSyncStateChange={handleSyncStateChange}
        onClaimLand={handleClaimLand}
        onAddComment={handleAddComment}
        onTileAction={handleTileAction}
        claimedLands={claimedLands}
        forumPosts={forumPosts}
        onAddForumPost={handleAddForumPost}
        onTeleport={handleTeleport}
        onPlaceAd={handlePlaceAd}
        onBuildStructure={handleBuildStructure}
        weather={weather}
        onWeatherChange={setWeather}
        linkedAccounts={linkedAccounts}
        onConnectAccount={handleConnectAccount}
        onUpdateResidencyTag={handleUpdateResidencyTag}
        miningYield={totalMiningYield}
        biometrics={biometrics}
        onVerifyBiometrics={handleVerifyBiometrics}
        onUpdateIdentityType={handleUpdateIdentityType}
        onUpdateIdentityTags={handleUpdateIdentityTags}
        onUpdatePet={handleUpdatePet}
        neuralChemistry={neuralChemistry}
        onUpdateNeuralChemistry={handleUpdateNeuralChemistry}
        onRateAttractiveness={handleRateAttractiveness}
        onRatePrude={handleRatePrude}
        onToggleWallet={handleToggleWallet}
        onMintNFT={handleMintNFT}
        onScanQR={handleScanQR}
        marketPoints={marketPoints}
        onPurchaseItem={handlePurchaseMarketItem}
        isRoaming={isRoaming}
        onToggleRoaming={toggleRoaming}
        positioningData={positioning}
        isPositioningActive={isPositioningActive}
        onRequestOrientation={handleRequestOrientation}
      />

      {/* Global Aesthetic Overlay - Scanlines & Dot Grid */}
      <div className="absolute inset-0 pointer-events-none z-50">
        {/* Arcane Vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_30%,rgba(188,19,254,0.1)_100%)]" />
        {/* Dot Grid */}
        <div className="absolute inset-0 opacity-[0.05]" style={{ backgroundImage: 'radial-gradient(#bc13fe 0.5px, transparent 0.5px)', backgroundSize: '24px 24px' }} />
        {/* Subtle Scanlines */}
        <div className="absolute inset-0 opacity-[0.03] bg-[linear-gradient(rgba(18,16,16,0)_50%,rgba(0,0,0,0.25)_50%),linear-gradient(90deg,rgba(188,19,254,0.06),rgba(0,255,255,0.02),rgba(188,19,254,0.06))] bg-[length:100%_2px,3px_100%]" />
      </div>
    </div>
  );
}

