import { Heap } from '../../../src/index';

describe('Heap Performance Tests', () => {
  let heap: Heap<number>;

  beforeEach(() => {
    heap = new Heap<number>();
  });

  describe('Performance characteristics', () => {
    test('should handle rapid insertion efficiently', () => {
      const start = performance.now();
      
      // Insert 10,000 elements
      for (let i = 10000; i > 0; i--) {
        heap.push(i);
      }
      
      const end = performance.now();
      const duration = end - start;
      
      expect(heap.size).toBe(10000);
      expect(heap.peek()).toBe(1);
      expect(duration).toBeLessThan(200);
    });

    test('should maintain O(log n) operations for large heaps', () => {
      // Pre-fill with many elements
      for (let i = 0; i < 10000; i++) {
        heap.push(Math.random() * 1000);
      }

      const iterations = 1000;
      const start = performance.now();
      
      for (let i = 0; i < iterations; i++) {
        heap.push(Math.random() * 1000);
        heap.pop();
      }
      
      const end = performance.now();
      const duration = end - start;
      
      // Operations should be logarithmic, so still quite fast
      expect(duration).toBeLessThan(50);
      expect(heap.size).toBe(10000);
    });

    test('should handle heap sort efficiently', () => {
      const size = 5000;
      const unsorted = Array.from({ length: size }, () => Math.random() * 1000);
      
      const start = performance.now();
      
      // Build heap
      for (const num of unsorted) {
        heap.push(num);
      }
      
      // Extract sorted elements
      const sorted: number[] = [];
      while (!heap.isEmpty) {
        sorted.push(heap.pop()!);
      }
      
      const end = performance.now();
      const duration = end - start;
      
      expect(sorted).toHaveLength(size);
      expect(duration).toBeLessThan(100);
      
      // Verify it's actually sorted
      for (let i = 1; i < sorted.length; i++) {
        expect(sorted[i]).toBeGreaterThanOrEqual(sorted[i - 1]);
      }
    });

    test('should handle repeated operations efficiently', () => {
      const operations = 5000;
      
      const start = performance.now();
      
      for (let i = 0; i < operations; i++) {
        heap.push(Math.random() * 100);
        
        if (heap.size > 100) {
          heap.pop();
        }
        
        if (i % 10 === 0) {
          heap.peek(); // Peek operations should be O(1)
        }
      }
      
      const end = performance.now();
      const duration = end - start;
      
      expect(duration).toBeLessThan(50);
      expect(heap.size).toBeLessThanOrEqual(100);
    });
  });

  describe('Memory efficiency', () => {
    test('should handle large datasets without excessive memory usage', () => {
      const elementCount = 50000;
      
      // Add many elements
      for (let i = 0; i < elementCount; i++) {
        heap.push(i);
      }
      
      expect(heap.size).toBe(elementCount);
      expect(heap.peek()).toBe(0);
      
      // Remove half
      for (let i = 0; i < elementCount / 2; i++) {
        heap.pop();
      }
      
      expect(heap.size).toBe(elementCount / 2);
      expect(heap.peek()).toBe(elementCount / 2);
    });

    test('should handle frequent pushPop operations efficiently', () => {
      // Pre-fill heap
      for (let i = 0; i < 1000; i++) {
        heap.push(i);
      }

      const start = performance.now();
      
      // Perform many pushPop operations
      for (let i = 0; i < 10000; i++) {
        heap.pushPop(Math.random() * 1000);
      }
      
      const end = performance.now();
      const duration = end - start;
      
      expect(duration).toBeLessThan(50);
      expect(heap.size).toBe(1000); // Size should remain constant
    });
  });

  describe('Scalability tests', () => {
    test('should scale well with increasing size', () => {
      const sizes = [100, 1000, 10000];
      const timings: number[] = [];
      
      for (const size of sizes) {
        const testHeap = new Heap<number>();
        
        const start = performance.now();
        
        // Fill heap
        for (let i = 0; i < size; i++) {
          testHeap.push(Math.random() * size);
        }
        
        // Perform operations
        for (let i = 0; i < 100; i++) {
          testHeap.push(Math.random() * size);
          testHeap.pop();
        }
        
        const end = performance.now();
        timings.push(end - start);
      }
      
      // Each timing should not be dramatically worse than the previous
      // (allowing for some variance due to logarithmic nature)
      for (let i = 1; i < timings.length; i++) {
        expect(timings[i]).toBeLessThan(timings[i - 1] * 15); // Allow up to 15x increase
      }
    });

    test('should handle stress test with random operations', () => {
      const operations = 10000;
      
      for (let i = 0; i < operations; i++) {
        const operation = Math.random();
        
        if (operation < 0.6) { // 60% push
          heap.push(Math.random() * 1000);
        } else if (operation < 0.9 && heap.size > 0) { // 30% pop
          heap.pop();
        } else if (heap.size > 0) { // 10% peek
          heap.peek();
        }
        
        // Verify heap property occasionally
        if (i % 1000 === 0 && heap.size > 1) {
          const min = heap.peek();
          const array = heap.toArray();
          
          // Min should be the smallest element
          for (const element of array) {
            expect(element).toBeGreaterThanOrEqual(min!);
          }
        }
      }
      
      expect(heap.size).toBeGreaterThanOrEqual(0);
    });
  });
});
