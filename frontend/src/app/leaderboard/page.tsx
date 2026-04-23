'use client';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import { usersApi } from '@/lib/api';
import { Trophy, Zap, Crown, Medal, Star } from 'lucide-react';

interface LeaderboardEntry {
  rank: number;
  username: string;
  full_name: string;
  xp_points: number;
  level: number;
  avatar_url?: string;
}

const rankColors = ['', '#F59E0B', '#94A3B8', '#CD7C2F'];
const rankIcons = [Crown, Medal, Star];

export default function LeaderboardPage() {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    usersApi.getLeaderboard()
      .then(({ data }) => setLeaderboard(data))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 pt-24 pb-16">
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-500 to-orange-600 mb-6 shadow-glow-amber animate-float">
            <Trophy size={28} className="text-white" />
          </div>
          <h1 className="font-display font-bold text-4xl text-white mb-3">
            <span className="gradient-text-amber">Reyting</span> Jadvali
          </h1>
          <p className="text-slate-400">Eng ko'p XP yig'gan o'quvchilar</p>
        </div>

        {/* Top 3 podium */}
        {!loading && leaderboard.length >= 3 && (
          <div className="flex items-end justify-center gap-4 mb-10">
            {[leaderboard[1], leaderboard[0], leaderboard[2]].map((entry, displayIdx) => {
              const actualRank = displayIdx === 0 ? 2 : displayIdx === 1 ? 1 : 3;
              const heights = ['h-24', 'h-32', 'h-20'];
              const colors = [
                'from-slate-500 to-slate-600',
                'from-amber-500 to-yellow-500',
                'from-amber-700 to-orange-700'
              ];
              return (
                <div key={entry.username} className="flex flex-col items-center gap-2 flex-1 max-w-[120px]">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-lg font-bold text-white">
                    {entry.full_name.charAt(0)}
                  </div>
                  <div className="text-xs text-slate-300 font-medium text-center truncate w-full text-center">
                    {entry.username}
                  </div>
                  <div className="text-xs text-amber-400 font-semibold">
                    {entry.xp_points.toLocaleString()} XP
                  </div>
                  <div
                    className={`w-full ${heights[displayIdx]} rounded-t-xl bg-gradient-to-t ${colors[displayIdx]} flex items-start justify-center pt-2`}
                  >
                    <span className="text-white font-bold text-lg">{actualRank}</span>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Full list */}
        <div className="space-y-3">
          {loading ? (
            [...Array(10)].map((_, i) => (
              <div key={i} className="glass-card rounded-2xl p-4 flex items-center gap-4">
                <div className="w-10 h-10 rounded-full skeleton" />
                <div className="flex-1 space-y-2">
                  <div className="h-4 rounded skeleton w-1/3" />
                  <div className="h-3 rounded skeleton w-1/4" />
                </div>
                <div className="h-6 w-16 rounded skeleton" />
              </div>
            ))
          ) : (
            leaderboard.map((entry, idx) => {
              const RankIcon = rankIcons[idx] || Trophy;
              const isTop3 = idx < 3;
              return (
                <div
                  key={entry.username}
                  className={`glass-card rounded-2xl p-4 flex items-center gap-4 transition-all ${
                    isTop3 ? 'border border-amber-500/20' : ''
                  }`}
                >
                  {/* Rank */}
                  <div className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0" style={{
                    background: isTop3 ? `${rankColors[entry.rank]}20` : 'rgba(255,255,255,0.05)',
                    border: `1px solid ${isTop3 ? rankColors[entry.rank] + '40' : 'rgba(255,255,255,0.08)'}`,
                  }}>
                    {isTop3 ? (
                      <RankIcon size={18} style={{ color: rankColors[entry.rank] }} />
                    ) : (
                      <span className="text-sm font-bold text-slate-500">{entry.rank}</span>
                    )}
                  </div>

                  {/* Avatar */}
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-sm font-bold text-white flex-shrink-0">
                    {entry.full_name.charAt(0)}
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-white text-sm truncate">{entry.full_name}</div>
                    <div className="text-xs text-slate-500">@{entry.username} • Lv.{entry.level}</div>
                  </div>

                  {/* XP */}
                  <div className="flex items-center gap-1.5 flex-shrink-0">
                    <Zap size={14} className="text-amber-400" />
                    <span className="font-bold text-amber-400 text-sm">{entry.xp_points.toLocaleString()}</span>
                    <span className="text-xs text-slate-600">XP</span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
