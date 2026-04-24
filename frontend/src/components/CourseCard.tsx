'use client';
import Link from 'next/link';
import { Course } from '@/types';
import { Clock, BookOpen, Users, Zap, Youtube } from 'lucide-react';

interface CourseCardProps {
  course: Course & { youtube_url?: string };
  enrolled?: boolean;
  progress?: number;
}

const difficultyLabel = { beginner: "Boshlang'ich", intermediate: "O'rta", advanced: "Ilg'or" };
const difficultyClass = { beginner: "badge-beginner", intermediate: "badge-intermediate", advanced: "badge-advanced" };

function getYoutubeId(url?: string | null) {
  if (!url) return null;
  const m = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/);
  return m ? m[1] : null;
}

export default function CourseCard({ course, enrolled, progress }: CourseCardProps) {
  const youtubeId = getYoutubeId(course.youtube_url);
  const thumbUrl = youtubeId ? `https://img.youtube.com/vi/${youtubeId}/hqdefault.jpg` : null;

  return (
    <Link href={`/courses/${course.slug}`}>
      <div className="glass-card rounded-2xl overflow-hidden h-full cursor-pointer group">
        {/* YouTube thumbnail yoki gradient banner */}
        {thumbUrl ? (
          <div className="relative h-40 overflow-hidden">
            <img src={thumbUrl} alt={course.title}
              className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
            <div className="absolute inset-0" style={{ background: 'linear-gradient(to top, rgba(6,11,20,0.9) 0%, transparent 60%)' }} />
            <div className="absolute top-2 right-2 flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium"
              style={{ background: 'rgba(255,0,0,0.85)', color: 'white' }}>
              <Youtube size={10} /> YouTube
            </div>
            <div className="absolute bottom-2 left-3 text-2xl">{course.icon || '📚'}</div>
          </div>
        ) : (
          <div className="h-2 w-full" style={{ background: `linear-gradient(90deg, ${course.color_from}, ${course.color_to})` }} />
        )}

        <div className="p-5 flex flex-col h-full">
          {/* Icon (thumbnail bo'lmasa) + badges */}
          {!thumbUrl && (
            <div className="flex items-start justify-between mb-4">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center text-2xl shadow-lg"
                style={{ background: `linear-gradient(135deg, ${course.color_from}20, ${course.color_to}20)`, border: `1px solid ${course.color_from}30` }}>
                {course.icon || '📚'}
              </div>
              <div className="flex flex-col items-end gap-1.5">
                <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${difficultyClass[course.difficulty]}`}>
                  {difficultyLabel[course.difficulty]}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                  style={{ color: '#00E676', background: 'rgba(0,230,118,0.12)', border: '1px solid rgba(0,230,118,0.25)' }}>
                  {course.is_free ? 'Bepul' : 'Premium'}
                </span>
              </div>
            </div>
          )}

          {/* Thumbnail bo'lsa badges alohida */}
          {thumbUrl && (
            <div className="flex gap-2 mb-3">
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${difficultyClass[course.difficulty]}`}>
                {difficultyLabel[course.difficulty]}
              </span>
              <span className="text-xs px-2 py-0.5 rounded-full font-medium"
                style={{ color: '#00E676', background: 'rgba(0,230,118,0.12)', border: '1px solid rgba(0,230,118,0.25)' }}>
                {course.is_free ? 'Bepul' : 'Premium'}
              </span>
            </div>
          )}

          <h3 className="font-display font-bold text-base text-white mb-2 group-hover:text-teal-300 transition-colors leading-snug flex-grow"
            style={{ color: '#E8F4F4' }}>
            {course.title}
          </h3>

          <p className="text-xs mb-3 line-clamp-2 leading-relaxed" style={{ color: '#6A9090' }}>
            {course.short_description || course.description}
          </p>

          {/* Stats */}
          <div className="flex items-center gap-3 text-xs mb-4" style={{ color: '#4A7A7A' }}>
            <span className="flex items-center gap-1">
              <BookOpen size={11} style={{ color: '#00C2D4' }} />
              {course.lessons_count || course.lessons?.length || 0} dars
            </span>
            <span className="flex items-center gap-1">
              <Clock size={11} style={{ color: '#00E676' }} />
              {course.duration_hours}s
            </span>
            {course.enrolled_count !== undefined && (
              <span className="flex items-center gap-1">
                <Users size={11} style={{ color: '#00C2D4' }} />
                {course.enrolled_count}
              </span>
            )}
          </div>

          {/* Progress */}
          {enrolled && progress !== undefined && (
            <div className="mb-4">
              <div className="flex justify-between items-center mb-1">
                <span className="text-xs" style={{ color: '#4A7A7A' }}>Progress</span>
                <span className="text-xs font-medium" style={{ color: '#00C2D4' }}>{Math.round(progress)}%</span>
              </div>
              <div className="h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(0,194,212,0.1)' }}>
                <div className="progress-bar h-full" style={{ width: `${progress}%` }} />
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="w-full py-2 rounded-xl text-center text-sm font-medium transition-all"
            style={{
              background: `linear-gradient(135deg, ${course.color_from}18, ${course.color_to}18)`,
              border: `1px solid ${course.color_from}35`,
              color: course.color_from,
            }}>
            {enrolled
              ? <span className="flex items-center justify-center gap-1.5"><Zap size={13} />Davom etish</span>
              : 'Boshlash →'
            }
          </div>
        </div>
      </div>
    </Link>
  );
}
