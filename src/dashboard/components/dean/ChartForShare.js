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

// Separate color generation to improve maintainability
const getAuthorColor = (isExternal, isHighlighted = false) => {
  if (isHighlighted) {
    return isExternal ? 'hsl(220, 40%, 75%)' : 'hsl(220, 40%, 52%)';
  }
  return isExternal ? 'hsl(220, 20%, 65%)' : 'hsl(220, 20%, 42%)';
};

const StyledText = styled('text', {
  shouldForwardProp: (prop) => prop !== 'variant',
})(({ theme }) => ({
  textAnchor: 'middle',
  dominantBaseline: 'central',
  fill: (theme.vars || theme).palette.text.secondary,
  variants: [
    {
      props: { variant: 'primary' },
      style: {
        fontSize: theme.typography.h5.fontSize,
        fontWeight: theme.typography.h5.fontWeight,
        fill: theme.palette.text.primary,
      },
    },
    {
      props: { variant: 'secondary' },
      style: {
        fontSize: theme.typography.body2.fontSize,
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

export default function AuthorsShareChart({ authors }) {
  const [highlightedIndex, setHighlightedIndex] = React.useState(null);
  const totalShares = authors.reduce((sum, author) => sum + author.shareValue, 0);

  const handleMouseEnter = (index) => {
    setHighlightedIndex(index);
  };

  const handleMouseLeave = () => {
    setHighlightedIndex(null);
  };

  return (
    <Card
      variant="outlined"
      sx={{ 
        display: 'flex', 
        flexDirection: 'column', 
        gap: '8px', 
        flexGrow: 1,
        transition: 'box-shadow 0.3s ease',
        '&:hover': {
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }
      }}
    >
      <CardContent>
        <Typography 
          component="h2" 
          variant="h6" 
          sx={{ 
            mb: 2, 
            fontWeight: 'bold', 
            color: 'text.primary' 
          }}
        >
          Authors' Share Distribution
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <PieChart
            colors={authors.map((author, index) => 
              getAuthorColor(author.isExternal, index === highlightedIndex)
            )}
            margin={{
              left: 80,
              right: 80,
              top: 80,
              bottom: 80,
            }}
            series={[
              {
                data: authors.map((author) => ({
                  label: author.name,
                  value: author.shareValue,
                })),
                innerRadius: 75,
                outerRadius: 100,
                paddingAngle: 1,
                highlightScope: { 
                  faded: 'global', 
                  highlighted: 'item' 
                },
                onItemEnter: (event) => {
                  const index = event.dataIndex;
                  handleMouseEnter(index);
                },
                onItemLeave: () => {
                  handleMouseLeave();
                }
              },
            ]}
            height={260}
            width={260}
            slotProps={{
              legend: { hidden: true },
            }}
          >
            <PieCenterLabel 
              primaryText={`${totalShares.toFixed(1)}`} 
              secondaryText="Total Shares" 
            />
          </PieChart>
        </Box>
        {authors.map((author, index) => (
          <Stack
            key={author.name}
            direction="row"
            sx={{ 
              alignItems: 'center', 
              gap: 2, 
              pb: 2,
              opacity: highlightedIndex !== null && highlightedIndex !== index ? 0.5 : 1,
              transition: 'opacity 0.3s ease'
            }}
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
          >
            <Stack sx={{ gap: 1, flexGrow: 1 }}>
              <Stack
                direction="row"
                sx={{
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <Typography 
                  variant="body2" 
                  sx={{ 
                    fontWeight: '600', 
                    color: highlightedIndex === index ? 'primary.main' : 'text.primary' 
                  }}
                >
                  {author.name}
                </Typography>
                <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                  {author.shareValue.toFixed(1)}%
                </Typography>
              </Stack>
              <LinearProgress
                variant="determinate"
                aria-label={`Share of ${author.name}`}
                value={author.shareValue}
                sx={{
                  [`& .${linearProgressClasses.bar}`]: {
                    backgroundColor: getAuthorColor(author.isExternal, highlightedIndex === index),
                    transition: 'background-color 0.3s ease',
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

AuthorsShareChart.propTypes = {
  authors: PropTypes.arrayOf(
    PropTypes.shape({
      name: PropTypes.string.isRequired,
      shareValue: PropTypes.number.isRequired,
      isExternal: PropTypes.bool.isRequired,
    })
  ).isRequired,
};