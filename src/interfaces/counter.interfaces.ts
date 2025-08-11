import { ICollection } from './collection.interfaces';

interface CounterMethods<K> extends ICollection<K> {
   add(key: K, increment?: number): this;
   get(key: K, defaultValue?: number): number;
   has(key: K): boolean;
   subtract(iterable: Iterable<K>): void;
   total: number;

   delete(key: K): boolean;

   mostCommon(n?: number): Array<[K, number]>;
   update(other: Iterable<K> | Map<K, number>): void;

   equals(other: Iterable<K> | Map<K, number>): boolean;
}

interface CounterIterators<K> {
   keys(): IterableIterator<K>;
   values(): IterableIterator<number>;
   entries(): IterableIterator<[K, number]>;
   [Symbol.iterator](): IterableIterator<[K, number]>;
}

export interface ICounter<K> extends CounterMethods<K>, CounterIterators<K> {}

interface CounterStatic {
   of<K>(...items: K[]): ICounter<K>;
   isCounter<K>(value: any): value is ICounter<K>;
}
export interface CounterConstructor extends CounterStatic {
   from<K>(iterable: Iterable<K>): ICounter<K>;
}
