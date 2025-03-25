import React, { useState, useRef } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  Box,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import PrintIcon from "@mui/icons-material/Print";
import { PrintOptionsForm } from "./PrintOptionsForm";
import { PapersPreviewTable } from "./PapersPreviewTable";

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
            if (author.amount !== undefined || author.shareValue !== undefined) {
              printWindow.document.write(`${author.name}: ₹${author.amount ? author.amount.toLocaleString(undefined, { maximumFractionDigits: 2 }) : 'N/A'} (${author.shareValue ? author.shareValue.toFixed(2) : 'N/A'}%)${index < paper.authors.length - 1 ? '<br>' : ''}`);
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
          <PrintOptionsForm
            printOptions={printOptions}
            handleOptionChange={handleOptionChange}
            uniqueUsers={uniqueUsers}
            uniqueDepartments={uniqueDepartments}
            uniqueYears={uniqueYears}
          />
          
          <PapersPreviewTable filteredPapers={filteredPapers} printOptions={printOptions} />
          
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
