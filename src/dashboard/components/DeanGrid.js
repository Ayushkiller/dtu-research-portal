import * as React from 'react';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Copyright from '../internals/components/Copyright';
import ChartUserByDepartment from './ChartUserByDepartment';
import CustomizedDataGrid from './CustomizedDataGrid';
import SubmissionButton from './SubmissionButton';
import ResearchPaperSubmissionForm from './components/ResearchPaperSubmissionForm';

export default function DeanGrid() {
  const [showForm, setShowForm] = React.useState(false);

  const handleFormSubmit = (formData) => {
    // Handle form submission logic here
    console.log('Form submitted:', formData);
    setShowForm(false);
  };

  const handleShowForm = () => {
    setShowForm(true);
  };

  return (
    <Box sx={{ flexGrow: 1 }}>
      {showForm ? (
        <ResearchPaperSubmissionForm onSubmit={handleFormSubmit} />
      ) : (
        <>
          <Grid container spacing={2} columns={12} sx={{ mb: (theme) => theme.spacing(2) }}>
            <Grid item xs={12} md={6}>
              <SubmissionButton onShowForm={handleShowForm} />
            </Grid>
            <Grid item xs={12} md={6}>
              <ChartUserByDepartment />
            </Grid>
          </Grid>
          <Typography component="h2" variant="h6" sx={{ mb: 2 }}>
            Details
          </Typography>
          <Grid container spacing={2} columns={12}>
            <Grid item xs={12} lg={9}>
              <CustomizedDataGrid />
            </Grid>
            <Grid item xs={12} lg={3}>
              <Stack gap={2} direction={{ xs: 'column', sm: 'row', lg: 'column' }}>
                {/* Add any additional components here */}
              </Stack>
            </Grid>
          </Grid>
          <Copyright sx={{ my: 4 }} />
        </>
      )}
    </Box>
  );
}
