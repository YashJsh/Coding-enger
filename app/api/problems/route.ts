import { prisma } from "@/lib/auth";
import { auth } from "@/lib/auth";
import { CreateProblemSchema } from "@/lib/validations/problem";
import { z } from "zod";

/**
 * Retrieves all problems from the database.
 *
 * This endpoint fetches all available programming problems ordered by
 * creation date in descending order (newest first). The problems include
 * their associated test cases but filters to only include sample test cases
 * to avoid exposing hidden test case solutions to end users.
 *
 * @async
 * @function GET
 * @route GET /api/problems
 * @public This endpoint does not require authentication
 *
 * @returns {Promise<Response>} JSON response containing:
 *   - success: boolean - Indicates if the request was successful
 *   - message: string - Descriptive message about the operation result
 *   - data: Problem[] - Array of problem objects with sample test cases only
 *
 * @throws {500} When database query fails or server error occurs
 *
 * @example
 * // Request: GET /api/problems
 * // Success Response (200):
 * {
 *   "success": true,
 *   "message": "Problems fetched successfully",
 *   "data": [
 *     {
 *       "id": "clx...",
 *       "title": "Two Sum",
 *       "slug": "two-sum",
 *       "difficulty": "EASY",
 *       "statement": "Given an array...",
 *       "constraints": "2 <= nums.length...",
 *       "tags": ["array", "hash-table"],
 *       "createdAt": "2024-01-15T10:30:00.000Z",
 *       "updatedAt": "2024-01-15T10:30:00.000Z",
 *       "testCases": [
 *         {
 *           "input": "[2,7,11,15]\n9",
 *           "output": "[0,1]",
 *           "isSample": true
 *         }
 *       ]
 *     }
 *   ]
 * }
 *
 * // Error Response (500):
 * {
 *   "success": false,
 *   "message": "Failed to fetch problems"
 * }
 *
 * @since 1.0.0
 * @author Authentication Team
 */
export async function GET() {
    try {
        const problems = await prisma.problem.findMany({
            include: {
                testCases: {
                    where: { isSample: true },
                    select: { input: true, output: true, isSample: true }
                }
            },
            orderBy: { createdAt: 'desc' }
        });
        
        return Response.json({
            success: true,
            message: "Problems fetched successfully",
            data: problems
        });
    } catch (error) {
        console.error("Error fetching problems:", error);
        return Response.json({
            success: false,
            message: "Failed to fetch problems"
        }, { status: 500 });
    }
}

/**
 * Creates a new programming problem in the database.
 *
 * This endpoint allows authenticated users to create new programming problems
 * with associated test cases. The request body is validated against a strict
 * schema to ensure data integrity. Each problem must have a unique slug that
 * follows URL-friendly naming conventions. Test cases are created in a
 * transactional manner to ensure atomicity.
 *
 * @async
 * @function POST
 * @route POST /api/problems
 * @protected Requires valid user authentication session
 *
 * @param {Request} request - The HTTP request object containing:
 *   - headers: Headers - Request headers including authentication cookies
 *   - json(): Promise<Object> - Request body with problem data
 *
 * @returns {Promise<Response>} JSON response containing:
 *   - success: boolean - Indicates if the request was successful
 *   - message: string - Descriptive message about the operation result
 *   - data: Problem - The created problem object with all test cases
 *
 * @throws {401} When user is not authenticated or session is invalid
 * @throws {400} When request body validation fails with detailed error messages
 * @throws {409} When a problem with the same slug already exists
 * @throws {500} When database operation fails or server error occurs
 *
 * @example
 * // Request: POST /api/problems
 * // Headers: Cookie with auth session
 * // Body:
 * {
 *   "title": "Two Sum",
 *   "slug": "two-sum",
 *   "difficulty": "EASY",
 *   "statement": "Given an array of integers nums and an integer target...",
 *   "constraints": "2 <= nums.length <= 10^4",
 *   "tags": ["array", "hash-table"],
 *   "testCases": [
 *     {
 *       "input": "[2,7,11,15]\n9",
 *       "output": "[0,1]",
 *       "isSample": true
 *     },
 *     {
 *       "input": "[3,2,4]\n6",
 *       "output": "[1,2]",
 *       "isSample": true
 *     }
 *   ]
 * }
 *
 * // Success Response (201):
 * {
 *   "success": true,
 *   "message": "Problem created successfully",
 *   "data": {
 *     "id": "clx...",
 *     "title": "Two Sum",
 *     "slug": "two-sum",
 *     "difficulty": "EASY",
 *     "statement": "Given an array...",
 *     "constraints": "2 <= nums.length...",
 *     "tags": ["array", "hash-table"],
 *     "createdAt": "2024-01-15T10:30:00.000Z",
 *     "updatedAt": "2024-01-15T10:30:00.000Z",
 *     "testCases": [
 *       {
 *         "id": "clt...",
 *         "input": "[2,7,11,15]\n9",
 *         "output": "[0,1]",
 *         "isSample": true,
 *         "problemId": "clx...",
 *         "createdAt": "2024-01-15T10:30:00.000Z"
 *       }
 *     ]
 *   }
 * }
 *
 * // Error Response (400):
 * {
 *   "success": false,
 *   "message": "Validation error",
 *   "errors": [
 *     {
 *       "code": "too_small",
 *       "message": "Title is required",
 *       "path": ["title"]
 *     }
 *   ]
 * }
 *
 * // Error Response (409):
 * {
 *   "success": false,
 *   "message": "Problem with this slug already exists"
 * }
 *
 * @since 1.0.0
 * @author Authentication Team
 */
export async function POST(request: Request) {
    try {
        const session = await auth.api.getSession({
            headers: request.headers
        });

        if (!session?.user) {
            return Response.json({
                success: false,
                message: "Unauthorized"
            }, { status: 401 });
        }

        const body = await request.json();
        const validatedData = CreateProblemSchema.parse(body);

        const existingProblem = await prisma.problem.findUnique({
            where: { slug: validatedData.slug }
        });

        if (existingProblem) {
            return Response.json({
                success: false,
                message: "Problem with this slug already exists"
            }, { status: 409 });
        }

        const problem = await prisma.problem.create({
            data: {
                title: validatedData.title,
                slug: validatedData.slug,
                difficulty: validatedData.difficulty,
                statement: validatedData.statement,
                constraints: validatedData.constraints,
                tags: validatedData.tags,
                testCases: {
                    create: validatedData.testCases
                }
            },
            include: {
                testCases: true
            }
        });

        return Response.json({
            success: true,
            message: "Problem created successfully",
            data: problem
        }, { status: 201 });

    } catch (error) {
        console.error("Error creating problem:", error);
        
        if (error instanceof z.ZodError) {
            return Response.json({
                success: false,
                message: "Validation error",
                errors: error.issues
            }, { status: 400 });
        }

        return Response.json({
            success: false,
            message: "Failed to create problem"
        }, { status: 500 });
    }
}