import mongoose from "mongoose";
import RoleType from "../../constants/role.types";
import { compareValue, hashValue } from "../../utils/bcrypt";
import { userStatus } from "../../constants/status.enum";

export interface UserDocument extends mongoose.Document {
  name: string;
  surname: string;
  role: RoleType;
  email: string;
  password?: string;
  verified: boolean;
  status: userStatus;
  createdAt: Date;
  updatedAt: Date;
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
