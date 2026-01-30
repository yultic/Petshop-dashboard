import { z } from "zod";

const envSchema = z.object({
  NEXT_PUBLIC_API_URL: z
    .string()
    .url()
    .default("https://petshop-sales-forecasting-production.up.railway.app"),
});

const serverEnvSchema = z.object({
  ANTHROPIC_API_KEY: z.string().min(1, "ANTHROPIC_API_KEY aqui"),
});

function validateEnv() {
  const parsed = envSchema.safeParse({
    NEXT_PUBLIC_API_URL: process.env.NEXT_PUBLIC_API_URL,
  });

  if (!parsed.success) {
    console.error(
      "Invalid environment variables:",
      parsed.error.flatten().fieldErrors
    );
    throw new Error("Invalid environment variables");
  }

  return parsed.data;
}

export function getServerEnv() {
  const parsed = serverEnvSchema.safeParse({
    ANTHROPIC_API_KEY: process.env.ANTHROPIC_API_KEY,
  });

  if (!parsed.success) {
    throw new Error("Missing ANTHROPIC_API_KEY environment variable");
  }

  return parsed.data;
}

export const env = validateEnv();
