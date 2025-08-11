import { IDictEntry, IOrderedDict } from '../interfaces';

export class DictEntry<K, V> implements IDictEntry<K, V> {
   public key: K;
   public value: V;
   public next: DictEntry<K, V> | null;
   public prev: DictEntry<K, V> | null;
   constructor(key: K, value: V) {
      this.key = key;
      this.value = value;
      this.next = null;
      this.prev = null;
   }
}
/**
 * OrderedDict class implements an ordered dictionary that maintains the order of its items.
 * It allows for efficient retrieval, insertion, and deletion of items while preserving their order.
 *
 * @template K - The type of keys in the ordered dictionary.
 * @template V - The type of values in the ordered dictionary.
 * @implements {IOrderedDict<K, V>} - Implements the IOrderedDict interface.
 * @class
 * @public
 * @example
 * const orderedDict = new OrderedDict<string, number>();
 * orderedDict.setItem('a', 1);
 * orderedDict.setItem('b', 2);
 * console.log(orderedDict.getItem('a')); // 1
 * console.log(orderedDict.toArray()); // [['a', 1], ['b', 2]]
 * orderedDict.deleteItem('a');
 * console.log(orderedDict.hasItem('a')); // false
 * orderedDict.moveToEnd('b', true);
 * console.log(orderedDict.toArray()); // [['b', 2]]
 * orderedDict.clear();
 * console.log(orderedDict.isEmpty); // true
 * orderedDict.update([['c', 3], ['d', 4]]);
 * console.log(orderedDict.toArray()); // [['c', 3], ['d', 4]]
 * Iterables:
 * for (const [key, value] of orderedDict) {
 *   console.log(key, value);
 * }
 *
 * for (const key of orderedDict.keys()) {
 *   console.log(key);
 * }
 *
 * for (const value of orderedDict.values()) {
 *   console.log(value);
 * }
 *
 * for (const [key, value] of orderedDict.entries()) {
 *   console.log(key, value);
 * }
 *
 * @returns {OrderedDict<K, V>} - An instance of OrderedDict.
 * Time Complexity:
 * - getItem: O(1)
 * - setItem: O(1)
 * - deleteItem: O(1)
 * - hasItem: O(1)
 * - moveToEnd: O(1)
 * - popItem: O(1)
 * - update: O(n)
 * - clear: O(1)
 * - toArray: O(n)
 * - keys: O(n)
 * - values: O(n)
 * - entries: O(n)
 * - iterator: O(n)
 * Space Complexity:
 * - O(n) for storing items in the dictionary.
 * - O(1) for each individual operation.
 */
export class OrderedDict<K, V> implements IOrderedDict<K, V> {
   private _items: Map<K, DictEntry<K, V>>;
   private _head: DictEntry<K, V> | null;
   private _tail: DictEntry<K, V> | null;

   constructor(iterable?: Iterable<[K, V]>) {
      this._items = new Map<K, DictEntry<K, V>>();
      this._head = null;
      this._tail = null;

      if (iterable) {
         this.update(iterable);
      }
   }

   get isEmpty(): boolean {
      return this._items.size === 0;
   }

   get size(): number {
      return this._items.size;
   }

   clone(): OrderedDict<K, V> {
      const newDict = new OrderedDict<K, V>();
      for (const [key, value] of this) {
         newDict.setItem(key, value);
      }
      return newDict;
   }
   /**
    * Time complexity: O(1)
    * Space complexity: O(1)
    * Retrieves the value associated with the specified key, or returns the default value if the key is not found.
    * @param key - The key of the item to retrieve.
    * @param defaultValue - The value to return if the key is not found.
    * @returns The value associated with the key, or the default value if not found.
    */
   getItem(key: K, defaultValue?: V | undefined): V | undefined {
      const entry = this._items.get(key);
      return entry ? entry.value : defaultValue;
   }

   /**
    * Time complexity: O(1) for insertion.
    * Space complexity: O(1) for insertion.
    * Sets the value associated with the specified key.
    * @param key - The key of the item to set.
    * @param value - The value to associate with the key.
    */
   setItem(key: K, value: V): void {
      const existingEntry = this._items.get(key);
      if (existingEntry) {
         existingEntry.value = value;
      } else {
         const newEntry = new DictEntry<K, V>(key, value);
         this._insertEntryToEnd(newEntry);
         this._items.set(key, newEntry);
      }
   }

   /**
    * Time complexity: O(1) for deletion.
    * Space complexity: O(1) for deletion.
    * Deletes the item associated with the specified key.
    * @param key - The key of the item to delete.
    * @returns The value associated with the key, or undefined if not found.
    */
   deleteItem(key: K): V | undefined {
      const entry = this._items.get(key);
      if (entry) {
         this._items.delete(key);
         this._removeEntry(entry);
         return entry.value;
      }
      return undefined;
   }

   /**
    * Time complexity: O(1)
    * Space complexity: O(1)
    * Checks if an item with the specified key exists.
    * @param key - The key of the item to check.
    * @returns True if the item exists, false otherwise.
    */
   hasItem(key: K): boolean {
      return this._items.has(key);
   }

