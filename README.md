# **Lesson-ledger**
### Revolutionizing Tutoring Management: Track Income, Analyze Student Data, and Secure Access with Ease

<br>

## Summer Break 2023 Personal Project
Crafted a comprehensive **MERN** full-stack dashboard boasting robust CRUD functionalities, meticulously designed to encompass a tutoring dashboard. This dynamic tool enables users to track weekly income, total revenue, and peruse monthly analyses presented via intuitive bar charts.

Prioritized data security by implementing a secure login and register system with user roles facilitated through Google Auth, ensuring confidential information remains safeguarded.

Delivered a seamless and engaging user experience by harnessing the power of JavaScript and TypeScript for the backend, coupled with ReactJS and Refine for the frontend, resulting in a cohesive and responsive interface.

Furthermore, seamlessly integrated the Google Calendar API to effortlessly fetch and display weekly tutoring events across a myriad of statistical views, enhancing overall usability and functionality.

Developed by [@edwardlukman](https://github.com/gudluckman).

## Local Development

Run the API and client in separate terminals:

```bash
cd server
npm run dev
```

```bash
cd client
npm start
```

The client defaults to `http://localhost:5005/api/v1` in development and the
deployed API in production builds. To override either environment, set this in
`client/.env`:

```bash
REACT_APP_API_URL=http://localhost:5005/api/v1
```

## Environment Variables

Use `server/.env.example` and `client/.env.example` as templates.

For Google Calendar service account auth, choose one of these styles.

Production/env style:

```bash
CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
CALENDAR_ID=your-calendar-id
```

Local file style:

```bash
GOOGLE_APPLICATION_CREDENTIALS=./service_account.json
CALENDAR_ID=your-calendar-id
```

When `CLIENT_EMAIL` and `PRIVATE_KEY` are present, the server uses them. If they
are not present, it falls back to `GOOGLE_APPLICATION_CREDENTIALS`, then
`./service_account.json`. This means local and production environments can
switch by changing env values, without editing `calendar.controller.js`.

## Server TypeScript Commands

The backend is written in TypeScript and compiles to `server/dist`.
Use Node.js `24.x` locally and in Vercel project settings.

```bash
cd server
npm run build
npm start
```

Use `npm run dev` during local development. Use `npm start` after a build when
you want to run the compiled server.
