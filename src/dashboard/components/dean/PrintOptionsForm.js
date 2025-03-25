import React from 'react';
import {
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Box,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Radio,
  RadioGroup,
  Grid,
} from "@mui/material";
import ArticleIcon from "@mui/icons-material/Article";
import PersonIcon from "@mui/icons-material/Person";

export const PrintOptionsForm = ({ printOptions, handleOptionChange, uniqueUsers, uniqueDepartments, uniqueYears }) => {
  return (
    <Grid container spacing={3}>
      <Grid item xs={12} sm={6}>
        <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <ArticleIcon sx={{ mr: 1, fontSize: 20, color: 'primary.main' }} />
          Content Options
        </Typography>
        <FormGroup>
          <FormControlLabel
            control={
              <Checkbox 
                checked={printOptions.showShareAmount}
                onChange={handleOptionChange}
                name="showShareAmount"
              />
            }
            label="Include Author Share Amounts"
          />
          <Typography variant="caption" color="text.secondary" sx={{ ml: 4, mb: 1 }}>
            Will show each author's share amount and percentage
          </Typography>
          
          <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>Details to Include:</Typography>
          <Box sx={{ ml: 2 }}>
            <FormControlLabel
              control={
                <Checkbox 
                  checked={printOptions.paperDetailsToInclude.title}
                  onChange={handleOptionChange}
                  name="paperDetailsToInclude.title"
                />
              }
              label="Paper Title"
            />
            <FormControlLabel
              control={
                <Checkbox 
                  checked={printOptions.paperDetailsToInclude.applicant}
                  onChange={handleOptionChange}
                  name="paperDetailsToInclude.applicant"
                />
              }
              label="Applicant Name"
            />
            <FormControlLabel
              control={
                <Checkbox 
                  checked={printOptions.paperDetailsToInclude.department}
                  onChange={handleOptionChange}
                  name="paperDetailsToInclude.department"
                />
              }
              label="Department"
            />
            <FormControlLabel
              control={
                <Checkbox 
                  checked={printOptions.paperDetailsToInclude.year}
                  onChange={handleOptionChange}
                  name="paperDetailsToInclude.year"
                />
              }
              label="Publication Year"
            />
            <FormControlLabel
              control={
                <Checkbox 
                  checked={printOptions.paperDetailsToInclude.status}
                  onChange={handleOptionChange}
                  name="paperDetailsToInclude.status"
                />
              }
              label="Status"
            />
          </Box>
        </FormGroup>
      </Grid>
      
      <Grid item xs={12} sm={6}>
        <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
          <PersonIcon sx={{ mr: 1, fontSize: 20, color: 'primary.main' }} />
          Filter Options
        </Typography>
        
        <FormControlLabel
          control={
            <Checkbox 
              checked={printOptions.filterByUser}
              onChange={handleOptionChange}
              name="filterByUser"
            />
          }
          label="Filter by User"
        />
        {printOptions.filterByUser && (
          <FormControl fullWidth sx={{ mt: 1, mb: 2 }}>
            <InputLabel id="user-select-label">Select User</InputLabel>
            <Select
              labelId="user-select-label"
              value={printOptions.userId}
              label="Select User"
              onChange={(e) => handleOptionChange({ target: { name: 'userId', value: e.target.value } })}
              size="small"
            >
              {uniqueUsers.map(user => (
                <MenuItem key={user} value={user}>{user}</MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        
        <FormControlLabel
          control={
            <Checkbox 
              checked={printOptions.filterByStatus}
              onChange={handleOptionChange}
              name="filterByStatus"
            />
          }
          label="Filter by Status"
        />
        {printOptions.filterByStatus && (
          <FormControl component="fieldset" sx={{ ml: 4, mb: 2 }}>
            <RadioGroup
              name="status"
              value={printOptions.status}
              onChange={handleOptionChange}
            >
              <FormControlLabel value="all" control={<Radio size="small" />} label="All" />
              <FormControlLabel value="approved" control={<Radio size="small" />} label="Approved" />
              <FormControlLabel value="pending" control={<Radio size="small" />} label="Pending" />
              <FormControlLabel value="rejected" control={<Radio size="small" />} label="Rejected" />
            </RadioGroup>
          </FormControl>
        )}
        
        <FormControlLabel
          control={
            <Checkbox 
              checked={printOptions.filterByYear}
              onChange={handleOptionChange}
              name="filterByYear"
            />
          }
          label="Filter by Year"
        />
        {printOptions.filterByYear && (
          <FormControl fullWidth sx={{ mt: 1, mb: 2 }}>
            <InputLabel id="year-select-label">Select Year</InputLabel>
            <Select
              labelId="year-select-label"
              value={printOptions.year}
              label="Select Year"
              onChange={(e) => handleOptionChange({ target: { name: 'year', value: e.target.value } })}
              size="small"
            >
              {uniqueYears.map(year => (
                <MenuItem key={year} value={year}>{year}</MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
        
        <FormControlLabel
          control={
            <Checkbox 
              checked={printOptions.filterByDepartment}
              onChange={handleOptionChange}
              name="filterByDepartment"
            />
          }
          label="Filter by Department"
        />
        {printOptions.filterByDepartment && (
          <FormControl fullWidth sx={{ mt: 1, mb: 2 }}>
            <InputLabel id="dept-select-label">Select Department</InputLabel>
            <Select
              labelId="dept-select-label"
              value={printOptions.department}
              label="Select Department"
              onChange={(e) => handleOptionChange({ target: { name: 'department', value: e.target.value } })}
              size="small"
            >
              {uniqueDepartments.map(dept => (
                <MenuItem key={dept} value={dept}>{dept}</MenuItem>
              ))}
            </Select>
          </FormControl>
        )}
      </Grid>
    </Grid>
  );
};
