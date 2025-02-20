import type React from "react"
import { Typography, Grid, Paper, Box, Button } from "@mui/material"
import RegionSuggestions from "../components/RegionSuggestions"
import WastePredictionChart from "../components/WastePredictionChart"
import CapacityOverview from "../components/CapacityOverview"
import AddIcon from "@mui/icons-material/Add"

const DashboardPage: React.FC = () => {
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4">Waste Management Dashboard</Typography>
        <Button variant="contained" startIcon={<AddIcon />}>
          Add New Region
        </Button>
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 2, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Region Suggestions
            </Typography>
            <RegionSuggestions />
          </Paper>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 2, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Capacity Overview
            </Typography>
            <CapacityOverview />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <Paper sx={{ p: 2 }}>
            <Typography variant="h6" gutterBottom>
              Waste Prediction Trend
            </Typography>
            <WastePredictionChart />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default DashboardPage

