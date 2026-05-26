import React from 'react';
import type { MusicSource, Song } from '@/app/music/MusicClient';

export const musicSources: Array<{ key: MusicSource; label: string }> = [
  { key: 'wy', label: '网易云' },
  { key: 'tx', label: 'QQ' },
  { key: 'kw', label: '酷我' },
  { key: 'kg', label: '酷狗' },
  { key: 'mg', label: '咪咕' },
];

export function normalizeSource(source: string | undefined | null): MusicSource {
  if (source === 'wy' || source === 'tx' || source === 'kw' || source === 'kg' || source === 'mg') return source;
  return 'wy';
}

export function mapSong(song: any): Song {
  const rawSource = song.platform || song.source || song.vendor || song.origin;
  return {
    id: String(song.id ?? song.songId ?? song.rid ?? song.mid ?? ''),
    name: song.name || song.title || '未知歌曲',
    artist: song.artist || song.singer || song.artists || '未知艺术家',
    album: song.album || song.albumName,
    pic: song.pic || song.cover || song.img,
    platform: normalizeSource(rawSource),
    duration: song.duration,
    durationText: song.durationText,
    songmid: song.songmid || song.mid,
  };
}

export function SourcePill({ source, className = '' }: { source?: MusicSource | string; className?: string }) {
  const normalized = normalizeSource(source);
  const label = musicSources.find((item) => item.key === normalized)?.label || source || '未知';
  return React.createElement(
    'span',
    {
      className: `inline-flex shrink-0 items-center rounded-full border border-white/10 bg-white/5 px-2 py-0.5 text-[10px] font-medium text-zinc-400 ${className}`,
    },
    label
  );
}
