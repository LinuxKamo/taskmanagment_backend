"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const env_1 = require("../constants/env");
const connectToDB = async () => {
    try {
        await mongoose.connect(env_1.MONGO_URI);
    }
    catch (error) {
        await mongoose.disconnect();
    }
};
exports.default = connectToDB;
//# sourceMappingURL=db.js.map