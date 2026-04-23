'use client';
import { useEffect, useRef } from 'react';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import {
  Brain, Zap, BookOpen, MessageSquare, Trophy,
  ChevronRight, Star, Code2, Cpu, Globe,
  ArrowRight, Play, Users, CheckCircle
} from 'lucide-react';

const features = [
  {
    icon: Brain,
    title: "AI Asoslari",
    desc: "Machine Learning, Deep Learning, Neural Networks — barchasini o'rganing",
    color: "from-violet-500 to-purple-600",
    glow: "rgba(139, 92, 246, 0.3)",
  },
  {
    icon: Zap,
    title: "Groq API",
    desc: "Dunyodagi eng tezkor AI platformasi bilan real ilovalar yarating",
    color: "from-cyan-500 to-blue-600",
    glow: "rgba(6, 182, 212, 0.3)",
  },
  {
    icon: Code2,
    title: "Amaliy Loyihalar",
    desc: "Chatbot, tahlil vositalari, AI assistantlar — real kod yozing",
    color: "from-amber-500 to-orange-600",
    glow: "rgba(245, 158, 11, 0.3)",
  },
  {
    icon: MessageSquare,
    title: "AI Mentor",
    desc: "24/7 ishlaydi, savol bering, tushuntirma oling, kod tekshiring",
    color: "from-emerald-500 to-teal-600",
    glow: "rgba(16, 185, 129, 0.3)",
  },
];

const stats = [
  { value: "4+", label: "Kurslar", icon: BookOpen },
  { value: "10+", label: "Darslar", icon: Play },
  { value: "100%", label: "Bepul", icon: Star },
  { value: "24/7", label: "AI Mentor", icon: Brain },
];

const testimonials = [
  {
    name: "Jasur Toshmatov",
    role: "Backend Developer",
    text: "AITeacher orqali Groq API ni juda tez o'rgandim. Endi o'zim AI ilovalar yaratyapman!",
    level: 5,
    xp: "3,200 XP",
  },
  {
    name: "Malika Rahimova",
    role: "Data Scientist",
    text: "Prompt engineering kursi menga ish berdi. Endi har kuni AI bilan ishlayman va ish samaradorligim 3x oshdi.",
    level: 7,
    xp: "8,100 XP",
  },
  {
    name: "Bobur Yusupov",
    role: "Student",
    text: "Boshlanuvchi sifatida AI dunyo qo'rqinchli edi. Lekin bu platforma tushunishni osonlashtirdi.",
    level: 3,
    xp: "1,500 XP",
  },
];

const roadmapItems = [
  { step: "01", title: "AI Asoslarini o'rgan", desc: "AI nima, qanday ishlaydi, turlari" },
  { step: "02", title: "Prompt Engineering", desc: "AI'dan maksimal natija olish sir-asrori" },
  { step: "03", title: "API bilan ishlash", desc: "Groq, OpenAI API larni qo'llang" },
  { step: "04", title: "Loyiha yarating", desc: "Real AI ilovalar develop qiling" },
];

