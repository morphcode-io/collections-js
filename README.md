# @anibal99/collections-js

[![npm version](https://badge.fury.io/js/@anibal99%2Fcollections-js.svg)](https://badge.fury.io/js/@morphcode%2Fcollections)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?logo=typescript&logoColor=white)](https://www.typescriptlang.org/)
[![Node.js](https://img.shields.io/badge/Node.js-43853D?logo=node.js&logoColor=white)](https://nodejs.org/)
![npm downloads](https://img.shields.io/npm/dm/@morphcode/collections)
![Build Status](https://img.shields.io/badge/status-beta-orange)

> 📦 A modern, high-performance data structures library for JavaScript and TypeScript — inspired by Python's `collections` module.

---

## 🚀 Why `@morphcode/collections`?

When working on complex frontends or backend systems, sometimes native JS structures just aren't enough. This library provides powerful, optimized, and type-safe implementations of:

- Counters (multisets)
- Heaps
- Double-ended queues (Deque)
- Ordered dictionaries
- Default dictionaries

Useful for frequency analysis, caching, prioritization, buffers, and more.

---

## ✨ Features

- 🧠 **Python-Inspired API** — Familiar for developers coming from Python
- ⚡ **High Performance** — O(1) operations where possible
- 🧪 **100% Test Coverage** — Fully tested with Jest
- 🔐 **Full TypeScript Support** — Zero `any`, full intellisense
- 📦 **Tree-shakeable** — Import only what you use
- 🌐 **Cross-platform** — Works in Node.js, browsers, Deno

---

## 📦 Installation

```bash
npm install @morphcode/collections
# or
yarn add @morphcode/collections
````

## 🏗️ Available Data Structures

| Structure     | Description                          | Use Cases                                    |
| ------------- | ------------------------------------ | -------------------------------------------- |
| `Counter`     | Multiset with element counting       | Word frequency, statistics, mode calculation |
| `Deque`       | Double-ended queue                   | Sliding windows, undo/redo, carousels        |
| `OrderedDict` | Key-value store with insertion order | LRU cache, event history                     |
| `Heap`        | Binary heap (min/max configurable)   | Priority queues, task scheduling             |
| `DefaultDict` | Dict with default value factory      | Grouping, aggregation                        |


## 📖 Usage Examples

### 🧮 Counter

```ts
import { Counter } from '@morphcode/collections';

const counter = new Counter('abracadabra'); // { a: 5, b: 2, r: 2, c: 1, d: 1 }
console.log(counter.mostCommon(2)); // [['a', 5], ['b', 2]]

const counter2 = new Counter(counter); // { a: 5, b: 2, r: 2, c: 1, d: 1 }
counter2.add('a') // a = 6

counter2.add('a', -1) // a = 5

counter2.get('a') // 5

counter2.has('a') // true

counter.equals(counter2) // false

```

### 🔁 Deque (Double-ended Queue)

```ts
import { Deque } from '@morphcode/collections';

const buffer = new Deque<number>();
buffer.push(1).push(2).push(3);
buffer.popLeft(); // 1

// Useful for sliding window problems
function movingAverage(stream: number[], windowSize: number): number[] {
  const result: number[] = [];
  const window = new Deque<number>();
  let sum = 0;

  for (const num of stream) {
    window.push(num);
    sum += num;

    if (window.length > windowSize) {
      sum -= window.popLeft()!;
    }

    if (window.length === windowSize) {
      result.push(sum / windowSize);
    }
  }

  return result;
}
```

### 🗂️ OrderedDict

```ts
import { OrderedDict } from '@morphcode/collections';

const od = new OrderedDict<string, number>();
od.setItem('a', 1);
od.setItem('b', 2);
od.setItem('c', 3);

console.log([...od]); // [['a',1], ['b',2], ['c',3]]
od.moveToEnd('a', false); // Move 'a' to the start
```


### ⛏️ Heap (Min/Max)

```ts
import { Heap } from '@morphcode/collections';

const heap = new Heap<number>([5, 2, 10]); // min-heap by default
heap.push(15)

console.log(heap.pop()); // 2
console.log(heap.peek()); // 5
```

and you can use static methods too.

```ts
import { heapq } from '@morphcode/collections';

let heap = [5, 2, 10, 15]

heapq.heapify(heap) // min-heap by default
heapq.heapPush(heap, 5)

heapq.heapPop(heap) // 2
```
### 🛠️ DefaultDict

```ts
import { DefaultDict } from '@morphcode/collections';

const dd = new DefaultDict<string, number>(() => 0);

dd.set('a', dd.get('a') + 1);
dd.set('b', dd.get('b') + 1);
dd.set('a', dd.get('a') + 1);

console.log(dd.get('a')); // 2

const dd2 = new DefaultDict<string, number[]>(() => []);

dd2.get('a').push(2) // { a: [2] }
dd2.get('a').push(4) // { a: [2, 3] }

dd2.set('a', [1]) // { a: [1] }
```

## 🧠 Advanced Use Cases

* **Sliding window carousels** (with `Deque`)
* **Real-time frequency counters** (with `Counter`)
* **Task scheduling or game AI** (with `Heap`)
* **Custom LRU cache** (with `OrderedDict`)
* **Grouping logs by level** (with `DefaultDict`)


## 🧪 Development

```bash
npm run build             # Build full library
npm run test              # Run test suite
npm run test:coverage     # Show test coverage
npm run docs              # Generate TypeDoc documentation
```


## 📄 License

MIT © [Aníbal Laura](https://github.com/morphcode-io)

---

## 🙌 Acknowledgements

* Inspired by Python's `collections` module
* Built with ❤️ using TypeScript and Node.js

---

## 💬 Contribute

Pull requests, issues, and stars are always welcome.
Check the [Contributing Guide](CONTRIBUTING.md) to get started.

---

> **Made with ❤️ by [@morphcode-io](https://github.com/morphcode-io)** — Happy coding!

