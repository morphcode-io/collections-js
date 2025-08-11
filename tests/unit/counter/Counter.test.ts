import { Counter } from '../../../src/index';

describe('Counter', () => {
  let counter = new Counter<string>();
  
  beforeEach(() => {
    counter = new Counter<string>();
  });

  describe('Basic Operations', () => {
    it('should start empty', () => {
      expect(counter.isEmpty).toBe(true);
      expect(counter.size).toBe(0);
      expect(counter.total).toBe(0);
    });

    it('should add elements', () => {
      counter.add('a');
      expect(counter.get('a')).toBe(1);
      for (let i = 0; i < 100; i++) {
        counter.add('b');
      }
      expect(counter.get('b')).toBe(100);
      expect(counter.size).toBe(2);
      expect(counter.total).toBe(101);
    });

    it('should add multiple counts', () => {
      counter.add('a', 5).add('b', 3);
      expect(counter.get('a')).toBe(5);
      expect(counter.size).toBe(2);
      expect(counter.total).toBe(8);
    });

    it('should subtract elements', () => {
      counter.add('a', 5);
      counter.subtract('aa');
      expect(counter.get('a')).toBe(3);
      expect(counter.total).toBe(3);
    });

    test('should handle subtract a Counter', () => {
      const otherCounter = new Counter<string>('aab');
      counter.add('a', 5);
      counter.subtract(otherCounter);
      expect(counter.get('a')).toBe(3);
      expect(counter.get('b')).toBe(-1);
      expect(counter.total).toBe(2);
    });

    it('should remove elements when count reaches zero', () => {
      counter.add('a', 3);
      counter.subtract(new Counter<string>('aaa'));
      expect(counter.has('a')).toBe(true);
      expect(counter.size).toBe(1);
    });

    it('should delete elements completely', () => {
      counter.add('a', 5);
      expect(counter.delete('a')).toBe(true);
      expect(counter.has('a')).toBe(false);
      expect(counter.total).toBe(0);
    });
  });

  describe('Construction from iterable', () => {
    it('should initialize from array', () => {
      const c = new Counter(['a', 'b', 'a', 'c', 'b', 'a']);
      expect(c.get('a')).toBe(3);
      expect(c.get('b')).toBe(2);
      expect(c.get('c')).toBe(1);
      expect(c.total).toBe(6);
      expect(c.size).toBe(3);
    });
    it('should initialize from string', () => {
      const c = new Counter('hello');
      expect(c.get('l')).toBe(2);
      expect(c.get('h')).toBe(1);
      expect(c.get('e')).toBe(1);
      expect(c.get('o')).toBe(1);
    });
  });

  describe('Most Common', () => {
    beforeEach(() => {
      counter.update(['a', 'b', 'a', 'c', 'b', 'a']);
    });
    test('should return most common items', () => {
      const common = counter.mostCommon(2);
      expect(common).toEqual([
        ['a', 3],
        ['b', 2],
      ]);
    });
    test('should return all items if n is not specified', () => {
      const common = counter.mostCommon();
      expect(common).toEqual([
        ['a', 3],
        ['b', 2],
        ['c', 1],
      ]);
    });
    test('should return empty array if n is zero', () => {
      const common = counter.mostCommon(0);
      expect(common).toEqual([]);
    });
    test('should return empty array if n is negative', () => {
      const common = counter.mostCommon(-1);
      expect(common).toEqual([]);
    });
  });

  describe('Equality', () => {
    it('should be equal to another Counter with same items', () => {
      const c1 = new Counter(['a', 'b', 'a']);
      const c2 = new Counter(['a', 'b']);
      expect(c1.equals(c2)).toBe(false);// Because c1 has 'a' twice
      c2.add('a'); // Now c2 has 'a' twice
      expect(c1.equals(c2)).toBe(true);
    });

    it('should not be equal to a different Counter', () => {
      const c1 = new Counter(['a', 'b']);
      const c2 = new Counter(['a', 'c']);
      expect(c1.equals(c2)).toBe(false);
    });

    it('should be equal to a Map with same items', () => {
      const c = new Counter(['a', 'b', 'a']);
      const map = new Map([['a', 2], ['b', 1]]);
      expect(c.equals(map)).toBe(true);
    });

    it('should not be equal to a Map with different items', () => {
      const c = new Counter(['a', 'b']);
      const map = new Map([['a', 1], ['c', 1]]);
      expect(c.equals(map)).toBe(false);
    });

    it('should be equal to an iterable with same items', () => {
      const c = new Counter(['a', 'b', 'a']);
      const iterable = ['a', 'b'];
      expect(c.equals(iterable)).toBe(false); // Because c has 'a' twice
      iterable.push('a'); // Now iterable has 'a' twice
      expect(c.equals(iterable)).toBe(true);
    });
  });
});
