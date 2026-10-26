import type { ReactNode } from 'react';

interface Props {
  n: number;
  id: string;
  name: string;
  summary?: ReactNode;
  children: ReactNode;
}

export function Command({ n, id, name, summary, children }: Props) {
  return (
    <section className="cmd" id={id} aria-labelledby={`${id}-h`}>
      <span className="cmd__num" aria-hidden="true">
        {String(n).padStart(2, '0')}
      </span>
      <div className="cmd__body">
        <h2 id={`${id}-h`} className="cmd__line">
          {name}
        </h2>
        {summary && <p className="cmd__summary">{summary}</p>}
        <div className="cmd__out">{children}</div>
      </div>
    </section>
  );
}
