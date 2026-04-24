'use client';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthStore } from '@/lib/store';
import { BookOpen, MessageSquare, LogOut, Menu, X, Zap, Trophy, Home } from 'lucide-react';

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

  const handleLogout = () => { logout(); router.push('/'); };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      scrolled ? 'backdrop-blur-xl border-b' : ''
    }`} style={{
      background: scrolled ? 'rgba(6,11,20,0.92)' : 'transparent',
      borderColor: scrolled ? 'rgba(0,194,212,0.1)' : 'transparent',
    }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo — faqat matn, rasm yo'q */}
          <Link href="/" className="group">
            <span className="font-display font-bold text-xl gradient-text tracking-tight">
              AITeacher
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            {navLinks.map(({ href, label, icon: Icon }) => {
              const active = pathname === href;
              return (
                <Link key={href} href={href}
                  className="flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200"
                  style={{
                    background: active ? 'rgba(0,194,212,0.12)' : 'transparent',
                    color: active ? '#00C2D4' : '#7AA0A0',
                    border: active ? '1px solid rgba(0,194,212,0.25)' : '1px solid transparent',
                  }}>
                  <Icon size={15} />
                  {label}
                </Link>
              );
            })}
          </div>

          {/* Right */}
          <div className="hidden md:flex items-center gap-3">
            {user ? (
              <>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full"
                  style={{ background: 'rgba(0,230,118,0.1)', border: '1px solid rgba(0,230,118,0.2)' }}>
                  <Zap size={13} style={{ color: '#00E676' }} />
                  <span className="text-xs font-semibold" style={{ color: '#00E676' }}>{user.xp_points} XP</span>
                </div>
                <Link href="/dashboard"
                  className="flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all"
                  style={{ background: 'rgba(0,194,212,0.07)', border: '1px solid rgba(0,194,212,0.15)', color: '#C8ECEC' }}>
                  <div className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold"
                    style={{ background: 'linear-gradient(135deg,#00C2D4,#00E676)', color: '#060B14' }}>
                    {user.full_name.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm">{user.username}</span>
                </Link>
                {user.is_admin && (
                  <Link href="/admin/dashboard"
                    className="px-3 py-1.5 rounded-lg text-xs font-semibold transition-all"
                    style={{ background: 'rgba(0,230,118,0.12)', color: '#00E676', border: '1px solid rgba(0,230,118,0.25)' }}>
                    Admin
                  </Link>
                )}
                <button onClick={handleLogout}
                  className="p-2 rounded-lg transition-all"
                  style={{ color: '#3A6060' }}
                  title="Chiqish">
                  <LogOut size={16} />
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login"
                  className="px-4 py-2 text-sm transition-colors"
                  style={{ color: '#7AA0A0' }}>
                  Kirish
                </Link>
                <Link href="/auth/register"
                  className="px-4 py-2 text-sm font-semibold rounded-lg btn-glow text-white">
                  Ro'yxatdan o'tish
                </Link>
              </>
            )}
          </div>

          {/* Mobile */}
          <button className="md:hidden p-2 transition-colors" style={{ color: '#7AA0A0' }}
            onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden p-4 space-y-2" style={{ background: 'rgba(6,11,20,0.97)', backdropFilter: 'blur(20px)', borderTop: '1px solid rgba(0,194,212,0.1)' }}>
          {navLinks.map(({ href, label, icon: Icon }) => (
            <Link key={href} href={href} onClick={() => setIsOpen(false)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl transition-all"
              style={{ color: '#7AA0A0' }}>
              <Icon size={18} />{label}
            </Link>
          ))}
          <div className="pt-2" style={{ borderTop: '1px solid rgba(0,194,212,0.08)' }}>
            {user ? (
              <>
                <Link href="/dashboard" onClick={() => setIsOpen(false)}
                  className="flex items-center gap-3 px-4 py-3 rounded-xl"
                  style={{ color: '#7AA0A0' }}>
                  {user.full_name}
                </Link>
                <button onClick={() => { handleLogout(); setIsOpen(false); }}
                  className="flex items-center gap-3 w-full px-4 py-3 rounded-xl"
                  style={{ color: '#FF6464' }}>
                  <LogOut size={18} />Chiqish
                </button>
              </>
            ) : (
              <>
                <Link href="/auth/login" onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 rounded-xl text-center"
                  style={{ color: '#7AA0A0' }}>Kirish</Link>
                <Link href="/auth/register" onClick={() => setIsOpen(false)}
                  className="block px-4 py-3 rounded-xl text-center btn-glow text-white font-medium">
                  Ro'yxatdan o'tish
                </Link>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
