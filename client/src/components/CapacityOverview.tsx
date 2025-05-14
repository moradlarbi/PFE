import type React from "react"
import { Box, Typography, CircularProgress } from "@mui/material"
import { useEffect, useState } from "react"
import { fetchCapacity } from "../api/dashboard"

const CapacityOverview: React.FC = () => {
  const [capacity, setCapacity] = useState<any>(null)
  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchCapacity();
        setCapacity(data);
        console.log("Fetched capacity", data);
      } catch (error) {
        console.error("Failed to fetch capacity", error);
      }
    };
    fetchData();
  }, []);
  return (
    <Box sx={{ position: "relative", display: "inline-flex", flexDirection: "column", alignItems: "center" }}>
      <CircularProgress variant="determinate" value={Math.round((capacity?.volume_utilise / capacity?.capacite_totale_theorique) * 100) ?? 0} size={200} thickness={5} />
      <Box
        sx={{
          top: 0,
          left: 0,
          bottom: 0,
          right: 0,
          position: "absolute",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Typography variant="h4" component="div" color="text.secondary">
          {`${Math.round((capacity?.volume_utilise / capacity?.capacite_totale_theorique) * 100) ?? 0}%`}
        </Typography>
      </Box>
      <Typography variant="h6" sx={{ mt: 2 }}>
        Capacité utilisé en temps réel 
      </Typography>
      <Typography variant="body1">{`${capacity?.volume_utilise ?? 0} / ${capacity?.capacite_totale_theorique ?? 0} kg`}</Typography>
    </Box>
  )
}

export default CapacityOverview

