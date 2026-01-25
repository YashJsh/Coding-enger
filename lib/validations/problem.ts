import { z } from "zod";

/**
 * Enumeration for problem difficulty levels.
 * 
 * This enum defines the three standard difficulty categories for programming
 * problems in the system. Each difficulty level helps users understand the
 * expected complexity and time commitment required to solve the problem.
 *
 * @enum {string}
 * @readonly
 * @since 1.0.0
 * @author Authentication Team
 */
export const DifficultyEnum = z.enum(["EASY", "MEDIUM", "HARD"]);

/**
 * Zod schema for validating new problem creation requests.
 * 
 * This schema enforces strict validation rules for creating new programming
 * problems. All fields are required to ensure data integrity and completeness.
 * The validation includes length constraints, format validation for slugs,
 * and ensures at least one test case is provided.
 *
 * @typedef {Object} CreateProblemSchema
 * @property {string} title - Problem title (1-200 characters)
 * @property {string} slug - URL-friendly slug (1-100 chars, lowercase letters, numbers, hyphens only)
 * @property {"EASY"|"MEDIUM"|"HARD"} difficulty - Problem difficulty level
 * @property {string} statement - Detailed problem statement and description
 * @property {string} constraints - Input/output constraints and limitations
 * @property {string[]} tags - Array of problem tags (1-10 tags, each 1-50 characters)
 * @property {Object[]} testCases - Array of test case objects (minimum 1 required)
 * @property {string} testCases[].input - Test case input data
 * @property {string} testCases[].output - Expected output for the test case
 * @property {boolean} [testCases[].isSample=false] - Whether this is a sample test case
 *
 * @example
 * // Valid input:
 * {
 *   "title": "Two Sum",
 *   "slug": "two-sum",
 *   "difficulty": "EASY",
 *   "statement": "Given an array of integers...",
 *   "constraints": "2 <= nums.length <= 10^4",
 *   "tags": ["array", "hash-table"],
 *   "testCases": [
 *     {
 *       "input": "[2,7,11,15]\n9",
 *       "output": "[0,1]",
 *       "isSample": true
 *     }
 *   ]
 * }
 *
 * @since 1.0.0
 * @author Authentication Team
 */
export const CreateProblemSchema = z.object({
  title: z.string().min(1, "Title is required").max(200, "Title too long"),
  slug: z.string().min(1, "Slug is required").max(100, "Slug too long")
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens"),
  difficulty: DifficultyEnum,
  statement: z.string().min(1, "Statement is required"),
  constraints: z.string().min(1, "Constraints are required"),
  tags: z.array(z.string().min(1).max(50)).max(10, "Too many tags"),
  testCases: z.array(z.object({
    input: z.string().min(1, "Test case input is required"),
    output: z.string().min(1, "Test case output is required"),
    isSample: z.boolean().default(false)
  })).min(1, "At least one test case is required")
});

/**
 * Zod schema for validating problem update requests.
 * 
 * This schema provides partial validation for updating existing problems.
 * All fields are optional, allowing for selective updates. When a field
 * is provided, it undergoes the same validation as in the creation schema.
 * If test cases are provided, all existing test cases will be replaced.
 *
 * @typedef {Object} UpdateProblemSchema
 * @property {string} [title] - Problem title (1-200 characters)
 * @property {string} [slug] - URL-friendly slug (1-100 chars, lowercase letters, numbers, hyphens only)
 * @property {"EASY"|"MEDIUM"|"HARD"} [difficulty] - Problem difficulty level
 * @property {string} [statement] - Detailed problem statement and description
 * @property {string} [constraints] - Input/output constraints and limitations
 * @property {string[]} [tags] - Array of problem tags (1-10 tags, each 1-50 characters)
 * @property {Object[]} [testCases] - Array of test case objects (replaces all existing test cases)
 * @property {string} testCases[].input - Test case input data
 * @property {string} testCases[].output - Expected output for the test case
 * @property {boolean} [testCases[].isSample=false] - Whether this is a sample test case
 *
 * @example
 * // Partial update - changing only title and difficulty:
 * {
 *   "title": "Two Sum (Updated)",
 *   "difficulty": "MEDIUM"
 * }
 *
 * // Complete test case replacement:
 * {
 *   "testCases": [
 *     {
 *       "input": "[1,2,3,4]\n5",
 *       "output": "[0,3]",
 *       "isSample": true
 *     }
 *   ]
 * }
 *
 * @since 1.0.0
 * @author Authentication Team
 */
export const UpdateProblemSchema = z.object({
  title: z.string().min(1).max(200).optional(),
  slug: z.string().min(1).max(100)
    .regex(/^[a-z0-9-]+$/, "Slug must contain only lowercase letters, numbers, and hyphens").optional(),
  difficulty: DifficultyEnum.optional(),
  statement: z.string().min(1).optional(),
  constraints: z.string().min(1).optional(),
  tags: z.array(z.string().min(1).max(50)).max(10).optional(),
  testCases: z.array(z.object({
    input: z.string().min(1),
    output: z.string().min(1),
    isSample: z.boolean().default(false)
  })).optional()
});

/**
 * TypeScript type inferred from CreateProblemSchema.
 * 
 * This type represents the complete data structure required for creating
 * a new problem. It's automatically generated from the Zod schema and
 * provides type safety for function parameters and interfaces.
 *
 * @typedef CreateProblemInput
 *
 * @since 1.0.0
 * @author Authentication Team
 */
export type CreateProblemInput = z.infer<typeof CreateProblemSchema>;

/**
 * TypeScript type inferred from UpdateProblemSchema.
 * 
 * This type represents the partial data structure used for updating
 * existing problems. All fields are optional to support selective updates.
 * It's automatically generated from the Zod schema and provides type safety.
 *
 * @typedef UpdateProblemInput
 *
 * @since 1.0.0
 * @author Authentication Team
 */
export type UpdateProblemInput = z.infer<typeof UpdateProblemSchema>;