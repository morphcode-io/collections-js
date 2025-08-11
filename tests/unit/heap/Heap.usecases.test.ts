import { Heap } from '../../../src/index';

describe('MinHeap Use Cases', () => {
  describe('Priority Queue', () => {
    test('should work as a basic priority queue', () => {
      interface Task {
        id: string;
        priority: number;
        description: string;
      }

      const taskQueue = new Heap<Task>((a, b) => a.priority - b.priority);

      // Add tasks with different priorities
      taskQueue.push({ id: '1', priority: 5, description: 'Low priority task' });
      taskQueue.push({ id: '2', priority: 1, description: 'High priority task' });
      taskQueue.push({ id: '3', priority: 3, description: 'Medium priority task' });
      taskQueue.push({ id: '4', priority: 1, description: 'Another high priority task' });

      // Execute tasks in priority order
      const executedTasks: string[] = [];
      while (!taskQueue.isEmpty) {
        const task = taskQueue.pop()!;
        executedTasks.push(task.id);
      }

      expect(executedTasks[0]).toBe('2'); // First high priority task
      expect(executedTasks[1]).toBe('4'); // Second high priority task
      expect(executedTasks[2]).toBe('3'); // Medium priority task
      expect(executedTasks[3]).toBe('1'); // Low priority task
    });

    test('should handle emergency task insertion', () => {
      interface EmergencyTask {
        id: string;
        priority: number;
        isEmergency: boolean;
      }

      const taskQueue = new Heap<EmergencyTask>((a, b) => {
        // Emergency tasks always have higher priority
        if (a.isEmergency && !b.isEmergency) return -1;
        if (!a.isEmergency && b.isEmergency) return 1;
        return a.priority - b.priority;
      });

      taskQueue.push({ id: 'normal1', priority: 2, isEmergency: false });
      taskQueue.push({ id: 'normal2', priority: 1, isEmergency: false });
      
      // Add emergency task
      taskQueue.push({ id: 'emergency1', priority: 10, isEmergency: true });
      
      // Emergency task should be processed first
      expect(taskQueue.pop()!.id).toBe('emergency1');
      expect(taskQueue.pop()!.id).toBe('normal2');
      expect(taskQueue.pop()!.id).toBe('normal1');
    });
  });

  describe('Dijkstra\'s Algorithm Simulation', () => {
    test('should handle shortest path priority queue', () => {
      interface Node {
        id: string;
        distance: number;
        previous?: string;
      }

      const priorityQueue = new Heap<Node>((a, b) => a.distance - b.distance);

      // Simulate Dijkstra's algorithm priority queue
      priorityQueue.push({ id: 'A', distance: 0 });
      priorityQueue.push({ id: 'B', distance: 4 });
      priorityQueue.push({ id: 'C', distance: 2 });
      priorityQueue.push({ id: 'D', distance: 6 });

      // Process nodes in order of shortest distance
      const processOrder: string[] = [];
      while (!priorityQueue.isEmpty) {
        const node = priorityQueue.pop()!;
        processOrder.push(node.id);
      }

      expect(processOrder).toEqual(['A', 'C', 'B', 'D']);
    });

    test('should handle distance updates efficiently', () => {
      interface GraphNode {
        id: string;
        distance: number;
      }

      const queue = new Heap<GraphNode>((a, b) => a.distance - b.distance);

      // Initial distances
      queue.push({ id: 'A', distance: Infinity });
      queue.push({ id: 'B', distance: Infinity });
      queue.push({ id: 'C', distance: 0 }); // Start node

      expect(queue.peek()!.id).toBe('C');
      expect(queue.peek()!.distance).toBe(0);

      // Simulate distance relaxation by adding updated nodes
      queue.push({ id: 'A', distance: 5 });
      queue.push({ id: 'B', distance: 3 });

      expect(queue.pop()!.id).toBe('C');
      expect(queue.pop()!.id).toBe('B');
      expect(queue.pop()!.id).toBe('A');
    });
  });

  describe('Event Scheduling', () => {
    test('should schedule events by timestamp', () => {
      interface Event {
        id: string;
        timestamp: number;
        action: string;
      }

      const eventScheduler = new Heap<Event>((a, b) => a.timestamp - b.timestamp);

      // Schedule events
      eventScheduler.push({ id: '1', timestamp: 1000, action: 'start_process' });
      eventScheduler.push({ id: '2', timestamp: 500, action: 'initialize' });
      eventScheduler.push({ id: '3', timestamp: 1500, action: 'cleanup' });
      eventScheduler.push({ id: '4', timestamp: 750, action: 'process_data' });

      // Process events in chronological order
      const processedEvents: string[] = [];
      while (!eventScheduler.isEmpty) {
        const event = eventScheduler.pop()!;
        processedEvents.push(event.action);
      }

      expect(processedEvents).toEqual([
        'initialize',
        'process_data',
        'start_process',
        'cleanup'
      ]);
    });

    test('should handle real-time event insertion', () => {
      interface TimedEvent {
        name: string;
        executeAt: number;
      }

      const scheduler = new Heap<TimedEvent>((a, b) => a.executeAt - b.executeAt);
      const currentTime = Date.now();

      // Schedule future events
      scheduler.push({ name: 'event1', executeAt: currentTime + 1000 });
      scheduler.push({ name: 'event2', executeAt: currentTime + 500 });
      scheduler.push({ name: 'urgent', executeAt: currentTime + 100 });

      // Next event to execute should be the urgent one
      expect(scheduler.peek()!.name).toBe('urgent');
      expect(scheduler.peek()!.executeAt).toBe(currentTime + 100);
    });
  });

  describe('Top-K Problems', () => {
    test('should find k largest elements', () => {
      const numbers = [3, 1, 4, 1, 5, 9, 2, 6, 5, 3, 5];
      const k = 3;

      // Use min-heap to keep track of k largest elements
      const kLargestHeap = new Heap<number>();

      for (const num of numbers) {
        if (kLargestHeap.size < k) {
          kLargestHeap.push(num);
        } else if (num > kLargestHeap.peek()!) {
          kLargestHeap.pop();
          kLargestHeap.push(num);
        }
      }

      const kLargest = kLargestHeap.toArray().sort((a, b) => b - a);
      expect(kLargest).toEqual([9, 6, 5]);
    });

    test('should find k most frequent elements', () => {
      interface FrequencyNode {
        element: string;
        frequency: number;
      }

      const elements = ['a', 'b', 'a', 'c', 'a', 'b', 'd'];
      const k = 2;

      // Count frequencies
      const freqMap = new Map<string, number>();
      for (const elem of elements) {
        freqMap.set(elem, (freqMap.get(elem) || 0) + 1);
      }

      // Use min-heap to keep k most frequent
      const kMostFrequent = new Heap<FrequencyNode>(
        (a, b) => a.frequency - b.frequency
      );

      for (const [element, frequency] of freqMap) {
        if (kMostFrequent.size < k) {
          kMostFrequent.push({ element, frequency });
        } else if (frequency > kMostFrequent.peek()!.frequency) {
          kMostFrequent.pop();
          kMostFrequent.push({ element, frequency });
        }
      }

      const result = kMostFrequent.toArray()
        .sort((a, b) => b.frequency - a.frequency)
        .map(node => node.element);

      expect(result).toEqual(['a', 'b']); // 'a' appears 3 times, 'b' appears 2 times
    });
  });

  describe('Median Calculation', () => {
    test('should maintain running median using two heaps', () => {
      class MedianFinder {
        private maxHeap: Heap<number>; // Left half (max heap)
        private minHeap: Heap<number>; // Right half (min heap)

        constructor() {
          this.maxHeap = new Heap<number>((a, b) => b - a); // Reverse for max heap
          this.minHeap = new Heap<number>((a, b) => a - b);
        }

        addNumber(num: number): void {
          if (this.maxHeap.isEmpty || num <= this.maxHeap.peek()!) {
            this.maxHeap.push(num);
          } else {
            this.minHeap.push(num);
          }

          // Balance heaps
          if (this.maxHeap.size > this.minHeap.size + 1) {
            this.minHeap.push(this.maxHeap.pop()!);
          } else if (this.minHeap.size > this.maxHeap.size + 1) {
            this.maxHeap.push(this.minHeap.pop()!);
          }
        }

        findMedian(): number {
          if (this.maxHeap.size === this.minHeap.size) {
            return (this.maxHeap.peek()! + this.minHeap.peek()!) / 2;
          }
          return this.maxHeap.size > this.minHeap.size 
            ? this.maxHeap.peek()! 
            : this.minHeap.peek()!;
        }
      }

      const medianFinder = new MedianFinder();

      medianFinder.addNumber(1);
      expect(medianFinder.findMedian()).toBe(1);

      medianFinder.addNumber(2);
      expect(medianFinder.findMedian()).toBe(1.5);

      medianFinder.addNumber(3);
      expect(medianFinder.findMedian()).toBe(2);

      medianFinder.addNumber(4);
      expect(medianFinder.findMedian()).toBe(2.5);

      medianFinder.addNumber(5);
      expect(medianFinder.findMedian()).toBe(3);
    });
  });

  describe('Merge K Sorted Arrays', () => {
    test('should merge multiple sorted arrays efficiently', () => {
      interface HeapNode {
        value: number;
        arrayIndex: number;
        elementIndex: number;
      }

      function mergeKSortedArrays(arrays: number[][]): number[] {
        const heap = new Heap<HeapNode>((a, b) => a.value - b.value);
        const result: number[] = [];

        // Initialize heap with first element from each array
        for (let i = 0; i < arrays.length; i++) {
          if (arrays[i].length > 0) {
            heap.push({
              value: arrays[i][0],
              arrayIndex: i,
              elementIndex: 0
            });
          }
        }

        while (!heap.isEmpty) {
          const node = heap.pop()!;
          result.push(node.value);

          // Add next element from the same array
          if (node.elementIndex + 1 < arrays[node.arrayIndex].length) {
            heap.push({
              value: arrays[node.arrayIndex][node.elementIndex + 1],
              arrayIndex: node.arrayIndex,
              elementIndex: node.elementIndex + 1
            });
          }
        }

        return result;
      }

      const sortedArrays = [
        [1, 4, 5],
        [1, 3, 4],
        [2, 6]
      ];

      const merged = mergeKSortedArrays(sortedArrays);
      expect(merged).toEqual([1, 1, 2, 3, 4, 4, 5, 6]);
    });
  });

  describe('Load Balancing', () => {
    test('should distribute tasks to least loaded servers', () => {
      interface Server {
        id: string;
        load: number;
      }

      class LoadBalancer {
        private servers: Heap<Server>;

        constructor(serverIds: string[]) {
          this.servers = new Heap<Server>((a, b) => a.load - b.load);
          for (const id of serverIds) {
            this.servers.push({ id, load: 0 });
          }
        }

        assignTask(taskLoad: number): string {          
          const server = this.servers.pop()!;
          server.load += taskLoad;
          this.servers.push(server);
          return server.id;
        }

        getServerLoads(): Record<string, number> {
          const loads: Record<string, number> = {};
          for (const server of this.servers) {
            loads[server.id] = server.load;
          }
          return loads;
        }
      }

      const loadBalancer = new LoadBalancer(['server1', 'server2', 'server3']);
      
      // Assign tasks
      expect(loadBalancer.assignTask(10)).toBe('server1');
      expect(loadBalancer.assignTask(5)).toBe('server3'); 
      expect(loadBalancer.assignTask(3)).toBe('server2');
      expect(loadBalancer.assignTask(2)).toBe('server2');

      const loads = loadBalancer.getServerLoads();
      expect(loads['server1']).toBe(10);
      expect(loads['server2']).toBe(5);
      expect(loads['server3']).toBe(5); 
    });
  });

  describe('Huffman Coding Simulation', () => {
    test('should build optimal prefix codes', () => {
      interface HuffmanNode {
        frequency: number;
        character?: string;
        left?: HuffmanNode;
        right?: HuffmanNode;
      }

      function buildHuffmanTree(frequencies: Map<string, number>): HuffmanNode {
        const heap = new Heap<HuffmanNode>((a, b) => a.frequency - b.frequency);

        // Initialize heap with leaf nodes
        for (const [char, freq] of frequencies) {
          heap.push({ frequency: freq, character: char });
        }
        
        // Build tree
        while (heap.size > 1) {
          const left = heap.pop()!;
          const right = heap.pop()!;        
          const merged: HuffmanNode = {
            frequency: left.frequency + right.frequency,
            left,
            right
          };
          
          heap.push(merged);
        }
      
        return heap.pop()!;
      }

      const frequencies = new Map([
        ['a', 5],
        ['b', 9],
        ['c', 12],
        ['d', 13],
        ['e', 16],
        ['f', 45]
      ]);

      const root = buildHuffmanTree(frequencies);
      
      expect(root.frequency).toBe(100); // Total frequency
      expect(root.left).toBeDefined();
      expect(root.right).toBeDefined();
      
      // The most frequent character 'f' should be closer to root
      expect(root.left?.character).toBe('f');
    });
  });
});