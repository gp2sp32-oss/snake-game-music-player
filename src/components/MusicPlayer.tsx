import { useState } from 'react';
import { Music, Plus, Check } from 'lucide-react';

export function MusicPlayer() {
  // Try to default to Anirudh Ravichander artist embed to ensure plenty of hits like Aaya Sher
  const [spotifyUrl, setSpotifyUrl] = useState("https://open.spotify.com/artist/4zCH9qm4R2DADamUHMCa6O");
  const [embedUrl, setEmbedUrl] = useState("https://open.spotify.com/embed/artist/4zCH9qm4R2DADamUHMCa6O?utm_source=generator&theme=0");
  const [isInputOpen, setIsInputOpen] = useState(false);

  const handleApplyLink = () => {
    try {
      const parsed = new URL(spotifyUrl);
      if (parsed.hostname.includes('spotify.com') || parsed.hostname.includes('spotify.link')) {
        const pathSegments = parsed.pathname.split('/').filter(Boolean);
        const validTypes = ['track', 'playlist', 'artist', 'album', 'show', 'episode'];
        const typeIndex = pathSegments.findIndex(p => validTypes.includes(p));
        
        if (typeIndex !== -1 && pathSegments.length > typeIndex + 1) {
          const type = pathSegments[typeIndex];
          const id = pathSegments[typeIndex + 1];
          setEmbedUrl(`https://open.spotify.com/embed/${type}/${id}?utm_source=generator&theme=0`);
          setIsInputOpen(false);
          return;
        }
      }
      alert("Invalid Spotify URL. Please paste a valid link (e.g. https://open.spotify.com/track/...)");
    } catch {
      alert("Please enter a valid URL.");
    }
  };

  return (
    <>
      <div className="flex items-center w-full max-w-6xl mx-auto justify-between gap-4 h-full relative">
        {/* Left Section: Info / Add Button */}
        <div className="w-48 sm:w-64 flex flex-col justify-center shrink-0">
          <div className="flex items-center gap-2 mb-1">
            <Music size={14} className="text-[#00FF00] drop-shadow-[0_0_5px_#00FF00]" />
            <p className="text-xs font-black uppercase tracking-wider text-white">Spotify Stream</p>
          </div>
          {!isInputOpen ? (
            <button 
              onClick={() => setIsInputOpen(true)}
              className="group flex flex-col items-start gap-1 py-1"
            >
              <div className="flex items-center gap-2 text-[10px] uppercase text-[#00FF00] opacity-70 group-hover:opacity-100 transition-opacity">
                <Plus size={12} />
                <span>Import Music URL</span>
              </div>
            </button>
          ) : (
            <div className="flex flex-col gap-2 mt-1 absolute bottom-4 left-0 w-64 p-3 bg-[#0a0a0a] border border-[#00FF00]/40 shadow-[0_0_20px_rgba(0,0,0,0.8)] z-50 rounded-sm">
              <label className="text-[9px] uppercase font-bold text-white opacity-80">Paste Spotify Link</label>
              <input 
                type="text" 
                value={spotifyUrl}
                onChange={(e) => setSpotifyUrl(e.target.value)}
                placeholder="https://open.spotify.com/..."
                className="w-full bg-[#111] border border-[#00FF00]/40 text-white text-[10px] px-2 py-1 outline-none focus:border-[#00FF00] shadow-[inset_0_0_10px_rgba(0,0,0,0.5)]"
                autoFocus
              />
              <div className="flex gap-2">
                 <button onClick={handleApplyLink} className="flex-1 flex items-center justify-center gap-1 text-[9px] uppercase tracking-wider bg-[#00FF00]/20 text-[#00FF00] hover:bg-[#00FF00]/40 px-2 py-1.5 font-bold border border-[#00FF00]/40 transition-colors">
                   <Check size={10} /> Apply
                 </button>
                 <button onClick={() => setIsInputOpen(false)} className="flex-1 flex items-center justify-center text-[9px] uppercase tracking-wider text-white opacity-50 hover:opacity-100 px-2 py-1.5 font-bold transition-opacity">
                   Cancel
                 </button>
              </div>
            </div>
          )}
        </div>
        
        {/* Center: Spotify iFrame embedded */}
        <div className="flex-1 flex items-center justify-center h-[80px]">
          <iframe 
            src={embedUrl} 
            width="100%" 
            height="80" 
            frameBorder="0" 
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" 
            loading="lazy"
            className="rounded-[4px] shadow-[0_0_15px_rgba(0,255,0,0.1)] border border-[#00FF00]/20 bg-black max-w-2xl"
          ></iframe>
        </div>

        {/* Right Section: Status */}
        <div className="w-48 sm:w-64 hidden sm:flex justify-end gap-6 shrink-0">
          <div className="text-right flex flex-col justify-center">
            <p className="text-[10px] opacity-50 uppercase font-mono">Audio Engine</p>
            <p className="text-xs font-mono text-[#00FF00] drop-shadow-[0_0_5px_rgba(0,255,0,0.4)]">SPOTIFY_API</p>
          </div>
          <div className="text-right flex flex-col justify-center">
            <p className="text-[10px] opacity-50 uppercase font-mono">Status</p>
            <p className="text-xs font-mono text-white">SYNCED</p>
          </div>
        </div>
      </div>
    </>
  );
}
