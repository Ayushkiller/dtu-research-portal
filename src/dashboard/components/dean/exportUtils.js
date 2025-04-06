import * as XLSX from 'xlsx';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import API from "../../../api/axios";

// Excel Export Functions
export const exportToExcel = async () => {
  try {
    // Fetch complete research paper data with author details
    const response = await API.get("/dean/research-papers/export");
    const papers = response.data;
    
    if (!papers || papers.length === 0) {
      alert("No research papers available to export.");
      return;
    }
    
    console.log("Fetched papers for export:", papers.length);
    
    // Process data for export
    const processedData = processDataForExport(papers);
    
    // Generate and download Excel file
    generateExcelFile(processedData);
    return true;
  } catch (error) {
    console.error("Error exporting research papers:", error);
    alert("Failed to export research papers. Please try again.");
    return false;
  }
};

export const processDataForExport = (papers) => {
  console.log("Processing papers for export");
  
  // Safely access nested properties
  const safeGet = (obj, path, defaultValue = '') => {
    try {
      return path.split('.').reduce((o, key) => o?.[key], obj) ?? defaultValue;
    } catch (e) {
      return defaultValue;
    }
  };

  const researchPapersList = papers.map(paper => ({
    'Paper Title': safeGet(paper, 'paperTitle', 'Untitled'),
    'Authors': Array.isArray(paper.authors) 
      ? paper.authors.map(a => safeGet(a, 'name', 'Unknown')).join(', ') 
      : 'No authors listed',
    'Department': safeGet(paper, 'department', 'Not specified'),
    'Publication Year': safeGet(paper, 'pubYear', 'N/A'),
    'Status': safeGet(paper, 'status', 'Unknown'),
    'Impact Factor': safeGet(paper, 'impactFactor', 'N/A'),
    'Funding Amount': safeGet(paper, 'totalAwardAmount', 0)
  }));

  console.log(`Processed ${researchPapersList.length} papers for the main list`);

  // Group papers by author
  const authorPapers = {};
  papers.forEach(paper => {
    if (!Array.isArray(paper.authors)) {
      console.log(`Paper ${paper.paperTitle || 'Untitled'} has no authors array`);
      return; // Skip this paper if authors is not an array
    }
    
    const totalAwardAmount = parseFloat(safeGet(paper, 'totalAwardAmount', 0));
    
    paper.authors.forEach(author => {
      if (!author || typeof author !== 'object') {
        console.log('Invalid author object:', author);
        return; // Skip this author if it's not a valid object
      }
      
      const email = safeGet(author, 'email', 'no-email');
      if (!email) return;
      
      if (!authorPapers[email]) {
        authorPapers[email] = {
          name: safeGet(author, 'name', 'Unknown Author'), 
          email: email,
          isExternal: safeGet(author, 'isExternal', false),
          papers: []
        };
      }
      
      const shareValue = parseFloat(safeGet(author, 'shareValue', 0));
      // Recalculate amount based on shareValue percentage and totalAwardAmount
      const calculatedAmount = (shareValue / 100) * totalAwardAmount;
      
      authorPapers[email].papers.push({
        title: safeGet(paper, 'paperTitle', 'Untitled'),
        category: safeGet(paper, 'awardCategory', 'Unknown'),
        shareValue: shareValue,
        totalAmount: totalAwardAmount,
        amount: calculatedAmount // Use the calculated amount
      });
    });
  });

  console.log(`Processed data for ${Object.keys(authorPapers).length} authors`);

  // Calculate author funding based on rules
  const authorsFundingList = Object.values(authorPapers).map(author => {
    let papersList = author.papers.map(p => ({
      'Paper Title': p.title,
      'Category': p.category,
      'Share (%)': isNaN(p.shareValue) ? '0.00' : p.shareValue.toFixed(2),
      'Amount (₹)': isNaN(p.amount) ? '0.00' : p.amount.toFixed(2)
    }));
    
    // Apply funding calculation rules
    let totalFunding = 0;
    let consideredPapers = [...author.papers];
    
    // For "Commendable Research" category, limit to 3 highest-paying papers
    const commendablePapers = consideredPapers.filter(p => 
      p.category === 'COMMENDABLE' || 
      p.category === 'Commendable Research Award' ||
      p.category === 'commendable'
    );
    
    if (commendablePapers.length > 3) {
      // Sort by amount in descending order and take top 3
      commendablePapers.sort((a, b) => {
        const amountA = isNaN(a.amount) ? 0 : a.amount;
        const amountB = isNaN(b.amount) ? 0 : b.amount;
        return amountB - amountA;
      });
      
      const excludedPaperTitles = commendablePapers.slice(3).map(p => p.title);
      
      // Remove excluded papers from consideration
      consideredPapers = consideredPapers.filter(p => {
        const isCommendable = p.category === 'COMMENDABLE' || 
                             p.category === 'Commendable Research Award' ||
                             p.category === 'commendable';
        return !isCommendable || !excludedPaperTitles.includes(p.title);
      });
    }
    
    // Calculate total from considered papers
    totalFunding = consideredPapers.reduce((sum, p) => {
      const amount = isNaN(p.amount) ? 0 : p.amount;
      return sum + amount;
    }, 0);
    
    return {
      'Author Name': author.name,
      'Email': author.email,
      'External': author.isExternal ? 'Yes' : 'No',
      'Total Papers': author.papers.length,
      'Eligible Papers': consideredPapers.length,
      'Total Funding (₹)': isNaN(totalFunding) ? '0.00' : totalFunding.toFixed(2),
      'Paper Details': papersList
    };
  });

  // Create certificate list
  const certificatesList = [];
  papers.forEach(paper => {
    const paperTitle = safeGet(paper, 'paperTitle', 'Untitled');
    const department = safeGet(paper, 'department', 'Not specified');
    const pubYear = safeGet(paper, 'pubYear', 'N/A');
    const category = safeGet(paper, 'awardCategory', 'Unknown');
    
    if (!Array.isArray(paper.authors)) {
      certificatesList.push({
        'Paper Title': paperTitle,
        'Author Name': 'No authors listed',
        'Department': department,
        'Category': category,
        'Publication Year': pubYear
      });
      return;
    }
    
    paper.authors.forEach(author => {
      if (!author || typeof author !== 'object') return;
      
      certificatesList.push({
        'Paper Title': paperTitle,
        'Author Name': safeGet(author, 'name', 'Unknown'),
        'Department': department,
        'Category': category,
        'Publication Year': pubYear
      });
    });
  });

  console.log(`Created ${certificatesList.length} certificate entries`);

  return {
    researchPapersList,
    authorsFundingList,
    certificatesList
  };
};

