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
import Swal from 'sweetalert2';
import { Border } from '../components/Border';
import { addOperation, editStatus } from '../api/region';
import RegionMap from '../components/RegionMap';
import NewRegion from '../components/CreationItems/NewRegion';
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
        { field: "nom", headerName: "Nom", type: "string", flex: 1, add: true,edit: true,},
        { field: "population", headerName: "Population", type: "string", flex: 1, add: true,edit: true, valueGetter: (params: any) =>  {
          return `${params} Habitants`
        }},
        {
          field: "active",
          headerName: "Etat",
          type: "string",
          editable: false,
          width: 100,
          renderCell: (params) => {
            return (
              <Box
                sx={{
                  background:
                    params.row.active == 1 ? theme?.palette.primary.main :theme?.palette.error.main,
                  color: "#fff",
                  borderRadius: "32px",
                  display: "flex",
                  justifyContent:"center",
                  alignItems: "center",
                }}
              >
                {params.row.active == 1 ? "Actif":"Bloqué"}
              </Box>
            );
          },
        },
        {
          type: "actions",
          editable: false,
          renderCell: (params: GridCellParams) => {
            return (
              <>
                <IconButton
                  aria-label="more"
                  id="long-button"
                  aria-controls={open ? "long-menu" : undefined}
                  aria-expanded={open ? "true" : undefined}
                  aria-haspopup="true"
                  onClick={(event) => {
                    setSelectedRow(params.row.id);
                    
                    setAnchorEl(event.currentTarget);
                  }}
                >
                  <MoreVert />
                </IconButton>
                {open && selectedRow === params.row.id && (
                  <Menu
                    id="long-menu"
                    anchorEl={anchorEl}
                    open={open}
                    onClose={() => {
                      setAnchorEl(null);
                    }}
                  >
                    {options
                      .filter(
                        (o) => o.active !== params.row.active
                      )
                      .map((option) => (
                        <MenuItem
                          key={option.label}
                          onClick={() => {
                            handleChangeState(params.row);
                            setAnchorEl(null);
                          }}
                        >
                          {option.label}
                        </MenuItem>
                      ))}
                  </Menu>
                )}
              </>
            );
          },
        }
      ];
      const handleChangeState = async(values: any) => {
        await editStatus({active:!values.active}, values.id)
        .then((res) => {
          console.log(res)
          if (res.status === 200) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: `${values.nom} a bien été mis a jour`,
              showConfirmButton: false,
              timer: 1500,
            });
            setrefresh(!refresh)
          }
          else {
            Swal.fire({
              position: "center",
              icon: "error",
              title: `${values.nom} n'a pas mis a jour`,
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
              title: `${values.nom} n'a pas été mis a jour`,
              showConfirmButton: false,
              timer: 1500,
            });
          
          
        })
      }
      const [expanded, setExpanded] = useState<boolean>(false);
      const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
      let open = Boolean(anchorEl);
      const [openDialog, setOpenDialog] = useState(false)


  return (
      <>
      {openDialog && <NewRegion handleClose={() => setOpenDialog(false)} handleCloseUpdated={() => {
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
                          title: `Les régions séléctionnées ont bien été désactivées`,
                          showConfirmButton: false,
                          timer: 1500,
                        });
                        setrefresh(!refresh)
                      }
                      else {
                        Swal.fire({
                          position: "center",
                          icon: "error",
                          title: `Les régions séléctionnées n'ont pas été désactivées`,
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
                          title: `Les régions séléctionnées n'ont pas été désactivées`,
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