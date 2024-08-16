// types/express.d.ts
import { IUser } from "../models/userModel";

declare global {
  namespace Express {
    interface User extends IUser {}
  }
}
