'use client';
import Link from 'next/link';
import { Course } from '@/types';
import { Clock, BookOpen, Users, Zap, Lock } from 'lucide-react';

interface CourseCardProps {
  course: Course;
  enrolled?: boolean;
  progress?: number;
}

const difficultyLabel = {
  beginner: "Boshlang'ich",
  intermediate: "O'rta",
  advanced: "Ilg'or",
};

const difficultyClass = {
  beginner: "badge-beginner",
  intermediate: "badge-intermediate",
  advanced: "badge-advanced",
};

export default function CourseCard({ course, enrolled, progress }: CourseCardProps) {
  return (
    <Link href={`/courses/${course.slug}`}>
      <div className="glass-card rounded-2xl overflow-hidden h-full cursor-pointer group">
        {/* Top gradient banner */}
        <div
          className="h-2 w-full"
          style={{ background: `linear-gradient(90deg, ${course.color_from}, ${course.color_to})` }}
        />

        <div className="p-6 flex flex-col h-full">
          {/* Icon and badges row */}
          <div className="flex items-start justify-between mb-4">
            <div
              className="w-14 h-14 rounded-2xl flex items-center justify-center text-3xl shadow-lg"
              style={{
                background: `linear-gradient(135deg, ${course.color_from}20, ${course.color_to}20)`,
                border: `1px solid ${course.color_from}30`,
              }}
            >
              {course.icon || '📚'}
            </div>

            <div className="flex flex-col items-end gap-2">
              <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${difficultyClass[course.difficulty]}`}>
                {difficultyLabel[course.difficulty]}
              </span>
              {course.is_free ? (
                <span className="text-xs px-2.5 py-1 rounded-full font-medium text-emerald-400 bg-emerald-500/15 border border-emerald-500/30">
                  Bepul
                </span>
              ) : (
                <span className="text-xs px-2.5 py-1 rounded-full font-medium text-amber-400 bg-amber-500/15 border border-amber-500/30 flex items-center gap-1">
                  <Lock size={10} />
                  Premium
                </span>
              )}
            </div>
          </div>

          {/* Title */}
          <h3 className="font-display font-bold text-lg text-white mb-2 group-hover:text-violet-300 transition-colors leading-tight">
            {course.title}
          </h3>

          {/* Description */}
          <p className="text-sm text-slate-400 mb-4 line-clamp-2 leading-relaxed flex-grow">
            {course.short_description || course.description}
          </p>

          {/* Stats */}
          <div className="flex items-center gap-4 text-xs text-slate-500 mb-4">
            <span className="flex items-center gap-1.5">
              <BookOpen size={12} className="text-violet-400" />
              {course.lessons_count || course.lessons?.length || 0} dars
            </span>
            <span className="flex items-center gap-1.5">
              <Clock size={12} className="text-cyan-400" />
              {course.duration_hours}s
            </span>
            {course.enrolled_count !== undefined && (
              <span className="flex items-center gap-1.5">
                <Users size={12} className="text-amber-400" />
                {course.enrolled_count}
              </span>
            )}
          </div>

          {/* Progress bar (if enrolled) */}
          {enrolled && progress !== undefined && (
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1.5">
                <span className="text-xs text-slate-400">Progress</span>
                <span className="text-xs font-medium text-violet-400">{Math.round(progress)}%</span>
              </div>
              <div className="h-1.5 bg-white/5 rounded-full overflow-hidden">
                <div
                  className="progress-bar h-full"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          )}

          {/* CTA */}
          <div
            className="w-full py-2.5 rounded-xl text-center text-sm font-medium transition-all duration-200 group-hover:shadow-lg"
            style={{
              background: `linear-gradient(135deg, ${course.color_from}25, ${course.color_to}25)`,
              border: `1px solid ${course.color_from}40`,
              color: course.color_from,
            }}
          >
            {enrolled ? (
              <span className="flex items-center justify-center gap-2">
                <Zap size={14} />
                Davom etish
              </span>
            ) : "Kursni boshlash →"}
          </div>
        </div>
      </div>
    </Link>
  );
}
