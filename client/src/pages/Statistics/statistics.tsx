import React from 'react';
import {
  Box,
  Stack,
  Typography,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";
import { Helmet } from 'react-helmet';

const Statistics = () => {
  return (
    <Box>
      <Helmet>
        <title>Statistics</title>
      </Helmet>
      <Box mt="20px" sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
        <Stack direction="column" width="100%">
          <Typography fontSize={25} fontWeight={700} color="#11142d">
            Statistics
          </Typography>
        </Stack>
      </Box>
    </Box>
  );
};

export default Statistics;
