import React, { useState } from "react";
import {
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Chip,
  Box,
  OutlinedInput,
  Checkbox,
  ListItemText
} from "@mui/material";
import axios from "axios";

// Rules dropdown menu component
export const CommitteeRulesDropdown = ({ user, setUsersData }) => {
  // Available rules
  const availableRules = [
    "canReviewPaper",
    "canRejectPaper",
    "canApprovePaper",
    "canAssignReviewers",
    "canViewAllSubmissions",
    "canProvideFeedback",
    "canRequestRevisions"
  ];

  // State for handling the select
  const [selectedRules, setSelectedRules] = useState(user.rules || []);

  // Only show for committee members
  if (user.userType !== "committeeMember") {
    return <div>Not applicable</div>;
  }

  // Handle change in rule selection
  const handleRuleChange = async (event) => {
    const newRules = event.target.value;
    setSelectedRules(newRules);
    
    try {
      // API call to update user rules
      const response = await axios.put(`/api/users/${user._id}/rules`, {
        rules: newRules
      });
      
      // Update the users data in the parent component
      setUsersData(prevUsers => 
        prevUsers.map(u => 
          u._id === user._id ? { ...u, rules: newRules } : u
        )
      );
    } catch (error) {
      console.error("Failed to update user rules:", error);
      // Reset selected rules if there was an error
      setSelectedRules(user.rules || []);
    }
  };

  return (
    <FormControl sx={{ width: '100%' }}>
      <InputLabel id={`rules-label-${user._id}`}>Permissions</InputLabel>
      <Select
        labelId={`rules-label-${user._id}`}
        id={`rules-select-${user._id}`}
        multiple
        value={selectedRules}
        onChange={handleRuleChange}
        input={<OutlinedInput label="Permissions" />}
        renderValue={(selected) => (
          <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
            {selected.map((value) => (
              <Chip key={value} label={value.replace(/can|Paper/g, '')} />
            ))}
          </Box>
        )}
        MenuProps={{
          PaperProps: {
            style: {
              maxHeight: 224,
              width: 250,
            },
          },
        }}
      >
        {availableRules.map((rule) => (
          <MenuItem key={rule} value={rule}>
            <Checkbox checked={selectedRules.indexOf(rule) > -1} />
            <ListItemText 
              primary={rule.replace(/can/, '')} 
              secondary={rule.includes('Paper') ? 'Paper Management' : 'General Permission'}
            />
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};