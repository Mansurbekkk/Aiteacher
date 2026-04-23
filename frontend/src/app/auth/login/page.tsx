'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import toast from 'react-hot-toast';
import { Brain, Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { setUser, setToken } = useAuthStore();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.password) {
      toast.error('Barcha maydonlarni to\'ldiring');
      return;
    }
    setLoading(true);
    try {
      const { data } = await authApi.login(form);
      setToken(data.access_token);
      setUser(data.user);
      toast.success(`Xush kelibsiz, ${data.user.full_name}!`);
      router.push('/dashboard');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } };
      toast.error(error?.response?.data?.detail || 'Kirish xatosi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-20">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2.5 mb-6">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center shadow-glow-purple">
              <Brain size={20} className="text-white" />
            </div>
            <span className="font-display font-bold text-xl gradient-text">AITeacher</span>
          </Link>
          <h1 className="font-display font-bold text-3xl text-white mb-2">Qaytib keldingiz!</h1>
          <p className="text-slate-400">Hisobingizga kiring va o'rganishni davom eting</p>
        </div>

        {/* Form card */}
        <div className="glass-card rounded-2xl p-8 neon-border">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Email */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Email manzil</label>
              <div className="relative">
                <Mail size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  placeholder="email@example.com"
                  className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-violet-500/50 focus:bg-violet-500/5 transition-all text-sm"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Parol</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="Parolni kiriting"
                  className="w-full pl-10 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-violet-500/50 focus:bg-violet-500/5 transition-all text-sm"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 transition-colors"
                >
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl btn-glow text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Kirish
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>

          {/* Divider */}
          <div className="flex items-center gap-3 my-6">
            <div className="flex-1 h-px bg-white/[0.06]" />
            <span className="text-xs text-slate-600">yoki</span>
            <div className="flex-1 h-px bg-white/[0.06]" />
          </div>

          {/* Demo login */}
          <button
            onClick={() => setForm({ email: 'admin@aiteacher.uz', password: 'admin123' })}
            className="w-full py-3 rounded-xl glass-card text-slate-400 text-sm hover:text-slate-200 transition-colors border border-white/[0.06]"
          >
            Demo hisob bilan sinab ko'ring
          </button>
        </div>

        {/* Register link */}
        <p className="text-center mt-6 text-sm text-slate-500">
          Hisob yo'qmi?{' '}
          <Link href="/auth/register" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
            Ro'yxatdan o'ting
          </Link>
        </p>
      </div>
    </div>
  );
}
