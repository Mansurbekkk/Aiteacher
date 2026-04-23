'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import {
  Brain, BookOpen, MessageSquare, User, LogOut,
  Menu, X, Zap, Trophy, Home
} from 'lucide-react';

const navLinks = [
  { href: '/', label: 'Asosiy', icon: Home },
  { href: '/courses', label: 'Kurslar', icon: BookOpen },
  { href: '/chat', label: 'AI Chat', icon: MessageSquare },
  { href: '/leaderboard', label: 'Reyting', icon: Trophy },
];

export default function Navbar() {
  const { user, logout, initFromStorage } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    initFromStorage();
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [initFromStorage]);

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const levelColors = ['', '#10B981', '#06B6D4', '#8B5CF6', '#F59E0B', '#EF4444',
    '#EC4899', '#F97316', '#A855F7', '#14B8A6', '#F59E0B'];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled
        ? 'bg-[#06060F]/90 backdrop-blur-xl border-b border-white/[0.06] shadow-lg shadow-black/20'
        : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center group-hover:scale-110 transition-transform shadow-glow-purple">
              <Brain className="w-4.5 h-4.5 text-white" size={18} />
            </div>
            <span className="font-display font-bold text-lg gradient-text">AITeacher</span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                    active
                      ? 'bg-violet-600/20 text-violet-300 border border-violet-500/30'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
                  }`}
                >
                  <Icon size={15} />
                  {label}
                </Link>
              );
            })}
          </div>

          {/* Right side */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                {/* XP Badge */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                  <Zap size={13} className="text-amber-400" />
                  <span className="text-xs font-semibold text-amber-400">{user.xp_points} XP</span>
                </div>

                {/* Level Badge */}
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/5 border border-white/10">
                  <div
                    className="w-2 h-2 rounded-full"
                    style={{ backgroundColor: levelColors[user.level] || '#8B5CF6' }}
                  />
                  <span className="text-xs font-medium text-slate-300">Lv.{user.level}</span>
                </div>

                {/* Profile */}
                <Link
                  href="/dashboard"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 transition-all"
                >
                  <div className="w-6 h-6 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center text-xs font-bold text-white">
                    {user.full_name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm text-slate-300">{user.username}</span>
                </Link>

                <button
                  onClick={handleLogout}
                  className="p-2 rounded-lg text-slate-500 hover:text-red-400 hover:bg-red-500/10 transition-all"
                  title="Chiqish"
                >
                  <LogOut size={16} />
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/auth/login"
                  className="px-4 py-2 text-sm text-slate-300 hover:text-white transition-colors"
                >
                  Kirish
                </Link>
                <Link
                  href="/auth/register"
                  className="px-4 py-2 text-sm font-medium rounded-lg btn-glow text-white"
                >
                  Ro'yxatdan o'tish
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button
            className="md:hidden p-2 text-slate-400 hover:text-white transition-colors"
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {isOpen && (
        <div className="md:hidden bg-[#0A0A1B]/95 backdrop-blur-xl border-t border-white/[0.06] p-4 space-y-2">
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-white/5 hover:text-white transition-all"
            >
              <Icon size={18} />
              {label}
            </Link>
          ))}
          <div className="pt-2 border-t border-white/[0.06]">
            {user ? (
              <div className="space-y-2">
                <Link
                  href="/dashboard"
                  onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-300 hover:bg-white/5 transition-all"
                >
                  <User size={18} />
                  {user.full_name}
                </Link>
                <button
                  onClick={() => { handleLogout(); setIsOpen(false); }}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-red-400 hover:bg-red-500/10 transition-all"
                >
                  <LogOut size={18} />
                  Chiqish
                </button>
              </div>
            ) : (
              <div className="space-y-2">
                <Link
                  href="/auth/login"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 rounded-xl text-center text-slate-300 hover:bg-white/5 transition-all"
                >
                  Kirish
                </Link>
                <Link
                  href="/auth/register"
                  onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 rounded-xl text-center btn-glow text-white font-medium"
                >
                  Ro'yxatdan o'tish
                </Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
