export const PLAN_STEPS = ['CLASSIFY','RETRIEVE','DRAFT','DECIDE'];

export function buildPlan(ticket) {
  return [...PLAN_STEPS];
}
