import { betterAuth } from "better-auth";
import { mongodbAdapter } from "better-auth/adapters/mongodb";
import { createAuthMiddleware, APIError } from "better-auth/api";
import { jwt } from "better-auth/plugins";
import { MongoClient } from "mongodb";

// Re-use one Mongo connection across hot reloads in development
const globalForMongo = globalThis;
const client =
  globalForMongo._unityPulseMongo ?? new MongoClient(process.env.MONGODB_URI || "mongodb://127.0.0.1:27017");
if (process.env.NODE_ENV !== "production") globalForMongo._unityPulseMongo = client;
const db = client.db(process.env.DB_NAME || "unitypulse");

const googleEnabled = Boolean(process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET);

export const auth = betterAuth({
  database: mongodbAdapter(db),
  secret: process.env.BETTER_AUTH_SECRET,
  baseURL: process.env.BETTER_AUTH_URL || "http://localhost:3000",
  emailAndPassword: {
    enabled: true,
    minPasswordLength: 6,
    autoSignIn: true,
  },
  ...(googleEnabled && {
    socialProviders: {
      google: {
        clientId: process.env.GOOGLE_CLIENT_ID,
        clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      },
    },
  }),
  // Issues the JWT that the Express API verifies (exposes /api/auth/token and /api/auth/jwks)
  plugins: [jwt()],
  // Server-side password rules (the form checks the same rules for instant feedback)
  hooks: {
    before: createAuthMiddleware(async (ctx) => {
      if (ctx.path === "/sign-up/email") {
        const password = String(ctx.body?.password || "");
        if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || password.length < 6) {
          throw new APIError("BAD_REQUEST", {
            message: "Password needs an uppercase letter, a lowercase letter and at least 6 characters.",
          });
        }
      }
    }),
  },
});