export const generateExcelFile = (data) => {
  try {
    console.log("Generating Excel file");
    
    const workbook = XLSX.utils.book_new();
    
    // Add Research Papers Sheet
    const paperSheet = XLSX.utils.json_to_sheet(data.researchPapersList);
    XLSX.utils.book_append_sheet(workbook, paperSheet, "Research Papers");
    
    // Add Authors Funding Sheet with nested info
    const authorsFundingRows = [];
    data.authorsFundingList.forEach(author => {
      // Add author summary row
      authorsFundingRows.push({
        'Author Name': author['Author Name'] || 'Unknown',
        'Email': author.Email || 'No email',
        'External': author.External || 'No',
        'Total Papers': author['Total Papers'] || 0,
        'Eligible Papers': author['Eligible Papers'] || 0,
        'Total Funding (₹)': author['Total Funding (₹)'] || '0.00'
      });
      
      // Add header row for papers with proper column alignment
      authorsFundingRows.push({
        'Author Name': 'Papers by this author:',
        'Email': 'Title',
        'External': 'Category',
        'Total Papers': 'Share (%)',
        'Eligible Papers': 'Amount (₹)'
      });
      
      // Add individual paper rows with better structure
      if (Array.isArray(author['Paper Details']) && author['Paper Details'].length > 0) {
        author['Paper Details'].forEach(paper => {
          authorsFundingRows.push({
            'Author Name': '',  // Indent to show it belongs to the author above
            'Email': paper['Paper Title'] || 'Untitled',
            'External': paper.Category || 'Unknown',
            'Total Papers': paper['Share (%)'] || '0.00',
            'Eligible Papers': paper['Amount (₹)'] || '0.00'
          });
        });
      } else {
        authorsFundingRows.push({
          'Author Name': '',
          'Email': 'No papers found for this author',
          'External': '',
          'Total Papers': '',
          'Eligible Papers': ''
        });
      }
      
      // Add blank separator row with border styling
      authorsFundingRows.push({
        'Author Name': '---------------',
        'Email': '---------------',
        'External': '---------------',
        'Total Papers': '---------------',
        'Eligible Papers': '---------------'
      });
    });
    
    // Create the sheet with custom column widths
    const authorSheet = XLSX.utils.json_to_sheet(authorsFundingRows);
    
    // Set column widths for better readability
    const authorCols = [
      {wch: 30}, // Author Name
      {wch: 40}, // Email/Title
      {wch: 20}, // External/Category
      {wch: 12}, // Total/Share
      {wch: 15}  // Eligible/Amount
    ];
    authorSheet['!cols'] = authorCols;
    
    XLSX.utils.book_append_sheet(workbook, authorSheet, "Authors Funding");
    
    // Add Certificates Sheet
    const certificateSheet = XLSX.utils.json_to_sheet(data.certificatesList);
    XLSX.utils.book_append_sheet(workbook, certificateSheet, "Certificates");
    
    console.log("Writing Excel file");
    XLSX.writeFile(workbook, "Research_Papers_Export.xlsx");
    console.log("Excel file generated successfully");
    return true;
  } catch (error) {
    console.error("Error generating Excel file:", error);
    alert("Error generating Excel file. Please check console for details.");
    return false;
  }
};

