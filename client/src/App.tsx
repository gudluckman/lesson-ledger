import { Refine, AuthProvider } from "@pankod/refine-core";
import {
  notificationProvider,
  RefineSnackbarProvider,
  CssBaseline,
  GlobalStyles,
  ReadyPage,
  ErrorComponent,
} from "@pankod/refine-mui";
import { PeopleAltOutlined, WalletOutlined } from "@mui/icons-material";
import TimelineIcon from "@mui/icons-material/Timeline";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";
import dataProvider from "@pankod/refine-simple-rest";
import routerProvider from "@pankod/refine-react-router-v6";
import axios, { AxiosRequestConfig } from "axios";
import { Title, Sider, Layout, Header } from "components/layout";
import { ColorModeContextProvider } from "contexts";
import { CredentialResponse } from "interfaces/google";
import { parseJwt } from "utils/parse-jwt";
import { Login, Home } from "pages";
import AllStudents from "pages/Students/all-students";
import StudentDetails from "pages/Students/student-details";
import CreateStudent from "pages/Students/create-student";
import EditStudent from "pages/Students/edit-student";
import LessonSchedule from "pages/LessonSchedule/lesson-schedule";
import AllEarnings from "pages/Earnings/all-earnings";
import CreateEarnings from "pages/Earnings/create-earning";
import Statistics from "pages/Statistics/statistics";

const axiosInstance = axios.create();
axiosInstance.interceptors.request.use((request: AxiosRequestConfig) => {
  const token = localStorage.getItem("token");
  if (request.headers) {
    request.headers["Authorization"] = `Bearer ${token}`;
  } else {
    request.headers = {
      Authorization: `Bearer ${token}`,
    };
  }

  return request;
});

function App() {
  const authProvider: AuthProvider = {
    login: async ({ credential }: CredentialResponse) => {
      const profileObj = credential ? parseJwt(credential) : null;

      if (profileObj && profileObj.email) {
        // Fetch the list of users from the server
        const response = await fetch(
          "https://lesson-ledger-api.vercel.app/api/v1/users"
        );
        const users = await response.json();

        // Check if the user with the given email exists in the list
        const userExists = users.some(
          (user: { email: string; }) => user.email === profileObj.email
        );
        if (!userExists) {
          // User does not exist in the database, reject the login attempt
          return Promise.reject("User not found.");
        }

        // User exists, store necessary information in local storage
        localStorage.setItem(
          "user",
          JSON.stringify({
            ...profileObj,
            avatar: profileObj.picture,
          })
        );
        localStorage.setItem("token", `${credential}`);
      } else {
        // No profile object found or no email provided, reject the login attempt
        return Promise.reject("Invalid credential.");
      }

      return Promise.resolve();
    },
    logout: () => {
      const token = localStorage.getItem("token");

      if (token && typeof window !== "undefined") {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        axios.defaults.headers.common = {};
        window.google?.accounts.id.revoke(token, () => {
          return Promise.resolve();
        });
      }

      return Promise.resolve();
    },
    checkError: () => Promise.resolve(),
    checkAuth: async () => {
      const token = localStorage.getItem("token");

      if (token) {
        return Promise.resolve();
      }
      return Promise.reject();
    },

    getPermissions: () => Promise.resolve(),
    getUserIdentity: async () => {
      const user = localStorage.getItem("user");
      if (user) {
        return Promise.resolve(JSON.parse(user));
      }
    },
  };

  return (
    <ColorModeContextProvider>
      <CssBaseline />
      <GlobalStyles styles={{ html: { WebkitFontSmoothing: "auto" } }} />
      <RefineSnackbarProvider>
        <Refine
          dataProvider={dataProvider(
            "https://lesson-ledger-api.vercel.app/api/v1"
          )}
          notificationProvider={notificationProvider}
          ReadyPage={ReadyPage}
          catchAll={<ErrorComponent />}
          resources={[
            {
              name: "students",
              list: AllStudents,
              show: StudentDetails,
              create: CreateStudent,
              edit: EditStudent,
              icon: <PeopleAltOutlined />,
            },
            {
              name: "earnings",
              list: AllEarnings,
              create: CreateEarnings,
              icon: <WalletOutlined />,
            },
            {
              name: "statistics",
              list: Statistics,
              icon: <TimelineIcon />,
            },
            {
              name: "lessons",
              list: LessonSchedule,
              icon: <CalendarMonthIcon />,
            },
          ]}
          Title={Title}
          Sider={Sider}
          Layout={Layout}
          Header={Header}
          routerProvider={routerProvider}
          authProvider={authProvider}
          LoginPage={Login}
          DashboardPage={Home}
        />
      </RefineSnackbarProvider>
    </ColorModeContextProvider>
  );
}

export default App;
