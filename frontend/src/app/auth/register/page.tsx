'use client';
import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import toast from 'react-hot-toast';
import { Brain, Mail, Lock, User, ArrowRight, Eye, EyeOff, AtSign } from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const { setUser, setToken } = useAuthStore();
  const [form, setForm] = useState({
    email: '', username: '', full_name: '', password: '', confirm_password: ''
  });
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.email || !form.username || !form.full_name || !form.password) {
      toast.error('Barcha maydonlarni to\'ldiring');
      return;
    }
    if (form.password !== form.confirm_password) {
      toast.error('Parollar mos kelmaydi');
      return;
    }
    if (form.password.length < 6) {
      toast.error('Parol kamida 6 ta belgidan iborat bo\'lsin');
      return;
    }
    setLoading(true);
    try {
      const { data } = await authApi.register({
        email: form.email,
        username: form.username,
        full_name: form.full_name,
        password: form.password,
      });
      setToken(data.access_token);
      setUser(data.user);
      toast.success('Xush kelibsiz! Muvaffaqiyatli ro\'yxatdan o\'tdingiz 🎉');
      router.push('/dashboard');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } };
      toast.error(error?.response?.data?.detail || 'Ro\'yxatdan o\'tish xatosi');
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: 'full_name', label: 'To\'liq ism', placeholder: 'Ism Familiya', icon: User, type: 'text' },
    { key: 'username', label: 'Foydalanuvchi nomi', placeholder: 'username123', icon: AtSign, type: 'text' },
    { key: 'email', label: 'Email manzil', placeholder: 'email@example.com', icon: Mail, type: 'email' },
  ];

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
          <h1 className="font-display font-bold text-3xl text-white mb-2">AI safiga qo'shiling!</h1>
          <p className="text-slate-400">Bepul hisob yarating va AI o'rganishni boshlang</p>
        </div>

        <div className="glass-card rounded-2xl p-8 neon-border">
          <form onSubmit={handleSubmit} className="space-y-4">
            {fields.map(({ key, label, placeholder, icon: Icon, type }) => (
              <div key={key}>
                <label className="block text-sm font-medium text-slate-300 mb-2">{label}</label>
                <div className="relative">
                  <Icon size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                  <input
                    type={type}
                    value={form[key as keyof typeof form]}
                    onChange={e => setForm({ ...form, [key]: e.target.value })}
                    placeholder={placeholder}
                    className="w-full pl-10 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-violet-500/50 focus:bg-violet-500/5 transition-all text-sm"
                  />
                </div>
              </div>
            ))}

            {/* Password */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Parol</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type={showPass ? 'text' : 'password'}
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  placeholder="Kamida 6 ta belgi"
                  className="w-full pl-10 pr-10 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-slate-600 focus:outline-none focus:border-violet-500/50 focus:bg-violet-500/5 transition-all text-sm"
                />
                <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300">
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-sm font-medium text-slate-300 mb-2">Parolni tasdiqlang</label>
              <div className="relative">
                <Lock size={16} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500" />
                <input
                  type="password"
                  value={form.confirm_password}
                  onChange={e => setForm({ ...form, confirm_password: e.target.value })}
                  placeholder="Parolni qayta kiriting"
                  className={`w-full pl-10 pr-4 py-3 bg-white/5 border rounded-xl text-white placeholder-slate-600 focus:outline-none transition-all text-sm ${
                    form.confirm_password && form.password !== form.confirm_password
                      ? 'border-red-500/50 focus:border-red-500/70'
                      : 'border-white/10 focus:border-violet-500/50'
                  }`}
                />
              </div>
              {form.confirm_password && form.password !== form.confirm_password && (
                <p className="text-xs text-red-400 mt-1">Parollar mos kelmaydi</p>
              )}
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 rounded-xl btn-glow text-white font-semibold flex items-center justify-center gap-2 disabled:opacity-50 mt-2"
            >
              {loading ? (
                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <>
                  Ro'yxatdan o'tish
                  <ArrowRight size={16} />
                </>
              )}
            </button>
          </form>
        </div>

        <p className="text-center mt-6 text-sm text-slate-500">
          Hisobingiz bormi?{' '}
          <Link href="/auth/login" className="text-violet-400 hover:text-violet-300 font-medium transition-colors">
            Kirish
          </Link>
        </p>
      </div>
    </div>
  );
}
