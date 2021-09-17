import jwt from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";

// Defines our authentication middleware to make sure a user is authenticated before handling any of our calendar endpoints.
export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const { api_key } = req.body;

  if (api_key) {
    jwt.verify(api_key, "jwt_secret", (err: any, _: any) => {
      if (err) {
        res.status(403).json({
          error: "An error occurred while attempting to verify your API key. Please try again later.",
        });
      }
      next();
    });
  } else {
    res.sendStatus(401).json({
      message: "Your `api_key` must be specified in the request body to use calendar related endpoints.",
    });
  }
};
