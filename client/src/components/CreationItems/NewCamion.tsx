import React, { useEffect, useState } from "react";
import {
  Box,
  Button,
  DialogActions,
  DialogContent,
  Dialog,
  DialogTitle,
  TextField,
  InputAdornment,
  Typography,
  Switch,
  MenuItem,
  Select,
  FormControl,
  InputLabel
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useForm, SubmitHandler, FieldErrors } from "react-hook-form";
import { object, string, TypeOf } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { addOperation, editOperation } from "../../api/camion";
import Swal from "sweetalert2";
import { fetchModeleCamions } from "../../api/modeleCamion";

const registerSchema = object({
  matricule: string().nonempty("Le matricule est obligatoire"),
  couleur: string().nonempty("La couleur est obligatoire"),
});

type RegisterInput = TypeOf<typeof registerSchema>;

const fields = [
  { field: "matricule", headerName: "N° matricule", type: "string", flex: 1, add: true, edit: true, required: true },
  { field: "couleur", headerName: "Couleur", type: "color", flex: 1, add: true, edit: true, required: true },
  { field: "idModele", headerName: "Modèle", type: "select", flex: 1, add: true, edit: true, required: true },
  { field: "active", headerName: "Etat", type: "checkbox" },
];

interface ModeleCamion {
  id: string;
  name: string;
}

interface NewCamionProps {
  open: boolean;
  handleClose: () => void;
  handleCloseUpdated: () => void;
  handleRefresh: () => void;
  item: any;
  setItem: React.Dispatch<React.SetStateAction<any>>;
}

