import { Counter, Heap, heapq } from '../../../src/index';
describe('Heap', () => {
  let heap: Heap<number>;

  beforeEach(() => {
    heap = new Heap<number>();
  });

  describe('Initialization', () => {
    test('should create empty heap', () => {
      expect(heap.size).toBe(0);
      expect(heap.isEmpty).toBe(true);
      expect(heap.peek()).toBeUndefined();
    });

    test('should create heap from array', () => {
      const heapFromArray = new Heap<number>([4, 2, 7, 1, 9, 3]);
      expect(heapFromArray.size).toBe(6);
      expect(heapFromArray.peek()).toBe(1); // Min element should be at root
    });

    test('should create heap with custom comparator', () => {
      // Max-heap using min-heap with reversed comparator
      const maxHeapq = new Heap<number>((a, b) => b - a);
      maxHeapq.push(4).push(2).push(7).push(1);
      expect(maxHeapq.peek()).toBe(7); // Max element with reversed comparator
    });

    test('should handle complex objects with custom comparator', () => {
      interface Task {
        priority: number;
        name: string;
      }

      const taskHeap = new Heap<Task>(
        [
          { priority: 3, name: 'task3' },
          { priority: 1, name: 'task1' },
          { priority: 2, name: 'task2' },
        ],
        (a, b) => a.priority - b.priority
      );

      expect(taskHeap.peek()?.priority).toBe(1);
      expect(taskHeap.peek()?.name).toBe('task1');
      expect(taskHeap.size).toBe(3);
    });
  });

  describe('push', () => {
    test('should add element to empty heap', () => {
      heap.push(5);
      expect(heap.size).toBe(1);
      expect(heap.peek()).toBe(5);
    });

    test('should maintain min-heap property', () => {
      const values = [4, 2, 7, 1, 9, 3, 5];
      for (const value of values) {
        heap.push(value);
      }

      expect(heap.size).toBe(7);
      expect(heap.peek()).toBe(1); // Minimum should be at root
    });

    test('should handle duplicate values', () => {
      heap.push(5).push(3).push(5).push(1).push(3);
      expect(heap.size).toBe(5);
      expect(heap.peek()).toBe(1);

      heap.pop(); // Remove 1
      expect(heap.peek()).toBe(3);
    });

    test('should return this for chaining', () => {
      const result = heap.push(1);
      expect(result).toBe(heap);
    });

    test('should handle negative numbers', () => {
      heap.push(0).push(-5).push(3).push(-2);
      expect(heap.peek()).toBe(-5);
    });
  });

  describe('pop', () => {
    test('should return undefined for empty heap', () => {
      expect(heap.pop()).toBeUndefined();
    });

    test('should remove and return minimum element', () => {
      heap.push(4).push(2).push(7).push(1).push(9);

      expect(heap.pop()).toBe(1);
      expect(heap.size).toBe(4);
      expect(heap.peek()).toBe(2); // Next minimum
    });

    test('should maintain heap property after removals', () => {
      const values = [10, 5, 15, 2, 8, 12, 20, 1];
      for (const value of values) {
        heap.push(value);
      }

      const sorted: number[] = [];
      while (!heap.isEmpty) {
        sorted.push(heap.pop()!);
      }

      expect(sorted).toEqual([1, 2, 5, 8, 10, 12, 15, 20]);
    });

    test('should handle single element heap', () => {
      heap.push(42);
      expect(heap.pop()).toBe(42);
      expect(heap.isEmpty).toBe(true);
      expect(heap.peek()).toBeUndefined();
    });
  });

  describe('peek', () => {
    test('should return undefined for empty heap', () => {
      expect(heap.peek()).toBeUndefined();
    });

    test('should return minimum without removing it', () => {
      heap.push(4).push(2).push(7).push(1);

      expect(heap.peek()).toBe(1);
      expect(heap.size).toBe(4); // Size should not change
      expect(heap.peek()).toBe(1); // Should still be there
    });

    test('should update after modifications', () => {
      heap.push(5);
      expect(heap.peek()).toBe(5);

      heap.push(3);
      expect(heap.peek()).toBe(3);

      heap.push(7);
      expect(heap.peek()).toBe(3);

      heap.pop();
      expect(heap.peek()).toBe(5);
    });
  });

  describe('pushPop', () => {
    test('should push item and pop minimum', () => {
      heap.push(5).push(3).push(7);

      const result = heap.pushPop(1);
      expect(result).toBe(1); // Should return the pushed item (new minimum)
      expect(heap.peek()).toBe(3); // Original minimum was popped
      expect(heap.size).toBe(3); // Size unchanged
    });

    test('should be more efficient than separate push/pop', () => {
      heap.push(5).push(10).push(3);

      const result = heap.pushPop(8);
      expect(result).toBe(3); // Original minimum
      expect(heap.peek()).toBe(5); // Next minimum
    });

    test('should handle empty heap', () => {
      const result = heap.pushPop(5);
      expect(result).toBe(5);
      expect(heap.isEmpty).toBe(true);
    });
  });

  describe('replace', () => {
    test('should replace root with new item', () => {
      heap.push(1).push(3).push(5).push(7);

      const oldRoot = heap.replace(4);
      expect(oldRoot).toBe(1); // Original minimum
      expect(heap.peek()).toBe(3); // New minimum
      expect(heap.size).toBe(4); // Size unchanged
    });

    test('should maintain heap property after replace', () => {
      heap.push(2).push(4).push(6).push(8).push(10);

      heap.replace(1); // Replace 2 with 1
      expect(heap.peek()).toBe(1);

      heap.replace(12); // Replace 1 with 12
      expect(heap.peek()).toBe(4);
    });

    test('should handle empty heap', () => {
      const result = heap.replace(5);      
      expect(result).toBeUndefined();
      expect(heap.peek()).toBe(5);
      expect(heap.size).toBe(1);
    });
  });
  describe('nSmallest', () => {
    beforeEach(() => {
      heap.push(10).push(5).push(15).push(2).push(8).push(12).push(20).push(1);
    });

    test('should return n = 1', () => {
      const smallest1 = heap.nsmallest(1);
      expect(smallest1).toEqual([1]);
      expect(heap.size).toBe(8);
    });
    test('should return n smallest elements', () => {
      const smallest3 = heap.nsmallest(3);

      expect(smallest3).toEqual([1, 2, 5]);
      expect(heap.size).toBe(8); // Should not modify heap
    });

    test('should handle n greater than heap size', () => {
      const smallest10 = heap.nsmallest(10);
      expect(smallest10).toEqual([1, 2, 5, 8, 10, 12, 15, 20]);
    });

    test('should handle n = 0', () => {
      const smallest0 = heap.nsmallest(0);
      expect(smallest0).toEqual([]);
    });

    test('should handle empty heap', () => {
      const emptyHeap = new Heap<number>();
      expect(emptyHeap.nsmallest(3)).toEqual([]);
    });

    test('should handle equal numbers', () => {
      const heap = new Heap<number>([5, 5, 5, 3, 3, 7, 7, 7, 1, 1, 22, 44, 2, 34, 5, 65, 5, 5]);
      const smallest3 = heap.nsmallest(3);
      expect(smallest3).toEqual([1, 1, 2]);
      expect(heap.size).toBe(18);
    });

    test('should handle custom comparator', () => {
      const customHeap = new Heap<number[]>(
        [
          [1, 2],
          [2, 3],
          [3, 3],
          [44, 3],
        ],
        (a, b) => a[0] - b[0]
      );

      const largest3 = customHeap.nsmallest(3);
      expect(largest3).toEqual([
        [1, 2],
        [2, 3],
        [3, 3],
      ]); // Should return largest elements in descending order
      expect(customHeap.size).toBe(4);
    });
  });
  describe('nLargest', () => {
    beforeEach(() => {
      heap.push(10).push(5).push(15).push(2).push(8).push(12).push(20).push(1);
    });

    test('should return n largest elements', () => {
      const largest3 = heap.nlargest(3);
      expect(largest3).toEqual([20, 15, 12]);
      expect(heap.size).toBe(8); // Should not modify heap
    });

    test('should handle n greater than heap size', () => {
      const largest10 = heap.nlargest(10);
      expect(largest10).toEqual([20, 15, 12, 10, 8, 5, 2, 1]);
    });

    test('should handle n = 0', () => {
      const largest0 = heap.nlargest(0);
      expect(largest0).toEqual([]);
    });

    test('should handle empty heap', () => {
      const emptyHeap = new Heap<number>();
      expect(emptyHeap.nlargest(3)).toEqual([]);
    });
    test('should handle n = 1', () => {
      const largest1 = heap.nlargest(1);
      expect(largest1).toEqual([20]);
      expect(heap.size).toBe(8);
    });

    test('should handle equal numbers', () => {
      const heap = new Heap<number>([5, 5, 5, 3, 3, 7, 7, 7, 1, 1, 22, 44, 44, 44, 2, 34, 5, 65, 5, 5]);
      const largest3 = heap.nlargest(3);
      expect(largest3).toEqual([65, 44, 44]);
      expect(heap.size).toBe(20);
    });
  });

  describe('clear', () => {
    test('should clear empty heap', () => {
      heap.clear();
      expect(heap.size).toBe(0);
      expect(heap.isEmpty).toBe(true);
    });

    test('should clear non-empty heap', () => {
      heap.push(1).push(2).push(3);
      heap.clear();

      expect(heap.size).toBe(0);
      expect(heap.isEmpty).toBe(true);
      expect(heap.peek()).toBeUndefined();
    });
  });

  describe('Iterator', () => {
    test('should iterate over empty heap', () => {
      const items = Array.from(heap);
      expect(items).toEqual([]);
    });

    test('should iterate over all elements', () => {
      heap.push(4).push(2).push(7).push(1);
      const items = Array.from(heap);

      expect(items).toHaveLength(4);
      expect(items).toContain(1);
      expect(items).toContain(2);
      expect(items).toContain(4);
      expect(items).toContain(7);
    });

    test('should work with for...of loop', () => {
      heap.push(3).push(1).push(4);
      const result: number[] = [];

      for (const item of heap) {
        result.push(item);
      }

      expect(result).toHaveLength(3);
      expect(result).toContain(1);
      expect(result).toContain(3);
      expect(result).toContain(4);
    });
  });

  describe('Complex scenarios', () => {
    test('should handle priority queue simulation', () => {
      interface Task {
        id: string;
        priority: number;
      }

      const taskQueue = new Heap<Task>((a, b) => a.priority - b.priority);

      taskQueue.push({ id: 'low', priority: 3 });
      taskQueue.push({ id: 'high', priority: 1 });
      taskQueue.push({ id: 'medium', priority: 2 });

      expect(taskQueue.pop()?.id).toBe('high');
      expect(taskQueue.pop()?.id).toBe('medium');
      expect(taskQueue.pop()?.id).toBe('low');
    });

    test('should handle heap sort', () => {
      const unsorted = [64, 34, 25, 12, 22, 11, 90];

      for (const num of unsorted) {
        heap.push(num);
      }

      const sorted: number[] = [];
      while (!heap.isEmpty) {
        sorted.push(heap.pop()!);
      }

      expect(sorted).toEqual([11, 12, 22, 25, 34, 64, 90]);
    });

    test('should handle running median calculation', () => {
      // Using two heaps approach for running median
      const maxHeap = new Heap<number>((a, b) => b - a); // Max heap (left half)
      const minHeap = new Heap<number>((a, b) => a - b); // Min heap (right half)

      function addNumber(num: number): void {
        if (maxHeap.isEmpty || num <= maxHeap.peek()!) {
          maxHeap.push(num);
        } else {
          minHeap.push(num);
        }

        // Balance heaps
        if (maxHeap.size > minHeap.size + 1) {
          minHeap.push(maxHeap.pop()!);
        } else if (minHeap.size > maxHeap.size + 1) {
          maxHeap.push(minHeap.pop()!);
        }
      }

      function getMedian(): number {
        if (maxHeap.size === minHeap.size) {
          return (maxHeap.peek()! + minHeap.peek()!) / 2;
        }
        return maxHeap.size > minHeap.size ? maxHeap.peek()! : minHeap.peek()!;
      }

      addNumber(1);
      expect(getMedian()).toBe(1);

      addNumber(2);
      expect(getMedian()).toBe(1.5);

      addNumber(3);
      expect(getMedian()).toBe(2);

      addNumber(4);
      expect(getMedian()).toBe(2.5);
    });

    test('should handle k-way merge', () => {
      // Merge k sorted arrays using min heap
      const arrays = [
        [1, 4, 7],
        [2, 5, 8],
        [3, 6, 9],
      ];

      interface HeapNode {
        value: number;
        arrayIndex: number;
        elementIndex: number;
      }

      const mergeHeap = new Heap<HeapNode>((a, b) => a.value - b.value);

      // Initialize heap with first element from each array
      for (let i = 0; i < arrays.length; i++) {
        if (arrays[i].length > 0) {
          mergeHeap.push({
            value: arrays[i][0],
            arrayIndex: i,
            elementIndex: 0,
          });
        }
      }

      const result: number[] = [];
      while (!mergeHeap.isEmpty) {
        const node = mergeHeap.pop()!;
        result.push(node.value);

        // Add next element from the same array
        if (node.elementIndex + 1 < arrays[node.arrayIndex].length) {
          mergeHeap.push({
            value: arrays[node.arrayIndex][node.elementIndex + 1],
            arrayIndex: node.arrayIndex,
            elementIndex: node.elementIndex + 1,
          });
        }
      }

      expect(result).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
    });
  });

  describe('Edge cases', () => {
    test('should handle null and undefined values with custom comparator', () => {
      const nullableHeap = new Heap<number | null>((a, b) => {
        if (a === null && b === null) return 0;
        if (a === null) return -1;
        if (b === null) return 1;
        return a - b;
      });

      nullableHeap.push(5).push(null).push(3).push(null).push(1);

      expect(nullableHeap.pop()).toBe(null);
      expect(nullableHeap.pop()).toBe(null);
      expect(nullableHeap.pop()).toBe(1);
    });

    test('should handle very large heap', () => {
      const largeSize = 10000;
      const values = Array.from({ length: largeSize }, (_, i) => largeSize - i);

      for (const value of values) {
        heap.push(value);
      }

      expect(heap.size).toBe(largeSize);
      expect(heap.peek()).toBe(1);

      // Pop some elements
      for (let i = 1; i <= 100; i++) {
        expect(heap.pop()).toBe(i);
      }

      expect(heap.size).toBe(largeSize - 100);
      expect(heap.peek()).toBe(101);
    });

    test('should maintain heap property with duplicate elements', () => {
      const duplicates = [5, 5, 5, 3, 3, 7, 7, 7, 1, 1];

      for (const value of duplicates) {
        heap.push(value);
      }

      const sorted: number[] = [];
      while (!heap.isEmpty) {
        sorted.push(heap.pop()!);
      }

      expect(sorted).toEqual([1, 1, 3, 3, 5, 5, 5, 7, 7, 7]);
    });
  });
});

