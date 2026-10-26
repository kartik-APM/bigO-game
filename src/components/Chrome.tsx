import { displayName, useAuth } from '../auth/AuthProvider';

const BASE_SECTIONS = [
  { href: '/play', label: 'play' },
  { href: '/cheat-sheet', label: 'cheat sheet' },
  { href: '/method', label: 'method' },
  { href: '/faq', label: 'faq' },
];

/** Section links; the leaderboard only exists when Supabase is configured. */
function useSections() {
  const { enabled } = useAuth();
  return enabled
    ? [BASE_SECTIONS[0], { href: '/leaderboard', label: 'leaderboard' }, ...BASE_SECTIONS.slice(1)]
    : BASE_SECTIONS;
}

export function BracketLink({ href, label }: { href: string; label: string }) {
  return (
    <a className="blink" href={href}>
      {label}
    </a>
  );
}

function BracketButton({ label, onClick }: { label: string; onClick: () => void }) {
  return (
    <button type="button" className="blink blink--button" onClick={onClick}>
      {label}
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
  const sections = useSections();
  return (
    <header className="bar">
      <a className="bar__name" href="/">
        bigo-drill
      </a>
      <div className="bar__right">
        <nav aria-label="sections">
          <ul className="bar__nav">
            {sections.map((s) => (
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
  const sections = useSections();
  return (
    <div className="cover">
    <footer className="foot">
      <div className="foot__dirs">
        <div>
          <h2 className="foot__head">sections</h2>
          <ul>
            {sections.map((s) => (
              <li key={s.href}>
                <BracketLink {...s} />
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h2 className="foot__head">notes</h2>
          <ul className="muted">
            <li>Scores are stored in this browser only.</li>
            <li>C++ and Java snippets are bare functions; includes, imports and using std are omitted.</li>
            <li>Set in Host Grotesk and Instrument Sans, with code in IBM Plex Mono (SIL Open Font License).</li>
          </ul>
        </div>
      </div>
    </footer>
    </div>
  );
}
