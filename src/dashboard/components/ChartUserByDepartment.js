import * as React from 'react';
import PropTypes from 'prop-types';
import { PieChart } from '@mui/x-charts/PieChart';
import { useDrawingArea } from '@mui/x-charts/hooks';
import { styled } from '@mui/material/styles';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Box from '@mui/material/Box';
import Stack from '@mui/material/Stack';
import LinearProgress, { linearProgressClasses } from '@mui/material/LinearProgress';

// Custom icons for B.Tech departments (using emoji placeholders)
const ComputerScienceIcon = () => <span>💻</span>;
const ElectricalIcon = () => <span>⚡</span>;
const MechanicalIcon = () => <span>🔧</span>;
const ElectronicsIcon = () => <span>📡</span>;

const data = [
  { label: 'Computer Science', value: 35000 },
  { label: 'Electrical Engineering', value: 25000 },
  { label: 'Mechanical Engineering', value: 20000 },
  { label: 'Electronics & Communication', value: 20000 },
];

const departments = [
  {
    name: 'Computer Science',
    value: 35,
    icon: <ComputerScienceIcon />,
    color: 'hsl(220, 25%, 65%)',
  },
  {
    name: 'Electrical Engineering',
    value: 25,
    icon: <ElectricalIcon />,
    color: 'hsl(220, 25%, 45%)',
  },
  {
    name: 'Mechanical Engineering',
    value: 20,
    icon: <MechanicalIcon />,
    color: 'hsl(220, 25%, 30%)',
  },
  {
    name: 'Electronics & Communication',
    value: 20,
    icon: <ElectronicsIcon />,
    color: 'hsl(220, 25%, 20%)',
  },
];

const StyledText = styled('text', {
  shouldForwardProp: (prop) => prop !== 'variant',
})(({ theme }) => ({
  textAnchor: 'middle',
  dominantBaseline: 'central',
  fill: (theme.vars || theme).palette.text.secondary,
  variants: [
    {
      props: {
        variant: 'primary',
      },
      style: {
        fontSize: theme.typography.h5.fontSize,
      },
    },
    {
      props: ({ variant }) => variant !== 'primary',
      style: {
        fontSize: theme.typography.body2.fontSize,
      },
    },
    {
      props: {
        variant: 'primary',
      },
      style: {
        fontWeight: theme.typography.h5.fontWeight,
      },
    },
    {
      props: ({ variant }) => variant !== 'primary',
      style: {
        fontWeight: theme.typography.body2.fontWeight,
      },
    },
  ],
}));

function PieCenterLabel({ primaryText, secondaryText }) {
  const { width, height, left, top } = useDrawingArea();
  const primaryY = top + height / 2 - 10;
  const secondaryY = primaryY + 24;

  return (
    <React.Fragment>
      <StyledText variant="primary" x={left + width / 2} y={primaryY}>
        {primaryText}
      </StyledText>
      <StyledText variant="secondary" x={left + width / 2} y={secondaryY}>
        {secondaryText}
      </StyledText>
    </React.Fragment>
  );
}

PieCenterLabel.propTypes = {
  primaryText: PropTypes.string.isRequired,
  secondaryText: PropTypes.string.isRequired,
};

const colors = [
  'hsl(220, 20%, 65%)',
  'hsl(220, 20%, 42%)',
  'hsl(220, 20%, 35%)',
  'hsl(220, 20%, 25%)',
];

export default function BTechDepartmentResearch() {
  const totalPapers = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <Card
      variant="outlined"
      sx={{ display: 'flex', flexDirection: 'column', gap: '8px', flexGrow: 1 }}
    >
      <CardContent>
        <Typography component="h2" variant="subtitle2">
          B.Tech Department Research Papers
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <PieChart
            colors={colors}
            margin={{
              left: 80,
              right: 80,
              top: 80,
              bottom: 80,
            }}
            series={[
              {
                data,
                innerRadius: 75,
                outerRadius: 100,
                paddingAngle: 0,
                highlightScope: { faded: 'global', highlighted: 'item' },
              },
            ]}
            height={260}
            width={260}
            slotProps={{
              legend: { hidden: true },
            }}
          >
            <PieCenterLabel primaryText={`${totalPapers}`} secondaryText="Total Papers" />
          </PieChart>
        </Box>
        {departments.map((department, index) => (
          <Stack
            key={index}
            direction="row"
            sx={{ alignItems: 'center', gap: 2, pb: 2 }}
          >
            {department.icon}
            <Stack sx={{ gap: 1, flexGrow: 1 }}>
              <Stack
                direction="row"
                sx={{
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <Typography variant="body2" sx={{ fontWeight: '500' }}>
                  {department.name}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {department.value}%
                </Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                aria-label="Percentage of research papers by B.Tech department"
                value={department.value}
                sx={{
                  [`& .${linearProgressClasses.bar}`]: {
                    backgroundColor: department.color,
                  },
                }}
              />
            </Stack>
          </Stack>
        ))}
      </CardContent>
    </Card>
  );
}