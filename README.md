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

Required backend auth variables:

```bash
JWT_SECRET=replace-with-a-long-random-secret
GOOGLE_CLIENT_ID=your-google-client-id
```

Users sign in with Google through `POST /api/v1/auth/google`. The API verifies
the Google ID token, creates the user on first sign-in, then returns an app JWT.
Private API routes use that JWT to scope students, earnings, yearly earnings,
and statistics to the signed-in user. The frontend should not send ownership
with `?email=...` or request bodies.

Google Calendar sync uses a Google service account. Users share their Google
Calendar with the service account email shown in the Lesson Schedule setup modal,
grant `See all event details`, then save that calendar's id in Lesson Ledger.

Production/env style:

```bash
CLIENT_EMAIL=your-service-account@project.iam.gserviceaccount.com
PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n"
```

Local file style:

```bash
GOOGLE_APPLICATION_CREDENTIALS=./service_account.json
```

When `CLIENT_EMAIL` and `PRIVATE_KEY` are present, the server uses them. If they
are not present, it falls back to `GOOGLE_APPLICATION_CREDENTIALS`, then
`./service_account.json`.

Only lesson events are returned from `/lessons/events`: the event must have a
start and end time, and its description must begin with a price such as `$80` or
`$120.50`.

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
