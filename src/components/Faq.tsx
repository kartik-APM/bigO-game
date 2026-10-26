const QUESTIONS = [
  {
    q: 'What does Big O actually measure?',
    a: 'It gives an upper bound on how an algorithm’s cost grows as the input grows. It ignores the machine, the language and constant factors, so it tells you how something scales, not how many milliseconds it takes.',
  },
  {
    q: 'Is O(1) always faster than O(n)?',
    a: 'No. An O(1) operation with a large constant can lose to an O(n) loop over a small input. Big O describes the trend as n grows. For small inputs, the constants often decide.',
  },
  {
    q: 'Why are constants and smaller terms dropped?',
    a: 'As n grows, the largest term outgrows everything else. 3n² + 50n + 7 behaves like n² for large inputs. A constant factor depends more on hardware and implementation than on the algorithm itself.',
  },
  {
    q: 'What is the difference between time and space complexity?',
    a: 'Time complexity counts steps. Space complexity counts extra memory, including the call stack. A recursive sum is O(n) in time and O(n) in stack space; the plain loop version needs only O(1) space.',
  },
  {
    q: 'How do Big O, Big Θ and Big Ω differ?',
    a: 'O is an upper bound, Ω is a lower bound, and Θ is both at once, a tight bound. In interviews, "Big O" is usually used loosely to mean the tight worst-case bound.',
  },
  {
    q: 'What does amortised O(1) mean?',
    a: 'Some operations are occasionally expensive, such as a dynamic array doubling its storage. But the total cost of a long sequence, divided by the number of operations, stays constant. Appending to a list is the classic example.',
  },
  {
    q: 'Why is naive Fibonacci filed under O(2ⁿ) if it is not exactly 2ⁿ?',
    a: 'The call tree is lopsided: one branch is n − 1 deep and the other n − 2. The count grows like φⁿ ≈ 1.618ⁿ. That is still exponential, and 2ⁿ is a valid upper bound, so the drill files it there.',
  },
];

export function Faq() {
  return (
    <div className="faq">
      {QUESTIONS.map((item) => (
        <details key={item.q}>
          <summary>
            <span className="faq__q">{item.q}</span>
          </summary>
          <p className="faq__a">{item.a}</p>
        </details>
      ))}
    </div>
  );
}
