import * as React from 'react';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import Copyright from '../internals/components/Copyright';
import SubmissionButton from './SubmissionButton';
import ResearchPaperSubmissionForm from './components/ResearchPaperSubmissionForm';
import EligibilityContent from './EligibilityContent';
import MySubmissions from './MySubmissions';
import FeedbackForm from './FeedbackForm';
import DeveloperInfo from './DeveloperInfo';

export default function MainGrid() {
  const [showForm, setShowForm] = React.useState(false);
  const [showEligibility, setShowEligibility] = React.useState(false);
  const [showSubmissions, setShowSubmissions] = React.useState(false);
  const [showFeedback, setShowFeedback] = React.useState(false);
  const [showDeveloperInfo, setShowDeveloperInfo] = React.useState(false);

  // Listen for menu click events
  React.useEffect(() => {
    const handleMenuClick = (event) => {
      if (event.detail === "Developer's Info") {
        setShowDeveloperInfo(true);
        setShowFeedback(false);
        setShowEligibility(false);
        setShowForm(false);
        setShowSubmissions(false);
      } else if (event.detail === 'Feedback') {
        setShowDeveloperInfo(false);
        setShowFeedback(true);
        setShowEligibility(false);
        setShowForm(false);
        setShowSubmissions(false);
      } else if (event.detail === 'Eligibility and Awards') {
        setShowDeveloperInfo(false);
        setShowFeedback(false);
        setShowEligibility(true);
        setShowForm(false);
        setShowSubmissions(false);
      } else if (event.detail === 'Home') {
        // Reset to home view
        setShowDeveloperInfo(false);
        setShowFeedback(false);
        setShowEligibility(false);
        setShowForm(false);
        setShowSubmissions(false);
      } else if (event.detail === 'My Submissions') {
        setShowDeveloperInfo(false);
        setShowFeedback(false);
        setShowEligibility(false);
        setShowForm(false);
        setShowSubmissions(true);
      }
    };
    window.addEventListener('menuClick', handleMenuClick);
    return () => window.removeEventListener('menuClick', handleMenuClick);
  }, []);

  const handleFormSubmit = (formData) => {
    console.log('Form submitted:', formData);
    setShowForm(false);
  };

  const handleShowForm = () => {
    setShowForm(true);
    setShowEligibility(false);
  };

  return (
    <Box 
      sx={{ 
        flexGrow: 1,
        width: '100%',
        height: '100%',
        m: 0,
        p: 0
      }}
    >

      { showDeveloperInfo ? (
        <DeveloperInfo />
      ) : showSubmissions ? (
        <MySubmissions />
      ) : showEligibility ? (
        <Box sx={{ width: '100%', height: '100%', m: 0, p: 0 }}>
          <EligibilityContent />
        </Box>
      ) : showForm ? (
        <Box sx={{ mt: 2, mb: 4 }}>
          <ResearchPaperSubmissionForm onSubmit={handleFormSubmit} />
        </Box>
      ) : showFeedback ? (
        <FeedbackForm />
      ) : (
        <>
          <Grid container spacing={3} columns={12} sx={{ mb: 4 }}>
            <Grid item xs={12} md={8} lg={6}>
              <SubmissionButton onShowForm={handleShowForm} />
            </Grid>
          </Grid>
          <Typography 
            component="h2" 
            variant="h5" 
            sx={{ 
              mb: 3,
              fontWeight: 'medium',
              color: 'primary.main' 
            }}
          >
          </Typography>
          <Grid container spacing={2} columns={12}>
            <Grid item xs={12} lg={9}>
            </Grid>
            <Grid item xs={12} lg={3}>
              <Stack gap={2} direction={{ xs: 'column', sm: 'row', lg: 'column' }}>
                {/* Add any additional components here */}
              </Stack>
            </Grid>
          </Grid>
          <Copyright sx={{ mt: 6, mb: 4 }} />
        </>
      )}
    </Box>
  );
}
