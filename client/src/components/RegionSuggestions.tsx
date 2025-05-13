import type React from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Box,
  Chip,
} from "@mui/material"
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline"
import { useEffect, useState } from "react";
import { fetchSuggestions,addSuggestions } from "../api/region";
import Swal from "sweetalert2";




const RegionSuggestions: React.FC = () => {
  const [suggestions, setSuggestions] = useState<any[]>([]);
   const [refresh, setRefresh] = useState(false);
  const addOperation = async (regionId: number) => {
    const selectedRegion = suggestions.find((region) => region.regionId === regionId);
    if (selectedRegion) { 
      console.log("Selected Region", selectedRegion);
      await addSuggestions(selectedRegion)
        .then((res) => {
          console.log(res);
          if (res.status === 200) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: `Les dépotoires ont bien été ajouté`,
              showConfirmButton: false,
              timer: 1500,
            });
            setRefresh(!refresh);
          } else {
            Swal.fire({
              position: "center",
              icon: "error",
              title: `Erreur lors de l'ajout des dépotoires`,
              showConfirmButton: false,
              timer: 1500,
            });
          }
        })
        .catch((e) => {
          Swal.fire({
            position: "center",
            icon: "error",
            title: `Erreur lors de l'ajout des dépotoires`,
            showConfirmButton: false,
            timer: 1500,
          });
        });
    }
    else {
      Swal.fire({
        position: "center",
        icon: "error",
        title: `Région non trouvée`,
        showConfirmButton: false,
        timer: 1500,
      });
    }
  }
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchSuggestions();
        setSuggestions(data);
        console.log("Fetched Suggestions", data);
      } catch (error) {
        console.error("Failed to fetch Camions", error);
      }
    };
    fetchData();
  }, []);

  
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Region</TableCell>
            <TableCell align="right">Population</TableCell>
            <TableCell align="right">Collection Frequency</TableCell>
            <TableCell align="right">Predicted Waste (Tons/Year)</TableCell>
            <TableCell>Suggested Bins</TableCell>
            <TableCell align="right">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {suggestions.map((row) => (
            <TableRow key={row.regionId}>
              <TableCell component="th" scope="row">
                {row.regionName}
              </TableCell>
              <TableCell align="right">{row.population.toLocaleString()}</TableCell>
              <TableCell align="right">{row.collectionFrequency}/day</TableCell>
              <TableCell align="right">{row.predictedWasteTonsPerYear.toFixed(2)}</TableCell>
              <TableCell>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {row.suggestions.map((suggestion, index) => (
                    <Chip
                      key={index}
                      label={`${suggestion.numberOfModels} ${suggestion.modelName}`}
                      variant="outlined"
                    />
                  ))}
                </Box>
              </TableCell>
              <TableCell align="right">
                <Button variant="outlined" startIcon={<AddCircleOutlineIcon />} size="small" onClick={() => addOperation(row.regionId)}>
                  Ajouter les depotoires
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  )
}

export default RegionSuggestions

