import ReactApexChart from "react-apexcharts";
import { Box, Typography, Stack } from "@pankod/refine-mui";

import { TotalRevenueOptions, TotalRevenueSeries } from "./chart.config";
import { useEffect, useState } from "react";

const TotalRevenue = () => {
  const [totalRevenue, setTotalRevenue] = useState(0);

  useEffect(() => {
    // Retrieve totalRevenue from localStorage
    const storedTotalRevenue = localStorage.getItem("totalRevenue");

    // Update state with the retrieved totalRevenue
    if (storedTotalRevenue) {
      setTotalRevenue(parseFloat(storedTotalRevenue));
    }
  }, []);
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
