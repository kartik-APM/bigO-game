const STEPS = [
  {
    title: 'Decide what n is.',
    body: 'Usually it is the length of the input. It can also be the value of a number (prime checks), the side of a grid, or an exponent. If you get n wrong, every count after it is off.',
  },
  {
    title: 'Watch how the loop variable moves.',
    body: 'Adding 1 up to n is linear. Doubling, or halving n, is logarithmic. A condition like i * i <= n gives a square root. A fixed bound like 100 is constant, however big it looks.',
  },
  {
    title: 'Multiply nested loops; add sequential ones.',
    body: 'A loop inside a loop multiplies the counts. Loops one after another add up, and only the largest term is kept.',
  },
  {
    title: 'Count total movement, not loop shapes.',
    body: 'An inner pointer that never resets (two pointers, run skipping, a monotonic stack) moves at most n times across the whole outer loop. That keeps the total linear.',
  },
  {
    title: 'Open up library calls.',
    body: 'Sorting is n log n. Membership on a list (in, includes, contains, std::find) is a linear scan. Slicing, repeating a string and removing from the front all copy. One line can hide a whole loop.',
  },
  {
    title: 'For recursion, count branches and depth.',
    body: 'Multiply the calls each frame makes, raised to the depth of the tree, by the work per call. Memoisation caps the total at the number of distinct arguments.',
  },
  {
    title: 'Answer for the worst case.',
    body: 'Unless a snippet says otherwise, the drill wants the worst case. Hash operations count as average O(1), and arithmetic on numbers counts as O(1).',
  },
];

export function Method() {
  return (
    <ol className="steps">
      {STEPS.map((s, i) => (
        <li key={s.title}>
          <span className="steps__n" aria-hidden="true">
            {String(i + 1).padStart(2, '0')}
          </span>
          <div>
            <h3 className="steps__title">{s.title}</h3>
            <p className="muted">{s.body}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
