import { z } from 'zod';

/**
 * Environment Variable Validation
 *
 * Validates environment variables at build time to catch configuration errors early.
 * All NEXT_PUBLIC_* variables are optional to allow graceful degradation.
 */

const envSchema = z.object({
  // GitHub Repository (required for feedback, requests, edit links)
  NEXT_PUBLIC_GITHUB_REPO: z.string().url().optional().default('https://github.com/rexkirshner/inevitable-eth'),

  // Giscus Comments (optional - shows setup instructions if missing)
  NEXT_PUBLIC_GISCUS_REPO: z.string().optional(),
  NEXT_PUBLIC_GISCUS_REPO_ID: z.string().optional(),
  NEXT_PUBLIC_GISCUS_CATEGORY: z.string().optional(),
  NEXT_PUBLIC_GISCUS_CATEGORY_ID: z.string().optional(),

  // Google Analytics (optional - analytics is disabled when missing)
  NEXT_PUBLIC_GA_MEASUREMENT_ID: z.string().regex(/^G-[A-Z0-9]+$/).optional(),
});

/**
 * Validated environment variables
 * Use this export instead of process.env for type safety
 */
export const env = envSchema.parse({
  NEXT_PUBLIC_GITHUB_REPO: process.env.NEXT_PUBLIC_GITHUB_REPO,
  NEXT_PUBLIC_GISCUS_REPO: process.env.NEXT_PUBLIC_GISCUS_REPO,
  NEXT_PUBLIC_GISCUS_REPO_ID: process.env.NEXT_PUBLIC_GISCUS_REPO_ID,
  NEXT_PUBLIC_GISCUS_CATEGORY: process.env.NEXT_PUBLIC_GISCUS_CATEGORY,
  NEXT_PUBLIC_GISCUS_CATEGORY_ID: process.env.NEXT_PUBLIC_GISCUS_CATEGORY_ID,
  NEXT_PUBLIC_GA_MEASUREMENT_ID: process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID,
});

/**
 * Type-safe environment variable access
 */
export type Env = z.infer<typeof envSchema>;
