import React from "react";
import {
  Typography,
  FormControlLabel,
  Checkbox,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  RadioGroup,
  Radio,
  Box,
  Slider,
  TextField,
  InputAdornment,
} from "@mui/material";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import SearchIcon from "@mui/icons-material/Search";

export const FilterOptions = ({
  printOptions,
  setPrintOptions,
  uniqueUsers,
  uniqueDepartments,
  uniqueYears,
  maxPossibleAward,
  maxPossibleAuthors,
}) => {
  const handleOptionChange = (event) => {
    const { name, checked, value } = event.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setPrintOptions((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: checked !== undefined ? checked : value,
        },
      }));
    } else {
      setPrintOptions((prev) => ({
        ...prev,
        [name]: checked !== undefined ? checked : value,
      }));
    }
  };

  const handleSliderChange = (name, newValue) => {
    setPrintOptions((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  return (
    <Box sx={{ width: "50%", padding: 3 }}>
      <Typography
        variant="subtitle1"
        gutterBottom
        sx={{ display: "flex", alignItems: "center" }}
      >
        <FilterAltIcon sx={{ mr: 1, fontSize: 20, color: "primary.main" }} />
        Filter Options
      </Typography>

      {/* User Filter */}
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
            onChange={(e) =>
              handleOptionChange({
                target: { name: "userId", value: e.target.value },
              })
            }
            size="small"
          >
            {uniqueUsers.map((user) => (
              <MenuItem key={user} value={user}>
                {user}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {/* Status Filter */}
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
            <FormControlLabel
              value="all"
              control={<Radio size="small" />}
              label="All"
            />
            <FormControlLabel
              value="approved"
              control={<Radio size="small" />}
              label="Approved"
            />
            <FormControlLabel
              value="pending"
              control={<Radio size="small" />}
              label="Pending"
            />
            <FormControlLabel
              value="rejected"
              control={<Radio size="small" />}
              label="Rejected"
            />
            <FormControlLabel
              value="underReview"
              control={<Radio size="small" />}
              label="Under Review"
            />
            <FormControlLabel
              value="suspended"
              control={<Radio size="small" />}
              label="Suspended"
            />
            <FormControlLabel
              value="authorshipConfirmationPending"
              control={<Radio size="small" />}
              label="Authorship Pending"
            />
            <FormControlLabel
              value="Submitted"
              control={<Radio size="small" />}
              label="Submitted"
            />
          </RadioGroup>
        </FormControl>
      )}

      {/* Year Filter */}
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
            onChange={(e) =>
              handleOptionChange({
                target: { name: "year", value: e.target.value },
              })
            }
            size="small"
          >
            {uniqueYears.map((year) => (
              <MenuItem key={year} value={year}>
                {year}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {/* Department Filter */}
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
          <InputLabel id="dept-select-label">
            Select Department
          </InputLabel>
          <Select
            labelId="dept-select-label"
            value={printOptions.department}
            label="Select Department"
            onChange={(e) =>
              handleOptionChange({
                target: { name: "department", value: e.target.value },
              })
            }
            size="small"
          >
            {uniqueDepartments.map((dept) => (
              <MenuItem key={dept} value={dept}>
                {dept}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {/* Award Amount Filter */}
      <FormControlLabel
        control={
          <Checkbox
            checked={printOptions.filterByAwardAmount}
            onChange={handleOptionChange}
            name="filterByAwardAmount"
          />
        }
        label="Filter by Award Amount"
      />
      {printOptions.filterByAwardAmount && (
        <Box sx={{ px: 3, mt: 1, mb: 3 }}>
          <Typography
            variant="caption"
            color="text.secondary"
            gutterBottom
            display="block"
          >
            Award amount range: ₹
            {printOptions.minAwardAmount.toLocaleString()} - ₹
            {printOptions.maxAwardAmount.toLocaleString()}
          </Typography>
          <Slider
            value={[
              printOptions.minAwardAmount,
              printOptions.maxAwardAmount,
            ]}
            onChange={(e, newValue) => {
              handleSliderChange("minAwardAmount", newValue[0]);
              handleSliderChange("maxAwardAmount", newValue[1]);
            }}
            min={0}
            max={maxPossibleAward}
            step={10000}
            valueLabelDisplay="auto"
            valueLabelFormat={(value) => `₹${value.toLocaleString()}`}
          />
        </Box>
      )}

      {/* Author Count Filter */}
      <FormControlLabel
        control={
          <Checkbox
            checked={printOptions.filterByAuthorCount}
            onChange={handleOptionChange}
            name="filterByAuthorCount"
          />
        }
        label="Filter by Author Count"
      />
      {printOptions.filterByAuthorCount && (
        <Box sx={{ px: 3, mt: 1, mb: 3 }}>
          <Typography
            variant="caption"
            color="text.secondary"
            gutterBottom
            display="block"
          >
            Number of authors: {printOptions.minAuthors} -{" "}
            {printOptions.maxAuthors}
          </Typography>
          <Slider
            value={[printOptions.minAuthors, printOptions.maxAuthors]}
            onChange={(e, newValue) => {
              handleSliderChange("minAuthors", newValue[0]);
              handleSliderChange("maxAuthors", newValue[1]);
            }}
            min={1}
            max={maxPossibleAuthors}
            step={1}
            valueLabelDisplay="auto"
          />
        </Box>
      )}

      {/* Keywords Filter */}
      <FormControlLabel
        control={
          <Checkbox
            checked={printOptions.filterByKeywords}
            onChange={handleOptionChange}
            name="filterByKeywords"
          />
        }
        label="Filter by Keywords"
      />
      {printOptions.filterByKeywords && (
        <Box sx={{ px: 3, mt: 1, mb: 2 }}>
          <TextField
            fullWidth
            size="small"
            label="Keywords (comma separated)"
            value={printOptions.keywords}
            onChange={(e) =>
              handleOptionChange({
                target: { name: "keywords", value: e.target.value },
              })
            }
            placeholder="e.g., AI, machine learning, blockchain"
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
          />
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ mt: 0.5, display: "block" }}
          >
            Searches in paper title and details
          </Typography>
        </Box>
      )}

      {/* Author Type Filter */}
      <FormControlLabel
        control={
          <Checkbox
            checked={printOptions.filterByAuthorType}
            onChange={handleOptionChange}
            name="filterByAuthorType"
          />
        }
        label="Filter by Author Type"
      />
      {printOptions.filterByAuthorType && (
        <FormControl component="fieldset" sx={{ ml: 4, mb: 2 }}>
          <RadioGroup
            name="authorType"
            value={printOptions.authorType}
            onChange={handleOptionChange}
          >
            <FormControlLabel
              value="all"
              control={<Radio size="small" />}
              label="All Authors"
            />
            <FormControlLabel
              value="internal"
              control={<Radio size="small" />}
              label="Has Internal Authors"
            />
            <FormControlLabel
              value="external"
              control={<Radio size="small" />}
              label="Has External Authors"
            />
          </RadioGroup>
        </FormControl>
      )}
    </Box>
  );
};
