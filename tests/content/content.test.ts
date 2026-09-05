import { describe, expect, it } from 'vitest';
import { isPublishedWork, isPublishedWriting, sortByPublishedDate, workSchema, writingSchema } from '../../src/lib/content';

const article = { title: 'Test fixture', summary: 'Test only', draft: false, featured: false, publishedDate: '2026-01-01', updatedDate: null, seoTitle: 'Test fixture', seoDescription: 'Test only', tags: ['integration'] };
const work = { ...article, problemDomain: 'Test domain', role: 'Test role', systems: ['Test'], stakeholders: ['Test'], constraints: ['Test'], outcomeType: 'delivery-complexity', verifiedOutcome: 'Test evidence', confidentialityReviewed: true, factualReviewed: true, approvalReference: 'test-approval', evidenceReferences: ['test-evidence'] };

describe('writing publication', () => {
  it('requires metadata and dates', () => {
    expect(writingSchema.safeParse({ ...article, title: '' }).success).toBe(false);
    expect(writingSchema.safeParse({ ...article, publishedDate: null }).success).toBe(false);
    expect(writingSchema.safeParse({ ...article, publishedDate: '2026-02-30' }).success).toBe(false);
    expect(writingSchema.safeParse({ ...article, updatedDate: '2025-01-01' }).success).toBe(false);
  });
  it('excludes drafts and future publications', () => {
    expect(isPublishedWriting(writingSchema.parse({ ...article, draft: true, publishedDate: null }))).toBe(false);
    expect(isPublishedWriting(writingSchema.parse({ ...article, publishedDate: '2999-01-01' }))).toBe(false);
    expect(isPublishedWriting(writingSchema.parse(article))).toBe(true);
  });
  it('sorts dates without mutating callers', () => {
    const entries = [{ data: { publishedDate: new Date('2025-01-01') } }, { data: { publishedDate: new Date('2026-01-01') } }];
    expect(sortByPublishedDate(entries)[0]).toBe(entries[1]);
    expect(entries[0].data.publishedDate.getUTCFullYear()).toBe(2025);
  });
});

describe('case publication safeguards', () => {
  it('requires factual, confidentiality, evidence, and approval records', () => {
    for (const change of [{ confidentialityReviewed: false }, { factualReviewed: false }, { approvalReference: '' }, { evidenceReferences: [] }]) {
      expect(workSchema.safeParse({ ...work, ...change }).success).toBe(false);
    }
    expect(isPublishedWork(workSchema.parse(work))).toBe(true);
  });
  it('permits incomplete approvals only for non-public drafts', () => {
    const draft = workSchema.parse({ ...work, draft: true, confidentialityReviewed: false, factualReviewed: false, approvalReference: '', evidenceReferences: [], publishedDate: null });
    expect(isPublishedWork(draft)).toBe(false);
  });
  it('requires explicit permission for numbers and organization names', () => {
    expect(workSchema.safeParse({ ...work, outcomeType: 'quantified' }).success).toBe(false);
    expect(workSchema.safeParse({ ...work, outcomeType: 'quantified', quantifiedOutcomeApproved: true }).success).toBe(true);
    expect(workSchema.safeParse({ ...work, namedOrganizations: ['Example'] }).success).toBe(false);
    expect(workSchema.safeParse({ ...work, namedOrganizations: ['Example'], organizationPermissionReferences: ['test-permission'] }).success).toBe(true);
  });
});
