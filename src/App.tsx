import { useState, type ReactNode } from 'react';
import { useAuth } from './auth/AuthProvider';
import { CheatSheet } from './components/CheatSheet';
import { Footer, SessionBar } from './components/Chrome';
import { Command } from './components/Command';
import { Faq } from './components/Faq';
import { Game } from './components/Game';
import { Hero } from './components/Hero';
import { Leaderboard } from './components/Leaderboard';
import { Method } from './components/Method';
import { loadScores } from './lib/scores';

interface Section {
  id: string;
  name: string;
  summary?: string;
  body: ReactNode;
}

export default function App() {
  const [scores, setScores] = useState(loadScores);
  const { enabled: online } = useAuth();
  const best = scores[0]?.score ?? null;

  const sections: Section[] = [
    {
      id: 'play',
      name: 'play',
      summary: 'Pick a language and start a run. The clock tightens as you go.',
      body: <Game scores={scores} onScores={setScores} />,
    },
    ...(online
      ? [
          {
            id: 'leaderboard',
            name: 'leaderboard',
            summary: 'The top 10 ranked players. Each player’s best run counts once.',
            body: <Leaderboard />,
          },
        ]
      : []),
    {
      id: 'cheat-sheet',
      name: 'cheat sheet',
      summary: 'The nine classes the drill uses, from cheapest to most expensive.',
      body: <CheatSheet />,
    },
    {
      id: 'method',
      name: 'method',
      summary: 'A routine for reading a snippet in the seconds you have.',
      body: <Method />,
    },
    { id: 'faq', name: 'faq', body: <Faq /> },
  ];

  return (
    <div className="page">
      <a className="skip" href="#main">
        skip to content
      </a>
      <SessionBar />
      <main id="main">
        <Hero best={best} />
        {sections.map((s, i) => (
          <Command key={s.id} n={i + 1} id={s.id} name={s.name} summary={s.summary}>
            {s.body}
          </Command>
        ))}
      </main>
      <Footer />
    </div>
  );
}
