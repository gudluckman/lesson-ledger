import { Add } from "@mui/icons-material";
import { useTable } from "@pankod/refine-core";
import {
  Box,
  Stack,
  Typography,
  TextField,
  Select,
  MenuItem,
} from "@mui/material";
import { Helmet } from "react-helmet";
import { useNavigate } from "@pankod/refine-react-router-v6";
import { useMemo } from "react";
import { CustomButton } from "components";
import StudentCard from "components/common/StudentCard";

const AllStudents = () => {
  const navigate = useNavigate();

  const {
    tableQueryResult: { data, isLoading, isError },
    current,
    setCurrent,
    setPageSize,
    pageCount,
    sorter,
    setSorter,
    filters,
    setFilters,
  } = useTable();

  const allStudents = data?.data ?? [];

  const currentBaseRate = sorter.find(
    (item) => item.field === "baseRate"
  )?.order;

  const toggleSort = (field: string) => {
    setSorter([{ field, order: currentBaseRate === "asc" ? "desc" : "asc" }]);
  };

  const currentFilterValues = useMemo(() => {
    const logicalFilters = filters.flatMap((item) =>
      "field" in item ? item : []
    );

    return {
      subject:
        logicalFilters.find((item) => item.field === "subject")?.value || "",
      year: logicalFilters.find((item) => item.field === "year")?.value || "",
    };
  }, [filters]);

  if (isLoading) return <Typography>Loading...</Typography>;
  if (isError) return <Typography>Error...</Typography>;

  return (
    <Box>
      <Helmet>
        <title>All Students</title>
      </Helmet>
      <Box mt="20px" sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
        <Stack direction="column" width="100%">
          <Typography variant="h1" fontSize="2rem" fontWeight={700} color="#11142d">
            {!allStudents.length ? "There are no students" : "All Students"}
          </Typography>
          <Box
            mb={2}
            mt={3}
            display="flex"
            width="84%"
            justifyContent="space-between"
            flexWrap="wrap"
          >
            <Box
              display="flex"
              gap={2}
              flexWrap="wrap"
              mb={{ xs: "20px", sm: 0 }}
            >
              <CustomButton
                title={`Sort by Rate ${currentBaseRate === "asc" ? "↑" : "↓"}`}
                handleClick={() => toggleSort("baseRate")}
                backgroundColor="#475be8"
                color="#fcfcfc"
              />
              <TextField
                variant="outlined"
                color="info"
                placeholder="Search by subject"
                value={currentFilterValues.subject}
                onChange={(e) => {
                  setFilters([
                    {
                      field: "subject",
                      operator: "contains",
                      value: e.currentTarget.value
                        ? e.currentTarget.value
                        : undefined,
                    },
                  ]);
                }}
              />
              <Select
                variant="outlined"
                color="info"
                displayEmpty
                required
                inputProps={{ "aria-label": "Without label" }}
                defaultValue=""
                value={currentFilterValues.year}
                onChange={(e) => {
                  setFilters(
                    [
                      {
                        field: "year",
                        operator: "eq",
                        value: e.target.value,
                      },
                    ],
                    "replace"
                  );
                }}
              >
                <MenuItem value="">All</MenuItem>
                {["12", "11", "10", "9", "8", "7"].map((type) => (
                  <MenuItem key={type} value={type.toLowerCase()}>
                    Year {type}
                  </MenuItem>
                ))}
              </Select>
            </Box>
          </Box>
        </Stack>
      </Box>

      <Stack direction="row" justifyContent="space-between" alignItems="center">
        <CustomButton
          title="Add Student"
          handleClick={() => navigate("/students/create")}
          backgroundColor="#7982ff"
          color="#fcfcfc"
          icon={<Add />}
        />
      </Stack>
      <Box mt="20px" sx={{ display: "flex", flexWrap: "wrap", gap: 3 }}>
        {allStudents?.map((student) => (
          <StudentCard
            key={student._id}
            id={student._id}
            studentName={student.studentName}
            year={student.year}
            baseRate={student.baseRate}
            subject={student.subject}
            status={student.status}
          />
        ))}
      </Box>

      {allStudents.length > 0 && (
        <Box display="flex" gap={2} mt={3} flexWrap="wrap">
          <CustomButton
            title="Previous"
            handleClick={() => setCurrent((prev) => prev - 1)}
            backgroundColor="#475be8"
            color="#fcfcfc"
            disabled={!(current > 1)}
          />
          <Box
            display={{ xs: "hidden", sm: "flex" }}
            alignItems="center"
            gap="5px"
          >
            Page{" "}
            <strong>
              {current} of {pageCount}
            </strong>
          </Box>
          <CustomButton
            title="Next"
            handleClick={() => setCurrent((prev) => prev + 1)}
            backgroundColor="#475be8"
            color="#fcfcfc"
            disabled={current === pageCount}
          />
          <Select
            variant="outlined"
            color="info"
            displayEmpty
            required
            inputProps={{ "aria-label": "Without label" }}
            defaultValue={10}
            onChange={(e) =>
              setPageSize(e.target.value ? Number(e.target.value) : 10)
            }
          >
            {[10, 20, 30, 40, 50].map((size) => (
              <MenuItem key={size} value={size}>
                Show {size}
              </MenuItem>
            ))}
          </Select>
        </Box>
      )}
    </Box>
  );
};

export default AllStudents;
