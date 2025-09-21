import dotenv from "dotenv";

dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  tmdb_auth_token: string;
}

const config: Config = {
  port: Number(process.env.PORT) || 3000,
  nodeEnv: process.env.NODE_ENV || "development",
  tmdb_auth_token: process.env.TMDB_AUTH_TOKEN || "",
};

export default config;
