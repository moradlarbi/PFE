import {SetStateAction, useEffect, useState } from 'react'
import { Box,IconButton, Menu,MenuItem } from "@mui/material";
import { Add, Delete, Print, MoreVert } from '@mui/icons-material';
import CustomDataGrid from '../components/CustomDataGrid';
import { Columns } from '../types';
import {  useTheme } from "@mui/material/styles";
import { GridCellParams } from '@mui/x-data-grid';
import { editOperation } from '../api/driver';
import Swal from 'sweetalert2';
import { Border } from '../components/Border';
import NewDriver from '../components/CreationItems/NewDriver';
const DriverPage = () => {
    const [refresh, setrefresh] = useState(false);
    const theme = useTheme()
    const [selectedRows, setSelectedRows] = useState<number[]>();
    const [selectedRow, setSelectedRow] = useState(null);
    const options = [{active: false,label:"Bloqué"}, {active: true,label:"Actif"}];
      const [item, setItem] = useState({})
    const Printaction = async () => {
    //   const pdfBlob = await pdf(<PrintModule rows={pdfinfo.rows} columns={columns} topbanner={{
    //     title: "Acheteurs"
    //   }} />).toBlob();
    //   window.open(URL.createObjectURL(pdfBlob));
    }
    const columns: Columns[] = [
        { field: "id", headerName: "Réf", type: "string", width: 100 },
        { field: "first_name", headerName: "Nom", type: "string", flex: 1, valueGetter: (params: { row: any }) =>  `${params.row.first_name}`, add: true,edit: true,},
        { field: "last_name", headerName: "Prenom", type: "string", flex: 1, valueGetter: (params: { row: any }) =>  `${params.row.last_name}`, add: true,edit: true,},
        { field: "numpermis", headerName: "N° permis", type: "string", flex: 1, add: true,edit: true,},
        { field: "sexe", headerName: "Sexe", type: "string", flex: 1,valueGetter: (params: { row: any }) =>  `${params.row.sexe? "Homme":"Femme"}`, add: true,edit: true,},
        { field: "date_begin", headerName: "Date début", type: "string", flex: 1, add: true,edit: true,},
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
                      params.row?.active ? theme?.palette.primary.main :theme?.palette.error.main,
                    paddingLeft: "5px",
                    color: "#fff",
                    padding: "4px 9px",
                    borderRadius: "32px",
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  {params.row?.active ? "Actif":"Bloqué"}
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
                              handleChangeState(params.row, option.label);
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
          },
      ];
      const handleChangeState = async(values: any, option: string) => {
        await editOperation({data: {...values, active: !values.active}}, values.id)
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
          
            Swal.fire({
              position: "center",
              icon: "error",
              title: `${values.nom} n'a pas mis a jour`,
              showConfirmButton: false,
              timer: 1500,
            });
          
          
        })
      }
      const [openDialog, setOpenDialog] = useState(false)
      const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
      let open = Boolean(anchorEl);


  return (
      <>
      {openDialog && <NewDriver handleClose={() => setOpenDialog(false)} handleCloseUpdated={() => {
            Swal.fire({
              icon: "warning",
              title: "Are you sure?",
              text: "Your changes will not be saved!",
              showCancelButton: true,
              confirmButtonColor: "#3085d6",
              cancelButtonColor: "#d33",
              confirmButtonText: "Yes, discard changes!",
            }).then((result : any) => {
              if (result.isConfirmed) {
                setOpenDialog(false);
                setrefresh(!refresh);
              }
            });
          }} handleRefresh={() => setrefresh(!refresh)} open={openDialog} item={item} setItem={setItem} />}
    <Box>
        <Border
        title="Chauffeurs"
        subtitle="Visualiser, modifier ou gérer vos chauffeurs."
        actions={[
            {
                label: `Désactiver (${
                    selectedRows?.length ? selectedRows?.length : 0
                  })`,
                icon: <Delete />,
                action: () => {
                  selectedRows?.map(async (id) => {
                    await editOperation({data: {active: false}}, id)
                    .then((res) => {
                      console.log(res)
                      if (res.status === 200) {
                        Swal.fire({
                          position: "center",
                          icon: "success",
                          title: `${res.data.attributes?.nom ?? "acheteur"} a bien été désactivé`,
                          showConfirmButton: false,
                          timer: 1500,
                        });
                        setrefresh(!refresh)
                      }
                      else {
                        Swal.fire({
                          position: "center",
                          icon: "error",
                          title: `${res.data.attributes?.nom ?? "acheteur"} n'a pas été désactivé`,
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
                          title: `acheteur n'a pas été désactivé`,
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
            {
              label: "Impression",
              icon: <Print />,
              action: Printaction,
              ButtonProps: {
                variant: "outlined",
                color: "inherit",
              },
            },
          {
            label: "Ajouter un chauffeur",
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
            let i = {...params.row.role_data[0], ...params.row}
            delete i.role_data
            setItem(i)
            setOpenDialog(true)
          }}
          checkboxSelection
          refreshParent={refresh}
          fetchurl={`/user?populate=*&filters[idRole][$eq]=1&sort=id:ASC`}
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

export default DriverPage;