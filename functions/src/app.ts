// Initialize Express and middleware modules.
import express from "express";
import compression from "compression";
import cors from "cors";
import helmet from "helmet";
import calendarRouter from "./routes/calendar";
import authRouter from "./routes/auth";
import { errorHandler } from "./middlewares/error";

// Initialize a new instance of Express.
const app = express();

// Express middleware to enable Access-Control-Allow-Origin (CORS) header and credentials. In this case, the origin is set in respect to the request origin.
app.use(cors({ origin: true, credentials: true }));

// Enable middleware to parse request body before request handlers.
// Enable body parser middleware to parse JSON data matching the Content-Type `application/json` header or URL encoded data as is the case with our Google authentication routes.
app.use(express.json());

// Initialize other security + compression related middleware.
app.use(helmet());
app.use(compression());

// Initialize our authentication routes with path `/auth/google`.
app.use("/auth/google", authRouter);

// Initialize our routes with path `/calendar`.
app.use("/calendar", calendarRouter);

// Enable middleware to handle any exceptions thrown by our CRUD functions. We log the error to the console and return a 500 status code. If any additional errors, we run our callback function to handle any additional errors.
app.use(errorHandler);

// Export an instance of Express for use within the respective routes file.
export default app;
