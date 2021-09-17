// Import a Router interfaces from Express.
import { Router } from "express";
import { getOAuthPromptUrl } from "../apis/google";
// Import our CRUD function to authenticate a user with Google.
import * as authFunctions from "../crud/auth";

// Initialize a new Router instance from Node.
const authRouter = Router();

// Add a GET handler to redirect the user to Google OAuth.
authRouter.get("/login", (req, res) => {
  const redirectUrl = getOAuthPromptUrl();
  res.redirect(redirectUrl);
});
// Add a GET handler for Google to send back our tokens to.
authRouter.get("/callback", authFunctions.onGoogleCallback);

// Export our Express authentication router.
export default authRouter;
