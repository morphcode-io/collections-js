export const isValidIndex = (index: number, size: number): boolean => {
   return index >= 0 && index < size;
};

export const isInteger = (value: number): boolean => {
   return Number.isInteger(value);
};

export const isPositive = (value: number): boolean => {
   return value > 0;
};
