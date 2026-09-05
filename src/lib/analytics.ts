export const conversionEvents = ['work_case_opened','email_contact_clicked','linkedin_clicked','resume_downloaded','article_opened'] as const;
export type ConversionEvent = typeof conversionEvents[number];
export function isConversionEvent(value: string | undefined): value is ConversionEvent {
  return conversionEvents.some(event => event === value);
}
// Opt-in adapter: no URL, referrer, query, identifier, or free text is sent.
export function conversionPayload(name: ConversionEvent) {return {name};}
export function bindConversionEvents(send: (payload: {name:ConversionEvent})=>void, root: Document = document) {
  const handler = (event: MouseEvent) => {
    if (!(event.target instanceof Element)) return;
    const link = event.target.closest<HTMLAnchorElement>('a[data-event]');
    if (link && isConversionEvent(link.dataset.event)) send(conversionPayload(link.dataset.event));
  };
  root.addEventListener('click',handler);
  return () => root.removeEventListener('click',handler);
}
