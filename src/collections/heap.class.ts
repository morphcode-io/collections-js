import { HeapqConstructor, IHeap } from '../interfaces';
import { CompareFn, KeyFn } from '../types/common.types';
import { len } from '../utils';
import { defaultComparator } from '../utils/comparators';

/**
 * Replace the root item with a new item and restore heap property.
 * @param heap The heap array
 * @param item The new item to replace the root
 * @param comparator The comparison function
 * @returns The replaced root item, or undefined if heap is empty
 * @complexity O(log n)
 */
const _replace = <T>(heap: T[], item: T, comparator: CompareFn<T>): T | undefined => {
   let returnitem = undefined;

   if (heap.length != 0) {
      returnitem = heap[0];
   }

   heap[0] = item;
   _siftDown(heap, 0, heap.length, comparator);
   return returnitem;
};

/**
 * Restore heap property by sifting down from given index.
 * @complexity O(log n)
 */
const _siftDown = <T>(heap: T[], index: number, length: number, comparator: CompareFn<T>): void => {
   const item = heap[index];
   while (index < length) {
      let left = 2 * index + 1;
      let right = left + 1;
      let smallestIndex = index;

      if (left < length && comparator(heap[left], heap[smallestIndex]) < 0) {
         smallestIndex = left;
      }

      if (right < length && comparator(heap[right], heap[smallestIndex]) < 0) {
         smallestIndex = right;
      }

      if (smallestIndex === index) break;

      heap[index] = heap[smallestIndex];
      heap[smallestIndex] = item;
      index = smallestIndex;
   }
};

/**
 * Restore heap property by sifting up from given index.
 * @complexity O(log n)
 */
const _siftUp = <T>(heap: T[], index: number, comparator: CompareFn<T>): void => {
   const item = heap[index];
   while (index > 0) {
      let parentIndex = Math.floor((index - 1) / 2);
      if (comparator(item, heap[parentIndex]) >= 0) break;
      heap[index] = heap[parentIndex];
      index = parentIndex;
   }
   heap[index] = item;
};
/**
 * Transform array into a heap in-place.
 * @param items The array to heapify
 * @param comparator The comparator function to use
 * @complexity O(n)
 */
const _heapify = <T>(items: T[], comparator: CompareFn<T>): void => {
   for (let i = Math.floor(items.length / 2) - 1; i >= 0; i--) {
      _siftDown(items, i, items.length, comparator);
   }
};

// Algorithm notes for nlargest() and nsmallest():
// ===============================================

/**
 * Find the n smallest elements efficiently.
 * @complexity O(n log k) where k = min(n, length)
 */
const _nsmallest = <T>(n: number, iterable: Iterable<T>, comparator: CompareFn<T>): T[] => {
   if (n <= 0) return [];

   const length = len(iterable);
   if (length != undefined && n >= length) {
      const arr = Array.from(iterable);
      arr.sort(comparator);
      return arr.slice(0, n);
   }

   const it = iterable[Symbol.iterator]();
   if (n === 1) {
      const { value, done } = it.next();
      if (done) return [];
      let min = value;
      let next = it.next();
      while (!next.done) {
         if (comparator(next.value, min) < 0) {
            min = next.value;
         }
         next = it.next();
      }
      return [min];
   }
   type ResultType = [T, number];
   let result: ResultType[] = [];
   let i = 0;
   for (; i < n; i++) {
      const { value, done } = it.next();
      if (done) break;
      result.push([value, i]);
   }

   if (i === 0) return [];
   const heapComparator = (a: [T, number], b: [T, number]) => comparator(a[0], b[0]) || a[1] - b[1];

   _heapify(result, (a, b) => -heapComparator(a, b));
   let top = result[0][0];

   while (true) {
      const { value, done } = it.next();
      if (done) break;
      if (comparator(value, top) < 0) {
         _replace<ResultType>(result, [value, i], (a, b) => -heapComparator(a, b));
         top = result[0][0];
         i++;
      }
   }

   result.sort(heapComparator);
   return result.map(([item]) => item);
};

/**
 * Find the n largest elements efficiently.
 * @complexity O(n log k) where k = min(n, length)
 */
const _nlargest = <T>(n: number, iterable: Iterable<T>, comparator: CompareFn<T>): T[] => {
   if (n <= 0) return [];

   const length = len(iterable);
   if (length != undefined && n >= length) {
      const arr = Array.from(iterable);
      arr.sort((a, b) => -comparator(a, b));
      return arr.slice(0, n);
   }

   const it = iterable[Symbol.iterator]();
   if (n === 1) {
      const { value, done } = it.next();
      if (done) return [];
      let max = value;
      let next = it.next();
      while (!next.done) {
         if (comparator(next.value, max) > 0) {
            max = next.value;
         }
         next = it.next();
      }
      return [max];
   }

   type ResultType = [T, number];
   let result: ResultType[] = [];
   let i = 0;
   for (; i < n; i++) {
      const { value, done } = it.next();
      if (done) break;
      result.push([value, i]);
   }

   if (i === 0) return [];
   const heapComparator = (a: [T, number], b: [T, number]) => comparator(a[0], b[0]) || a[1] - b[1];

   _heapify(result, heapComparator);
   let top = result[0][0];

   while (true) {
      const { value, done } = it.next();
      if (done) break;
      if (comparator(value, top) > 0) {
         _replace<ResultType>(result, [value, i], heapComparator);
         top = result[0][0];
         i++;
      }
   }

   result.sort((a, b) => -heapComparator(a, b));
   return result.map(([item]) => item);
};

