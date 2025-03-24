import React from "react";
import {
  Typography,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Box,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import ArticleIcon from "@mui/icons-material/Article";

export const ContentOptions = ({ printOptions, setPrintOptions }) => {
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
    } else if (["topPapersCount", "sortBy", "sortDirection"].includes(name)) {
      setPrintOptions((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      setPrintOptions((prev) => ({
        ...prev,
        [name]: checked !== undefined ? checked : value,
      }));
    }
  };

  return (
    <Box sx={{ width: "50%", padding: 3 }}>
      <Typography
        variant="subtitle1"
        gutterBottom
        sx={{ display: "flex", alignItems: "center" }}
      >
        <ArticleIcon sx={{ mr: 1, fontSize: 20, color: "primary.main" }} />
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
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{ ml: 4, mb: 1 }}
        >
          Will show each author's share amount and percentage
        </Typography>

        {printOptions.showShareAmount && (
          <FormControlLabel
            control={
              <Checkbox
                checked={printOptions.limitTopPapersPerUser}
                onChange={handleOptionChange}
                name="limitTopPapersPerUser"
              />
            }
            label={`Limit to Top Papers Per User (${printOptions.topPapersCount})`}
            sx={{ ml: 3 }}
          />
        )}

        {printOptions.showShareAmount && printOptions.limitTopPapersPerUser && (
          <Box sx={{ ml: 4, mr: 2, mb: 2 }}>
            <Typography variant="caption" color="text.secondary" gutterBottom>
              Number of top papers per user
            </Typography>
            <Select
              fullWidth
              size="small"
              value={printOptions.topPapersCount}
              onChange={(e) =>
                handleOptionChange({
                  target: {
                    name: "topPapersCount",
                    value: e.target.value,
                  },
                })
              }
            >
              {[1, 2, 3, 5, 10].map((num) => (
                <MenuItem key={num} value={num}>
                  {num} Papers
                </MenuItem>
              ))}
            </Select>
          </Box>
        )}

        <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
          Details to Include:
        </Typography>
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
          <FormControlLabel
            control={
              <Checkbox
                checked={printOptions.paperDetailsToInclude.totalAwardAmount}
                onChange={handleOptionChange}
                name="paperDetailsToInclude.totalAwardAmount"
              />
            }
            label="Total Award Amount"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={printOptions.paperDetailsToInclude.authorCount}
                onChange={handleOptionChange}
                name="paperDetailsToInclude.authorCount"
              />
            }
            label="Author Count"
          />
        </Box>

        <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>
          Sorting Options:
        </Typography>
        <Box sx={{ ml: 2, display: "flex", alignItems: "center" }}>
          <FormControl size="small" sx={{ minWidth: 140, mr: 2 }}>
            <InputLabel id="sort-by-label">Sort By</InputLabel>
            <Select
              labelId="sort-by-label"
              value={printOptions.sortBy}
              label="Sort By"
              name="sortBy"
              onChange={handleOptionChange}
            >
              <MenuItem value="awardAmount">Award Amount</MenuItem>
              <MenuItem value="year">Publication Year</MenuItem>
              <MenuItem value="title">Paper Title</MenuItem>
            </Select>
          </FormControl>
          <FormControl size="small" sx={{ minWidth: 140 }}>
            <InputLabel id="sort-direction-label">Direction</InputLabel>
            <Select
              labelId="sort-direction-label"
              value={printOptions.sortDirection}
              label="Direction"
              name="sortDirection"
              onChange={handleOptionChange}
            >
              <MenuItem value="desc">Descending</MenuItem>
              <MenuItem value="asc">Ascending</MenuItem>
            </Select>
          </FormControl>
        </Box>
      </FormGroup>
    </Box>
  );
};
