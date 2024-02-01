import {
  Typography,
  Box,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import { useDelete, useGetIdentity, useShow } from "@pankod/refine-core";
import { useParams, useNavigate } from "@pankod/refine-react-router-v6";
import { ChatBubble, Delete, Edit, Phone } from "@mui/icons-material";
import { CustomButton } from "components";

const StudentDetails = () => {
  const navigate = useNavigate();
  const { data: user } = useGetIdentity();
  const { queryResult } = useShow();
  const { mutate } = useDelete();
  const { id } = useParams();

  const { data, isLoading, isError } = queryResult;
  const studentDetails = data?.data ?? {};

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Something went wrong!</div>;
  }

  const isCurrentUser = user.email === studentDetails.tutor.email;

  const formatTime = (time: { split: (arg0: string) => [any, any]; }) => {
    const [hour, minute] = time.split(":");
    let period = "AM";

    if (parseInt(hour) >= 12) {
      period = "PM";
    }

    return `${hour}:${minute} ${period}`;
  };

  const renderTableRows = () => {
    const fields = [
      { label: "Name", value: studentDetails.studentName },
      { label: "Parent Name", value: studentDetails.parentName },
      { label: "Gender", value: studentDetails.gender },
      { label: "Academic Year", value: studentDetails.year },
      { label: "Subject", value: studentDetails.subject },
      { label: "Rate", value: `$${studentDetails.baseRate}/hr` },
      { label: "Expected hour", value: studentDetails.sessionHoursPerWeek },
      {
        label: "Time slot",
        value: `${studentDetails.day}, ${formatTime(
          studentDetails.startTime
        )} - ${formatTime(studentDetails.endTime)}`,
      },
      { label: "Lesson delivery", value: studentDetails.delivery },
      { label: "Lesson status", value: studentDetails.status },
      { label: "Session type", value: studentDetails.sessionType },
      { label: "Session mode", value: studentDetails.sessionMode },
      { label: "Source", value: studentDetails.source },
    ];

    return fields.map((field, index) => (
      <TableRow key={index}>
        <TableCell style={{ padding: "8px" }}>
          <Typography variant="subtitle1" fontWeight="bold">
            {field.label}
          </Typography>
        </TableCell>
        <TableCell>
          <Typography variant="body1">{field.value}</Typography>
        </TableCell>
      </TableRow>
    ));
  };

  const handleDeleteStudent = () => {
    // eslint-disable-next-line no-restricted-globals
    const response = confirm("Are you sure you want to delete this student?");
    if (response) {
      mutate(
        {
          resource: "students",
          id: id as string,
        },
        {
          onSuccess: () => {
            navigate("/students");
          },
        }
      );
    }
  };

  return (
    <Box
      height="100vh"
      display="flex"
      alignItems="center"
      justifyContent="center"
    >
      <Box width="80%" maxWidth={1200}>
        <Box borderRadius="15px" padding="20px" bgcolor="#FCFCFC">
          <Typography
            fontSize={25}
            fontWeight={700}
            color="#11142D"
            gutterBottom
          >
            Student Details
          </Typography>

          <TableContainer>
            <Table size="small">
              <TableBody>{renderTableRows()}</TableBody>
            </Table>
          </TableContainer>

          <Stack
            direction="row"
            justifyContent="space-between"
            spacing={2}
            mt={4}
          >
            <CustomButton
              title={!isCurrentUser ? "Message" : "Edit"}
              backgroundColor="#475BE8"
              color="#FCFCFC"
              icon={!isCurrentUser ? <ChatBubble /> : <Edit />}
              handleClick={() => {
                if (isCurrentUser) {
                  navigate(`/students/edit/${studentDetails._id}`);
                }
              }}
            />
            <CustomButton
              title={!isCurrentUser ? "Call" : "Delete"}
              backgroundColor={!isCurrentUser ? "#2ED480" : "#d42e2e"}
              color="#FCFCFC"
              icon={!isCurrentUser ? <Phone /> : <Delete />}
              handleClick={() => {
                if (isCurrentUser) handleDeleteStudent();
              }}
            />
          </Stack>
        </Box>
      </Box>
    </Box>
  );
};

export default StudentDetails;
