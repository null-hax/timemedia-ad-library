import { z } from 'zod'

export const AdSchema = z.object({
  id: z.string(),
  companyName: z.string(),
  companyId: z.string(),
  adCopy: z.string(),
  date: z.string(),
  newsletters: z.array(z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
    traffic_rank: z.number(),
  })),
  company: z.object({
    id: z.string(),
    name: z.string(),
    slug: z.string(),
    tags: z.array(z.string()),
  }),
})

export type Ad = z.infer<typeof AdSchema> 