import { ICollection } from './collection.interfaces';

interface DequeMethods<T> extends ICollection<T> {
   push(item: T): this;
   pushLeft(item: T): this;

   pop(): T | undefined;
   popLeft(): T | undefined;

   get(index?: number): T | undefined;
   set(index: number, item: T): this;

   extend(elements: Iterable<T>): this;
   extendLeft(elements: Iterable<T>): this;
   indexOf(item: T, fromIndex?: number): number;
   includes(item: T, fromIndex?: number): boolean;

   map<U>(callback: (item: T, index: number) => U): IDeque<U>;
}

export interface DequeIterators<T> {
   [Symbol.iterator](): IterableIterator<T>;
   entries(): IterableIterator<[number, T]>;
   keys(): IterableIterator<number>;
   values(): IterableIterator<T>;
}

export interface IDeque<T> extends DequeMethods<T>, DequeIterators<T> {}

export interface DequeStatic {
   of<T>(...items: T[]): IDeque<T>;
   isDeque<T>(value: any): value is IDeque<T>;
}
export interface DequeConstructor extends DequeStatic {
   from<T>(iterable: T[]): IDeque<T>;
}
