"use client";

import { useEffect, useMemo, useState } from "react";

import { type CourseDetail } from "@/shared/api/services/courses";
import { Tabs, TabsContent } from "@/shared/components/ui/tabs";
import { CourseHero } from "./components/CourseHero";
import { CourseTabs } from "./components/CourseTabs";
import { CurriculumContent } from "./components/CurriculumContent";
import { FeaturePill } from "./components/FeaturePill";
import { InstructorContent } from "./components/InstructorContent";
import { OverviewContent } from "./components/OverviewContent";
import {
  buildPreviewLesson,
  getFeatureHighlights,
  getHeroStats,
} from "./lib/utils";

type CourseDetailViewProps = {
  course: CourseDetail;
};

export function CourseDetailView({ course }: CourseDetailViewProps) {
  const [expandedChapters, setExpandedChapters] = useState<string[]>([]);

  useEffect(() => {
    if (!course?.curriculum.length) {
      setExpandedChapters([]);
      return;
    }

    setExpandedChapters([course.curriculum[0].id]);
  }, [course?.id, course?.curriculum]);

  const previewLesson = useMemo(
    () => (course ? buildPreviewLesson(course) : null),
    [course],
  );

  const heroStats = getHeroStats(course);
  const featureHighlights = getFeatureHighlights(course);

  const allChaptersExpanded =
    expandedChapters.length > 0 &&
    expandedChapters.length === course.curriculum.length;

  const toggleAllChapters = () => {
    setExpandedChapters(
      allChaptersExpanded ? [] : course.curriculum.map((chapter) => chapter.id),
    );
  };

  return (
    <main dir="rtl" className="min-h-screen bg-white text-[#1F2525]">
      <div className="mx-auto w-full max-w-[1240px] px-4 py-8 sm:px-6 lg:px-8 lg:py-12">
        <CourseHero
          course={course}
          heroStats={heroStats}
          previewLesson={previewLesson}
        />

        <section className="mt-8 overflow-hidden rounded-[22px] border border-[#E8E8E3] bg-white shadow-[0_16px_44px_rgba(31,37,37,0.04)]">
          <div className="grid divide-y divide-[#E8E8E3] sm:grid-cols-2 sm:divide-x sm:divide-y-0 lg:grid-cols-4">
            {featureHighlights.map((item) => (
              <FeaturePill key={item.title} {...item} />
            ))}
          </div>
        </section>

        <section
          id="curriculum"
          className="mt-8 rounded-[22px] border border-[#E8E8E3] bg-white pb-8 p-5 shadow-[0_24px_60px_rgba(31,37,37,0.05)] sm:p-7"
        >
          <Tabs defaultValue="overview" className="gap-0" dir="rtl">
            <CourseTabs />

            <TabsContent value="overview">
              <OverviewContent course={course} />
            </TabsContent>

            <TabsContent value="curriculum">
              <CurriculumContent
                course={course}
                expandedChapters={expandedChapters}
                allChaptersExpanded={allChaptersExpanded}
                onToggleChapter={setExpandedChapters}
                onToggleAllChapters={toggleAllChapters}
              />
            </TabsContent>

            <TabsContent value="instructor">
              <InstructorContent course={course} />
            </TabsContent>
          </Tabs>
        </section>
      </div>
    </main>
  );
}
