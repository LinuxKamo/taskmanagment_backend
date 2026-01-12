import mongoose = require("mongoose");
import { MONGO_URI } from "../constants/env";

const connectToDB = async () => {
  try {
    await mongoose.connect(MONGO_URI);
  } catch (error) {
    await mongoose.disconnect();
  }
};
export default connectToDB