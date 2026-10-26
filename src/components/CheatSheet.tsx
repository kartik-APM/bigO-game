import { COMPLEXITIES } from '../data/complexities';
import { SNIPPETS } from '../data/snippets';

const countFor = (id: string) => SNIPPETS.filter((s) => s.answer === id).length;

export function CheatSheet() {
  return (
    <>
      <ol className="classes">
        {COMPLEXITIES.map((c) => (
          <li key={c.id}>
            <div className="classes__id">
              <span className="classes__notation">{c.id}</span>
              <span className="classes__name">{c.name}</span>
            </div>
            <div className="classes__out">
              <p>{c.note}</p>
              <dl className="classes__facts">
                <div>
                  <dt>when n doubles</dt>
                  <dd>{c.doubling}</dd>
                </div>
                <div>
                  <dt>steps at n = 1,024</dt>
                  <dd>{c.ops}</dd>
                </div>
                <div>
                  <dt>seen in</dt>
                  <dd>{c.example}</dd>
                </div>
                <div>
                  <dt>in the drill</dt>
                  <dd>{countFor(c.id)} snippets</dd>
                </div>
              </dl>
            </div>
          </li>
        ))}
      </ol>
      <p className="note muted">
        Step counts use log base 2 and drop constants. They show the shape of growth, not the
        exact number of operations.
      </p>
    </>
  );
}
