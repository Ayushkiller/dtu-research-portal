import * as React from 'react';
import { styled, alpha } from '@mui/material/styles';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import MuiToolbar from '@mui/material/Toolbar';
import { tabsClasses } from '@mui/material/Tabs';
import Typography from '@mui/material/Typography';
import MenuRoundedIcon from '@mui/icons-material/MenuRounded';
import DashboardRoundedIcon from '@mui/icons-material/DashboardRounded';
import IconButton from '@mui/material/IconButton';
import Tooltip from '@mui/material/Tooltip';
import Badge from '@mui/material/Badge';
import NotificationsIcon from '@mui/icons-material/NotificationsOutlined';
import SideMenuMobile from './SideMenuMobile';
import MenuButton from './MenuButton';
import ColorModeIconDropdown from '../../shared-theme/ColorModeIconDropdown';

// Restyled toolbar with more efficient spacing and layout
const Toolbar = styled(MuiToolbar)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(1, 2),
  display: 'flex',
  flexDirection: 'row', // Changed to row for better horizontal layout
  alignItems: 'center',
  justifyContent: 'space-between',
  flexShrink: 0,
  height: 64, // Fixed height for consistency
  [`& ${tabsClasses.flexContainer}`]: {
    gap: theme.spacing(1),
  },
}));

// Animated menu button with hover effect
const AnimatedMenuButton = styled(MenuButton)(({ theme }) => ({
  transition: 'all 0.2s ease-in-out',
  '&:hover': {
    backgroundColor: alpha(theme.palette.primary.main, 0.08),
    transform: 'scale(1.05)',
  },
}));

// Enhanced app icon with better visual appeal
const AppIcon = styled(Box)(({ theme }) => ({
  width: '2rem',
  height: '2rem',
  borderRadius: '10px',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  backgroundImage: `linear-gradient(135deg, ${theme.palette.primary.light} 0%, ${theme.palette.primary.dark} 100%)`,
  color: theme.palette.primary.contrastText,
  border: '1px solid',
  borderColor: theme.palette.primary.main,
  boxShadow: `
    inset 0 2px 4px ${alpha(theme.palette.common.white, 0.3)},
    0 2px 4px ${alpha(theme.palette.common.black, 0.1)}
  `,
  marginRight: theme.spacing(1.5),
}));

export default function AppNavbar() {
  const [open, setOpen] = React.useState(false);

  const toggleDrawer = (newOpen) => () => {
    setOpen(newOpen);
  };

  return (
    <AppBar
      position="fixed"
      elevation={0}
      sx={{
        display: { xs: 'auto', md: 'none' },
        boxShadow: (theme) => `0 1px 3px ${alpha(theme.palette.common.black, 0.1)}`,
        bgcolor: 'background.paper',
        backgroundImage: 'none',
        borderBottom: '1px solid',
        borderColor: 'divider',
        top: 'var(--template-frame-height, 0px)',
        zIndex: (theme) => theme.zIndex.appBar,
      }}
    >
      <Toolbar variant="regular">
        <Stack
          direction="row"
          spacing={1}
          sx={{ alignItems: 'center' }}
        >
          <CustomIcon />
          <Typography 
            variant="h6" 
            component="h1" 
            sx={{ 
              color: 'text.primary',
              fontWeight: 600,
              letterSpacing: '-0.01em',
            }}
          >
            Dashboard
          </Typography>
        </Stack>

        <Stack
          direction="row"
          spacing={1}
          sx={{ alignItems: 'center' }}
        >
          <Tooltip title="Notifications">
            <IconButton color="inherit" size="small" sx={{ ml: 1 }}>
              <Badge badgeContent={3} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>
          <ColorModeIconDropdown />
          <Tooltip title="Menu">
            <AnimatedMenuButton aria-label="menu" onClick={toggleDrawer(true)}>
              <MenuRoundedIcon />
            </AnimatedMenuButton>
          </Tooltip>
          <SideMenuMobile open={open} toggleDrawer={toggleDrawer} />
        </Stack>
      </Toolbar>
    </AppBar>
  );
}

export function CustomIcon() {
  return (
    <AppIcon>
      <DashboardRoundedIcon sx={{ fontSize: '1.2rem' }} />
    </AppIcon>
  );
}