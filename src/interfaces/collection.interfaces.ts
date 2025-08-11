export interface ICollection<T> {
   readonly isEmpty: boolean;
   readonly size: number;
   clear(): void;
   toArray(): T[];
}
