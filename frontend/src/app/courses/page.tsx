'use client';
import { useEffect, useState } from 'react';
import Navbar from '@/components/Navbar';
import CourseCard from '@/components/CourseCard';
import { coursesApi } from '@/lib/api';
import { Course } from '@/types';
import { BookOpen, Filter } from 'lucide-react';

const difficultyFilters = [
  { value: '', label: 'Barchasi' },
  { value: 'beginner', label: "Boshlang'ich" },
  { value: 'intermediate', label: "O'rta" },
  { value: 'advanced', label: "Ilg'or" },
];

export default function CoursesPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('');

  useEffect(() => {
    coursesApi.getAll()
      .then(({ data }) => setCourses(data))
      .finally(() => setLoading(false));
  }, []);

  const filtered = filter ? courses.filter(c => c.difficulty === filter) : courses;

  return (
    <div className="min-h-screen">
      <Navbar />
      <div className="max-w-7xl mx-auto px-4 pt-24 pb-16">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-violet-500/10 border border-violet-500/30 text-violet-300 text-sm font-medium mb-6">
            <BookOpen size={14} />
            {courses.length} ta kurs mavjud
          </div>
          <h1 className="font-display font-bold text-4xl sm:text-5xl text-white mb-4">
            AI <span className="gradient-text">Kurslar</span>
          </h1>
          <p className="text-slate-400 text-lg max-w-xl mx-auto">
            Boshlang'ichdan professional darajagacha — barcha AI mavzulari
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-2 mb-8 flex-wrap">
          <Filter size={16} className="text-slate-500" />
          {difficultyFilters.map(({ value, label }) => (
            <button
              key={value}
              onClick={() => setFilter(value)}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-all ${
                filter === value
                  ? 'bg-violet-600 text-white shadow-glow-purple'
                  : 'glass-card text-slate-400 hover:text-slate-200'
              }`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <div key={i} className="rounded-2xl overflow-hidden h-72">
                <div className="h-2 skeleton" />
                <div className="p-6 space-y-4 glass-card h-full">
                  <div className="h-12 w-12 rounded-2xl skeleton" />
                  <div className="h-5 rounded skeleton w-3/4" />
                  <div className="h-4 rounded skeleton w-full" />
                  <div className="h-4 rounded skeleton w-2/3" />
                </div>
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="text-center py-20">
            <BookOpen size={48} className="text-slate-700 mx-auto mb-4" />
            <p className="text-slate-500">Bu kategoriyada kurslar topilmadi</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map(course => (
              <CourseCard key={course.id} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
