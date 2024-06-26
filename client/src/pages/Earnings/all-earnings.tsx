import { useState, useEffect } from "react";
import { useNavigate } from "@pankod/refine-react-router-v6";
import { Helmet } from "react-helmet";
import { styled } from "@mui/system";
import { CustomButton } from "components";
import axios from "axios";

import {
  Box,
  Stack,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
} from "@mui/material";
import { Add } from "@mui/icons-material";
import { format } from "date-fns";
import HighlightCard from "components/charts/HighlightCard";
import { EarningProps } from "../../interfaces/earning";

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: "#989ea4",
  borderRadius: "20px",
}));

const AllEarnings: React.FC = () => {
  const navigate = useNavigate();
  const currentYear = new Date().getFullYear();
  const [allEarnings, setAllEarnings] = useState<EarningProps[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;
  const baseURL =
    process.env.NODE_ENV === "development"
      ? "http://localhost:5005/api/v1"
      : "https://lesson-ledger-api.vercel.app/api/v1";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(
          `${baseURL}/earnings`
        );
        setAllEarnings(response.data);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
  }, [baseURL]);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  // Sort earnings by startDateOfWeek by latest earning
  const sortedEarnings = allEarnings.sort(
    (a, b) =>
      new Date(b.startDateOfWeek).getTime() -
      new Date(a.startDateOfWeek).getTime()
  );
  const earningsToShow = sortedEarnings.slice(startIndex, endIndex);

  const totalEarnings = allEarnings.reduce(
    (acc, earning) => acc + Number(earning.weeklyIncome),
    0
  );
  const totalHours = allEarnings.reduce(
    (acc, earning) => acc + Number(earning.weeklyHours),
    0
  );
  localStorage.setItem("totalRevenue", totalEarnings.toString());

  // Calculate average weekly income
  const averageWeeklyIncome = totalEarnings / allEarnings.length;
  localStorage.setItem("averageWeeklyIncome", averageWeeklyIncome.toString());

  const averageWeeklyHours = totalHours / allEarnings.length;
  localStorage.setItem("averageWeeklyHours", averageWeeklyHours.toString());
  const averageHourlyRate = totalEarnings / totalHours;

  return (
    <Box>
      <Helmet>
        <title>All Earnings</title>
      </Helmet>
      <Box mt="20px" sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
        <Stack direction="column" width="100%">
          <Typography variant="h1" fontSize="2rem" fontWeight={700} color="#11142D">
            {allEarnings.length
              ? `All Earnings (${currentYear})`
              : "There are no earnings"}
          </Typography>
          <Box mt="20px" display={"flex"} flexWrap={"wrap"} gap={4}>
            <HighlightCard
              title="Total Earnings"
              value={`$${totalEarnings.toFixed(2)}`}
              color="#F0F0F0"
            />
            <HighlightCard
              title="Total Hours"
              value={totalHours.toString()}
              color="#F0F0F0"
            />
            <HighlightCard
              title="Average Hourly Rate"
              value={`$${averageHourlyRate.toFixed(2)}`}
              color="#F0F0F0"
            />
          </Box>
          <Box
            mb={2}
            mt={3}
            display="flex"
            width="84%"
            justifyContent="space-between"
            flexWrap="wrap"
          >
            <Box
              display="flex"
              gap={2}
              flexWrap="wrap"
              mb={{ xs: "20px", sm: 0 }}
            >
              <Stack
                direction="row"
                width="100%"
                justifyContent="space-between"
                gap={2}
                mt={2}
              >
                <CustomButton
                  title="Add Earning"
                  handleClick={() => navigate("/earnings/create")}
                  backgroundColor="#7982ff"
                  color="#fcfcfc"
                  icon={<Add />}
                />
              </Stack>
            </Box>
          </Box>
        </Stack>
      </Box>

      <Box mt="20px" borderRadius="30px" overflow="hidden">
        <TableContainer>
          <Table>
            <TableBody
              sx={{
                backgroundColor: "#ffffff",
                borderRadius: "15px",
                padding: "15px",
                boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)"
              }}
            >
              <StyledTableRow>
                <TableCell
                  align="center"
                  style={{ fontWeight: "bold", textTransform: "uppercase" }}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight={700}
                    color="#f8f9fa"
                    fontSize={{ xs: "12px", md: "16px" }}
                  >
                    Start Date
                  </Typography>
                </TableCell>
                <TableCell
                  align="center"
                  style={{ fontWeight: "bold", textTransform: "uppercase" }}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight={700}
                    color="#f8f9fa"
                    fontSize={{ xs: "12px", md: "16px" }}
                  >
                    End Date
                  </Typography>
                </TableCell>
                <TableCell
                  align="center"
                  style={{ fontWeight: "bold", textTransform: "uppercase" }}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight={700}
                    color="#f8f9fa"
                    fontSize={{ xs: "12px", md: "16px" }}
                  >
                    Hours
                  </Typography>
                </TableCell>
                <TableCell
                  align="center"
                  style={{ fontWeight: "bold", textTransform: "uppercase" }}
                >
                  <Typography
                    variant="subtitle1"
                    fontWeight={700}
                    color="#f8f9fa"
                    fontSize={{ xs: "12px", md: "16px" }}
                  >
                    Income
                  </Typography>
                </TableCell>
              </StyledTableRow>

              {earningsToShow.map((earning) => (
                <TableRow key={earning._id}>
                  <TableCell align="center">
                    {format(new Date(earning.startDateOfWeek), "dd/MM/yyyy")}
                  </TableCell>
                  <TableCell align="center">
                    {format(new Date(earning.endDateOfWeek), "dd/MM/yyyy")}
                  </TableCell>
                  <TableCell align="center">{earning.weeklyHours}</TableCell>
                  <TableCell align="center">${earning.weeklyIncome}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
        {/* Pagination controls */}
        <Box
          mt="20px"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          {/* Previous button */}
          <button
            disabled={currentPage === 1}
            onClick={() => setCurrentPage(currentPage - 1)}
            style={{
              marginRight: "10px",
              padding: "8px 16px",
              borderRadius: "5px",
              backgroundColor: currentPage === 1 ? "#ccc" : "#475be8",
              color: "#fff",
              cursor: currentPage === 1 ? "not-allowed" : "pointer",
              outline: "none",
              border: "none",
            }}
          >
            Previous
          </button>
          {/* Page number */}
          <Typography variant="body1" style={{ margin: "0 10px" }}>
            Page {currentPage} of {Math.ceil(allEarnings.length / pageSize)}
          </Typography>
          {/* Next button */}
          <button
            disabled={endIndex >= allEarnings.length}
            onClick={() => setCurrentPage(currentPage + 1)}
            style={{
              padding: "8px 16px",
              borderRadius: "5px",
              backgroundColor:
                endIndex >= allEarnings.length ? "#ccc" : "#475be8",
              color: "#fff",
              cursor:
                endIndex >= allEarnings.length ? "not-allowed" : "pointer",
              outline: "none",
              border: "none",
            }}
          >
            Next
          </button>
        </Box>
      </Box>
    </Box>
  );
};

export default AllEarnings;
