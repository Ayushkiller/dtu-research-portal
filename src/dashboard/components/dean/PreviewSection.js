import React from "react";
import {
  Typography,
  Box,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import ImportContactsIcon from "@mui/icons-material/ImportContacts";

export const PreviewSection = ({ filteredPapers, printOptions }) => {
  return (
    <Box sx={{ mt: 3 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 1,
        }}
      >
        <Typography
          variant="subtitle1"
          sx={{ display: "flex", alignItems: "center" }}
        >
          <ImportContactsIcon
            sx={{ mr: 1, fontSize: 20, color: "primary.main" }}
          />
          Preview ({filteredPapers().length} papers match your criteria)
        </Typography>
        {printOptions.limitTopPapersPerUser && printOptions.showShareAmount && (
          <Chip
            label={`Top ${printOptions.topPapersCount} papers per user`}
            color="primary"
            size="small"
            variant="outlined"
          />
        )}
      </Box>
      <Paper variant="outlined" sx={{ maxHeight: 200, overflow: "auto" }}>
        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                {printOptions.paperDetailsToInclude.title && (
                  <TableCell>Title</TableCell>
                )}
                {printOptions.paperDetailsToInclude.applicant && (
                  <TableCell>Applicant</TableCell>
                )}
                {printOptions.paperDetailsToInclude.department && (
                  <TableCell>Department</TableCell>
                )}
                {printOptions.paperDetailsToInclude.year && (
                  <TableCell>Year</TableCell>
                )}
                {printOptions.paperDetailsToInclude.status && (
                  <TableCell>Status</TableCell>
                )}
                {printOptions.paperDetailsToInclude.totalAwardAmount && (
                  <TableCell>Award</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredPapers()
                .slice(0, 5)
                .map((paper) => (
                  <TableRow key={paper.id}>
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
                    {printOptions.paperDetailsToInclude.totalAwardAmount && (
                      <TableCell>
                        ₹{(paper.totalAwardAmount || 0).toLocaleString()}
                      </TableCell>
                    )}
                  </TableRow>
                ))}
              {filteredPapers().length > 5 && (
                <TableRow>
                  <TableCell
                    colSpan={
                      (printOptions.paperDetailsToInclude.title ? 1 : 0) +
                      (printOptions.paperDetailsToInclude.applicant ? 1 : 0) +
                      (printOptions.paperDetailsToInclude.department ? 1 : 0) +
                      (printOptions.paperDetailsToInclude.year ? 1 : 0) +
                      (printOptions.paperDetailsToInclude.status ? 1 : 0) +
                      (printOptions.paperDetailsToInclude.totalAwardAmount
                        ? 1
                        : 0)
                    }
                    align="center"
                  >
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
