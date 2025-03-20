import React from 'react';
import { 
  Paper, 
  Box, 
  Typography, 
  Divider, 
  Container,
  Card,
  CardContent,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Chip,
  useTheme,
  useMediaQuery
} from '@mui/material';
import {
  EmojiEvents as AwardIcon,
  School as EligibilityIcon,
  MonetizationOn as RewardIcon,
  Gavel as GuidelinesIcon,
  AccountBalance as InstitutionIcon
} from '@mui/icons-material';

export default function EligibilityContent() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  
  const CategoryCard = ({ title, icon, children, chipColor }) => (
    <Card 
      elevation={3} 
      sx={{ 
        mb: 4, 
        borderTop: `4px solid ${theme.palette[chipColor].main}`,
        transition: 'transform 0.2s ease-in-out, box-shadow 0.2s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: 6
        }
      }}
    >
      <CardContent sx={{ p: { xs: 2, md: 3 } }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Box sx={{ 
            mr: 2, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            bgcolor: `${chipColor}.light`,
            color: `${chipColor}.dark`,
            borderRadius: '50%',
            p: 1
          }}>
            {icon}
          </Box>
          <Typography variant="h5" component="h2" sx={{ fontWeight: 600 }}>
            {title}
          </Typography>
        </Box>
        <Divider sx={{ mb: 2 }} />
        {children}
      </CardContent>
    </Card>
  );

  const AwardCategoryCard = ({ title, amount, criteria, publishers, impactFactor }) => (
    <Card 
      variant="outlined" 
      sx={{ 
        mb: 3,
        p: 2,
        borderLeft: `4px solid ${theme.palette.primary.main}`,
        bgcolor: 'background.paper'
      }}
    >
      <Typography variant="h6" component="h3" sx={{ mb: 1, fontWeight: 500 }}>
        {title}
      </Typography>
      <Chip 
        label={`₹${amount}`} 
        color="primary" 
        sx={{ mb: 2, fontWeight: 'bold' }} 
      />
      <Typography variant="body2" sx={{ mb: 1, fontStyle: 'italic' }}>
        <strong>Selection Criteria:</strong> {criteria}
      </Typography>
      {impactFactor && (
        <Chip 
          size="small" 
          label={`Impact Factor: ${impactFactor}`} 
          color="secondary" 
          variant="outlined" 
          sx={{ mb: 2, mr: 1 }} 
        />
      )}
      {publishers && publishers.length > 0 && (
        <>
          <Typography variant="body2" sx={{ fontWeight: 500, mt: 1 }}>
            Published in:
          </Typography>
          <List dense sx={{ pl: 2 }}>
            {publishers.map((publisher, index) => (
              <ListItem key={index} sx={{ py: 0.5 }}>
                <ListItemText primary={publisher} />
              </ListItem>
            ))}
          </List>
        </>
      )}
    </Card>
  );

  return (

        <Paper 
          elevation={isMobile ? 1 : 3}
          sx={{ 
            p: { xs: 2, sm: 3, md: 4 },
            borderRadius: 2,
          }}
        >
          <Typography 
            variant="h4" 
            component="h1" 
            sx={{ 
              mb: 2, 
              color: 'primary.main', 
              fontWeight: 'bold',
              borderBottom: `2px solid ${theme.palette.primary.main}`,
              pb: 1 
            }}
          >
            Research Awards & Eligibility Criteria
          </Typography>
          
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            Delhi Technological University recognizes outstanding research contributions through various award categories.
            Below you'll find detailed information about eligibility requirements and award structures.
          </Typography>
          
          <Grid container spacing={4}>
            <Grid item xs={12} md={6}>
              <CategoryCard title="Eligibility Requirements" icon={<EligibilityIcon />} chipColor="primary">
                <List>
                  <ListItem sx={{ pl: 0 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'primary.main' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={<span><strong>First Author/Corresponding Author:</strong> Only the first author or corresponding author of a publication is eligible to apply for the award.</span>} 
                    />
                  </ListItem>
                  <ListItem sx={{ pl: 0 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'primary.main' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={<span><strong>SCI/SSCI/SCI Expanded:</strong> Publications must be listed in the Science Citation Index (SCI), Social Science Citation Index (SSCI), or SCI expanded.</span>} 
                    />
                  </ListItem>
                  <ListItem sx={{ pl: 0 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'primary.main' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={<span><strong>Publication Period:</strong> Papers must be published within the specified year (January 1st to December 31st) and have a Digital Object Identifier (DOI), pagination, and year of publication.</span>} 
                    />
                  </ListItem>
                  <ListItem sx={{ pl: 0 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'primary.main' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={<span><strong>No Publication Fee:</strong> Papers published in journals that require a publication fee (article processing charges or open access charges) are not eligible for cash awards.</span>} 
                    />
                  </ListItem>
                  <ListItem sx={{ pl: 0 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'primary.main' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={<span><strong>Author Contribution:</strong> All authors must have made significant intellectual contributions to the paper; those with no contribution disqualify the paper.</span>} 
                    />
                  </ListItem>
                </List>
              </CategoryCard>
              
              <CategoryCard title="Author Definitions" icon={<InstitutionIcon />} chipColor="info">
                <List>
                  <ListItem sx={{ pl: 0 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'info.main' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={<span><strong>University:</strong> Delhi Technological University (DTU), Delhi.</span>} 
                    />
                  </ListItem>
                  <ListItem sx={{ pl: 0 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'info.main' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={<span><strong>Faculty Member:</strong> An individual who is a regular faculty member of the University.</span>} 
                    />
                  </ListItem>
                  <ListItem sx={{ pl: 0 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'info.main' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={<span><strong>University Student:</strong> An individual who is registered for any degree in DTU.</span>} 
                    />
                  </ListItem>
                  <ListItem sx={{ pl: 0 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'info.main' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={<span><strong>First Author:</strong> Faculty member or student whose name appears first in the list of authors.</span>} 
                    />
                  </ListItem>
                  <ListItem sx={{ pl: 0 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'info.main' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary={<span><strong>Corresponding Author:</strong> Faculty member or student whose name appears first in the list of corresponding authors.</span>} 
                    />
                  </ListItem>
                </List>
              </CategoryCard>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <CategoryCard title="Award Categories" icon={<AwardIcon />} chipColor="success">
                <AwardCategoryCard 
                  title="Outstanding Research Awards" 
                  amount="5,00,000" 
                  criteria="SCI/SSCI/SCI expanded journal paper with an impact factor of at least two"
                  impactFactor="≥ 2.0"
                  publishers={["Nature", "Science", "Harvard Business Review"]}
                />
                
                <AwardCategoryCard 
                  title="Premier Research Awards" 
                  amount="1,00,000" 
                  criteria="SCI/SSCI/SCI expanded journal paper with specific impact factor requirements"
                  impactFactor="≥ 3.0 (IEEE) or ≥ 1.0 (others)"
                  publishers={["Proceedings of the Royal Society", "IEEE Transactions (IF ≥ 3.0)", "ACM Transactions", "American Mathematical Society", "And more..."]}
                />
                
                <AwardCategoryCard 
                  title="Commendable Research Awards" 
                  amount="50,000" 
                  criteria="SCI/SSCI/SCI expanded journal paper with an impact factor of at least one"
                  impactFactor="≥ 1.0"
                  publishers={["IEEE Journals", "Springer", "Elsevier", "Oxford University Press", "And more..."]}
                />
              </CategoryCard>
              
              <CategoryCard title="Prize Distribution Rules" icon={<GuidelinesIcon />} chipColor="warning">
                <List>
                  <ListItem sx={{ pl: 0 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'warning.main' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="All university authors: First author decides the contribution distribution" 
                    />
                  </ListItem>
                  <ListItem sx={{ pl: 0 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'warning.main' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="University faculty and students: Faculty member (first listed) decides the distribution" 
                    />
                  </ListItem>
                  <ListItem sx={{ pl: 0 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'warning.main' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="All university students: Department Head decides distribution in consultation with first author" 
                    />
                  </ListItem>
                  <ListItem sx={{ pl: 0 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'warning.main' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="External authors: Prize divided equally, external author portions subtracted" 
                    />
                  </ListItem>
                  <ListItem sx={{ pl: 0 }}>
                    <ListItemIcon sx={{ minWidth: 36 }}>
                      <Box sx={{ width: 6, height: 6, borderRadius: '50%', bgcolor: 'warning.main' }} />
                    </ListItemIcon>
                    <ListItemText 
                      primary="Limit: Maximum three papers per researcher in the Commendable category" 
                    />
                  </ListItem>
                </List>
                <Typography variant="body2" sx={{ mt: 2, fontStyle: 'italic' }}>
                  Note: The Vice Chancellor may make necessary provisions to remove any difficulties in implementing these guidelines.
                </Typography>
              </CategoryCard>
            </Grid>
          </Grid>
        </Paper>


  );
}