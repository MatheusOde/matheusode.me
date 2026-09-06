import { z } from 'zod';

const text = z.string().trim().min(1);
const date = z.preprocess((value) => {
  if (typeof value === 'string' && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    const parsed = new Date(`${value}T00:00:00Z`);
    return !Number.isNaN(parsed.getTime()) && parsed.toISOString().slice(0, 10) === value ? parsed : value;
  }
  return value;
}, z.date().nullable());

const common = {
  title: text,
  summary: text,
  draft: z.boolean(),
  featured: z.boolean(),
  publishedDate: date,
  updatedDate: date,
  seoTitle: text,
  seoDescription: text,
};

type Publication = { draft: boolean; publishedDate: Date | null; updatedDate: Date | null };

function validateDates(data: Publication, ctx: z.RefinementCtx) {
  if (!data.draft && !data.publishedDate) {
    ctx.addIssue({ code: 'custom', path: ['publishedDate'], message: 'Published content requires a publication date.' });
  }
  if (data.updatedDate && (!data.publishedDate || data.updatedDate < data.publishedDate)) {
    ctx.addIssue({ code: 'custom', path: ['updatedDate'], message: 'Update date must be on or after the publication date.' });
  }
}

export const writingSchema = z.object({
  ...common,
  tags: z.array(text),
}).superRefine(validateDates);

export const workSchema = z.object({
  ...common,
  problemDomain: text,
  role: text,
  systems: z.array(text).min(1),
  stakeholders: z.array(text).min(1),
  constraints: z.array(text).min(1),
  outcomeType: z.enum(['delivery-complexity', 'qualitative', 'quantified']),
  verifiedOutcome: text,
  confidentialityReviewed: z.boolean(),
  factualReviewed: z.boolean(),
  approvalReference: z.string().default(''),
  evidenceReferences: z.array(text).default([]),
  quantifiedOutcomeApproved: z.boolean().default(false),
  namedOrganizations: z.array(text).default([]),
  organizationPermissionReferences: z.array(text).default([]),
}).superRefine((data, ctx) => {
  validateDates(data, ctx);
  if (data.draft) return;
  for (const field of ['confidentialityReviewed', 'factualReviewed'] as const) {
    if (!data[field]) ctx.addIssue({ code: 'custom', path: [field], message: 'Matheus must approve factual accuracy and confidentiality before publication.' });
  }
  if (!data.approvalReference.trim()) ctx.addIssue({ code: 'custom', path: ['approvalReference'], message: 'Record the factual and confidentiality approval reference.' });
  if (!data.evidenceReferences.length) ctx.addIssue({ code: 'custom', path: ['evidenceReferences'], message: 'Published cases require approved evidence references.' });
  if (data.outcomeType === 'quantified' && !data.quantifiedOutcomeApproved) ctx.addIssue({ code: 'custom', path: ['quantifiedOutcomeApproved'], message: 'Matheus must explicitly approve quantified results.' });
  if (data.namedOrganizations.length && !data.organizationPermissionReferences.length) ctx.addIssue({ code: 'custom', path: ['organizationPermissionReferences'], message: 'Document publication permission for employer/client names.' });
});

export type WorkData = z.infer<typeof workSchema>;
export type WritingData = z.infer<typeof writingSchema>;

export function isPublishedWriting(data: WritingData): boolean {
  return !data.draft && data.publishedDate !== null && data.publishedDate.getTime() <= Date.now();
}

export function isPublishedWork(data: WorkData): boolean {
  return isPublishedWriting({ ...data, tags: [] }) && workSchema.safeParse(data).success;
}

export function sortByPublishedDate<T extends { data: { publishedDate: Date | null } }>(entries: T[]): T[] {
  return [...entries].sort((a, b) => (b.data.publishedDate?.getTime() ?? 0) - (a.data.publishedDate?.getTime() ?? 0));
}
