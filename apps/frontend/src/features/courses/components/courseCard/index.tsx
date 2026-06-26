import Link from "next/link";
import { Star } from "lucide-react";
import type { CourseListItem } from "@/shared/api/services/courses";
import { Button } from "@/shared/components/ui/button";
import { formatStudentCount } from "../../lib/utils";
import CourseArtwork from "../courseArtwork";
import InstructorAvatar from "../instructorAvatar";

type CourseCardProps = {
  course: CourseListItem;
};

export default function CourseCard({ course }: CourseCardProps) {
  return (
    <article className="overflow-hidden rounded-[14px] border border-[#E8E8E3] bg-white shadow-[0_18px_42px_rgba(31,37,37,0.045)] transition-all duration-300 hover:-translate-y-1.5 hover:shadow-[0_26px_56px_rgba(31,37,37,0.08)]">
      <CourseArtwork course={course} />

      <div className="space-y-5 p-5">
        <div className="space-y-3">
          <h2 className="text-xl font-semibold leading-8 text-[#1F2525]">
            {course.title}
          </h2>

          <div className="flex items-center gap-3 text-sm text-[#7A7F7C]">
            <InstructorAvatar
              name={course.instructor.name}
              avatarImage={course.instructor.avatarImage}
            />
            <span>{course.instructor.name}</span>
          </div>

          <div className="flex items-center justify-between gap-3 text-sm">
            <div className="flex items-center gap-2 text-[#1F2525]">
              <Star className="h-4 w-4 fill-[#D89A00] text-[#D89A00]" />
              <span className="font-semibold">{course.rating.toFixed(1)}</span>
            </div>
            <span className="text-[#7A7F7C]">
              {formatStudentCount(course.studentCount)} دانشجو
            </span>
          </div>
        </div>

        <Button
          asChild
          className="h-10 w-full rounded-[8px] bg-[#547C5F] text-sm font-semibold text-white transition-all duration-300 hover:bg-[#486C53]"
        >
          <Link href={`/courses/${course.slug}`}>مشاهده دوره</Link>
        </Button>
      </div>
    </article>
  );
}
