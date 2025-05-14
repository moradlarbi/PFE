import type React from "react";
import { Typography, Grid, Paper, Box } from "@mui/material";
import { useEffect, useState } from "react";
import { fetchKPIs } from "../api/dashboard";

interface KPIProps {
  title: string;
  value: string | number;
  unit?: string;
}

const KPI: React.FC<KPIProps> = ({ title, value, unit }) => (
  <Paper sx={{ p: 2, textAlign: "center" }}>
    <Typography variant="h6" gutterBottom>
      {title}
    </Typography>
    <Typography variant="h4">
      {value} {unit}
    </Typography>
  </Paper>
);

const KpisSection: React.FC = () => {
  
  const [kpis,setKpis] = useState<any>(null);
  useEffect(() => {
        const fetchData = async () => {
          try {
            const data = await fetchKPIs();
            setKpis(data);
            console.log("Fetched kpis", data);
          } catch (error) {
            console.error("Failed to fetch kpis", error);
          }
        };
        fetchData();
      }, []);
  return (
    <Box sx={{ mb: 3 }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
        Indicateurs Clés de Performance (KPIs)
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={4}>
          <KPI title="Capacité Totale" value={kpis?.totalCapacite ?? 0} unit="kg" />
        </Grid>
        <Grid item xs={12} sm={4}>
          <KPI title="Nombre Total de Poubelles" value={kpis?.totalPoubelle ?? 0} />
        </Grid>
        <Grid item xs={12} sm={4}>
          <KPI title="Nombre de Chauffeurs" value={kpis?.totalChauffeur ?? 0} />
        </Grid>
      </Grid>
    </Box>
  );
};

export default KpisSection;

