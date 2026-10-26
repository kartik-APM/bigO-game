import { useState } from 'react';
import { CheatSheet } from './components/CheatSheet';
import { Footer, SessionBar } from './components/Chrome';
import { Command } from './components/Command';
import { Faq } from './components/Faq';
import { Game } from './components/Game';
import { Hero } from './components/Hero';
import { Method } from './components/Method';
import { loadScores } from './lib/scores';

export default function App() {
  const [scores, setScores] = useState(loadScores);
  const best = scores[0]?.score ?? null;

  return (
    <div className="page">
      <a className="skip" href="#main">
        skip to content
      </a>
      <SessionBar />
      <main id="main">
        <Hero best={best} />
        <Command
          n={1}
          id="play"
          name="play"
          summary="Pick a language and start a run. The clock tightens as you go."
        >
          <Game scores={scores} onScores={setScores} />
        </Command>
        <Command
          n={2}
          id="cheat-sheet"
          name="cheat sheet"
          summary="The nine classes the drill uses, from cheapest to most expensive."
        >
          <CheatSheet />
        </Command>
        <Command
          n={3}
          id="method"
          name="method"
          summary="A routine for reading a snippet in the seconds you have."
        >
          <Method />
        </Command>
        <Command n={4} id="faq" name="faq">
          <Faq />
        </Command>
      </main>
      <Footer />
    </div>
  );
}
