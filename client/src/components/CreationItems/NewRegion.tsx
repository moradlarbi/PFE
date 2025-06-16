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
  Switch
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useForm, SubmitHandler, FieldErrors } from "react-hook-form";
import { object, string, TypeOf } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { addOperation, editOperation } from "../../api/region";
import Swal from "sweetalert2";

const registerSchema = object({
  nom: string().nonempty("Le nom est obligatoire"),
  population: string().nonempty("La population est obligatoire"),
});

type RegisterInput = TypeOf<typeof registerSchema>;

const fields = [
    { field: "id", headerName: "Réf", type: "string", width: 100 },
    { field: "nom", headerName: "Nom", type: "string", flex: 1, add: true,edit: true,required: true },
    { field: "population", headerName: "Population", type: "number", flex: 1, add: true,edit: true,required: true}
];



interface NewRegionProps {
  open: boolean;
  handleClose: () => void;
  handleCloseUpdated: () => void;
  handleRefresh: () => void;
  item: any;
  setItem: React.Dispatch<React.SetStateAction<any>>;
}

const NewRegion: React.FC<NewRegionProps> = ({ open, handleClose, handleCloseUpdated, handleRefresh, item, setItem }) => {
  const [checked, setChecked] = useState(false);
  const [fieldsChanged, setFieldsChanged] = useState(false);

  

  const addOne = async (values: RegisterInput) => {
    let nom = "La région " + values.nom;
    let newValues = { ...values, active: !checked };
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
    let newValues = { ...values, active: !checked };
    console.log(newValues);

    await editOperation({ ...newValues }, values.id)
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          Swal.fire({
            position: "center",
            icon: "success",
            title: `La région ${values.nom} a bien été mise à jour`,
            showConfirmButton: false,
            timer: 1500,
          });
          handleRefresh();
        } else {
          Swal.fire({
            position: "center",
            icon: "error",
            title: `La région ${values.nom} n'a pas été mise à jour`,
            showConfirmButton: false,
            timer: 1500,
          });
        }
      })
      .catch((e) => {
        Swal.fire({
          position: "center",
          icon: "error",
          title: `La région ${values.nom} n'a pas été mise à jour`,
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
                fiche Region
              </Typography>
              <Typography sx={{ pt: 2 }} variant="h3" color={"secondary"}>
                Fiche région : créer une région .
              </Typography>
            </Box>
            <CloseIcon onClick={handleClose} sx={{ cursor: "pointer" }} />
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 10px", marginTop: "10px", minWidth: 500 }}>
              {fields.filter((c) => c.add).map((col) => (
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
              )}
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
              fiche Région
              </Typography>
              <Typography sx={{ pt: 2 }} variant="h3" color={"secondary"}>
              Fiche Région modifier une région .
              </Typography>
            </Box>
            <CloseIcon onClick={handleClose} sx={{ cursor: "pointer" }} />
          </DialogTitle>
          <DialogContent>
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 10px", marginTop: "10px", minWidth: 500 }}>
              {fields.filter((c) => c.edit).map((col) => (
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
              )}
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
            <Button onClick={handleSubmitEdit} variant="contained" color="primary">
              Enregistrer
            </Button>
          </DialogActions>
        </Box>
      )}
    </Dialog>
  );
};

export default NewRegion;
