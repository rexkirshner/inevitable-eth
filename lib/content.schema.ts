import { z } from "zod";

/**
 * Content Schema for Inevitable Ethereum articles
 *
 * This schema validates the frontmatter of all MDX articles.
 * Enforces strict typing and provides runtime validation.
 */

export const CategoryEnum = z.enum(["background", "concepts", "ethereum"]);
export const DifficultyEnum = z.enum(["intro", "intermediate", "advanced"]);

export const SourceSchema = z.object({
  title: z.string().min(1, "Source title is required"),
  url: z.string().url("Source URL must be valid"),
  author: z.string().optional(),
});

export const FrontmatterSchema = z.object({
  // Required fields
  title: z.string().min(1, "Title is required"),
  description: z.string().min(10, "Description must be at least 10 characters").optional(),
  category: CategoryEnum,

  // Categorization
  subcategory: z.array(z.string()).default([]).optional(),
  tags: z.array(z.string()).default([]),
  difficulty: DifficultyEnum.default("intro"),
  parent: z.string().optional(), // Slug of parent article for hierarchical navigation

  // Metadata
  updated: z.string().regex(/^\d{4}-\d{2}-\d{2}/, "Date must be in YYYY-MM-DD format"),
  readingTime: z.number().positive().optional(), // Minutes (auto-calculated if not provided)

  // Content enhancements
  sources: z.array(SourceSchema).default([]).optional(),
  related: z.array(z.string()).default([]), // Array of slugs
  prerequisites: z.array(z.string()).default([]).optional(), // Array of slugs
  hero: z.string().optional(), // Hero image path
  infobox: z.record(z.string(), z.string()).optional(), // Key-value pairs for Wikipedia-style infobox

  // Display options
  toc: z.boolean().default(true), // Show table of contents?

  // Legacy Wiki.js fields (for migration compatibility)
  published: z.boolean().default(true).optional(),
  dateCreated: z.string().optional(),
  editor: z.string().optional(),
});

export type Frontmatter = z.infer<typeof FrontmatterSchema>;
export type Category = z.infer<typeof CategoryEnum>;
export type Difficulty = z.infer<typeof DifficultyEnum>;
export type Source = z.infer<typeof SourceSchema>;

/**
 * Validate frontmatter and throw descriptive error if invalid
 */
export function validateFrontmatter(data: unknown, filepath?: string): Frontmatter {
  try {
    return FrontmatterSchema.parse(data);
  } catch (error) {
    if (error instanceof z.ZodError) {
      const issues = error.issues.map(issue => `  - ${issue.path.join('.')}: ${issue.message}`).join('\n');
      throw new Error(
        `Invalid frontmatter${filepath ? ` in ${filepath}` : ''}:\n${issues}`
      );
    }
    throw error;
  }
}

/**
 * Partial validation for migration (allows missing fields)
 */
export const PartialFrontmatterSchema = FrontmatterSchema.partial({
  description: true,
  updated: true,
}).extend({
  // Make some fields required for migration
  title: z.string().min(1),
  category: CategoryEnum,
});

export type PartialFrontmatter = z.infer<typeof PartialFrontmatterSchema>;

export const ContentMetadataSchema = z.object({
  slug: z.string(),
  category: z.string(),
  frontmatter: FrontmatterSchema,
  readingTime: z.number().optional(),
});

export type ContentMetadata = z.infer<typeof ContentMetadataSchema>;
