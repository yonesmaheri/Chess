"use client";

import TopHeader from "./components/topHeader/TopHeader";
import ProfileCard from "./components/profileCard/ProfileCard";
import StatisticsSection from "./components/statistics/StatisticsSection";
import RatingChart from "./components/charts/RatingChart";
import SkillRadar from "./components/charts/SkillRadar";
import ActivityList from "./components/activityList/ActivityList";
import LearningPath from "./components/learningPath/LearningPath";
import GoalCard from "./components/learningPath/GoalCard";

export default function DashboardPage() {
  return (
    <div className="flex h-dvh w-full flex-row gap-8 overflow-hidden">
      <div className="min-w-0 w-full flex-1 overflow-y-auto">
        <div>
          <TopHeader />

          <ProfileCard />

          <div className="mt-8">
            <StatisticsSection />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mt-8">
            <div className="lg:col-span-2 flex flex-col gap-8">
              <RatingChart />

              <SkillRadar />
            </div>

            <ActivityList />
          </div>

          <div className="lg:hidden grid grid-cols-1 md:grid-cols-2 gap-8 mt-8 mb-8">
            <LearningPath />
            <GoalCard />
          </div>

          <div className="h-12" />
        </div>
      </div>

      <div className="hidden h-dvh lg:flex w-fit bg-white border-l border-r border-[#e7e9e8] flex-col gap-8 overflow-y-auto shrink-0  px-8">
        <div className="pt-8">
          <LearningPath />
        </div>
        <div className="pb-8">
          <GoalCard />
        </div>
      </div>
    </div>
  );
}
