import { SetStateAction, useEffect, useState } from "react";
import { Box, Stack, Typography, Card, CardContent, Grid } from "@mui/material";
import { Helmet } from "react-helmet";
import Chart from "react-apexcharts";
import ContactPageIcon from "@mui/icons-material/ContactPage";
import GroupsIcon from "@mui/icons-material/Groups";
import RequestQuoteIcon from "@mui/icons-material/RequestQuote";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import BarChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";
import axios from "axios";
import StatisticCard from "components/charts/StatisticCard";
import ReactApexChart from "react-apexcharts";
import { Theme, useMediaQuery, useTheme } from "@pankod/refine-mui";
interface WeeklyIncomeData {
  weeklyIncome: number;
  weeklyHours: number;
  startDateOfWeek: string;
}

const baseURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5005/api/v1"
    : "https://lesson-ledger-api.vercel.app/api/v1";

const Statistics = () => {
  const [subjectDistribution, setSubjectDistribution] = useState([]);
  const [yearGroupDistribution, setYearGroupDistribution] = useState([]);
  const [weeklyIncomes, setWeeklyIncomes] = useState<WeeklyIncomeData[]>([]);

  const [averageMonthlyIncome, setAverageMonthlyIncome] = useState<number>(0);
  const [averageWeeklyIncome, setAverageWeeklyIncome] = useState<number>(0);
  const [averageWeeklyHour, setAverageWeeklyHour] = useState<number>(0);

  useEffect(() => {
    // Retrieve average income from local storage
    const currentYear = new Date().getFullYear();
    const averageIncomeFromLocalStorage = localStorage.getItem(
      `averageIncome_${currentYear}`
    );
    if (averageIncomeFromLocalStorage) {
      setAverageMonthlyIncome(parseFloat(averageIncomeFromLocalStorage));
    }

    const averageWeeklyIncomeFromLocalStorage =
      localStorage.getItem(`averageWeeklyIncome`);
    if (averageWeeklyIncomeFromLocalStorage) {
      setAverageWeeklyIncome(parseFloat(averageWeeklyIncomeFromLocalStorage));
    }

    const averageWeeklyHourFromLocalStorage =
      localStorage.getItem(`averageWeeklyHours`);
    if (averageWeeklyHourFromLocalStorage) {
      setAverageWeeklyHour(parseFloat(averageWeeklyHourFromLocalStorage));
    }
  }, []);

  useEffect(() => {
    const fetchAllData = async () => {
      const fetchData = async (
        url: string,
        sortingFn: { (a: any, b: any): any; (a: any, b: any): number },
        setData: {
          (value: SetStateAction<never[]>): void;
          (value: SetStateAction<never[]>): void;
          (arg0: any): void;
        }
      ) => {
        try {
          const response = await axios.get(url);
          const sortedData = sortingFn
            ? response.data.sort(sortingFn)
            : response.data;
          setData(sortedData);
        } catch (error) {
          console.error("Error fetching data:", error);
        }
      };

      const aggregateWeeklyData = (data: any[]) => {
        const aggregated = data.reduce<Record<string, WeeklyIncomeData>>(
          (acc, curr) => {
            const week = curr.startDateOfWeek;
            if (!acc[week]) {
              acc[week] = {
                weeklyIncome: 0,
                weeklyHours: 0,
                startDateOfWeek: week,
              };
            }
            acc[week].weeklyIncome += curr.weeklyIncome || 0;
            acc[week].weeklyHours += curr.weeklyHours || 0;
            return acc;
          },
          {}
        );

        // Convert aggregated data into an array sorted by date
        return Object.entries(aggregated)
          .map(([week, values]) => ({
            ...values,
          }))
          .sort(
            (a, b) =>
              new Date(a.startDateOfWeek).getTime() -
              new Date(b.startDateOfWeek).getTime()
          );
      };

      const fetchAndAggregateData = async () => {
        try {
          const earningsResponse = await axios.get(`${baseURL}/earnings`);
          const aggregatedData = aggregateWeeklyData(earningsResponse.data);
          setWeeklyIncomes(aggregatedData);
        } catch (error) {
          console.error("Error fetching and aggregating data:", error);
        }
      };

      await Promise.all([
        fetchAndAggregateData(),
        fetchData(
          `${baseURL}/students/statistics/subject-distribution`,
          (a, b) => a._id.localeCompare(b._id),
          setSubjectDistribution
        ),
        fetchData(
          `${baseURL}/students/statistics/year-group-distribution`,
          (a, b) =>
            parseInt(a._id.replace(/\D/g, "")) -
            parseInt(b._id.replace(/\D/g, "")),
          setYearGroupDistribution
        ),
      ]);
    };

    fetchAllData();
  }, []);

  const theme = useTheme();
  const isWidthLessThanLg = useMediaQuery(theme.breakpoints.down("lg"));
  const isWidthGreaterThanSm = useMediaQuery(theme.breakpoints.up("sm"));
  const isWidthGreaterThanLG = useMediaQuery(theme.breakpoints.up("lg"));
  const isWidthGreaterThanXL = useMediaQuery(theme.breakpoints.up("xl"));
  const isWidthLessThanXL = useMediaQuery(theme.breakpoints.down("xl"));
  const chartHeight = isWidthGreaterThanLG && isWidthLessThanXL ? 335 : 312;

  const chartData = {
    series: subjectDistribution.map(
      (subject: { count: number }) => subject.count
    ),
    options: {
      labels: subjectDistribution.map(
        (subject: { _id: string }) => subject._id
      ),
      colors: ["#4BC0C0", "#36A2EB", "#FFCE56", "#FF6384", "#9966FF"],
      legend: {
        show:
          (isWidthLessThanLg || isWidthGreaterThanXL) && isWidthGreaterThanSm,
      },
    },
  };

  const barData = {
    series: [
      {
        name: "Student Count",
        data: yearGroupDistribution.map(
          (group: { count: number }) => group.count
        ),
      },
    ],
    options: {
      chart: {
        height: 350,
        type: "bar",
        toolbar: {
          show: false,
        },
      },
      plotOptions: {
        bar: {
          horizontal: false,
        },
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        categories: yearGroupDistribution.map(
          (group: { _id: string }) => group._id
        ),
        labels: {
          formatter: function (val: string | number) {
            return `Year ${val}`;
          },
        },
      },
      yaxis: {
        title: {
          text: "Number of Students",
        },
      },
      colors: ["#ff781f"],
      legend: {
        show: true,
      },
    },
  };

  const lineChartIncomeData = {
    series: [
      {
        name: "Income",
        data: weeklyIncomes.map(
          (income: { weeklyIncome: number }) => income.weeklyIncome
        ),
      },
    ],
    options: {
      chart: {
        height: 300,
        type: "area",
        toolbar: {
          show: false,
        },
      },
      stroke: {
        width: 3,
        curve: "smooth",
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        type: "datetime",
        categories: weeklyIncomes.map(
          (income: { startDateOfWeek: string }) => income.startDateOfWeek
        ),
        labels: {
          show: false,
          format: "dd/MM/yyyy",
        },
      },
      yaxis: {
        title: {
          text: "Income per week",
        },
      },
      colors: ["#06c258"],
      legend: {
        show: false,
      },
    },
  };

  const lineChartHoursData = {
    series: [
      {
        name: "Hours",
        data: weeklyIncomes.map(
          (income: { weeklyHours: number }) => income.weeklyHours
        ),
      },
    ],
    options: {
      chart: {
        height: 300,
        type: "area",
        toolbar: {
          show: false,
        },
      },
      stroke: {
        width: 3,
        curve: "smooth",
      },
      dataLabels: {
        enabled: false,
      },
      xaxis: {
        type: "datetime",
        categories: weeklyIncomes.map(
          (income: { startDateOfWeek: string }) => income.startDateOfWeek
        ),
        labels: {
          show: false,
          format: "dd/MM/yyyy",
        },
      },
      yaxis: {
        title: {
          text: "Income per week",
        },
      },
      colors: ["#29bbff"],
      legend: {
        show: false,
      },
    },
  };
  const isXs = useMediaQuery((theme: Theme) => theme.breakpoints.down("xs"));

  return (
    <Box>
      <Helmet>
        <title>Statistics</title>
      </Helmet>
      <Box mt="20px" sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
        <Stack direction="column" width="100%">
          <Typography
            variant="h1"
            fontSize="2rem"
            fontWeight={700}
            color="#11142d"
          >
            Statistics
          </Typography>
        </Stack>
        <Grid container spacing={3} justifyContent="center" alignItems="center">
          {/* Student distribution by subject and year group chart */}
          <Grid item xs={12} md={10} lg={6}>
            <Card
              sx={{
                width: "100%",
                padding: "10px",
                borderRadius: "10px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                textDecoration: "none",
                color: "inherit",
                marginBottom: { xs: 0, md: "10px" },
              }}
            >
              <CardContent>
                <Stack direction="row" spacing={1} alignItems="center">
                  <ContactPageIcon sx={{ fontSize: 28 }} />
                  <Typography
                    variant="subtitle1"
                    fontWeight={500}
                    sx={{ textAlign: "start" }}
                  >
                    Students By Subject
                  </Typography>
                </Stack>
                <Chart
                  options={{
                    ...chartData.options,
                  }}
                  series={chartData.series}
                  type="pie"
                  height={chartHeight}
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={10} lg={6}>
            <Card
              sx={{
                width: "100%",
                padding: "10px",
                borderRadius: "10px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                textDecoration: "none",
                color: "inherit",
                marginBottom: { xs: 0, md: "10px" },
              }}
            >
              <CardContent>
                <Stack direction="row" spacing={1} alignItems="center">
                  <GroupsIcon sx={{ fontSize: 28 }} />
                  <Typography
                    variant="subtitle1"
                    fontWeight={500}
                    sx={{ textAlign: "start" }}
                  >
                    Students By Year Group
                  </Typography>
                </Stack>
                <BarChart
                  options={barData.options as ApexOptions}
                  series={barData.series}
                  type="bar"
                  height={300}
                />
              </CardContent>
            </Card>
          </Grid>

          <Grid item xs={12} md={10} lg={12}>
            <Box
              bgcolor="#ffffff"
              display={"flex"}
              justifyContent={{
                xs: "center",
                md: "space-between",
                lg: "space-between",
              }}
              alignContent={"center"}
              sx={{
                width: "100%",
                padding: "10px",
                borderRadius: "10px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                textDecoration: "none",
                color: "inherit",
                marginBottom: { xs: 0, md: "10px" },
                gap: "10px",
                flexWrap: "wrap",
              }}
            >
              <Box
                display="flex"
                flexDirection={{ xs: "column", lg: "row" }}
                justifyContent="center"
                width="100%"
              >
                <StatisticCard
                  title="Average Weekly Income"
                  value={`$${averageWeeklyIncome.toFixed(2)}`}
                />
                <StatisticCard
                  title="Average Weekly Hours"
                  value={`${averageWeeklyHour.toFixed(2)}`}
                  border={isXs ? "none" : "1px solid #ccc"}
                />
                <StatisticCard
                  title="Average Monthly Income"
                  value={`$${averageMonthlyIncome.toFixed(2)}`}
                />
              </Box>
            </Box>
          </Grid>

          {/* Income & Hours statistics charts */}
          <Grid item xs={12} md={10} lg={6}>
            <Card
              sx={{
                width: "100%",
                padding: "10px",
                borderRadius: "10px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                textDecoration: "none",
                color: "inherit",
                marginBottom: { xs: 0, md: "10px" },
              }}
            >
              <CardContent>
                <Stack direction="row" spacing={1} alignItems="center">
                  <RequestQuoteIcon sx={{ fontSize: 28 }} />
                  <Typography
                    variant="subtitle1"
                    fontWeight={500}
                    sx={{ textAlign: "start" }}
                  >
                    Weekly Income Trends
                  </Typography>
                </Stack>
                <ReactApexChart
                  options={lineChartIncomeData.options as ApexOptions}
                  series={lineChartIncomeData.series}
                  type="area"
                  width="100%"
                  height={300}
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={10} lg={6}>
            <Card
              sx={{
                width: "100%",
                padding: "10px",
                borderRadius: "10px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                textDecoration: "none",
                color: "inherit",
                marginBottom: { xs: 0, md: "10px" },
              }}
            >
              <CardContent>
                <Stack direction="row" spacing={1} alignItems="center">
                  <AccessTimeIcon sx={{ fontSize: 28 }} />
                  <Typography
                    variant="subtitle1"
                    fontWeight={500}
                    sx={{ textAlign: "start" }}
                  >
                    Weekly Hours Trends
                  </Typography>
                </Stack>
                <ReactApexChart
                  options={lineChartHoursData.options as ApexOptions}
                  series={lineChartHoursData.series}
                  type="area"
                  width="100%"
                  height={300}
                />
              </CardContent>
            </Card>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};

export default Statistics;
