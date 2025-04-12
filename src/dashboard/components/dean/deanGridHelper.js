export const getStatusColor = (status) => {
  switch (status) {
    case "approved":
      return "success";
    case "pending":
      return "warning";
    case "rejected":
      return "error";
    default:
      return "default";
  }
};

export const columns = [
  { field: "employeeId", headerName: "ID", flex: 1 },
  { field: "name", headerName: "Name", flex: 1 },
  { field: "userType", headerName: "User Type", flex: 1 },
  { field: "department", headerName: "Department", flex: 1 },
  { field: "email", headerName: "Email", flex: 1 },
  { field: "mobileNo", headerName: "Mobile No", flex: 1 },
  { field: "banned", headerName: "Banned", flex: 1 },
];

export const paperColumns = [
  { field: "applicantName", headerName: "Applicant Name", flex: 1 },
  { field: "paperTitle", headerName: "Paper Title", flex: 1 },
  { field: "department", headerName: "Department", flex: 1 },
  { field: "pubYear", headerName: "Publication Year", flex: 1 },
  { field: "status", headerName: "Status", flex: 1 },
];
