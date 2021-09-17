// Import necessary modules.
import axios from "axios";
import { google } from "googleapis";

// Defines our redirect URL after user authenticates with Google.
// const redirectUrl = "https://us-central1-acm-calendar-api.cloudfunctions.net/challenge/auth/google/callback";
const redirectUrl = "http://localhost:5002/acm-calendar-api/us-central1/challenge/auth/google/callback";

/* Google client keys and secrets should never be shown publicly in the source code. They should be parsed as an environment variable from a .env file or Doppler but for testing purposes, I will provide the API client key and secret token here. */

// Initialize a new Google OAuth 2 client in order to access the user's profile and calendar data.
export const googleClient = new google.auth.OAuth2(
  "826903781468-6fbvbrs1r3qsrsq9c6ll5k6duslgi86j.apps.googleusercontent.com",
  "bdI2mOPWla4vVBsHLVJzrrHh",
  redirectUrl
);

// Generates an authentication URL for a user to sign in to Google.
export const getOAuthPromptUrl = (): string => {
  const scopes = [
    "https://www.googleapis.com/auth/userinfo.profile",
    "https://www.googleapis.com/auth/calendar",
    "https://www.googleapis.com/auth/calendar.events",
    "https://www.googleapis.com/auth/calendar.events.owned",
  ];

  return googleClient.generateAuthUrl({
    access_type: "offline",
    prompt: "consent",
    scope: scopes,
  });
};

// Retrives the user's profile data from Google.
export const getGoogleUserData = async (code: string): Promise<any> => {
  // Retrieves access and bearer tokens.
  const { tokens } = await googleClient.getToken(code);

  googleClient.setCredentials(tokens);

  const accessToken = tokens.access_token;
  const bearerToken = tokens.id_token;

  // Fetch the user's profile with the access token and bearer token.
  try {
    const req = await axios.get(`https://www.googleapis.com/oauth2/v1/userinfo?alt=json&access_token=${accessToken}`, {
      headers: {
        Authorization: `Bearer ${bearerToken}`,
      },
    });
    return await req.data;
  } catch (error) {
    throw new Error(`An error occurred while trying to fetch an access token from Google's OAuth API: ${error}`);
  }
};