const NewCamion: React.FC<NewCamionProps> = ({ open, handleClose, handleCloseUpdated, handleRefresh, item, setItem }) => {
  const [checked, setChecked] = useState(false);
  const [fieldsChanged, setFieldsChanged] = useState(false);
  const [modeleCamions, setModeleCamions] = useState<ModeleCamion[]>([]);
  const [idModele, setIdModele] = useState<string>("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const data = await fetchModeleCamions();
        setModeleCamions(data);
      } catch (error) {
        console.error("Failed to fetch ModeleCamions", error);
      }
    };
    fetchData();
  }, []);

  const addOne = async (values: RegisterInput) => {
    let nom = "La voiture " + values.matricule;
    let newValues = { ...values, idModele, active: !checked };
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
          handleRefresh();
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
  };

  const editOne = async (values: any) => {
<<<<<<< Updated upstream
    let newValues = { ...values};
=======
    let newValues = { ...values };
>>>>>>> Stashed changes
    console.log(newValues);

    await editOperation({ ...newValues }, values.id)
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          Swal.fire({
            position: "center",
            icon: "success",
            title: `La voiture ${values.matricule} a bien été mise à jour`,
            showConfirmButton: false,
            timer: 1500,
          });
          handleRefresh();
        } else {
          Swal.fire({
            position: "center",
            icon: "error",
            title: `La voiture ${values.matricule} n'a pas été mise à jour`,
            showConfirmButton: false,
            timer: 1500,
          });
        }
      })
      .catch((e) => {
        Swal.fire({
          position: "center",
          icon: "error",
          title: `La voiture ${values.matricule} n'a pas été mise à jour`,
          showConfirmButton: false,
          timer: 1500,
        });
      });
  };

  const {
    register,
    formState: { errors, isSubmitSuccessful },
    reset,
    handleSubmit,
  } = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
  });

  useEffect(() => {
    if (isSubmitSuccessful) {
      reset();
    }
  }, [isSubmitSuccessful, reset]);

  const onSubmitHandler: SubmitHandler<RegisterInput> = (values) => {
    if (Object.keys(errors).length === 0) {
      addOne(values);
      console.log(values);
      handleClose();
    }
  };

  const handleSubmitEdit = () => {
    console.log(item);
    editOne(item);
    handleClose();
  };

  const [refresh, setRefresh] = useState(false);
  const handleChangeUpdate = (event: React.ChangeEvent<HTMLInputElement | { name?: string; value: unknown } | any>) => {
    const { name, value } = event.target as HTMLInputElement;
    if (name) {
      setItem({ ...item, [name]: value });
      setFieldsChanged(true);
      setRefresh(!refresh);
    }
  };

  const handleSelectChange = (event: React.ChangeEvent<any>) => {
    setIdModele(event.target.value as string);
  };

  useEffect(() => {}, [item]);

  return (
    <Dialog open={open} onClose={fieldsChanged ? handleCloseUpdated : handleClose} maxWidth={false} sx={{zIndex:"130"}}>
      {Object.keys(item).length === 0 ? (
        <Box component="form" noValidate autoComplete="off" onSubmit={handleSubmit(onSubmitHandler)}>
          <DialogTitle
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
            }}
            id="alert-dialog-title"
          >
            <Box>
              <Typography sx={{ mt: 2 }} variant="h1" color={"primary.main"}>
                fiche Camion
              </Typography>
              <Typography sx={{ pt: 2 }} variant="h3" color={"secondary"}>
                Fiche Camion : créer un Camion .
              </Typography>
            </Box>
            <CloseIcon onClick={handleClose} sx={{ cursor: "pointer" }} />
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 10px", marginTop: "10px", minWidth: 500 }}>
              {fields.filter((c) => c.add).map((col) => (
                col.type === "select" ? (
                  <FormControl key={col.field} fullWidth>
                    <InputLabel>{col.headerName}</InputLabel>
                    <Select
                      label={col.headerName}
                      value={idModele}
                      onChange={handleSelectChange} // Separate change handler for select
                      error={!!(errors as FieldErrors<RegisterInput>)[col.field as keyof RegisterInput]}
                    >
                      {modeleCamions.map((modele) => (
                        <MenuItem key={modele.id} value={modele.id}>
                          {modele.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ) : (
                  <TextField
                    key={col.field}
                    fullWidth
                    label={col.headerName}
                    type={col.type}
                    {...register(col.field as keyof RegisterInput)}
                    required={col.required}
                    error={!!(errors as FieldErrors<RegisterInput>)[col.field as keyof RegisterInput]}
                    helperText={(errors as FieldErrors<RegisterInput>)[col.field as keyof RegisterInput]?.message}
                    InputProps={{
                      endAdornment: <InputAdornment position="start"></InputAdornment>,
                    }}
                  />
                )
              ))}
            </Box>
            <Box sx={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <Typography>En sommeil</Typography>
              <Switch
                checked={checked}
                onChange={(e) => setChecked(e.target.checked)}
                inputProps={{ "aria-label": "controlled" }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button type="submit" variant="contained" color="primary">
              Enregistrer
            </Button>
          </DialogActions>
        </Box>
      ) : (
        <Box component="form" noValidate autoComplete="off">
          <DialogTitle
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 2,
            }}
            id="alert-dialog-title"
          >
            <Box>
              <Typography sx={{ mt: 2 }} variant="h1" color={"primary.main"}>
                fiche Camion
              </Typography>
              <Typography sx={{ pt: 2 }} variant="h3" color={"secondary"}>
                Fiche Camion : modifier un Camion .
              </Typography>
            </Box>
            <CloseIcon onClick={handleClose} sx={{ cursor: "pointer" }} />
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 10px", marginTop: "10px", minWidth: 500 }}>
              {fields.filter((c) => c.edit).map((col) => (
                col.type === "select" ? (
                  <FormControl key={col.field} fullWidth required={col.required}>
                    <InputLabel>{col.headerName}</InputLabel>
                    <Select
                      label={col.headerName}
                      name={col.field}
                      value={item[col.field] || ""}
                      onChange={handleChangeUpdate}
                    >
                      {modeleCamions.map((modele) => (
                        <MenuItem key={modele.id} value={modele.id}>
                          {modele.name}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>
                ) : (
                  <TextField
                    key={col.field}
                    fullWidth
                    label={col.headerName}
                    type={col.type}
                    name={col.field}
                    value={item[col.field]}
                    onChange={handleChangeUpdate}
                    required={col.required}
                    InputProps={{
                      endAdornment: <InputAdornment position="start"></InputAdornment>,
                    }}
                  />
                )
              ))}
            </Box>
            <Box sx={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <Typography>En sommeil</Typography>
              <Switch
                checked={!item.active}
<<<<<<< Updated upstream
                onChange={(e) => setItem({ ...item, active: !e.target.checked })}
=======
                onChange={(e) => {
                  setItem({ ...item, active: !e.target.checked })
                  setFieldsChanged(true);
                  setRefresh(!refresh);
                }}
>>>>>>> Stashed changes
                inputProps={{ "aria-label": "controlled" }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleSubmitEdit} variant="contained" color="primary">
              Enregistrer
            </Button>
          </DialogActions>
        </Box>
      )}
    </Dialog>
  );
};

export default NewCamion;
