import { useState } from "react";
import { useNavigate } from "@pankod/refine-react-router-v6";
import { Helmet } from "react-helmet";
import { useTable } from "@pankod/refine-core";
import { styled } from '@mui/system';
import { CustomButton } from "components";
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
import moneyBackground from "assets/money_bg.png";
import clockBackground from "assets/clock_bg.png";
import coinBackground from "assets/coin_bg.png";

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  backgroundColor: '#989ea4',
  borderRadius: '20px', 
}));

const AllEarnings = () => {
  const navigate = useNavigate();
  const {
    tableQueryResult: { data, isLoading, isError },
  } = useTable();

  const allEarnings = data?.data ?? [];

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 7;

  const startIndex = (currentPage - 1) * pageSize;
  const endIndex = currentPage * pageSize;

  const earningsToShow = allEarnings.slice(startIndex, endIndex);
  const reversedEarningsToShow = [...earningsToShow].reverse();

  if (isLoading) return <Typography>Loading...</Typography>;
  if (isError) return <Typography>Error...</Typography>;

  let totalEarnings = 0;
  let totalHours = 0;
  allEarnings.forEach((earning) => {
    totalEarnings += Number(earning.weeklyIncome);
    totalHours += Number(earning.weeklyHours);
  });
  const averageHourlyRate = totalEarnings / totalHours;

  return (
    <Box>
      <Helmet>
        <title>All Earnings</title>
      </Helmet>
      <Box mt="20px" sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
        <Stack direction="column" width="100%">
          <Typography fontSize={25} fontWeight={700} color="#11142d">
            {allEarnings.length
              ? "All Earnings (Year 2024)"
              : "There are no earnings"}
          </Typography>
          <Box mt="20px" display={"flex"} flexWrap={"wrap"} gap={4}>
            <HighlightCard
              title="Total Earnings"
              value={`$${totalEarnings.toFixed(2)}`}
              backgroundImage={moneyBackground}
            />
            <HighlightCard
              title="Total Hours"
              value={totalHours.toString()}
              backgroundImage={clockBackground}
            />
            <HighlightCard
              title="Average Hourly Rate"
              value={`$${averageHourlyRate.toFixed(2)}`}
              backgroundImage={coinBackground}
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

      <Box mt="20px">
        <TableContainer>
          <Table>
            <TableBody
              sx={{
                backgroundColor: "#ffffff",
                borderRadius: "15px",
                padding: "15px",
              }}
            >
              <StyledTableRow>
                <TableCell
                  align="center"
                  style={{ fontWeight: "bold", textTransform: "uppercase" }}
                >
                  <Typography variant="subtitle1" fontWeight={700} color="#f8f9fa">Start Date</Typography>
                </TableCell>
                <TableCell
                  align="center"
                  style={{ fontWeight: "bold", textTransform: "uppercase" }}
                >
                  <Typography variant="subtitle1" fontWeight={700} color="#f8f9fa">End Date</Typography>
                </TableCell>
                <TableCell
                  align="center"
                  style={{ fontWeight: "bold", textTransform: "uppercase" }}
                >
                  <Typography variant="subtitle1" fontWeight={700} color="#f8f9fa">Weekly Hours</Typography>
                </TableCell>
                <TableCell
                  align="center"
                  style={{ fontWeight: "bold", textTransform: "uppercase" }}
                >
                  <Typography variant="subtitle1" fontWeight={700} color="#f8f9fa">Weekly Income</Typography>
                </TableCell>
              </StyledTableRow>

              {reversedEarningsToShow.map((earning) => (
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
