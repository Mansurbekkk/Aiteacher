'use client';
import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { coursesApi } from '@/lib/api';
import { useAuthStore } from '@/lib/store';
import { Course, Lesson } from '@/types';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import toast from 'react-hot-toast';
import {
  Clock, BookOpen, ChevronLeft, ChevronRight, CheckCircle,
  Lock, Zap, Play, Trophy, Users
} from 'lucide-react';

export default function CourseDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { user } = useAuthStore();
  const [course, setCourse] = useState<Course | null>(null);
  const [activeLesson, setActiveLesson] = useState<Lesson | null>(null);
  const [loading, setLoading] = useState(true);
  const [enrolling, setEnrolling] = useState(false);
  const [enrolled, setEnrolled] = useState(false);
  const [completing, setCompleting] = useState(false);
  const [completedLessons, setCompletedLessons] = useState<Set<number>>(new Set());

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const store = useAuthStore.getState();
      store.initFromStorage();
    }
  }, []);

  useEffect(() => {
    if (!id) return;
    coursesApi.getBySlug(id as string)
      .then(({ data }) => {
        setCourse(data);
        if (data.lessons?.length > 0) setActiveLesson(data.lessons[0]);
        // Check enrollment
        const token = localStorage.getItem('token');
        if (token) {
          coursesApi.getMyEnrollments().then(({ data: enrollments }) => {
            const isEnrolled = enrollments.some((e: { course_id: number }) => e.course_id === data.id);
            setEnrolled(isEnrolled);
          }).catch(() => {});
        }
      })
      .catch(() => router.push('/courses'))
      .finally(() => setLoading(false));
  }, [id, router]);

  const handleEnroll = async () => {
    if (!user) {
      toast.error('Kursga yozilish uchun kirish kerak');
      router.push('/auth/login');
      return;
    }
    if (!course) return;
    setEnrolling(true);
    try {
      await coursesApi.enroll(course.id);
      setEnrolled(true);
      toast.success('Kursga muvaffaqiyatli yozildingiz! 🎉');
    } catch (err: unknown) {
      const error = err as { response?: { data?: { detail?: string } } };
      toast.error(error?.response?.data?.detail || 'Xato yuz berdi');
    } finally {
      setEnrolling(false);
    }
  };

  const handleCompleteLesson = async () => {
    if (!activeLesson || !enrolled) return;
    setCompleting(true);
    try {
      const { data } = await coursesApi.completeLesson(activeLesson.id);
      setCompletedLessons(prev => new Set([...prev, activeLesson.id]));
      toast.success(`+${activeLesson.xp_reward} XP qo'shildi! 🎯`);

      // Move to next lesson
      if (course) {
        const currentIdx = course.lessons.findIndex(l => l.id === activeLesson.id);
        if (currentIdx < course.lessons.length - 1) {
          setActiveLesson(course.lessons[currentIdx + 1]);
        }
      }
      console.log(data);
    } catch {
      toast.error('Xato yuz berdi');
    } finally {
      setCompleting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-2 border-violet-500/30 border-t-violet-500 rounded-full animate-spin" />
      </div>
    );
  }

  if (!course) return null;

  const difficultyLabel: Record<string, string> = {
    beginner: "Boshlang'ich",
    intermediate: "O'rta",
    advanced: "Ilg'or",
  };

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 pt-20">
        {/* Back */}
        <Link href="/courses" className="inline-flex items-center gap-2 text-slate-500 hover:text-slate-300 text-sm mt-6 mb-6 transition-colors">
          <ChevronLeft size={16} />
          Kurslar
        </Link>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 pb-16">
          {/* Sidebar - Course info */}
          <div className="lg:col-span-1 order-2 lg:order-1">
            <div className="sticky top-24 space-y-5">
              {/* Course card */}
              <div className="glass-card rounded-2xl overflow-hidden">
                <div
                  className="h-1.5 w-full"
                  style={{ background: `linear-gradient(90deg, ${course.color_from}, ${course.color_to})` }}
                />
                <div className="p-6">
                  <div className="text-4xl mb-3">{course.icon || '📚'}</div>
                  <h1 className="font-display font-bold text-xl text-white mb-2">{course.title}</h1>
                  <p className="text-sm text-slate-400 mb-4 leading-relaxed">{course.short_description || course.description}</p>

                  <div className="flex flex-wrap gap-3 text-xs text-slate-500 mb-5">
                    <span className="flex items-center gap-1.5">
                      <BookOpen size={12} className="text-violet-400" />
                      {course.lessons.length} dars
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Clock size={12} className="text-cyan-400" />
                      {course.duration_hours}s
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Users size={12} className="text-amber-400" />
                      {course.enrolled_count || 0} o'quvchi
                    </span>
                  </div>

                  <div className="mb-5">
                    <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${
                      course.difficulty === 'beginner' ? 'badge-beginner' :
                      course.difficulty === 'intermediate' ? 'badge-intermediate' : 'badge-advanced'
                    }`}>
                      {difficultyLabel[course.difficulty]}
                    </span>
                  </div>

                  {!enrolled ? (
                    <button
                      onClick={handleEnroll}
                      disabled={enrolling}
                      className="w-full py-3 rounded-xl btn-glow text-white font-semibold text-sm flex items-center justify-center gap-2 disabled:opacity-50"
                    >
                      {enrolling ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <>
                          <Play size={15} />
                          Kursni boshlash
                        </>
                      )}
                    </button>
                  ) : (
                    <div className="flex items-center justify-center gap-2 py-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-sm font-medium">
                      <CheckCircle size={15} />
                      Yozilgansiz
                    </div>
                  )}
                </div>
              </div>

              {/* Lessons list */}
              <div className="glass-card rounded-2xl p-5">
                <h3 className="font-semibold text-white mb-4 flex items-center gap-2">
                  <BookOpen size={16} className="text-violet-400" />
                  Darslar ({course.lessons.length})
                </h3>
                <div className="space-y-2">
                  {course.lessons.map((lesson, idx) => {
                    const completed = completedLessons.has(lesson.id);
                    const isActive = activeLesson?.id === lesson.id;
                    return (
                      <button
                        key={lesson.id}
                        onClick={() => setActiveLesson(lesson)}
                        className={`w-full text-left p-3 rounded-xl transition-all group ${
                          isActive
                            ? 'bg-violet-600/20 border border-violet-500/30'
                            : 'hover:bg-white/5 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                            completed
                              ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                              : isActive
                              ? 'bg-violet-500/20 text-violet-400 border border-violet-500/30'
                              : 'bg-white/5 text-slate-500 border border-white/10'
                          }`}>
                            {completed ? <CheckCircle size={12} /> : idx + 1}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className={`text-xs font-medium truncate ${isActive ? 'text-violet-300' : 'text-slate-300'}`}>
                              {lesson.title}
                            </div>
                            <div className="flex items-center gap-2 mt-0.5">
                              <span className="text-[10px] text-slate-600">{lesson.duration_minutes}min</span>
                              <span className="text-[10px] text-amber-600 flex items-center gap-0.5">
                                <Zap size={8} />
                                {lesson.xp_reward}xp
                              </span>
                            </div>
                          </div>
                          {!enrolled && <Lock size={12} className="text-slate-600 flex-shrink-0" />}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Main content */}
          <div className="lg:col-span-2 order-1 lg:order-2">
            {activeLesson ? (
              <div className="glass-card rounded-2xl overflow-hidden">
                {/* Lesson header */}
                <div className="p-6 border-b border-white/[0.06]">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <div className="text-xs text-slate-500 mb-1 flex items-center gap-2">
                        <BookOpen size={12} />
                        {course.title}
                      </div>
                      <h2 className="font-display font-bold text-xl text-white">{activeLesson.title}</h2>
                    </div>
                    <div className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-amber-500/10 border border-amber-500/20">
                      <Zap size={12} className="text-amber-400" />
                      <span className="text-xs font-semibold text-amber-400">{activeLesson.xp_reward} XP</span>
                    </div>
                  </div>
                </div>

                {/* Lesson content */}
                <div className="p-6 prose-space">
                  <ReactMarkdown
                    remarkPlugins={[remarkGfm]}
                    components={{
                      code({ className, children, ...props }) {
                        const match = /language-(\w+)/.exec(className || '');
                        const isInline = !match;
                        return !isInline ? (
                          <SyntaxHighlighter
                            style={atomDark as Record<string, React.CSSProperties>}
                            language={match[1]}
                            PreTag="div"
                            customStyle={{
                              background: 'rgba(0,0,0,0.4)',
                              border: '1px solid rgba(255,255,255,0.08)',
                              borderRadius: '12px',
                              margin: '1rem 0',
                            }}
                          >
                            {String(children).replace(/\n$/, '')}
                          </SyntaxHighlighter>
                        ) : (
                          <code className={className} {...props}>
                            {children}
                          </code>
                        );
                      },
                    }}
                  >
                    {activeLesson.content}
                  </ReactMarkdown>
                </div>

                {/* Navigation */}
                <div className="p-6 border-t border-white/[0.06] flex items-center justify-between gap-4">
                  <button
                    onClick={() => {
                      const idx = course.lessons.findIndex(l => l.id === activeLesson.id);
                      if (idx > 0) setActiveLesson(course.lessons[idx - 1]);
                    }}
                    disabled={course.lessons[0]?.id === activeLesson.id}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass-card text-slate-400 text-sm hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    <ChevronLeft size={16} />
                    Oldingi
                  </button>

                  {enrolled && (
                    <button
                      onClick={handleCompleteLesson}
                      disabled={completing || completedLessons.has(activeLesson.id)}
                      className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                        completedLessons.has(activeLesson.id)
                          ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 cursor-default'
                          : 'btn-glow text-white disabled:opacity-50'
                      }`}
                    >
                      {completing ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : completedLessons.has(activeLesson.id) ? (
                        <><CheckCircle size={15} /> Bajarildi</>
                      ) : (
                        <><Trophy size={15} /> Darsni tugatish</>
                      )}
                    </button>
                  )}

                  <button
                    onClick={() => {
                      const idx = course.lessons.findIndex(l => l.id === activeLesson.id);
                      if (idx < course.lessons.length - 1) setActiveLesson(course.lessons[idx + 1]);
                    }}
                    disabled={course.lessons[course.lessons.length - 1]?.id === activeLesson.id}
                    className="flex items-center gap-2 px-4 py-2.5 rounded-xl glass-card text-slate-400 text-sm hover:text-slate-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all"
                  >
                    Keyingi
                    <ChevronRight size={16} />
                  </button>
                </div>
              </div>
            ) : (
              <div className="glass-card rounded-2xl p-12 text-center">
                <p className="text-slate-500">Dars tanlanmagan</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
