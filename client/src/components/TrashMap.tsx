import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polygon, FeatureGroup, Marker, useMapEvents } from 'react-leaflet';
import { Box, Button, TextField, Typography, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
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
import { fetchModeleTrash, addTrash, getTrash } from '../api/modelePoubelle';

// Define the custom icon
const customIcon: any = L.icon({
  iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png',
  shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png',
  iconSize: [25, 41], // size of the icon
  iconAnchor: [12, 41], // point of the icon which will correspond to marker's location
  popupAnchor: [1, -34], // point from which the popup should open relative to the iconAnchor
  shadowSize: [41, 41] // size of the shadow
});
const customIconDepot: any = L.icon({
  iconUrl: 'https://cdn.rawgit.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-green.png', // green icon URL
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png', // shadow URL
  iconSize: [25, 41], // size of the icon
  iconAnchor: [12, 41], // point of the icon which will correspond to marker's location
  popupAnchor: [1, -34], // point from which the popup should open relative to the iconAnchor
  shadowSize: [41, 41] // size of the shadow
});
interface Region {
  name: string;
  population: number;
  coordinates: LatLngExpression[];
  depotLatitude?: number;
  depotLongitude?: number;
}

interface RegionProps {
  handleRefresh: () => void;
}

const TrashMap: React.FC<RegionProps> = ({  handleRefresh }) => {
  const [regions, setRegions] = useState<Region[]>([]);
  const [trashModels, setTrashModels] = useState<any[]>([]);
  const [selectedModel, setSelectedModel] = useState<number | null>(null);
  const [markers, setMarkers] = useState<{ lat: number; lng: number; model: number }[]>([]);
  const position = [36.7372, 3.0822];

 

  const handleSaveMarkers = async () => {
    if (!selectedModel) {
      alert('Please select a trash model.');
      return;
    }

    const newMarkers = markers.filter(marker => marker.model === selectedModel);
    const newData = newMarkers
    console.log(newData);

    await addTrash(newData)
      .then((res) => {
        console.log(res);
        if (res.status === 201) {
          Swal.fire({
            position: "center",
            icon: "success",
            title: `Les poubelles ont bien été ajoutés`,
            showConfirmButton: false,
            timer: 1500,
          });
          handleRefresh();
        } else {
          Swal.fire({
            position: "center",
            icon: "error",
            title: `Les poubelles n'ont pas été ajoutés`,
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
          title: `Les poubelles n'ont pas été ajoutés`,
          showConfirmButton: false,
          timer: 1500,
        });
      });

    setSelectedModel(null);
    handleRefresh();
  };

  const TrashCanMarker = () => {
    useMapEvents({
      click(e) {
        if (!selectedModel) {
          alert('Please select a trash model first.');
          return;
        }
        const newMarker = { lat: e.latlng.lat, lng: e.latlng.lng, model: selectedModel };
        setMarkers((prevMarkers) => [...prevMarkers, newMarker]);
      },
    });
    return (
      <>
        {markers.map((marker, idx) => (
            /* @ts-ignore */
          <Marker key={idx} position={[marker.lat, marker.lng]} icon={customIcon} />
        ))}
      </>
    );
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchRegions();
        setRegions(data.filter((c) => c.active === 1).map((region: any) => ({
          id: region.id,
          coordinates: region.coordinates,
          depotLongitude: region.depotLongitude,
          depotLatitude: region.depotLatitude
        })));
        const dataModels : any = await fetchModeleTrash();
        setTrashModels(dataModels);
        const dataTrash = await getTrash()
        console.log(dataTrash)
        setMarkers(dataTrash.filter((c) => c.utilisable == 1).map((trash: any) => ({
          model: trash.idModele,
          lat: trash.latitude,
          lng: trash.longitude
        })))
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
        <FormControl variant="outlined" fullWidth>
          <InputLabel id="trash-model-select-label">Select Trash Model</InputLabel>
          <Select
            labelId="trash-model-select-label"
            value={selectedModel}
            onChange={(e) => setSelectedModel(e.target.value as number)}
            label="Select Trash Model"
          >
            {trashModels?.map((model) => (
              <MenuItem key={model.id} value={model.id}>
                {model.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <Button variant="contained" color="primary" onClick={handleSaveMarkers}>
          Save Markers
        </Button>
      </Box>
      
      <MapContainer
      /* @ts-ignore */
        center={position}
        zoom={13}
        style={{ height: '500px', width: '100%' }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <TrashCanMarker />
        {markers.map((marker, idx) => (
            /* @ts-ignore */
          <Marker key={idx} position={[marker.lat, marker.lng]} icon={customIcon} />
        ))}
        {regions.map((region, idx) => (
          <>
            <Polygon key={idx} positions={region.coordinates.map(coord => [coord.longitude, coord.latitude])} />
            {region.depotLatitude && region.depotLongitude && (
                /* @ts-ignore */
              <Marker position={[region.depotLatitude, region.depotLongitude]} icon={customIconDepot} />
            )}
          </>
        ))}
      </MapContainer>
    </Box>
  );
};

export default TrashMap;
