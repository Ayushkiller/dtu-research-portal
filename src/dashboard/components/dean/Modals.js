import React from "react";
import {
  Box,
  Typography,
  Grid,
  List,
  ListItem,
  IconButton,
  Button,
  Modal,
  Paper,
  Divider,
  FormControl,
  FormLabel,
  TextField,
  Select,
  MenuItem,
  Dialog,
  Chip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import ArticleIcon from "@mui/icons-material/Article";

export const PaperDetailsModal = ({
  openPaperModal,
  handleClosePaperModal,
  selectedPaper,
  handleUpdateStatus,
}) => {
  return (
    <Modal 
      open={openPaperModal} 
      onClose={handleClosePaperModal}
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <Paper
        sx={{
          p: { xs: 2, sm: 3, md: 4 },
          maxWidth: { xs: '95vw', sm: '90vw', md: '85vw', lg: '80vw' },
          width: '95%',
          maxHeight: '90vh',
          height: 'auto',
          borderRadius: 2,
          overflow: 'auto',
          m: 0, // Remove margins
          position: 'relative',
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
          }}
        >
          <Typography variant="h5" component="h2">
            Paper Details
          </Typography>
          <IconButton onClick={handleClosePaperModal} size="small">
            <CloseIcon />
          </IconButton>
        </Box>
        <Divider sx={{ mb: 3 }} />

        {selectedPaper && (
          <>
            <Box sx={{ mb: 3 }}>
              <Typography
                variant="subtitle1"
                fontWeight="bold"
                sx={{ mb: 0.5, color: "#1976d2" }}
              >
                Paper Title
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {selectedPaper.paperTitle}
              </Typography>

              <Typography
                variant="subtitle1"
                fontWeight="bold"
                sx={{ mb: 0.5, color: "#1976d2" }}
              >
                Applicant Name
              </Typography>
              <Typography variant="body1" sx={{ mb: 2 }}>
                {selectedPaper.applicantName}
              </Typography>

              <Grid container spacing={2} sx={{ mb: 2 }}>
                <Grid item xs={6}>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    sx={{ mb: 0.5, color: "#1976d2" }}
                  >
                    Department
                  </Typography>
                  <Typography variant="body1">
                    {selectedPaper.department}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography
                    variant="subtitle1"
                    fontWeight="bold"
                    sx={{ mb: 0.5, color: "#1976d2" }}
                  >
                    Publication Year
                  </Typography>
                  <Typography variant="body1">
                    {selectedPaper.pubYear}
                  </Typography>
                </Grid>
              </Grid>
            </Box>

            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2, mt: 4 }}>
              <ArticleIcon sx={{ color: (theme) => theme.palette.primary.main, mr: 1 }} />
              <Typography variant="h6" fontWeight="600" color="primary.main">
                Research Details
              </Typography>
            </Box>
            <Divider sx={{ mb: 3 }} />

            <Box sx={{ mb: 3 }}>
              {selectedPaper.researchPaperData.map((data, index) => (
                <Paper 
                  key={index} 
                  elevation={0}
                  sx={{ 
                    mb: 2.5, 
                    p: 2.5, 
                    bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.05)' : '#f8f9fa', 
                    borderRadius: 2,
                    border: '1px solid',
                    borderColor: (theme) => theme.palette.divider,
                    transition: 'all 0.2s ease',
                    '&:hover': {
                      bgcolor: (theme) => theme.palette.mode === 'dark' 
                        ? 'rgba(25, 118, 210, 0.08)'
                        : '#f0f7ff',
                      boxShadow: (theme) => `0 4px 8px ${theme.palette.mode === 'dark' 
                        ? 'rgba(0,0,0,0.2)'
                        : 'rgba(0,0,0,0.05)'}`
                    }
                  }}
                >
                  <Box sx={{ display: 'flex', mb: 1.5, alignItems: 'flex-start' }}>
                  </Box>
                  <Typography 
                    variant="body1" 
                    sx={{ 
                      ml: 4.5, 
                      padding: '10px 15px',
                      bgcolor: (theme) => theme.palette.mode === 'dark' ? 'rgba(255, 255, 255, 0.03)' : 'white',
                      borderRadius: 1,
                      border: '1px solid',
                      borderColor: (theme) => theme.palette.divider
                    }}
                  >
                    {data.answer}
                  </Typography>
                </Paper>
              ))}
            </Box>

            <Box
              sx={{
                mt: 4,
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
              }}
            >
              <Button variant="outlined" onClick={handleClosePaperModal}>
                Cancel
              </Button>
              <Button
                variant="contained"
                color="success"
                onClick={() => handleUpdateStatus("approved")}
              >
                Approve
              </Button>
              <Button
                variant="contained"
                color="error"
                onClick={() => handleUpdateStatus("rejected")}
              >
                Reject
              </Button>
            </Box>
          </>
        )}
      </Paper>
    </Modal>
  );
};
