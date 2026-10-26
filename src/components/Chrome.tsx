import { displayName, useAuth } from '../auth/AuthProvider';

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

function BracketButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" className="blink blink--button" onClick={onClick}>
      <span aria-hidden="true">[</span>
      {label}
      <span aria-hidden="true">]</span>
    </button>
  );
}

function Account() {
  const { enabled, user, error, signIn, signOut } = useAuth();
  if (!enabled) return null;
  return (
    <div className="bar__account">
      {user ? (
        <>
          <span className="muted">{displayName(user)}</span>
          <BracketButton label="sign out" onClick={signOut} />
        </>
      ) : (
        <BracketButton label="sign in with google" onClick={signIn} />
      )}
      {error && (
        <p className="bar__error" role="status">
          {error}
        </p>
      )}
    </div>
  );
}

export function SessionBar() {
  return (
    <header className="bar">
      <a className="bar__name" href="#title">
        bigo-drill
      </a>
      <div className="bar__right">
        <nav aria-label="sections">
          <ul className="bar__nav">
            {SECTIONS.map((s) => (
              <li key={s.href}>
                <BracketLink {...s} />
              </li>
            ))}
          </ul>
        </nav>
        <Account />
      </div>
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
