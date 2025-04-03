import React from "react";
import {
  FormControl,
  RadioGroup,
  Card,
  CardContent,
  FormControlLabel,
  Radio,
  Box,
  Typography,
} from "@mui/material";
import { AWARD_CATEGORIES } from "../utils/awardDistributionUtils";

const AwardCategorySelection = ({ awardCategory, handleAwardCategoryChange }) => {
  return (
    <FormControl component="fieldset">
      <RadioGroup
        name="awardCategory"
        value={awardCategory}
        onChange={handleAwardCategoryChange}
      >
        {Object.values(AWARD_CATEGORIES).map((category) => (
          <Card
            key={category.value}
            variant="outlined"
            sx={{
              mb: 2,
              border:
                awardCategory === category.value
                  ? "2px solid #3f51b5"
                  : "1px solid rgba(0, 0, 0, 0.12)",
            }}
          >
            <CardContent>
              <FormControlLabel
                value={category.value}
                control={<Radio />}
                label={
                  <Box>
                    <Typography variant="subtitle1" component="span">
                      {category.label} - ₹{category.amount.toLocaleString()}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="textSecondary"
                      sx={{ mt: 1 }}
                    >
                      {category.description}
                    </Typography>
                    <Typography
                      variant="body2"
                      sx={{ fontStyle: "italic", mt: 0.5 }}
                    >
                      Criteria: {category.criteria}
                    </Typography>
                  </Box>
                }
              />
            </CardContent>
          </Card>
        ))}
      </RadioGroup>
    </FormControl>
  );
};

export default AwardCategorySelection;
