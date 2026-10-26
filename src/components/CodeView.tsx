interface Props {
  code: string;
  lang: string;
}

export function CodeView({ code, lang }: Props) {
  const lines = code.split('\n');
  return (
    <figure className="code">
      <figcaption className="code__cap">
        <span>{lang}</span>
        <span>{lines.length} lines</span>
      </figcaption>
      <pre className="code__src" tabIndex={0} aria-label={`${lang} snippet`}>
        <code>
          {lines.map((line, i) => {
            // hanging indent keeps wrapped continuations under their own code, not at column 0
            const hang = `${(line.length - line.trimStart().length) + 2}ch`;
            return (
              <span className="code__row" key={i}>
                <span className="code__ln" aria-hidden="true">
                  {i + 1}
                </span>
                <span className="code__text" style={{ paddingLeft: hang, textIndent: `-${hang}` }}>
                  {line}
                  {'\n'}
                </span>
              </span>
            );
          })}
        </code>
      </pre>
    </figure>
  );
}
