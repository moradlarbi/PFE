import type React from "react"
import { Typography, Grid, Paper, Box, Button } from "@mui/material"
import RegionSuggestions from "../components/RegionSuggestions"
import CapacityOverview from "../components/CapacityOverview"
import AddIcon from "@mui/icons-material/Add"
import { Link } from 'react-router-dom'
import UserMessagesSection from "../components/UserMessagesSection"
import KpisSection from "../components/KpisSection"

const DashboardPage: React.FC = () => {
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 3 }}>
        <Typography variant="h4">Dashboard Gestion des des dépotoires</Typography>
        <Link to={"/region"}>
          <Button variant="contained" startIcon={<AddIcon />}>
            Ajouter une région
          </Button>
        </Link>
        
      </Box>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Paper sx={{ p: 2, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Suggestions
            </Typography>
            <RegionSuggestions />
          </Paper>
        </Grid>
        <Grid item xs={12}>
          <KpisSection />
        </Grid>
        {/* Section Overview Capacité */}
        <Grid item xs={12} md={6}> {/* Adjusted to take half width on medium screens */}
          <Paper sx={{ p: 2, height: "100%" }}>
            <Typography variant="h6" gutterBottom>
              Overview de la capacité
            </Typography>
            <CapacityOverview />
          </Paper>
        </Grid>

        {/* Section Messages Utilisateurs */}
        <Grid item xs={12} md={6}> {/* Adjusted to take half width on medium screens */}
          <Paper sx={{ p: 2, height: "100%", display: "flex", flexDirection: "column" }}>
            <UserMessagesSection />
          </Paper>
        </Grid>
      </Grid>
    </Box>
  )
}

export default DashboardPage

