import * as React from 'react';
import Stack from '@mui/material/Stack';
import CustomDatePicker from './CustomDatePicker';
import NavbarBreadcrumbs from './NavbarBreadcrumbs';
import ColorModeIconDropdown from '../../shared-theme/ColorModeIconDropdown';
import Search from './Search';

const headerStyles = {
  display: { xs: 'none', md: 'flex' },
  width: '100%',
  alignItems: { xs: 'flex-start', md: 'center' },
  justifyContent: 'space-between',
  maxWidth: { sm: '100%', md: '1700px' },
  pt: 1.5,
};

const innerStackStyles = {
  gap: 1,
};

export default function Header() {
  return (
    <Stack direction="row" sx={headerStyles} spacing={2}>
      <NavbarBreadcrumbs />
      <Stack direction="row" sx={innerStackStyles}>
        <Search />
        <CustomDatePicker />
        <ColorModeIconDropdown />
      </Stack>
    </Stack>
  );
}

