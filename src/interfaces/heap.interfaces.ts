import { CompareFn } from '../types';
import { ICollection } from './collection.interfaces';

interface HeapqMethods<T> extends ICollection<T> {
   push(item: T): this;
   pop(): T | undefined;
   peek(index?: number): T | undefined;
   replace(item: T): T | undefined;

   pushPop(item: T): T | undefined;
   heapify(items?: T[]): this;

   sort(): T[];

   nsmallest(n?: number): T[];
   nlargest(n?: number): T[];
}

export interface HeapqIterators<T> {
   [Symbol.iterator](): IterableIterator<T>;
   entries(): IterableIterator<[number, T]>;
   keys(): IterableIterator<number>;
   values(): IterableIterator<T>;
}

export interface IHeap<T> extends HeapqMethods<T>, HeapqIterators<T> {}

export interface HeapqStatic {
   of<T>(...items: T[]): IHeap<T>;
   isHeapq<T>(value: any): value is IHeap<T>;
   //merge<T>(...iterables: Iterable<T>[]): IHeap<T>;
   heapify<T>(arr: T[], comparator?: CompareFn<T>): void;
   heapPush<T>(arr: T[], item: T, comparator?: CompareFn<T>): void;
   heapPop<T>(arr: T[], comparator?: CompareFn<T>): T | undefined;
   heapPushPop<T>(arr: T[], item: T, comparator?: CompareFn<T>): T | undefined;
   heapReplace<T>(arr: T[], item: T, comparator?: CompareFn<T>): T | undefined;
   nsmallest<T>(n: number, iterable: Iterable<T>, key?: (item: T) => number): T[];
   nlargest<T>(n: number, iterable: Iterable<T>, key?: (item: T) => number): T[];
}

export interface HeapqConstructor extends HeapqStatic {
   from<T>(iterable: Iterable<T>, comparator?: CompareFn<T>): IHeap<T>;
}
