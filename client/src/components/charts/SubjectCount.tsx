import React, { useState, useEffect } from "react";
import { Box, Typography, Stack } from "@mui/material";
import axios from "axios";
import { SubjectData, ProgressBarProps } from "interfaces/subject";


const ProgressBar = ({ title, year, count, color }: ProgressBarProps) => (
  <Box width="100%">
    <Stack direction="row" alignItems="center" justifyContent="space-between">
      <Typography fontSize={16} fontWeight={500} color="11142d">
        {title} - Year {year}
      </Typography>
      <Typography fontSize={16} fontWeight={500} color="11142d">
        {count}
      </Typography>
    </Stack>
    <Box
      mt={2}
      position="relative"
      width="100%"
      height="8px"
      borderRadius={1}
      bgcolor="#e4e8ef"
    >
      <Box
        width={`${(count / 5) * 100}%`}
        bgcolor={color}
        position="absolute"
        height="100%"
        borderRadius={1}
      />
    </Box>
  </Box>
);

export const SubjectCount = () => {
  const [subjectData, setSubjectData] = useState<SubjectData[]>([]);

  useEffect(() => {
    const fetchSubjectData = async () => {
      try {
        const response = await axios.get(
          "https://lesson-ledger-api.vercel.app/api/v1/students/statistics/subject"
        );
        setSubjectData(response.data);
      } catch (error) {
        console.error("Error fetching subject data:", error);
      }
    };

    fetchSubjectData();
  }, []);

  // Map subjects to colors
  const subjectColors: { [key: string]: string } = {
    "Mathematics - Year 3": "#FFD700",
    "Mathematics - Year 7": "#FFB6C1",
    "Mathematics - Year 8": "#F6546A",
    "Mathematics - Year 9": "#40E0D0",
    "Mathematics - Year 10": "#C6E2FF",
    "Mathematics Advanced - Year 11": "#990000",
    "Mathematics Standard - Year 11": "#FFCE73",
    "Mathematics Advanced - Year 12": "#0A75AD",
    "Mathematics Standard - Year 12": "#FF4040",
    "Software Design Development - Year 12": "#BADA55",
    "Information Processes Technology - Year 12": "#7FBA7A",
    "English EAL/D - Year 12": "#FFA500",
  };
  // Sort the subjectData array based on count in descending order
  const sortedSubjectData = subjectData.sort((a, b) => b.count - a.count);

  // Get the top 5 subjects
  const topFiveSubjects = sortedSubjectData.slice(0, 5);
  return (
    <Box
      p={4}
      bgcolor="#fcfcfc"
      id="chart"
      display="flex"
      flexDirection="column"
      borderRadius="15px"
      minWidth={490}
    >
      <Typography fontSize={18} fontWeight={600} color={"#11142d"}>
        Top 5 Subjects 
      </Typography>

      <Stack my="20px" direction="column" gap={4}>
        {topFiveSubjects.map((data, index) => {
          const key = `${data._id.subject} - Year ${data._id.year}`;
          return (
            <ProgressBar
              key={key}
              title={data._id.subject}
              year={data._id.year}
              count={data.count}
              color={subjectColors[key] || "#3f51b5"}
            />
          );
        })}
      </Stack>
    </Box>
  );
};
