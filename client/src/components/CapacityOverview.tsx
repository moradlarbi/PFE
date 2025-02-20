import type React from "react"
import { Box, Typography, CircularProgress } from "@mui/material"

const CapacityOverview: React.FC = () => {
  const totalCapacity = 16500
  const usedCapacity = 14500
  const percentage = Math.round((usedCapacity / totalCapacity) * 100)

  return (
    <Box sx={{ position: "relative", display: "inline-flex", flexDirection: "column", alignItems: "center" }}>
      <CircularProgress variant="determinate" value={percentage} size={200} thickness={5} />
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
          {`${percentage}%`}
        </Typography>
      </Box>
      <Typography variant="h6" sx={{ mt: 2 }}>
        Total Capacity Used
      </Typography>
      <Typography variant="body1">{`${usedCapacity} / ${totalCapacity} kg`}</Typography>
    </Box>
  )
}

export default CapacityOverview

