import { Counter } from '../../../src';

describe('Counter Use Cases', () => {
    let counter: Counter<string>;

    beforeEach(() => {
        counter = new Counter<string>();
    });

    test('First Unique Character in a String', () =>{
        const findFirstUniqueChar = (str: string) => {
            const charCounter = new Counter<string>(str);            
            for (const char of str) {
                if (charCounter.get(char) === 1) {
                    return char;
                }
            }
            return null;
        };

        expect(findFirstUniqueChar('abacabad')).toBe('c');
        expect(findFirstUniqueChar('aabbcc')).toBe(null);
    });

    test('Top K Frequent Elements', () => {
        const topKFrequent = (nums: number[], k: number) => {
            const numCounter = new Counter<number>(nums);
            return numCounter.mostCommon(k).map(([num]) => num);
        };

        expect(topKFrequent([1, 1, 1, 2, 2, 3], 2)).toEqual([1, 2]);
        expect(topKFrequent([1], 1)).toEqual([1]);
    });
});
