import { defineCollection } from "astro:content";
import { glob } from "astro/loaders";
import { z } from "astro/zod";

export const laneIds = ["econ", "ops", "lang", "geo"] as const;
export type LaneId = (typeof laneIds)[number];
const laneEnum = z.enum(laneIds);

const yearMonth = z.string().regex(/^\d{4}-(0[1-9]|1[0-2])$/);
const endDate = z.union([yearMonth, z.literal("present")]);

const bio = defineCollection({
  loader: glob({ pattern: "*/*.md", base: "./src/content/bio" }),
  schema: z.object({
    headline: z.string(),
    aliasesLine: z.string(),
    currentBase: z.string(),
    lastUpdated: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
    heroSummary: z.string(),
    interestsTitle: z.string(),
    interests: z.array(z.object({ label: z.string(), detail: z.string() }))
  })
});

const timeline = defineCollection({
  loader: glob({ pattern: "*/*.md", base: "./src/content/timeline" }),
  schema: z.object({
    start: yearMonth,
    end: endDate,
    isExpectedEnd: z.boolean().default(false),
    lane: laneEnum,
    strokeStyle: z.enum(["solid", "dashed"]).default("solid"),
    kind: z.enum(["role", "education"]),
    title: z.string(),
    org: z.string(),
    location: z.string(),
    summary: z.string(),
    highlights: z.array(z.string()).default([]),
    tags: z.array(z.string()).default([]),
    onCv: z.boolean().default(true),
    order: z.number().int()
  })
});

const projects = defineCollection({
  loader: glob({ pattern: "*/*.md", base: "./src/content/projects" }),
  schema: z.object({
    start: yearMonth,
    end: endDate,
    lane: laneEnum.default("ops"),
    strokeStyle: z.enum(["solid", "dashed"]).default("solid"),
    title: z.string(),
    role: z.string(),
    org: z.string(),
    location: z.string(),
    summary: z.string(),
    highlights: z.array(z.string()).default([]),
    stack: z.array(z.string()),
    repoUrl: z.url().optional(),
    liveUrl: z.url().optional(),
    showInTimeline: z.boolean().default(true),
    onCv: z.boolean().default(true),
    order: z.number().int()
  })
});

const geography = defineCollection({
  loader: glob({ pattern: "*/*.md", base: "./src/content/geography" }),
  schema: z.object({
    city: z.string(),
    secondaryRegions: z.array(z.string()).default([]),
    country: z.string(),
    roleLabel: z.string(),
    gdpProxyNote: z.string(),
    order: z.number().int()
  })
});

const languages = defineCollection({
  loader: glob({ pattern: "*.yaml", base: "./src/content/languages" }),
  schema: z.object({
    items: z.array(
      z.object({
        code: z.string(),
        name: z.string(),
        autonym: z.string(),
        levelLabel: z.string(),
        selfAssessedCefr: z.string().optional(),
        assessmentType: z.enum(["certified", "self-assessed", "native"]),
        certificate: z
          .object({
            name: z.string(),
            score: z.string(),
            scope: z.string(),
            testType: z.string(),
            confirmed: z.boolean()
          })
          .optional()
      })
    )
  })
});

const faq = defineCollection({
  loader: glob({ pattern: "*/*.md", base: "./src/content/faq" }),
  schema: z.object({
    question: z.string(),
    order: z.number().int()
  })
});

export const collections = { bio, timeline, projects, geography, languages, faq };
