'use client';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import api from '@/lib/api';
import { Course } from '@/types';
import toast from 'react-hot-toast';
import {
  Plus, Edit2, Trash2, Eye, EyeOff, LogOut,
  BookOpen, Youtube, ChevronDown, ChevronUp, X, Save, Loader
} from 'lucide-react';

interface AdminLesson {
  id: number;
  title: string;
  content: string;
  order_index: number;
  duration_minutes: number;
  xp_reward: number;
}

const DIFFICULTIES = [
  { value: 'beginner', label: "Boshlang'ich" },
  { value: 'intermediate', label: "O'rta" },
  { value: 'advanced', label: "Ilg'or" },
];

const EMPTY_COURSE = {
  title: '', slug: '', description: '', short_description: '',
  difficulty: 'beginner', duration_hours: 1, is_free: true,
  icon: '📚', youtube_url: '', color_from: '#00C2D4', color_to: '#00E676',
};

const EMPTY_LESSON = {
  title: '', content: '', order_index: 1, duration_minutes: 15, xp_reward: 50, youtube_url: '',
};

function getYoutubeThumb(url?: string | null) {
  if (!url) return null;
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
  return m ? `https://img.youtube.com/vi/${m[1]}/hqdefault.jpg` : null;
}

function slugify(text: string) {
  return text.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '').slice(0, 60);
}

