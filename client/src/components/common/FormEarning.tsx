import {
  Box,
  Typography,
  Stack,
  FormControl,
  FormHelperText,
  TextField,
  InputAdornment,
} from "@mui/material";
import { useNavigate } from "@pankod/refine-react-router-v6";
import { FormPropsStudent } from "interfaces/common";
import CustomButton from "./CustomButton";
import CancelButton from "./CancelButton";

const FormEarning = ({
  type,
  register,
  handleSubmit,
  formLoading,
  onFinishHandler,
}: FormPropsStudent) => {
  const navigate = useNavigate();

  const handleCancel = () => {
    navigate(-1);
  };
  
  return (
    <Box>
      <Typography fontSize={25} fontWeight={700} color="#11142d">
        {type} an Earning
      </Typography>
      <Box mt={2.5} borderRadius="15px" padding="20px" bgcolor="#fcfcfc">
        <form
          style={{
            marginTop: "20px",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: "20px",
          }}
          onSubmit={handleSubmit(onFinishHandler)}
        >
          <Stack direction="column" gap={2}>
            <FormControl>
              <FormHelperText
                sx={{
                  fontWeight: 500,
                  margin: "10px 0",
                  fontSize: 16,
                  color: "#11142d",
                }}
              >
                Start Date of Week
              </FormHelperText>
              <TextField
                fullWidth
                required
                id="start-date-of-week"
                color="info"
                type="date"
                variant="outlined"
                {...register("startDateOfWeek", { required: true })}
              />
            </FormControl>
            <FormControl>
              <FormHelperText
                sx={{
                  fontWeight: 500,
                  margin: "10px 0",
                  fontSize: 16,
                  color: "#11142d",
                }}
              >
                End Date of Week
              </FormHelperText>
              <TextField
                {...register("endDateOfWeek", { required: true })}
                fullWidth
                required
                color="info"
                id="end-date-of-week"
                type="date"
                variant="outlined"
              />
            </FormControl>
            <FormControl>
              <FormHelperText
                sx={{
                  fontWeight: 500,
                  margin: "10px 0",
                  fontSize: 16,
                  color: "#11142d",
                }}
              >
                Weekly Income
              </FormHelperText>
              <TextField
                {...register("weeklyIncome", { required: true })}
                type="number"
                variant="outlined"
                color="info"
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
              />
            </FormControl>
            <FormControl>
              <FormHelperText
                sx={{
                  fontWeight: 500,
                  margin: "10px 0",
                  fontSize: 16,
                  color: "#11142d",
                }}
              >
                Weekly Hours
              </FormHelperText>
              <TextField
                {...register("weeklyHours", { required: true })}
                type="number"
                color="info"
                variant="outlined"
                inputProps={{ step: "0.01" }}
              />
            </FormControl>
          </Stack>
          <Box sx={{ display: "flex", justifyContent: "flex-start", mt: 2 }}>
            <CancelButton
              type="button"
              onClick={handleCancel}
              title="Cancel"
              variant="contained"
              color="info"
              sx={{ mr: 1 }}
            />
            <CustomButton
              type="submit"
              title={formLoading ? "Submitting..." : "Submit"}
              backgroundColor="#475be8"
              color="#fcfcfc"
            />
          </Box>
        </form>
      </Box>
    </Box>
  );
};

export default FormEarning;
