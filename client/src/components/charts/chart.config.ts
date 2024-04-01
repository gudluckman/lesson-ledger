import { ApexOptions } from "apexcharts";

export let TotalRevenueSeries = [
  {
    name: "2024",
    data: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  {
    name: "2023",
    data: [
      300, 300, 385, 410, 420, 721.5, 1050.5, 1073.5, 2345, 2016, 1237, 1360,
    ],
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
    // Process the fetched data and update TotalRevenueSeries
    data.forEach((yearlyEarning: any) => {
      const year = yearlyEarning.year.toString();
      const yearIndex = year === "2023" ? 1 : 0;

      // Update the monthly earnings data for the corresponding year
      yearlyEarning.monthlyEarnings.forEach(
        (monthlyEarning: any, index: number) => {
          TotalRevenueSeries[yearIndex].data[index] =
            monthlyEarning.monthlyIncome;
        }
      );

      // Calculate average monthly income
      const monthlyIncomes = yearlyEarning.monthlyEarnings.map(
        (monthlyEarning: any) => monthlyEarning.monthlyIncome
      );
      const totalIncome = monthlyIncomes.reduce(
        (acc: number, income: number) => acc + income,
        0
      );
      const averageIncome = totalIncome / monthlyIncomes.length;

      // Store average monthly income in local storage
      localStorage.setItem(`averageIncome_${year}`, averageIncome.toString());
    });
  })
  .catch((error) => {
    console.error("Error fetching yearly earnings:", error);
  });
