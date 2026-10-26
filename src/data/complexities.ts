import type { ComplexityId } from './types';

export interface ComplexityInfo {
  id: ComplexityId;
  name: string;
  doubling: string;
  example: string;
  ops: string;
  note: string;
}

export const COMPLEXITIES: ComplexityInfo[] = [
  {
    id: 'O(1)',
    name: 'constant',
    doubling: 'no change',
    example: 'array index, push to a stack, hash lookup',
    ops: '1',
    note: 'The work does not depend on n. It can still be slow; it just never gets slower.',
  },
  {
    id: 'O(log n)',
    name: 'logarithmic',
    doubling: 'one more step',
    example: 'binary search, balanced tree lookup',
    ops: '10',
    note: 'Each step removes a fixed fraction of what is left. A billion items take about 30 steps.',
  },
  {
    id: 'O(√n)',
    name: 'square root',
    doubling: 'about × 1.4',
    example: 'trial-division prime check, jump search',
    ops: '32',
    note: 'Usually shows up as a loop that stops once i × i passes n.',
  },
  {
    id: 'O(n)',
    name: 'linear',
    doubling: '× 2',
    example: 'one pass, linear search, summing a list',
    ops: '1,024',
    note: 'Each item is handled a bounded number of times. Often optimal when every item must be read.',
  },
  {
    id: 'O(n log n)',
    name: 'linearithmic',
    doubling: 'a little over × 2',
    example: 'merge sort, heapsort, sort-then-scan',
    ops: '10,240',
    note: 'The lower bound for comparison sorting. If a solution starts by sorting, this is usually its cost.',
  },
  {
    id: 'O(n²)',
    name: 'quadratic',
    doubling: '× 4',
    example: 'checking every pair, bubble sort',
    ops: '1,048,576',
    note: 'Fine for a few thousand items. Noticeably slow somewhere past 100,000.',
  },
  {
    id: 'O(n³)',
    name: 'cubic',
    doubling: '× 8',
    example: 'triple nested loops, schoolbook matrix multiply',
    ops: '≈ 1.07 billion',
    note: 'Practical only for small inputs, roughly a few hundred items.',
  },
  {
    id: 'O(2ⁿ)',
    name: 'exponential',
    doubling: 'the work is squared',
    example: 'every subset, naive recursive Fibonacci',
    ops: '≈ 1.8 × 10^308',
    note: 'One more item doubles the work. Overlapping subproblems are a hint to memoise.',
  },
  {
    id: 'O(n!)',
    name: 'factorial',
    doubling: 'worse than squared',
    example: 'every ordering, brute-force route planning',
    ops: '≈ 5.4 × 10^2639',
    note: 'Past about a dozen items, no hardware finishes in a lifetime.',
  },
];
