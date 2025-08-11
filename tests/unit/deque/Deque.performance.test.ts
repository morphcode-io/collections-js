import { Deque } from '../../../src/index';

describe('Deque Performance Tests', () => {
  let deque: Deque<number>;

  beforeEach(() => {
    deque = new Deque<number>();
  });

  describe('Performance characteristics', () => {
    test('should handle rapid insertion and deletion efficiently', () => {
      const start = performance.now();
      
      // Perform 10,000 operations
      for (let i = 0; i < 10000; i++) {
        deque.pushLeft(i);
        deque.push(i + 10000);
        
        if (i % 3 === 0) {
          deque.popLeft();
        }
        if (i % 5 === 0) {
          deque.pop();
        }
      }
      
      const end = performance.now();
      const duration = end - start;
      
      // Should complete in reasonable time 
      expect(duration).toBeLessThan(100); // 1 second
      expect(deque.size).toBeGreaterThan(0);
    });

    test('should maintain O(1) operations for peek', () => {
      // Fill deque with many elements
      for (let i = 0; i < 10000; i++) {
        deque.push(i);
      }

      const iterations = 1000;
      const start = performance.now();
      
      for (let i = 0; i < iterations; i++) {
        deque.get();
        deque.get(-1);
      }
      
      const end = performance.now();
      const duration = end - start;
      
      // Peek operations should be very fast regardless of size
      expect(duration).toBeLessThan(10); // 10ms for 1000 peek operations
    });

    test('should handle memory efficiently with large datasets', () => {
      const elementCount = 100000;
      
      // Add many elements
      for (let i = 0; i < elementCount; i++) {
        deque.push(i);
      }
      
      expect(deque.size).toBe(elementCount);
      
      // Remove all elements
      while (!deque.isEmpty) {
        deque.popLeft();
      }
      
      expect(deque.size).toBe(0);
      expect(deque.isEmpty).toBe(true);
      
      // Should be able to reuse the deque efficiently
      for (let i = 0; i < 1000; i++) {
        deque.pushLeft(i);
      }
      
      expect(deque.size).toBe(1000);
    });
  });

  describe('Memory usage patterns', () => {
    test('should handle cyclic buffer operations efficiently', () => {
      const bufferSize = 1000;
      
      // Simulate a circular buffer pattern
      for (let cycle = 0; cycle < 10; cycle++) {
        // Fill the buffer
        for (let i = 0; i < bufferSize; i++) {
          deque.push(cycle * bufferSize + i);
        }
        
        // Empty the buffer
        for (let i = 0; i < bufferSize; i++) {
          const value = deque.popLeft();
          expect(value).toBe(cycle * bufferSize + i);
        }
        
        expect(deque.isEmpty).toBe(true);
      }
    });

    test('should handle alternating ends operations', () => {
      const operations = 10000;
      
      for (let i = 0; i < operations; i++) {
        // Alternate between adding to front and back
        if (i % 2 === 0) {
          deque.pushLeft(i);
        } else {
          deque.push(i);
        }
        
        // Occasionally remove from the opposite end
        if (i % 7 === 0 && deque.size > 1) {
          if (i % 2 === 0) {
            deque.pop();
          } else {
            deque.popLeft();
          }
        }
      }
      
      // Verify final state is consistent
      const array = deque.toArray();
      expect(deque.size).toBe(array.length);
      
      if (deque.size > 0) {
        expect(deque.get(0)).toBe(array[0]);
        expect(deque.get(-1)).toBe(array[array.length - 1]);
      }
    });
  });

  describe('Stress tests', () => {
    test('should handle rapid growth and shrinkage', () => {
      const maxSize = 10000;
      
      for (let size = 1; size <= maxSize; size *= 2) {
        // Grow to size
        while (deque.size < size) {
          deque.push(deque.size);
        }
        
        expect(deque.size).toBe(size);
        
        // Shrink back down
        while (deque.size > 1) {
          deque.popLeft();
        }
        
        expect(deque.size).toBe(1);
      }
    });

    test('should maintain correctness under random operations', () => {
      const operations = 5000;
      const trackingArray: number[] = [];
      
      for (let i = 0; i < operations; i++) {
        const operation = Math.floor(Math.random() * 6);
        
        switch (operation) {
          case 0: // pushLeft
            deque.pushLeft(i);
            trackingArray.unshift(i);
            break;
          case 1: // push
            deque.push(i);
            trackingArray.push(i);
            break;
          case 2: // popLeft
            if (deque.size > 0) {
              const dequeValue = deque.popLeft();
              const arrayValue = trackingArray.shift();
              expect(dequeValue).toBe(arrayValue);
            }
            break;
          case 3: // popLast
            if (deque.size > 0) {
              const dequeValue = deque.pop();
              const arrayValue = trackingArray.pop();
              expect(dequeValue).toBe(arrayValue);
            }
            break;
          case 4: // peekFirst
            if (deque.size > 0) {
              expect(deque.get(0)).toBe(trackingArray[0]);
            } else {
              expect(deque.get(0)).toBeUndefined();
            }
            break;
          case 5: // peekLast
            if (deque.size > 0) {
              expect(deque.get(-1)).toBe(trackingArray[trackingArray.length - 1]);
            } else {
              expect(deque.get(-1)).toBeUndefined();
            }
            break;
        }
        
        // Verify size consistency
        expect(deque.size).toBe(trackingArray.length);
        
        // Verify isEmpty consistency
        expect(deque.isEmpty).toBe(trackingArray.length === 0);
        
        // Verify toArray consistency (occasionally, as it's expensive)
        if (i % 100 === 0) {
          expect(deque.toArray()).toEqual(trackingArray);
        }
      }
      
      // Final verification
      expect(deque.toArray()).toEqual(trackingArray);
    });
  });
});
