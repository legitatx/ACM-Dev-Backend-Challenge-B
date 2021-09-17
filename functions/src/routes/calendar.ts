// Import a Router interfaces from Express.
import { Router } from "express";
// Import our CRUD functions for our event CRUD functions.
import * as calendarFunctions from "../crud/calendar";
// Import our authentication middleware.
import { authenticateToken } from "../middlewares/jwt";

// Initialize a new Router instance from Node.
const calendarRouter = Router();

// Add a POST handler for our event creation CRUD function.
calendarRouter.post("/create", authenticateToken, calendarFunctions.createEvent);
// Add a GET handler for our RSVP CRUD function.
calendarRouter.post("/rsvp", authenticateToken, calendarFunctions.rsvpToEvent);
// Add a GET handler for our participants CRUD function.
calendarRouter.get("/participants", authenticateToken, calendarFunctions.retrieveParticipantList);

// Export our Express calendar router.
export default calendarRouter;
