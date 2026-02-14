import { Worker } from "bullmq";
import IORedis from "ioredis";
import { exec } from "child_process";
import { promisify } from "util";
import { prisma } from "@/lib/auth";
import { writeFile, rm } from "fs/promises";
import { join } from "path";
import { randomUUID } from "crypto";

const execAsync = promisify(exec);

const connection = new IORedis({
    host: "127.0.0.1",
    port: 6379,
});

const TIMEOUT_MS = 5000;
const MEMORY_LIMIT = 128 * 1024 * 1024;

const imageMap: Record<string, string> = {
    JAVASCRIPT: "node:18-alpine",
    PYTHON: "python:3-alpine",
};

const fileNameMap: Record<string, string> = {
    JAVASCRIPT: "main.js",
    PYTHON: "main.py",
};

const runCommandMap: Record<string, string> = {
    JAVASCRIPT: "node main.js",
    PYTHON: "python main.py",
};

async function executeCode(submissionId: string, code: string, language: string) {
    const image = imageMap[language];
    const fileName = fileNameMap[language];
    const runCommand = runCommandMap[language];

    if (!image || !fileName || !runCommand) {
        throw new Error(`Unsupported language: ${language}`);
    }

    const tempDir = `/tmp/code-execution-${randomUUID()}`;

    await execAsync(`mkdir -p ${tempDir}`);
    await writeFile(join(tempDir, fileName), code);

    const dockerCommand = `docker run --rm \
        --memory=${MEMORY_LIMIT} \
        --memory-swap=${MEMORY_LIMIT} \
        -v ${tempDir}:/code \
        -w /code \
        ${image} \
        sh -c "timeout ${TIMEOUT_MS / 1000}s ${runCommand} || (exit 124)"`;

    let output = "";
    let errorOutput = "";
    let dbStatus: "ACCEPTED" | "TIME_LIMIT" | "RUNTIME_ERROR" = "ACCEPTED";

    try {
        const { stdout, stderr } = await execAsync(dockerCommand, {
            timeout: TIMEOUT_MS + 5000,
        });
        output = stdout;
        errorOutput = stderr;
    } catch (err: any) {
        const exitCode = err.code;
        if (exitCode === 124 || err.killed) {
            dbStatus = "TIME_LIMIT";
            errorOutput = "Execution timed out";
        } else {
            dbStatus = "RUNTIME_ERROR";
            errorOutput = err.message;
        }
    } finally {
        await rm(tempDir, { force: true, recursive: true }).catch(() => {});
    }

    await prisma.submission.update({
        where: { id: submissionId },
        data: {
            status: dbStatus,
            output: output || errorOutput,
        },
    });

    console.log(`Submission ${submissionId} processed. Status: ${dbStatus}, Output: ${output || errorOutput}`);
}

const worker = new Worker(
    "submission-queue",
    async (job) => {
        const { submissionId } = job.data;

        const submission = await prisma.submission.findUnique({
            where: { id: submissionId },
        });

        if (!submission) {
            throw new Error(`Submission ${submissionId} not found`);
        }

        await executeCode(submission.id, submission.code, submission.language);
    },
    { connection: connection as any }
);

worker.on("completed", (job) => {
    console.log(`Job ${job.id} completed`);
});

worker.on("failed", (job, err) => {
    console.error(`Job ${job?.id} failed:`, err.message);
});

console.log("Worker started. Waiting for jobs...");
