import { useList } from "@pankod/refine-core";
import { Typography, Box, Stack } from "@pankod/refine-mui";
import { useEffect, useState } from "react";
import { Helmet } from "react-helmet";
import axios from "axios";
import { PieChart, TotalRevenue } from "components";
import { SubjectCount } from "components/charts/SubjectCount";
import StudentCard from "components/common/StudentCard";
import { API_BASE_URL } from "utils/api";
import { getAuthHeaders } from "utils/auth";

type LessonEvent = {
  summary?: string;
  description?: string;
  start?: {
    dateTime?: string;
  };
  end?: {
    dateTime?: string;
  };
};

type WeeklyStats = {
  income: number;
  hours: number;
  averageHourlyRate: number;
  students: number;
};

const lessonPricePattern = /^\s*\$(\d+(?:\.\d{1,2})?)\b/;

const getStoredNumber = (key: string) => {
  const value = Number(localStorage.getItem(key));
  return Number.isFinite(value) ? value : 0;
};

const getProgressSeries = (value: number, target: number) => [
  Math.max(value, 0),
  Math.max(target - value, 0),
];

const getLessonDuration = (event: LessonEvent) => {
  const start = new Date(event.start?.dateTime || "");
  const end = new Date(event.end?.dateTime || "");
  const durationInMs = end.getTime() - start.getTime();

  if (!Number.isFinite(durationInMs)) {
    return 0;
  }

  return Math.max(durationInMs / (1000 * 60 * 60), 0);
};

const getLessonPrice = (description?: string) =>
  Number(description?.match(lessonPricePattern)?.[1]) || 0;

const getWeeklyStats = (events: LessonEvent[]): WeeklyStats => {
  const studentsSet = new Set<string>();
  const totals = events.reduce(
    (summary, event) => {
      const studentName = event.summary?.match(/^(.+)\s+\(/)?.[1]?.trim();

      if (studentName) {
        studentsSet.add(studentName);
      }

      return {
        income: summary.income + getLessonPrice(event.description),
        hours: summary.hours + getLessonDuration(event),
      };
    },
    { income: 0, hours: 0 }
  );

  return {
    ...totals,
    averageHourlyRate: totals.hours > 0 ? totals.income / totals.hours : 0,
    students: studentsSet.size,
  };
};

const getStoredWeeklyStats = (): WeeklyStats => ({
  income: getStoredNumber("currentWeeklyIncomeSum"),
  hours: getStoredNumber("currentWeeklyHours"),
  averageHourlyRate: getStoredNumber("currentAverageHourlyRate"),
  students: getStoredNumber("currentWeeklyStudents"),
});

const storeWeeklyStats = (stats: WeeklyStats) => {
  localStorage.setItem("currentWeeklyIncomeSum", stats.income.toString());
  localStorage.setItem("currentWeeklyHours", stats.hours.toString());
  localStorage.setItem(
    "currentAverageHourlyRate",
    stats.averageHourlyRate.toString()
  );
  localStorage.setItem("currentWeeklyStudents", stats.students.toString());
};

const Home = () => {
  const [weeklyStats, setWeeklyStats] = useState(getStoredWeeklyStats);
  const { data, isLoading, isError } = useList({
    resource: "students",
    config: {
      pagination: {
        pageSize: 25,
      },
    },
  });

  const latestStudents = data?.data ?? [];

  useEffect(() => {
    const fetchWeeklyStats = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/lessons/events`, {
          headers: getAuthHeaders(),
        });
        const nextWeeklyStats = getWeeklyStats(response.data);

        storeWeeklyStats(nextWeeklyStats);
        setWeeklyStats(nextWeeklyStats);
      } catch (error) {
        console.error("Error fetching weekly dashboard stats:", error);
      }
    };

    fetchWeeklyStats();
  }, []);

  if (isLoading) return <Typography>Loading...</Typography>;
  if (isError) return <Typography>Something went wrong!</Typography>;

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
          value={`$${weeklyStats.income.toLocaleString()}`}
          series={getProgressSeries(weeklyStats.income, targetWeeklyIncome)}
          colors={["#275be8", "#c4e8ef"]}
        />

        <PieChart
          title="Weekly Hours"
          value={weeklyStats.hours.toString()}
          series={getProgressSeries(weeklyStats.hours, targetWeeklyHours)}
          colors={["#275be8", "#c4e8ef"]}
        />
        <PieChart
          title="Weekly Students"
          value={weeklyStats.students.toString()}
          series={getProgressSeries(weeklyStats.students, targetWeeklyStudents)}
          colors={["#275be8", "#c4e8ef"]}
        />
        <PieChart
          title="Weekly Hourly Rate"
          value={`$${weeklyStats.averageHourlyRate.toFixed(2)}`}
          series={getProgressSeries(
            weeklyStats.averageHourlyRate,
            targetAverageHourlyRate
          )}
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
          {latestStudents.length === 0 ? (
            <Typography fontSize={14} color="#808191">
              No students yet. Add your first student to start building your
              tutoring dashboard.
            </Typography>
          ) : (
            latestStudents
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
              ))
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default Home;
