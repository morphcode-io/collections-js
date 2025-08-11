export type CompareFn<T> = (a: T, b: T) => number;
export type PredicateFn<T> = (item: T) => boolean;
export type DefaultFactory<T> = () => T;
export type ForEachCallback<V, K> = (value: V, key: K, map: Map<K, V>) => void;
export type KeyFn<T> = (item: T) => number;