// PDF Export Functions
export const exportToPDF = (filteredPapers, printOptions) => {
  try {
    const doc = new jsPDF();
    
    // Add title
    doc.setFontSize(18);
    doc.setTextColor(40, 40, 40);
    doc.text('Research Papers Report', 14, 22);
    
    // Add date
    doc.setFontSize(10);
    doc.setTextColor(100, 100, 100);
    doc.text(`Generated on: ${new Date().toLocaleDateString()}`, 14, 30);
    
    // Prepare data for table
    const tableColumn = [];
    const tableRows = [];
    
    // Add columns based on print options
    if (printOptions.paperDetailsToInclude.title) tableColumn.push('Paper Title');
    if (printOptions.paperDetailsToInclude.applicant) tableColumn.push('Applicant');
    if (printOptions.paperDetailsToInclude.department) tableColumn.push('Department');
    if (printOptions.paperDetailsToInclude.year) tableColumn.push('Year');
    if (printOptions.paperDetailsToInclude.status) tableColumn.push('Status');
    
    // Add rows
    filteredPapers.forEach(paper => {
      const tableRow = [];
      if (printOptions.paperDetailsToInclude.title) tableRow.push(paper.paperTitle || 'Untitled');
      if (printOptions.paperDetailsToInclude.applicant) tableRow.push(paper.applicantName || 'Unknown');
      if (printOptions.paperDetailsToInclude.department) tableRow.push(paper.department || 'Unknown');
      if (printOptions.paperDetailsToInclude.year) tableRow.push(paper.pubYear?.toString() || 'N/A');
      if (printOptions.paperDetailsToInclude.status) tableRow.push(paper.status || 'Unknown');
      
      tableRows.push(tableRow);
    });
    
    // Generate table
    doc.autoTable({
      head: [tableColumn],
      body: tableRows,
      startY: 40,
      theme: 'grid',
      styles: {
        fontSize: 8,
        cellPadding: 3,
        lineColor: [200, 200, 200],
      },
      headerStyles: {
        fillColor: [41, 98, 255],
        textColor: 255,
        fontSize: 9,
        fontStyle: 'bold',
      },
      alternateRowStyles: {
        fillColor: [240, 240, 240],
      },
    });
    
    // Add statistical summary if charts option is enabled
    if (printOptions.includeCharts) {
      const approved = filteredPapers.filter(p => p.status === 'approved').length;
      const pending = filteredPapers.filter(p => p.status === 'pending').length;
      const rejected = filteredPapers.filter(p => p.status === 'rejected').length;
      
      doc.addPage();
      doc.setFontSize(14);
      doc.setTextColor(40, 40, 40);
      doc.text('Statistical Summary', 14, 22);
      
      doc.autoTable({
        head: [['Status', 'Count', 'Percentage']],
        body: [
          ['Approved', approved.toString(), `${((approved / filteredPapers.length) * 100).toFixed(1)}%`],
          ['Pending', pending.toString(), `${((pending / filteredPapers.length) * 100).toFixed(1)}%`],
          ['Rejected', rejected.toString(), `${((rejected / filteredPapers.length) * 100).toFixed(1)}%`],
          ['Total', filteredPapers.length.toString(), '100%']
        ],
        startY: 30,
        theme: 'grid',
        styles: {
          fontSize: 10
        },
        headStyles: {
          fillColor: [41, 98, 255]
        }
      });
    }
    
    // Save the PDF
    doc.save('research_papers_report.pdf');
    return true;
  } catch (error) {
    console.error("Error generating PDF:", error);
    alert("Error generating PDF. Please try again.");
    return false;
  }
};
