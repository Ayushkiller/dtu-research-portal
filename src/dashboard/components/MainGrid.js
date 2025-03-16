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
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
      }}
    >
      { showDeveloperInfo ? (
        <Box sx={{ width: '100%', maxWidth: '1000px' }}>
          <DeveloperInfo />
        </Box>
      ) : showSubmissions ? (
        <Box sx={{ width: '100%', maxWidth: '1000px' }}>
          <MySubmissions />
        </Box>
      ) : showEligibility ? (
        <Box sx={{ width: '100%', maxWidth: '1000px' }}>
          <EligibilityContent />
        </Box>
      ) : showForm ? (
        <Box sx={{ width: '100%', maxWidth: '1000px', my: 2 }}>
          <ResearchPaperSubmissionForm onSubmit={handleFormSubmit} />
        </Box>
      ) : showFeedback ? (
        <Box sx={{ width: '100%', maxWidth: '800px' }}>
          <FeedbackForm />
        </Box>
      ) : (
        <Box sx={{ width: '100%' }}>
          <Grid container spacing={3} columns={12} sx={{ mb: 4, justifyContent: 'center' }}>
            <Grid item xs={12} md={10} lg={8}>
              <SubmissionButton onShowForm={handleShowForm} />
            </Grid>
          </Grid>
        </Box>
      )}
    </Box>
  );
}
