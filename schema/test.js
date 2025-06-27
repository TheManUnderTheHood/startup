import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get current directory in ES module
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// ✅ Explicitly load .env from same folder
dotenv.config({ path: path.resolve(__dirname, '.env') });

console.log("🔐 JWT_SECRET is:", process.env.JWT_SECRET);
