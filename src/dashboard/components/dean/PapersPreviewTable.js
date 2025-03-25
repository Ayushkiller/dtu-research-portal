import React from 'react';
import {
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
} from "@mui/material";

export const PapersPreviewTable = ({ filteredPapers, printOptions }) => {
  return (
    <Box sx={{ mt: 3 }}>
      <Typography variant="subtitle1" gutterBottom>
        Preview ({filteredPapers().length} papers match your criteria)
      </Typography>
      <Paper variant="outlined" sx={{ maxHeight: 200, overflow: 'auto' }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                {printOptions.paperDetailsToInclude.title && <TableCell>Title</TableCell>}
                {printOptions.paperDetailsToInclude.applicant && <TableCell>Applicant</TableCell>}
                {printOptions.paperDetailsToInclude.department && <TableCell>Department</TableCell>}
                {printOptions.paperDetailsToInclude.year && <TableCell>Year</TableCell>}
                {printOptions.paperDetailsToInclude.status && <TableCell>Status</TableCell>}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPapers().slice(0, 5).map((paper) => (
                <TableRow key={paper.id}>
                  {printOptions.paperDetailsToInclude.title && 
                    <TableCell>{paper.paperTitle}</TableCell>}
                  {printOptions.paperDetailsToInclude.applicant && 
                    <TableCell>{paper.applicantName}</TableCell>}
                  {printOptions.paperDetailsToInclude.department && 
                    <TableCell>{paper.department}</TableCell>}
                  {printOptions.paperDetailsToInclude.year && 
                    <TableCell>{paper.pubYear}</TableCell>}
                  {printOptions.paperDetailsToInclude.status && 
                    <TableCell>{paper.status}</TableCell>}
                </TableRow>
              ))}
              {filteredPapers().length > 5 && (
                <TableRow>
                  <TableCell colSpan={5} align="center">
                    ...and {filteredPapers().length - 5} more
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};
