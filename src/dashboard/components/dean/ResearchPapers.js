import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  Grid,
  Card,
  CardContent,
  Tabs,
  Tab,
  InputAdornment,
  IconButton,
  Paper,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  FormControlLabel,
  Checkbox,
  FormGroup,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import ArticleIcon from "@mui/icons-material/Article";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import CancelIcon from "@mui/icons-material/Cancel";
import SearchIcon from "@mui/icons-material/Search";
import CloseIcon from "@mui/icons-material/Close";
import PrintIcon from "@mui/icons-material/Print";
import DownloadIcon from "@mui/icons-material/Download";
import { PapersPreviewTable } from "./PapersPreviewTable";
import { exportToExcel, exportToPDF } from "./exportUtils";

export const ResearchPapers = ({
  researchPapersData,
  handleResearchRowClick,
  searchText,
  setSearchText,
  paperFilter,
  setPaperFilter,
  tabValue,
  setTabValue,
  getStatusColor,
  enhancedPaperColumns,
  isLoading,
}) => {
  const [printModalOpen, setPrintModalOpen] = useState(false);
  const [exportFormat, setExportFormat] = useState("pdf");

  const totalPapers = researchPapersData.length;
  const approvedPapers = researchPapersData.filter(
    (paper) => paper.status === "approved"
  ).length;
  const pendingPapers = researchPapersData.filter(
    (paper) => paper.status === "pending"
  ).length;
  const rejectedPapers = researchPapersData.filter(
    (paper) => paper.status === "rejected"
  ).length;

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const filteredPapers = React.useMemo(() => {
    return researchPapersData.filter((paper) => {
      const matchesFilter =
        paperFilter === "all" || paper.status === paperFilter;
      const matchesSearch =
        !searchText ||
        paper.paperTitle.toLowerCase().includes(searchText.toLowerCase()) ||
        paper.applicantName.toLowerCase().includes(searchText.toLowerCase()) ||
        paper.department.toLowerCase().includes(searchText.toLowerCase());
      return matchesFilter && matchesSearch;
    });
  }, [researchPapersData, paperFilter, searchText]);

  const [printOptions, setPrintOptions] = useState({
    paperDetailsToInclude: {
      title: true,
      applicant: true,
      department: true,
      year: true,
      status: true,
    },
    includeCharts: false,
  });

  const handleExport = async () => {
    if (exportFormat === "excel") {
      await exportToExcel();
    } else {
      await exportToPDF(filteredPapers, printOptions);
    }
    setPrintModalOpen(false);
  };

  return (
    <Paper elevation={3} sx={{ p: 3, mb: 4 }}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          mb: 3,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <ArticleIcon sx={{ fontSize: 28, mr: 1, color: "#1976d2" }} />
          <Typography
            component="h2"
            variant="h5"
            sx={{ fontWeight: "medium", color: "#1976d2" }}
          >
            Research Papers
          </Typography>
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button
            variant="outlined"
            startIcon={<PrintIcon />}
            onClick={() => setPrintModalOpen(true)}
            size="small"
          >
            Print/Export Options
          </Button>
          <TextField
            placeholder="Search papers..."
            size="small"
            variant="outlined"
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon />
                </InputAdornment>
              ),
              endAdornment: searchText && (
                <InputAdornment position="end">
                  <IconButton size="small" onClick={() => setSearchText("")}>
                    <CloseIcon fontSize="small" />
                  </IconButton>
                </InputAdornment>
              ),
            }}
            sx={{ width: 250 }}
          />
        </Box>
      </Box>

      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              bgcolor: "#f5f5f5",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              cursor: "pointer",
              borderLeft: paperFilter === "all" ? "4px solid #1976d2" : "none",
              "&:hover": { bgcolor: "#f0f0f0" },
            }}
            onClick={() => setPaperFilter("all")}
          >
            <CardContent
              sx={{
                py: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Total Papers
                </Typography>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: "medium", mt: 0.5 }}
                >
                  {totalPapers}
                </Typography>
              </Box>
              <ArticleIcon sx={{ fontSize: 40, color: "#616161", opacity: 0.8 }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              bgcolor: "#f0f7f0",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              cursor: "pointer",
              borderLeft: paperFilter === "approved" ? "4px solid #4caf50" : "none",
              "&:hover": { bgcolor: "#e8f5e9" },
            }}
            onClick={() => setPaperFilter("approved")}
          >
            <CardContent
              sx={{
                py: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Approved
                </Typography>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: "medium", mt: 0.5 }}
                >
                  {approvedPapers}
                </Typography>
              </Box>
              <CheckCircleIcon
                sx={{ fontSize: 40, color: "#4caf50", opacity: 0.8 }}
              />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              bgcolor: "#fff8e1",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              cursor: "pointer",
              borderLeft: paperFilter === "pending" ? "4px solid #ff9800" : "none",
              "&:hover": { bgcolor: "#ffecb3" },
            }}
            onClick={() => setPaperFilter("pending")}
          >
            <CardContent
              sx={{
                py: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Pending
                </Typography>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: "medium", mt: 0.5 }}
                >
                  {pendingPapers}
                </Typography>
              </Box>
              <PendingIcon sx={{ fontSize: 40, color: "#ff9800", opacity: 0.8 }} />
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} sm={6} md={3}>
          <Card
            sx={{
              bgcolor: "#ffebee",
              boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
              cursor: "pointer",
              borderLeft: paperFilter === "rejected" ? "4px solid #f44336" : "none",
              "&:hover": { bgcolor: "#ffcdd2" },
            }}
            onClick={() => setPaperFilter("rejected")}
          >
            <CardContent
              sx={{
                py: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <Box>
                <Typography variant="subtitle2" color="text.secondary">
                  Rejected
                </Typography>
                <Typography
                  variant="h4"
                  sx={{ fontWeight: "medium", mt: 0.5 }}
                >
                  {rejectedPapers}
                </Typography>
              </Box>
              <CancelIcon sx={{ fontSize: 40, color: "#f44336", opacity: 0.8 }} />
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Box sx={{ borderBottom: 1, borderColor: "divider", mb: 2 }}>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          aria-label="research paper tabs"
          indicatorColor="primary"
          textColor="primary"
        >
          <Tab
            icon={<ArticleIcon />}
            iconPosition="start"
            label="All Papers"
            value={0}
          />
          <Tab
            icon={<PendingIcon />}
            iconPosition="start"
            label="Pending"
            value={1}
          />
          <Tab
            icon={<CheckCircleIcon />}
            iconPosition="start"
            label="Approved"
            value={2}
          />
          <Tab
            icon={<CancelIcon />}
            iconPosition="start"
            label="Rejected"
            value={3}
          />
        </Tabs>
      </Box>

      <Box sx={{ height: 400, width: "100%" }}>
        <DataGrid
          rows={filteredPapers}
          columns={enhancedPaperColumns}
          pageSize={5}
          rowsPerPageOptions={[5, 10, 20]}
          onRowClick={handleResearchRowClick}
          sx={{
            "& .MuiDataGrid-cell:hover": { color: "primary.main" },
            border: "none",
            borderRadius: 2,
            boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            "& .MuiDataGrid-row": {
              "&:nth-of-type(odd)": {
                backgroundColor: "rgba(0, 0, 0, 0.02)",
              },
            },
            "& .approved-row": {
              borderLeft: "4px solid #4caf50",
            },
            "& .pending-row": {
              borderLeft: "4px solid #ff9800",
            },
            "& .rejected-row": {
              borderLeft: "4px solid #f44336",
            },
          }}
          getRowClassName={(params) => params.row.status}
          disableSelectionOnClick
          components={{
            NoRowsOverlay: () => (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                  height: "100%",
                }}
              >
                <Typography variant="h6" color="text.secondary">
                  No Research Papers
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  No papers match your filters
                </Typography>
              </Box>
            ),
          }}
        />
      </Box>

      <Dialog
        open={printModalOpen}
        onClose={() => setPrintModalOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Print/Export Options
          <IconButton size="small" onClick={() => setPrintModalOpen(false)}>
            <CloseIcon fontSize="small" />
          </IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ mb: 3, mt: 1 }}>
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel id="export-format-label">Export Format</InputLabel>
              <Select
                labelId="export-format-label"
                id="export-format"
                value={exportFormat}
                label="Export Format"
                onChange={(e) => setExportFormat(e.target.value)}
              >
                <MenuItem value="pdf">PDF Document</MenuItem>
                <MenuItem value="excel">Excel Spreadsheet</MenuItem>
              </Select>
            </FormControl>

            {exportFormat === "pdf" && (
              <>
                <Typography variant="subtitle1" gutterBottom>
                  Paper Details to Include:
                </Typography>
                <FormGroup>
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={printOptions.paperDetailsToInclude.title}
                            onChange={(e) =>
                              setPrintOptions({
                                ...printOptions,
                                paperDetailsToInclude: {
                                  ...printOptions.paperDetailsToInclude,
                                  title: e.target.checked,
                                },
                              })
                            }
                          />
                        }
                        label="Paper Title"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={
                              printOptions.paperDetailsToInclude.applicant
                            }
                            onChange={(e) =>
                              setPrintOptions({
                                ...printOptions,
                                paperDetailsToInclude: {
                                  ...printOptions.paperDetailsToInclude,
                                  applicant: e.target.checked,
                                },
                              })
                            }
                          />
                        }
                        label="Applicant Name"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={
                              printOptions.paperDetailsToInclude.department
                            }
                            onChange={(e) =>
                              setPrintOptions({
                                ...printOptions,
                                paperDetailsToInclude: {
                                  ...printOptions.paperDetailsToInclude,
                                  department: e.target.checked,
                                },
                              })
                            }
                          />
                        }
                        label="Department"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={printOptions.paperDetailsToInclude.year}
                            onChange={(e) =>
                              setPrintOptions({
                                ...printOptions,
                                paperDetailsToInclude: {
                                  ...printOptions.paperDetailsToInclude,
                                  year: e.target.checked,
                                },
                              })
                            }
                          />
                        }
                        label="Publication Year"
                      />
                    </Grid>
                    <Grid item xs={6}>
                      <FormControlLabel
                        control={
                          <Checkbox
                            checked={printOptions.paperDetailsToInclude.status}
                            onChange={(e) =>
                              setPrintOptions({
                                ...printOptions,
                                paperDetailsToInclude: {
                                  ...printOptions.paperDetailsToInclude,
                                  status: e.target.checked,
                                },
                              })
                            }
                          />
                        }
                        label="Status"
                      />
                    </Grid>
                  </Grid>
                </FormGroup>

                <FormControlLabel
                  control={
                    <Checkbox
                      checked={printOptions.includeCharts}
                      onChange={(e) =>
                        setPrintOptions({
                          ...printOptions,
                          includeCharts: e.target.checked,
                        })
                      }
                    />
                  }
                  label="Include Charts and Graphs"
                />
              </>
            )}

            {exportFormat === "excel" && (
              <Box
                sx={{
                  p: 2,
                  bgcolor: "rgba(25, 118, 210, 0.08)",
                  borderRadius: 1,
                }}
              >
                <Typography variant="body1" gutterBottom>
                  The Excel export will include:
                </Typography>
                <ul style={{ paddingLeft: "20px", marginTop: 0 }}>
                  <li>A complete list of all research papers with details</li>
                  <li>
                    Author funding information with category-based rules applied
                  </li>
                  <li>Certificate-ready list of papers and authors</li>
                </ul>
                <Typography variant="body2" color="text.secondary">
                  Note: For the Commendable Research category, authors receive
                  funding from a maximum of three highest-paying papers. For
                  other categories, there is no limit.
                </Typography>
              </Box>
            )}
          </Box>

          {exportFormat === "pdf" && (
            <Box sx={{ mt: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Preview
              </Typography>
              <PapersPreviewTable
                filteredPapers={() => filteredPapers}
                printOptions={printOptions}
              />
            </Box>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setPrintModalOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={handleExport}
            startIcon={
              exportFormat === "excel" ? <DownloadIcon /> : <PrintIcon />
            }
            disabled={isLoading}
          >
            {exportFormat === "excel" ? "Export to Excel" : "Print PDF"}
          </Button>
        </DialogActions>
      </Dialog>
    </Paper>
  );
};