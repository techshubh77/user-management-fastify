import fs from 'fs';
import path from 'path';
import { pipeline } from 'stream/promises';

const AVATAR_DIR = path.resolve('uploads/avatars');

const ensureDir = (dirPath) => {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
};

const uploadAvatar = async (request, reply) => {
  // Save file using streams (more efficient for large files)

  const data = await request.file();

  if (!data) return;

  const ext = path.extname(data.filename).toLowerCase();

  const allowedExt = ['.jpg', '.jpeg', '.png'];

  if (!allowedExt.includes(ext)) {
    throw new Error('Invalid file type. Only JPG, JPEG, and PNG are allowed.');
  }

  ensureDir(AVATAR_DIR);
  const filename = `${Date.now()}${ext}`;
  const filepath = path.join(AVATAR_DIR, filename);

  await pipeline(data.file, fs.createWriteStream(filepath));

  request.body = {};

  for (const key in data.fields) {
    request.body[key] = data.fields[key].value;
  }

  request.body.avatar = filename;
};

export default uploadAvatar;
