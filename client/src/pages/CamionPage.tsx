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
import { fetchModeleCamions, addOperation, editOperation as editModel, deleteOperation} from '../api/modeleCamion'
import Swal from 'sweetalert2';
import { Border } from '../components/Border';
import NewCamion from '../components/CreationItems/NewCamion';
const CamionPage = () => {
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
        { field: "matricule", headerName: "N° matricule", type: "string", flex: 1, add: true,edit: true,},
        { field: "couleur", headerName: "Couleur", type: "string", flex: 1, add: true,edit: true,},
        { field: "modeleName", headerName: "Modèle", type: "string", flex: 1, add: true,edit: true,
          // renderCell: (params) => {
          //   return (
          //     <Box
          //       sx={{
          //         background:
          //           params.row.active == 1 ? theme?.palette.primary.main :theme?.palette.error.main,
          //         color: "#fff",
          //         borderRadius: "32px",
          //         display: "flex",
          //         justifyContent:"center",
          //         alignItems: "center",
          //       }}
          //     >
          //       {params.row.active == 1 ? "Actif":"Bloqué"}
          //     </Box>
          //   );
          // },
        },
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
                        .map((option) => {
                          console.log(options)
                          return (
                            <MenuItem
                              key={option.label}
                              onClick={() => {
                                handleChangeState(params.row);
                                setAnchorEl(null);
                              }}
                            >
                              {option.label}
                            </MenuItem>
                          )
                        })}
                    </Menu>
                  )}
                </>
              );
            },
          },
      ];
    const columnsModels: Columns[] = [
      { field: "id", headerName: "Réf", type: "string", width: 100 },
      { field: "name", headerName: "Nom", type: "string", flex: 1, add: true,edit: true,editable: true },
      // {
      //   type: "actions",
      //   editable: false,
      //   renderCell: (params: GridCellParams) => {
      //     return (
      //       <>
      //         <IconButton
      //           aria-label="more"
      //           id="long-button"
      //           aria-controls={open ? "long-menu" : undefined}
      //           aria-expanded={open ? "true" : undefined}
      //           aria-haspopup="true"
      //           onClick={(event) => {
      //             setSelectedRow(params.row.id);
                  
      //             setAnchorEl(event.currentTarget);
      //           }}
      //         >
      //           <MoreVert />
      //         </IconButton>
      //         {open && selectedRow === params.row.id && (
      //           <Menu
      //             id="long-menu"
      //             anchorEl={anchorEl}
      //             open={open}
      //             onClose={() => {
      //               setAnchorEl(null);
      //             }}
      //           >
      //             {options
      //               .filter(
      //                 (o) => o.active !== params.row.active
      //               )
      //               .map((option) => (
      //                 <MenuItem
      //                   key={option.label}
      //                   onClick={() => {
      //                     handleChangeState(params.row);
      //                     setAnchorEl(null);
      //                   }}
      //                 >
      //                   {option.label}
      //                 </MenuItem>
      //               ))}
      //           </Menu>
      //         )}
      //       </>
      //     );
      //   },
      // },
    ];
      const handleChangeState = async(values: any) => {
        await editOperation({...values, active: !values.active}, values.id)
        .then((res) => {
          console.log(res)
          if (res.status === 200) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: `Le camion ${values.id} a bien été mis a jour`,
              showConfirmButton: false,
              timer: 1500,
            });
            setrefresh(!refresh)
          }
          else {
            Swal.fire({
              position: "center",
              icon: "error",
              title: `Le camion ${values.id} n'a pas mis a jour`,
              showConfirmButton: false,
              timer: 1500,
            });
          }
        })
        .catch((e) => {
          
            Swal.fire({
              position: "center",
              icon: "error",
              title: `Le camion ${values.id} n'a pas mis a jour`,
              showConfirmButton: false,
              timer: 1500,
            });
          
          
        })
      }
      const [openDialog, setOpenDialog] = useState(false)
      const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
      let open = Boolean(anchorEl);
    const [newModelName, setNewModelName] = useState('');
    const [expanded, setExpanded] = useState<boolean>(false);
    const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
    const handleAddModel = async () => {
      let nom = newModelName;
      if (newModelName.trim() !== '') {
        let newValues ={name: newModelName};
        console.log(newValues);
        await addOperation({ ...newValues })
        .then((res) => {
          console.log(res);
          if (res.status === 201) {
            Swal.fire({
              position: "center",
              icon: "success",
              title: `${nom} a bien été ajouté`,
              showConfirmButton: false,
              timer: 1500,
            });
            setrefresh(!refresh);
          } else {
            Swal.fire({
              position: "center",
              icon: "error",
              title: `${nom} n'a pas été ajouté`,
              showConfirmButton: false,
              timer: 1500,
            });
          }
        })
        .catch((e) => {
          console.log(e);
          Swal.fire({
            position: "center",
            icon: "error",
            title: `${nom} n'a pas été ajouté`,
            showConfirmButton: false,
            timer: 1500,
          });
        });
      setNewModelName('');
    }};
    const processRowUpdate = async (nouveauRow, oldRow) => {
      var changed = { ...nouveauRow };
      delete changed.id;
      console.log(changed)
      if (JSON.stringify(nouveauRow) === JSON.stringify(oldRow)) return;
      const rd = {
        name: changed.name,
      };
      const res = await editModel(rd, oldRow.id);
      if (res.status === 200) {
        Swal.fire({
          title: "Succés",
          text: "Modèle modifié avec succés",
          icon: "success",
          confirmButtonText: "Ok",
        });
        return nouveauRow;
      } else {
        return oldRow;
      }
    };
  
    const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
      if (params.reason === GridRowEditStopReasons.rowFocusOut) {
        event.defaultMuiPrevented = true;
      }
    };
  
    const handleCellEditStop: GridEventListener<'cellEditStop'> = (params, event) => {
      setRowModesModel((prevModel : any) => ({
        ...prevModel,
        [params.id]: { mode: 'view' },
      }));
    };
  
  
    const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
      setRowModesModel(newRowModesModel);
    };
  
  return (
      <>
      {openDialog && <NewCamion handleClose={() => setOpenDialog(false)} handleCloseUpdated={() => {
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
        Gérer vos camions et leurs modeles
      </Typography>
      <Accordion expanded={expanded} onChange={() => setExpanded(!expanded)}>
        <AccordionSummary expandIcon={<ExpandMore />}>
          <Typography>Gérer les modèles</Typography>
        </AccordionSummary>
        <AccordionDetails>
        <Box display="flex" gap={2} p={2}>
            <TextField
              label="Model Name"
              value={newModelName}
              onChange={(e) => setNewModelName(e.target.value)}
            />
            <Button variant="contained" color="primary" onClick={handleAddModel}>
              Ajouter un Modèle
            </Button>
          </Box>
        <Box sx={{ height: 450 }}>
        <CustomDataGrid
          selectionModel={selectedRows}
          editMode="row"
          processRowUpdate={processRowUpdate}
          onProcessRowUpdateError={(error) => {
            console.log(error);
          }}
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          onRowEditStop={handleRowEditStop}
          onCellEditStop={handleCellEditStop}
          refreshParent={refresh}
          fetchurl={`/modeleCamion?populate=*&sort=id:ASC`}
          columns={columnsModels}
          sx={{
            fontSize: 12,
          }}
        />
      </Box>
          
        </AccordionDetails>
      </Accordion>
    </Box>
        <Border
        title="Camions"
        subtitle="Visualiser, modifier ou gérer vos camions."
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
                          title: `Le camion a bien été désactivé`,
                          showConfirmButton: false,
                          timer: 1500,
                        });
                        setrefresh(!refresh)
                      }
                      else {
                        Swal.fire({
                          position: "center",
                          icon: "error",
                          title: `Le camion n'a pas été désactivé`,
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
                          title: `camion n'a pas été désactivé`,
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
            label: "Ajouter un camion",
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
          fetchurl={`/camion?populate=*&sort=id:ASC`}
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

export default CamionPage;