   /**
    * Time complexity: O(1) for moving an item.
    * Space complexity: O(1) for moving an item.
    * Moves the specified item to the end or beginning of the ordered dictionary.
    * @param key - The key of the item to move.
    * @param last - If true, moves the item to the end; if false, moves it to the beginning.
    * @returns The OrderedDict instance for chaining.
    */
   moveToEnd(key: K, last: boolean = true): this {
      const entry = this._items.get(key);
      if (!entry) {
         return this;
      }

      if (last) {
         if (entry === this._tail) {
            return this;
         }
         this._removeEntry(entry);
         this._insertEntryToEnd(entry);
      } else {
         if (entry === this._head) {
            return this;
         }
         this._removeEntry(entry);
         this._insertEntryToHead(entry);
      }

      return this;
   }

   /**
    * Time complexity: O(1) for popping an item.
    * Space complexity: O(1) for popping an item.
    * Pops the item from the end or beginning of the ordered dictionary.
    * @param last - If true, pops the item from the end; if false, pops it from the beginning.
    * @returns The key-value pair of the popped item, or undefined if the dictionary is empty.
    */
   popItem(last: boolean = true): [K, V] | undefined {
      const entry = last ? this._tail : this._head;
      if (entry) {
         this._items.delete(entry.key);
         this._removeEntry(entry);
         return [entry.key, entry.value];
      }
      return undefined;
   }

   /**
    * Time complexity: O(n) for updating items.
    * Space complexity: O(n) for updating items.
    * Updates the ordered dictionary with the items from the provided iterable.
    * If an item with the same key already exists, it will be updated.
    * @param iterable - The iterable of key-value pairs to update.
    * @returns The OrderedDict instance for chaining.
    */
   update(iterable: Iterable<[K, V]>): this {
      for (const [key, value] of iterable) {
         this.setItem(key, value);
      }
      return this;
   }

   /**
    * Time complexity: O(1)
    * Space complexity: O(1)
    * Inserts the specified entry at the end of the ordered dictionary.
    * @param entry - The entry to insert at the end of the ordered dictionary.
    */
   private _insertEntryToEnd(entry: DictEntry<K, V>): void {
      entry.next = null;
      entry.prev = this._tail;

      if (this._tail) {
         this._tail.next = entry;
      } else {
         this._head = entry;
      }

      this._tail = entry;
   }

   /**
    * Time complexity: O(1)
    * Space complexity: O(1)
    * Inserts the specified entry at the beginning of the ordered dictionary.
    * @param entry - The entry to insert at the beginning of the ordered dictionary.
    */
   private _insertEntryToHead(entry: DictEntry<K, V>): void {
      entry.prev = null;
      entry.next = this._head;

      if (this._head) {
         this._head.prev = entry;
      } else {
         this._tail = entry;
      }

      this._head = entry;
   }

   /**
    * Time complexity: O(1)
    * Space complexity: O(1)
    * Removes the specified entry from the ordered dictionary.
    * @param entry - The entry to remove from the ordered dictionary.
    */
   private _removeEntry(entry: DictEntry<K, V>): void {
      if (entry.prev) {
         entry.prev.next = entry.next;
      } else {
         this._head = entry.next;
      }

      if (entry.next) {
         entry.next.prev = entry.prev;
      } else {
         this._tail = entry.prev;
      }

      entry.prev = null;
      entry.next = null;
   }

   /**
    * Clears the ordered dictionary, removing all items.
    */
   clear(): void {
      this._items.clear();
      this._head = null;
      this._tail = null;
   }

   /**
    * Converts the ordered dictionary to an array of key-value pairs.
    * @returns An array of key-value pairs.
    */
   toArray(): [K, V][] {
      const result: [K, V][] = [];
      let current = this._head;
      while (current) {
         result.push([current.key, current.value]);
         current = current.next;
      }
      return result;
   }

   /**
    * Returns an iterable of the keys in the ordered dictionary.
    * @returns An iterable of keys.
    */
   *keys(): IterableIterator<K> {
      let current = this._head;
      while (current) {
         yield current.key;
         current = current.next;
      }
   }

   /**
    * Returns an iterable of the entries in the ordered dictionary.
    * @returns An iterable of entries.
    */
   *entries(): IterableIterator<[K, V]> {
      let current = this._head;
      while (current) {
         yield [current.key, current.value];
         current = current.next;
      }
   }

   /**
    * Returns an iterable of the values in the ordered dictionary.
    * @returns An iterable of values.
    */
   *values(): IterableIterator<V> {
      let current = this._head;
      while (current) {
         yield current.value;
         current = current.next;
      }
   }

   /**
    * Returns an iterator for the ordered dictionary.
    * @returns An iterable iterator of key-value pairs.
    */
   [Symbol.iterator](): IterableIterator<[K, V]> {
      let current = this._head;
      return {
         next(): IteratorResult<[K, V]> {
            if (current) {
               const value: [K, V] = [current.key, current.value];
               current = current.next;
               return { value, done: false };
            }
            return { value: undefined, done: true };
         },
         [Symbol.iterator](): IterableIterator<[K, V]> {
            return this;
         },
      };
   }
}
