import {
  SchoolRounded,
  MonetizationOn,
  BookOutlined as BookOutlinedIcon,
  AutorenewOutlined,
} from "@mui/icons-material";
import { Link } from "@pankod/refine-react-router-v6";
import { Typography, Box, Card, CardContent, Stack } from "@pankod/refine-mui";

import { StudentCardProps } from "interfaces/student";

const StudentCard = ({
  id,
  studentName,
  year,
  baseRate,
  subject,
  status,
}: StudentCardProps) => {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "#4CAF50";
      case "Pending":
        return "#FFA500";
      case "Inactive":
        return "#FF5733";
      default:
        return "transparent";
    }
  };

  return (
    <Card
      component={Link}
      to={`/students/show/${id}`}
      sx={{
        width: "100%",
        padding: "10px",
        borderRadius: "10px",
        boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
        transition: "transform 0.2s",
        textDecoration: "none",
        color: "inherit",
        "&:hover": {
          transform: "translateY(-4px)",
          boxShadow: "0 8px 16px rgba(0, 0, 0, 0.2)",
        },
      }}
      elevation={0}
    >
      <CardContent
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Stack direction="column" spacing={1} alignItems="flex-start">
          <Stack direction="row" spacing={2} alignItems="center">
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "#dadefa",
                borderRadius: "50%",
                width: "40px",
                height: "40px",
              }}
            >
              <Typography variant="subtitle1" fontWeight={500} color="#475be8">
                {studentName
                  .match(/\b(\w)/g)
                  ?.join("")
                  .toUpperCase()}
              </Typography>
            </Box>
            <Typography variant="subtitle1" fontWeight={500} color="#11142d">
              {studentName}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <SchoolRounded sx={{ fontSize: 18, color: "#808191" }} />
            <Typography variant="body2" color="#808191">
              Year {year}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <BookOutlinedIcon sx={{ fontSize: 18, color: "#808191" }} />
            <Typography variant="body2" color="#808191">
              {subject}
            </Typography>
          </Stack>
          <Stack direction="row" spacing={1} alignItems="center">
            <Box
              component="div"
              sx={{
                backgroundColor: getStatusColor(status),
                color: "#ffffff",
                border: `2px solid ${getStatusColor(status)}`,
                borderRadius: "4px",
                padding: "4px 8px",
              }}
            >
              <Stack direction="row" spacing={1} alignItems="center">
                <AutorenewOutlined sx={{ fontSize: 18, color: "#808191" }} />
              <Typography variant="body2" fontWeight={600}>
                {status}
              </Typography>
              </Stack>
            </Box>
          </Stack>
        </Stack>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            bgcolor: "#dadefa",
            borderRadius: "4px",
            padding: "2px 8px",
          }}
        >
          <MonetizationOn sx={{ fontSize: 18, color: "#475be8" }} />
          <Typography variant="body2" fontWeight={600} color="#475be8">
            {baseRate}
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StudentCard;
