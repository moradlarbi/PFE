import {SetStateAction, useEffect, useState } from 'react'
import { Box,IconButton, Menu,MenuItem,
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,TextField, Button
   } from "@mui/material";
import { Add, Delete, Print, MoreVert, ExpandMore } from '@mui/icons-material';
import CustomDataGrid from '../components/CustomDataGrid';
import { Columns } from '../types';
import {  useTheme } from "@mui/material/styles";
import { GridCellParams } from '@mui/x-data-grid';
import { editOperation, editStatus } from '../api/driver';
import Swal from 'sweetalert2';
import { Border } from '../components/Border';
import { addOperation } from '../api/region';
import RegionMap from '../components/RegionMap';
const RegionPage = () => {
    const [refresh, setrefresh] = useState(false);
    const theme = useTheme()
    const [selectedRows, setSelectedRows] = useState<number[]>();
    const [selectedRow, setSelectedRow] = useState(null);
    const options = [{active: 0,label:"Bloqué"}, {active: 1,label:"Actif"}];
      const [item, setItem] = useState({})
    const Printaction = async () => {
    }
    const columns: Columns[] = [
        { field: "id", headerName: "Réf", type: "string", width: 100 },
        { field: "name", headerName: "Nom", type: "string", flex: 1, add: true,edit: true,},
        { field: "population", headerName: "Population", type: "number", flex: 1, add: true,edit: true,},
      ];
      
      const [openDialog, setOpenDialog] = useState(false)
      const [expanded, setExpanded] = useState<boolean>(false);


  return (
      <>
      <Box p={2}>
      <Typography variant="h4" gutterBottom>
        Gérer vos régions
      </Typography>
      <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography>Ajouter une région</Typography>
        </AccordionSummary>
        <AccordionDetails>
            <RegionMap add={addOperation} handleRefresh={() => setrefresh(!refresh)} />
          
        </AccordionDetails>
      </Accordion>
    </Box>
    <Box>
        <Border
        title="Regions"
        subtitle="Visualiser, modifier ou gérer vos régions."
        actions={[
            {
                label: `Désactiver (${
                    selectedRows?.length ? selectedRows?.length : 0
                  })`,
                icon: <Delete />,
                action: () => {
                  selectedRows?.map(async (id) => {
                    await editStatus({active:false}, id)
                    .then((res) => {
                      console.log(res)
                      if (res.status === 200) {
                        Swal.fire({
                          position: "center",
                          icon: "success",
                          title: `${res.data.last_name ?? "chauffeur"} a bien été désactivé`,
                          showConfirmButton: false,
                          timer: 1500,
                        });
                        setrefresh(!refresh)
                      }
                      else {
                        Swal.fire({
                          position: "center",
                          icon: "error",
                          title: `${res.data.last_name ?? "chauffeur"} n'a pas été désactivé`,
                          showConfirmButton: false,
                          timer: 1500,
                        });
                      }
                    })
                    .catch((e) => {
                      console.log(e)
                        Swal.fire({
                          position: "center",
                          icon: "error",
                          title: `chauffeur n'a pas été désactivé`,
                          showConfirmButton: false,
                          timer: 1500,
                        });
                      
                      
                    })
                  })
                },
                ButtonProps: {
                  variant: "outlined",
                  color: "error",
                },
            },
        ]}
      />
      <Box sx={{ height: 450 }}>
        <CustomDataGrid
          selectionModel={selectedRows}
          onRowSelectionModelChange={(newRowSelectionModel: SetStateAction<number[] | undefined>) => {
            setSelectedRows(newRowSelectionModel);
          }}
          onCellDoubleClick={(params: GridCellParams) => {
            console.log(params.row)
            setItem(params.row)
            setOpenDialog(true)
          }}
          checkboxSelection
          refreshParent={refresh}
          fetchurl={`/region?populate=*&sort=id:ASC`}
          columns={columns}
          sx={{
            fontSize: 12,
          }}
        />
      </Box>
       
    </Box>
      </>
  )
}

export default RegionPage;