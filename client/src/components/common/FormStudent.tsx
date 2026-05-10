import {
  Box,
  Typography,
  Stack,
  FormControl,
  FormHelperText,
  TextField,
  TextareaAutosize,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  InputAdornment,
} from "@mui/material";
import { FormPropsStudent } from "interfaces/common";
import { useNavigate } from "@pankod/refine-react-router-v6";
import CustomButton from "./CustomButton";
import CancelButton from "./CancelButton";

const FormStudent = ({
  type,
  register,
  watch,
  handleSubmit,
  formLoading,
  onFinishHandler,
}: FormPropsStudent) => {
  const navigate = useNavigate();
  const getFieldValue = (field: string, fallback = "") => watch?.(field) ?? fallback;
  const handleCancel = () => {
    navigate(-1);
  };

  return (
    <Box>
      <Typography fontSize={25} fontWeight={700} color="#11142d">
        {type} a Student
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
            {/* Student Full Name */}
            <FormControl>
              <FormHelperText
                sx={{
                  fontWeight: 500,
                  margin: "10px 0",
                  fontSize: 16,
                  color: "#11142d",
                }}
              >
                Student full name
              </FormHelperText>
              <TextField
                fullWidth
                required
                id="outlined-basic"
                color="info"
                variant="outlined"
                {...register("studentName", { required: true })}
              />
            </FormControl>

            {/* Parent Name */}
            <FormControl>
              <FormHelperText
                sx={{
                  fontWeight: 500,
                  margin: "10px 0",
                  fontSize: 16,
                  color: "#11142d",
                }}
              >
                Parent full name
              </FormHelperText>
              <TextField
                fullWidth
                required
                id="outlined-basic"
                color="info"
                variant="outlined"
                // what would this be
                {...register("parentName", { required: true })}
              />
            </FormControl>

            {/* Contact number */}
            <FormControl>
              <FormHelperText
                sx={{
                  fontWeight: 500,
                  margin: "10px 0",
                  fontSize: 16,
                  color: "#11142d",
                }}
              >
                Contact number
              </FormHelperText>
              <TextField
                fullWidth
                required
                id="outlined-basic"
                color="info"
                variant="outlined"
                {...register("contactNumber", { required: true })}
              />
            </FormControl>
          </Stack>

          {/* Student gender */}
          <FormControl component="fieldset">
            <FormHelperText
              sx={{
                fontWeight: 500,
                margin: "10px 0",
                fontSize: 16,
                color: "#11142d",
              }}
            >
              Student gender
            </FormHelperText>
            <RadioGroup row aria-label="studentGender" value={getFieldValue("gender")}>
              <FormControlLabel
                value="Male"
                control={<Radio {...register("gender", { required: true })} />}
                label="Male"
              />
              <FormControlLabel
                value="Female"
                control={<Radio {...register("gender", { required: true })} />}
                label="Female"
              />
            </RadioGroup>
          </FormControl>

          <Stack direction="row" gap={4}>
            {/* Student Year */}
            <FormControl sx={{ flex: 1, maxWidth: 220 }}>
              <FormHelperText
                sx={{
                  fontWeight: 500,
                  margin: "10px 0",
                  fontSize: 16,
                  color: "#11142d",
                }}
              >
                Academic year
              </FormHelperText>
              <Select
                variant="outlined"
                color="info"
                displayEmpty
                required
                inputProps={{ "aria-label": "Without label" }}
                {...register("year", { required: true })}
                value={getFieldValue("year", "12")}
              >
                <MenuItem value="12">Year 12 (HSC)</MenuItem>
                <MenuItem value="11">Year 11</MenuItem>
                <MenuItem value="10">Year 10</MenuItem>
                <MenuItem value="9">Year 9</MenuItem>
                <MenuItem value="8">Year 8</MenuItem>
                <MenuItem value="7">Year 7</MenuItem>
                <MenuItem value="6">Year 6</MenuItem>
                <MenuItem value="5">Year 5</MenuItem>
                <MenuItem value="4">Year 4</MenuItem>
                <MenuItem value="3">Year 3</MenuItem>
              </Select>
            </FormControl>
            {/* Subject */}
            <FormControl>
              <FormHelperText
                sx={{
                  fontWeight: 500,
                  margin: "10px 0",
                  fontSize: 16,
                  color: "#11142d",
                }}
              >
                Subject
              </FormHelperText>
              <TextField
                fullWidth
                required
                id="outlined-basic"
                color="info"
                variant="outlined"
                {...register("subject", { required: true })}
              />
            </FormControl>
          </Stack>

          <Stack direction="row" gap={4}>
            {/* Expected hours count */}
            <FormControl>
              <FormHelperText
                sx={{
                  fontWeight: 500,
                  margin: "10px 0",
                  fontSize: 16,
                  color: "#11142d",
                }}
              >
                Expected hour
              </FormHelperText>
              <TextField
                fullWidth
                required
                id="outlined-basic"
                color="info"
                type="number"
                variant="outlined"
                {...register("sessionHoursPerWeek", { required: true })}
              />
            </FormControl>

            {/* Hourly rate */}
            <FormControl>
              <FormHelperText
                sx={{
                  fontWeight: 500,
                  margin: "10px 0",
                  fontSize: 16,
                  color: "#11142d",
                }}
              >
                Hourly rate
              </FormHelperText>
              <TextField
                fullWidth
                required
                id="outlined-basic"
                color="info"
                type="number"
                variant="outlined"
                {...register("baseRate", { required: true })}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
              />
            </FormControl>
          </Stack>

          <Stack direction="column" gap={2}>
            {/* Lesson delivery */}
            <FormControl component="fieldset">
              <FormHelperText
                sx={{
                  fontWeight: 500,
                  margin: "10px 0",
                  fontSize: 16,
                  color: "#11142d",
                }}
              >
                Lesson delivery
              </FormHelperText>
              <RadioGroup row aria-label="delivery" value={getFieldValue("delivery", "Online")}>
                <FormControlLabel
                  value="Online"
                  control={<Radio {...register("delivery", { required: true })} />}
                  label="Online"
                />
                <FormControlLabel
                  value="In Person"
                  control={<Radio {...register("delivery", { required: true })} />}
                  label="In Person"
                />
              </RadioGroup>
            </FormControl>

            {/* Session mode */}
            <FormControl component="fieldset">
              <FormHelperText
                sx={{
                  fontWeight: 500,
                  margin: "10px 0",
                  fontSize: 16,
                  color: "#11142d",
                }}
              >
                Session mode
              </FormHelperText>
              <RadioGroup row aria-label="sessionMode" value={getFieldValue("sessionMode", "One on one")}>
                <FormControlLabel
                  value="One on one"
                  control={<Radio {...register("sessionMode", { required: true })} />}
                  label="One on one"
                />
                <FormControlLabel
                  value="Group"
                  control={<Radio {...register("sessionMode", { required: true })} />}
                  label="Group"
                />
              </RadioGroup>
            </FormControl>
          </Stack>

          <Stack direction="column" gap={2}>
            {/* Session type */}
            <FormControl component="fieldset">
              <FormHelperText
                sx={{
                  fontWeight: 500,
                  margin: "10px 0",
                  fontSize: 16,
                  color: "#11142d",
                }}
              >
                Session type
              </FormHelperText>
              <RadioGroup row aria-label="sessionType" value={getFieldValue("sessionType", "Weekly")}>
                <FormControlLabel
                  value="Weekly"
                  control={<Radio {...register("sessionType", { required: true })} />}
                  label="Weekly"
                />
                <FormControlLabel
                  value="Casual"
                  control={<Radio {...register("sessionType", { required: true })} />}
                  label="Casual"
                />
              </RadioGroup>
            </FormControl>

            {/* Lesson status */}
            <FormControl component="fieldset">
              <FormHelperText
                sx={{
                  fontWeight: 500,
                  margin: "10px 0",
                  fontSize: 16,
                  color: "#11142d",
                }}
              >
                Lesson status
              </FormHelperText>
              <RadioGroup
                row
                aria-labelledby="demo-radio-buttons-group-label"
                name="use-radio-group"
                value={getFieldValue("status", "Active")}
              >
                <FormControlLabel
                  value="Active"
                  control={<Radio {...register("status", { required: true })} />}
                  label="Active"
                />
                <FormControlLabel
                  value="Pending"
                  control={<Radio {...register("status", { required: true })} />}
                  label="Pending"
                />
                <FormControlLabel
                  value="Inactive"
                  control={<Radio {...register("status", { required: true })} />}
                  label="Inactive"
                />
              </RadioGroup>
            </FormControl>
          </Stack>

          {/* Lesson time slot */}
          <Stack direction="row" gap={4}>
            {/* Day */}
            <FormControl sx={{ minWidth: 120 }}>
              <FormHelperText
                sx={{
                  fontWeight: 500,
                  margin: "10px 0",
                  fontSize: 16,
                  color: "#11142d",
                }}
              >
                Day
              </FormHelperText>
              <Select
                variant="outlined"
                color="info"
                displayEmpty
                required
                inputProps={{ "aria-label": "Without label" }}
                {...register("day", { required: false })}
                value={getFieldValue("day", "Monday")}
              >
                <MenuItem value="" disabled>
                  Select Day
                </MenuItem>
                <MenuItem value="Monday">Monday</MenuItem>
                <MenuItem value="Tuesday">Tuesday</MenuItem>
                <MenuItem value="Wednesday">Wednesday</MenuItem>
                <MenuItem value="Thursday">Thursday</MenuItem>
                <MenuItem value="Friday">Friday</MenuItem>
                <MenuItem value="Saturday">Saturday</MenuItem>
                <MenuItem value="Sunday">Sunday</MenuItem>
              </Select>
            </FormControl>

            {/* Start Time */}
            <FormControl>
              <FormHelperText
                sx={{
                  fontWeight: 500,
                  margin: "10px 0",
                  fontSize: 16,
                  color: "#11142d",
                }}
              >
                Start Time
              </FormHelperText>
              <TextField
                fullWidth
                required
                id="start-time"
                color="info"
                type="time"
                variant="outlined"
                {...register("startTime", { required: false })}
              />
            </FormControl>

            {/* End Time */}
            <FormControl>
              <FormHelperText
                sx={{
                  fontWeight: 500,
                  margin: "10px 0",
                  fontSize: 16,
                  color: "#11142d",
                }}
              >
                End Time
              </FormHelperText>
              <TextField
                fullWidth
                required
                id="end-time"
                color="info"
                type="time"
                variant="outlined"
                {...register("endTime", { required: false })}
              />
            </FormControl>
          </Stack>

          {/* Source of student */}
          <FormControl>
            <FormHelperText
              sx={{
                fontWeight: 500,
                margin: "10px 0",
                fontSize: 16,
                color: "#11142d",
              }}
            >
              Source of student
            </FormHelperText>
            <TextareaAutosize
              minRows={5}
              placeholder="Enter a description..."
              color="info"
              style={{
                width: "100%",
                background: "transparent",
                fontSize: "16px",
                borderColor: "rgba(0,0,0,0.23)",
                borderRadius: 6,
                padding: 10,
                color: "#919191",
              }}
              {...register("source", { required: true })}
            />
          </FormControl>
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

export default FormStudent;
