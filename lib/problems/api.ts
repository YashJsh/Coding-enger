import axios from "axios";

export async function submitCode(code: string, slug: string, language: "javascript" | "python") {
  if (!code.trim()) {
    throw new Error("Code cannot be empty");
  }

  const languageMap = {
    javascript: "JAVASCRIPT",
    python: "PYTHON"
  };

  try {
    const response = await axios.post("/api/problems/submit", {
      code,
      slug,
      language: languageMap[language]
    });
    return response.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.error || err.message || "Failed to submit code");
  }
}

export type TestCaseResult = {
  input: string;
  expectedOutput: string;
  actualOutput: string;
  passed: boolean;
  isSample: boolean;
  error?: string;
};

export type TestResults = {
  passed: number;
  total: number;
  results: TestCaseResult[];
};

export type SubmissionStatus = {
  id: string;
  status: string;
  output: string | null;
  testResults: TestResults | null;
  language: string;
  createdAt: Date;
};

export async function getSubmissionStatus(submissionId: string): Promise<SubmissionStatus> {
  try {
    const response = await axios.get(`/api/problems/submission/${submissionId}`);
    return response.data;
  } catch (err: any) {
    throw new Error(err.response?.data?.error || err.message || "Failed to fetch status");
  }
}
