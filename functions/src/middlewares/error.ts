import { NextFunction } from "express";

// Defines our error middleware to catch any errors thrown by our API.
export const errorHandler = (error: Error, request: any, response: any, next: NextFunction): void => {
  try {
    console.error(error);
    response.status(500).json({
      message: "Error encountered",
      error: error,
    });
  } catch (nextErr) {
    next(nextErr);
  }
};
