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
    maxRetriesPerRequest: null,
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

interface TestCaseResult {
    input: string;
    expectedOutput: string;
    actualOutput: string;
    passed: boolean;
    isSample: boolean;
    error?: string;
}

async function runTestCase(
    code: string,
    language: string,
    input: string,
    testCaseId: string,
    isSample: boolean
): Promise<TestCaseResult> {
    const image = imageMap[language];
    const fileName = fileNameMap[language];
    const runCommand = runCommandMap[language];

    if (!image || !fileName || !runCommand) {
        return {
            input,
            expectedOutput: "",
            actualOutput: "",
            passed: false,
            isSample,
            error: `Unsupported language: ${language}`,
        };
    }

    const tempDir = `/tmp/code-execution-${randomUUID()}`;

    try {
        await execAsync(`mkdir -p ${tempDir}`);
        await writeFile(join(tempDir, fileName), code);

        const dockerCommand = `docker run --rm \
            --memory=${MEMORY_LIMIT} \
            --memory-swap=${MEMORY_LIMIT} \
            -v ${tempDir}:/code \
            -w /code \
            ${image} \
            sh -c "echo '${input.replace(/'/g, "'\\''")}' | timeout ${TIMEOUT_MS / 1000}s ${runCommand} || (exit 124)"`;

        const { stdout, stderr } = await execAsync(dockerCommand, {
            timeout: TIMEOUT_MS + 5000,
        });

        const actualOutput = stdout.trim();
        
        return {
            input,
            expectedOutput: "",
            actualOutput,
            passed: false,
            isSample,
        };
    } catch (err: any) {
        const exitCode = err.code;
        if (exitCode === 124) {
            return {
                input,
                expectedOutput: "",
                actualOutput: "",
                passed: false,
                isSample,
                error: "Time limit exceeded",
            };
        }
        return {
            input,
            expectedOutput: "",
            actualOutput: "",
            passed: false,
            isSample,
            error: err.message || "Runtime error",
        };
    } finally {
        await rm(tempDir, { force: true, recursive: true }).catch(() => {});
    }
}

async function executeCode(submissionId: string, code: string, language: string) {
    const submission = await prisma.submission.findUnique({
        where: { id: submissionId },
        include: {
            problem: {
                include: {
                    testCases: true,
                },
            },
        },
    });

    if (!submission) {
        throw new Error(`Submission ${submissionId} not found`);
    }

    const testCases = submission.problem.testCases;
    
    if (!testCases || testCases.length === 0) {
        await prisma.submission.update({
            where: { id: submissionId },
            data: {
                status: "RUNTIME_ERROR",
                output: "No test cases found for this problem",
            },
        });
        return;
    }

    const results: TestCaseResult[] = [];
    let hasTimeout = false;
    let hasRuntimeError = false;

    for (const testCase of testCases) {
        const result = await runTestCase(
            code,
            language,
            testCase.input,
            testCase.id,
            testCase.isSample
        );

        result.expectedOutput = testCase.output;
        
        if (result.error?.includes("Time limit")) {
            hasTimeout = true;
            result.passed = false;
        } else if (result.error) {
            hasRuntimeError = true;
            result.passed = false;
        } else {
            result.passed = result.actualOutput.trim() === testCase.output.trim();
        }

        results.push(result);
    }

    const passedCount = results.filter((r) => r.passed).length;
    const totalCount = results.length;
    const allPassed = passedCount === totalCount;

    let dbStatus: "ACCEPTED" | "WRONG_ANSWER" | "TIME_LIMIT" | "RUNTIME_ERROR";

    if (hasTimeout) {
        dbStatus = "TIME_LIMIT";
    } else if (hasRuntimeError) {
        dbStatus = "RUNTIME_ERROR";
    } else if (allPassed) {
        dbStatus = "ACCEPTED";
    } else {
        dbStatus = "WRONG_ANSWER";
    }

    const testResults = {
        passed: passedCount,
        total: totalCount,
        results: results.map((r) => ({
            input: r.input,
            expectedOutput: r.expectedOutput,
            actualOutput: r.actualOutput,
            passed: r.passed,
            isSample: r.isSample,
            error: r.error,
        })),
    };

    await prisma.submission.update({
        where: { id: submissionId },
        data: {
            status: dbStatus,
            testResults: testResults as any,
        },
    });

    console.log(
        `Submission ${submissionId} processed. Status: ${dbStatus}, Passed: ${passedCount}/${totalCount}`
    );
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
