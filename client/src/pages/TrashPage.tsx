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
import { GridCellParams, GridEventListener, GridRowEditStartReasons, GridRowEditStopReasons, GridRowModesModel } from '@mui/x-data-grid';
import { editOperation, editStatus } from '../api/camion';
import {  addOperation, editOperation as editModel} from '../api/modeleCamion'
import Swal from 'sweetalert2';
import { Border } from '../components/Border';
import NewModeleTrash from '../components/CreationItems/NewModeleTrash';
import TrashMap from '../components/TrashMap';
const TrashPage = () => {
    const [refresh, setrefresh] = useState(false);
    const theme = useTheme()
    const [selectedRows, setSelectedRows] = useState<number[]>();
    const [selectedRow, setSelectedRow] = useState(null);
    const options = [{active: 0,label:"Bloqué"}, {active: 1,label:"Actif"}];
    const [item, setItem] = useState({})
    const Printaction = async () => {
    //   const pdfBlob = await pdf(<PrintModule rows={pdfinfo.rows} columns={columns} topbanner={{
    //     title: "Acheteurs"
    //   }} />).toBlob();
    //   window.open(URL.createObjectURL(pdfBlob));
    }
    const columns: Columns[] = [
        { field: "id", headerName: "Réf", type: "string", width: 100 },
        { field: "name", headerName: "Nom", type: "string", flex: 1, add: true,edit: true,},
        { field: "volume", headerName: "Volume", type: "number", flex: 1, add: true,edit: true, valueGetter: (params: any) =>  {
          return `${params} L`
        }},
        { field: "couleur", headerName: "Couleur", type: "color", flex: 1, add: true,edit: true,},
        { field: "total", headerName: "Total", type: "number", flex: 1, add: false,edit: false,},
      ];
    
      const [openDialog, setOpenDialog] = useState(false)
    const [expanded, setExpanded] = useState<boolean>(false);
    
  
  return (
      <>
      {openDialog && <NewModeleTrash handleClose={() => setOpenDialog(false)} handleCloseUpdated={() => {
            Swal.fire({
              icon: "warning",
              title: "Êtes-vous sûr ?",
              text: "Tes changements seront pas sauvegardés",
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              confirmButtonText: "Oui, supprimer les modifications",
            }).then((result : any) => {
              if (result.isConfirmed) {
                setOpenDialog(false);
                setrefresh(!refresh);
              }
            });
          }} handleRefresh={() => setrefresh(!refresh)} open={openDialog} item={item} setItem={setItem} />}
    <Box>
    <Box p={2}>
      <Typography variant="h4" gutterBottom>
        Gérer vos dépotoires et leurs modeles
      </Typography>
      <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography>Gérer les modèles</Typography>
        </AccordionSummary>
        <AccordionDetails>
        <TrashMap handleRefresh={() => setrefresh(!refresh)} />
        </AccordionDetails>
      </Accordion>
    </Box>
        <Border
        title="Modèles de dépotoires"
        subtitle="Visualiser, modifier ou gérer vos modèles de dépotoires."
        actions={[
            // {
            //   label: "Impression",
            //   icon: <Print />,
            //   action: Printaction,
            //   ButtonProps: {
            //     variant: "outlined",
            //     color: "inherit",
            //   },
            // },
          {
            label: "Ajouter un modèle",
            icon: <Add />,
            action: () => {
                setItem({})
              setOpenDialog(!openDialog)
            },
            ButtonProps: {
              variant: "contained",
              color: "primary",
            },
          }
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
          fetchurl={`/modeleTrash?populate=*&sort=id:ASC`}
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

export default TrashPage;