import { Deque } from '../../../src/index';

describe('Deque Use Cases', () => {
  describe('Queue implementation', () => {
    test('should work as FIFO queue', () => {
      const queue = new Deque<string>();
      
      // Enqueue operations
      queue.push('first');
      queue.push('second');
      queue.push('third');

      expect(queue.size).toBe(3);
      
      // Dequeue operations
      expect(queue.popLeft()).toBe('first');
      expect(queue.popLeft()).toBe('second');
      expect(queue.popLeft()).toBe('third');
      expect(queue.isEmpty).toBe(true);
    });

    test('should handle interleaved enqueue/dequeue operations', () => {
      const queue = new Deque<number>();
      
      queue.pushLeft(1);
      queue.push(2);
      expect(queue.popLeft()).toBe(1);
      
      queue.push(3);
      queue.push(4);
      expect(queue.popLeft()).toBe(2);
      expect(queue.popLeft()).toBe(3);

      queue.push(5);
      expect(queue.popLeft()).toBe(4);
      expect(queue.popLeft()).toBe(5);
      expect(queue.isEmpty).toBe(true);
    });
  });

  describe('Stack implementation', () => {
    test('should work as LIFO stack using front operations', () => {
      const stack = new Deque<string>();
      
      // Push operations
      stack.pushLeft('bottom');
      stack.pushLeft('middle');
      stack.pushLeft('top');
      
      expect(stack.size).toBe(3);
      
      // Pop operations
      expect(stack.popLeft()).toBe('top');
      expect(stack.popLeft()).toBe('middle');
      expect(stack.popLeft()).toBe('bottom');
      expect(stack.isEmpty).toBe(true);
    });

    test('should work as LIFO stack using rear operations', () => {
      const stack = new Deque<string>();
      
      // Push operations
      stack.push('bottom');
      stack.push('middle');
      stack.push('top');
      
      expect(stack.size).toBe(3);
      
      // Pop operations
      expect(stack.pop()).toBe('top');
      expect(stack.pop()).toBe('middle');
      expect(stack.pop()).toBe('bottom');
      expect(stack.isEmpty).toBe(true);
    });
  });

  describe('Sliding window buffer', () => {
    test('should maintain fixed-size sliding window', () => {
      const windowSize = 5;
      const buffer = new Deque<number>();
      
      // Add elements maintaining window size
      for (let i = 1; i <= 10; i++) {
        buffer.push(i);
        
        if (buffer.size > windowSize) {
          buffer.popLeft();
        }
        
        expect(buffer.size).toBeLessThanOrEqual(windowSize);
      }
      
      // Final window should contain [6, 7, 8, 9, 10]
      expect(buffer.toArray()).toEqual([6, 7, 8, 9, 10]);
    });

    test('should calculate moving average', () => {
      const windowSize = 3;
      const buffer = new Deque<number>();
      const averages: number[] = [];
      
      const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
      
      for (const value of values) {
        buffer.push(value);
        
        if (buffer.size > windowSize) {
          buffer.popLeft();
        }
        
        if (buffer.size === windowSize) {
          const sum = buffer.toArray().reduce((a, b) => a + b, 0);
          averages.push(sum / windowSize);
        }
      }
      
      expect(averages).toEqual([2, 3, 4, 5, 6, 7, 8, 9]);
    });
  });

  describe('Palindrome checker', () => {
    test('should check if sequence is palindrome', () => {
      function isPalindrome<T>(items: T[]): boolean {
        const deque = new Deque<T>(items);
        
        while (deque.size > 1) {
          if (deque.popLeft() !== deque.pop()) {
            return false;
          }
        }
        
        return true;
      }
      
      expect(isPalindrome([1, 2, 3, 2, 1])).toBe(true);
      expect(isPalindrome([1, 2, 3, 3, 2, 1])).toBe(true);
      expect(isPalindrome([1, 2, 3, 4, 1])).toBe(false);
      expect(isPalindrome(['a', 'b', 'a'])).toBe(true);
      expect(isPalindrome(['a', 'b', 'c'])).toBe(false);
      expect(isPalindrome([])).toBe(true);
      expect(isPalindrome([1])).toBe(true);
    });
  });

  describe('Undo/Redo system', () => {
    test('should implement basic undo/redo functionality', () => {
      interface Command {
        execute(): void;
        undo(): void;
      }
      
      class Calculator {
        private value = 0;
        private history = new Deque<Command>();
        private redoStack = new Deque<Command>();
        
        add(x: number): void {
          const command: Command = {
            execute: () => { this.value += x; },
            undo: () => { this.value -= x; }
          };
          
          command.execute();
          this.history.push(command);
          this.redoStack.clear(); // Clear redo stack on new operation
        }
        
        undo(): boolean {
          if (this.history.isEmpty) return false;
          
          const command = this.history.pop()!;
          command.undo();
          this.redoStack.push(command);
          return true;
        }
        
        redo(): boolean {
          if (this.redoStack.isEmpty) return false;

          const command = this.redoStack.pop()!;
          command.execute();
          this.history.push(command);
          return true;
        }
        
        getValue(): number {
          return this.value;
        }
      }
      
      const calc = new Calculator();
      
      calc.add(5);
      expect(calc.getValue()).toBe(5);
      
      calc.add(3);
      expect(calc.getValue()).toBe(8);
      
      calc.add(2);
      expect(calc.getValue()).toBe(10);
      
      // Undo operations
      expect(calc.undo()).toBe(true);
      expect(calc.getValue()).toBe(8);
      
      expect(calc.undo()).toBe(true);
      expect(calc.getValue()).toBe(5);
      
      // Redo operations
      expect(calc.redo()).toBe(true);
      expect(calc.getValue()).toBe(8);
      
      expect(calc.redo()).toBe(true);
      expect(calc.getValue()).toBe(10);
      
      // No more redo
      expect(calc.redo()).toBe(false);
      expect(calc.getValue()).toBe(10);
    });
  });

  describe('Task scheduler', () => {
    test('should implement priority task scheduling', () => {
      interface Task {
        id: string;
        priority: 'high' | 'normal' | 'low';
        execute(): void;
      }
      
      class TaskScheduler {
        private highPriority = new Deque<Task>();
        private normalPriority = new Deque<Task>();
        private lowPriority = new Deque<Task>();
        
        addTask(task: Task): void {
          switch (task.priority) {
            case 'high':
              this.highPriority.push(task);
              break;
            case 'normal':
              this.normalPriority.push(task);
              break;
            case 'low':
              this.lowPriority.push(task);
              break;
          }
        }
        
        addUrgentTask(task: Task): void {
          // Urgent tasks go to the front of their priority queue
          switch (task.priority) {
            case 'high':
              this.highPriority.pushLeft(task);
              break;
            case 'normal':
              this.normalPriority.pushLeft(task);
              break;
            case 'low':
              this.lowPriority.pushLeft(task);
              break;
          }
        }
        
        executeNext(): Task | null {
          if (!this.highPriority.isEmpty) {
            return this.highPriority.popLeft()!;
          }
          if (!this.normalPriority.isEmpty) {
            return this.normalPriority.popLeft()!;
          }
          if (!this.lowPriority.isEmpty) {
            return this.lowPriority.popLeft()!;
          }
          return null;
        }
        
        isEmpty(): boolean {
          return this.highPriority.isEmpty && 
                 this.normalPriority.isEmpty && 
                 this.lowPriority.isEmpty;
        }
      }
      
      const scheduler = new TaskScheduler();
      const executedTasks: string[] = [];
      
      // Add various tasks
      scheduler.addTask({
        id: 'low1',
        priority: 'low',
        execute: () => executedTasks.push('low1')
      });
      
      scheduler.addTask({
        id: 'normal1',
        priority: 'normal',
        execute: () => executedTasks.push('normal1')
      });
      
      scheduler.addTask({
        id: 'high1',
        priority: 'high',
        execute: () => executedTasks.push('high1')
      });
      
      scheduler.addUrgentTask({
        id: 'urgent_normal',
        priority: 'normal',
        execute: () => executedTasks.push('urgent_normal')
      });
      
      scheduler.addTask({
        id: 'high2',
        priority: 'high',
        execute: () => executedTasks.push('high2')
      });
      
      // Execute all tasks
      while (!scheduler.isEmpty()) {
        const task = scheduler.executeNext();
        task?.execute();
      }
      
      // Verify execution order
      expect(executedTasks).toEqual([
        'high1',        // First high priority
        'high2',        // Second high priority
        'urgent_normal', // Urgent normal (added to front)
        'normal1',      // Regular normal
        'low1'          // Low priority last
      ]);
    });
  });

  describe('Browser history simulation', () => {
    test('should simulate browser back/forward navigation', () => {
      class BrowserHistory {
        private history = new Deque<string>();
        private currentIndex = -1;
        
        visit(url: string): void {
          // Remove any forward history when visiting new page
          while (this.history.size > this.currentIndex + 1) {
            this.history.pop();
          }
          
          this.history.push(url);
          this.currentIndex++;
        }
        
        back(): string | null {
          if (this.currentIndex > 0) {
            this.currentIndex--;
            return this.getCurrentUrl();
          }
          return null;
        }
        
        forward(): string | null {
          if (this.currentIndex < this.history.size - 1) {
            this.currentIndex++;
            return this.getCurrentUrl();
          }
          return null;
        }
        
        getCurrentUrl(): string | null {
          if (this.currentIndex >= 0 && this.currentIndex < this.history.size) {
            return this.history.toArray()[this.currentIndex];
          }
          return null;
        }
        
        canGoBack(): boolean {
          return this.currentIndex > 0;
        }
        
        canGoForward(): boolean {
          return this.currentIndex < this.history.size - 1;
        }
      }
      
      const browser = new BrowserHistory();
      
      // Visit pages
      browser.visit('home.html');
      expect(browser.getCurrentUrl()).toBe('home.html');
      expect(browser.canGoBack()).toBe(false);
      expect(browser.canGoForward()).toBe(false);
      
      browser.visit('page1.html');
      browser.visit('page2.html');
      expect(browser.getCurrentUrl()).toBe('page2.html');
      expect(browser.canGoBack()).toBe(true);
      
      // Navigate back
      expect(browser.back()).toBe('page1.html');
      expect(browser.back()).toBe('home.html');
      expect(browser.back()).toBeNull(); // Can't go further back
      
      // Navigate forward
      expect(browser.forward()).toBe('page1.html');
      expect(browser.forward()).toBe('page2.html');
      expect(browser.forward()).toBeNull(); // Can't go further forward
      
      // Visit new page from middle of history
      browser.back(); // Go to page1.html
      browser.visit('newpage.html');
      expect(browser.getCurrentUrl()).toBe('newpage.html');
      expect(browser.canGoForward()).toBe(false); // Forward history cleared
    });
  });
});
