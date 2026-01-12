import "express";

declare global {
  namespace Express {
    interface User {
      googleId: string;
      email?: string;
      name: string;
      avatar?: string;
    }
  }
}
