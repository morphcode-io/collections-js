import { IDefaultDict } from '../interfaces';
import { DefaultFactory, ForEachCallback } from '../types';

class DefaultDict<K, V> implements IDefaultDict<K, V> {
   private factory: DefaultFactory<V>;
   private _data: Map<K, V>;
   constructor(defaultFactory: DefaultFactory<V>) {
      this.factory = defaultFactory;
      this._data = new Map<K, V>();
   }

   get size(): number {
      return this._data.size;
   }

   get isEmpty(): boolean {
      return this._data.size === 0;
   }

   get(key: K): V {
      if (!this._data.has(key)) {
         this._data.set(key, this.factory());
      }
      return this._data.get(key) as V;
   }

   set(key: K, value: V): void {
      this._data.set(key, value);
   }

   delete(key: K): boolean {
      return this._data.delete(key);
   }

   has(key: K): boolean {
      return this._data.has(key);
   }

   pop(key: K): V | undefined {
      const value = this._data.get(key);
      if (value !== undefined) {
         this._data.delete(key);
      }
      return value;
   }

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

   toArray(): [K, V][] {
      return Array.from(this._data.entries());
   }

   clear(): void {
      this._data.clear();
   }
}

export { DefaultDict as defaultdict };
