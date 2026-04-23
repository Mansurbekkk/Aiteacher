'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import CourseCard from '@/components/CourseCard';
import { useAuthStore } from '@/lib/store';
import { usersApi, coursesApi } from '@/lib/api';
import { UserStats, Enrollment } from '@/types';
import {
  Zap, BookOpen, Trophy, Target, MessageSquare,
  TrendingUp, Star, ArrowRight, CheckCircle
} from 'lucide-react';

const levelNames = ['', 'Yangi boshlovchi', 'O\'rganuvchi', 'Amaliyotchi', 'Mutaxassis',
  'Pro', 'Expert', 'Master', 'Grand Master', 'Legend', 'AI Wizard'];

export default function DashboardPage() {
  const { user, initFromStorage } = useAuthStore();
  const router = useRouter();
  const [stats, setStats] = useState<UserStats | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    initFromStorage();
  }, [initFromStorage]);

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      router.push('/auth/login');
      return;
    }
    Promise.all([usersApi.getStats(), coursesApi.getMyEnrollments()])
      .then(([statsRes, enrollRes]) => {
        setStats(statsRes.data);
        setEnrollments(enrollRes.data);
      })
      .catch(() => router.push('/auth/login'))
      .finally(() => setLoading(false));
  }, [router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin mx-auto mb-4" />
          <p className="text-slate-500 text-sm">Yuklanmoqda...</p>
        </div>
      </div>
    );
  }

  if (!stats || !user) return null;

  const xpProgress = stats.next_level_xp > 0
    ? Math.min((stats.xp_points / stats.next_level_xp) * 100, 100)
    : 100;

  const statCards = [
    { label: "Jami XP", value: stats.xp_points.toLocaleString(), icon: Zap, color: "text-amber-400", bg: "bg-amber-500/10", border: "border-amber-500/20" },
    { label: "Kurslar", value: stats.enrollments_count, icon: BookOpen, color: "text-violet-400", bg: "bg-violet-500/10", border: "border-violet-500/20" },
    { label: "Tugatildi", value: stats.completed_courses, icon: CheckCircle, color: "text-emerald-400", bg: "bg-emerald-500/10", border: "border-emerald-500/20" },
    { label: "Darslar", value: stats.completed_lessons, icon: Target, color: "text-cyan-400", bg: "bg-cyan-500/10", border: "border-cyan-500/20" },
  ];

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-16">
        {/* Header */}
        <div className="mb-10">
          <div className="flex items-start gap-5">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-2xl font-bold text-white shadow-glow-purple flex-shrink-0">
              {user.full_name.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1">
              <h1 className="font-display font-bold text-3xl text-white mb-1">
                Salom, {user.full_name.split(' ')[0]}! 👋
              </h1>
              <p className="text-slate-400">@{user.username} • {levelNames[user.level] || 'O\'rganuvchi'}</p>
            </div>
          </div>
        </div>

        {/* XP & Level */}
        <div className="glass-card rounded-2xl p-6 mb-8 neon-border">
          <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Star size={16} className="text-amber-400" />
                <span className="text-sm font-medium text-amber-400">Daraja {user.level} — {levelNames[user.level]}</span>
              </div>
              <div className="font-display font-bold text-2xl gradient-text">
                {stats.xp_points.toLocaleString()} XP
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-slate-500 mb-1">Keyingi daraja uchun</div>
              <div className="text-lg font-bold text-slate-300">
                {Math.max(0, stats.next_level_xp - stats.xp_points).toLocaleString()} XP
              </div>
            </div>
          </div>
          <div className="h-2.5 bg-white/5 rounded-full overflow-hidden">
            <div
              className="progress-bar h-full transition-all duration-1000"
              style={{ width: `${xpProgress}%` }}
            />
          </div>
          <div className="flex justify-between text-xs text-slate-600 mt-2">
            <span>Lv.{user.level}</span>
            <span>{Math.round(xpProgress)}%</span>
            <span>Lv.{user.level + 1}</span>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {statCards.map(({ label, value, icon: Icon, color, bg, border }) => (
            <div key={label} className={`glass-card rounded-2xl p-5 border ${border}`}>
              <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center mb-3`}>
                <Icon size={18} className={color} />
              </div>
              <div className={`font-display font-bold text-2xl ${color} mb-0.5`}>{value}</div>
              <div className="text-xs text-slate-500">{label}</div>
            </div>
          ))}
        </div>

        {/* Enrolled courses */}
        <div className="mb-10">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-display font-bold text-xl text-white flex items-center gap-2">
              <TrendingUp size={20} className="text-violet-400" />
              Mening kurslarim
            </h2>
            <Link href="/courses" className="text-sm text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors">
              Barchasi <ArrowRight size={14} />
            </Link>
          </div>

          {enrollments.length === 0 ? (
            <div className="glass-card rounded-2xl p-12 text-center">
              <BookOpen size={40} className="text-slate-600 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-300 mb-2">Hali kurslar yo'q</h3>
              <p className="text-slate-500 mb-6 text-sm">Birinchi kursingizni tanlang va AI sayohatingizni boshlang</p>
              <Link href="/courses" className="inline-flex items-center gap-2 px-6 py-3 rounded-xl btn-glow text-white font-medium text-sm">
                Kurslarni ko'rish
                <ArrowRight size={14} />
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enrollments.map(enrollment => enrollment.course && (
                <CourseCard
                  key={enrollment.id}
                  course={enrollment.course}
                  enrolled
                  progress={enrollment.progress_percent}
                />
              ))}
            </div>
          )}
        </div>

        {/* Quick actions */}
        <div>
          <h2 className="font-display font-bold text-xl text-white mb-6 flex items-center gap-2">
            <Zap size={20} className="text-amber-400" />
            Tezkor amallar
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              {
                href: '/chat',
                icon: MessageSquare,
                title: 'AI bilan suhbat',
                desc: 'Savollaringizni bering',
                gradient: 'from-violet-500 to-purple-600',
              },
              {
                href: '/courses',
                icon: BookOpen,
                title: 'Yangi kurs',
                desc: "Yangi kurs boshlang",
                gradient: 'from-cyan-500 to-blue-600',
              },
              {
                href: '/leaderboard',
                icon: Trophy,
                title: 'Reyting',
                desc: "O'rningizni ko'ring",
                gradient: 'from-amber-500 to-orange-600',
              },
            ].map(({ href, icon: Icon, title, desc, gradient }) => (
              <Link key={href} href={href} className="glass-card rounded-2xl p-5 group hover:scale-[1.02] transition-all">
                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center mb-3 group-hover:scale-110 transition-transform`}>
                  <Icon size={18} className="text-white" />
                </div>
                <div className="font-semibold text-white text-sm mb-1">{title}</div>
                <div className="text-xs text-slate-500">{desc}</div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
