import * as React from 'react';
import Grid from '@mui/material/Grid2';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
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

  // Determine current view title
  const getCurrentViewTitle = () => {
    if (showDeveloperInfo) return "Developer's Information";
    if (showSubmissions) return "My Research Submissions";
    if (showEligibility) return "Eligibility and Awards";
    if (showForm) return "Submit Research Paper";
    if (showFeedback) return "Provide Feedback";
    return "Research Portal Dashboard";
  };

  // Render the appropriate content based on state
  const renderContent = () => {
    if (showDeveloperInfo) return <DeveloperInfo />;
    if (showSubmissions) return <MySubmissions />;
    if (showEligibility) return <EligibilityContent />;
    if (showForm) return <ResearchPaperSubmissionForm onSubmit={handleFormSubmit} />;
    if (showFeedback) return <FeedbackForm />;
    
    // Home view
    return (
      <Grid container spacing={3} sx={{ mb: 4, justifyContent: 'center' }}>
        <Grid item xs={12} md={10} lg={8}>
          <SubmissionButton onShowForm={handleShowForm} />
        </Grid>
      </Grid>
    );
  };

  return (
    <Box 
      sx={{ 
        flexGrow: 1,
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        height: '100%',
        overflow: 'hidden' // Prevent outer scrollbar
      }}
    >
      {/* Main content area */}
      <Box
        sx={{ 
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          overflow: 'auto', // Only this container should scroll
          p: 2
        }}
      >
        {/* Header - Removed Paper wrapper */}
        <Typography variant="h5" component="h1" gutterBottom sx={{ px: 1, pt: 1 }}>
          {getCurrentViewTitle()}
        </Typography>
        
        {/* Content wrapper */}
        <Paper 
          elevation={2} 
          sx={{ 
            p: { xs: 2, md: 3 }, 
            flexGrow: 1,
            display: 'flex',
            flexDirection: 'column',
            mb: 2
          }}
        >
          {renderContent()}
        </Paper>
      </Box>
      
      {/* Footer */}
      <Box 
        component="footer" 
        sx={{ 
          py: 2, 
          px: 2, 
          backgroundColor: (theme) => theme.palette.mode === 'dark' 
            ? theme.palette.background.paper 
            : theme.palette.grey[50],
          borderTop: (theme) => `1px solid ${theme.palette.divider}`
        }}
      >
        <Copyright sx={{ color: 'text.primary' }} />
      </Box>
    </Box>
  );
}
