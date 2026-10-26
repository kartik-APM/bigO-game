/**
 * Decorative assembly for the opening: outlined geometric pieces with hard
 * offset shadows. The violet ring nods to the "O" in Big O. Hidden from
 * assistive technology; it carries no content.
 */
export function Shapes() {
  const ink = 'var(--dp-color-outline)';
  const stroke = { stroke: ink, strokeWidth: 3, strokeLinejoin: 'round' as const };
  return (
    <svg className="shapes" viewBox="0 0 440 400" aria-hidden="true" focusable="false">
      {/* amber arch, back left */}
      <path d="M38 352 V250 a86 86 0 0 1 172 0 V352 Z" fill={ink} transform="translate(9 9)" />
      <path d="M38 352 V250 a86 86 0 0 1 172 0 V352 Z" fill="var(--dp-color-accent-warm)" {...stroke} />
      <path d="M86 352 V258 a38 38 0 0 1 76 0 V352" fill="var(--dp-color-panel)" {...stroke} />

      {/* violet ring, the "O" */}
      <circle cx="252" cy="178" r="118" fill={ink} transform="translate(10 10)" />
      <circle cx="252" cy="178" r="118" fill="var(--dp-color-accent)" {...stroke} />
      <circle cx="252" cy="178" r="56" fill="var(--dp-color-ground)" {...stroke} />

      {/* pink triangle, top right */}
      <path d="M352 22 L426 140 H278 Z" fill={ink} transform="translate(8 8)" />
      <path d="M352 22 L426 140 H278 Z" fill="var(--dp-color-accent-secondary)" {...stroke} />

      {/* mint block, bottom right */}
      <rect x="262" y="276" width="150" height="96" rx="17" fill={ink} transform="translate(9 9)" />
      <rect x="262" y="276" width="150" height="96" rx="17" fill="var(--dp-color-accent-fresh)" {...stroke} />
      <path d="M292 324 H382" stroke={ink} strokeWidth="3" strokeLinecap="round" strokeDasharray="2 14" />

      {/* small pieces */}
      <circle cx="74" cy="92" r="20" fill="var(--dp-color-accent-fresh)" {...stroke} />
      <rect x="128" y="34" width="34" height="34" rx="6" fill="var(--dp-color-accent-warm)" {...stroke} transform="rotate(14 145 51)" />
      <circle cx="30" cy="176" r="9" fill={ink} />
    </svg>
  );
}
