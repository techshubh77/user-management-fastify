import fs from 'fs';
import path from 'path';
import { pipeline } from 'stream/promises';

import STATUS_CODES from '../config/constants.js';
import AppError from '../utils/appError.js';

const AVATAR_DIR = path.resolve('uploads/avatars');
const ALLOWED_EXT = new Set(['.jpg', '.jpeg', '.png']);
const ALLOWED_MIME = new Set(['image/jpeg', 'image/png']);
const MAX_SIZE_BYTES = 2 * 1024 * 1024;

const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const uploadAvatar = async (request, _reply) => {
  // Use request.parts() to iterate ALL multipart parts (text fields + optional file).
  // request.file() only returns the first FILE-type part — text fields are silently
  // dropped when no file is sent, causing an empty request.body and false validation failure.
  const body = {};

  for await (const part of request.parts({ limits: { fileSize: MAX_SIZE_BYTES } })) {
    if (part.type === 'file') {
      // ── This part is a file upload ─────────────────────────────────────────

      // Extension check
      const ext = path.extname(part.filename).toLowerCase();
      if (!ALLOWED_EXT.has(ext)) {
        part.file.resume(); // drain the stream to avoid hanging
        throw new AppError(
          'Invalid file type. Only JPG, JPEG, and PNG are allowed.',
          STATUS_CODES.BAD_REQUEST
        );
      }

      // MIME-type check (prevents extension spoofing)
      if (!ALLOWED_MIME.has(part.mimetype)) {
        part.file.resume();
        throw new AppError(
          'Invalid MIME type. Only image/jpeg and image/png are accepted.',
          STATUS_CODES.BAD_REQUEST
        );
      }

      ensureDir(AVATAR_DIR);
      const filename = `${Date.now()}${ext}`;
      const filepath = path.join(AVATAR_DIR, filename);

      try {
        await pipeline(part.file, fs.createWriteStream(filepath));
      } catch (err) {
        if (fs.existsSync(filepath)) fs.unlinkSync(filepath);

        if (err.code === 'ERR_FS_FILE_TOO_LARGE' || part.file.truncated) {
          throw new AppError('Avatar file must be under 2 MB.', STATUS_CODES.BAD_REQUEST);
        }
        throw err;
      }

      body.avatar = filename;
    } else {
      // ── This part is a text field ──────────────────────────────────────────
      body[part.fieldname] = part.value;
    }
  }

  request.body = body;
};

export default uploadAvatar;
