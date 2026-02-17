import { z } from "zod";

export const studyPlanSchema = z.object({
  subjects: z.array(z.string()),
  deadline: z.string(),
});
