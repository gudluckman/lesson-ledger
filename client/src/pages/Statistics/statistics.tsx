import React from "react";
import { Box, Stack, Typography, Card, CardContent, Grid } from "@mui/material";
import { Helmet } from "react-helmet";
import Chart from "react-apexcharts";
import ContactPageIcon from "@mui/icons-material/ContactPage";
import GroupsIcon from "@mui/icons-material/Groups";
import BarChart from "react-apexcharts";
import { ApexOptions } from "apexcharts";

const Statistics = () => {
  // Example data for the pie chart
  const data = {
    series: [9, 3, 1, 1, 1],
    options: {
      labels: [
        "Math",
        "Engineering Studies",
        "English",
        "Software Design Development",
        "Information Processes Technology",
      ],
      colors: ["#FF6384", "#36A2EB", "#FFCE56", "#4BC0C0", "#9966FF"],
      legend: {
        show: true,
      },
    },
  };

  const data2 = {
    series: [
      {
        name: "Student Count",
        data: [8, 5, 7, 4, 6, 9],
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
        categories: ["Year 7", "Year 8", "Year 9", "Year 10", "Year 11", "Year 12"],
      },
      yaxis: {
        title: {
          text: "Number of Students",
        },
      },
      colors: ["#96D74C"],
      legend: {
        show: true,
      },
    },
  };

  return (
    <Box>
      <Helmet>
        <title>Statistics</title>
      </Helmet>
      <Box mt="20px" sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
        <Stack direction="column" width="100%">
          <Typography fontSize={25} fontWeight={700} color="#11142d">
            Statistics
          </Typography>
          <Typography fontSize={14} fontWeight={400}>
            Still In Development...
          </Typography>
        </Stack>
        <Grid container spacing={3} justifyContent="center" alignItems="center">
          <Grid item xs={12} md={10} lg={6}>
            <Card
              sx={{
                width: "100%",
                padding: "10px",
                borderRadius: "10px",
                boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                textDecoration: "none",
                color: "inherit",
                marginBottom: { xs: 0, md: "20px" },
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
                  options={data.options}
                  series={data.series}
                  type="pie"
                  width="100%"
                  height={360}
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
                marginBottom: { xs: 0, md: "20px" },
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
                  options={data2.options as ApexOptions}
                  series={data2.series}
                  type="bar"
                  height={350}
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
