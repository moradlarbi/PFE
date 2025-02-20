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
  LinearProgress,
  Box,
  Typography,
} from "@mui/material"
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline"

const mockSuggestions = [
  {
    region: "North",
    currentCapacity: 5000,
    currentUsage: 4000,
    suggestedAdditional: 20,
    suggestedModel: "Large Capacity",
    predictedWaste: 4500,
  },
  {
    region: "South",
    currentCapacity: 4000,
    currentUsage: 3500,
    suggestedAdditional: 15,
    suggestedModel: "Medium Capacity",
    predictedWaste: 3800,
  },
  {
    region: "East",
    currentCapacity: 3000,
    currentUsage: 2800,
    suggestedAdditional: 25,
    suggestedModel: "Small Capacity",
    predictedWaste: 3200,
  },
  {
    region: "West",
    currentCapacity: 4500,
    currentUsage: 4200,
    suggestedAdditional: 10,
    suggestedModel: "Large Capacity",
    predictedWaste: 4600,
  },
]

const RegionSuggestions: React.FC = () => {
  return (
    <TableContainer component={Paper}>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell>Region</TableCell>
            <TableCell align="right">Current Capacity</TableCell>
            <TableCell align="right">Predicted Waste</TableCell>
            <TableCell align="right">Suggested Additional</TableCell>
            <TableCell>Suggested Model</TableCell>
            <TableCell align="right">Action</TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {mockSuggestions.map((row) => (
            <TableRow key={row.region}>
              <TableCell component="th" scope="row">
                {row.region}
              </TableCell>
              <TableCell align="right">
                <Box sx={{ display: "flex", alignItems: "center" }}>
                  <Box sx={{ width: "100%", mr: 1 }}>
                    <LinearProgress variant="determinate" value={(row.currentUsage / row.currentCapacity) * 100} />
                  </Box>
                  <Box sx={{ minWidth: 35 }}>
                    <Typography variant="body2" color="text.secondary">{`${Math.round(
                      (row.currentUsage / row.currentCapacity) * 100,
                    )}%`}</Typography>
                  </Box>
                </Box>
                <Typography variant="caption">{`${row.currentUsage} / ${row.currentCapacity} kg`}</Typography>
              </TableCell>
              <TableCell align="right">{`${row.predictedWaste} kg`}</TableCell>
              <TableCell align="right">{row.suggestedAdditional}</TableCell>
              <TableCell>{row.suggestedModel}</TableCell>
              <TableCell align="right">
                <Button variant="outlined" startIcon={<AddCircleOutlineIcon />} size="small">
                  Add Cans
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

