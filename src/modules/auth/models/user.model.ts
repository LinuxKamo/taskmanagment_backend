import mongoose from "mongoose";
import RoleType from "../../constants/role.types";
import { compareValue, hashValue } from "../../utils/bcrypt";
import { userStatus } from "../../constants/status.enum";
import { Subscription } from "../types/subscription.type";
import { Sub_Plan } from "../constants/plan.enum";
import { PLAN_PERMISSIONS } from "../constants/planpermission.record";

const featuresSchema = new mongoose.Schema(
  {
    tasklimit: { type: Number, default: 5 },
    ai_suggestion: { type: Boolean, default: false },
    emailsupport: { type: Boolean, default: false },
    recover_deletedtask: { type: Boolean, default: false },
    ret_reminder: { type: Boolean, default: false },
  },
  { _id: false }
);

export const subscriptionSchema = new mongoose.Schema(
  {
    plan: {
      type: String,
      enum: Object.values(Sub_Plan),
      default: Sub_Plan.FREE,
    },
    price: {
      type: Number,
      default: 0,
    },
    permisions: {
      type: featuresSchema,
      default: function () {
        // dynamically assign default features based on the plan
        return PLAN_PERMISSIONS[Sub_Plan.FREE];
      },
    },
    sub_ends: {
      type: Date,
      default: () => new Date(0), // epoch = no expiry (free plan)
    },
  },
  { _id: false }
);

export interface UserDocument extends mongoose.Document {
  name: string;
  surname: string;
  role: RoleType;
  email: string;
  password?: string;
  verified: boolean;
  status: userStatus;
  subscription : Subscription;
  comparePassword(val: string): Promise<boolean>;
  omitPassword(): Omit<UserDocument, "password">;
}

const userSchema = new mongoose.Schema<UserDocument>(
  {
    name: { type: String, default: "Name not provided" },
    surname: { type: String, default: "Surname not provided" },
    role: { type: String, default: RoleType.User },
    email: { type: String, unique: true, required: true },
    password: { type: String, required: false },
    verified: { type: Boolean, required: true },
    status: { type: String, default: userStatus.ACTIVE },
    subscription: {
      type: subscriptionSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
  }
);

/**
 * ✅ HASH PASSWORD SAFELY
 */
userSchema.pre("save", async function (next) {
  // If no password (Google user), skip
  if (!this.password) return next;

  // If password not modified, skip
  if (!this.isModified("password")) return next;

  this.password = await hashValue(this.password, 10);
  next;
});

/**
 * ✅ PASSWORD COMPARISON (Credentials login only)
 */
userSchema.methods.comparePassword = async function (val: string) {
  if (!this.password) {
    throw new Error("This account does not use password login");
  }
  return compareValue(val, this.password);
};

/**
 * ✅ REMOVE PASSWORD FROM RESPONSE
 */
userSchema.methods.omitPassword = function () {
  const obj = this.toObject();
  delete obj.password;
  return obj;
};

const UserModel = mongoose.model<UserDocument>("user", userSchema);
export default UserModel;
