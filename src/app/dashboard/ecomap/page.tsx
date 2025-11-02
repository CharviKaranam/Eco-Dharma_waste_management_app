
"use client";
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Map as MapIcon, Search, ListFilter, MapPin, Recycle, Users, Building, Info, LocateFixed, Navigation, EyeOff } from 'lucide-react';
import Image from 'next/image';
import type { MapLocation } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

const initialLocations: MapLocation[] = [
  { id: '1', name: 'Swachh Bangalore Recycling', type: 'Recycler', latitude: 12.9716, longitude: 77.5946, address: '10 MG Road, Bangalore' },
  { id: '2', name: 'Seva Foundation Drop-off', type: 'NGO', latitude: 12.9750, longitude: 77.6000, address: '25 Koramangala Main Rd, Bangalore' },
  { id: '3', name: 'Indiranagar Compost Hub', type: 'Drop-off Point', latitude: 12.9780, longitude: 77.6400, address: '50, 100 Feet Rd, Indiranagar, Bangalore' },
  { id: '4', name: 'Mahila Shakti SHG', type: 'SHG', latitude: 12.9600, longitude: 77.5800, address: '75 Chickpet, Bangalore' },
  { id: '5', name: 'Lalbagh Cleanup Drive', type: 'Campaign', latitude: 12.9507, longitude: 77.5848, address: 'Lalbagh Botanical Garden, Bangalore' },
  { id: '6', name: 'Jayanagar E-Waste Collection', type: 'Recycler', latitude: 12.9293, longitude: 77.5824, address: '100 Jayanagar 4th Block, Bangalore' },
  { id: '7', name: 'Whitefield Community Composting', type: 'Drop-off Point', latitude: 12.9698, longitude: 77.7499, address: '200 ITPL Main Road, Whitefield, Bangalore' },
];

const locationTypeIcons = {
  'Recycler': <Recycle className="h-5 w-5 text-blue-500" />,
  'NGO': <Users className="h-5 w-5 text-green-500" />,
  'Drop-off Point': <MapPin className="h-5 w-5 text-orange-500" />,
  'SHG': <Building className="h-5 w-5 text-purple-500" />,
  'Campaign': <Info className="h-5 w-5 text-red-500" />,
};

const DEFAULT_CENTER_LAT = 12.9716; // Bangalore Latitude
const DEFAULT_CENTER_LON = 77.5946; // Bangalore Longitude
const INITIAL_LOAD_ZOOM = 10; 
const SELECTED_LOCATION_ZOOM = 15;
const ROUTE_OVERVIEW_ZOOM = 12;
const MAP_IMAGE_SIZE = "800x600";

const getMarkerIconName = (type: MapLocation['type']): string => {
  switch (type) {
    case 'Recycler': return 'bluepin';
    case 'NGO': return 'greenpin';
    case 'Drop-off Point': return 'orangepin';
    case 'SHG': return 'purplepin';
    case 'Campaign': return 'redpin'; // Should be 'redpin', was 'redin'
    default: return 'redpin'; 
  }
};

function getDistanceFromLatLonInKm(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c; // Distance in km
  return d;
}

function deg2rad(deg: number): number {
  return deg * (Math.PI / 180);
}

