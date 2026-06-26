import type {
  CourseDetail,
  CourseLevel,
  CourseSortOption,
  ListCoursesParams,
  ListCoursesResponse,
} from "./types";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL ?? "http://localhost:3002";

type CoursesErrorPayload = {
  message?: string;
};

export class CoursesServerError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "CoursesServerError";
  }
}

function appendParam(
  searchParams: URLSearchParams,
  key: string,
  value: string | number | undefined,
) {
  if (value === undefined || value === "") {
    return;
  }

  searchParams.set(key, String(value));
}

function buildCoursesQuery(params: ListCoursesParams = {}) {
  const searchParams = new URLSearchParams();

  appendParam(searchParams, "page", params.page);
  appendParam(searchParams, "limit", params.limit);
  appendParam(searchParams, "search", params.search?.trim());
  appendParam(searchParams, "level", params.level);
  appendParam(searchParams, "category", params.category);
  appendParam(searchParams, "sort", params.sort);

  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

async function buildCoursesError(response: Response, fallbackMessage: string) {
  let message = fallbackMessage;

  try {
    const data = (await response.json()) as CoursesErrorPayload;
    if (data.message) {
      message = data.message;
    }
  } catch {
    // Ignore invalid JSON error bodies and use the fallback message.
  }

  return new CoursesServerError(message, response.status);
}

export async function getServerCourses(
  params: ListCoursesParams = {},
): Promise<ListCoursesResponse> {
  const response = await fetch(
    `${API_BASE_URL}/courses${buildCoursesQuery(params)}`,
    {
      headers: {
        accept: "application/json",
      },
      cache: "no-store",
    },
  );

  if (!response.ok) {
    throw await buildCoursesError(
      response,
      "بارگذاری فهرست دوره‌ها با مشکل روبه‌رو شد.",
    );
  }

  return (await response.json()) as ListCoursesResponse;
}

export async function getServerCourseByIdOrSlug(
  idOrSlug: string,
): Promise<CourseDetail> {
  const response = await fetch(`${API_BASE_URL}/courses/${idOrSlug}`, {
    headers: {
      accept: "application/json",
    },
    cache: "no-store",
  });

  if (!response.ok) {
    throw await buildCoursesError(
      response,
      "بارگذاری جزئیات این دوره با مشکل روبه‌رو شد.",
    );
  }

  return (await response.json()) as CourseDetail;
}

export type { CourseLevel, CourseSortOption };
