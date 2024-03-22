import { Box, Typography } from "@mui/material";
import { StatisticCardProps } from "interfaces/home";

const StatisticCard = ({ title, value }: StatisticCardProps) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      p={1}
    >
      <Typography variant="subtitle1" color="#808191" fontWeight="bold">
        {title}
      </Typography>
      <Typography variant="h6" color="#475be8" fontWeight="bold">
        {value}
      </Typography>
    </Box>
  );
};

export default StatisticCard;
