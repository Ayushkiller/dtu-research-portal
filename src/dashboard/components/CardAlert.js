import * as React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import AutoAwesomeRoundedIcon from "@mui/icons-material/AutoAwesomeRounded";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";

export default function CardAlert() {
  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <Card variant="outlined" sx={{ m: 1.5, p: 1.5 }}>
      <CardContent>
        <AutoAwesomeRoundedIcon fontSize="small" />
        <Typography gutterBottom sx={{ fontWeight: 600 }}>
          Next Meeting
        </Typography>
        <Typography variant="body2" sx={{ mb: 2, color: "text.secondary" }}>
          2025-01-20 10:00 AM
        </Typography>
        <Button variant="contained" size="small" fullWidth onClick={handleClickOpen}>
          Learn More
        </Button>
      </CardContent>
      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>Next Meeting</DialogTitle>
        <DialogContent>
          <DialogContentText>
            Your next meeting is scheduled for 2025-01-20 at 10:00 AM.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Close</Button>
        </DialogActions>
      </Dialog>
    </Card>
  );
}