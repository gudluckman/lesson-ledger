import { Box, Typography } from "@mui/material";
import { StatisticCardProps } from "interfaces/home";

const StatisticCard = ({ title, value, border }: StatisticCardProps) => {
  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      p={1}
      sx={{
        borderTop: { xs: border, sm: border, md: border, lg: "none", xl: "none" },
        borderBottom: { xs: border, sm: border, md: border, lg: "none", xl: "none" },
        borderRight: { xs: "none", sm: "none", md: "none", lg: border, xl: border },
        borderLeft: { xs: "none", sm: "none", md: "none", lg: border, xl: border },
      }}
    >
      <Typography
        variant="subtitle1"
        color="#808191"
        fontWeight="bold"
        px={{ xs: 1, lg: 10 }}
        textAlign="center"
      >
        {title}
      </Typography>
      <Typography
        variant="h6"
        color="#475be8"
        fontWeight="bold"
        px={{ xs: 1, lg: 10 }}
        textAlign="center"
      >
        {value}
      </Typography>
    </Box>
  );
};

export default StatisticCard;
