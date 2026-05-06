import axios from 'axios';

const API_BASE = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const api = axios.create({
  baseURL: API_BASE,
  headers: { 'Content-Type': 'application/json' },
  withCredentials: false,
});

export interface Course {
  id: number;
  title: string;
  description: string;
  instructor: string;
  level: 'beginner' | 'intermediate' | 'advanced';
  duration: string;
  lessons: number;
  students: number;
  rating: number;
  image: string;
  price: number;
  isPremium: boolean;
  isNew: boolean;
  isPopular: boolean;
}

export const fetchCourses = async (): Promise<Course[]> => {
  const { data } = await api.get('/courses');
  return data.map((course: any) => ({
    ...course,
    image: course.image_url || 'https://picsum.photos/id/20/300/200',
    lessons: course.lessons_count,
    isPremium: course.price > 0,
    isNew: false,
    isPopular: false
  }));
};

export const fetchCourseById = async (id: number) => {
  const { data } = await api.get(`/courses/${id}`);
  return data;
};