describe('Heap Static Methods', () => {
  describe('from', () => {
    test('should create heap from iterable', () => {
      const iterable = [4, 2, 7, 1, 9];
      const heapFromIterable = heapq.from(iterable, (a, b) => a - b);
      expect(heapFromIterable).toBeInstanceOf(Heap);
      expect(heapFromIterable.size).toBe(5);
      expect(heapFromIterable.peek()).toBe(1);
    });

    test('should handle empty iterable', () => {
      const emptyHeap = heapq.from([]);
      expect(emptyHeap.size).toBe(0);
      expect(emptyHeap.isEmpty).toBe(true);
    });
  });

  test('should create heap from iterable with default comparator and custom comparator', () => {
    const iterable = [4, 2, 7, 1, 9];
    const heapFromIterable = heapq.from(iterable, (a, b) => a - b);
    expect(heapFromIterable).toBeInstanceOf(Heap);
    expect(heapFromIterable.size).toBe(5);
    expect(heapFromIterable.peek()).toBe(1); // Min element
  });

  describe('of', () => {
    test('should create heap from variadic arguments', () => {
      const heapFromArgs = heapq.of(4, 2, 7, 1, 9);
      expect(heapFromArgs.size).toBe(5);
      expect(heapFromArgs.peek()).toBe(1);
    });

    test('should handle no arguments', () => {
      const emptyHeap = heapq.of();
      expect(emptyHeap.size).toBe(0);
      expect(emptyHeap.isEmpty).toBe(true);
    });
  });

  describe('isHeapq', () => {
    test('should return true for Heap instance', () => {
      const heapInstance = new Heap<number>();
      expect(heapq.isHeapq(heapInstance)).toBe(true);
    });

    test('should return false for non-Heap instance', () => {
      expect(heapq.isHeapq({})).toBe(false);
      expect(heapq.isHeapq([])).toBe(false);
      expect(heapq.isHeapq(null)).toBe(false);
    });
  });

  describe('heapify', () => {
    test('should heapify an array', () => {
      const arr = [4, 2, 7, 1, 9];
      heapq.heapify(arr);
      expect(arr).toEqual([1, 2, 7, 4, 9]); // Min-heap property
    });

    test('should handle max heapify', () => {
      const arr = [4, 2, 7, 1, 9];
      heapq.heapify(arr, (a, b) => b - a); // Max-heap
      expect(arr).toEqual([9, 4, 7, 1, 2]); // Max-heap property
    });

    test('should handle empty array', () => {
      const emptyArr: number[] = [];
      heapq.heapify(emptyArr);
      expect(emptyArr).toEqual([]);
    });

    test('should handle single element array', () => {
      const singleElementArr = [42];
      heapq.heapify(singleElementArr);
      expect(singleElementArr).toEqual([42]);
    });
  });


  describe('nsmallest and nlargest', () => {
    test('should find n smallest elements', () => {
      const smallest3 = heapq.nsmallest(3, [5, 5, 5, 3, 3, 7, 7, 7, 1, 1, 22, 44, 2, 34, 5, 65, 5, 5]);
      expect(smallest3).toEqual([1, 1, 2]);
    });

    test('should find n largest elements', () => {
      const result = heapq.nlargest(3, [5, 5, 5, 3, 3, 7, 7, 7, 1, 1, 22, 44, 44, 44, 2, 34, 5, 65, 5, 5]);
      expect(result).toEqual([65, 44, 44]);      
    });

    test('should handle Counter objects', () => {
      const counter = new Counter<string>(['apple', 'banana', 'apple', 'orange', 'banana', 'banana']);
      const mostCommon = heapq.nlargest(2, counter, (a) => a[1]);
      expect(mostCommon).toEqual([['banana', 3], ['apple', 2]]);
    });
  });

  describe('should handle pop and push operations', () =>{
    test('should pop elements in correct order', () => {
      const heap = [5, 3, 8, 1, 4];
      heapq.heapify(heap);
      const popped: number[] = [];
      while (heap.length > 0) {
        popped.push(heapq.heapPop(heap)!);
      }
      expect(popped).toEqual([1, 3, 4, 5, 8]);
    });

    test('should push elements and maintain heap property', () => {
      const heap = [5, 3, 8, 1, 4];
      heapq.heapify(heap);
      heapq.heapPush(heap, 2);
      heapq.heapPush(heap, 6);
      expect(heap).toEqual(new Heap<number>(heap).toArray());
    });
  });
});
