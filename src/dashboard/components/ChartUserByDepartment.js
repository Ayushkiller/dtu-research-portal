import * as React from "react";
import PropTypes from "prop-types";
import { PieChart } from "@mui/x-charts/PieChart";
import { useDrawingArea } from "@mui/x-charts/hooks";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import LinearProgress, {
  linearProgressClasses,
} from "@mui/material/LinearProgress";

const data = [
  { label: "Computer Science", value: 39000 },
  { label: "Electrical Engineering", value: 29000 },
  { label: "Mechanical Engineering", value: 20000 },
  { label: "Electronics & Communication", value: 20000 },
];

const departments = [
  { name: "Computer Science", value: 35, color: "hsl(220, 25%, 65%)" },
  { name: "Electrical Engineering", value: 25, color: "hsl(220, 25%, 45%)" },
  { name: "Mechanical Engineering", value: 20, color: "hsl(220, 25%, 30%)" },
  {
    name: "Electronics & Communication",
    value: 20,
    color: "hsl(220, 25%, 20%)",
  },
];

const StyledText = styled("text")(({ theme, variant }) => ({
  textAnchor: "middle",
  dominantBaseline: "central",
  fill: theme.palette.text.secondary,
  ...(variant === "primary" && {
    fontSize: theme.typography.h5.fontSize,
    fontWeight: theme.typography.h5.fontWeight,
  }),
  ...(variant !== "primary" && {
    fontSize: theme.typography.body2.fontSize,
    fontWeight: theme.typography.body2.fontWeight,
  }),
}));

function PieCenterLabel({ primaryText, secondaryText }) {
  const { width, height, left, top } = useDrawingArea();
  const primaryY = top + height / 2 - 10;
  const secondaryY = primaryY + 24;

  return (
    <>
      <StyledText variant="primary" x={left + width / 2} y={primaryY}>
        {primaryText}
      </StyledText>
      <StyledText x={left + width / 2} y={secondaryY}>
        {secondaryText}
      </StyledText>
    </>
  );
}

PieCenterLabel.propTypes = {
  primaryText: PropTypes.string.isRequired,
  secondaryText: PropTypes.string.isRequired,
};

export default function BTechDepartmentResearch() {
  const totalPapers = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card
      variant="outlined"
      sx={{ display: "flex", flexDirection: "column", gap: "8px", flexGrow: 1 }}
    >
      <CardContent>
        <Typography component="h2" variant="subtitle2">
          B.Tech Department Research Papers
        </Typography>
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <PieChart
            colors={departments.map((dept) => dept.color)}
            series={[
              {
                data: data.map((item) => ({ ...item })),
                innerRadius: 75,
                outerRadius: 100,
                highlightScope: { faded: "global", highlighted: "item" },
              },
            ]}
            height={260}
            width={260}
            slotProps={{
              legend: { hidden: true },
            }}
          >
            <PieCenterLabel
              primaryText={`${totalPapers}`}
              secondaryText="Total Papers"
            />
          </PieChart>
        </Box>
        {departments.map((department, index) => (
          <Stack
            key={index}
            direction="row"
            sx={{ alignItems: "center", gap: 2, pb: 2 }}
          >
            <Box
              sx={{
                width: 10,
                height: 10,
                backgroundColor: department.color,
                borderRadius: "50%",
              }}
            />
            <Typography
              sx={{ flexGrow: 1 }}
              color="text.secondary"
              variant="body2"
            >
              {department.name}
            </Typography>
            <Box sx={{ width: 200 }}>
              <LinearProgress
                variant="determinate"
                value={department.value}
                sx={{
                  height: 8,
                  borderRadius: 2,
                  [`&.${linearProgressClasses.colorPrimary}`]: {
                    backgroundColor: department.color,
                  },
                  [`& .${linearProgressClasses.bar}`]: {
                    backgroundColor: department.color,
                  },
                }}
              />
            </Box>
          </Stack>
        ))}
      </CardContent>
    </Card>
  );
}