export default function HomePage() {
  const heroRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!heroRef.current) return;
      const { clientX, clientY } = e;
      const { width, height } = heroRef.current.getBoundingClientRect();
      const x = (clientX / width - 0.5) * 20;
      const y = (clientY / height - 0.5) * 20;
      heroRef.current.style.setProperty('--mouse-x', `${x}px`);
      heroRef.current.style.setProperty('--mouse-y', `${y}px`);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="min-h-screen">
      <Navbar />

      {/* HERO */}
      <section ref={heroRef} className="relative min-h-screen flex items-center justify-center pt-20 pb-16 overflow-hidden">
        {/* Animated grid */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(rgba(139,92,246,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(139,92,246,0.5) 1px, transparent 1px)`,
            backgroundSize: '60px 60px',
          }}
        />

        <div className="relative z-10 max-w-6xl mx-auto px-4 text-center">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 text-sm font-medium mb-8 animate-fade-in">
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            O'zbekistonning #1 AI O'quv Platformasi
          </div>

          {/* Main heading */}
          <h1 className="font-display font-bold text-5xl sm:text-6xl lg:text-7xl leading-tight mb-6 animate-slide-up">
            <span className="gradient-text">Sun'iy Intellektni</span>
            <br />
            <span className="text-white">Professional Darajada</span>
            <br />
            <span className="gradient-text-amber">O'rganing</span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up">
            Groq API, Machine Learning, Prompt Engineering va boshqa AI texnologiyalarini
            <strong className="text-slate-200"> amaliy loyihalar</strong> orqali o'rganing.
            AI Mentor 24/7 yordam beradi.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-wrap items-center justify-center gap-4 mb-16 animate-slide-up">
            <Link
              href="/courses"
              className="flex items-center gap-2 px-8 py-4 rounded-xl btn-glow text-white font-semibold text-base shadow-glow-purple"
            >
              <BookOpen size={18} />
              Kurslarni boshlash
              <ArrowRight size={16} />
            </Link>
            <Link
              href="/chat"
              className="flex items-center gap-2 px-8 py-4 rounded-xl glass-card text-slate-200 font-medium text-base hover:text-white neon-border"
            >
              <MessageSquare size={18} />
              AI bilan suhbatlash
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {stats.map(({ value, label, icon: Icon }) => (
              <div key={label} className="glass-card rounded-2xl p-4 text-center">
                <div className="flex justify-center mb-2">
                  <Icon size={20} className="text-violet-400" />
                </div>
                <div className="font-display font-bold text-2xl gradient-text">{value}</div>
                <div className="text-xs text-slate-500 mt-1">{label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Floating tech icons */}
        <div className="absolute top-32 left-8 opacity-20 animate-float" style={{ animationDelay: '0s' }}>
          <Cpu size={32} className="text-violet-400" />
        </div>
        <div className="absolute top-48 right-12 opacity-20 animate-float" style={{ animationDelay: '2s' }}>
          <Globe size={28} className="text-cyan-400" />
        </div>
        <div className="absolute bottom-32 left-20 opacity-20 animate-float" style={{ animationDelay: '4s' }}>
          <Code2 size={24} className="text-amber-400" />
        </div>
        <div className="absolute bottom-48 right-8 opacity-20 animate-float" style={{ animationDelay: '1s' }}>
          <Brain size={36} className="text-emerald-400" />
        </div>
      </section>

      {/* FEATURES */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-4xl sm:text-5xl text-white mb-4">
              Nima <span className="gradient-text">o'rganasiz?</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              AI dunyosiga kirish uchun zarur bo'lgan barcha bilimlar bir joyda
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map(({ icon: Icon, title, desc, color, glow }) => (
              <div
                key={title}
                className="glass-card rounded-2xl p-6 group cursor-pointer"
                style={{ '--glow-color': glow } as React.CSSProperties}
              >
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform shadow-lg`}>
                  <Icon size={22} className="text-white" />
                </div>
                <h3 className="font-display font-bold text-lg text-white mb-2 group-hover:text-violet-300 transition-colors">
                  {title}
                </h3>
                <p className="text-sm text-slate-400 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ROADMAP */}
      <section className="py-24 relative">
        <div className="max-w-5xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-4xl text-white mb-4">
              O'quv <span className="gradient-text">yo'l xaritasi</span>
            </h2>
            <p className="text-slate-400 text-lg">Qadam-baqadam AI mutaxassisiga aylanish</p>
          </div>

          <div className="relative">
            <div className="absolute left-[27px] top-0 bottom-0 w-0.5 bg-gradient-to-b from-violet-500 via-cyan-500 to-amber-500 opacity-30" />
            <div className="space-y-8">
              {roadmapItems.map(({ step, title, desc }, idx) => (
                <div key={step} className="flex gap-6 items-start group">
                  <div className="flex-shrink-0 w-14 h-14 rounded-full glass-card border border-violet-500/30 flex items-center justify-center font-display font-bold text-violet-400 group-hover:border-violet-500/60 group-hover:text-violet-300 transition-all z-10">
                    {step}
                  </div>
                  <div className="glass-card rounded-2xl p-5 flex-1 group-hover:border-violet-500/20 transition-all">
                    <h3 className="font-display font-semibold text-white mb-1">{title}</h3>
                    <p className="text-sm text-slate-400">{desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* TESTIMONIALS */}
      <section className="py-24 relative">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="font-display font-bold text-4xl text-white mb-4">
              O'quvchilar <span className="gradient-text">fikrlari</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map((t) => (
              <div key={t.name} className="glass-card rounded-2xl p-6">
                <div className="flex gap-1 mb-4">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={14} className="text-amber-400 fill-amber-400" />
                  ))}
                </div>
                <p className="text-slate-300 text-sm leading-relaxed mb-6 italic">
                  "{t.text}"
                </p>
                <div className="flex items-center gap-3 pt-4 border-t border-white/[0.06]">
                  <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-cyan-500 flex items-center justify-center font-bold text-white text-sm">
                    {t.name.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <div className="text-sm font-semibold text-white">{t.name}</div>
                    <div className="text-xs text-slate-500">{t.role}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-amber-400 font-medium">{t.xp}</div>
                    <div className="text-xs text-slate-500">Lv.{t.level}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-24 relative">
        <div className="max-w-4xl mx-auto px-4 text-center">
          <div className="glass-card rounded-3xl p-12 neon-border relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-violet-900/20 to-cyan-900/20" />
            <div className="relative z-10">
              <Brain size={48} className="text-violet-400 mx-auto mb-6 animate-float" />
              <h2 className="font-display font-bold text-4xl text-white mb-4">
                AI kelajagini <span className="gradient-text">birgalikda kashf etamiz</span>
              </h2>
              <p className="text-slate-400 text-lg mb-8 max-w-xl mx-auto">
                Hoziroq ro'yxatdan o'ting va AI sohasida karyerangizni boshlang
              </p>
              <div className="flex flex-wrap justify-center gap-4">
                <Link
                  href="/auth/register"
                  className="flex items-center gap-2 px-8 py-4 rounded-xl btn-glow text-white font-semibold text-base"
                >
                  Bepul boshlash
                  <ChevronRight size={18} />
                </Link>
                <Link
                  href="/courses"
                  className="flex items-center gap-2 px-8 py-4 rounded-xl glass-card text-slate-200 font-medium"
                >
                  <BookOpen size={18} />
                  Kurslarni ko'rish
                </Link>
              </div>

              {/* Trust badges */}
              <div className="flex flex-wrap justify-center gap-6 mt-10 text-sm text-slate-500">
                {["100% Bepul", "Sertifikat", "O'zbek tilida", "AI Mentor"].map(badge => (
                  <span key={badge} className="flex items-center gap-2">
                    <CheckCircle size={14} className="text-emerald-500" />
                    {badge}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/[0.05] py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-violet-600 to-cyan-500 flex items-center justify-center">
                <Brain size={15} className="text-white" />
              </div>
              <span className="font-display font-bold gradient-text">AITeacher</span>
            </div>
            <p className="text-sm text-slate-600">
              © 2025 AITeacher. O'zbekistonda AI ta'limi.
            </p>
            <div className="flex gap-6 text-sm text-slate-500">
              <Link href="/courses" className="hover:text-slate-300 transition-colors">Kurslar</Link>
              <Link href="/chat" className="hover:text-slate-300 transition-colors">AI Chat</Link>
              <Link href="/auth/register" className="hover:text-slate-300 transition-colors">Ro'yxat</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
