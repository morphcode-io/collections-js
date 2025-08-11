/**
 * Enumerates the elements of an iterable, yielding each element's index and value.
 * @param iterable The iterable to enumerate.
 * @returns An iterable iterator that yields pairs of index and value.
 * * @example
 * ```typescript
 * const arr = ['a', 'b', 'c'];
 * for (const [index, value] of enumerate(arr)) {
 *   console.log(index, value);
 * }
 * // Output:
 * // 0 'a'
 * // 1 'b'
 * // 2 'c'
 * ```
 * @throws {Error} If the iterable is not valid or if an index is out of bounds.
 */
export function enumerate<T>(iterable: Iterable<T>, start: number = 0): IterableIterator<[number, T]> {
   if (typeof iterable[Symbol.iterator] !== 'function') {
      throw new Error('The provided iterable is not valid.');
   }
   if (typeof start !== 'number' || !Number.isInteger(start)) {
      throw new Error('The start index must be an integer.');
   }
   let index = start;
   const iterator = iterable[Symbol.iterator]();

   return {
      next(): IteratorResult<[number, T]> {
         const result = iterator.next();
         if (result.done) {
            return { done: true, value: undefined };
         }
         return { done: false, value: [index++, result.value] };
      },
      [Symbol.iterator](): IterableIterator<[number, T]> {
         return this;
      },
   };
}

/**
 * Gets the length of an iterable.
 * @param iterable The iterable to get the length of.
 * @returns The length of the iterable, or undefined if it cannot be determined.
 */
export function len(iterable: Iterable<any>): number | undefined {
   if (Array.isArray(iterable)) return iterable.length;
   if (typeof iterable === 'string') return iterable.length;
   if (iterable && typeof (iterable as any).size === 'number') return (iterable as any).size;
   if (iterable && typeof (iterable as any).length === 'number') return (iterable as any).length;
   return undefined;
}
