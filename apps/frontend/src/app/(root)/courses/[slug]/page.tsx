import { CourseDetailView } from "@/features/courseDetail";
import { CourseDetailErrorState } from "@/features/courseDetail/components/CourseDetailErrorState";
import { getServerCourseByIdOrSlug } from "@/shared/api/services/courses";

type CourseDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function CourseDetailPage({
  params,
}: CourseDetailPageProps) {
  const { slug } = await params;
  try {
    const course = await getServerCourseByIdOrSlug(slug);

    return <CourseDetailView course={course} />;
  } catch (error) {
    return <CourseDetailErrorState error={error} />;
  }
}
