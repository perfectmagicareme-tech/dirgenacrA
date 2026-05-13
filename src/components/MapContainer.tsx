/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useCallback, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { APIProvider, Map, AdvancedMarker, Pin, MapMouseEvent, useMap } from '@vis.gl/react-google-maps';
import { evaluateLandValue, LandValue } from '../services/geminiService';
import { Zap, Globe, Cpu, Shield, Database, Sparkle, Droplets, HardHat, Activity, User, Map as MapIcon } from 'lucide-react';
import { POI } from '../App';
import { MiningMine, WaterGauge } from '../services/geminiService';

const landCache: Record<string, LandValue> = {};

// @ts-ignore
const API_KEY = import.meta.env.VITE_GOOGLE_MAPS_PLATFORM_KEY || '';
const hasValidKey = Boolean(API_KEY) && API_KEY !== 'MY_GOOGLE_MAPS_KEY';

function SimulatedGrid({
  center, onLandSelect, claimedLands, selectedLand, userLocation, pois
}: any) {
  const handleGridClick = async (e: React.MouseEvent) => {
    // Generate a simulated lat/lng near the center based on click
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    const latOffset = ((y / rect.height) - 0.5) * 0.02;
    const lngOffset = ((x / rect.width) - 0.5) * 0.02;
    
    const simulatedLat = center.lat - latOffset;
    const simulatedLng = center.lng + lngOffset;
    
    const cacheKey = `${simulatedLat.toFixed(5)},${simulatedLng.toFixed(5)}`;
    let landData;
    if (landCache[cacheKey]) {
      landData = landCache[cacheKey];
    } else {
      landData = await evaluateLandValue(simulatedLat, simulatedLng);
      landCache[cacheKey] = landData;
    }
    
    onLandSelect({ ...landData, lat: simulatedLat, lng: simulatedLng });
  };

  return (
    <div 
      className="w-full h-full bg-[#0d0d10] relative overflow-hidden cursor-crosshair"
      onClick={handleGridClick}
      style={{
        backgroundImage: `
          linear-gradient(to right, #1a1a1f 1px, transparent 1px),
          linear-gradient(to bottom, #1a1a1f 1px, transparent 1px)
        `,
        backgroundSize: '40px 40px',
        backgroundPosition: 'center center'
      }}
    >
      <div className="absolute inset-0 flex items-center justify-center opacity-10 pointer-events-none">
        <MapIcon size={200} className="text-[#00ff9f]" />
      </div>
      
      <div className="absolute top-4 left-4 bg-black/80 border border-[#00ff9f] p-2 pointer-events-none z-10">
        <div className="text-[#00ff9f] text-[10px] uppercase font-black tracking-widest flex items-center gap-2">
          <Activity size={12} className="animate-pulse" />
          SIMULATION MODE (NO API KEY)
        </div>
        <div className="text-[#00ff9f]/50 text-[8px] uppercase mt-1">Click anywhere to scan grid</div>
      </div>

      {userLocation && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none">
           <motion.div 
             animate={{ scale: [1, 1.6, 1], opacity: [0.3, 0.7, 0.3], rotate: 360 }}
             transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
             className="absolute w-16 h-16 border-2 border-dashed border-[#bc13fe] rounded-full -ml-8 -mt-8"
           />
           <div className="w-10 h-10 bg-black border-2 border-[#bc13fe] rounded-full flex items-center justify-center shadow-[0_0_15px_#bc13fe] -ml-5 -mt-5 relative z-10">
              <User size={18} className="text-[#00ffff]" />
           </div>
        </div>
      )}

      {claimedLands.map((land: any, i: number) => {
        const isSelected = selectedLand?.lat === land.lat && selectedLand?.lng === land.lng;
        // Simple pixel mapping relative to center
        const top = 50 + ((center.lat - land.lat) / 0.02) * 50;
        const left = 50 + ((land.lng - center.lng) / 0.02) * 50;
        
        return (
          <div 
            key={`sim-land-${i}`}
            className="absolute -ml-3 -mt-3 z-10 hover:z-20 cursor-pointer pointer-events-none"
            style={{ top: `${top}%`, left: `${left}%` }}
          >
            <motion.div 
              animate={isSelected ? { scale: 1.3 } : { scale: 1 }}
              className={`w-6 h-6 border-2 border-[#00ff9f] bg-black/80 flex items-center justify-center rotate-45 transform transition-all
              ${isSelected ? 'bg-[#00ff9f] shadow-[0_0_30px_#00ff9f]' : ''}`}>
              <div className={`w-1.5 h-1.5 bg-[#00ff9f] ${isSelected ? 'bg-black' : ''}`} />
            </motion.div>
          </div>
        );
      })}
    </div>
  );
}

