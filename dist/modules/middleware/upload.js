"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.upload = void 0;
// src/middlewares/upload.ts
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const uuid_1 = require("uuid");
const UPLOADS_DIR = path_1.default.join(__dirname, "../../uploads");
// ensure folder exists
if (!fs_1.default.existsSync(UPLOADS_DIR)) {
    fs_1.default.mkdirSync(UPLOADS_DIR, { recursive: true });
}
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => cb(null, UPLOADS_DIR),
    filename: (_req, file, cb) => {
        const ext = path_1.default.extname(file.originalname).toLowerCase();
        const filename = `${Date.now()}-${(0, uuid_1.v4)()}${ext}`;
        cb(null, filename);
    },
});
// ✅ Properly typed file filter
const fileFilter = (_req, file, cb) => {
    const allowed = /jpeg|jpg|png|gif|webp/;
    const mimetypeOk = allowed.test(file.mimetype);
    const extOk = allowed.test(path_1.default.extname(file.originalname).toLowerCase());
    if (mimetypeOk && extOk) {
        cb(null, true);
    }
    else {
        cb(new Error("Only image files are allowed (jpeg/jpg/png/gif/webp)"));
    }
};
exports.upload = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5 MB
});
//# sourceMappingURL=upload.js.map