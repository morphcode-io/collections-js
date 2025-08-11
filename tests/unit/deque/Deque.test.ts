import { Deque } from '../../../src/index';

describe('Deque', () => {
  let deque: Deque<number>;

  beforeEach(() => {
    deque = new Deque<number>();
  });

  describe('Initialization', () => {
    test('should create empty deque', () => {
      expect(deque.size).toBe(0);
      expect(deque.isEmpty).toBe(true);
      expect(deque.toArray()).toEqual([]);
    });

    test('should create deque from iterable', () => {
      const dequeFromArray = new Deque([1, 2, 3, 4]);
      expect(dequeFromArray.size).toBe(4);
      expect(dequeFromArray.toArray()).toEqual([1, 2, 3, 4]);
    });
  });

  describe('pushLeft', () => {
    test('should add element to front of empty deque', () => {
      deque.pushLeft(1);
      expect(deque.size).toBe(1);
      expect(deque.get()).toBe(1);
      expect(deque.get(-1)).toBe(1);
      expect(deque.get(-2)).toBeUndefined();
      expect(deque.toArray()).toEqual([1]);
    });

    test('should add multiple elements to front', () => {
      deque.pushLeft(1);
      deque.pushLeft(2);
      deque.pushLeft(3);
      expect(deque.size).toBe(3);
      expect(deque.get()).toBe(3);
      expect(deque.get(-1)).toBe(1);
      expect(deque.toArray()).toEqual([3, 2, 1]);
    });

    test('should return this for chaining', () => {
      const result = deque.pushLeft(1);
      expect(result).toBe(deque);
    });
  });

   describe('push', () => {
    test('should add element to rear of empty deque', () => {
      deque.push(1);
      expect(deque.size).toBe(1);
      expect(deque.get()).toBe(1);
      expect(deque.get(-1)).toBe(1);
      expect(deque.toArray()).toEqual([1]);
    });

    test('should add multiple elements to rear', () => {
      deque.push(1);
      deque.push(2);
      deque.push(3);
      expect(deque.size).toBe(3);
      expect(deque.get()).toBe(1);
      expect(deque.get(-1)).toBe(3);
      expect(deque.toArray()).toEqual([1, 2, 3]);
    });

    test('should return this for chaining', () => {
      const result = deque.push(1);
      expect(result).toBe(deque);
    });
  });

  describe('Mixed add operations', () => {
    test('should handle mixed pushLeft and push operations', () => {
      deque.pushLeft(2);
      deque.push(3);
      deque.pushLeft(1);
      deque.push(4);
      expect(deque.toArray()).toEqual([1, 2, 3, 4]);
      expect(deque.size).toBe(4);
    });
  });

  describe('popLeft', () => {
    test('should return undefined for empty deque', () => {
      expect(deque.popLeft()).toBeUndefined();
      expect(deque.size).toBe(0);
    });

    test('should remove and return first element', () => {
      deque.pushLeft(1);
      deque.pushLeft(2);
      deque.pushLeft(3);

      expect(deque.popLeft()).toBe(3);
      expect(deque.size).toBe(2);
      expect(deque.get(0)).toBe(2);
      expect(deque.toArray()).toEqual([2, 1]);
    });

    test('should handle single element deque', () => {
      deque.pushLeft(1);
      expect(deque.popLeft()).toBe(1);
      expect(deque.size).toBe(0);
      expect(deque.isEmpty).toBe(true);
      expect(deque.get(0)).toBeUndefined();
      expect(deque.get(-1)).toBeUndefined();
    });
  });

  describe('pop the last element', () => {
    test('should return undefined for empty deque', () => {
      expect(deque.pop()).toBeUndefined();
      expect(deque.size).toBe(0);
    });

    test('should remove and return last element', () => {
      deque.push(1);
      deque.push(2);
      deque.push(3);

      expect(deque.pop()).toBe(3);
      expect(deque.size).toBe(2);
      expect(deque.get(-1)).toBe(2);
      expect(deque.toArray()).toEqual([1, 2]);
    });

    test('should handle single element deque', () => {
      deque.push(1);
      expect(deque.pop()).toBe(1);
      expect(deque.size).toBe(0);
      expect(deque.isEmpty).toBe(true);
      expect(deque.get(0)).toBeUndefined();
      expect(deque.get(-1)).toBeUndefined();
    });
  });

  describe('get first element', () => {
    test('should return undefined for empty deque', () => {
      expect(deque.get(0)).toBeUndefined();
    });

    test('should return first element without removing it', () => {
      deque.pushLeft(1);
      deque.pushLeft(2);

      expect(deque.get(0)).toBe(2);
      expect(deque.size).toBe(2);
      expect(deque.get(0)).toBe(2); // Should still be there
    });
  });

  describe('get last element', () => {
    test('should return undefined for empty deque', () => {
      expect(deque.get(-1)).toBeUndefined();
    });

    test('should return last element without removing it', () => {
      deque.push(1);
      deque.push(2);

      expect(deque.get(-1)).toBe(2);
      expect(deque.size).toBe(2);
      expect(deque.get(-1)).toBe(2); // Should still be there
    });
  });

  describe('clear', () => {
    test('should clear empty deque', () => {
      deque.clear();
      expect(deque.size).toBe(0);
      expect(deque.isEmpty).toBe(true);
    });

    test('should clear non-empty deque', () => {
      deque.pushLeft(1);
      deque.push(2);
      deque.pushLeft(3);

      deque.clear();
      expect(deque.size).toBe(0);
      expect(deque.isEmpty).toBe(true);
      expect(deque.get(0)).toBeUndefined();
      expect(deque.get(-1)).toBeUndefined();
      expect(deque.toArray()).toEqual([]);
    });
  });

  describe('includes', () => {
    test('should return false for empty deque', () => {
      expect(deque.includes(1)).toBe(false);
    });

    test('should find existing elements', () => {
      deque.pushLeft(1);
      deque.push(2);
      deque.pushLeft(3);

      expect(deque.includes(1)).toBe(true);
      expect(deque.includes(2)).toBe(true);
      expect(deque.includes(3)).toBe(true);
      expect(deque.includes(4)).toBe(false);
    });
  });

  describe('extend', () => {
    test('should add all elements from array', () => {
      deque.extend([1, 2, 3]);
      expect(deque.size).toBe(3);
      expect(deque.toArray()).toEqual([1, 2, 3]);
    });

    test('should add all elements to existing deque', () => {
      deque.pushLeft(0);
      deque.extend([1, 2, 3]);
      expect(deque.size).toBe(4);
      expect(deque.toArray()).toEqual([0, 1, 2, 3]);
    });

    test('should handle empty iterable', () => {
      deque.pushLeft(1);
      deque.extend([]);
      expect(deque.size).toBe(1);
      expect(deque.toArray()).toEqual([1]);
    });

    test('should return this for chaining', () => {
      const result = deque.extend([1, 2, 3]);
      expect(result).toBe(deque);
    });
  });

  describe('extendleft', ()=>{
    test('should add all elements from array to front', () => {
      deque.extendLeft([1, 2, 3]);
      expect(deque.size).toBe(3);
      expect(deque.toArray()).toEqual([3, 2, 1]);
    });
    test('should add all elements to existing deque', () => {
      deque.pushLeft(0);
      deque.extendLeft([1, 2, 3]);
      expect(deque.size).toBe(4);
      expect(deque.toArray()).toEqual([3, 2, 1, 0]);
    });
    test('should handle empty iterable', () => {
      deque.extendLeft([]);
      expect(deque.size).toBe(0);
      expect(deque.toArray()).toEqual([]);
    });
    test('should return this for chaining', () => {
      const result = deque.extendLeft([1, 2, 3]);
      expect(result).toBe(deque);
    });
  });

  describe('indexOf', ()=>{
    test('should return index of existing element', () => {
      deque.pushLeft(1);
      deque.push(2);
      deque.pushLeft(3);

      expect(deque.indexOf(1)).toBe(1);
      expect(deque.indexOf(2)).toBe(2);
      expect(deque.indexOf(3)).toBe(0);
      expect(deque.indexOf(4)).toBe(-1);
    });
  });


  describe('Iterator', () => {
    test('should iterate over empty deque', () => {
      const items = Array.from(deque);
      expect(items).toEqual([]);
    });

    test('should iterate over elements in correct order', () => {
      deque.pushLeft(2);
      deque.push(3);
      deque.pushLeft(1);
      deque.push(4);

      const items = Array.from(deque);
      expect(items).toEqual([1, 2, 3, 4]);
    });

    test('should work with for...of loop', () => {
      deque.extend([1, 2, 3]);
      const result: number[] = [];
      
      for (const item of deque) {
        result.push(item);
      }
      
      expect(result).toEqual([1, 2, 3]);
    });
  });

  describe('Complex scenarios', () => {
    test('should handle alternating operations', () => {
      // Simulate a queue-like behavior
      deque.push(1);
      deque.pushLeft(2);
      deque.push(3);
      // 2,1, 3
      expect(deque.popLeft()).toBe(2); // left is 2
      deque.push(4); // 1,3,4
      expect(deque.popLeft()).toBe(1); // left is 1
      expect(deque.pop()).toBe(4); // right is 4
      expect(deque.isEmpty).toBe(false);
    });

    test('should handle stack-like behavior', () => {
      // LIFO behavior using pushLeft/popLeft
      deque.pushLeft(1);
      deque.pushLeft(2);
      deque.pushLeft(3);

      expect(deque.popLeft()).toBe(3);
      expect(deque.popLeft()).toBe(2);
      expect(deque.popLeft()).toBe(1);
      expect(deque.isEmpty).toBe(true);
    });

    test('should handle palindrome operations', () => {
      // Add elements to create palindrome
      deque.push(1);
      deque.pushLeft(1);
      deque.push(2);
      deque.pushLeft(2);
      deque.push(3);
      deque.pushLeft(3);
      
      expect(deque.toArray()).toEqual([3, 2, 1, 1, 2, 3]);
      
      // Remove from both ends and verify symmetry
      expect(deque.popLeft()).toBe(deque.pop());
      expect(deque.popLeft()).toBe(deque.pop());
      expect(deque.popLeft()).toBe(deque.pop());
      expect(deque.isEmpty).toBe(true);
    });

    test('should handle large number of operations', () => {
      const n = 1000;
      
      // Add elements
      for (let i = 0; i < n; i++) {
        if (i % 2 === 0) {
          deque.pushLeft(i);
        } else {
          deque.push(i);
        }
      }
      
      expect(deque.size).toBe(n);
      
      // Remove half from each end
      let removedCount = 0;
      while (deque.size > n / 2) {
        if (removedCount % 2 === 0) {
          deque.popLeft();
        } else {
          deque.pop();
        }
        removedCount++;
      }
      
      expect(deque.size).toBe(n / 2);
    });
  });
});