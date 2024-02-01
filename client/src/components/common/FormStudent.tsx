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
import CustomButton from "./CustomButton";

const FormStudent = ({
  type,
  register,
  handleSubmit,
  formLoading,
  onFinishHandler,
}: FormPropsStudent) => {
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
            <RadioGroup row aria-label="studentGender" defaultValue="online">
              <FormControlLabel
                value="Male"
                control={<Radio />}
                label="Male"
                {...register("gender", { required: true })}
              />
              <FormControlLabel
                value="Female"
                control={<Radio />}
                label="Female"
                {...register("gender", { required: true })}
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
                defaultValue="12"
                {...register("year", { required: true })}
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
              <RadioGroup row aria-label="delivery" defaultValue="online">
                <FormControlLabel
                  value="Online"
                  control={<Radio />}
                  label="Online"
                  {...register("delivery", { required: true })}
                />
                <FormControlLabel
                  value="In Person"
                  control={<Radio />}
                  label="In Person"
                  {...register("delivery", { required: true })}
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
              <RadioGroup row aria-label="sessionMode">
                <FormControlLabel
                  value="One on one"
                  control={<Radio />}
                  label="One on one"
                  {...register("sessionMode", { required: true })}
                />
                <FormControlLabel
                  value="Group"
                  control={<Radio />}
                  label="Group"
                  {...register("sessionMode", { required: true })}
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
              <RadioGroup row aria-label="sessionType">
                <FormControlLabel
                  value="Weekly"
                  control={<Radio />}
                  label="Weekly"
                  {...register("sessionType", { required: true })}
                />
                <FormControlLabel
                  value="Casual"
                  control={<Radio />}
                  label="Casual"
                  {...register("sessionType", { required: true })}
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
              >
                <FormControlLabel
                  value="Active"
                  control={<Radio />}
                  label="Active"
                  {...register("status", { required: true })}
                />
                <FormControlLabel
                  value="Pending"
                  control={<Radio />}
                  label="Pending"
                  {...register("status", { required: true })}
                />
                <FormControlLabel
                  value="Inactive"
                  control={<Radio />}
                  label="Inactive"
                  {...register("status", { required: true })}
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
                defaultValue="Monday"
                {...register("day", { required: false })}
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
          <CustomButton
            type="submit"
            title={formLoading ? "Submitting..." : "Submit"}
            backgroundColor="#475be8"
            color="#fcfcfc"
          />
        </form>
      </Box>
    </Box>
  );
};

export default FormStudent;
