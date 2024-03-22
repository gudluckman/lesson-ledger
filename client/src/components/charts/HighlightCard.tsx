import { Box, Typography, Stack } from "@pankod/refine-mui";
import { HighlightCardProps } from "interfaces/home";

const HighlightCard = ({ title, value, color }: HighlightCardProps) => {
  return (
    <Box
      id="chart"
      flex={1}
      display="flex"
      justifyContent="center"
      pl={2}
      pr={2}
      py={2}
      gap={2}
      borderRadius="15px"
      minHeight="100px"
      width="fit-content"
      position="relative"
      boxShadow={4}
      bgcolor={`rgba(${color}, 0.8)`}
      mx="auto"
    >
      <Stack
        direction="column"
        alignItems="center"
        bgcolor="#fcfcfc"
        borderRadius="10px"
        padding={{
          xl: "5px 50px",
          lg: "5px 30px",
          sm: "5px 10px",
          xs: "5px 20px",
        }}
        boxShadow="0px 4px 8px rgba(0, 0, 0, 0.1)"
        zIndex={1}
      >
        <Typography fontSize={14} color="#808191">
          {title}
        </Typography>
        <Typography fontSize={24} color="#475be8" fontWeight={800}>
          {value}
        </Typography>
      </Stack>
    </Box>
  );
};

export default HighlightCard;
