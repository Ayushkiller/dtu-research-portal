import * as React from 'react';
import MuiAvatar from '@mui/material/Avatar';
import MuiListItemAvatar from '@mui/material/ListItemAvatar';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListSubheader from '@mui/material/ListSubheader';
import Select, { selectClasses } from '@mui/material/Select';
import Divider from '@mui/material/Divider';
import { styled } from '@mui/material/styles';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import ArticleRoundedIcon from '@mui/icons-material/ArticleRounded';
import ScienceRoundedIcon from '@mui/icons-material/ScienceRounded';
import SchoolRoundedIcon from '@mui/icons-material/SchoolRounded';

const Avatar = styled(MuiAvatar)(({ theme }) => ({
  width: 28,
  height: 28,
  backgroundColor: (theme.vars || theme).palette.background.paper,
  color: (theme.vars || theme).palette.text.secondary,
  border: `1px solid ${(theme.vars || theme).palette.divider}`,
}));

const ListItemAvatar = styled(MuiListItemAvatar)({
  minWidth: 0,
  marginRight: 12,
});

export default function SelectResearchContent() {
  const [researchItem, setResearchItem] = React.useState('');

  const handleChange = (event) => {
    setResearchItem(event.target.value);
  };

  return (
    <Select
      labelId="research-select"
      id="research-simple-select"
      value={researchItem}
      onChange={handleChange}
      displayEmpty
      inputProps={{ 'aria-label': 'Select research item' }}
      fullWidth
      sx={{
        maxHeight: 56,
        width: 250,
        '&.MuiList-root': {
          p: '8px',
        },
        [`& .${selectClasses.select}`]: {
          display: 'flex',
          alignItems: 'center',
          gap: '2px',
          pl: 1,
        },
      }}
    >
      <ListSubheader sx={{ pt: 0 }}>Research Activities</ListSubheader>
      <MenuItem value="">
        <ListItemAvatar>
          <Avatar alt="Research Papers">
            <ArticleRoundedIcon sx={{ fontSize: '1rem' }} />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="Research Papers" secondary="Published works" />
      </MenuItem>
      <MenuItem value={10}>
        <ListItemAvatar>
          <Avatar alt="Research Projects">
            <ScienceRoundedIcon sx={{ fontSize: '1rem' }} />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="Research Projects" secondary="Ongoing or completed" />
      </MenuItem>
      <MenuItem value={20}>
        <ListItemAvatar>
          <Avatar alt="Conferences">
            <SchoolRoundedIcon sx={{ fontSize: '1rem' }} />
          </Avatar>
        </ListItemAvatar>
        <ListItemText primary="Conferences" secondary="Attended or organized" />
      </MenuItem>
      <ListSubheader>Actions</ListSubheader>
      <Divider sx={{ mx: -1 }} />
      <MenuItem value={30}>
        <ListItemIcon>
          <AddRoundedIcon />
        </ListItemIcon>
        <ListItemText primary="Add New Item" secondary="Add a research activity" />
      </MenuItem>
    </Select>
  );
}
