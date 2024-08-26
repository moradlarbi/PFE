import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polygon, useMap, FeatureGroup, Marker, useMapEvents } from 'react-leaflet';
import { Box, Button, TextField, Typography } from '@mui/material';
import { EditControl } from 'react-leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import { AxiosResponse } from 'axios';
import Swal from 'sweetalert2';
import L, { LatLngExpression } from 'leaflet';
import { fetchRegions } from '../api/region';
// Import Leaflet default marker icons
import 'leaflet/dist/images/marker-icon.png';
import 'leaflet/dist/images/marker-shadow.png';

// Define the custom icon
const customIcon : any = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41], // size of the icon
  iconAnchor: [12, 41], // point of the icon which will correspond to marker's location
  popupAnchor: [1, -34], // point from which the popup should open relative to the iconAnchor
  shadowSize: [41, 41]  // size of the shadow
});

interface Region {
  name: string;
  population: number;
  coordinates: LatLngExpression[];
  depotLatitude?: number;
  depotLongitude?: number;
}
interface RegionProps {
  add: (newData: any) => Promise<AxiosResponse<any, any>>;
  handleRefresh: () => void;
}

const RegionMap: React.FC<RegionProps> = ({ add, handleRefresh }) => {
  const [regions, setRegions] = useState<Region[]>([]);

  const [regionName, setRegionName] = useState('');
  const position = [36.7372, 3.0822];
  const [population, setPopulation] = useState<number>(0);
  const [currentPolygon, setCurrentPolygon] = useState<LatLngExpression[]>([]);
  const [depot, setDepot] = useState<{ latitude: number; longitude: number } | null>(null);

  const handleSaveRegion = async () => {
    if (currentPolygon.length === 0 || !regionName || population <= 0 || !depot) {
      alert('Please complete the region details and specify a depot point.');
      return;
    }
    const newRegion = {
      nom: regionName,
      population: population,
      coordinates: currentPolygon,
      depotLatitude: depot.latitude,
      depotLongitude: depot.longitude,
    };
    console.log(newRegion);
    await add(newRegion)
      .then((res) => {
        console.log(res);
        if (res.status === 201) {
          Swal.fire({
            position: "center",
            icon: "success",
            title: `${regionName} a bien été ajouté`,
            showConfirmButton: false,
            timer: 1500,
          });
          handleRefresh();
        } else {
          Swal.fire({
            position: "center",
            icon: "error",
            title: `${regionName} n'a pas été ajouté`,
            showConfirmButton: false,
            timer: 1500,
          });
        }
      })
      .catch((e) => {
        console.log(e);
        Swal.fire({
          position: "center",
          icon: "error",
          title: `${regionName} n'a pas été ajouté`,
          showConfirmButton: false,
          timer: 1500,
        });
      });
    setCurrentPolygon([]);
    setRegionName('');
    setPopulation(0);
    setDepot(null);
    handleRefresh();
  };

  const handlePolygonCreated = (e: any) => {
    // const { layer } = e;
    // const latlngs = layer.getLatLngs()[0];
    // setCurrentPolygon(latlngs.map((latlng: any) => [latlng?.lat, latlng?.lng]));
  };

  const DepotMarker = () => {
    useMapEvents({
      click(e) {
        setDepot({ latitude: e.latlng?.lat, longitude: e.latlng?.lng });
      },
    }); 
    return depot ? (
      /* @ts-ignore */   
      <Marker position={[depot.latitude, depot.longitude]} icon={customIcon} />
    ) : null; 
  };
  
  useEffect(() => {   
    const getData = async () => {    
      try {
        const data = await fetchRegions();
        console.log(data);
        setRegions(data.filter((c) => c.active == 1).map((region: any) => ({
          id: region.id,
          name: region.name,
          population: region.population,
          coordinates: region.coordinates,
          depotLongitude: region.depotLongitude,
          depotLatitude: region.depotLatitude
        })));
        handleRefresh();
      } catch (error) {
        console.error('Failed to fetch regions:', error);
      }
    };

    getData();
  }, []);
  
  return (
    <Box>
      <Box display="flex" gap={2} mb={2}>
        <TextField
          label="Region Name"
          value={regionName}
          onChange={(e) => setRegionName(e.target.value)}
        />
        <TextField
          label="Population"
          type="number"
          value={population}
          onChange={(e) => setPopulation(parseInt(e.target.value))}
        />
        <Button variant="contained" color="primary" onClick={handleSaveRegion}>
          Save Region
        </Button>
      </Box>
      <MapContainer
         /* @ts-ignore */
        center={position as LatLngExpression}
        zoom={13}
        style={{ height: '500px', width: '100%' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <FeatureGroup>
          <EditControl
            position="topright"
            onCreated={handlePolygonCreated}
            draw={{
              rectangle: false,
              circle: false,
              circlemarker: false,
              polyline: false,
              marker: false,
              polygon: true,
            }} 
            edit={{
              edit: true,
              remove: true, 
            }}  
          />
        </FeatureGroup>     
        <DepotMarker /> 
        {regions?.map((region, idx) => (
          <>
          <Polygon key={idx} positions={region.coordinates.map(coord => [coord.longitude, coord.latitude])} />
          {
            /* @ts-ignore */
            region.depotLatitude && region.depotLongitude && <Marker position={[region.depotLatitude, region.depotLongitude]} icon={customIcon} />
          }        
          </>
        ))} 
      </MapContainer>
    </Box>
  );
};  

export default RegionMap;
