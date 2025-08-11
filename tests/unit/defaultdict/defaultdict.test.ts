import { Counter, defaultdict } from '../../../src/index';

describe('DefaultDict', () => {
   describe('constructor', () => {
      it('should create an instance with a default factory', () => {
         const dd = new defaultdict(() => 0);
         expect(dd).toBeInstanceOf(defaultdict);
         expect(dd.size).toBe(0);
      });

      it('should initialize with the correct default factory', () => {
         const dd = new defaultdict(() => 'default');
         expect(dd.get('key')).toBe('default');
      });

      it('should allow custom default factory functions', () => {
         const dd = new defaultdict<string | number, number[]>(() => []);
         expect(dd.get('key')).toEqual([]);
         dd.get('key').push(1);
         expect(dd.get('key')).toEqual([1]);
      });
   });

   describe('get', () => {
      it('should return the default value for a non-existing key', () => {
         const dd = new defaultdict(() => 'default');
         expect(dd.get('nonExistingKey')).toBe('default');
      });

      it('should return the value for an existing key', () => {
         const dd = new defaultdict(() => 0);
         dd.set('key', 42);
         expect(dd.get('key')).toBe(42);
      });

      it('should call the default factory when accessing a non-existing key', () => {
         const factory = jest.fn(() => 'default');
         const dd = new defaultdict(factory);
         expect(dd.get('newKey')).toBe('default');
         expect(factory).toHaveBeenCalledWith();
      });

      it('should return undefined for a key that has been deleted', () => {
         const dd = new defaultdict(() => 'default');
         dd.set('key', 'value');
         dd.delete('key');
         expect(dd.get('key')).toBe('default');
      });

      it('Should handle an array as a default value', () => {
         const dd = new defaultdict<string, number[]>(() => []);
         expect(dd.get('key')).toEqual([]);
         for (let i = 0; i < 3; i++) {
            dd.get('key').push(i);
         }
         expect(dd.get('key')).toEqual([0, 1, 2]);
      });

      it('Should handle an object as a default value', () => {
         const dd = new defaultdict<string, Record<string, number>>(() => ({}));
         expect(dd.get('key')).toEqual({});
         dd.get('key')['a'] = 1;
         dd.get('key')['b'] = 2;
         expect(dd.get('key')).toEqual({ a: 1, b: 2 });
      });

      it('Should handle a map value', () => {
         const dd = new defaultdict<string, Map<string, number>>(() => new Map());
         expect(dd.get('key')).toEqual(new Map());
         dd.get('key').set('a', 1);
         dd.get('key').set('b', 2);
         expect(dd.get('key')).toEqual(
            new Map([
               ['a', 1],
               ['b', 2],
            ])
         );
      });

      it('Should handle a set value', () => {
         const dd = new defaultdict<string, Set<number>>(() => new Set());
         expect(dd.get('key')).toEqual(new Set());
         dd.get('key').add(1);
         dd.get('key').add(2);
         expect(dd.get('key')).toEqual(new Set([1, 2]));
      });

      it('should handle a counter as a default value', () => {
         const dd = new defaultdict<string, Counter<string>>(() => new Counter());
         expect(dd.get('key')).toEqual(new Counter());
         dd.get('key').add('a');
         dd.get('key').add('b');
         expect(dd.get('key')).toEqual(new Counter('ab'));
      });
   });

   describe('set', () => {
      it('should set a value for a key', () => {
         const dd = new defaultdict(() => 'default');
         dd.set('key', 'value');
         expect(dd.get('key')).toBe('value');
      });

      it('should overwrite the value for an existing key', () => {
         const dd = new defaultdict(() => 'default');
         dd.set('key', 'value');
         dd.set('key', 'newValue');
         expect(dd.get('key')).toBe('newValue');
      });

      it('should increase the size when setting a new key', () => {
         const dd = new defaultdict(() => 0);
         expect(dd.size).toBe(0);
         dd.set('key1', 1);
         expect(dd.size).toBe(1);
         dd.set('key2', 2);
         expect(dd.size).toBe(2);
      });

      it('should not change the size when overwriting an existing key', () => {
         const dd = new defaultdict(() => 0);
         dd.set('key', 1);
         expect(dd.size).toBe(1);
         dd.set('key', 2);
         expect(dd.size).toBe(1);
      });
   });

   describe('delete', () => {
      it('should delete an existing key', () => {
         const dd = new defaultdict(() => 'default');
         dd.set('key', 'value');
         expect(dd.delete('key')).toBe(true);
         expect(dd.get('key')).toBe('default');
      });

      it('should return false when deleting a non-existing key', () => {
         const dd = new defaultdict(() => 'default');
         expect(dd.delete('nonExistingKey')).toBe(false);
      });

      it('should decrease the size when deleting an existing key', () => {
         const dd = new defaultdict(() => 0);
         dd.set('key1', 1);
         dd.set('key2', 2);
         dd.set('key2', dd.get('key2') + 1);
         expect(dd.size).toBe(2);
         dd.delete('key1');
         expect(dd.get('key2')).toBe(3);
         expect(dd.size).toBe(1);
         dd.delete('key2');
         expect(dd.size).toBe(0);
      });
   });

   describe('has', () => {
      it('should return true for an existing key', () => {
         const dd = new defaultdict(() => 'default');
         dd.set('key', 'value');
         expect(dd.has('key')).toBe(true);
      });
      it('should return false for a non-existing key', () => {
         const dd = new defaultdict(() => 'default');
         expect(dd.has('nonExistingKey')).toBe(false);
      });
      it('should return false for a key that has been deleted', () => {
         const dd = new defaultdict(() => 'default');
         dd.set('key', 'value');
         dd.delete('key');
         expect(dd.has('key')).toBe(false);
      });
   });

   describe('pop', () => {
      it('should remove and return the value for an existing key', () => {
         const dd = new defaultdict(() => 'default');
         dd.set('key', 'value');
         expect(dd.pop('key')).toBe('value');
         expect(dd.has('key')).toBe(false);
      });
      it('should return undefined for a non-existing key', () => {
         const dd = new defaultdict(() => 'default');
         expect(dd.pop('nonExistingKey')).toBeUndefined();
      });
      it('should decrease the size when popping an existing key', () => {
         const dd = new defaultdict(() => 0);
         dd.set('key1', 1);
         dd.set('key2', 2);
         expect(dd.size).toBe(2);
         dd.pop('key1');
         expect(dd.size).toBe(1);
         dd.pop('key2');
         expect(dd.size).toBe(0);
      });
   });

   describe('size', () => {
      it('should return the number of keys', () => {
         const dd = new defaultdict(() => 0);
         expect(dd.size).toBe(0);
         dd.set('key1', 1);
         expect(dd.size).toBe(1);
         dd.set('key2', 2);
         expect(dd.size).toBe(2);
         dd.delete('key1');
         expect(dd.size).toBe(1);
         dd.delete('key2');
         expect(dd.size).toBe(0);
      });
   });

   describe('clear', () => {
      it('should remove all keys', () => {
         const dd = new defaultdict(() => 0);
         dd.set('key1', 1);
         dd.set('key2', 2);
         expect(dd.size).toBe(2);
         dd.clear();
         expect(dd.size).toBe(0);
      });
   });

   describe('forEach', () => {
      it('should call the provided function for each key-value pair', () => {
         const dd = new defaultdict(() => 0);
         dd.set('key1', 1);
         dd.set('key2', 2);
         const result: string[] = [];
         dd.forEach((value, key) => {
            result.push(`${key}: ${value}`);
         });
         expect(result).toEqual(['key1: 1', 'key2: 2']);
      });
   });
});