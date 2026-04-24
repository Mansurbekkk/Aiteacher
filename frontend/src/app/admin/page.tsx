'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { authApi } from '@/lib/api';
import toast from 'react-hot-toast';
import { Lock, User, LogIn } from 'lucide-react';

export default function AdminLoginPage() {
  const router = useRouter();
  const [form, setForm] = useState({ email: 'admin@aiteacher.uz', password: 'admin123' });
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await authApi.login(form);
      if (!data.user.is_admin) {
        toast.error('Admin huquqi yo\'q');
        return;
      }
      localStorage.setItem('admin_token', data.access_token);
      localStorage.setItem('admin_user', JSON.stringify(data.user));
      toast.success('Admin paneliga xush kelibsiz!');
      router.push('/admin/dashboard');
    } catch {
      toast.error('Login yoki parol xato');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: '#060B14' }}>
      <div className="w-full max-w-sm">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl mx-auto mb-4 flex items-center justify-center" style={{ background: 'linear-gradient(135deg, #00C2D4, #00E676)' }}>
            <Lock size={28} className="text-white" />
          </div>
          <h1 className="text-2xl font-bold text-white font-display">Admin Panel</h1>
          <p className="text-sm mt-1" style={{ color: '#6B8A8A' }}>AITeacher boshqaruv paneli</p>
        </div>

        <div className="rounded-2xl p-6" style={{ background: 'rgba(0,194,212,0.05)', border: '1px solid rgba(0,194,212,0.15)' }}>
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="text-sm font-medium mb-2 block" style={{ color: '#94B4B4' }}>Email</label>
              <div className="relative">
                <User size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#4A7A7A' }} />
                <input
                  type="email"
                  value={form.email}
                  onChange={e => setForm({ ...form, email: e.target.value })}
                  className="w-full pl-9 pr-4 py-3 rounded-xl text-sm text-white outline-none"
                  style={{ background: 'rgba(0,194,212,0.08)', border: '1px solid rgba(0,194,212,0.2)' }}
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-medium mb-2 block" style={{ color: '#94B4B4' }}>Parol</label>
              <div className="relative">
                <Lock size={15} className="absolute left-3 top-1/2 -translate-y-1/2" style={{ color: '#4A7A7A' }} />
                <input
                  type="password"
                  value={form.password}
                  onChange={e => setForm({ ...form, password: e.target.value })}
                  className="w-full pl-9 pr-4 py-3 rounded-xl text-sm text-white outline-none"
                  style={{ background: 'rgba(0,194,212,0.08)', border: '1px solid rgba(0,194,212,0.2)' }}
                />
              </div>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all"
              style={{ background: 'linear-gradient(135deg, #00C2D4, #00E676)', color: '#060B14' }}
            >
              {loading
                ? <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                : <><LogIn size={16} />Kirish</>
              }
            </button>
          </form>
        </div>

        <p className="text-center text-xs mt-4" style={{ color: '#3A5A5A' }}>
          Login: admin@aiteacher.uz / admin123
        </p>
      </div>
    </div>
  );
}
