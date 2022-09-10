import dotenv from "dotenv";

dotenv.config();

export const REDIS_URL = process.env.REDIS_URL;
export const HEADLESS = process.env.HEADLESS;
export const PORT = process.env.PORT || 8080;
