import * as React from 'react';
import Stack from '@mui/material/Stack';
import ColorModeIconDropdown from '../../shared-theme/ColorModeIconDropdown';

const innerStackStyles = {
  gap: 10,
};

export default function Header() {
  return (
      <Stack direction="row" sx={innerStackStyles}>
        <ColorModeIconDropdown />
      </Stack>
  );
}

