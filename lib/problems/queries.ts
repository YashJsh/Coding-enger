import { prisma } from "../auth";
import axios from "axios";

export async function getProblems() {
  const problems = await  prisma.problem.findMany({
    select : {
        title : true,
        tags : true,
        difficulty : true,
        id : true,
        slug : true,
    }
  })
  return problems;
}

export async function getProblemBySlug(slug : string){
  const problem = await prisma.problem.findFirst({
    where : {
      slug : slug
    }
  });
  return problem;
}

export async function submitCode(code: string, slug: string, language: "javascript" | "python") {
  const languageMap = {
    javascript: "JAVASCRIPT",
    python: "PYTHON"
  };

  const response = await axios.post("/api/problems/submit", {
    code,
    slug,
    language: languageMap[language]
  });

  return response.data;
}