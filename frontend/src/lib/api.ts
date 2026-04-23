import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://aiteacher-roan.vercel.app/_/backend';

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/auth/login';
    }
    return Promise.reject(error);
  }
);

// Auth
export const authApi = {
  register: (data: { email: string; username: string; full_name: string; password: string }) =>
    api.post('/api/auth/register', data),
  login: (data: { email: string; password: string }) =>
    api.post('/api/auth/login', data),
  me: () => api.get('/api/auth/me'),
};

// Courses
export const coursesApi = {
  getAll: () => api.get('/api/courses/'),
  getBySlug: (slug: string) => api.get(`/api/courses/${slug}`),
  enroll: (courseId: number) => api.post(`/api/courses/${courseId}/enroll`),
  getMyEnrollments: () => api.get('/api/courses/my/enrollments'),
  completeLesson: (lessonId: number, quizScore?: number) =>
    api.post('/api/courses/lessons/progress', { lesson_id: lessonId, quiz_score: quizScore }),
};

// Chat
export const chatApi = {
  getSessions: () => api.get('/api/chat/sessions'),
  createSession: () => api.post('/api/chat/sessions'),
  getMessages: (sessionId: number) => api.get(`/api/chat/sessions/${sessionId}/messages`),
  sendMessage: (content: string, sessionId?: number) =>
    api.post('/api/chat/send', { content, session_id: sessionId }),
  deleteSession: (sessionId: number) => api.delete(`/api/chat/sessions/${sessionId}`),
};

// Users
export const usersApi = {
  getStats: () => api.get('/api/users/me/stats'),
  updateProfile: (data: { full_name?: string; bio?: string; avatar_url?: string }) =>
    api.put('/api/users/me', data),
  getLeaderboard: () => api.get('/api/users/leaderboard'),
};

export default api;
