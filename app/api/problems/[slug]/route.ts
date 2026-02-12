import { prisma } from "@/lib/auth";
import { auth } from "@/lib/auth";
import { UpdateProblemSchema } from "@/lib/validations/problem";
import { z } from "zod";

/**
 * Updates an existing problem identified by its slug.
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
**/
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