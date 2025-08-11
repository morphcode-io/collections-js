export function swap<T>(array: T[], i: number, j: number): void {
   if (i < 0 || i >= array.length || j < 0 || j >= array.length) {
      throw new Error('Index out of bounds');
   }

   [array[i], array[j]] = [array[j], array[i]];
}
