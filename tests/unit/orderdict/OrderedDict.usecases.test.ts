import { OrderedDict } from "../../../src";

describe('OrderedDict use cases', () => {
    let dict: OrderedDict<string, number>;

    beforeEach(()=>{
        dict = new OrderedDict<string, number>();
    });

    describe('LRU Cache', () => {
        class LRUCache {
            cache: OrderedDict<string, number>;
            capacity: number;

            constructor(capacity: number) {
                this.capacity = capacity;
                this.cache = new OrderedDict<string, number>();
            }

            get(key: string): number | undefined {
                if (this.cache.hasItem(key)) {
                    const value = this.cache.getItem(key);
                    this.cache.moveToEnd(key, false);
                    return value;
                }
                return undefined;
            }

            set(key: string, value: number): void {
                if (this.cache.hasItem(key)) {
                    this.cache.moveToEnd(key);
                } else {
                    if (this.cache.size >= this.capacity) {
                        this.cache.popItem();
                    }
                    this.cache.moveToEnd(key, false);
                }
                this.cache.setItem(key, value);
            }
        };
        test('should cache items and evict least recently used', () => {
            const lru = new LRUCache(2);
            lru.set('a', 1);
            lru.set('b', 2);
            expect(lru.get('a')).toBe(1);
            expect(lru.get('b')).toBe(2);

            lru.set('c', 3); // Evicts 'b'
            expect(lru.get('a')).toBeUndefined();
            expect(lru.get('c')).toBe(3);

            lru.set('a', 4); // Updates 'a'
            expect(lru.get('a')).toBe(4);
        });
        test('should maintain order of recently used items', () => {
            const lru = new LRUCache(3);
            lru.set('a', 1);
            lru.set('b', 2);
            lru.set('c', 3);
            expect(lru.get('a')).toBe(1);
            expect(lru.get('b')).toBe(2);
            expect(lru.get('c')).toBe(3);

            lru.get('a'); // Access 'a' to make it most recently used
            lru.set('d', 4); // Evicts 'b'
            expect(lru.get('b')).toBeUndefined();
            expect(lru.get('a')).toBe(1);
            expect(lru.get('c')).toBe(3);
            expect(lru.get('d')).toBe(4);
        });
    });
    
});