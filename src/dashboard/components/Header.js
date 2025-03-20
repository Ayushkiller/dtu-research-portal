import * as React from 'react';
import Stack from '@mui/material/Stack';
import ColorModeIconDropdown from '../../shared-theme/ColorModeIconDropdown';

export default function Header() {
  return (
      <Stack direction="row" sx={{ justifyContent: 'flex-end' }}>
        <ColorModeIconDropdown />
      </Stack>
  );
}

