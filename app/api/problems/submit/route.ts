import { auth, prisma } from "@/lib/auth";
import { submitProblem } from "@/lib/validations/submit";
import { NextResponse } from "next/server";
import { submissionQueue } from "@/lib/queue";

export async function POST(request: Request) {
    try {
        const body = await request.text();
        const parsedBody = submitProblem.parse(JSON.parse(body));

        const session = await auth.api.getSession({
            headers: request.headers
        });

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const problem = await prisma.problem.findUnique({
            where: {
                slug: parsedBody.slug
            }
        });

        if (!problem?.id) {
            return NextResponse.json(
                { error: "Problem not found" },
                { status: 404 }
            );
        }

        const submission = await prisma.submission.create({
            data: {
                code: parsedBody.code,
                language: parsedBody.language,
                problemId: problem.id,
                status: "PENDING",
                userId: session.user.id,
            }
        });

        await submissionQueue.add("execute", { submissionId: submission.id });

        return NextResponse.json({
            submissionId: submission.id,
            status: submission.status,
        });
    } catch (err: any) {
        console.error("Submit error:", err);
        return NextResponse.json(
            { error: err.message || "Internal server error" },
            { status: 400 }
        );
    }
}