import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polygon, useMap, FeatureGroup } from 'react-leaflet';
import { LatLngExpression } from 'leaflet';
import { Box, Button, TextField, Typography } from '@mui/material';
import { EditControl } from 'react-leaflet-draw';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import { AxiosResponse } from 'axios';
import Swal from 'sweetalert2';
import { fetchRegions } from '../api/region';


interface Region {
  name: string;
  population: number;
  coordinates: LatLngExpression[];
}
interface RegionProps {
  add: (newData: any) => Promise<AxiosResponse<any, any>>;
  handleRefresh: () => void;
}

const RegionMap: React.FC<RegionProps> = ({ add, handleRefresh}) => {
  const [regions, setRegions] = useState<Region[]>([]);
  const [regionName, setRegionName] = useState('');
  const position= [36.7372, 3.0822]
  const [population, setPopulation] = useState<number>(0);
  const [currentPolygon, setCurrentPolygon] = useState<LatLngExpression[]>([]);

  const handleSaveRegion = async () => {
    if (currentPolygon.length === 0 || !regionName || population <= 0) {
      alert('Please complete the region details.');
      return;
    }
    const newRegion = {
      nom: regionName,
      population: population,
      coordinates: currentPolygon,
    };
    console.log(newRegion)
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
    handleRefresh()
  };

  const handlePolygonCreated = (e: any) => {
    const { layer } = e;
    const latlngs = layer.getLatLngs()[0];
    setCurrentPolygon(latlngs.map((latlng: any) => [latlng.lat, latlng.lng]));
  };
  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchRegions()
        console.log(data)
        setRegions(data.map((region: any) => ({
          id: region.id,
          name: region.name,
          population: region.population,
          coordinates: region.coordinates,
        })));
        handleRefresh()
      } catch (error) {
        console.error('Failed to fetch regions:', error);
      }
    };

    getData();
    
  }, [])
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
        center={position}
        zoom={13}
        style={{ height: '500px', width: '100%' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
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
        {regions.map((region, idx) => (
          <Polygon key={idx} positions={region.coordinates.map(coord => [coord.longitude, coord.latitude])} />
        ))}
      </MapContainer>
    </Box>
  );
};

export default RegionMap;
