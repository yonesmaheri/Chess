export type CourseLevel = "beginner" | "intermediate" | "advanced";

export type CourseSortOption = "newest" | "popular" | "rating";

export type CourseCategory = {
  id: string;
  name: string;
  slug: string;
};

export type CourseInstructor = {
  id: string;
  name: string;
  avatarImage: string;
};

export type CourseListItem = {
  id: string;
  title: string;
  slug: string;
  description: string;
  thumbnailImage: string;
  previewVideoUrl: string;
  level: CourseLevel;
  category: CourseCategory;
  instructor: CourseInstructor;
  rating: number;
  reviewCount: number;
  studentCount: number;
  duration: string;
  totalLessons: number;
  price: number;
  isPublished: boolean;
  createdAt: string;
  updatedAt: string;
};

export type ListCoursesParams = {
  page?: number;
  limit?: number;
  level?: CourseLevel;
  category?: string;
  sort?: CourseSortOption;
  search?: string;
};

export type ListCoursesResponse = {
  courses: CourseListItem[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
};
