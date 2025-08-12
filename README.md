# @morphcode/collections

[![npm version](https://badge.fury.io/js/@morphcode%2Fcollections-js.svg)](https://badge.fury.io/js/@morphcode%2Fcollections)
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


## Installation

```bash
npm install @morphcode/collections
# or
yarn add @morphcode/collections
```

## Available Data Structures

| Structure     | Description                          | Use Cases                                    |
| ------------- | ------------------------------------ | -------------------------------------------- |
| `Counter`     | Multiset with element counting       | Word frequency, statistics, mode calculation |
| `Deque`       | Double-ended queue                   | Sliding windows, undo/redo, carousels        |
| `OrderedDict` | Key-value store with insertion order | LRU cache, event history                     |
| `Heap`        | Binary heap (min/max configurable)   | Priority queues, task scheduling             |
| `DefaultDict` | Dict with default value factory      | Grouping, aggregation                        |


## Usage Examples

### Counter

The `Counter` is a dictionary subclass for counting hashable objects.
It maps items (keys) to their counts (integer values) and provides convenient methods for counting, updating, and comparing.

```ts
import { Counter } from '@morphcode/collections';

const counter = new Counter('abracadabra'); 
// { a: 5, b: 2, r: 2, c: 1, d: 1 }

console.log(counter.mostCommon(2)); 
// [['a', 5], ['b', 2]]

const counter2 = new Counter(counter); 
// { a: 5, b: 2, r: 2, c: 1, d: 1 }

counter2.add('a');        // a = 6
counter2.add('a', -1);    // a = 5

counter2.get('a');        // 5
counter2.has('a');        // true

counter.equals(counter2); // false
```

#### API

* `new Counter()`
* `new Counter(Iterable items)`
* `add(dynamic key, int increment)` – Increments the count of `key` by `increment` (default: `1`).
* `get(dynamic key)` – Returns the count for `key` (default: `0` if not present).
* `get(dynamic key, int defaultValue)` – Returns the count or `defaultValue` if not present.
* `has(dynamic key)` – Checks if `key` exists in the counter.
* `subtract(Iterable items)` – Decrements counts based on items.
* `delete(dynamic key)` – Removes `key` entirely.
* `mostCommon(int n)` – Returns the `n` most common elements as `[key, count]` pairs.
* `update(Iterable items)` – Adds counts from the provided items.
* `equals(Iterable other)` – Checks if two counters are equal in keys and counts.
* `toArray()`
* `clear()`

### Deque (Double-ended Queue)

The implementation uses a **circular buffer** that is both **GC-friendly** and **CPU cache-friendly**.
More efficient than native JavaScript arrays for frequent insertions and removals at both ends.

```ts
import { Deque } from '@morphcode/collections';

const buffer = new Deque<number>([1, 2, 3, 4, 5]);

buffer.push(6);
buffer.popLeft(); // 1
buffer.pop();     // 6

buffer.size; // 4

buffer.get();    // 2, default index = 0
buffer.get(-1);  // 5, supports negative indices from the end
```

* `push`, `pushLeft`, `pop`, and `popLeft` run in constant time **O(1)**.
* Random access with `get` also runs in constant time **O(1)**.

#### API

* `new Deque()` – Creates an empty deque.
* `new Deque(Iterable items)` – Creates a deque pre-filled with the given items.
* `new Deque(int capacity)` – Creates a deque with a fixed initial capacity (auto-expands if needed).
* `push(dynamic item)` – Adds an item to the **right** end.
* `pushLeft(dynamic item)` – Adds an item to the **left** end.
* `pop()` – Removes and returns the item from the **right** end.
* `popLeft()` – Removes and returns the item from the **left** end.
* `get(int index)` – Returns the item at the given index (supports negative indexing).
* `extend(Iterable items)` – Appends multiple items to the **right** end.
* `extendLeft(Iterable items)` – Appends multiple items to the **left** end.
* `indexOf(dynamic item)` – Returns the index of the first occurrence of `item`, or `-1` if not found.
* `includes(dynamic item)` – Returns `true` if the deque contains `item`.
* `toArray()` – Returns the deque contents as a plain array.
* `clear()` – Removes all items from the deque.

### OrderedDict

An **OrderedDict** works like a regular JavaScript `Map` but preserves the insertion order of keys and provides additional ordering operations.

```ts
import { OrderedDict } from '@morphcode/collections';

const od = new OrderedDict<string, number>();
od.setItem('a', 1);
od.setItem('b', 2);
od.setItem('c', 3);

console.log([...od]); 
// [['a', 1], ['b', 2], ['c', 3]]

od.moveToEnd('c', false); 
// Moves 'c' to the start. 
// By default, moveToEnd('c') moves it to the end.

console.log([...od]); 
// [['c', 3], ['a', 1], ['b', 2]]

od.popItem(); 
// ['b', 2] — by default removes and returns the last item.

od.popItem(false); 
// ['c', 3] — removes and returns the first item.
```

#### API

* `new OrderedDict()`
* `new OrderedDict(Iterable<[K, V]> items)`
* `getItem(dynamic key, dynamic defaultValue)` – Returns the value for `key`, or `defaultValue` if not found.
* `setItem(dynamic key, dynamic value)` – Sets a key/value pair, preserving order.
* `deleteItem(dynamic key)` – Removes a key/value pair and returns [key, value].
* `hasItem(dynamic key)` – Checks if `key` exists.
* `moveToEnd(dynamic key, bool last = true)` – Moves a key to the end (`last = true`) or to the start (`last = false`).
* `popItem(bool last = true)` – Removes and returns the last item (`last = true`) or the first item (`last = false`).
* `update(Iterable<[K, V]> items)` – Updates from another iterable of key/value pairs.
* `toArray()` – Returns the contents as an array of `[key, value]` pairs.
* `clear()` – Removes all items.

### Heap (Min/Max)

A **Heap** is a specialized tree-based data structure that satisfies the heap property:

* **Min-heap** (default): the smallest element is always at the top.
* **Max-heap**: the largest element is always at the top (requires a custom comparator).

```ts
import { Heap } from '@morphcode/collections';

const minheap = new Heap<number>([5, 2, 10]); // Min-heap by default
minheap.push(15);
// [2, 5, 10, 15]

console.log(minheap.pop());    // 2
console.log(minheap.peek());   // 5

console.log(minheap.nsmallest(1)); // [5]
console.log(minheap.nlargest(1));  // [15]
```

You can also create **max-heaps** or use a **custom comparator**:

```ts
import { Heap } from '@morphcode/collections';

const maxheap = new Heap<{id: number; name: string}>(
    [
        { id: 1, name: "user1" },
        { id: 2, name: "user2" },
        { id: 3, name: "user3" }
    ],
    (a, b) => b.id - a.id // Max-heap based on `id`
);

maxheap.push({ id: 4, name: "user4" });

console.log(maxheap.pop());       // { id: 4, name: "user4" }
console.log(maxheap.peek());      // { id: 3, name: "user3" }

console.log(maxheap.nsmallest(1)); // [{ id: 1, name: "user1" }]
console.log(maxheap.nlargest(1));  // [{ id: 4, name: "user4" }]
```

You can also use **static helper methods** via `heapq`:

```ts
import { heapq } from '@morphcode/collections';

let heap = [5, 2, 10, 15, 32, 52, 100];

heapq.heapify(heap);        // Min-heap by default
heapq.heapPush(heap, 5);

heapq.heapPop(heap);        // 2

heapq.heapPushPop(heap, 1); // Push and pop in one step

heapq.nsmallest(3, heap);   // [1, 5, 10]
heapq.nlargest(3, heap);    // [100, 52, 32]
```

#### API

**Heap Instance Methods**

* `new Heap()`
* `new Heap(Iterable items, Comparator compareFn)`
* `push(Dynamic item)` – Adds an item to the heap.
* `pop()` – Removes and returns the top element.
* `peek(int index)` – Returns the element at `index` (default: top) without removing it.
* `replace(Dynamic item)` – Pops the top element and pushes a new item in one operation.
* `pushPop(Dynamic item)` – Pushes a new item and pops the smallest/largest element.
* `heapify(Array items)` – Builds the heap from the current items or a provided array.
* `sort()` – Returns a sorted array of heap elements.
* `nsmallest(int n)` – Returns the `n` smallest elements.
* `nlargest(int n)` – Returns the `n` largest elements.

**Static `heapq` Methods**

* `heapify(Array items)`
* `heapPush(Array items, Dynamic item)`
* `heapPop(Array items)`
* `heapPushPop(Array items, Dynamic item)`
* `nsmallest(int n, Array items)`
* `nlargest(int n, Array items)`

### 🛠️ DefaultDict

A **DefaultDict** works like a regular `Map`, but when you try to access a missing key, it automatically creates and stores a default value using a factory function. This makes it especially useful for counting, grouping, or accumulating values without having to manually check if a key exists.

```ts
import { DefaultDict } from '@morphcode/collections';

// Example with numbers
const dd = new DefaultDict<string, number>(() => 0);

dd.set('a', dd.get('a') + 1);
dd.set('b', dd.get('b') + 1);
dd.set('a', dd.get('a') + 1);

console.log(dd.get('a')); // 2

// Example with arrays
const dd2 = new DefaultDict<string, number[]>(() => []);

dd2.get('a').push(2); // { a: [2] }
dd2.get('a').push(4); // { a: [2, 4] }

dd2.set('a', [1]);    // { a: [1] }
```

#### API

* `new DefaultDict(factoryFn)` – Creates a new `DefaultDict` where `factoryFn` returns the default value for missing keys.
* `get(dynamic key, dynamic defaultValue?)` – Returns the value for `key`. If not found, returns the default value from the factory function (or `defaultValue` if provided).
* `set(dynamic key, dynamic value)` – Sets a key/value pair.
* `delete(dynamic key)` – Removes a key and its value.
* `has(dynamic key)` – Checks if `key` exists.
* `pop(dynamic key)` – Deletes and returns the value for `key` if it exists, otherwise returns `undefined`.

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

