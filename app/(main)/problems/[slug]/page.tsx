import { ProblemClient } from "@/components/problem/problem_client"
import { getProblemBySlug } from "@/lib/problems/queries"

export default async function ProblemPage({
  params,
}: {
  params: { slug: string }
}) {
  const slug = await params.slug;
  const problem = await getProblemBySlug(slug);
  if (!problem) {
    return;
  }

  return <ProblemClient problem={problem!} />
}
