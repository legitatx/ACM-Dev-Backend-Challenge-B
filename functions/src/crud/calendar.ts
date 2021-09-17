// Import necessary modules.
import { Response, Request } from "express";
import moment from "moment";
import { CreateEvent, EventRSVP, ParticipantList } from "../schemas/calendar";
import { google } from "googleapis";

// Initialize a new instance of the Google Calendar API.
const calendar = google.calendar("v3");

export const createEvent = async (request: Request, response: Response): Promise<void> => {
  // Parse the request body as a CreateEvent type.
  const data: CreateEvent = request.body;
  // Destructure the required data from the request body.
  const { event_name, start_date, end_date } = data;

  // Verify that all required fields are passed into the request body.
  if (!event_name) {
    response.status(400).json({
      error: "You must specify an `event_name` field in your request body.",
    });
    return;
  } else if (!start_date) {
    response.status(400).json({
      error: "You must specify a `start_date` field in your request body.",
    });
    return;
  } else if (!end_date) {
    response.status(400).json({
      error: "You must specify an `end_date` field in your request body.",
    });
    return;
  }

  // Parse and verify that our start date is valid.
  const isoStartDate = moment(start_date, "YYYY-MMM-DD hh:mm A");
  if (!isoStartDate.isValid()) {
    response.status(400).json({
      error: "Your start date must be in the format YYYY-MM-DD HH:MM AM/PM.",
    });
    return;
  }

  // Parse and verify that our end date is valid.
  const isoEndDate = moment(end_date, "YYYY-MMM-DD hh:mm A");
  if (!isoEndDate.isValid()) {
    response.status(400).json({
      error: "Your end date must be in the format YYYY-MM-DD HH:MM AM/PM.",
    });
    return;
  }

  // Insert a new event given an event name, start date, and end date into the user's primary Google calendar.
  await calendar.events
    .insert({
      calendarId: "primary",
      requestBody: {
        summary: event_name,
        start: {
          dateTime: isoStartDate.toISOString(),
        },
        end: {
          dateTime: isoEndDate.toISOString(),
        },
      },
    })
    .then(async () => {
      // Let the user know that the event was added to their calendar.
      response.json({
        message: `Event "${event_name}" was added to your Google Calendar successfully.`,
      });
    })
    .catch((error) => {
      // Let our error middleware handle any unexpected errors we might face from adding an event to a user's Google Calendar.
      throw new Error(`An error occurred while attempting to add an event to Google Calendar: ${error}`);
    });
};

export const rsvpToEvent = async (request: Request, response: Response): Promise<void> => {
  // Parse the request body as an EventRSVP type.
  const data: EventRSVP = request.body;
  // Destructure the required data from the request body.
  const { event_id, attendee_name } = data;

  // Verify that all required fields are passed into the request body.
  if (!event_id) {
    response.status(400).json({
      error: "You must specify an `event_id` field in your request body.",
    });
    return;
  } else if (!attendee_name) {
    response.status(400).json({
      error: "You must specify a `attendee_name` field in your request body.",
    });
    return;
  }

  // Access an Event object from the user's primary Google Calendar based on the specified ID.
  calendar.events
    .get({
      calendarId: "primary",
      eventId: event_id,
    })
    .then(async (event) => {
      // Wait for the request for fetching an event to finish and then access that event's data.
      const eventData = await event.data;

      /* Add the necessary name to the event's attendees and generate a random email as Google requires an email address to be associated with a specific attendee. If we fetched extra data from the JWT token, it would return the authenticated user's email address and not an attendee's so we use this a possible solution. */
      eventData.attendees?.push({
        displayName: attendee_name,
        email: generateRandomEmail(),
      });

      // Inform the user that the RSVP was successful.
      response.json({
        message: `Event "${eventData.summary}" was RSVP'd to successfully by ${attendee_name}.`,
      });
    })
    .catch(() => {
      // Let our error middleware handle any unexpected errors we might face from RSVP'ing to an event.
      response.status(500).json({
        error: `An error occurred while attempting to add this event to your calendar. Be sure an event with ID (${event_id}) exists on your Google Calendar.`,
      });
      return;
    });
};

export const retrieveParticipantList = async (request: Request, response: Response): Promise<void> => {
  // Parse the request body as a ParticipantList type.
  const data: ParticipantList = request.body;
  // Destructure the required data from the request body.
  const { event_id } = data;

  // Verify that a required event field is passed into the request body.
  if (!event_id) {
    response.status(400).json({
      error: "You must specify an `event_id` field in your request body.",
    });
    return;
  }

  // Get the necessary event from the user's Google Calendar.
  calendar.events
    .get({
      calendarId: "primary",
      eventId: event_id,
    })
    .then(async (event) => {
      // Wait for the request to finish and initialize a new variable storing the event data.
      const eventData = await event.data;

      // Inform the user if there are no current participants for this event.
      if (!eventData.attendees) {
        response.status(404).json({
          error: `This event does not have any participants.`,
        });
        return;
      }

      // For each attendee, store their name in a new array and then sort the names in lexicographical order.
      const attendeeNames: string[] = [];
      eventData.attendees.forEach((attendee) => {
        attendeeNames.push(attendee.displayName as string);
      });
      attendeeNames.sort((a, b) => a.toUpperCase().localeCompare(b.toUpperCase()));

      // Returns the list of sorted attendee names.
      response.json({ attendeeNames });
    })
    .catch(() => {
      // Let our error middleware handle any unexpected errors we might face from retrieving a participant list to an event.
      response.status(500).json({
        error: `An error occurred while attempting to retrieve the participant list for this event. Be sure an event with ID (${event_id}) exists on your Google Calendar.`,
      });
      return;
    });
};

// Function to generate a random email address.
const generateRandomEmail = (): string => {
  const chars = "abcdefghijklmnopqrstuvwxyz1234567890";
  let string = "";
  for (let i = 0; i < 15; i++) {
    string += chars[Math.floor(Math.random() * chars.length)];
  }
  return `${string}@gmail.com`;
};
