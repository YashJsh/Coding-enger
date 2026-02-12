import { ProblemClient } from "@/components/problem/problem_client"
import { getProblemBySlug } from "@/lib/problems/queries"



export default async function ProblemPage({
  params,
}: {
  params: { slug: string }
}) {
  const problem = await getProblemBySlug(params.slug);
  if (!problem) {
    // handle 404
  }

  return <ProblemClient problem={problem!} />
}
