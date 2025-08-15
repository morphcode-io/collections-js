import { IDefaultDict } from '../interfaces';
import { DefaultFactory, ForEachCallback } from '../types';

class DefaultDict<K, V> implements IDefaultDict<K, V> {
   private factory: DefaultFactory<V>;
   private _data: Map<K, V>;
   constructor(defaultFactory: DefaultFactory<V>) {
      this.factory = defaultFactory;
      this._data = new Map<K, V>();
   }

   /**
    * Gets the number of key-value pairs in the dictionary.
    */
   get size(): number {
      return this._data.size;
   }

   /**
    * Gets whether the dictionary is empty.
    */
   get isEmpty(): boolean {
      return this._data.size === 0;
   }

   /**
    * Gets the value associated with the key, creating a new entry if it doesn't exist.
    * @param key The key to retrieve
    * @returns The value associated with the key
    */
   get(key: K): V {
      if (!this._data.has(key)) {
         this._data.set(key, this.factory());
      }
      return this._data.get(key) as V;
   }

   /**
    * Sets the value associated with the key.
    * @param key The key to set
    * @param value The value to associate with the key
    */
   set(key: K, value: V): void {
      this._data.set(key, value);
   }

   /**
    * Deletes the value associated with the key.
    * @param key The key to delete
    * @returns True if the key was deleted, false if it did not exist
    */
   delete(key: K): boolean {
      return this._data.delete(key);
   }

   /**
    * Checks if the dictionary has a value associated with the key.
    * @param key The key to check
    * @returns True if the key exists, false otherwise
    */
   has(key: K): boolean {
      return this._data.has(key);
   }

   /**
    * Gets and removes the value associated with the key.
    * @param key The key to retrieve
    * @returns The value associated with the key, or undefined if it does not exist
    */
   pop(key: K): V | undefined {
      const value = this._data.get(key);
      if (value !== undefined) {
         this._data.delete(key);
      }
      return value;
   }

   /**
    * Executes a provided function once for each key-value pair in the dictionary.
    * @param callbackfn The function to execute for each entry
    * @param thisArg The value to use as `this` when executing `callbackfn`
    */
   forEach(callbackfn: ForEachCallback<V, K>, thisArg?: unknown): void {
      this._data.forEach(callbackfn, thisArg);
   }

   keys(): IterableIterator<K> {
      return this._data.keys();
   }

   values(): IterableIterator<V> {
      return this._data.values();
   }

   entries(): IterableIterator<[K, V]> {
      return this._data.entries();
   }

   [Symbol.iterator](): IterableIterator<[K, V]> {
      return this._data[Symbol.iterator]();
   }

   /**
    * Converts the dictionary to an array of key-value pairs.
    * @returns An array containing all key-value pairs
    */
   toArray(): [K, V][] {
      return Array.from(this._data.entries());
   }

   /**
    * Clears all key-value pairs from the dictionary.
    */
   clear(): void {
      this._data.clear();
   }
}

export { DefaultDict as defaultdict };
