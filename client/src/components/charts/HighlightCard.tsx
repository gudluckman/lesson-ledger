import { Box, Typography, Stack } from "@pankod/refine-mui";
import { HighlightCardProps } from "interfaces/home";

const HighlightCard = ({ title, value, backgroundImage }: HighlightCardProps) => {
  return (
    <Box
      id="chart"
      flex={1}
      display="flex"
      flexDirection="row"
      justifyContent="center"
      alignItems="center"
      pl={2}
      py={2}
      gap={2}
      borderRadius="15px"
      minHeight="110px"
      width="fit-content"
      position="relative"
      boxShadow={3}
    >
      {backgroundImage && (
        <Box
          position="absolute"
          top={0}
          left={0}
          right={0}
          bottom={0}
          style={{
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            opacity: 0.5,
            borderRadius: "15px",
          }}
        />
      )}

      <Stack
        direction="column"
        alignItems="center"
        bgcolor="#fcfcfc"
        borderRadius="10px"
        padding="5px 20px"
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
