import { IDeque } from '../interfaces/deque.interfaces';

class Deque<T> implements IDeque<T> {
   private _capacity: number;
   private _length: number;
   private _front: number;
   private buffer: (T | undefined)[];

   private static readonly MIN_CAPACITY = 16;
   private static readonly MAX_CAPACITY = 1 << 30; // 2^30
   private static readonly GROWTH_FACTOR = 1.5;
   private static readonly GROWTH_CONSTANT = 16;

   constructor(capacity: number | T[] = Deque.MIN_CAPACITY) {
      this._capacity = this._getCapacity(capacity);
      this._length = 0;
      this._front = 0;
      this.buffer = new Array<T | undefined>(this._capacity);

      if (Array.isArray(capacity)) {
         const len = capacity.length;
         for (let i = 0; i < len; i++) {
            this.buffer[i] = capacity[i];
         }
         this._length = len;
      }
   }

   /**
    * Gets whether the deque is empty.
    */
   get isEmpty(): boolean {
      return this._length === 0;
   }

   /**
    * Gets the size of the deque.
    */
   get size(): number {
      return this._length;
   }

   /**
    * Adds an item to the back of the deque.
    * @param item The item to add.
    * @returns The deque instance.
    */
   push(item: T): this {
      this._checkCapacity(this._length + 1);
      const index = (this._front + this._length) & (this._capacity - 1);
      this.buffer[index] = item;
      this._length++;
      return this;
   }

   /**
    * Adds an item to the front of the deque.
    * @param item The item to add.
    * @returns The deque instance.
    */
   pushLeft(item: T): this {
      this._checkCapacity(this._length + 1);
      this._front = this._decrementIndex(this._front);
      this.buffer[this._front] = item;
      this._length++;
      return this;
   }

   /**
    * Removes and returns the item at the back of the deque.
    * @returns The item at the back of the deque, or undefined if the deque is empty.
    */
   pop(): T | undefined {
      if (this.isEmpty) return undefined;
      const index = (this._front + this._length - 1) & (this._capacity - 1);
      const item = this.buffer[index];
      this.buffer[index] = undefined;
      this._length--;
      return item;
   }

   /**
    * Removes and returns the item at the front of the deque.
    * @returns The item at the front of the deque, or undefined if the deque is empty.
    */
   popLeft(): T | undefined {
      if (this.isEmpty) return undefined;
      const item = this.buffer[this._front];
      this.buffer[this._front] = undefined;
      this._front = (this._front + 1) & (this._capacity - 1);
      this._length--;
      return item;
   }

   /**
    * Get the element at the specified index.
    * By default, the index is 0. peeking at the front.
    * For negative indices, it counts back from the end.
    * @param index The index of the element to retrieve.
    * @returns The element at the specified index, or undefined if the index is out of bounds.
    */
   get(index: number = 0): T | undefined {
      if (!Number.isInteger(index) || this.isEmpty) return undefined;

      if (index < 0) {
         index = this._length + index;
      }

      if (index < 0 || index >= this._length) {
         return undefined;
      }

      const actualIndex = (this._front + index) & (this._capacity - 1);
      return this.buffer[actualIndex];
   }

   /**
    * Sets the element at the specified index.
    * @param index The index of the element to set.
    * @param item The new value for the element.
    * @returns The deque instance.
    */
   set(index: number, item: T): this {
      if (!Number.isInteger(index) || this.isEmpty) {
         throw new RangeError('Index must be an integer and deque must not be empty');
      }

      if (index < 0) {
         index = this._length + index;
      }

      if (index < 0 || index >= this._length) {
         throw new RangeError('Index out of bounds');
      }

      const actualIndex = (this._front + index) & (this._capacity - 1);
      this.buffer[actualIndex] = item;
      return this;
   }

   /**
    * Adds multiple elements to the back of the deque.
    * @param elements The elements to add.
    * @returns The deque instance.
    */
   extend(elements: Iterable<T>): this {
      for (const item of elements) {
         this.push(item);
      }
      return this;
   }

   /**
    * Adds multiple elements to the front of the deque.
    * @param elements The elements to add.
    * @returns The deque instance.
    */
   extendLeft(elements: Iterable<T>): this {
      for (const item of elements) {
         this.pushLeft(item);
      }
      return this;
   }

