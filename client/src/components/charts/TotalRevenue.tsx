import ReactApexChart from "react-apexcharts";
import { Box, Typography, Stack } from "@pankod/refine-mui";
import { useGetIdentity } from "@pankod/refine-core";
import { ApexOptions } from "apexcharts";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { TotalRevenueOptions, TotalRevenueSeries } from "./chart.config";
import { useEffect, useState } from "react";
import { API_BASE_URL } from "utils/api";
import { EarningProps } from "interfaces/earning";

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

type YearlyRevenue = {
  monthlyTotals: number[];
  total: number;
};

const TotalRevenue = () => {
  const { data: user } = useGetIdentity();
  const [totalRevenue, setTotalRevenue] = useState(0);
  const [series, setSeries] = useState(TotalRevenueSeries);
  const [chartOptions, setChartOptions] =
    useState<ApexOptions>(TotalRevenueOptions);
  const [yearlyRevenue, setYearlyRevenue] = useState<
    Record<string, YearlyRevenue>
  >({});
  const [selectedYear, setSelectedYear] = useState<string | null>(null);
  const baseURL = API_BASE_URL;

  useEffect(() => {
    const fetchEarnings = async () => {
      try {
        const query = user?.email
          ? `?email=${encodeURIComponent(user.email)}`
          : "";
        const response = await fetch(`${baseURL}/earnings${query}`);
        if (!response.ok) {
          throw new Error("Failed to fetch earnings");
        }
        const data: EarningProps[] = await response.json();
        const nextYearlyRevenue = data.reduce<Record<string, YearlyRevenue>>(
          (acc, earning) => {
            const endDate = new Date(earning.endDateOfWeek);
            const weeklyIncome = Number(earning.weeklyIncome) || 0;

            if (Number.isNaN(endDate.getTime())) return acc;

            const year = endDate.getFullYear().toString();
            const monthIndex = endDate.getMonth();

            if (!acc[year]) {
              acc[year] = {
                monthlyTotals: Array(12).fill(0),
                total: 0,
              };
            }

            acc[year].monthlyTotals[monthIndex] += weeklyIncome;
            acc[year].total += weeklyIncome;

            return acc;
          },
          {}
        );
        const years = Object.keys(nextYearlyRevenue).sort(
          (a, b) => Number(a) - Number(b)
        );
        const yearlyTotals = years.map((year) => nextYearlyRevenue[year].total);
        const sumOfEarnings = yearlyTotals.reduce(
          (sum, total) => sum + total,
          0
        );
        const activeMonthlyTotals = Object.values(nextYearlyRevenue).flatMap(
          ({ monthlyTotals }) => monthlyTotals.filter((total) => total > 0)
        );

        setTotalRevenue(sumOfEarnings);
        setYearlyRevenue(nextYearlyRevenue);
        setSeries([{ name: "Yearly Revenue", data: yearlyTotals }]);
        setChartOptions({
          ...TotalRevenueOptions,
          chart: {
            ...TotalRevenueOptions.chart,
            events: {
              dataPointSelection: (_event, _chartContext, config) => {
                const year = years[config.dataPointIndex];
                if (year) {
                  setSelectedYear(year);
                }
              },
            },
          },
          xaxis: {
            ...TotalRevenueOptions.xaxis,
            categories: years,
          },
        });
        localStorage.setItem(
          "averageIncome_allYears",
          activeMonthlyTotals.length
            ? (
                activeMonthlyTotals.reduce((sum, total) => sum + total, 0) /
                activeMonthlyTotals.length
              ).toString()
            : "0"
        );
      } catch (error) {
        console.error("Error fetching earnings:", error);
      }
    };

    fetchEarnings();
  }, [baseURL, user?.email]);

  const selectedYearRevenue = selectedYear ? yearlyRevenue[selectedYear] : null;
  const selectedMonthlyTotals =
    selectedYearRevenue?.monthlyTotals ?? Array(12).fill(0);
  const maxMonthlyRevenue = Math.max(...selectedMonthlyTotals, 1);

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
        series={series}
        type="bar"
        height={310}
        options={chartOptions}
      />

      <Dialog
        open={Boolean(selectedYear)}
        onClose={() => setSelectedYear(null)}
        fullWidth
        maxWidth="md"
        PaperProps={{
          sx: {
            borderRadius: "12px",
            boxShadow: "0 24px 80px rgba(17, 20, 45, 0.18)",
          },
        }}
      >
        <DialogTitle
          display="flex"
          alignItems="center"
          justifyContent="space-between"
          color="#11142d"
          fontWeight={600}
          sx={{ px: 3, pt: 3, pb: 1 }}
        >
          <Box>
            <Typography fontSize={18} fontWeight={700} color="#11142d">
              {selectedYear} Monthly Revenue
            </Typography>
            <Typography fontSize={13} color="#6b7280" mt={0.5}>
              Revenue grouped by weekly report end date
            </Typography>
          </Box>
          <IconButton
            aria-label="Close monthly revenue"
            onClick={() => setSelectedYear(null)}
            size="small"
            sx={{
              bgcolor: "#f3f4f8",
              color: "#11142d",
              "&:hover": { bgcolor: "#e7e9f2" },
            }}
          >
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ px: 3, pb: 3 }}>
          <Box
            display="flex"
            justifyContent="space-between"
            alignItems={{ xs: "flex-start", sm: "center" }}
            flexDirection={{ xs: "column", sm: "row" }}
            gap={1}
            py={2}
            borderTop="1px solid #eef1f6"
            borderBottom="1px solid #eef1f6"
          >
            <Box>
              <Typography fontSize={12} color="#6b7280">
                Year Total
              </Typography>
              <Typography fontSize={30} fontWeight={700} color="#11142d">
                ${selectedYearRevenue?.total.toLocaleString() ?? "0"}
              </Typography>
            </Box>
            <Typography fontSize={13} color="#6b7280">
              Highest month: $
              {Math.max(...selectedMonthlyTotals).toLocaleString()}
            </Typography>
          </Box>
          <Box
            display="grid"
            gridTemplateColumns="repeat(12, minmax(36px, 1fr))"
            gap={2}
            alignItems="end"
            minHeight={300}
            overflow="auto"
            pt={3}
            pb={1}
            sx={{
              background:
                "linear-gradient(to top, rgba(238, 241, 248, 0.75) 1px, transparent 1px)",
              backgroundSize: "100% 55px",
            }}
          >
            {selectedMonthlyTotals.map((monthlyTotal, index) => (
              <Box
                key={MONTHS[index]}
                display="flex"
                flexDirection="column"
                alignItems="center"
                gap={1}
                minWidth={36}
              >
                <Typography fontSize={12} fontWeight={600} color="#11142d" minHeight={18}>
                  ${monthlyTotal.toLocaleString()}
                </Typography>
                <Box
                  width="100%"
                  maxWidth={38}
                  height={220}
                  display="flex"
                  alignItems="end"
                  position="relative"
                >
                  <Box
                    width="100%"
                    height={`${Math.max(
                      (monthlyTotal / maxMonthlyRevenue) * 100,
                      monthlyTotal > 0 ? 4 : 0
                    )}%`}
                    position="relative"
                    borderRadius="5px 5px 3px 3px"
                    sx={{
                      bgcolor: "#475BE8",
                      transition: "height 180ms ease",
                    }}
                  />
                </Box>
                <Typography fontSize={12} color="#6b7280">
                  {MONTHS[index]}
                </Typography>
              </Box>
            ))}
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default TotalRevenue;
