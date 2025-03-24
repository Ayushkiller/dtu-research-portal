import React from "react";
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
import { ContentOptions } from "./ContentOptions";
import { FilterOptions } from "./FilterOptions";
import { PreviewSection } from "./PreviewSection";

export const PrintOptionsDialog = ({
  open,
  onClose,
  printOptions,
  setPrintOptions,
  uniqueUsers,
  uniqueDepartments,
  uniqueYears,
  maxPossibleAward,
  maxPossibleAuthors,
  filteredPapers,
  printRef, // Receive the printRef
}) => {
  const handlePrint = () => {
    const printContent = printRef.current;

    if (printContent) {
      const printWindow = window.open("", "_blank", "width=800,height=600");
      printWindow.document.write(
        "<html><head><title>Research Papers Report</title>"
      );
      printWindow.document.write("<style>");
      printWindow.document.write(`
        body { font-family: Arial, sans-serif; margin: 20px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        th { background-color: #f2f2f2; }
        .header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .header h1 { margin: 0; color: #1976d2; }
        .status-approved { color: green; }
        .status-pending, .status-underReview, .status-authorshipConfirmationPending { color: orange; }
        .status-rejected { color: red; }
        .status-suspended { color: #9c27b0; }
        .status-Submitted { color: blue; }
        .print-date { margin-top: 10px; font-size: 12px; text-align: right; color: #666; }
        .summary { margin-bottom: 20px; padding: 10px; background-color: #f9f9f9; border-radius: 4px; }
        .summary strong { font-weight: bold; }
        .filters { margin-bottom: 20px; padding: 10px; background-color: #f0f8ff; border-radius: 4px; }
        .author-shares { font-size: 0.9em; }
        @media print {
          button { display: none; }
          .no-print { display: none; }
        }
      `);
      printWindow.document.write("</style></head><body>");

      // Add header with title and date
      const now = new Date();
      printWindow.document.write('<div class="header">');
      printWindow.document.write("<h1>Research Papers Report</h1>");
      printWindow.document.write(
        `<div>${now.toLocaleDateString()} ${now.toLocaleTimeString()}</div>`
      );
      printWindow.document.write("</div>");

      // Add summary
      const papers = filteredPapers();
      const totalAward = papers.reduce(
        (sum, paper) => sum + (paper.totalAwardAmount || 0),
        0
      );
      printWindow.document.write('<div class="summary">');
      printWindow.document.write(
        `<strong>Total Papers:</strong> ${papers.length}<br/>`
      );
      printWindow.document.write(
        `<strong>Total Award Amount:</strong> ₹${totalAward.toLocaleString()}<br/>`
      );

      // Add any top-level stats
      if (printOptions.filterByUser && printOptions.userId) {
        const userPapers = papers.filter(
          (p) => p.applicantName === printOptions.userId
        );
        const userTotalAward = userPapers.reduce(
          (sum, p) => sum + (p.totalAwardAmount || 0),
          0
        );
        printWindow.document.write(
          `<strong>Papers by ${printOptions.userId}:</strong> ${userPapers.length}<br/>`
        );
        printWindow.document.write(
          `<strong>Total Award for ${
            printOptions.userId
          }:</strong> ₹${userTotalAward.toLocaleString()}<br/>`
        );
      }
      printWindow.document.write("</div>");

      // Add filters applied
      printWindow.document.write('<div class="filters">');
      printWindow.document.write("<strong>Filters applied:</strong> ");
      let filtersApplied = [];
      if (printOptions.filterByUser)
        filtersApplied.push(`User: ${printOptions.userId}`);
      if (printOptions.filterByStatus)
        filtersApplied.push(`Status: ${printOptions.status}`);
      if (printOptions.filterByYear)
        filtersApplied.push(`Year: ${printOptions.year}`);
      if (printOptions.filterByDepartment)
        filtersApplied.push(`Department: ${printOptions.department}`);
      if (printOptions.filterByAwardAmount)
        filtersApplied.push(
          `Award Amount: ₹${printOptions.minAwardAmount.toLocaleString()} - ₹${printOptions.maxAwardAmount.toLocaleString()}`
        );
      if (printOptions.filterByAuthorCount)
        filtersApplied.push(
          `Author Count: ${printOptions.minAuthors} - ${printOptions.maxAuthors}`
        );
      if (printOptions.filterByKeywords)
        filtersApplied.push(`Keywords: ${printOptions.keywords}`);
      if (printOptions.filterByAuthorType && printOptions.authorType !== "all")
        filtersApplied.push(`Author Type: ${printOptions.authorType}`);
      if (printOptions.limitTopPapersPerUser)
        filtersApplied.push(
          `Top ${printOptions.topPapersCount} Papers Per User`
        );
      printWindow.document.write(filtersApplied.join(", ") || "None");
      printWindow.document.write("</div>");

      // Add table with papers
      printWindow.document.write("<table>");

      // Table header
      printWindow.document.write("<thead><tr>");
      if (printOptions.paperDetailsToInclude.title)
        printWindow.document.write("<th>Paper Title</th>");
      if (printOptions.paperDetailsToInclude.applicant)
        printWindow.document.write("<th>Applicant</th>");
      if (printOptions.paperDetailsToInclude.department)
        printWindow.document.write("<th>Department</th>");
      if (printOptions.paperDetailsToInclude.year)
        printWindow.document.write("<th>Year</th>");
      if (printOptions.paperDetailsToInclude.status)
        printWindow.document.write("<th>Status</th>");
      if (printOptions.paperDetailsToInclude.totalAwardAmount)
        printWindow.document.write("<th>Total Award</th>");
      if (printOptions.paperDetailsToInclude.authorCount)
        printWindow.document.write("<th>Authors</th>");
      if (printOptions.showShareAmount)
        printWindow.document.write("<th>Author Details</th>");
      printWindow.document.write("</tr></thead>");

      // Table body
      printWindow.document.write("<tbody>");
      papers.forEach((paper) => {
        printWindow.document.write("<tr>");
        if (printOptions.paperDetailsToInclude.title)
          printWindow.document.write(`<td>${paper.paperTitle || "N/A"}</td>`);
        if (printOptions.paperDetailsToInclude.applicant)
          printWindow.document.write(
            `<td>${paper.applicantName || "N/A"}</td>`
          );
        if (printOptions.paperDetailsToInclude.department)
          printWindow.document.write(`<td>${paper.department || "N/A"}</td>`);
        if (printOptions.paperDetailsToInclude.year)
          printWindow.document.write(`<td>${paper.pubYear || "N/A"}</td>`);
        if (printOptions.paperDetailsToInclude.status)
          printWindow.document.write(
            `<td class="status-${paper.status}">${paper.status || "N/A"}</td>`
          );
        if (printOptions.paperDetailsToInclude.totalAwardAmount)
          printWindow.document.write(
            `<td>₹${(paper.totalAwardAmount || 0).toLocaleString()}</td>`
          );
        if (printOptions.paperDetailsToInclude.authorCount)
          printWindow.document.write(
            `<td>${paper.authors ? paper.authors.length : 1}</td>`
          );

        if (printOptions.showShareAmount) {
          printWindow.document.write('<td class="author-shares">');
          if (paper.authors && paper.authors.length > 0) {
            // Table for author share details
            printWindow.document.write(
              '<table style="width:100%; border:none;">'
            );
            printWindow.document.write(
              "<thead><tr><th>Name</th><th>Type</th><th>Share %</th><th>Amount</th></tr></thead>"
            );
            printWindow.document.write("<tbody>");

            paper.authors.forEach((author) => {
              const shareValue = author.shareValue || 0;
              // Calculate amount based on share value and total award
              const amount = paper.totalAwardAmount
                ? (shareValue / 100) * paper.totalAwardAmount
                : 0;

              printWindow.document.write("<tr>");
              printWindow.document.write(`<td>${author.name || "N/A"}</td>`);
              printWindow.document.write(
                `<td>${author.isExternal ? "External" : "Internal"}</td>`
              );
              printWindow.document.write(`<td>${shareValue.toFixed(2)}%</td>`);
              printWindow.document.write(
                `<td>₹${amount.toLocaleString(undefined, {
                  minimumFractionDigits: 2,
                })}</td>`
              );
              printWindow.document.write("</tr>");
            });

            printWindow.document.write("</tbody></table>");
          } else {
            printWindow.document.write("No author details available");
          }
          printWindow.document.write("</td>");
        }

        printWindow.document.write("</tr>");
      });
      printWindow.document.write("</tbody></table>");

      // Add print button (visible only on screen, not in print)
      printWindow.document.write(
        '<div class="no-print" style="margin-top: 20px; text-align: center;">'
      );
      printWindow.document.write(
        '<button onclick="window.print()" style="padding: 10px 20px; background-color: #1976d2; color: white; border: none; border-radius: 4px; cursor: pointer;">Print Report</button>'
      );
      printWindow.document.write("</div>");

      printWindow.document.write("</body></html>");
      printWindow.document.close();
    }
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          boxShadow: "0 8px 24px rgba(0,0,0,0.15)",
        },
      }}
    >
      <DialogTitle
        sx={{
          borderBottom: "1px solid #e0e0e0",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <PrintIcon sx={{ mr: 1, color: "primary.main" }} />
          <Typography variant="h6">Research Papers Print Options</Typography>
        </Box>
        <IconButton edge="end" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: "flex" }}>
          <ContentOptions
            printOptions={printOptions}
            setPrintOptions={setPrintOptions}
          />
          <FilterOptions
            printOptions={printOptions}
            setPrintOptions={setPrintOptions}
            uniqueUsers={uniqueUsers}
            uniqueDepartments={uniqueDepartments}
            uniqueYears={uniqueYears}
            maxPossibleAward={maxPossibleAward}
            maxPossibleAuthors={maxPossibleAuthors}
          />
        </Box>

        <PreviewSection
          filteredPapers={filteredPapers}
          printOptions={printOptions}
        />
      </DialogContent>

      <DialogActions sx={{ borderTop: "1px solid #e0e0e0", p: 2 }}>
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
  );
};
