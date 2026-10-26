const GLYPHS: Record<string, string[]> = {
  B: ['#### ', '#   #', '#### ', '#   #', '#### '],
  I: ['###', ' # ', ' # ', ' # ', '###'],
  G: [' ####', '#    ', '#  ##', '#   #', ' ####'],
  O: [' ### ', '#   #', '#   #', '#   #', ' ### '],
  ' ': ['  ', '  ', '  ', '  ', '  '],
};

function render(text: string) {
  const chars = [...text.toUpperCase()].filter((c) => GLYPHS[c]);
  return GLYPHS.B.map((_, row) => chars.map((c) => GLYPHS[c][row]).join(' ')).join('\n');
}

/** Character-built wordmark spelling the product name; decorative, the h1 carries the name. */
export function Wordmark({ text }: { text: string }) {
  return (
    <pre className="wordmark" aria-hidden="true">
      {render(text)}
    </pre>
  );
}
