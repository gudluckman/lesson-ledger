import { useList } from "@pankod/refine-core";
import { Typography, Box, Stack } from "@pankod/refine-mui";
import { Helmet } from 'react-helmet';
import { PieChart, TotalRevenue } from "components";
import { StudentReferrals } from "components/charts/StudentReferrals";
import StudentCard from "components/common/StudentCard";

const Home = () => {
  const { data, isLoading, isError } = useList({
    resource: "students",
    config: {
      pagination: {
        pageSize: 4,
      },
    },
  });

  const latestStudents = data?.data ?? [];

  if (isLoading) return <Typography>Loading...</Typography>;
  if (isError) return <Typography>Something went wrong!</Typography>;

  return (
    <Box>
      <Helmet>
        <title>Dashboard</title>
      </Helmet>
      <Typography fontSize={25} fontWeight={700} color="#11142D">
        Dashboard
      </Typography>

      <Box mt="20px" display={"flex"} flexWrap={"wrap"} gap={4}>
        <PieChart
          title="Weekly Earning"
          value="$490"
          series={[75, 25]}
          colors={["#275be8", "#c4e8ef"]}
        />
        <PieChart
          title="Weekly Hours"
          value="9"
          series={[75, 25]}
          colors={["#275be8", "#c4e8ef"]}
        />
        <PieChart
          title="Weekly Hourly Rate"
          value="$61.11"
          series={[75, 25]}
          colors={["#275be8", "#c4e8ef"]}
        />
        <PieChart
          title="Weekly Students"
          value="8"
          series={[75, 25]}
          colors={["#275be8", "#c4e8ef"]}
        />
      </Box>

      <Stack
        mt="25px"
        width="100%"
        direction={{ xs: "column", lg: "row" }}
        gap={4}
      >
        <TotalRevenue />
        <StudentReferrals />
      </Stack>

      <Box
        flex={1}
        borderRadius="15px"
        padding="20px"
        bgcolor="#fcfcfc"
        display="flex"
        flexDirection="column"
        minWidth="100%"
        mt="25px"
      >
        <Typography fontSize="18px" fontWeight={600} color="#11142d">
          Latest Students
        </Typography>

        <Box mt={2.5} sx={{ display: "flex", flexWrap: "wrap", gap: 4 }}>
          {latestStudents.map((student) => (
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
