import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box/Box";
import {
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
import { addOperation, editOperation } from "../../api/driver";
import Swal from "sweetalert2";

const registerSchema = object({
  nom: string().nonempty("Le nom est obligatoire"),
});

type RegisterInput = TypeOf<typeof registerSchema>;

const fields = [
  { field: "nom", headerName: "Nom et prénom", type: "string", add: true, edit: true, required: true },
  {
    field: "etat",
    headerName: "Etat",
    type: "checkbox",
  },
];

interface NewDriverProps {
  open: boolean;
  handleClose: () => void;
  handleCloseUpdated: () => void;
  handleRefresh: () => void;
  item: any;
  setItem: React.Dispatch<React.SetStateAction<any>>;
}

const NewDriver: React.FC<NewDriverProps> = ({ open, handleClose, handleCloseUpdated, handleRefresh, item, setItem }) => {
  const [checked, setChecked] = useState(false);
  const [fieldsChanged, setFieldsChanged] = useState(false);

  const addOne = async (values: RegisterInput) => {
    let nom = values.nom;
    let newValues = { nom: nom, role: "acheteur", active: !checked };
    console.log(newValues);

    await addOperation({ data: newValues })
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
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
    console.log(values);
    await editOperation({ data: values }, values.id)
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          Swal.fire({
            position: "center",
            icon: "success",
            title: `${values.nom} a bien été mis a jour`,
            showConfirmButton: false,
            timer: 1500,
          });
          handleRefresh();
        } else {
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
      handleClose();
    }
  };

  const handleSubmitEdit = () => {
    console.log(item);
    editOne(item);
    handleClose();
  };

  const [refresh, setRefresh] = useState(false);
  const handleChangeUpdate = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.type === "number") {
      setItem({ ...item, [event.target.name]: Number(event.target.value) });
    } else {
      setItem({ ...item, [event.target.name]: event.target.value });
    }
    setFieldsChanged(true);
    setRefresh(!refresh);
  };

  useEffect(() => {}, [item]);

  return (
    <Dialog open={open} onClose={fieldsChanged ? handleCloseUpdated : handleClose} maxWidth={false}>
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
                fiche Acheteur
              </Typography>
              <Typography sx={{ pt: 2 }} variant="h3" color={"secondary"}>
                Fiche acheteur : créer un acheteur .
              </Typography>
            </Box>
            <CloseIcon onClick={handleClose} sx={{ cursor: "pointer" }} />
          </DialogTitle>
          <DialogContent>
            <Box
              sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 10px", marginTop: "10px", minWidth: 500 }}
            >
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
              ))}
            </Box>
            <Box sx={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <Typography>En sommeil</Typography>
              <Switch
                checked={checked}
                onChange={(e) => setChecked(e.target.checked)}
                inputProps={{ "aria-label": "controlled" }}
                sx={{ "& .MuiSvgIcon-root": { fontSize: 28 } }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Annuler</Button>
            <Button variant="contained" type="submit">
              Enregistrer
            </Button>
          </DialogActions>
        </Box>
      ) : (
        <Box component="form">
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
                fiche Acheteur
              </Typography>
              <Typography sx={{ pt: 2 }} variant="h3" color={"secondary"}>
                Fiche acheteur : mettre a jour un acheteur .
              </Typography>
            </Box>
            <CloseIcon onClick={fieldsChanged ? handleCloseUpdated : handleClose} sx={{ cursor: "pointer" }} />
          </DialogTitle>
          <DialogContent>
            <Box
              sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "10px 10px", marginTop: "10px", minWidth: 500 }}
            >
              {fields.filter((c) => c.edit).map((col) => (
                <TextField
                  key={col.field}
                  fullWidth
                  label={col.headerName}
                  type={col.type}
                  value={item[col.field]}
                  name={col.field}
                  onChange={handleChangeUpdate}
                  required={col.required}
                  InputProps={{
                    endAdornment: <InputAdornment position="start"></InputAdornment>,
                  }}
                />
              ))}
            </Box>
            <Box sx={{ display: "flex", gap: "10px", alignItems: "center" }}>
              <Typography>En sommeil</Typography>
              <Switch
                checked={!item.active}
                onChange={(e) => {
                  setItem({ ...item, active: !e.target.checked });
                  setRefresh(!refresh);
                }}
                inputProps={{ "aria-label": "controlled" }}
                sx={{ "& .MuiSvgIcon-root": { fontSize: 28 } }}
              />
            </Box>
          </DialogContent>
          <DialogActions>
            <Button onClick={fieldsChanged ? handleCloseUpdated : handleClose}>Annuler</Button>
            <Button variant="contained" type="submit" onClick={handleSubmitEdit}>
              Mettre a jour
            </Button>
          </DialogActions>
        </Box>
      )}
    </Dialog>
  );
};

export default NewDriver;