export default function EcoMapPage() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState<string>('All');
  const [locations, setLocations] = useState<MapLocation[]>(initialLocations);
  const [selectedLocation, setSelectedLocation] = useState<MapLocation | null>(null);
  const [mapImageUrl, setMapImageUrl] = useState<string>(`https://staticmap.openstreetmap.de/staticmap.php?center=${DEFAULT_CENTER_LAT},${DEFAULT_CENTER_LON}&zoom=${INITIAL_LOAD_ZOOM}&size=${MAP_IMAGE_SIZE}&maptype=mapnik`);
  const [userLatitude, setUserLatitude] = useState<number | null>(null);
  const [userLongitude, setUserLongitude] = useState<number | null>(null);
  const [directionsMapImageUrl, setDirectionsMapImageUrl] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    let filtered = initialLocations;
    if (searchTerm) {
      filtered = filtered.filter(loc => loc.name.toLowerCase().includes(searchTerm.toLowerCase()) || loc.address?.toLowerCase().includes(searchTerm.toLowerCase()));
    }
    if (filterType !== 'All') {
      filtered = filtered.filter(loc => loc.type === filterType);
    }
    setLocations(filtered);
    if (filtered.length > 0 && selectedLocation && !filtered.find(loc => loc.id === selectedLocation.id)) {
      setSelectedLocation(null); 
    } else if (filtered.length === 0) {
      setSelectedLocation(null);
    }
  }, [searchTerm, filterType, selectedLocation]);

  useEffect(() => {
    if (selectedLocation) {
      const { latitude, longitude, type } = selectedLocation;
      const markerIcon = getMarkerIconName(type);
      setMapImageUrl(`https://staticmap.openstreetmap.de/staticmap.php?center=${latitude},${longitude}&zoom=${SELECTED_LOCATION_ZOOM}&size=${MAP_IMAGE_SIZE}&maptype=mapnik&markers=${latitude},${longitude},${markerIcon}`);
    } else if (locations.length > 0) {
      const markersString = locations
        .map(loc => `${loc.latitude},${loc.longitude},${getMarkerIconName(loc.type)}`)
        .join('|');
      
      const centerLat = locations.reduce((sum, loc) => sum + loc.latitude, 0) / locations.length || DEFAULT_CENTER_LAT;
      const centerLon = locations.reduce((sum, loc) => sum + loc.longitude, 0) / locations.length || DEFAULT_CENTER_LON;
      
      let overviewZoom;
      if (locations.length === 1) {
        overviewZoom = SELECTED_LOCATION_ZOOM - 2; 
      } else if (locations.length <= 3) {
        overviewZoom = INITIAL_LOAD_ZOOM + 1; 
      } else if (locations.length <= 7) {
        overviewZoom = INITIAL_LOAD_ZOOM; 
      } else {
        overviewZoom = INITIAL_LOAD_ZOOM -1;
      }
      overviewZoom = Math.max(overviewZoom, INITIAL_LOAD_ZOOM - 2);

      setMapImageUrl(`https://staticmap.openstreetmap.de/staticmap.php?center=${centerLat},${centerLon}&zoom=${overviewZoom}&size=${MAP_IMAGE_SIZE}&maptype=mapnik&markers=${markersString}`);
    } else {
      setMapImageUrl(`https://staticmap.openstreetmap.de/staticmap.php?center=${DEFAULT_CENTER_LAT},${DEFAULT_CENTER_LON}&zoom=${INITIAL_LOAD_ZOOM}&size=${MAP_IMAGE_SIZE}&maptype=mapnik`);
    }
  }, [selectedLocation, locations]);

  const handleFindNearest = () => {
    if (!navigator.geolocation) {
      toast({ title: "Geolocation Error", description: "Geolocation is not supported by your browser.", variant: "destructive" });
      return;
    }

    toast({ title: "Fetching Location", description: "Getting your current position..." });

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const currentLat = position.coords.latitude;
        const currentLon = position.coords.longitude;
        setUserLatitude(currentLat);
        setUserLongitude(currentLon);

        if (initialLocations.length === 0) {
          toast({ title: "No Locations", description: "No locations available to find the nearest.", variant: "destructive" });
          return;
        }

        let nearestLoc = initialLocations[0];
        let minDistance = getDistanceFromLatLonInKm(currentLat, currentLon, nearestLoc.latitude, nearestLoc.longitude);

        for (let i = 1; i < initialLocations.length; i++) {
          const loc = initialLocations[i];
          const distance = getDistanceFromLatLonInKm(currentLat, currentLon, loc.latitude, loc.longitude);
          if (distance < minDistance) {
            minDistance = distance;
            nearestLoc = loc;
          }
        }
        
        setSelectedLocation(nearestLoc);
        if (!locations.find(l => l.id === nearestLoc.id)) {
          setSearchTerm('');
          setFilterType('All');
        }
        toast({ title: "Nearest Location Found!", description: `${nearestLoc.name} is approximately ${minDistance.toFixed(2)} km away.` });
      },
      (error) => {
        let message = "Could not retrieve your location.";
        if (error.code === error.PERMISSION_DENIED) {
          message = "Location access denied. Please enable it in your browser settings.";
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          message = "Location information is unavailable.";
        } else if (error.code === error.TIMEOUT) {
          message = "The request to get user location timed out.";
        }
        toast({ title: "Geolocation Error", description: message, variant: "destructive" });
        setUserLatitude(null);
        setUserLongitude(null);
      }
    );
  };

  const handleGetDirections = () => {
    if (!selectedLocation) {
      toast({ title: "No Location Selected", description: "Please select a location to get directions.", variant: "destructive" });
      return;
    }

    const destination = `${selectedLocation.latitude},${selectedLocation.longitude}`;
    let googleMapsUrl = `https://www.google.com/maps/dir/?api=1&destination=${destination}`;

    let centerLat = selectedLocation.latitude;
    let centerLon = selectedLocation.longitude;
    let zoom = SELECTED_LOCATION_ZOOM;
    let markers = `${selectedLocation.latitude},${selectedLocation.longitude},${getMarkerIconName(selectedLocation.type)}`;

    if (userLatitude && userLongitude) {
      const origin = `${userLatitude},${userLongitude}`;
      googleMapsUrl += `&origin=${origin}`;
      
      markers += `|${userLatitude},${userLongitude},redpin`; // User location marker
      centerLat = (userLatitude + selectedLocation.latitude) / 2;
      centerLon = (userLongitude + selectedLocation.longitude) / 2;
      zoom = ROUTE_OVERVIEW_ZOOM;
    }

    window.open(googleMapsUrl, '_blank');
    toast({ title: "Opening Directions", description: `Getting directions to ${selectedLocation.name} in Google Maps.` });

    const staticDirectionsMapUrl = `https://staticmap.openstreetmap.de/staticmap.php?center=${centerLat},${centerLon}&zoom=${zoom}&size=${MAP_IMAGE_SIZE}&maptype=mapnik&markers=${markers}`;
    setDirectionsMapImageUrl(staticDirectionsMapUrl);
  };

  const handleHideDirectionsOverview = () => {
    setDirectionsMapImageUrl(null);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col lg:flex-row gap-6 h-[calc(100vh-10rem-var(--directions-map-height,0px))]">
        <style jsx global>{`
          :root {
            --directions-map-height: ${directionsMapImageUrl ? '350px' : '0px'}; /* Adjust height as needed */
          }
        `}</style>
        <Card className="lg:w-1/3 shadow-lg overflow-y-auto">
          <CardHeader>
            <CardTitle className="font-headline text-2xl text-primary flex items-center"><MapIcon className="mr-3 h-7 w-7" />EcoMap Explorer</CardTitle>
            <CardDescription>Find eco-friendly spots near you in Bangalore.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex flex-col sm:flex-row gap-2">
              <Input
                placeholder="Search locations..."
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="flex-grow"
              />
              <Button variant="outline" size="icon" aria-label="Search"><Search className="h-4 w-4" /></Button>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <Select value={filterType} onValueChange={setFilterType}>
                <SelectTrigger className="flex-grow"><SelectValue placeholder="Filter by type" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Types</SelectItem>
                  {Object.keys(locationTypeIcons).map(type => (
                    <SelectItem key={type} value={type}>{type}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button onClick={handleFindNearest} className="bg-secondary hover:bg-secondary/90 text-secondary-foreground">
                <LocateFixed className="mr-2 h-4 w-4" /> Find Nearest
              </Button>
            </div>

            <div className="space-y-3 max-h-[400px] lg:max-h-none overflow-y-auto pr-1">
              {locations.length > 0 ? locations.map(loc => (
                <Card
                  key={loc.id}
                  className={`cursor-pointer hover:shadow-md transition-shadow ${selectedLocation?.id === loc.id ? 'border-primary ring-2 ring-primary' : ''}`}
                  onClick={() => setSelectedLocation(loc)}
                >
                  <CardContent className="p-3">
                    <div className="flex items-center gap-3">
                      {locationTypeIcons[loc.type as keyof typeof locationTypeIcons]}
                      <div>
                        <h4 className="font-semibold text-sm text-foreground">{loc.name}</h4>
                        <p className="text-xs text-muted-foreground">{loc.type}</p>
                        {loc.address && <p className="text-xs text-muted-foreground">{loc.address}</p>}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              )) : <p className="text-center text-muted-foreground py-4">No locations match your criteria.</p>}
            </div>
          </CardContent>
        </Card>

        <Card className="lg:w-2/3 shadow-lg flex flex-col">
          <CardHeader>
            <CardTitle className="font-headline text-xl text-primary">Map View</CardTitle>
            {selectedLocation && <CardDescription>Showing: {selectedLocation.name}</CardDescription>}
            {!selectedLocation && locations.length > 0 && <CardDescription>Overview of {locations.length} location(s) in Bangalore</CardDescription>}
            {!selectedLocation && locations.length === 0 && <CardDescription>Map of Bangalore</CardDescription>}
          </CardHeader>
          <CardContent className="flex-grow relative overflow-hidden">
            <Image
              src={mapImageUrl}
              alt={selectedLocation ? `Map showing ${selectedLocation.name}` : "EcoMap overview of Bangalore"}
              layout="fill"
              objectFit="cover"
              data-ai-hint={selectedLocation ? "map location" : "city map overview"}
              key={mapImageUrl} 
              priority 
            />
          </CardContent>
          {selectedLocation && (
            <CardFooter className="p-4 border-t flex flex-col items-start space-y-2">
              <h3 className="font-bold text-lg text-primary">{selectedLocation.name}</h3>
              <div className="flex items-center text-sm text-foreground">
                {locationTypeIcons[selectedLocation.type as keyof typeof locationTypeIcons]}
                <span className="ml-2">{selectedLocation.type}</span>
              </div>
              {selectedLocation.address && <p className="text-sm text-muted-foreground mt-1">{selectedLocation.address}</p>}
              <Button size="sm" className="mt-2 w-full bg-primary hover:bg-primary/90 text-primary-foreground" onClick={handleGetDirections}>
                <Navigation className="mr-2 h-4 w-4"/> Get Directions
              </Button>
            </CardFooter>
          )}
        </Card>
      </div>
      
      {directionsMapImageUrl && (
        <Card className="shadow-lg mt-6">
          <CardHeader className="flex justify-between items-center">
            <div>
              <CardTitle className="font-headline text-xl text-primary">Directions Overview (Static)</CardTitle>
              <CardDescription>This is a static overview. Full directions opened in a new tab.</CardDescription>
            </div>
            <Button variant="ghost" size="icon" onClick={handleHideDirectionsOverview} aria-label="Hide directions overview">
              <EyeOff className="h-5 w-5" />
            </Button>
          </CardHeader>
          <CardContent className="relative h-[300px] overflow-hidden"> {/* Adjust height as needed */}
            <Image
              src={directionsMapImageUrl}
              alt="Static map overview of the directions route"
              layout="fill"
              objectFit="cover"
              data-ai-hint="directions route overview"
              key={directionsMapImageUrl}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
}
