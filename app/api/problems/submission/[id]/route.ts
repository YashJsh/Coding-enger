import { auth, prisma } from "@/lib/auth";
import { NextResponse } from "next/server";

export async function GET(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
) {
    try {
        const { id } = await params;

        const session = await auth.api.getSession({
            headers: request.headers
        });

        if (!session?.user?.id) {
            return NextResponse.json(
                { error: "Unauthorized" },
                { status: 401 }
            );
        }

        const submission = await prisma.submission.findUnique({
            where: { id },
            select: {
                id: true,
                status: true,
                output: true,
                testResults: true,
                language: true,
                createdAt: true,
            }
        });

        if (!submission) {
            return NextResponse.json(
                { error: "Submission not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(submission);
    } catch (err: any) {
        console.error("Fetch submission error:", err);
        return NextResponse.json(
            { error: err.message || "Internal server error" },
            { status: 400 }
        );
    }
}
