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
import { PrintOptionsDialog } from "./PrintOptionsDialog";

const PrintResearchPapers = ({
  open,
  onClose,
  researchPapersData,
  columns,
}) => {
  const printRef = useRef(null);
  const [printOptions, setPrintOptions] = useState({
    showShareAmount: false,
    filterByUser: false,
    filterByStatus: false,
    filterByYear: false,
    filterByDepartment: false,
    filterByAwardAmount: false,
    filterByAuthorCount: false,
    filterByKeywords: false,
    filterByAuthorType: false,
    limitTopPapersPerUser: false,
    topPapersCount: 3,
    userId: "",
    status: "all",
    year: "",
    department: "",
    minAwardAmount: 0,
    maxAwardAmount: 1000000,
    minAuthors: 1,
    maxAuthors: 10,
    keywords: "",
    authorType: "all", // "all", "internal", "external"
    includeAllDetails: true,
    paperDetailsToInclude: {
      title: true,
      applicant: true,
      department: true,
      year: true,
      status: true,
      totalAwardAmount: true,
      authorCount: false,
    },
    sortBy: "awardAmount", // "awardAmount", "year", "title"
    sortDirection: "desc", // "asc", "desc"
  });

  // Extract unique users, departments, and years from data
  const uniqueUsers = [
    ...new Set(researchPapersData.map((paper) => paper.applicantName)),
  ];
  const uniqueDepartments = [
    ...new Set(researchPapersData.map((paper) => paper.department)),
  ];
  const uniqueYears = [
    ...new Set(researchPapersData.map((paper) => paper.pubYear)),
  ];

  // Calculate max award amount for slider
  const maxPossibleAward = Math.max(
    ...researchPapersData.map((paper) => paper.totalAwardAmount || 0),
    100000
  );

  // Calculate max author count for slider
  const maxPossibleAuthors = Math.max(
    ...researchPapersData.map((paper) =>
      paper.authors ? paper.authors.length : 1
    ),
    10
  );

  const handleOptionChange = (event) => {
    const { name, checked, value } = event.target;

    if (name.includes(".")) {
      const [parent, child] = name.split(".");
      setPrintOptions((prev) => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: checked !== undefined ? checked : value,
        },
      }));
    } else if (
      [
        "status",
        "userId",
        "year",
        "department",
        "authorType",
        "sortBy",
        "sortDirection",
        "topPapersCount",
      ].includes(name)
    ) {
      setPrintOptions((prev) => ({
        ...prev,
        [name]: value,
      }));
    } else {
      setPrintOptions((prev) => ({
        ...prev,
        [name]: checked !== undefined ? checked : value,
      }));
    }
  };

  const handleSliderChange = (name, newValue) => {
    setPrintOptions((prev) => ({
      ...prev,
      [name]: newValue,
    }));
  };

  // Group papers by user (either main applicant or any author)
  const groupPapersByUser = (papers) => {
    const userPapers = {};

    papers.forEach((paper) => {
      // Add paper to main applicant's group
      if (!userPapers[paper.applicantName]) {
        userPapers[paper.applicantName] = [];
      }
      userPapers[paper.applicantName].push(paper);

      // Also add paper to each author's group if they're different from applicant
      if (paper.authors && paper.authors.length > 0) {
        paper.authors.forEach((author) => {
          if (author.name && author.name !== paper.applicantName) {
            if (!userPapers[author.name]) {
              userPapers[author.name] = [];
            }
            // Add the paper if it's not already in this user's list
            if (!userPapers[author.name].some((p) => p.id === paper.id)) {
              userPapers[author.name].push(paper);
            }
          }
        });
      }
    });

    return userPapers;
  };

  // Get top N papers for each user by award amount
  const getTopPapersPerUser = (papers, topCount) => {
    const userPapers = groupPapersByUser(papers);

    // For each user, sort their papers by award amount and take top N
    const topPapersPerUser = {};
    Object.keys(userPapers).forEach((user) => {
      const sortedPapers = [...userPapers[user]].sort(
        (a, b) => (b.totalAwardAmount || 0) - (a.totalAwardAmount || 0)
      );
      topPapersPerUser[user] = sortedPapers.slice(0, topCount);
    });

    // Flatten the results while removing duplicates
    const seen = new Set();
    const result = [];

    Object.values(topPapersPerUser)
      .flat()
      .forEach((paper) => {
        if (!seen.has(paper.id)) {
          seen.add(paper.id);
          result.push(paper);
        }
      });

    return result;
  };

  // Main function to filter papers based on all criteria
  const filteredPapers = () => {
    let filtered = [...researchPapersData];

    // Apply user filter
    if (printOptions.filterByUser && printOptions.userId) {
      filtered = filtered.filter((paper) => {
        if (paper.applicantName === printOptions.userId) return true;
        if (
          paper.authors &&
          paper.authors.some((author) => author.name === printOptions.userId)
        )
          return true;
        return false;
      });
    }

    // Apply status filter
    if (printOptions.filterByStatus && printOptions.status !== "all") {
      filtered = filtered.filter(
        (paper) => paper.status === printOptions.status
      );
    }

    // Apply year filter
    if (printOptions.filterByYear && printOptions.year) {
      filtered = filtered.filter(
        (paper) => paper.pubYear === printOptions.year
      );
    }

    // Apply department filter
    if (printOptions.filterByDepartment && printOptions.department) {
      filtered = filtered.filter(
        (paper) => paper.department === printOptions.department
      );
    }

    // Apply award amount filter
    if (printOptions.filterByAwardAmount) {
      filtered = filtered.filter((paper) => {
        const amount = paper.totalAwardAmount || 0;
        return (
          amount >= printOptions.minAwardAmount &&
          amount <= printOptions.maxAwardAmount
        );
      });
    }

    // Apply author count filter
    if (printOptions.filterByAuthorCount) {
      filtered = filtered.filter((paper) => {
        const authorCount = paper.authors ? paper.authors.length : 1;
        return (
          authorCount >= printOptions.minAuthors &&
          authorCount <= printOptions.maxAuthors
        );
      });
    }

    // Apply keywords filter
    if (printOptions.filterByKeywords && printOptions.keywords.trim()) {
      const keywords = printOptions.keywords
        .toLowerCase()
        .split(",")
        .map((k) => k.trim());
      filtered = filtered.filter((paper) => {
        // Search in paper title
        if (
          paper.paperTitle &&
          keywords.some((keyword) =>
            paper.paperTitle.toLowerCase().includes(keyword)
          )
        ) {
          return true;
        }

        // Search in paper details
        if (paper.researchPaperData) {
          for (const data of paper.researchPaperData) {
            if (
              data.questionText &&
              keywords.some((keyword) =>
                data.questionText.toLowerCase().includes(keyword)
              )
            ) {
              return true;
            }
            if (
              data.answer &&
              keywords.some((keyword) =>
                data.answer.toLowerCase().includes(keyword)
              )
            ) {
              return true;
            }
          }
        }

        return false;
      });
    }

    // Apply author type filter
    if (printOptions.filterByAuthorType && printOptions.authorType !== "all") {
      filtered = filtered.filter((paper) => {
        if (!paper.authors || paper.authors.length === 0) return false;

        if (printOptions.authorType === "internal") {
          return paper.authors.some((author) => !author.isExternal);
        } else if (printOptions.authorType === "external") {
          return paper.authors.some((author) => author.isExternal);
        }
        return true;
      });
    }

    // Apply sorting
    filtered.sort((a, b) => {
      if (printOptions.sortBy === "awardAmount") {
        return printOptions.sortDirection === "asc"
          ? (a.totalAwardAmount || 0) - (b.totalAwardAmount || 0)
          : (b.totalAwardAmount || 0) - (a.totalAwardAmount || 0);
      } else if (printOptions.sortBy === "year") {
        return printOptions.sortDirection === "asc"
          ? a.pubYear.localeCompare(b.pubYear)
          : b.pubYear.localeCompare(a.pubYear);
      } else if (printOptions.sortBy === "title") {
        return printOptions.sortDirection === "asc"
          ? a.paperTitle.localeCompare(b.paperTitle)
          : b.paperTitle.localeCompare(a.paperTitle);
      }
      return 0;
    });

    // Apply top papers per user limit if share amount is shown
    if (printOptions.showShareAmount && printOptions.limitTopPapersPerUser) {
      filtered = getTopPapersPerUser(filtered, printOptions.topPapersCount);
    }

    return filtered;
  };

  return (
    <>
      <PrintOptionsDialog
        open={open}
        onClose={onClose}
        printOptions={printOptions}
        setPrintOptions={setPrintOptions}
        uniqueUsers={uniqueUsers}
        uniqueDepartments={uniqueDepartments}
        uniqueYears={uniqueYears}
        maxPossibleAward={maxPossibleAward}
        maxPossibleAuthors={maxPossibleAuthors}
        filteredPapers={filteredPapers}
        printRef={printRef} // Pass the printRef to the dialog
      />

      <div ref={printRef} style={{ display: "none" }}>
        {/* Print content will be generated dynamically */}
      </div>
    </>
  );
};

export default PrintResearchPapers;
