import React, { useEffect, useState } from "react";
import { Typography, Box, Paper, List, ListItem, ListItemText, Divider, Button, Pagination, IconButton } from "@mui/material";
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { deleteMessage, fetchMessages } from "../api/dashboard";
import Swal from "sweetalert2";

// Définition de l'interface pour un message utilisateur
interface UserMessage {
  id: string | number;
  idUser: string | number;
  titre: string;
  message: string;
}


const ITEMS_PER_PAGE = 3;

const UserMessagesSection: React.FC = () => {
  const [refresh, setRefresh] = useState(false);
  const [messages, setMessages] = useState<UserMessage[]>([]);
  const [currentPage, setCurrentPage] = useState(1);

  const handleMarkAsRead = async (id: string | number) => {
    await deleteMessage(id)
            .then((res) => {
              console.log(res);
              if (res.status === 204) {
                Swal.fire({
                  position: "center",
                  icon: "success",
                  title: `Le message a bien été marqué comme lu`,
                  showConfirmButton: false,
                  timer: 1500,
                });
                setRefresh(!refresh);
              } else {
                Swal.fire({
                  position: "center",
                  icon: "error",
                  title: `Erreur lors de la suppression du message`,
                  showConfirmButton: false,
                  timer: 1500,
                });
              }
            })
            .catch((e) => {
              Swal.fire({
                position: "center",
                icon: "error",
                title: `Erreur lors de la suppression du message`,
                showConfirmButton: false,
                timer: 1500,
              });
            });
  };
  useEffect(() => {
      const fetchData = async () => {
        try {
          const data = await fetchMessages();
          setMessages(data);
          console.log("Fetched messages", data);
        } catch (error) {
          console.error("Failed to fetch messages", error);
        }
      };
      fetchData();
    }, [refresh]);

  const handleChangePage = (event: React.ChangeEvent<unknown>, newPage: number) => {
    setCurrentPage(newPage);
  };

  const paginatedMessages = messages.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const pageCount = Math.ceil(messages.length / ITEMS_PER_PAGE);

  return (
    <Box sx={{ mb: 3, width: '100%' }}>
      <Typography variant="h5" gutterBottom sx={{ mb: 2 }}>
        Messages des Utilisateurs
      </Typography>
      <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: '100%' }}>
        {messages.length === 0 ? (
          <Typography variant="body1">Aucun message pour le moment.</Typography>
        ) : (
          <List sx={{ flexGrow: 1, overflow: "auto", minHeight: 300 /* Adjust as needed */ }}>
            {paginatedMessages.map((msg, index) => (
              <React.Fragment key={msg.id}>
                <ListItem 
                  alignItems="flex-start"
                  secondaryAction={
                    <IconButton edge="end" aria-label={ "Marquer comme lu"} onClick={() => handleMarkAsRead(msg.id)}>
                       <CheckCircleOutlineIcon />
                    </IconButton>
                  }
                >
                  <ListItemText
                    primary={<Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>{msg.titre}</Typography>}
                    secondary={
                      <React.Fragment>
                        <Typography
                          sx={{ display: "inline" }}
                          component="span"
                          variant="body2"
                          color="text.primary"
                        >
                          Utilisateur: {msg.idUser} - 
                        </Typography>
                        {msg.message}
                      </React.Fragment>
                    }
                  />
                </ListItem>
                {index < paginatedMessages.length - 1 && <Divider variant="inset" component="li" />}
              </React.Fragment>
            ))}
          </List>
        )}
        {pageCount > 1 && (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2, pt: 1, borderTop: '1px solid rgba(0, 0, 0, 0.12)' }}>
            <Pagination
              count={pageCount}
              page={currentPage}
              onChange={handleChangePage}
              color="primary"
            />
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default UserMessagesSection;

