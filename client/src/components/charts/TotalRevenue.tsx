import ReactApexChart from "react-apexcharts";
import { Box, Typography, Stack } from "@pankod/refine-mui";

import { TotalRevenueOptions, TotalRevenueSeries } from "./chart.config";
import { useEffect, useState } from "react";

const TotalRevenue = () => {
  const [totalRevenue, setTotalRevenue] = useState(0);
  const baseURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5005/api/v1"
    : "https://lesson-ledger-api.vercel.app/api/v1";
    
  useEffect(() => {
    const fetchYearlyEarnings = async () => {
      try {
        const response = await fetch(`${baseURL}/yearly-earnings`);
        if (!response.ok) {
          throw new Error("Failed to fetch yearly earnings");
        }
        const data = await response.json();
        const sumOfYearlyEarnings = data.reduce((sum: any, item: { totalRevenue: any; }) => sum + item.totalRevenue, 0);

        // Update state with the new total revenue
        setTotalRevenue(sumOfYearlyEarnings);
      } catch (error) {
        console.error("Error fetching yearly earnings:", error);
      }
    };

    fetchYearlyEarnings();
  }, [baseURL]);
  const localStorageKeys = Object.keys(localStorage);

  // Iterate over the keys
  localStorageKeys.forEach((key) => {
    console.log(`Key: ${key}, Value: ${localStorage.getItem(key)}`);
    // You can access the value associated with each key using localStorage.getItem(key)
  });
  return (
    <Box
      p={4}
      flex={1}
      bgcolor="#fcfcfc"
      id="chart"
      display="flex"
      flexDirection="column"
      borderRadius="15px"
    >
      <Typography fontSize={18} fontWeight={600} color="#11142d">
        Total Revenue
      </Typography>

      <Stack my="20px" direction="row" gap={4} flexWrap="wrap">
        <Typography fontSize={28} fontWeight={700} color="#11142d">
          ${totalRevenue.toLocaleString()}
        </Typography>
      </Stack>

      <ReactApexChart
        series={TotalRevenueSeries}
        type="bar"
        height={310}
        options={TotalRevenueOptions}
      />
    </Box>
  );
};

export default TotalRevenue;
