import { ICounter } from '../interfaces/counter.interfaces';
import { heapq } from './heap.class';

export class Counter<K> implements ICounter<K> {
   private _data: Map<K, number>;
   private _total: number;

   constructor(iterable?: Iterable<K>) {
      this._data = new Map<K, number>();
      this._total = 0;
      if (iterable) {
         this.update(iterable);
      }
   }

   get size(): number {
      return this._data.size;
   }
   get total(): number {
      return this._total;
   }
   get isEmpty(): boolean {
      return this._data.size === 0;
   }

   /**
    * Adds an item to the counter with an optional increment.
    * If the item already exists, its count will be incremented.
    * @param key The item to add
    * @param increment The number to increment (default is 1)
    */
   add(key: K, increment: number = 1): this {
      const currentCount = this._data.get(key) || 0;
      this._data.set(key, currentCount + increment);
      this._total += increment;
      return this;
   }

   /**
    * Gets the count of a specific item in the counter.
    * @param element The item to get the count for
    * @returns The count of the item, or 0 if it does not exist
    */
   get(key: K, defaultValue: number = 0): number {
      return this._data.get(key) || defaultValue;
   }

   /**
    * Checks if the counter has a specific item.
    * @param item The item to check
    * @returns True if the item exists, false otherwise
    */
   has(item: K): boolean {
      return this._data.has(item);
   }

   /**
    * Subtracts an iterable of items from the counter.
    * Each item in the iterable will have its count decremented by 1.
    * If the item does not exist, it will be added with a count of -1.
    * @param iterable An iterable of items to subtract from the counter
    */
   subtract(iterable?: Iterable<K> | Counter<K>): void {
      if (iterable) {
         if (iterable instanceof Counter) {
            for (const [key, value] of iterable) {
               this._data.set(key, (this._data.get(key) || 0) - value);
               this._total -= value;
            }
         } else {
            for (const key of iterable) {
               this._data.set(key, (this._data.get(key) || 0) - 1);
               this._total--;
            }
         }
      }
   }

   /**
    * Deletes an item from the counter.
    * @param item The item to delete
    * @returns True if the item was deleted, false if it did not exist
    */
   delete(key: K): boolean {
      const count = this._data.get(key);
      if (count === undefined) {
         return false;
      }
      this._data.delete(key);
      this._total -= count;

      return true;
   }
   /**
    * Updates the counter with an iterable of items.
    * Each item in the iterable will have its count incremented by 1.
    * @param iterable An iterable of items to update the counter with
    * @returns The current instance of the Counter
    */
   update(other: Iterable<K> | Map<K, number>): void {
      if (other instanceof Map) {
         for (const [key, value] of other) {
            if (typeof value !== 'number') {
               throw new TypeError('Values in Map must be numbers');
            }
            this.add(key, (this._data.get(key) || 0) + value);
         }
      } else {
         this._countElements(other);
      }
   }

   /**
    * Gets the most common items in the counter.
    * @param n The number of most common items to return (default is all)
    * @returns An array of tuples containing the item and its count
    */
   mostCommon(n?: number): Array<[K, number]> {
      if (n !== undefined && n <= 0) {
         return [];
      }
      if (n === undefined || n > this.size) {
         return Array.from(this._data.entries()).sort((a, b) => b[1] - a[1]);
      }
      return heapq.nlargest(n, this._data.entries(), a => a[1]);
   }

   equals(other: Iterable<K> | Map<K, number> | Counter<K>): boolean {
      if (other instanceof Map || other instanceof Counter) {
         if (this.size !== other.size) return false;
         for (const [key, value] of other) {
            if (this.get(key) !== value) return false;
         }
         return true;
      } else {
         const otherCounter = new Counter<K>(other);
         if (this.size !== otherCounter.size) return false;
         for (const [key, value] of this._data) {
            if (otherCounter.get(key) !== value) return false;
         }
         return true;
      }
   }

   clear(): void {
      this._data.clear();
      this._total = 0;
   }

   *elements(): IterableIterator<K> {
      for (const [item, count] of this._data) {
         for (let i = 0; i < count; i++) {
            yield item;
         }
      }
   }
   /**
    * Returns an iterator over the keys of the counter.
    * @returns An iterator that yields each unique item
    */
   keys(): IterableIterator<K> {
      return this._data.keys();
   }
   /**
    * Returns an iterator over the values (counts) of the counter.
    * @returns An iterator that yields each count
    */
   values(): IterableIterator<number> {
      return this._data.values();
   }
   /**
    * Returns an iterator over the entries of the counter.
    * Each entry is a tuple of the item and its count.
    * @returns An iterator that yields tuples of [item, count]
    */
   entries(): IterableIterator<[K, number]> {
      return this._data.entries();
   }

   /**
    * Default iterator for the Counter.
    * @returns An iterator over unique elements
    */
   [Symbol.iterator](): IterableIterator<[K, number]> {
      return this.entries();
   }

   /**
    * Creates a shallow copy of the Counter.
    * @returns A new Counter instance with the same items and counts
    */
   clone(): Counter<K> {
      const cloned = new Counter<K>();
      cloned._data = new Map(this._data);
      cloned._total = this._total;
      return cloned;
   }

   /**
    * Converts the counter to an array.
    * @returns An array containing all items (with repetition based on count)
    */
   toArray(): K[] {
      return Array.from(this.elements());
   }

   private _countElements(iterable: Iterable<K>): void {
      for (const item of iterable) {
         this._data.set(item, (this._data.get(item) || 0) + 1);
         this._total++;
      }
   }
}
