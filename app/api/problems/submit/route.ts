import { auth, prisma } from "@/lib/auth";
import { submitProblem } from "@/lib/validations/submit";
import { NextResponse } from "next/server";
import { submissionQueue } from "@/lib/queue";

export async function POST(request: Request) {
    const body = await request.clone().text();
    const parsedBody = submitProblem.parse(JSON.parse(body));

    const session = await auth.api.getSession({
        headers: request.headers
    });

    const problem = await prisma.problem.findUnique({
        where: {
            slug: parsedBody.slug
        }
    });

    if (!session?.user?.id) {
        throw new Error(
            "User not found"
        )
    }

    if (!problem?.id) {
        throw new Error("Problem not found");
    }
    const submission = await prisma.submission.create({
        data: {
            code: parsedBody.code,
            language: parsedBody.language,
            problemId: problem?.id,
            status: "PENDING",
            userId: session?.user.id,
        }
    })

    await submissionQueue.add("execute", { submissionId: submission.id });

    return NextResponse.json({
        submissionId: submission.id,
        status: submission.status,
    });
}