import { CompareFn } from '../types/common.types';

export const defaultComparator: CompareFn<any> = (a, b) => {
   if (a < b) return -1;
   if (a > b) return 1;
   return 0;
};
