import { prisma } from "@/lib/auth";
import { auth } from "@/lib/auth";
import { UpdateProblemSchema } from "@/lib/validations/problem";
import { z } from "zod";

/**
 * Retrieves a specific problem by its slug.
 *
 * This endpoint fetches a single programming problem identified by its unique slug.
 * Only sample test cases are included in the response to prevent exposing solution
 * test cases that users should discover themselves. The slug is expected to follow
 * URL-friendly conventions (lowercase, numbers, hyphens only).
 *
 * @async
 * @function GET
 * @route GET /api/problems/[slug]
 * @public This endpoint does not require authentication
 *
 * @param {Request} request - The HTTP request object
 * @param {Object} params - Route parameters extracted from the URL
 * @param {string} params.slug - The unique slug identifying the problem to retrieve
 *
 * @returns {Promise<Response>} JSON response containing:
 *   - success: boolean - Indicates if the request was successful
 *   - message: string - Descriptive message about the operation result
 *   - data: Problem - The problem object with sample test cases only
 *
 * @throws {404} When no problem exists with the provided slug
 * @throws {500} When database query fails or server error occurs
 *
 * @example
 * // Request: GET /api/problems/two-sum
 * // Success Response (200):
 * {
 *   "success": true,
 *   "message": "Problem fetched successfully",
 *   "data": {
 *     "id": "clx...",
 *     "title": "Two Sum",
 *     "slug": "two-sum",
 *     "difficulty": "EASY",
 *     "statement": "Given an array of integers nums and an integer target...",
 *     "constraints": "2 <= nums.length <= 10^4",
 *     "tags": ["array", "hash-table"],
 *     "createdAt": "2024-01-15T10:30:00.000Z",
 *     "updatedAt": "2024-01-15T10:30:00.000Z",
 *     "testCases": [
 *       {
 *         "input": "[2,7,11,15]\n9",
 *         "output": "[0,1]",
 *         "isSample": true
 *       }
 *     ]
 *   }
 * }
 *
 * // Error Response (404):
 * {
 *   "success": false,
 *   "message": "Problem not found"
 * }
 *
 * @since 1.0.0
 * @author Authentication Team
 */
export async function GET(
    request: Request,
    { params }: { params: { slug: string } }
) {
    try {
        const problem = await prisma.problem.findUnique({
            where: { slug: params.slug },
            include: {
                testCases: {
                    where: { isSample: true },
                    select: { input: true, output: true, isSample: true }
                }
            }
        });

        if (!problem) {
            return Response.json({
                success: false,
                message: "Problem not found"
            }, { status: 404 });
        }

        return Response.json({
            success: true,
            message: "Problem fetched successfully",
            data: problem
        });
    } catch (error) {
        console.error("Error fetching problem:", error);
        return Response.json({
            success: false,
            message: "Failed to fetch problem"
        }, { status: 500 });
    }
}

