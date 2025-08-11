import { ICollection } from './collection.interfaces';

interface OrderedDictMethods<K, V> extends ICollection<[K, V]> {
   getItem(key: K, defaultValue?: V): V | undefined;
   setItem(key: K, value: V): void;
   deleteItem(key: K): V | undefined;
   hasItem(key: K): boolean;

   moveToEnd(key: K, last: boolean): this;
   popItem(last: boolean): [K, V] | undefined;

   update(iterable: Iterable<[K, V]>): this;
}

interface OrderedDictIterators<K, V> {
   keys(): IterableIterator<K>;
   values(): IterableIterator<V>;
   entries(): IterableIterator<[K, V]>;
   [Symbol.iterator](): IterableIterator<[K, V]>;
}

export interface IOrderedDict<K, V> extends OrderedDictMethods<K, V>, OrderedDictIterators<K, V> {}

export interface OrderedDictConstructor {
   new <K, V>(): IOrderedDict<K, V>;
   new <K, V>(iterable: Iterable<[K, V]>): IOrderedDict<K, V>;
   from<K, V>(iterable: Iterable<[K, V]>): IOrderedDict<K, V>;
}

export interface IDictEntry<K, V> {
   key: K;
   value: V;
   next: IDictEntry<K, V> | null;
   prev: IDictEntry<K, V> | null;
}
