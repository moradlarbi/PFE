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
import { fetchSuggestions } from "../api/region";




const RegionSuggestions: React.FC = () => {
  const [suggestions, setSuggestions] = useState<any[]>([]);
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

  const addSuggestions = (regionId: number) => {
    console.log("true")
  }
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
                <Button variant="outlined" startIcon={<AddCircleOutlineIcon />} size="small" onClick={addSuggestions(row.regionId)}>
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

