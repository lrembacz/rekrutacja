import type { Category } from './types';

import { INPUT } from './input';

export const getCategories = async (): Promise<{ data: Category[] }> => ({
  data: INPUT,
});
