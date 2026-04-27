/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { MusicPlayer } from './components/MusicPlayer';
import { SnakeGame } from './components/SnakeGame';

export default function App() {
  return (
    <div className="h-screen bg-[#050505] text-[#00FF00] flex flex-col font-sans overflow-hidden border-8 border-[#111] selection:bg-[#00FF00]/30">
      <header className="h-16 border-b border-[#00FF00]/30 flex items-center justify-between px-8 bg-black/50 backdrop-blur-sm z-10 shrink-0 w-full">
        <div className="flex items-center gap-4">
           <div className="w-3 h-3 rounded-full bg-[#00FF00] shadow-[0_0_10px_#00FF00]"></div>
           <h1 className="text-xl font-black tracking-tighter uppercase italic hidden sm:block">
            ANIRUDH SESSIONS // AAYA SHER
          </h1>
        </div>
        <div className="flex gap-4 sm:gap-8">
          <div className="text-right">
            <p className="text-[10px] uppercase opacity-50 font-mono">Game Session</p>
            <p className="text-sm sm:text-lg font-mono leading-none">ACTIVE_01</p>
          </div>
        </div>
      </header>

      {/* Main Game Screen */}
      <main className="flex-1 flex flex-col overflow-hidden bg-[radial-gradient(circle_at_center,_#111_0%,_#050505_100%)] relative">
        <div className="flex-1 overflow-auto flex flex-col items-center justify-center p-4">
          <SnakeGame />
        </div>
      </main>

      {/* Fixed Bottom Player */}
      <div className="h-24 bg-[#0a0a0a] border-t border-[#00FF00]/30 px-8 flex flex-col justify-center z-20 shrink-0 relative w-full">
        <MusicPlayer />
      </div>
    </div>
  );
}
