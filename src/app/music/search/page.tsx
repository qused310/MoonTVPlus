'use client';

import { useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { playMusicList } from '@/lib/music/actions';
import { MusicLoadingIndicator, type Song } from '../MusicClient';
import SongList from '../SongList';
import { mapSong, normalizeSource } from '@/lib/music/shared';

export default function MusicSearchPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const source = normalizeSource(searchParams.get('source'));
  const q = searchParams.get('q') || '';
  const [keyword, setKeyword] = useState(q);
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setKeyword(q);
    if (!q) {
      setSongs([]);
      return;
    }
    setLoading(true);
    fetch(`/api/music/v2/search?source=${source}&q=${encodeURIComponent(q)}&page=1&limit=20`)
      .then((res) => res.json())
      .then((data) => setSongs((data.data?.list || []).map(mapSong)))
      .catch(() => setSongs([]))
      .finally(() => setLoading(false));
  }, [source, q]);

  const submit = () => {
    const next = keyword.trim();
    if (next) router.push(`/music/search?source=${source}&q=${encodeURIComponent(next)}`);
  };

  return (
    <div>
      <div className="mb-6 flex items-center gap-2">
        <div className="relative h-11 flex-1 rounded-xl bg-white/10">
          <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
            <svg className="h-4 w-4 text-zinc-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
          </div>
          <input value={keyword} onChange={(e) => setKeyword(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && submit()} className="h-full w-full border-0 bg-transparent pl-10 pr-4 text-sm text-white outline-none placeholder:text-zinc-500" placeholder="搜索歌曲或艺术家..." />
        </div>
        <button onClick={submit} className="h-11 rounded-xl bg-green-600 px-5 text-sm font-medium text-white hover:bg-green-700">搜索</button>
      </div>
      <div className="flex items-center justify-between mb-6 border-b border-white/5 pb-2">
        <div className="flex items-center gap-3 min-w-0">
          <h2 className="text-xl font-bold text-white/80 tracking-tight truncate max-w-md">{q ? `搜索: ${q}` : '搜索'}</h2>
          <span className="text-[10px] font-bold bg-white/10 px-2 py-0.5 rounded text-white shrink-0">{songs.length} 首歌曲</span>
        </div>
        <button onClick={() => playMusicList(songs, q ? `搜索: ${q}` : '搜索结果')} disabled={songs.length === 0} className="px-3 py-1.5 bg-green-600 hover:bg-green-700 disabled:bg-zinc-700 disabled:cursor-not-allowed rounded-lg text-sm text-white shrink-0">播放全部</button>
      </div>
      {loading ? <MusicLoadingIndicator className="py-8" /> : q ? <SongList songs={songs} /> : <div className="rounded-xl border border-white/10 bg-white/5 p-8 text-center text-zinc-400">输入关键词开始搜索</div>}
    </div>
  );
}
