import { ApexOptions } from "apexcharts";

export const TotalRevenueSeries = [
  {
    name: "2024",
    data: [2085, 2190, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  {
    name: "2023",
    data: [300, 300, 385, 410, 420, 721.50, 1050.5, 1073.5, 2345, 2016, 1237, 1360],
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
      text: "$ (thousands)",
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
        return `$ ${val} thousands`;
      },
    },
  },
};
