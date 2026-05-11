import { render, screen, waitFor } from "@testing-library/react";
import { ReactNode } from "react";
import axios from "axios";
import Home from "./home";

const mockUseList = jest.fn();

jest.mock("axios");

jest.mock("@pankod/refine-core", () => ({
  useList: () => mockUseList(),
}));

jest.mock("@pankod/refine-mui", () => ({
  Box: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  Stack: ({ children }: { children: ReactNode }) => <div>{children}</div>,
  Typography: ({ children }: { children: ReactNode }) => <div>{children}</div>,
}));

jest.mock("components", () => ({
  PieChart: ({ title, value }: { title: string; value: string }) => (
    <div data-testid={`chart-${title}`}>{value}</div>
  ),
  TotalRevenue: () => <div data-testid="total-revenue" />,
}));

jest.mock("components/charts/SubjectCount", () => ({
  SubjectCount: () => <div data-testid="subject-count" />,
}));

jest.mock("components/common/StudentCard", () => ({
  __esModule: true,
  default: ({ studentName }: { studentName: string }) => (
    <div data-testid="student-card">{studentName}</div>
  ),
}));

jest.mock("utils/api", () => ({
  API_BASE_URL: "https://api.example.test/api/v1",
}));

jest.mock("utils/auth", () => ({
  getAuthHeaders: () => ({ Authorization: "Bearer test-token" }),
}));

const mockedAxios = axios as jest.Mocked<typeof axios>;

describe("Home dashboard", () => {
  let consoleErrorSpy: jest.SpyInstance;

  beforeAll(() => {
    consoleErrorSpy = jest
      .spyOn(console, "error")
      .mockImplementation((...args: unknown[]) => {
        const message = String(args[0]);

        if (
          message.includes("ReactDOM.render is no longer supported") ||
          message.includes("Error fetching weekly dashboard stats")
        ) {
          return;
        }

        process.stderr.write(`${args.join(" ")}\n`);
      });
  });

  afterAll(() => {
    consoleErrorSpy.mockRestore();
  });

  beforeEach(() => {
    localStorage.clear();
    jest.clearAllMocks();
    mockUseList.mockReturnValue({
      data: {
        data: [
          {
            _id: "student-1",
            studentName: "Ava",
            year: 10,
            baseRate: 80,
            subject: "Math",
            status: "Active",
          },
        ],
      },
      isLoading: false,
      isError: false,
    });
  });

  it("refreshes current weekly stats from calendar events", async () => {
    localStorage.setItem("currentWeeklyIncomeSum", "999");
    mockedAxios.get.mockResolvedValueOnce({
      data: [
        {
          summary: "Ava (Math)",
          description: "$80\nAlgebra",
          start: { dateTime: "2026-05-11T08:00:00+10:00" },
          end: { dateTime: "2026-05-11T09:00:00+10:00" },
        },
        {
          summary: "Ben (English)",
          description: "$120.50\nEssay",
          start: { dateTime: "2026-05-12T10:00:00+10:00" },
          end: { dateTime: "2026-05-12T11:30:00+10:00" },
        },
        {
          summary: "Ava (Math)",
          description: "$80",
          start: { dateTime: "2026-05-14T08:00:00+10:00" },
          end: { dateTime: "2026-05-14T09:00:00+10:00" },
        },
      ],
    });

    render(<Home />);

    expect(screen.getByTestId("chart-Weekly Earning")).toHaveTextContent("$999");

    await waitFor(() =>
      expect(screen.getByTestId("chart-Weekly Earning")).toHaveTextContent(
        "$280.5"
      )
    );

    expect(screen.getByTestId("chart-Weekly Hours")).toHaveTextContent("3.5");
    expect(screen.getByTestId("chart-Weekly Students")).toHaveTextContent("2");
    expect(screen.getByTestId("chart-Weekly Hourly Rate")).toHaveTextContent(
      "$80.14"
    );
    expect(localStorage.getItem("currentWeeklyIncomeSum")).toBe("280.5");
    expect(mockedAxios.get).toHaveBeenCalledWith(
      "https://api.example.test/api/v1/lessons/events",
      { headers: { Authorization: "Bearer test-token" } }
    );
  });

  it("keeps stored stats visible if the calendar refresh fails", async () => {
    localStorage.setItem("currentWeeklyIncomeSum", "150");
    localStorage.setItem("currentWeeklyHours", "2");
    localStorage.setItem("currentAverageHourlyRate", "75");
    localStorage.setItem("currentWeeklyStudents", "1");
    mockedAxios.get.mockRejectedValueOnce(new Error("Network error"));

    render(<Home />);

    expect(screen.getByTestId("chart-Weekly Earning")).toHaveTextContent("$150");
    expect(screen.getByTestId("chart-Weekly Hours")).toHaveTextContent("2");
    expect(screen.getByTestId("chart-Weekly Students")).toHaveTextContent("1");
    expect(screen.getByTestId("chart-Weekly Hourly Rate")).toHaveTextContent(
      "$75.00"
    );

    await waitFor(() => expect(mockedAxios.get).toHaveBeenCalledTimes(1));
  });
});
