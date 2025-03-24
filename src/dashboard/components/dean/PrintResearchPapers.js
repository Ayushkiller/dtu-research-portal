import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
  Radio,
  RadioGroup,
  Typography,
  Divider,
  Box,
  TextField,
  Select,
  MenuItem,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  InputLabel,
  Grid,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PrintIcon from "@mui/icons-material/Print";
import ArticleIcon from "@mui/icons-material/Article";
import PersonIcon from "@mui/icons-material/Person";

const PrintResearchPapers = ({ open, onClose, researchPapersData, columns }) => {
  const printRef = useRef(null);
  const [printOptions, setPrintOptions] = useState({
    showShareAmount: false,
    filterByUser: false,
    filterByStatus: false,
    filterByYear: false,
    filterByDepartment: false,
    userId: "",
    status: "all",
    year: "",
    department: "",
    includeAllDetails: true,
    paperDetailsToInclude: {
      title: true,
      applicant: true,
      department: true,
      year: true,
      status: true,
    },
  });

  // Extract unique users, departments, and years from data
  const uniqueUsers = [...new Set(researchPapersData.map(paper => paper.applicantName))];
  const uniqueDepartments = [...new Set(researchPapersData.map(paper => paper.department))];
  const uniqueYears = [...new Set(researchPapersData.map(paper => paper.pubYear))];

  const handleOptionChange = (event) => {
    const { name, checked, value } = event.target;
    
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setPrintOptions(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: checked
        }
      }));
    } else if (name === "status" || name === "userId" || name === "year" || name === "department") {
      setPrintOptions(prev => ({
        ...prev,
        [name]: value
      }));
    } else {
      setPrintOptions(prev => ({
        ...prev,
        [name]: checked !== undefined ? checked : value
      }));
    }
  };

  const filteredPapers = () => {
    return researchPapersData.filter(paper => {
      // Apply user filter
      if (printOptions.filterByUser && printOptions.userId && paper.applicantName !== printOptions.userId) {
        return false;
      }
      
      // Apply status filter
      if (printOptions.filterByStatus && printOptions.status !== "all" && paper.status !== printOptions.status) {
        return false;
      }
      
      // Apply year filter
      if (printOptions.filterByYear && printOptions.year && paper.pubYear !== printOptions.year) {
        return false;
      }
      
      // Apply department filter
      if (printOptions.filterByDepartment && printOptions.department && paper.department !== printOptions.department) {
        return false;
      }
      
      return true;
    });
  };

  const handlePrint = () => {
    const printContent = printRef.current;
    const originalContents = document.body.innerHTML;
    
    if (printContent) {
      const printWindow = window.open('', '_blank', 'width=800,height=600');
      printWindow.document.write('<html><head><title>Research Papers Report</title>');
      printWindow.document.write('<style>');
      printWindow.document.write(`
        body { font-family: Arial, sans-serif; margin: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .header { display: flex; align-items: center; margin-bottom: 20px; }
        .header h1 { margin: 0; color: #1976d2; }
        .status-approved { color: green; }
        .status-pending { color: orange; }
        .status-rejected { color: red; }
        .print-date { margin-top: 10px; font-size: 12px; text-align: right; color: #666; }
        @media print {
          button { display: none; }
        }
      `);
      printWindow.document.write('</style></head><body>');
      
      // Add header with title and date
      printWindow.document.write('<div class="header">');
      printWindow.document.write('<h1>Research Papers Report</h1>');
      printWindow.document.write('</div>');
      
      // Add filters applied
      printWindow.document.write('<div class="filters">');
      printWindow.document.write('<p><strong>Filters applied:</strong> ');
      if (printOptions.filterByUser) printWindow.document.write(`User: ${printOptions.userId}, `);
      if (printOptions.filterByStatus) printWindow.document.write(`Status: ${printOptions.status}, `);
      if (printOptions.filterByYear) printWindow.document.write(`Year: ${printOptions.year}, `);
      if (printOptions.filterByDepartment) printWindow.document.write(`Department: ${printOptions.department}, `);
      printWindow.document.write('</p></div>');
      
      // Get filtered papers
      const papers = filteredPapers();
      
      // Add table with papers
      printWindow.document.write('<table>');
      
      // Table header
      printWindow.document.write('<thead><tr>');
      if (printOptions.paperDetailsToInclude.title) 
        printWindow.document.write('<th>Paper Title</th>');
      if (printOptions.paperDetailsToInclude.applicant) 
        printWindow.document.write('<th>Applicant</th>');
      if (printOptions.paperDetailsToInclude.department) 
        printWindow.document.write('<th>Department</th>');
      if (printOptions.paperDetailsToInclude.year) 
        printWindow.document.write('<th>Year</th>');
      if (printOptions.paperDetailsToInclude.status) 
        printWindow.document.write('<th>Status</th>');
      if (printOptions.showShareAmount) 
        printWindow.document.write('<th>Authors</th><th>Share Amount</th>');
      printWindow.document.write('</tr></thead>');
      
      // Table body
      printWindow.document.write('<tbody>');
      papers.forEach(paper => {
        printWindow.document.write('<tr>');
        if (printOptions.paperDetailsToInclude.title) 
          printWindow.document.write(`<td>${paper.paperTitle}</td>`);
        if (printOptions.paperDetailsToInclude.applicant) 
          printWindow.document.write(`<td>${paper.applicantName}</td>`);
        if (printOptions.paperDetailsToInclude.department) 
          printWindow.document.write(`<td>${paper.department}</td>`);
        if (printOptions.paperDetailsToInclude.year) 
          printWindow.document.write(`<td>${paper.pubYear}</td>`);
        if (printOptions.paperDetailsToInclude.status) 
          printWindow.document.write(`<td class="status-${paper.status}">${paper.status}</td>`);
        
        if (printOptions.showShareAmount && paper.authors) {
          printWindow.document.write('<td>');
          paper.authors.forEach((author, index) => {
            printWindow.document.write(`${author.name}${index < paper.authors.length - 1 ? ', ' : ''}`);
          });
          printWindow.document.write('</td>');
          
          printWindow.document.write('<td>');
          paper.authors.forEach((author, index) => {
            if (author.amount || author.shareValue) {
              printWindow.document.write(`${author.name}: ₹${author.amount || 'N/A'} (${author.shareValue || 'N/A'}%)${index < paper.authors.length - 1 ? '<br>' : ''}`);
            } else {
              printWindow.document.write('N/A');
            }
          });
          printWindow.document.write('</td>');
        }
        
        printWindow.document.write('</tr>');
      });
      printWindow.document.write('</tbody></table>');
      
      // Add print date
      const now = new Date();
      printWindow.document.write(`<div class="print-date">Generated on: ${now.toLocaleDateString()} ${now.toLocaleTimeString()}</div>`);
      
      // Add print button
      printWindow.document.write('<button onclick="window.print()">Print Report</button>');
      
      printWindow.document.write('</body></html>');
      printWindow.document.close();
    }
  };

  return (
    <>
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 2,
            boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
          }
        }}
      >
        <DialogTitle sx={{ borderBottom: '1px solid #e0e0e0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <PrintIcon sx={{ mr: 1, color: 'primary.main' }} />
            <Typography variant="h6">Research Papers Print Options</Typography>
          </Box>
          <IconButton edge="end" onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        
        <DialogContent dividers>
          <Grid container spacing={3}>
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <ArticleIcon sx={{ mr: 1, fontSize: 20, color: 'primary.main' }} />
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
                <Typography variant="caption" color="text.secondary" sx={{ ml: 4, mb: 1 }}>
                  Will show each author's share amount and percentage
                </Typography>
                
                <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }}>Details to Include:</Typography>
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
                </Box>
              </FormGroup>
            </Grid>
            
            <Grid item xs={12} sm={6}>
              <Typography variant="subtitle1" gutterBottom sx={{ display: 'flex', alignItems: 'center' }}>
                <PersonIcon sx={{ mr: 1, fontSize: 20, color: 'primary.main' }} />
                Filter Options
              </Typography>
              
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
                    onChange={(e) => handleOptionChange({ target: { name: 'userId', value: e.target.value } })}
                    size="small"
                  >
                    {uniqueUsers.map(user => (
                      <MenuItem key={user} value={user}>{user}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
              
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
                    <FormControlLabel value="all" control={<Radio size="small" />} label="All" />
                    <FormControlLabel value="approved" control={<Radio size="small" />} label="Approved" />
                    <FormControlLabel value="pending" control={<Radio size="small" />} label="Pending" />
                    <FormControlLabel value="rejected" control={<Radio size="small" />} label="Rejected" />
                  </RadioGroup>
                </FormControl>
              )}
              
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
                    onChange={(e) => handleOptionChange({ target: { name: 'year', value: e.target.value } })}
                    size="small"
                  >
                    {uniqueYears.map(year => (
                      <MenuItem key={year} value={year}>{year}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
              
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
                  <InputLabel id="dept-select-label">Select Department</InputLabel>
                  <Select
                    labelId="dept-select-label"
                    value={printOptions.department}
                    label="Select Department"
                    onChange={(e) => handleOptionChange({ target: { name: 'department', value: e.target.value } })}
                    size="small"
                  >
                    {uniqueDepartments.map(dept => (
                      <MenuItem key={dept} value={dept}>{dept}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              )}
            </Grid>
          </Grid>
          
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
          
          <div ref={printRef} style={{ display: 'none' }}>
            {/* Print content will be generated dynamically */}
          </div>
        </DialogContent>
        
        <DialogActions sx={{ borderTop: '1px solid #e0e0e0', p: 2 }}>
          <Button onClick={onClose} color="secondary">
            Cancel
          </Button>
          <Button 
            onClick={handlePrint} 
            variant="contained" 
            color="primary" 
            startIcon={<PrintIcon />}
            disabled={filteredPapers().length === 0}
          >
            Generate Print View
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default PrintResearchPapers;
