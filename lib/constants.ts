import { env } from './env';

/**
 * Application Constants
 *
 * Centralized constants for the application to avoid duplication
 * and maintain consistency across components.
 *
 * All constants use validated environment variables from lib/env.ts
 */

/**
 * GitHub Repository URL
 * Used for feedback, article requests, and edit links
 */
export const GITHUB_REPO = env.NEXT_PUBLIC_GITHUB_REPO;

/**
 * Extract repository path from full URL
 * @example 'https://github.com/rexkirshner/inevitable-eth' => 'rexkirshner/inevitable-eth'
 */
export const GITHUB_REPO_PATH = GITHUB_REPO.replace('https://github.com/', '');
