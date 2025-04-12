import React from 'react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper 
} from '@mui/material';

export const PapersPreviewTable = ({ filteredPapers, printOptions }) => {
  const papers = filteredPapers();
  
  // Get the first 5 papers for preview
  const previewPapers = papers.slice(0, 5);

  return (
    <TableContainer component={Paper} variant="outlined" sx={{ maxHeight: 300 }}>
      <Table size="small" aria-label="preview table">
        <TableHead>
          <TableRow sx={{ backgroundColor: '#f5f5f5' }}>
            {printOptions.paperDetailsToInclude.title && <TableCell><strong>Paper Title</strong></TableCell>}
            {printOptions.paperDetailsToInclude.applicant && <TableCell><strong>Applicant</strong></TableCell>}
            {printOptions.paperDetailsToInclude.department && <TableCell><strong>Department</strong></TableCell>}
            {printOptions.paperDetailsToInclude.year && <TableCell><strong>Year</strong></TableCell>}
            {printOptions.paperDetailsToInclude.status && <TableCell><strong>Status</strong></TableCell>}
          </TableRow>
        </TableHead>
        <TableBody>
          {previewPapers.map((paper, index) => (
            <TableRow key={index} sx={{ 
              '&:nth-of-type(odd)': { backgroundColor: 'rgba(0,0,0,0.02)' }
            }}>
              {printOptions.paperDetailsToInclude.title && (
                <TableCell>{paper.paperTitle}</TableCell>
              )}
              {printOptions.paperDetailsToInclude.applicant && (
                <TableCell>{paper.applicantName}</TableCell>
              )}
              {printOptions.paperDetailsToInclude.department && (
                <TableCell>{paper.department}</TableCell>
              )}
              {printOptions.paperDetailsToInclude.year && (
                <TableCell>{paper.pubYear}</TableCell>
              )}
              {printOptions.paperDetailsToInclude.status && (
                <TableCell>{paper.status}</TableCell>
              )}
            </TableRow>
          ))}
          {papers.length > 5 && (
            <TableRow>
              <TableCell colSpan={Object.values(printOptions.paperDetailsToInclude).filter(v => v).length}>
                <em>...and {papers.length - 5} more papers</em>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
