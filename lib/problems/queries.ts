import { prisma } from "../auth";

export async function getProblems() {
  const problems = await  prisma.problem.findMany({
    select : {
        title : true,
        tags : true,
        difficulty : true,
        id : true
    }
  })
  return problems;
}
