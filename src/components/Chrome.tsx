const SECTIONS = [
  { href: '#play', label: 'play' },
  { href: '#cheat-sheet', label: 'cheat sheet' },
  { href: '#method', label: 'method' },
  { href: '#faq', label: 'faq' },
];

export function BracketLink({ href, label }: { href: string; label: string }) {
  return (
    <a className="blink" href={href}>
      <span aria-hidden="true">[</span>
      {label}
      <span aria-hidden="true">]</span>
    </a>
  );
}

export function SessionBar() {
  return (
    <header className="bar">
      <a className="bar__name" href="#title">
        bigo-drill
      </a>
      <nav aria-label="sections">
        <ul className="bar__nav">
          {SECTIONS.map((s) => (
            <li key={s.href}>
              <BracketLink {...s} />
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}

export function Footer() {
  return (
    <footer className="foot">
      <span className="cmd__num" aria-hidden="true" />
      <div className="foot__dirs">
        <div>
          <h2 className="foot__head">./sections</h2>
          <ul>
            {SECTIONS.map((s) => (
              <li key={s.href}>
                <BracketLink {...s} />
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="foot__head">./notes</h2>
          <ul className="muted">
            <li>Scores are stored in this browser only.</li>
            <li>C++ and Java snippets are bare functions; includes, imports and using std are omitted.</li>
            <li>Set in IBM Plex Mono (SIL Open Font License).</li>
          </ul>
        </div>
      </div>
    </footer>
  );
}
