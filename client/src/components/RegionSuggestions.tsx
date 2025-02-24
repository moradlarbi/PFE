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

// This is mock data based on your API response. Replace this with actual API call.
const mockApiResponse = [
  {
    regionId: 1,
    regionName: "WAhren",
    population: 13312,
    collectionFrequency: 1,
    predictedWasteTonsPerYear: 6853.25224583299,
    suggestions: [
      {
        modelId: 5,
        modelName: "General Waste Bin",
        numberOfModels: 9,
      },
      {
        modelId: 3,
        modelName: "Compost Bin",
        numberOfModels: 1,
      },
      {
        modelId: 4,
        modelName: "Hazardous Waste Bin",
        numberOfModels: 1,
      },
    ],
  },
  {
    regionId: 2,
    regionName: "Belabass",
    population: 113310,
    collectionFrequency: 1,
    predictedWasteTonsPerYear: 37315.1972430501,
    suggestions: [
      {
        modelId: 5,
        modelName: "General Waste Bin",
        numberOfModels: 51,
      },
      {
        modelId: 4,
        modelName: "Hazardous Waste Bin",
        numberOfModels: 1,
      },
      {
        modelId: 4,
        modelName: "Hazardous Waste Bin",
        numberOfModels: 1,
      },
    ],
  },
]

const RegionSuggestions: React.FC = () => {
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
          {mockApiResponse.map((row) => (
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
                <Button variant="outlined" startIcon={<AddCircleOutlineIcon />} size="small">
                  Add Bins
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

