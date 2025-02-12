import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Polygon, Marker, Popup, useMapEvents } from 'react-leaflet';
import { Box, Button, Select, MenuItem, FormControl, InputLabel } from '@mui/material';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import Swal from 'sweetalert2';
import L, { LatLngExpression } from 'leaflet';
import { fetchRegions } from '../api/region';
import 'leaflet/dist/images/marker-icon.png';
import 'leaflet/dist/images/marker-shadow.png';
import { fetchModeleTrash, addTrash, getTrash, deleteTrash } from '../api/modelePoubelle';
import { Delete } from '@mui/icons-material';
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
  id: number;
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
  const [markers, setMarkers] = useState<{ lat: number; lng: number; model: number, id:number }[] | { lat: number; lng: number; model: number}[]>([]);
  const position = [36.7372, 3.0822];
  

  const isMarkerInRegion = (marker: { lat: number; lng: number }, region: Region) => {
    const { lat, lng } = marker;
    const { coordinates } = region;

    let isInside = false;
    for (let i = 0, j = coordinates.length - 1; i < coordinates.length; j = i++) {
      
        const xi = coordinates[i].latitude, yi = coordinates[i].longitude;
        const xj = coordinates[j].latitude, yj = coordinates[j].longitude;

        const intersect = ((yi > lat) !== (yj > lat)) &&
                          (lng < (xj - xi) * (lat - yi) / (yj - yi) + xi);

        if (intersect) isInside = !isInside;
    }

    return isInside;
};



  const handleSaveMarkers = async () => {
    if (!selectedModel) {
      alert('Please select a trash model.');
      return;
    }
    console.log(markers)
    const newMarkers = markers.filter(marker => !marker.id)
      .filter(marker => marker.model === selectedModel)
      .map(marker => {
        const region = regions.find(region => {
          let res = isMarkerInRegion(marker, region)
          console.log(region, marker, res)
          return res
        });
        
        return {
          ...marker,
          idRegion: region ? region?.id : null,
        };
      });
    console.log("new :",newMarkers);

    await addTrash(newMarkers)
      .then((res) => {
        console.log(res);
        if (res.status === 201) {
          Swal.fire({
            position: "center",
            icon: "success",
            title: `Les dépotoires ont bien été ajoutés`,
            showConfirmButton: false,
            timer: 1500,
          });
          handleRefresh();
        } else {
          Swal.fire({
            position: "center",
            icon: "error",
            title: `Les dépotoires n'ont pas été ajoutés`,
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
          title: `Les dépotoires n'ont pas été ajoutés`,
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
      null
    );
  };

  useEffect(() => {
    const getData = async () => {
      try {
        const regionsPromise: Promise<any> = fetchRegions();
        const modelsPromise: Promise<any> = fetchModeleTrash();
        const trashPromise: Promise<any> = getTrash();

        const [regionsData, modelsData, trashData] = await Promise.all([regionsPromise, modelsPromise, trashPromise]);
        const filteredRegions = regionsData.filter((c: any) => c.active === 1).map((region: any) => ({
          id: region.id,
          coordinates: region.coordinates,
          depotLongitude: region.depotLongitude,
          depotLatitude: region.depotLatitude
        }));
        
        const filteredTrash = trashData.filter((c: any) => c.utilisable === 1).map((trash: any) => ({
          model: trash.idModele,
          lat: trash.latitude,
          lng: trash.longitude,
          id: trash.id
        }));

        setRegions(filteredRegions);
        setTrashModels(modelsData);
        setMarkers(filteredTrash);

        
      } catch (error) {
        console.error('Failed to fetch data:', error);
      }
    };

    getData();
  }, [handleRefresh]);

  const handleDeleteMarker = (idx: number) => {
    Swal.fire({
      icon: "warning",
      title: "Êtes-vous sûr ?",
      text: "Cette action est irréversible!",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Oui, continue!",
      customClass: {
        popup: 'swal-popup',
      }
    }).then(async (result : any) => {
      if (result.isConfirmed) {
      await deleteTrash(idx)
      .then((res) => {
        console.log(res);
        if (res.status === 204) {
          Swal.fire({
            position: "center",
            icon: "success",
            title: `dépotoire ${idx} a bien été supprimé`,
            showConfirmButton: false,
            timer: 1500,
          });
          markers.filter(marker => !marker.id)
          handleRefresh();
        } else {
          Swal.fire({
            position: "center",
            icon: "error",
            title: `dépotoire ${idx} n'a pas été supprimé`,
            showConfirmButton: false,
            timer: 1500,
          });
        }
      })
      .catch((e) => {
        Swal.fire({
          position: "center",
          icon: "error",
          title: `dépotoire ${idx} n'a pas été supprimé`,
          showConfirmButton: false,
          timer: 1500,
        });
      });
        handleRefresh()
      }
    });
   
  };

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
      {/* @ts-ignore */}
      <MapContainer center={position} zoom={10} style={{ height: '500px', width: '100%' }}>
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
        <TrashCanMarker />
        {markers.map((marker, idx) => (
          /* @ts-ignore */  
          <Marker key={idx} position={[marker.lat, marker.lng]} icon={customIcon}>
            {marker.id && <Popup>
              <Button
                variant="contained"
                onClick={() => {
                  handleDeleteMarker(marker.id)
                }}
              >
                <Delete />            
              </Button>  
            </Popup>}
          </Marker>
        ))}
        {regions.map((region, idx) => (
          <React.Fragment key={idx}>
            <Polygon positions={region.coordinates.map(coord => [coord.longitude, coord.latitude])} />
            {region.depotLatitude && region.depotLongitude && (
              /* @ts-ignore */
              <Marker position={[region.depotLatitude, region.depotLongitude]} icon={customIconDepot} />
            )}
          </React.Fragment>
        ))}
      </MapContainer>
    </Box>
  );
};
 
export default TrashMap;
