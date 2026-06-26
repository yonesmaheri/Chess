import { CoursesPageFeature } from "@/features/courses";
import {
  getServerCourses,
  type CourseLevel,
  type CourseSortOption,
  type ListCoursesParams,
  type ListCoursesResponse,
} from "@/shared/api/services/courses";
import {
  categoryOptions,
  levelOptions,
  sortOptions,
} from "@/features/courses/lib/constants";

type SearchParams = Record<string, string | string[] | undefined>;

type CoursesPageProps = {
  searchParams: Promise<SearchParams>;
};

type CoursesPageFilters = {
  page: number;
  search: string;
  level: CourseLevel | "";
  category: (typeof categoryOptions)[number]["value"] | "";
  sort: CourseSortOption;
};

const LEVEL_VALUES = new Set(levelOptions.map((option) => option.value));
const CATEGORY_VALUES = new Set(categoryOptions.map((option) => option.value));
const SORT_VALUES = new Set(sortOptions.map((option) => option.value));

function getSingleValue(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value;
}

function parsePositiveInt(value: string | undefined, fallback: number) {
  const parsed = Number(value);
  return Number.isInteger(parsed) && parsed > 0 ? parsed : fallback;
}

function parseCoursesFilters(searchParams: SearchParams): CoursesPageFilters {
  const search = getSingleValue(searchParams.search)?.trim() ?? "";
  const levelValue = getSingleValue(searchParams.level);
  const categoryValue = getSingleValue(searchParams.category);
  const sortValue = getSingleValue(searchParams.sort);

  return {
    page: parsePositiveInt(getSingleValue(searchParams.page), 1),
    search,
    level: levelValue && LEVEL_VALUES.has(levelValue as CourseLevel)
      ? (levelValue as CourseLevel)
      : "",
    category:
      categoryValue &&
      CATEGORY_VALUES.has(
        categoryValue as (typeof categoryOptions)[number]["value"],
      )
        ? (categoryValue as (typeof categoryOptions)[number]["value"])
        : "",
    sort:
      sortValue && SORT_VALUES.has(sortValue as CourseSortOption)
        ? (sortValue as CourseSortOption)
        : "newest",
  };
}

function buildListCoursesParams(
  filters: CoursesPageFilters,
): ListCoursesParams {
  return {
    page: filters.page,
    limit: 6,
    search: filters.search || undefined,
    level: filters.level || undefined,
    category: filters.category || undefined,
    sort: filters.sort,
  };
}

export default async function CoursesPage({ searchParams }: CoursesPageProps) {
  const filters = parseCoursesFilters(await searchParams);

  let data: ListCoursesResponse | null = null;
  let errorMessage: string | null = null;

  try {
    data = await getServerCourses(buildListCoursesParams(filters));
  } catch (error) {
    errorMessage =
      error instanceof Error
        ? error.message
        : "بارگذاری فهرست دوره‌ها با مشکل روبه‌رو شد.";
  }

  return (
    <CoursesPageFeature
      initialFilters={filters}
      initialData={data}
      initialErrorMessage={errorMessage}
    />
  );
}