/**
 * Updates an existing problem identified by its slug.
 *
 * This endpoint allows authenticated users to update specific fields of an existing
 * programming problem. The update is partial - only fields provided in the request
 * body will be modified. If a new slug is provided, it must be unique across all
 * problems. When updating test cases, all existing test cases are deleted and
 * replaced with the new set to ensure data consistency.
 *
 * @async
 * @function PUT
 * @route PUT /api/problems/[slug]
 * @protected Requires valid user authentication session
 *
 * @param {Request} request - The HTTP request object containing:
 *   - headers: Headers - Request headers including authentication cookies
 *   - json(): Promise<Object> - Request body with partial problem data
 * @param {Object} params - Route parameters extracted from the URL
 * @param {string} params.slug - The unique slug identifying the problem to update
 *
 * @returns {Promise<Response>} JSON response containing:
 *   - success: boolean - Indicates if the request was successful
 *   - message: string - Descriptive message about the operation result
 *   - data: Problem - The updated problem object with all test cases
 *
 * @throws {401} When user is not authenticated or session is invalid
 * @throws {400} When request body validation fails with detailed error messages
 * @throws {404} When no problem exists with the provided slug
 * @throws {409} When attempting to change slug to one that already exists
 * @throws {500} When database operation fails or server error occurs
 *
 * @example
 * // Request: PUT /api/problems/two-sum
 * // Headers: Cookie with auth session
 * // Body (partial update):
 * {
 *   "title": "Two Sum (Updated)",
 *   "difficulty": "MEDIUM"
 * }
 *
 * // Success Response (200):
 * {
 *   "success": true,
 *   "message": "Problem updated successfully",
 *   "data": {
 *     "id": "clx...",
 *     "title": "Two Sum (Updated)",
 *     "slug": "two-sum",
 *     "difficulty": "MEDIUM",
 *     "statement": "Given an array of integers nums and an integer target...",
 *     "constraints": "2 <= nums.length <= 10^4",
 *     "tags": ["array", "hash-table"],
 *     "createdAt": "2024-01-15T10:30:00.000Z",
 *     "updatedAt": "2024-01-15T11:00:00.000Z",
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
 * // Request with new slug and test cases:
 * {
 *   "slug": "two-sum-v2",
 *   "testCases": [
 *     {
 *       "input": "[1,2,3,4]\n5",
 *       "output": "[0,3]",
 *       "isSample": true
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
export async function PUT(
    request: Request,
    { params }: { params: { slug: string } }
) {
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
        const validatedData = UpdateProblemSchema.parse(body);

        const existingProblem = await prisma.problem.findUnique({
            where: { slug: params.slug }
        });

        if (!existingProblem) {
            return Response.json({
                success: false,
                message: "Problem not found"
            }, { status: 404 });
        }

        if (validatedData.slug && validatedData.slug !== params.slug) {
            const slugExists = await prisma.problem.findUnique({
                where: { slug: validatedData.slug }
            });

            if (slugExists) {
                return Response.json({
                    success: false,
                    message: "Problem with this slug already exists"
                }, { status: 409 });
            }
        }

        const updateData: Record<string, unknown> = {};
        if (validatedData.title !== undefined) updateData.title = validatedData.title;
        if (validatedData.slug !== undefined) updateData.slug = validatedData.slug;
        if (validatedData.difficulty !== undefined) updateData.difficulty = validatedData.difficulty;
        if (validatedData.statement !== undefined) updateData.statement = validatedData.statement;
        if (validatedData.constraints !== undefined) updateData.constraints = validatedData.constraints;
        if (validatedData.tags !== undefined) updateData.tags = validatedData.tags;

        if (validatedData.testCases !== undefined) {
            await prisma.testCase.deleteMany({
                where: { problemId: existingProblem.id }
            });
            updateData.testCases = {
                create: validatedData.testCases
            };
        }

        const updatedProblem = await prisma.problem.update({
            where: { slug: params.slug },
            data: updateData,
            include: {
                testCases: true
            }
        });

        return Response.json({
            success: true,
            message: "Problem updated successfully",
            data: updatedProblem
        });

    } catch (error) {
        console.error("Error updating problem:", error);
        
        if (error instanceof z.ZodError) {
            return Response.json({
                success: false,
                message: "Validation error",
                errors: error.issues
            }, { status: 400 });
        }

        return Response.json({
            success: false,
            message: "Failed to update problem"
        }, { status: 500 });
    }
}

/**
 * Deletes a specific problem identified by its slug.
 *
 * This endpoint allows authenticated users to permanently remove a programming
 * problem from the database. The deletion is cascaded, meaning all associated
 * test cases (both sample and hidden) will be automatically deleted as well.
 * This operation is irreversible and should be used with caution.
 *
 * @async
 * @function DELETE
 * @route DELETE /api/problems/[slug]
 * @protected Requires valid user authentication session
 *
 * @param {Request} request - The HTTP request object containing:
 *   - headers: Headers - Request headers including authentication cookies
 * @param {Object} params - Route parameters extracted from the URL
 * @param {string} params.slug - The unique slug identifying the problem to delete
 *
 * @returns {Promise<Response>} JSON response containing:
 *   - success: boolean - Indicates if the request was successful
 *   - message: string - Descriptive message about the operation result
 *
 * @throws {401} When user is not authenticated or session is invalid
 * @throws {404} When no problem exists with the provided slug
 * @throws {500} When database operation fails or server error occurs
 *
 * @example
 * // Request: DELETE /api/problems/two-sum
 * // Headers: Cookie with auth session
 *
 * // Success Response (200):
 * {
 *   "success": true,
 *   "message": "Problem deleted successfully"
 * }
 *
 * // Error Response (404):
 * {
 *   "success": false,
 *   "message": "Problem not found"
 * }
 *
 * // Error Response (401):
 * {
 *   "success": false,
 *   "message": "Unauthorized"
 * }
 *
 * @note This operation permanently deletes the problem and all associated test cases.
 *       Consider using PUT to mark problems as inactive instead of deletion if needed.
 *
 * @since 1.0.0
 * @author Authentication Team
 */
export async function DELETE(
    request: Request,
    { params }: { params: { slug: string } }
) {
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

        const existingProblem = await prisma.problem.findUnique({
            where: { slug: params.slug }
        });

        if (!existingProblem) {
            return Response.json({
                success: false,
                message: "Problem not found"
            }, { status: 404 });
        }

        await prisma.problem.delete({
            where: { slug: params.slug }
        });

        return Response.json({
            success: true,
            message: "Problem deleted successfully"
        });

    } catch (error) {
        console.error("Error deleting problem:", error);
        return Response.json({
            success: false,
            message: "Failed to delete problem"
        }, { status: 500 });
    }
}