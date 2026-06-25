import { CourseDetailView } from "@/features/courseDetail";

type CourseDetailPageProps = {
  params: Promise<{
    slug: string;
  }>;
};

export default async function CourseDetailPage({
  params,
}: CourseDetailPageProps) {
  // const { slug } = await params;

  return <CourseDetailView slug={'asdasd'} />;
}
