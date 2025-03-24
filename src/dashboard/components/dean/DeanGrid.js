import * as React from "react";
import Box from "@mui/material/Box";
import Copyright from "../../internals/components/Copyright";
import API from "../../../api/axios";
import { Chip } from "@mui/material";
import CancelIcon from "@mui/icons-material/Cancel";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import PendingIcon from "@mui/icons-material/Pending";
import { UserManagement } from "./UserManagement";
import { ResearchPapers } from "./ResearchPapers";
import { QuestionManagement } from "./QuestionManagement";
import { PaperDetailsModal, QuestionDetailsModal } from "./Modals";
import {
  getStatusColor,
  columns,
  paperColumns, // Make sure paperColumns is imported
  questionColumns,
  questionTypeOptions,
} from "./deanGridHelper";

export default function DeanGrid() {
  const [usersData, setUsersData] = React.useState([]);
  const [researchPapersData, setResearchPapersData] = React.useState([]);
  const [selectedPaper, setSelectedPaper] = React.useState(null);
  const [openPaperModal, setOpenPaperModal] = React.useState(false);
  const [questions, setQuestions] = React.useState([]);
  const [openQuestionModal, setOpenQuestionModal] = React.useState(false);
  const [selectedQuestion, setSelectedQuestion] = React.useState(null);
  const [questionUpdateModel, setQuestionUpdateModel] = React.useState(null);
  const [dropdownOptions, setDropdownOptions] = React.useState([]);
  const [searchText, setSearchText] = React.useState("");
  const [paperFilter, setPaperFilter] = React.useState("all");
  const [tabValue, setTabValue] = React.useState(0);

  const fetchQuestions = async () => {
    try {
      const response = await API.get("/dean/question");
      console.log(response.data);

      const questions = await response.data.map((question) => ({
        id: question._id,
        options: question.options,
        questionText: question.questionText,
        questionType: question.questionType,
        required: question.isRequired,
      }));

      setQuestions(questions);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await API.get("/dean/accounts");
      const users = response.data.map((user) => ({
        id: user._id,
        employeeId: user.employeeId,
        name: user.name,
        email: user.email,
        mobileNo: user.mobileNumber,
        department: user.department,
        userType: user.userType,
        banned: user.isBanned,
      }));
      const updatedUsers = users.filter(
        (user) => user.userType !== "competentAuthority"
      );

      setUsersData(updatedUsers);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const fetchPapers = async () => {
    try {
      const response = await API.get("/dean/research-papers");

      const papers = response.data.map((paper) => {
        const paperDetails = paper.paperDetails;
        // Map questionText to answer
        const researchPaperData = Object.entries(paperDetails).map(
          ([key, value], index) => {
            return {
              questionText: value.questionText,
              answer: value.answer,
            };
          }
        );

        console.log(researchPaperData);

        return {
          id: paper._id,
          applicantName: paper.applicantName,
          department: paper.department,
          paperTitle: paper.paperTitle,
          status: paper.status,
          pubYear: paper.pubYear,
          researchPaperData: researchPaperData,
        };
      });

      setResearchPapersData(papers);
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  React.useEffect(() => {
    fetchQuestions();
  }, []);
  // Fetch users data from backend
  React.useEffect(() => {
    fetchUsers();
  }, []);

  React.useEffect(() => {
    fetchPapers();
  }, [selectedPaper]);

  const handleResearchRowClick = (params) => {
    setSelectedPaper(params.row);
    setOpenPaperModal(true);
  };
  const handleQuestionRowClick = (params) => {
    console.log(params.row);
    setSelectedQuestion(params?.row);
    setOpenQuestionModal(true);
  };

  const handleClosePaperModal = () => {
    setOpenPaperModal(false);
    setSelectedPaper(null);
  };
  const handleCloseQuestionModal = () => {
    setOpenQuestionModal(false);
    setSelectedQuestion(null);
  };
  const handleCloseUpdateQuestionModal = () => {
    setQuestionUpdateModel(false);
  };

  const handleQuestionTypeChange = (event) => {
    setSelectedQuestion({
      ...selectedQuestion,
      questionType: event.target.value,
    });
  };

  const handleOptionChange = (index, event) => {
    const updatedOptions = [...dropdownOptions];
    updatedOptions[index] = event.target.value;
    setDropdownOptions(updatedOptions);
    setSelectedQuestion({
      ...selectedQuestion,
      options: updatedOptions,
    });
  };

  const handleAddOption = () => {
    setDropdownOptions([...dropdownOptions, ""]);
  };

  const handleRemoveOption = (index) => {
    const updatedOptions = [...dropdownOptions];
    updatedOptions.splice(index, 1);
    setDropdownOptions(updatedOptions);
    setSelectedQuestion({
      ...selectedQuestion,
      options: updatedOptions,
    });
  };

  const handleUpdateStatus = async (status) => {
    if (!selectedPaper) return;

    try {
      await API.put(`/dean/research-papers/${selectedPaper.id}/status`, {
        status,
        comments: null, // You can allow the user to add comments if needed
      });
      fetchPapers();

      alert(`Research paper ${status}`);
      setOpenPaperModal(false); // Close modal after action
    } catch (error) {
      console.error("Failed to update research paper status:", error);
      alert("Failed to update status. Please try again.");
    }
  };

  const enhancedPaperColumns = React.useMemo(() => {
    if (!paperColumns) {
      return [];
    }
    return [
      ...paperColumns.slice(0, 4),
      {
        field: "status",
        headerName: "Status",
        flex: 1,
        renderCell: (params) => (
          <Chip
            label={params.value}
            color={getStatusColor(params.value)}
            size="small"
            icon={
              params.value === "approved" ? (
                <CheckCircleIcon />
              ) : params.value === "pending" ? (
                <PendingIcon />
              ) : (
                <CancelIcon />
              )
            }
          />
        ),
      },
    ];
  }, []);
  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      {/* Users Section */}
      <UserManagement
        usersData={usersData}
        setUsersData={setUsersData}
        columns={columns}
        fetchUsers={fetchUsers}
        searchText={searchText}
        setSearchText={setSearchText}
      />

      {/* Research Papers Section */}
      <ResearchPapers
        researchPapersData={researchPapersData}
        handleResearchRowClick={handleResearchRowClick}
        searchText={searchText}
        setSearchText={setSearchText}
        paperFilter={paperFilter}
        setPaperFilter={setPaperFilter}
        tabValue={tabValue}
        setTabValue={setTabValue}
        getStatusColor={getStatusColor}
        enhancedPaperColumns={enhancedPaperColumns}
      />

      {/* Question Management Section */}
      <QuestionManagement
        questions={questions}
        questionColumns={questionColumns}
        handleQuestionRowClick={handleQuestionRowClick}
        selectedQuestion={selectedQuestion}
        setSelectedQuestion={setSelectedQuestion}
        dropdownOptions={dropdownOptions}
        setDropdownOptions={setDropdownOptions}
        questionTypeOptions={questionTypeOptions}
        handleQuestionTypeChange={handleQuestionTypeChange}
        handleOptionChange={handleOptionChange}
        handleAddOption={handleAddOption}
        handleRemoveOption={handleRemoveOption}
        fetchQuestions={fetchQuestions}
        API={API}
      />

      {/* Paper Details Modal */}
      <PaperDetailsModal
        openPaperModal={openPaperModal}
        handleClosePaperModal={handleClosePaperModal}
        selectedPaper={selectedPaper}
        handleUpdateStatus={handleUpdateStatus}
      />

      {/* Question Details Modal */}
      <QuestionDetailsModal
        openQuestionModal={openQuestionModal}
        handleCloseQuestionModal={handleCloseQuestionModal}
        selectedQuestion={selectedQuestion}
        setQuestionUpdateModel={setQuestionUpdateModel}
        setDropdownOptions={setDropdownOptions}
        fetchQuestions={fetchQuestions}
        API={API}
        questionUpdateModel={questionUpdateModel}
        handleCloseUpdateQuestionModal={handleCloseUpdateQuestionModal}
        questionTypeOptions={questionTypeOptions}
        handleQuestionTypeChange={handleQuestionTypeChange}
        handleOptionChange={handleOptionChange}
        handleAddOption={handleAddOption}
        handleRemoveOption={handleRemoveOption}
        dropdownOptions={dropdownOptions}
        setSelectedQuestion={setSelectedQuestion}
        setOpenQuestionModal={setOpenQuestionModal} // Add this line
      />

      <Copyright sx={{ mt: 6, mb: 4, textAlign: "center" }} />
    </Box>
  );
}
