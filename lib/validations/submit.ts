import * as z from "zod";

const submitProblem = z.object({
    code : z.string(),
    slug : z.string(),
    language : z.enum(["PYTHON", "JAVASCRIPT"])
});

export { submitProblem }