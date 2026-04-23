export interface User {
  id: number;
  email: string;
  username: string;
  full_name: string;
  avatar_url?: string;
  bio?: string;
  is_active: boolean;
  is_admin: boolean;
  xp_points: number;
  level: number;
  created_at: string;
}

export interface Lesson {
  id: number;
  course_id: number;
  title: string;
  content: string;
  order_index: number;
  duration_minutes: number;
  has_quiz: boolean;
  quiz_data?: string;
  xp_reward: number;
  created_at: string;
}

export interface Course {
  id: number;
  title: string;
  slug: string;
  description: string;
  short_description?: string;
  thumbnail_url?: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  duration_hours: number;
  is_published: boolean;
  is_free: boolean;
  order_index: number;
  icon?: string;
  color_from: string;
  color_to: string;
  created_at: string;
  lessons: Lesson[];
  lessons_count?: number;
  enrolled_count?: number;
}

export interface Enrollment {
  id: number;
  user_id: number;
  course_id: number;
  progress_percent: number;
  completed: boolean;
  enrolled_at: string;
  course?: Course;
}

export interface ChatMessage {
  id: number;
  session_id: number;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at: string;
}

export interface ChatSession {
  id: number;
  title: string;
  created_at: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  setUser: (user: User | null) => void;
  setToken: (token: string | null) => void;
  logout: () => void;
}

export interface UserStats {
  user: User;
  enrollments_count: number;
  completed_courses: number;
  completed_lessons: number;
  xp_points: number;
  level: number;
  next_level_xp: number;
}
