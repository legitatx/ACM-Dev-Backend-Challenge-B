// Import necessary modules.
import { Response, Request } from "express";
import jwt from "jsonwebtoken";
import { getGoogleUserData } from "../apis/google";

export const onGoogleCallback = async (request: Request, response: Response): Promise<void> => {
  try {
    // After user authenticates with Google, use the necessary code to retrieve their profile.
    const code = request.query.code as string;
    const googleUserData = await getGoogleUserData(code);
    // Generate an API key for the user to pass to the calendar endpoints. Note: JWT secret should never be stored publicly in the source code but for testing purposes, we will leave it as is.
    const jwtToken = jwt.sign(googleUserData, "jwt_secret");
    // Let the user know their API key and that it must be used to call any calendar endpoints.
    response.json({
      api_key: jwtToken,
      message:
        "This is your API key used for authentication for calling any calendar endpoints. It must be passed as `api_key` as a field in your request.",
    });
  } catch (err) {
    // Let our error middleware handle any unexpected errors we might face from fetching user data or signing a JWT token.
    throw new Error(`An error occurred while attempting to fetch user data from Google or an API key: ${err}`);
  }
};