export default function AdminDashboard() {
  const router = useRouter();
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [expandedCourse, setExpandedCourse] = useState<number | null>(null);
  const [lessons, setLessons] = useState<Record<number, AdminLesson[]>>({});

  // Modals
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [editingCourse, setEditingCourse] = useState<Course | null>(null);
  const [courseForm, setCourseForm] = useState(EMPTY_COURSE);

  const [showLessonModal, setShowLessonModal] = useState(false);
  const [editingLesson, setEditingLesson] = useState<AdminLesson | null>(null);
  const [lessonForm, setLessonForm] = useState(EMPTY_LESSON);
  const [lessonCourseId, setLessonCourseId] = useState<number | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('admin_token');
    if (!token) { router.push('/admin'); return; }
    api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    loadCourses();
  }, [router]);

  const loadCourses = async () => {
    try {
      const { data } = await api.get('/api/admin/courses');
      setCourses(data);
    } catch {
      toast.error('Yuklashda xato');
    } finally {
      setLoading(false);
    }
  };

  const loadLessons = async (courseId: number) => {
    const { data } = await api.get(`/api/admin/courses/${courseId}/lessons`);
    setLessons(prev => ({ ...prev, [courseId]: data }));
  };

  const toggleExpand = async (id: number) => {
    if (expandedCourse === id) { setExpandedCourse(null); return; }
    setExpandedCourse(id);
    if (!lessons[id]) await loadLessons(id);
  };

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    router.push('/admin');
  };

  // Course CRUD
  const openAddCourse = () => {
    setEditingCourse(null);
    setCourseForm(EMPTY_COURSE);
    setShowCourseModal(true);
  };

  const openEditCourse = (c: Course) => {
    setEditingCourse(c);
    setCourseForm({
      title: c.title, slug: c.slug, description: c.description,
      short_description: c.short_description || '',
      difficulty: c.difficulty, duration_hours: c.duration_hours,
      is_free: c.is_free, icon: c.icon || '📚',
      youtube_url: (c as Course & { youtube_url?: string }).youtube_url || '',
      color_from: c.color_from, color_to: c.color_to,
    });
    setShowCourseModal(true);
  };

  const saveCourse = async () => {
    if (!courseForm.title || !courseForm.slug) { toast.error('Nom va slug kerak'); return; }
    setSaving(true);
    try {
      if (editingCourse) {
        await api.put(`/api/admin/courses/${editingCourse.id}`, courseForm);
        toast.success('Kurs yangilandi');
      } else {
        await api.post('/api/admin/courses', courseForm);
        toast.success('Kurs yaratildi');
      }
      setShowCourseModal(false);
      loadCourses();
    } catch (e: unknown) {
      const err = e as { response?: { data?: { detail?: string } } };
      toast.error(err?.response?.data?.detail || 'Xato');
    } finally {
      setSaving(false);
    }
  };

  const deleteCourse = async (id: number) => {
    if (!confirm('Kursni o\'chirmoqchimisiz?')) return;
    await api.delete(`/api/admin/courses/${id}`);
    toast.success('O\'chirildi');
    loadCourses();
  };

  const togglePublish = async (id: number) => {
    await api.patch(`/api/admin/courses/${id}/publish`);
    loadCourses();
  };

  // Lesson CRUD
  const openAddLesson = (courseId: number) => {
    setLessonCourseId(courseId);
    setEditingLesson(null);
    setLessonForm({ ...EMPTY_LESSON, order_index: (lessons[courseId]?.length || 0) + 1 });
    setShowLessonModal(true);
  };

  const openEditLesson = (lesson: AdminLesson, courseId: number) => {
    setLessonCourseId(courseId);
    setEditingLesson(lesson);
    setLessonForm({
      title: lesson.title, content: lesson.content,
      order_index: lesson.order_index, duration_minutes: lesson.duration_minutes,
      xp_reward: lesson.xp_reward, youtube_url: '',
    });
    setShowLessonModal(true);
  };

  const saveLesson = async () => {
    if (!lessonForm.title) { toast.error('Dars nomi kerak'); return; }
    setSaving(true);
    try {
      if (editingLesson) {
        await api.put(`/api/admin/lessons/${editingLesson.id}`, lessonForm);
        toast.success('Dars yangilandi');
      } else {
        await api.post(`/api/admin/courses/${lessonCourseId}/lessons`, lessonForm);
        toast.success('Dars qo\'shildi');
      }
      setShowLessonModal(false);
      if (lessonCourseId) loadLessons(lessonCourseId);
    } catch {
      toast.error('Xato');
    } finally {
      setSaving(false);
    }
  };

  const deleteLesson = async (lessonId: number, courseId: number) => {
    if (!confirm('Darsni o\'chirmoqchimisiz?')) return;
    await api.delete(`/api/admin/lessons/${lessonId}`);
    loadLessons(courseId);
    toast.success('Dars o\'chirildi');
  };

  const bg = '#060B14';
  const card = 'rgba(0,194,212,0.05)';
  const border = 'rgba(0,194,212,0.15)';
  const teal = '#00C2D4';
  const green = '#00E676';

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center" style={{ background: bg }}>
      <Loader className="animate-spin text-teal-400" size={32} />
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: bg }}>
      {/* Header */}
      <div className="sticky top-0 z-40 px-6 py-4 flex items-center justify-between" style={{ background: 'rgba(6,11,20,0.95)', backdropFilter: 'blur(12px)', borderBottom: `1px solid ${border}` }}>
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `linear-gradient(135deg, ${teal}, ${green})` }}>
            <BookOpen size={16} className="text-white" />
          </div>
          <span className="font-bold text-white">Admin Panel</span>
          <span className="text-xs px-2 py-0.5 rounded-full" style={{ background: 'rgba(0,230,118,0.15)', color: green, border: `1px solid ${green}40` }}>
            {courses.length} kurs
          </span>
        </div>
        <div className="flex items-center gap-3">
          <button onClick={openAddCourse}
            className="flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all"
            style={{ background: `linear-gradient(135deg, ${teal}, ${green})`, color: bg }}>
            <Plus size={15} /> Kurs qo'shish
          </button>
          <button onClick={handleLogout}
            className="p-2 rounded-xl transition-all"
            style={{ border: `1px solid ${border}`, color: '#6B8A8A' }}>
            <LogOut size={16} />
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-6 py-8 space-y-4">
        {courses.length === 0 ? (
          <div className="text-center py-20" style={{ color: '#3A5A5A' }}>
            <BookOpen size={40} className="mx-auto mb-3 opacity-40" />
            <p>Hali kurslar yo'q. "Kurs qo'shish" tugmasini bosing.</p>
          </div>
        ) : courses.map(course => {
          const thumb = getYoutubeThumb((course as Course & { youtube_url?: string }).youtube_url);
          const isExpanded = expandedCourse === course.id;
          return (
            <div key={course.id} className="rounded-2xl overflow-hidden" style={{ background: card, border: `1px solid ${border}` }}>
              {/* Course row */}
              <div className="flex items-center gap-4 p-4">
                {/* Thumbnail or icon */}
                <div className="w-14 h-14 rounded-xl overflow-hidden flex-shrink-0 flex items-center justify-center text-2xl"
                  style={{ background: thumb ? 'transparent' : `linear-gradient(135deg, ${course.color_from}30, ${course.color_to}30)`, border: `1px solid ${course.color_from}30` }}>
                  {thumb ? <img src={thumb} alt="" className="w-full h-full object-cover" /> : (course.icon || '📚')}
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-0.5">
                    <h3 className="font-semibold text-white truncate">{course.title}</h3>
                    <span className="text-xs px-2 py-0.5 rounded-full flex-shrink-0"
                      style={{ background: course.is_published ? 'rgba(0,230,118,0.15)' : 'rgba(255,100,100,0.15)', color: course.is_published ? green : '#FF6464', border: `1px solid ${course.is_published ? green : '#FF6464'}40` }}>
                      {course.is_published ? 'Aktiv' : 'Yashirin'}
                    </span>
                  </div>
                  <p className="text-xs truncate" style={{ color: '#6B8A8A' }}>{course.short_description || course.description}</p>
                </div>

                <div className="flex items-center gap-2 flex-shrink-0">
                  <button onClick={() => togglePublish(course.id)} title="Ko'rsat/Yashir"
                    className="p-2 rounded-lg transition-all" style={{ border: `1px solid ${border}`, color: '#6B8A8A' }}>
                    {course.is_published ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                  <button onClick={() => openEditCourse(course)}
                    className="p-2 rounded-lg transition-all" style={{ border: `1px solid ${border}`, color: teal }}>
                    <Edit2 size={14} />
                  </button>
                  <button onClick={() => deleteCourse(course.id)}
                    className="p-2 rounded-lg transition-all" style={{ border: `1px solid rgba(255,100,100,0.3)`, color: '#FF6464' }}>
                    <Trash2 size={14} />
                  </button>
                  <button onClick={() => toggleExpand(course.id)}
                    className="p-2 rounded-lg transition-all" style={{ border: `1px solid ${border}`, color: '#6B8A8A' }}>
                    {isExpanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                  </button>
                </div>
              </div>

              {/* Lessons */}
              {isExpanded && (
                <div style={{ borderTop: `1px solid ${border}` }}>
                  <div className="px-4 py-3 flex items-center justify-between">
                    <span className="text-xs font-medium" style={{ color: '#6B8A8A' }}>
                      {lessons[course.id]?.length || 0} ta dars
                    </span>
                    <button onClick={() => openAddLesson(course.id)}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-medium"
                      style={{ background: `${teal}15`, color: teal, border: `1px solid ${teal}30` }}>
                      <Plus size={12} /> Dars qo'shish
                    </button>
                  </div>
                  <div className="px-4 pb-4 space-y-2">
                    {(lessons[course.id] || []).map((lesson, idx) => (
                      <div key={lesson.id} className="flex items-center gap-3 p-3 rounded-xl"
                        style={{ background: 'rgba(0,194,212,0.04)', border: `1px solid ${border}` }}>
                        <span className="w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0"
                          style={{ background: `${teal}20`, color: teal }}>{idx + 1}</span>
                        <span className="flex-1 text-sm text-white truncate">{lesson.title}</span>
                        <span className="text-xs" style={{ color: '#4A7A7A' }}>{lesson.duration_minutes}min</span>
                        <div className="flex gap-1">
                          <button onClick={() => openEditLesson(lesson, course.id)}
                            className="p-1.5 rounded-lg" style={{ color: teal }}>
                            <Edit2 size={12} />
                          </button>
                          <button onClick={() => deleteLesson(lesson.id, course.id)}
                            className="p-1.5 rounded-lg" style={{ color: '#FF6464' }}>
                            <Trash2 size={12} />
                          </button>
                        </div>
                      </div>
                    ))}
                    {(lessons[course.id] || []).length === 0 && (
                      <p className="text-center text-xs py-4" style={{ color: '#3A5A5A' }}>Hali darslar yo'q</p>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Course Modal */}
      {showCourseModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
          <div className="w-full max-w-lg rounded-2xl p-6 max-h-[90vh] overflow-y-auto" style={{ background: '#0A1020', border: `1px solid ${border}` }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-white text-lg">{editingCourse ? 'Kursni tahrirlash' : 'Yangi kurs'}</h2>
              <button onClick={() => setShowCourseModal(false)} style={{ color: '#6B8A8A' }}><X size={20} /></button>
            </div>

            <div className="space-y-4">
              {[
                { label: 'Kurs nomi *', key: 'title', placeholder: 'Masalan: Python asoslari' },
                { label: 'Slug *', key: 'slug', placeholder: 'python-asoslari' },
                { label: 'Icon (emoji)', key: 'icon', placeholder: '🐍' },
              ].map(({ label, key, placeholder }) => (
                <div key={key}>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: '#94B4B4' }}>{label}</label>
                  <input
                    value={(courseForm as Record<string, unknown>)[key] as string}
                    onChange={e => {
                      const val = e.target.value;
                      setCourseForm(prev => ({
                        ...prev,
                        [key]: val,
                        ...(key === 'title' && !editingCourse ? { slug: slugify(val) } : {}),
                      }));
                    }}
                    placeholder={placeholder}
                    className="w-full px-3 py-2.5 rounded-xl text-sm text-white outline-none"
                    style={{ background: 'rgba(0,194,212,0.08)', border: `1px solid ${border}` }}
                  />
                </div>
              ))}

              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: '#94B4B4' }}>Qisqa tavsif</label>
                <input
                  value={courseForm.short_description}
                  onChange={e => setCourseForm({ ...courseForm, short_description: e.target.value })}
                  placeholder="1-2 jumlada..."
                  className="w-full px-3 py-2.5 rounded-xl text-sm text-white outline-none"
                  style={{ background: 'rgba(0,194,212,0.08)', border: `1px solid ${border}` }}
                />
              </div>

              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: '#94B4B4' }}>Tavsif *</label>
                <textarea
                  value={courseForm.description}
                  onChange={e => setCourseForm({ ...courseForm, description: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2.5 rounded-xl text-sm text-white outline-none resize-none"
                  style={{ background: 'rgba(0,194,212,0.08)', border: `1px solid ${border}` }}
                />
              </div>

              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: '#94B4B4' }}>
                  <Youtube size={12} className="inline mr-1" /> YouTube URL (asosiy video)
                </label>
                <input
                  value={courseForm.youtube_url}
                  onChange={e => setCourseForm({ ...courseForm, youtube_url: e.target.value })}
                  placeholder="https://youtube.com/watch?v=..."
                  className="w-full px-3 py-2.5 rounded-xl text-sm text-white outline-none"
                  style={{ background: 'rgba(0,194,212,0.08)', border: `1px solid rgba(255,0,0,0.2)` }}
                />
                {courseForm.youtube_url && getYoutubeThumb(courseForm.youtube_url) && (
                  <img src={getYoutubeThumb(courseForm.youtube_url)!} alt="thumb" className="mt-2 rounded-xl w-full h-32 object-cover" />
                )}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: '#94B4B4' }}>Daraja</label>
                  <select
                    value={courseForm.difficulty}
                    onChange={e => setCourseForm({ ...courseForm, difficulty: e.target.value })}
                    className="w-full px-3 py-2.5 rounded-xl text-sm text-white outline-none"
                    style={{ background: '#0A1020', border: `1px solid ${border}` }}
                  >
                    {DIFFICULTIES.map(d => <option key={d.value} value={d.value}>{d.label}</option>)}
                  </select>
                </div>
                <div>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: '#94B4B4' }}>Davomiyligi (soat)</label>
                  <input
                    type="number" min={0} step={0.5}
                    value={courseForm.duration_hours}
                    onChange={e => setCourseForm({ ...courseForm, duration_hours: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2.5 rounded-xl text-sm text-white outline-none"
                    style={{ background: 'rgba(0,194,212,0.08)', border: `1px solid ${border}` }}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: '#94B4B4' }}>Rang 1</label>
                  <input type="color" value={courseForm.color_from}
                    onChange={e => setCourseForm({ ...courseForm, color_from: e.target.value })}
                    className="w-full h-10 rounded-xl cursor-pointer"
                    style={{ background: 'rgba(0,194,212,0.08)', border: `1px solid ${border}` }}
                  />
                </div>
                <div>
                  <label className="text-xs font-medium mb-1.5 block" style={{ color: '#94B4B4' }}>Rang 2</label>
                  <input type="color" value={courseForm.color_to}
                    onChange={e => setCourseForm({ ...courseForm, color_to: e.target.value })}
                    className="w-full h-10 rounded-xl cursor-pointer"
                    style={{ background: 'rgba(0,194,212,0.08)', border: `1px solid ${border}` }}
                  />
                </div>
              </div>

              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={courseForm.is_free}
                  onChange={e => setCourseForm({ ...courseForm, is_free: e.target.checked })}
                  className="w-4 h-4 rounded" />
                <span className="text-sm" style={{ color: '#94B4B4' }}>Bepul kurs</span>
              </label>
            </div>

            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowCourseModal(false)}
                className="flex-1 py-2.5 rounded-xl text-sm"
                style={{ border: `1px solid ${border}`, color: '#6B8A8A' }}>
                Bekor
              </button>
              <button onClick={saveCourse} disabled={saving}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
                style={{ background: `linear-gradient(135deg, ${teal}, ${green})`, color: bg }}>
                {saving ? <Loader size={14} className="animate-spin" /> : <><Save size={14} /> Saqlash</>}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Lesson Modal */}
      {showLessonModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)' }}>
          <div className="w-full max-w-2xl rounded-2xl p-6 max-h-[90vh] overflow-y-auto" style={{ background: '#0A1020', border: `1px solid ${border}` }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="font-bold text-white text-lg">{editingLesson ? 'Darsni tahrirlash' : 'Yangi dars'}</h2>
              <button onClick={() => setShowLessonModal(false)} style={{ color: '#6B8A8A' }}><X size={20} /></button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: '#94B4B4' }}>Dars nomi *</label>
                <input value={lessonForm.title}
                  onChange={e => setLessonForm({ ...lessonForm, title: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl text-sm text-white outline-none"
                  style={{ background: 'rgba(0,194,212,0.08)', border: `1px solid ${border}` }}
                  placeholder="Masalan: Python ga kirish"
                />
              </div>
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: '#94B4B4' }}>
                  <Youtube size={12} className="inline mr-1" /> YouTube URL (dars uchun)
                </label>
                <input value={lessonForm.youtube_url}
                  onChange={e => setLessonForm({ ...lessonForm, youtube_url: e.target.value })}
                  className="w-full px-3 py-2.5 rounded-xl text-sm text-white outline-none"
                  style={{ background: 'rgba(0,194,212,0.08)', border: `1px solid rgba(255,0,0,0.2)` }}
                  placeholder="https://youtube.com/watch?v=..."
                />
              </div>
              <div>
                <label className="text-xs font-medium mb-1.5 block" style={{ color: '#94B4B4' }}>
                  Mazmun (Markdown qo'llab-quvvatlanadi)
                </label>
                <textarea value={lessonForm.content}
                  onChange={e => setLessonForm({ ...lessonForm, content: e.target.value })}
                  rows={8}
                  placeholder="# Dars nomi&#10;&#10;Dars mazmuni shu yerga..."
                  className="w-full px-3 py-2.5 rounded-xl text-sm text-white outline-none resize-none font-mono"
                  style={{ background: 'rgba(0,194,212,0.08)', border: `1px solid ${border}` }}
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  { label: 'Tartib raqami', key: 'order_index', type: 'number' },
                  { label: 'Vaqt (daqiqa)', key: 'duration_minutes', type: 'number' },
                  { label: 'XP mukofot', key: 'xp_reward', type: 'number' },
                ].map(({ label, key, type }) => (
                  <div key={key}>
                    <label className="text-xs font-medium mb-1.5 block" style={{ color: '#94B4B4' }}>{label}</label>
                    <input type={type}
                      value={(lessonForm as Record<string, unknown>)[key] as number}
                      onChange={e => setLessonForm({ ...lessonForm, [key]: parseInt(e.target.value) })}
                      className="w-full px-3 py-2.5 rounded-xl text-sm text-white outline-none"
                      style={{ background: 'rgba(0,194,212,0.08)', border: `1px solid ${border}` }}
                    />
                  </div>
                ))}
              </div>
            </div>
            <div className="flex gap-3 mt-6">
              <button onClick={() => setShowLessonModal(false)}
                className="flex-1 py-2.5 rounded-xl text-sm"
                style={{ border: `1px solid ${border}`, color: '#6B8A8A' }}>
                Bekor
              </button>
              <button onClick={saveLesson} disabled={saving}
                className="flex-1 py-2.5 rounded-xl text-sm font-semibold flex items-center justify-center gap-2"
                style={{ background: `linear-gradient(135deg, ${teal}, ${green})`, color: bg }}>
                {saving ? <Loader size={14} className="animate-spin" /> : <><Save size={14} /> Saqlash</>}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
