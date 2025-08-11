import { OrderedDict } from '../../../src/index';

describe('OrderedDict', () => {
   let dict: OrderedDict<string, number>;
   beforeEach(() => {
      dict = new OrderedDict<string, number>();
   });

   describe('Initialization', () => {
      test('should initialize with an empty OrderedDict', () => {
         expect(dict.size).toBe(0);
         expect(dict.isEmpty).toBe(true);
         expect(dict.popItem()).toBeUndefined();
         expect(dict.toArray()).toEqual([]);
      });

      test('should initialize with an iterable', () => {
         let orderedDictFromIterable = new OrderedDict<string, number>([
            ['a', 1],
            ['b', 2],
         ]);
         expect(orderedDictFromIterable.size).toBe(2);
         expect(orderedDictFromIterable.getItem('a')).toBe(1);
         expect(orderedDictFromIterable.getItem('b')).toBe(2);
      });

      test('should initialize with an empty iterable', () => {
         let orderedDictFromEmptyIterable = new OrderedDict<string, number>([]);
         expect(orderedDictFromEmptyIterable.size).toBe(0);
         expect(orderedDictFromEmptyIterable.isEmpty).toBe(true);
         expect(orderedDictFromEmptyIterable.popItem()).toBeUndefined();
         expect(orderedDictFromEmptyIterable.toArray()).toEqual([]);
      });
   });

   describe('Push', () => {
      test('should add item to empty dict', () => {
         dict.setItem('a', 1);
         expect(dict.size).toBe(1);
         expect(dict.getItem('a')).toBe(1);
      });
      test('should update existing item', () => {
         dict.setItem('a', 1);
         dict.setItem('a', 2);
         expect(dict.size).toBe(1);
         expect(dict.getItem('a')).toBe(2);
      });
      test('should add multiple items', () => {
         dict.setItem('a', 1);
         dict.setItem('b', 2);
         dict.setItem('c', 3);
         expect(dict.size).toBe(3);
         expect(dict.getItem('a')).toBe(1);
         expect(dict.getItem('b')).toBe(2);
         expect(dict.getItem('c')).toBe(3);
         expect(dict.toArray()).toEqual([
            ['a', 1],
            ['b', 2],
            ['c', 3],
         ]);
      });
   });

   describe('Update', () => {
      test('should update items with update', () => {
         dict.setItem('a', 1);
         dict.setItem('b', 2);
         dict.update([
            ['c', 3],
            ['d', 4],
         ]);
         expect(dict.size).toBe(4);
         expect(dict.getItem('a')).toBe(1);
         expect(dict.getItem('b')).toBe(2);
         expect(dict.getItem('c')).toBe(3);
         expect(dict.getItem('d')).toBe(4);
      });
   });

   describe('Get', () => {
      test('should get item by key', () => {
          dict.setItem('a', 1);
          dict.setItem('b', 2);
         expect(dict.getItem('a')).toBe(1);
         expect(dict.getItem('b')).toBe(2);
         expect(dict.getItem('c')).toBeUndefined();
         expect(dict.popItem()).toEqual(['b', 2]);
      });
      test('should get item with default value', () => {
         dict.setItem('a', 1);
         expect(dict.getItem('a', 0)).toBe(1);
         expect(dict.getItem('b', 2)).toBe(2);
         expect(dict.getItem('c', 3)).toBe(3);
      });

      test('should check if dict is empty', () => {
         expect(dict.isEmpty).toBe(true);
         dict.setItem('a', 1);
         expect(dict.isEmpty).toBe(false);
         dict.clear();
         expect(dict.isEmpty).toBe(true);
      });
   });

   describe('Delete', () => {
      test('should delete item by key', () => {
         dict.setItem('a', 1);
         expect(dict.deleteItem('a')).toBe(1);
         expect(dict.size).toBe(0);
         expect(dict.getItem('a')).toBeUndefined();
         expect(dict.deleteItem('b')).toBe(undefined);
      });

      test('should delete item with deleteItem', () => {
         dict.setItem('a', 1);
         expect(dict.deleteItem('a')).toBe(1);
         expect(dict.size).toBe(0);
         expect(dict.getItem('a')).toBeUndefined();
         expect(dict.deleteItem('b')).toBe(undefined);
      });
   });
   describe('Pop Item', () => {
      test('should pop last item', () => {
         dict.setItem('a', 1);
         dict.setItem('b', 2);
         expect(dict.popItem()).toEqual(['b', 2]);
         expect(dict.size).toBe(1);
         expect(dict.getItem('b')).toBeUndefined();
      });
      test('should pop first item', () => {
         dict.setItem('a', 1);
         dict.setItem('b', 2);
         expect(dict.popItem(false)).toEqual(['a', 1]);
         expect(dict.size).toBe(1);
         expect(dict.getItem('a')).toBeUndefined();
      });
   });
   describe('Move', () => {
      test('should move item to end', () => {
         dict.setItem('a', 1);
         dict.setItem('b', 2);
         dict.setItem('aa', 33);
         dict.moveToEnd('a');
         expect(dict.toArray()).toEqual([
            ['b', 2],
            ['aa', 33],
            ['a', 1],
         ]);
         dict.moveToEnd('b');
         expect(dict.toArray()).toEqual([
            ['aa', 33],
            ['a', 1],
            ['b', 2],
         ]);
      });

      test('should move item to beginning', () => {
         dict.setItem('a', 1);
         dict.setItem('b', 2);
         dict.moveToEnd('b', false);
         expect(dict.toArray()).toEqual([
            ['b', 2],
            ['a', 1],
         ]);
         dict.moveToEnd('a', false);
         expect(dict.toArray()).toEqual([
            ['a', 1],
            ['b', 2],
         ]);
      });
   });
   describe('Clear', () => {
      test('should clear all items', () => {
         dict.setItem('a', 1);
         dict.setItem('b', 2);
         expect(dict.size).toBe(2);
         dict.clear();
         expect(dict.size).toBe(0);
         expect(dict.isEmpty).toBe(true);
         expect(dict.toArray()).toEqual([]);
      });
   });

   describe('Clone', () => {
      test('should clone the OrderedDict', () => {
         dict.setItem('a', 1);
         dict.setItem('b', 2);
         const clone = dict.clone();
         expect(clone.size).toBe(2);
         expect(clone.getItem('a')).toBe(1);
         expect(clone.getItem('b')).toBe(2);
         expect(clone).not.toBe(dict); // should be a different instance
      });
   });
   describe('Iterators', () => {
      test('should iterate over keys', () => {
         dict.setItem('a', 1);
         dict.setItem('b', 2);
         const keys = Array.from(dict.keys());
         expect(keys).toEqual(['a', 'b']);
      });

      test('should iterate over values', () => {
         dict.setItem('a', 1);
         dict.setItem('b', 2);
         const values = Array.from(dict.values());
         expect(values).toEqual([1, 2]);
      });

      test('should iterate over entries', () => {
         dict.setItem('a', 1);
         dict.setItem('b', 2);
         const entries = Array.from(dict.entries());
         expect(entries).toEqual([
            ['a', 1],
            ['b', 2],
         ]);
      });
      test('should use for of loop on OrderedDict', () => {
         dict.setItem('a', 1);
         dict.setItem('b', 2);
         const result: string[] = [];
         for (const [key, value] of dict) {
            result.push(`${key}:${value}`);
         }
         expect(result).toEqual(['a:1', 'b:2']);
      });
   });
});