interface MapContainerProps {
  center: { lat: number; lng: number };
  onLandSelect: (land: LandValue & { lat: number; lng: number }) => void;
  injectedEntities: Array<{ name: string; lat: number; lng: number; type?: string }>;
  claimedLands: Array<LandValue & { lat: number; lng: number }>;
  pois: POI[];
  onPoiSelect: (poi: POI) => void;
  miningMines: MiningMine[];
  waterGauges: WaterGauge[];
  onMineClick: (mineId: string) => void;
  userLocation: google.maps.LatLngLiteral | null;
  selectedLand: (LandValue & { lat: number; lng: number }) | null;
  selectedPoi: POI | null;
}

// Helper component to handle map camera transitions
// Must be a child of APIProvider to use useMap hook
function MapCameraControl({ center }: { center: { lat: number; lng: number } }) {
  const map = useMap();

  useEffect(() => {
    if (map && center) {
      map.panTo(center);
    }
  }, [map, center]);

  return null;
}

export function MapContainer({ 
  center, 
  onLandSelect, 
  injectedEntities, 
  claimedLands, 
  pois, 
  onPoiSelect, 
  miningMines, 
  waterGauges, 
  onMineClick, 
  userLocation,
  selectedLand,
  selectedPoi
}: MapContainerProps) {
  const handleMapClick = useCallback(async (e: MapMouseEvent) => {
    if (e.detail.latLng) {
      const { lat, lng } = e.detail.latLng;
      const cacheKey = `${lat.toFixed(5)},${lng.toFixed(5)}`;
      
      let landData: LandValue;
      if (landCache[cacheKey]) {
        landData = landCache[cacheKey];
      } else {
        landData = await evaluateLandValue(lat, lng);
        landCache[cacheKey] = landData;
      }
      
      onLandSelect({ ...landData, lat, lng });
    }
  }, [onLandSelect]);

  const handleMarkerClick = useCallback((land: LandValue & { lat: number; lng: number }) => {
    onLandSelect(land);
  }, [onLandSelect]);

  if (!hasValidKey) {
    return (
      <SimulatedGrid 
        center={center} 
        onLandSelect={onLandSelect} 
        claimedLands={claimedLands} 
        pois={pois}
        userLocation={userLocation}
        selectedLand={selectedLand}
      />
    );
  }

  return (
    <div className="w-full h-full relative" id="map-root">
      <APIProvider apiKey={API_KEY} version="weekly">
        <MapCameraControl center={center} />
        <Map
          center={center}
          defaultZoom={15}
          mapId="CYBER_LAND_MAP"
          onClick={handleMapClick}
          internalUsageAttributionIds={['gmp_mcp_codeassist_v1_aistudio']}
          className="w-full h-full"
          disableDefaultUI={true}
          gestureHandling={'greedy'}
          mapTypeId={'roadmap'}
          styles={[
            {
              "elementType": "geometry",
              "stylers": [{ "color": "#0d0d10" }]
            },
            {
              "elementType": "labels.icon",
              "stylers": [{ "visibility": "off" }]
            },
            {
              "elementType": "labels.text.fill",
              "stylers": [{ "color": "#444444" }]
            },
            {
              "elementType": "labels.text.stroke",
              "stylers": [{ "visibility": "off" }]
            },
            {
                "featureType": "water",
                "elementType": "geometry",
                "stylers": [{ "color": "#050505" }]
            },
            {
                "featureType": "road",
                "elementType": "geometry",
                "stylers": [{ "color": "#1a1a1f" }]
            },
            {
                "featureType": "road",
                "elementType": "labels.text.fill",
                "stylers": [{ "color": "#333333" }]
            },
            {
                "featureType": "poi",
                "stylers": [{ "visibility": "off" }]
            },
            {
                "featureType": "transit",
                "stylers": [{ "visibility": "off" }]
            }
          ]}
        >
          {/* Points of Interest (POIs) */}
          {pois.map((poi) => {
            const isSelected = selectedPoi?.id === poi.id;
            return (
              <AdvancedMarker 
                key={poi.id} 
                position={{ lat: poi.lat, lng: poi.lng }}
                onClick={() => onPoiSelect(poi)}
              >
                <div className="relative group flex items-center justify-center cursor-pointer">
                  {/* Selection Pulsing Ring */}
                  <AnimatePresence>
                    {isSelected && (
                      <>
                        <motion.div 
                          initial={{ scale: 0.5, opacity: 0 }}
                          animate={{ 
                            scale: [1, 1.5, 1], 
                            opacity: [0.4, 0.8, 0.4],
                            boxShadow: [
                              "0 0 15px rgba(188,19,254,0.5)",
                              "0 0 50px rgba(188,19,254,0.8)",
                              "0 0 15px rgba(188,19,254,0.5)"
                            ]
                          }}
                          exit={{ scale: 0.5, opacity: 0 }}
                          transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                          className="absolute w-14 h-14 border-2 border-[#bc13fe] rounded-full z-0"
                        />
                        <motion.div 
                          animate={{ rotate: 360 }}
                          transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                          className="absolute w-16 h-16 border border-dashed border-[#00ffff]/30 rounded-full z-0"
                        />
                      </>
                    )}
                  </AnimatePresence>
                  
                  <motion.div 
                    animate={isSelected ? { scale: 1.25, zIndex: 100 } : { scale: 1 }}
                    className={`w-10 h-10 flex items-center justify-center bg-black/90 border-2 transition-all group-hover:scale-110 group-hover:shadow-[0_0_25px_rgba(255,255,255,0.4)] group-hover:animate-pulse shadow-[0_0_15px_rgba(0,255,255,0.3)] z-10
                      ${isSelected ? 'border-white ring-2 ring-white ring-offset-2 ring-offset-black' : ''}
                      ${poi.type === 'portal' ? 'border-cyan-400 rounded-none rotate-45' :
                      poi.type === 'cache' ? 'border-yellow-400 rounded-sm' :
                      poi.type === 'sanctuary' ? 'border-purple-400 rounded-full' :
                      'border-blue-400 rounded-none'}`}
                  >
                    <div className={poi.type === 'portal' ? '-rotate-45' : ''}>
                      {poi.type === 'portal' && <Globe size={18} className="text-cyan-400" />}
                      {poi.type === 'cache' && <Database size={18} className="text-yellow-400" />}
                      {poi.type === 'sanctuary' && <Sparkle size={18} className="text-purple-400" />}
                      {poi.type === 'outpost' && <Shield size={18} className="text-blue-400" />}
                    </div>
                  </motion.div>
                  <div className="absolute top-full mt-2 bg-[#0d0d10] border border-cyan-400 p-2 text-cyan-400 font-bold uppercase w-48 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-10 shadow-[4px_4px_0_rgba(0,255,255,0.2)]">
                    <div className="text-[10px] border-b border-cyan-400/30 pb-1 mb-1">{poi.name}</div>
                    <div className="text-[7px] text-cyan-400/60 mb-1">TYPE: {poi.type}</div>
                    <div className="text-[8px] font-normal leading-tight lowercase tracking-tight normal-case opacity-90">
                      {poi.description}
                    </div>
                  </div>
                  <div className="absolute inset-0 animate-ping opacity-20 bg-cyan-400 rounded-full scale-150 pointer-events-none" />
                </div>
              </AdvancedMarker>
            );
          })}

          {/* Discovered/Claimed Land Markers */}
          {claimedLands.map((land, i) => {
            const isSelected = selectedLand?.lat === land.lat && selectedLand?.lng === land.lng;
            return (
              <AdvancedMarker 
                key={`land-${i}`} 
                position={{ lat: land.lat, lng: land.lng }}
                onClick={() => handleMarkerClick(land)}
              >
                <div className="relative group flex items-center justify-center cursor-pointer">
                  {/* Selection Pulsing Ring */}
                  <AnimatePresence>
                    {isSelected && (
                      <>
                        <motion.div 
                          initial={{ scale: 0.5, opacity: 0, rotate: 45 }}
                          animate={{ 
                            scale: [1, 1.8, 1], 
                            opacity: [0.5, 0.9, 0.5],
                            boxShadow: [
                              "0 0 15px rgba(188,19,254,0.5)",
                              "0 0 55px rgba(188,19,254,0.9)",
                              "0 0 15px rgba(188,19,254,0.5)"
                            ]
                          }}
                          exit={{ scale: 0.5, opacity: 0 }}
                          transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }}
                          className="absolute w-12 h-12 border-2 border-[#bc13fe] rotate-45 z-0"
                        />
                        <motion.div 
                          animate={{ rotate: -360 }}
                          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
                          className="absolute w-14 h-14 border border-dotted border-[#00ff9f]/40 rotate-45 z-0"
                        />
                      </>
                    )}
                  </AnimatePresence>

                  {land.ad && (
                    <div className="absolute bottom-[130%] flex flex-col items-center animate-pulse">
                      <div 
                        className="px-2 py-0.5 text-[7px] font-black uppercase whitespace-nowrap border-b-2"
                        style={{ color: land.ad.color, borderColor: land.ad.color, backgroundColor: `${land.ad.color}11` }}
                      >
                        {land.ad.brand}
                      </div>
                      <div className="w-0.5 h-4" style={{ backgroundColor: land.ad.color }} />
                      <div className="text-[6px] opacity-70 whitespace-nowrap" style={{ color: land.ad.color }}>
                        {land.ad.slogan}
                      </div>
                    </div>
                  )}
                  {land.residencyTag && (
                    <div className="absolute top-[130%] bg-yellow-400 text-black px-1 py-0.5 text-[6px] font-black italic whitespace-nowrap shadow-[0_0_10px_rgba(250,204,21,0.5)] z-10">
                      #{land.residencyTag}
                    </div>
                  )}
                  <motion.div 
                    animate={isSelected ? { scale: 1.3, zIndex: 100 } : { scale: 1 }}
                    className={`w-6 h-6 border-2 border-[#00ff9f] bg-black/80 flex items-center justify-center rotate-45 transform transition-all group-hover:scale-125 group-hover:animate-pulse z-10
                    ${isSelected ? 'bg-[#00ff9f] shadow-[0_0_30px_#00ff9f]' : 'group-hover:bg-[#00ff9f] group-hover:shadow-[0_0_15px_#00ff9f]'}`}>
                    <div className={`w-1.5 h-1.5 bg-[#00ff9f] ${isSelected ? 'bg-black' : 'group-hover:bg-black'}`} />
                  </motion.div>
                  <div className="absolute bottom-full mb-2 bg-[#0d0d10] border border-[#00ff9f] px-2 py-1 text-[8px] text-[#00ff9f] font-mono opacity-0 group-hover:opacity-100 whitespace-nowrap pointer-events-none uppercase tracking-tighter z-10 shadow-[4px_4px_0_rgba(0,255,159,0.2)]">
                    Claimed: {land.owner}
                  </div>
                </div>
              </AdvancedMarker>
            );
          })}

          {/* Injected Entities */}
          {injectedEntities.map((entity, i) => (
            <AdvancedMarker key={`entity-${i}`} position={{ lat: entity.lat, lng: entity.lng }}>
              <div className="relative flex items-center justify-center animate-bounce">
                <div className="w-8 h-8 rounded-full border border-[#ff3e00] bg-[#ff3e00]/20 flex items-center justify-center shadow-[0_0_10px_rgba(255,62,0,0.5)]">
                  <Zap size={14} className="text-[#ff3e00]" />
                </div>
                <div className="absolute top-full mt-1 bg-[#0d0d10] border border-[#ff3e00] px-1.5 py-0.5 text-[7px] text-[#ff3e00] uppercase font-bold whitespace-nowrap">
                  {entity.name}
                </div>
              </div>
            </AdvancedMarker>
          ))}

          {/* Real-time Human/GPS Roaming Marker - Analogged Movement */}
          {userLocation && (
            <AdvancedMarker position={userLocation} zIndex={1000}>
              <div className="relative flex items-center justify-center">
                 <motion.div 
                   animate={{ scale: [1, 1.6, 1], opacity: [0.3, 0.7, 0.3], rotate: 360 }}
                   transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                   className="absolute w-16 h-16 border-2 border-dashed border-[#bc13fe] rounded-full"
                 />
                 <motion.div 
                   animate={{ scale: [1.2, 1, 1.2], opacity: [0.5, 0.8, 0.5] }}
                   transition={{ repeat: Infinity, duration: 2 }}
                   className="absolute w-12 h-12 bg-[#bc13fe]/10 rounded-full border-2 border-[#00ffff] shadow-[0_0_20px_#bc13fe]"
                 />
                 <div className="w-10 h-10 bg-black border-2 border-[#bc13fe] rounded-full flex items-center justify-center shadow-[0_0_15px_#bc13fe]">
                    <User size={18} className="text-[#00ffff]" />
                 </div>
                 <div className="absolute top-full mt-1 bg-black border border-[#bc13fe] text-[#00ffff] text-[7px] px-1 font-black uppercase tracking-widest magic-glow">
                    ARCANE_ENTITY_01
                 </div>
              </div>
            </AdvancedMarker>
          )}

          {/* Mining Mines */}
          {miningMines.map((mine) => (
            <AdvancedMarker 
              key={mine.id} 
              position={{ lat: mine.lat, lng: mine.lng }}
              onClick={() => onMineClick(mine.id)}
            >
              <div className="relative group cursor-pointer">
                <div className="w-10 h-10 bg-orange-600/20 border-2 border-orange-500 rounded-lg flex items-center justify-center animate-pulse">
                  <HardHat size={20} className="text-orange-500" />
                </div>
                <div className="absolute top-full mt-1 bg-black border border-orange-500 text-[8px] text-orange-500 px-2 py-0.5 uppercase font-black whitespace-nowrap opacity-0 group-hover:opacity-100">
                  {mine.type} MINE: {mine.yield} $$
                </div>
              </div>
            </AdvancedMarker>
          ))}

          {/* DWP Water Gauges */}
          {waterGauges.map((gauge) => (
            <AdvancedMarker 
              key={gauge.id} 
              position={{ lat: gauge.lat, lng: gauge.lng }}
            >
              <div className="relative group">
                <div className="w-8 h-8 bg-blue-600/20 border-2 border-blue-400 rounded-full flex items-center justify-center">
                  <Droplets size={16} className="text-blue-400" />
                </div>
                <div className="absolute bottom-full mb-1 bg-black border border-blue-400 text-[8px] text-blue-400 px-2 py-0.5 uppercase font-black whitespace-nowrap opacity-0 group-hover:opacity-100">
                  DWP GAUGE: {gauge.pressure} PSI
                </div>
              </div>
            </AdvancedMarker>
          ))}
        </Map>
      </APIProvider>
    </div>
  );
}
