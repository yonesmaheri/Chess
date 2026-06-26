import { apiClient } from "@/shared/api";
import type {
  CourseDetail,
  ListCoursesParams,
  ListCoursesResponse,
} from "./types";

export const coursesService = {
  async list(params: ListCoursesParams = {}) {
    const { data } = await apiClient.get<ListCoursesResponse>("/courses", {
      params,
    });

    return data;
  },

  async getByIdOrSlug(idOrSlug: string) {
    const { data } = await apiClient.get<CourseDetail>(`/courses/${idOrSlug}`);

    return data;
  },
};
