import { ForEachCallback } from '../types';
import { ICollection } from './collection.interfaces';

interface DefaultDictMethods<K, V> extends ICollection<[K, V]> {
   get(key: K, defaultValue?: V): V;
   set(key: K, value: V): void;
   delete(key: K): boolean;
   has(key: K): boolean;
   pop(key: K): V | undefined;
   forEach(callbackfn: ForEachCallback<V, K>, thisArg?: unknown): void;
}

interface DefaultDictIterators<K, V> {
   keys(): IterableIterator<K>;
   values(): IterableIterator<V>;
   entries(): IterableIterator<[K, V]>;
   [Symbol.iterator](): IterableIterator<[K, V]>;
}

export interface IDefaultDict<K, V> extends DefaultDictMethods<K, V>, DefaultDictIterators<K, V> {}

export interface DefaultDictConstructor<K, V> {
   new (defaultFactory: () => V): IDefaultDict<K, V>;
}
