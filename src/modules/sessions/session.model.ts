import mongoose from "mongoose";
import { thirtyDaysFromNow } from "../utils/date";

export interface SessionDocument extends mongoose.Document {
  userId: mongoose.Types.ObjectId;
  userAgent?: string;
  createdAt: Date;
  expiresAt: Date;
}
const SessionSchema = new mongoose.Schema<SessionDocument>({
  userId: { type: mongoose.Schema.Types.ObjectId},
  userAgent: { type: String, ref: "User" },
  createdAt: { type: Date, default: Date.now, required: true },
  expiresAt: { type: Date, default: thirtyDaysFromNow() },
});
const SessionModel = mongoose.model<SessionDocument>("Session", SessionSchema);
export default SessionModel;
