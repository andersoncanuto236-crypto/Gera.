import type { UserPlan } from '../../types';

export const canUseAI = (plan: UserPlan): boolean => plan === 'PAID';