   /**
    * Finds the index of the first occurrence of the specified item.
    * @param item The item to find.
    * @param fromIndex The index to start the search from.
    * @returns The index of the item, or -1 if not found.
    */
   indexOf(item: T, fromIndex?: number): number {
      if (this.isEmpty) return -1;

      if (fromIndex === undefined) {
         fromIndex = 0;
      } else if (fromIndex < 0) {
         fromIndex = this._length + fromIndex;
      }

      if (fromIndex < 0 || fromIndex >= this._length) {
         return -1;
      }

      for (let i = fromIndex; i < this._length; i++) {
         const index = (this._front + i) & (this._capacity - 1);
         if (this.buffer[index] === item) {
            return i;
         }
      }
      return -1;
   }

   /**
    * Checks if the deque contains the specified item.
    * @param item The item to find.
    * @param fromIndex The index to start the search from.
    * @returns True if the item is found, false otherwise.
    */
   includes(item: T, fromIndex?: number): boolean {
      return this.indexOf(item, fromIndex) !== -1;
   }

   /**
    * Clears the deque.
    */
   clear(): void {
      this.buffer.fill(undefined);
      this._length = 0;
      this._front = 0;
   }

   /**
    * Converts the deque to an array.
    * @returns An array containing all elements in the deque.
    */
   toArray(): T[] {
      const result = new Array<T>(this._length);
      for (let i = 0; i < this._length; i++) {
         const index = (this._front + i) & (this._capacity - 1);
         result[i] = this.buffer[index] as T;
      }
      return result;
   }

   *entries(): IterableIterator<[number, T]> {
      for (let i = 0; i < this._length; i++) {
         const index = (this._front + i) & (this._capacity - 1);
         yield [i, this.buffer[index] as T];
      }
   }

   *keys(): IterableIterator<number> {
      for (let i = 0; i < this._length; i++) {
         yield i;
      }
   }

   *values(): IterableIterator<T> {
      for (let i = 0; i < this._length; i++) {
         const index = (this._front + i) & (this._capacity - 1);
         yield this.buffer[index] as T;
      }
   }

   *[Symbol.iterator](): IterableIterator<T> {
      for (let i = 0; i < this._length; i++) {
         const index = (this._front + i) & (this._capacity - 1);
         yield this.buffer[index] as T;
      }
   }

   /**
    * Gets the capacity for the deque.
    * @param capacity The desired capacity.
    * @returns The effective capacity.
    */
   private _getCapacity(capacity: number | T[] | undefined): number {
      if (typeof capacity == 'number') {
         return this._pow2AtLeast(Math.min(Math.max(Deque.MIN_CAPACITY, capacity), Deque.MAX_CAPACITY));
      }

      if (Array.isArray(capacity)) {
         return this._getCapacity(capacity.length);
      }

      return Deque.MIN_CAPACITY;
   }

   /**
    * Gets the smallest power of 2 that is greater than or equal to n.
    * @param n The number to check.
    * @returns The smallest power of 2 greater than or equal to n.
    */
   private _pow2AtLeast(n: number): number {
      n = n >>> 0;
      n = n - 1;
      n |= n >> 1;
      n |= n >> 2;
      n |= n >> 4;
      n |= n >> 8;
      n |= n >> 16;
      return n + 1;
   }

   /**
    * Checks if the deque has enough capacity.
    * @param targetSize The desired size.
    */
   private _checkCapacity(targetSize: number): void {
      if (this._capacity < targetSize) {
         let newCapacity = this._getCapacity(Math.floor(this._capacity * Deque.GROWTH_FACTOR + Deque.GROWTH_CONSTANT));

         if (newCapacity > Deque.MAX_CAPACITY) {
            throw new RangeError(`Deque capacity exceeds maximum limit of ${Deque.MAX_CAPACITY}`);
         }

         this._resizeTo(newCapacity);
      }
   }

   /**
    * Resizes the internal buffer to the new capacity.
    * @param newCapacity The new capacity for the deque.
    */
   private _resizeTo(newCapacity: number): void {
      const oldCapacity = this._capacity;
      const newBuffer = new Array<T | undefined>(newCapacity);

      for (let i = 0; i < this._length; i++) {
         const oldIndex = (this._front + i) & (oldCapacity - 1);
         newBuffer[i] = this.buffer[oldIndex];
      }

      this.buffer = newBuffer;
      this._capacity = newCapacity;
      this._front = 0;
   }

   /**
    *
    * @param index
    * @returns
    */
   private _decrementIndex(index: number): number {
      return (index - 1 + this._capacity) & (this._capacity - 1);
   }
}

export { Deque };
