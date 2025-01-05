import { ApexOptions } from "apexcharts";

export let TotalRevenueSeries: { name: string; data: number[] }[] = [
  {
    name: new Date().getFullYear().toString(),
    data: Array(12).fill(0),
  },
  {
    name: (new Date().getFullYear() - 1).toString(),
    data: Array(12).fill(0),
  },
];

export const TotalRevenueOptions: ApexOptions = {
  chart: {
    type: "bar",
    toolbar: {
      show: false,
    },
  },
  colors: ["#475BE8", "#CFC8FF"],
  plotOptions: {
    bar: {
      borderRadius: 4,
      horizontal: false,
      columnWidth: "55%",
    },
  },
  dataLabels: {
    enabled: false,
  },
  grid: {
    show: false,
  },
  stroke: {
    colors: ["transparent"],
    width: 4,
  },
  xaxis: {
    categories: [
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
    ],
  },
  yaxis: {
    title: {
      text: "$",
    },
  },
  fill: {
    opacity: 1,
  },
  legend: {
    position: "top",
    horizontalAlign: "right",
  },
  tooltip: {
    y: {
      formatter(val: number) {
        return `$ ${val}`;
      },
    },
  },
};

const baseURL =
  process.env.NODE_ENV === "development"
    ? "http://localhost:5005/api/v1"
    : "https://lesson-ledger-api.vercel.app/api/v1";

// Fetch yearly earnings data from the API
fetch(`${baseURL}/yearly-earnings`)
  .then((response) => {
    if (!response.ok) {
      throw new Error("Failed to fetch yearly earnings");
    }
    return response.json();
  })
  .then((data) => {
    let totalIncome = 0;
    let totalMonths = 0;

    // Process the fetched data and update TotalRevenueSeries
    data.forEach((yearlyEarning: any) => {
      const year = yearlyEarning.year.toString();
      const currentYear = new Date().getFullYear();
      const previousYear = (currentYear - 1).toString();
      const yearIndex = year === previousYear ? 1 : 0;

      // Update the monthly earnings data for the corresponding year
      yearlyEarning.monthlyEarnings.forEach(
        (monthlyEarning: any, index: number) => {
          TotalRevenueSeries[yearIndex].data[index] =
            monthlyEarning.monthlyIncome;
        }
      );

      // Accumulate total income and total months
      yearlyEarning.monthlyEarnings.forEach((monthlyEarning: any) => {
        totalIncome += monthlyEarning.monthlyIncome;
        totalMonths += 1;
      });
    });

    // Calculate average monthly income across all years
    const averageIncome = totalIncome / totalMonths;

    // Store average monthly income in local storage
    localStorage.setItem("averageIncome_allYears", averageIncome.toString());
  })
  .catch((error) => {
    console.error("Error fetching yearly earnings:", error);
  });
