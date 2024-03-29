import { useList } from "@pankod/refine-core";
import { Typography, Box, Stack } from "@pankod/refine-mui";
import { Helmet } from "react-helmet";
import { PieChart, TotalRevenue } from "components";
import { SubjectCount } from "components/charts/SubjectCount";
import StudentCard from "components/common/StudentCard";

const Home = () => {
  const { data, isLoading, isError } = useList({
    resource: "students",
    config: {
      pagination: {
        pageSize: 25,
      },
    },
  });

  const latestStudents = data?.data ?? [];

  if (isLoading) return <Typography>Loading...</Typography>;
  if (isError) return <Typography>Something went wrong!</Typography>;

  const currentWeeklyIncomeSum = localStorage.getItem("currentWeeklyIncomeSum");
  const currentWeeklyHours = localStorage.getItem("currentWeeklyHours");
  const currentAverageHourlyRate = localStorage.getItem(
    "currentAverageHourlyRate"
  );
  const currentWeeklyStudents = localStorage.getItem("currentWeeklyStudents");

  // Targets for chart
  const targetWeeklyIncome = 1000;
  const targetWeeklyHours = 20;
  const targetAverageHourlyRate = 70;
  const targetWeeklyStudents = 25;

  return (
    <Box>
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
      <Typography variant="h1" fontSize="2rem" fontWeight={700} color="#11142D">
        Dashboard
      </Typography>

      <Box mt="2rem" display="flex" flexWrap="wrap" gap="1rem">
        <PieChart
          title="Weekly Earning"
          value={`$${parseFloat(currentWeeklyIncomeSum ?? "0").toString()}`}
          series={[
            parseFloat(currentWeeklyIncomeSum ?? "0"),
            targetWeeklyIncome - parseFloat(currentWeeklyIncomeSum ?? "0"),
          ]}
          colors={["#275be8", "#c4e8ef"]}
        />

        <PieChart
          title="Weekly Hours"
          value={currentWeeklyHours ?? "0"}
          series={[
            parseFloat(currentWeeklyHours ?? "0"),
            targetWeeklyHours - parseFloat(currentWeeklyHours ?? "0"),
          ]}
          colors={["#275be8", "#c4e8ef"]}
        />
        <PieChart
          title="Weekly Students"
          value={currentWeeklyStudents ?? "0"}
          series={[
            parseFloat(currentWeeklyStudents ?? "0"),
            targetWeeklyStudents - parseFloat(currentWeeklyStudents ?? "0"),
          ]}
          colors={["#275be8", "#c4e8ef"]}
        />
        <PieChart
          title="Weekly Hourly Rate"
          value={`$${parseFloat(currentAverageHourlyRate ?? "0").toFixed(2)}`}
          series={[
            parseFloat(currentAverageHourlyRate ?? "0"),
            targetAverageHourlyRate -
              parseFloat(currentAverageHourlyRate ?? "0"),
          ]}
          colors={["#275be8", "#c4e8ef"]}
        />
      </Box>

      <Stack
        mt="1.5rem"
        width="100%"
        direction={{ xs: "column", lg: "row" }}
        gap="1rem"
      >
        <TotalRevenue />
        <SubjectCount />
      </Stack>

      <Box
        flex={1}
        borderRadius="15px"
        padding="20px"
        bgcolor="#fcfcfc"
        display="flex"
        flexDirection="column"
        mt="1.5rem"
      >
        <Typography variant="h2" fontSize="1.5rem" fontWeight={600} color="#11142d">
          Latest Students
        </Typography>

        <Box mt="1.25rem" display="flex" flexWrap="wrap" gap="1rem">
          {latestStudents
            .slice(-4)
            .reverse()
            .map((student) => (
              <StudentCard
                key={student._id}
                id={student._id}
                studentName={student.studentName}
                year={student.year}
                baseRate={student.baseRate}
                subject={student.subject}
                status={student.status}
              />
            ))}
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