class Heap<T> implements IHeap<T> {
   private _data: T[] = [];
   private readonly _comparator: CompareFn<T>;

   constructor(iterable?: Iterable<T> | CompareFn<T>, comparator?: CompareFn<T>) {
      if (typeof iterable == 'function') {
         this._comparator = iterable;
      } else {
         this._comparator = comparator || defaultComparator;
         if (iterable) {
            this._data = Array.from(iterable);
            this.heapify();
         }
      }
   }

   get size(): number {
      return this._data.length;
   }

   get isEmpty(): boolean {
      return this.size === 0;
   }

   push(item: T): this {
      this._data.push(item);
      _siftUp(this._data, this._data.length - 1, this._comparator);
      return this;
   }

   pop(): T | undefined {
      if (this.isEmpty) return undefined;

      const root = this._data[0];
      const last = this._data.pop()!;

      if (!this.isEmpty) {
         this._data[0] = last;
         _siftDown(this._data, 0, this._data.length, this._comparator);
      }

      return root;
   }
   /**
    * Peek at an element in the heap without removing it.
    * By default, peeking at index 0 returns the root element.
    * @param index
    * @returns
    */
   peek(index: number = 0): T | undefined {
      if (index < 0 || index >= this._data.length) return undefined;
      return this._data[index];
   }

   replace(item: T): T | undefined {
      return _replace(this._data, item, this._comparator);
   }

   pushPop(item: T): T | undefined {
      if (this.isEmpty || this._comparator(item, this._data[0]) < 0) {
         return item;
      }

      const root = this._data[0];
      this._data[0] = item;
      _siftDown(this._data, 0, this._data.length, this._comparator);
      return root;
   }

   heapify(items?: T[]): this {
      if (items) {
         this._data.push(...items);
      }
      _heapify(this._data, this._comparator);
      return this;
   }

   sort(): T[] {
      return [...this._data].sort(this._comparator);
   }

   nsmallest(n: number): T[] {
      return _nsmallest(n, this._data, this._comparator);
   }

   nlargest(n: number): T[] {
      return _nlargest(n, this._data, this._comparator);
   }

   clone(): Heap<T> {
      return new Heap([...this._data], this._comparator);
   }

   *values(): IterableIterator<T> {
      yield* this._data;
   }

   *entries(): IterableIterator<[number, T]> {
      for (let i = 0; i < this._data.length; i++) {
         yield [i, this._data[i]];
      }
   }

   *keys(): IterableIterator<number> {
      for (let i = 0; i < this._data.length; i++) {
         yield i;
      }
   }

   [Symbol.iterator](): IterableIterator<T> {
      return this._data[Symbol.iterator]();
   }

   clear(): void {
      this._data.length = 0;
   }

   toArray(): T[] {
      return [...this._data];
   }

   toString(): string {
      return `Heap(${this._data.length}) [${this._data.join(', ')}]`;
   }
}

class HeapqStatic {
   constructor() {
      throw new Error('Heapq is a static class and cannot be instantiated.');
   }
   // =============================
   // Static methods for Heap class
   // =============================
   static of<T>(...items: T[]): Heap<T> {
      return new Heap<T>(items);
   }
   static from<T>(iterable: Iterable<T>, comparator?: CompareFn<T>): Heap<T> {
      if (comparator === undefined) {
         comparator = defaultComparator;
      }
      return new Heap<T>(iterable, comparator);
   }
   static isHeapq<T>(value: any): value is Heap<T> {
      return value instanceof Heap;
   }
   static heapify<T>(arr: T[], comparator: CompareFn<T> = defaultComparator): void {
      _heapify(arr, comparator);
   }
   static heapPush<T>(arr: T[], item: T, comparator: CompareFn<T> = defaultComparator): void {
      arr.push(item);
      _siftUp(arr, arr.length - 1, comparator);
   }
   static heapPop<T>(arr: T[], comparator: CompareFn<T> = defaultComparator): T | undefined {
      if (arr.length === 0) return undefined;

      const last = arr.pop();

      if (arr.length > 0) {
         const returnitem = arr[0];
         arr[0] = last!;
         _siftDown(arr, 0, arr.length, comparator);
         return returnitem;
      }

      return last;
   }

   static heapPushPop<T>(arr: T[], item: T, comparator: CompareFn<T> = defaultComparator): T | undefined {
      if (arr.length > 0 && comparator(arr[0], item) < 0) {
         const returnitem = arr[0];
         arr[0] = item;
         _siftDown(arr, 0, arr.length, comparator);
         return returnitem;
      }
      return item;
   }

   static heapReplace<T>(arr: T[], item: T, comparator: CompareFn<T> = defaultComparator): T | undefined {
      return _replace(arr, item, comparator);
   }

   static nsmallest<T>(n: number, iterable: Iterable<T>, key?: KeyFn<T>): T[] {
      const comparator = key ? (a: T, b: T) => key(a) - key(b) : defaultComparator;
      return _nsmallest(n, iterable, comparator);
   }

   static nlargest<T>(n: number, iterable: Iterable<T>, key?: KeyFn<T>): T[] {
      const comparator = key ? (a: T, b: T) => key(a) - key(b) : defaultComparator;
      return _nlargest(n, iterable, comparator);
   }
}

const heapq = HeapqStatic as any as HeapqConstructor & typeof HeapqStatic;

export { Heap, heapq };
